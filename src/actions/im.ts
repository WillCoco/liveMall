import {getUniqueId} from 'react-native-device-info';
import imActionType from '../constants/im';
import liveActionType from '../constants/Live';
import timModlue from '../helpers/tim'; //LibGenerateTestUserSig
import {
  Dispatch,
} from 'redux';
import {RoomType, MessageType, RoomMessageType} from '../reducers/im';
import Toast from 'react-native-tiny-toast';
import {store} from '../store';
import {safeParse} from '../utils/saftyFn';
import {updateLivingStatus, updateLivingInfo} from './live';
import {clearLoginStatus} from './user';
import { Attention } from '../liveTypes';
import * as api from '../service/api';
import { isSucceed } from '../utils/fetchTools';

const {tim, TIM,/*  getUserSig: getUserSigLocal */} = timModlue;

// console.log(userSig, 'userss2')
// console.log(store, 'store')

tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);

function onMessageReceived(event: any) {
  // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
  // event.name - TIM.EVENT.MESSAGE_RECEIVED
  // event.data - 存储 Message 对象的数组 - [Message]
  console.log(event.data, '接收到的数据', TIM.TYPES.MSG_CUSTOM);
  const length = event?.data?.length;
  let message
  for (let i = 0; i < length; i++) {
    // Message 实例的详细数据结构请参考 Message
    // 其中 type 和 payload 属性需要重点关注
    // 从v2.6.0起，AVChatRoom 内的群聊消息，进群退群等群提示消息，增加了 nick（昵称） 和 avatar（头像URL） 属性，便于接入侧做体验更好的展示
    // 前提您需要先调用 updateMyProfile 设置自己的 nick（昵称） 和 avatar（头像URL），请参考 updateMyProfile 接口的说明
    message = event.data[i]
    switch (message.type) {
      case TIM.TYPES.MSG_TEXT:
        // 收到了文本消息
        handleTextMsg(message);
        break;
      case TIM.TYPES.MSG_CUSTOM:
        store.dispatch(handleCustomMsg(message))
        // 收到了自定义消息
        break;
      case TIM.TYPES.MSG_GRP_TIP:
        // 收到了群提示消息，如成员进群、群成员退群
        store.dispatch(handleRoomInfoMsg(message));
        break;
      case TIM.TYPES.MSG_GRP_SYS_NOTICE:
        // 收到了群系统通知，通过 REST API 在群组中发送的系统通知请参考 在群组中发送系统通知 API
        store.dispatch(handleSysMsg(message));
        break;
      default:
         break;
    }

    function handleTextMsg(message: any) {
      console.log(message.data)
      console.log(message, 'messagemessage')
    }
  };
}

/**
 * 自定义消息
 */
function handleCustomMsg(message: any) {
  return function(dispatch: Dispatch<any>, getState: any) {
    const roomMessages = getState().im?.roomMessages;
    const {data, description, extension} = message?.payload || {};
    console.log(roomMessages, 'roomMessages');

    const msgData = safeParse(data);
    const type = msgData?.type;

    const newRoomMessage = {
      data: safeParse(data),
      description,
      extension
    }

    // 更新观看次数
    // if (type === MessageType.enter) {
      // dispatch(addLivingWatchNum());
    // }

    dispatch(updateMessage2Store(newRoomMessage))
  }
}

/**
 * 接收到修改群信息等房间消息
 */
function handleRoomInfoMsg(message: any) {
  return function(dispatch: Dispatch<any>, getState: any) {
    const {operationType, groupProfile, newGroupProfile, memberNum} = message?.payload || {};
    const {groupID} = groupProfile || {};
    const {notification} = newGroupProfile || {};
    

    // 不是所在的room 不处理
    if (groupID !== getState().im?.room?.groupID) {
      return;
    }

    console.log(message?.payload, '1292282828');

    if (operationType === TIM.TYPES.GRP_TIP_GRP_PROFILE_UPDATED) {
      // 群信息修改
      // 更新公告气泡
      const oldRoomInfo = getState().im?.room;
      const newRoomInfo = {...oldRoomInfo, notification};
      dispatch(updateRoom(newRoomInfo));
    } else if (operationType === TIM.TYPES.GRP_TIP_MBR_JOIN) {
      // 加群
      const {memberNum} = message?.payload || {};
      // 更新群人数
      dispatch(updateRoomMemberNum(memberNum));
    } else if (operationType === TIM.TYPES.GRP_TIP_MBR_QUIT) {
      // 退群
      const {memberNum} = message?.payload || {};
      // 更新群人数
      dispatch(updateRoomMemberNum(memberNum));
    }
  }
}

/**
 * 接收到系统消息
 */
function handleSysMsg(message: any) {
  return function(dispatch: Dispatch<any>, getState: any) {
    const {groupID} = message?.payload?.groupProfile || {};
    const {operationType, userDefinedField} = message?.payload || {};

    // 不是所在的room 不处理
    if (groupID !== getState().im?.room?.groupID) {
      return;
    }

    // 群组被解散
    if (operationType === 5) {
      // 设置直播状态, 显示结束页
      dispatch(updateLivingStatus(true));
      
      // 清空房间相关数据
      dispatch(clearLiveRoom());
    }

    // 自定义
    if (operationType === 255) {
      const msgData = safeParse(userDefinedField);
      console.log(msgData, 'msgData?.typemsgData?.typemsgData?.type');
      console.log(msgData?.type, 'msgData?.typemsgData?.typemsgData?.type');

      // 主播被下线, 冻结账号
      if (msgData?.type === '1') {
        // store.dispatch(updateAnchorLivingStatus(true));

        const myAnchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id

        const livingAnchorId = getState()?.live?.livingInfo.anchorId; // 在播id

        // 我是本场主播
        if (myAnchorId === livingAnchorId) {
          // 清除登录状态、退出登录
          dispatch(clearLoginStatus());
          dispatch(clearLiveRoom('ANCHOR'));
          dispatch(updateLivingInfo());
        }
        //  观众稍后在收到结束直播时处理
      }
    }
  }
}

const onReadyHandler = function (event: any) {
  // SDK ready 后接入侧才可以调用 sendMessage 等需要鉴权的接口，否则会提示失败！
  // event.name - TIM.EVENT.SDK_READY
  console.log(event, 'onReadyHandler');
}

tim.on(TIM.EVENT.SDK_READY, onReadyHandler);

/**
 * 获取im userSig
 */
export const getUserSig = (userId: string) => {
  return async function(dispatch: Dispatch, getState: any) {
    // const stateUserSig = getState()?.im?.userSig;
    // return getUserSigLocal(userID)
    return api.apiGetUserSig({userId})
      .then(r => {
        // console.log(r, '11111')
        if (isSucceed(r)) {
          dispatch(updateUserStatus({userId, userSig: r?.data}));
          return Promise.resolve(r?.data);
        }
        dispatch(updateUserStatus({userId}));
        return Promise.resolve();
      })
      .catch(err => {console.log('getUserSig', err)})
  }
}

/**
 * 登录im
 */
export function login() {
  return async function(dispatch: Dispatch<any>, getState: any) {
    const userId = getState()?.im?.userId || getUniqueId();
    const userSig = await dispatch(getUserSig(userId));
    console.log(userId, '设备唯一表示1')
    console.log(userSig, 'userSig');

    // alert(userSig)
    if (!userSig) {
      return;
    }

    tim.login({userID: userId, userSig})
      .then(function(imResponse: any) {
        if (imResponse?.actionStatus === 'OK') {
          dispatch(updateUserStatus({isOnLine: true})); // tinyID
        }
        dispatch(updateUserStatus({isOnLine: false})); // tinyID
        console.log(imResponse.data, 'loginIm'); // 登录成功
      })
      .catch(function(imError: any) {
        console.warn('login error:', imError); // 登录失败的相关信息
      });
  }
}

/**
 * 退出im登录
 */
export const logout = () => {
  return function(dispatch: Dispatch<any>, getState: any) {
    tim.logout()
      .then(function(imResponse: any) {
        console.log(imResponse.data); // 登出成功
      })
      .catch(function(imError: any) {
        console.warn('logout error:', imError);
      });
  }
}

/**
 * 创建房间(需要包含直播和回放类型的)
 * 现走服务端创建
 */
export const createGroup = (params: {
  roomName: string
}) => {
  return async function(dispatch: Dispatch<any>, getState: any) {

    const groupList: any = await dispatch(getGroupList) || [];
    if (groupList && groupList.forEach) {
      groupList.forEach((d: any) => {
        console.log('关闭直播见', d.groupID)
        dispatch(dismissGroup(d.groupID));
      })
    }

    return tim.createGroup({
      type: TIM.TYPES.GRP_AVCHATROOM,
      name: params.roomName,
    })
      .then(async function(imResponse: any) {
        console.log(imResponse.data, '创建成功'); // 创建成功
        const room = imResponse?.data?.group
        console.log(room, 'roomroomroomroom')
        if (room) {
          const r = await dispatch(joinGroup({groupID: room.groupID}));

          if (r) {
            dispatch(updateRoom(room));
          }
          // 还要加入
        } else {
          Toast.show('创建群聊失败')
        }

        // dispatch(getGroupList())
      })
      .catch(function(imError: any) {
        console.warn('createGroup:', imError);
      });
  }
}

/**
 * 解散房间
 * 现调用关闭接口时服务端解散
 */
export const dismissGroup = (id?: string) => {
  return function(dispatch: Dispatch<any>, getState: any) {
    const groupID = id || getState().im?.room?.groupID;

    tim.dismissGroup(groupID)
      .then(async function(imResponse: any) {
        const groupID = imResponse?.data?.groupID;
        if (groupID) {
          console.log(imResponse.data, 'dismissGroup'); // 登出成功
          // 清除store
          dispatch(clearLiveRoom('ANCHOR'));

          return Promise.resolve(true);
        }
      })
      .catch(function(imError: any) {
        console.warn('dismissGroup error:', imError);
      });
  }
}

/**
 * 进入房间
 */
export const joinGroup = (
  params: {groupID: string,},
  options: {shoudSendMsg?: boolean,} = {shoudSendMsg: true}
): any => {
  return async function (dispatch: Dispatch<any>): Promise<boolean> {
    return tim.joinGroup({
      groupID: params?.groupID,
      type: TIM.TYPES.GRP_AVCHATROOM
    })
      .then((r: any) => {
        console.log(r, 'rrr3');
        switch (r?.data?.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
            break;
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
            console.log(r.data.group, '加群成功'); // 加入的群组资料

            // 更新所在房间信息
            dispatch(updateRoom(r?.data?.group));

            // 发送进入消息
            if (options.shoudSendMsg) {
              dispatch(sendRoomMessage({text: '进入直播间', type: MessageType.enter}));
            }
            return Promise.resolve(true);
          case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
            dispatch(updateRoom({groupID: params.groupID}));
            return Promise.resolve(true);
          default:
            break;
        };

        // 更新store
        // dispatch(updateRoom({groupID: params.groupID}));
        return Promise.resolve(false)
      })
      .catch((err: any) => {
        console.log('joinGroup_err:', err)
        return Promise.resolve(false)
      })
  }
}

/**
 * 退出房间
 */
export const quitGroup = (groupId: string) => {
  return function(dispatch: Dispatch<any>, getState: any) {
    const groupID = groupId || getState().im?.room?.groupID;

    tim.quitGroup(groupID)
      .then(function(imResponse: any) {
        console.log(imResponse.data, 'quitGroup'); // 登出成功
        // 离开消息
        dispatch(sendRoomMessage({text: '离开直播间', type: MessageType.leave}));

        // 清空房间相关数据
        dispatch(clearLiveRoom('AUDIENCE'));
      })
      .catch(function(imError: any) {
        console.log('logout error:', imError);
      });
  }
}

/**
 * 发送消息
 */
interface SendMessageParams {
  to?: string,
  text: string,
  type: MessageType
}
export const sendRoomMessage = (msgInfo: SendMessageParams) => {
  return function(dispatch: Dispatch<any>, getState: any) {
    const payload: any = dispatch(
      makeMsg({
        type: msgInfo.type,
        text: msgInfo.text,
      })
    );

    const groupID = getState()?.im?.room?.groupID;
    let message = tim.createCustomMessage({
      to: msgInfo.to || groupID,
      conversationType: TIM.TYPES.CONV_GROUP,
      // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
      // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
      // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
      payload,
    });

    console.log(message.payload, 'message1');
    console.log(payload, 'payload');

    tim.sendMessage(message)
      .then(function(imResponse: any) {
        // 发送成功
        console.log(imResponse, '发送成功');

        // 自己不会收到消息,本地同步消息
        const newRoomMessage = {
          ...payload,
          data: safeParse(payload.data)
        }

        console.log(newRoomMessage, 'aaanewRoomMessage')

        dispatch(updateMessage2Store(newRoomMessage));
      }).catch(function(imError: any) {
        if (imError.code === 10017) {
          Toast.show('您已被禁言');
        } else {
          Toast.show('发言失败');
        }
        // 发送失败
        console.warn('sendMessage error:', imError);
      });
  }
}

/**
 * 修改群信息
 */
interface updateGroupProfileParams {
  groupID?: string, // 群id
  name?: string, // 群名称
  muteAllMembers?: boolean, // 全体禁言
  introduction?: string, // 修改群公告(气泡)
  notification: string,
}
export const updateGroupProfile = (params: updateGroupProfileParams) => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    const options: any = {
      groupID: params.groupID || getState()?.live?.livingInfo?.groupId,
    }
    if (params.name != undefined) {options.name = params.name};
    if (params.muteAllMembers != undefined) {options.name = params.muteAllMembers};
    if (params.introduction != undefined) {options.name = params.introduction};
    if (params.notification != undefined) {options.notification = params.notification};

    tim.updateGroupProfile(options)
      .then(function(imResponse: any) {
        console.log(imResponse, 'updateGroupProfile'); // 登出成功
        if (imResponse?.data) {
          // Toast.show('更新成功')
          return;
        }
        Toast.show('更新失败')
      })
      .catch(function(imError: any) {
        Toast.show('更新失败')
        console.warn('logout error:', imError);
      });
  }
}

/**x
 * 获取群信息
 */
interface getGroupProfileParams {
  groupID?: string, // 群id
}
export const getGroupProfile = (params: getGroupProfileParams) => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    const options: any = {
      groupID: params?.groupID || getState()?.im?.room?.groupID
    }

    console.log(options, 'options')
    
    return tim.getGroupProfile(options)
      .then(function(imResponse: any) {
        console.log(imResponse?.data?.memberNum, 'updateGroupProfile'); // 获取群信息
        if (imResponse?.data) {
          // Toast.show('更新成功')
          // dispatch(updateRoom(room))
          return Promise.resolve(imResponse?.data);
        }
      })
      .catch(function(imError: any) {
        console.warn('getGroupProfile error:', imError);
      });
  }
}

/**
 * 构造消息
 */
interface RoomMessage {
  data: string,
  description: string,
  extension: string,
}

function makeMsg({type, text}: {
  type: MessageType,
  text: any,
}) {
  return function(dispatch: Dispatch<any>, getState: any): RoomMessage {
    const userId = getUniqueId();
    const userInfo = getState().userData?.userInfo;
    const userName = userInfo?.nickName;
    const userAvatar = userInfo?.userAvatar;
    const isFollowed = getState()?.live?.livingInfo?.isAttention === Attention.isAttention;

    const dataString = JSON.stringify({
      text,
      userName: userName || '游客',
      userAvatar,
      userId,
      isFollowed,
      type
    })

    return {
      data: dataString,
      description: "",
      extension: "",
    }
  }
}

/**
 * 获取room成员列表信息
 */
// getGroupMemberList

/**
 * 获取getGroupList
 */
export const getGroupList = () => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    return tim.getGroupList() // 这个是获取我的群组
      .then(function(imResponse: any) {
        console.log(imResponse.data, 'getGroupList'); // getGroupList

        const groupList = imResponse?.data?.groupList;
        dispatch(updateRooms(groupList));

        // imResponse?.data?.groupList.forEach((d) => {
        //   console.log(d, 'xxxxxxx')
        //   dispatch(dismissGroup(d.groupID));
        // })

        return Promise.resolve(groupList);
      })
      .catch(function(imError: any) {
        console.warn('logout error:', imError);
      });
  }
}


// getGroupMemberProfile

/**
 * 设置room成员禁言
 */
export const setGroupMemberMuteTime = (params: {
  groupID?: string,
  userID: string,
  muteTime?: number // 禁言设为0，则表示取消禁言
}) => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    if (!params.groupID) {
      params.groupID = getState()?.im?.room?.groupID;
    }

    if (params.muteTime === undefined) {
      params.muteTime = 3600 * 24 * 3; // 默认三天
    }

    console.log(params.muteTime, 'params.muteTime')
    
    tim.setGroupMemberMuteTime({
      userID: params.userID,
      groupID: params.groupID,
      muteTime: params.muteTime, 
    })
      .then(function(imResponse: any) {
        console.log(imResponse.data, '设置room成员禁言'); // 登出成功
        Toast.show('设置成功')
      })
      .catch(function(imError: any) {
        Toast.show('设置失败')
        console.warn('logout error:', imError);
      });
  }
}

/**
 * 查询room成员信息(是否禁言)
 */
export const getGroupMemberProfile = (params: {
  groupID?: string,
  userID: string,
}) => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    if (!params.groupID) {
      const groupID = getState()?.im?.room?.groupID;
      params.groupID = groupID;
    }

    console.log(params.groupID, 'groupIDgroupIDgroupIDgroupID')

    const userIDList = [params.userID];

    return tim.getGroupMemberProfile({
      groupID: params.groupID,
      userIDList,
    })
      .then(function(imResponse: any) {
        console.log(imResponse.data, '查询room成员禁言');
        const [userInfo] = imResponse?.data?.memberList || [];
        return Promise.resolve(userInfo)
      })
      .catch(function(imError: any) {
        console.warn('logout error:', imError);
      });
  }
}


/**
 * 收到 SDK 发生错误通知
 */
tim.on(TIM.EVENT.ERROR, function(event: any) {
  // event.name - TIM.EVENT.ERROR
  // event.data.code - 错误码
  // event.data.message - 错误信息
});

/**
 * 收到被踢下线通知
 */
tim.on(TIM.EVENT.KICKED_OUT, function(event: any) {
  // event.name - TIM.EVENT.KICKED_OUT
  // event.data.type - 被踢下线的原因，例如 :
  //   - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
  //   - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
  //   - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢（v2.4.0起支持）。
});

/**
 * 更新im sdk状态
 */
export function updateIMSdkStatus(isReady: boolean) {
  return {type: imActionType.UPDATE_IM_SDK_READY_STATUS, payload: {isReady}}
}

/**
 * 更新用户登录状态
 */
interface paramsType {isOnLine?: boolean, userSig?: string, userId?: string};
export function updateUserStatus(params: paramsType) {
  const payload: paramsType = {};
  params.isOnLine && (payload.isOnLine = params.isOnLine);
  params.userId && (payload.userId = params.userId);
  params.userSig && (payload.userSig = params.userSig);

  return {type: imActionType.UPDATE_USER_IM_STATUS, payload}
}

/* reducers */

/**
 * 更新房间列表信息
 */
export function updateRooms(rooms?: Array<RoomType>) {
  return {type: imActionType.UPDATE_ROOMS, payload: {rooms}}
}

/**
 * 更新当前所在房间
 */
export function updateRoom(room?: RoomType) {
  return {type: imActionType.UPDATE_ROOM_INFO, payload: {room}}
}

/**
 * 新增一条房间消息
 */
export function addRoomMessage(message: RoomMessageType) {
  return async function(dispatch: Dispatch<any>, getState: any) {
    const roomMessages = getState().im?.roomMessages;
    const newRoomMessages = roomMessages ? [...roomMessages, message] : [message]

    // console.log(newRoomMessages, '新增一条房间消息')
    dispatch(updateRoomMessage(newRoomMessages));
  }
}

/**
 * 新增一条滚动消息
 */
export function addScrollMessage(message: RoomMessageType) {
  return async function(dispatch: Dispatch<any>, getState: any) {
    const orderMessages = getState().im?.orderMessages;
    const newRoomMessages = orderMessages ? [...orderMessages, message] : [message]

    dispatch(updateScrollMessage(newRoomMessages));
  }
}

/**
 * 出列一条滚动消息
 */
export function popScrollMessage() {
  return async function(dispatch: Dispatch<any>, getState: any) {
    const orderMessages = getState().im?.orderMessages;
    const newRoomMessages = orderMessages.splice(1) || [];

    console.log(orderMessages, 'orderMessages')

    dispatch(updateScrollMessage(newRoomMessages));
  }
}

/**
 * 更新房间观看次数
 */
// export function addLivingWatchNum() {
//   return function(dispatch: Dispatch<any>, getState: any) {
//     let watchNum = getState()?.live?.livingInfo?.watchNum || 0;
//     dispatch({type: liveActionType.UPDATE_LIVING_INFO, payload: {livingInfo: {watchNum: ++watchNum}}})
//   }
// }

/**
 * 更新房间成员数量
 */
export function updateRoomMemberNum(memberNum: number) {
  return function(dispatch: Dispatch<any>, getState: any) {
    const roomMemberNum = Math.max(memberNum - 1, 0)
    dispatch({type: imActionType.UPDATE_ROOM_MEMBER_NUM, payload: {roomMemberNum}})
  }
}

/**
 * 更新房间消息
 */
export function updateRoomMessage(roomMessages: Array<RoomMessageType>) {
  return {type: imActionType.UPDATE_ROOM_MESSAGES, payload: {roomMessages}}
}

/**
 * 更新滚动消息
 */
export function updateScrollMessage(orderMessages: Array<RoomMessageType>) {
  return {type: imActionType.UPDATE_ORDER_MESSAGES, payload: {orderMessages}}
}

/**
 * 更新类型消息到对应store
 */
function updateMessage2Store(newRoomMessage: RoomMessageType) {
  return function(dispatch: Dispatch<any>, getState: any) {
    const type = newRoomMessage?.data?.type;

    // 聊天消息
    if (
      type === MessageType.roomMessage ||
      type === MessageType.enter ||
      type === MessageType.leave
    ) {
      dispatch(addRoomMessage(newRoomMessage));
      return;
    };

    // 购买、关注消息
    if (
      type === MessageType.order ||
      type === MessageType.follow
    ) {
      dispatch(addScrollMessage(newRoomMessage));
      return;
    };
  }
}

/**
 * 退出直播清除系列数据
 */
export function clearLiveRoom(role?: 'ANCHOR' | 'AUDIENCE') {
  return function(dispatch: Dispatch<any>, getState: any) {
    // 清空房间消息
    dispatch(updateRoomMessage([]));
    // 清空im房间信息
    dispatch(updateRoom());
    // 清空成员数量
    dispatch(updateRoomMemberNum(0));
    // 清除滚动消息
    dispatch(updateScrollMessage([]));

    // 清除livinginfo信息
    dispatch(updateLivingInfo());
    
    if (role === 'ANCHOR') {

    } else if (role === 'AUDIENCE') {

    } else {

    }
  }
}