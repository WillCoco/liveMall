/**
 * 直播间底部bock业务组件
 */
import * as React from 'react';
import {
  StyleSheet,
  View,
  Keyboard
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import LiveMsg from '../LiveMsg';
import {Audience as AudienceLiveToolBar} from '../LiveToolBar';
import {pad} from '../../constants/Layout';
import {sendRoomMessage} from '../../actions/im';
import {RoomMessageType, MessageType} from '../../reducers/im';
import {apiLiveLike} from '../../service/api';
import Poller from '../../utils/poller';
import { isSucceed } from '../../utils/fetchTools';
import { Attention } from '../../liveTypes';
import share from '../../utils/share';
import { ShareType } from '../../utils/share';
import { EMPTY_OBJ, EMPTY_ARR } from '../../constants/freeze';
import { updateLivingInfo } from '../../actions/live';
import { joinGroup, login } from '../../actions/im';
import { Toast } from '../Toast';

import * as WeChat from 'react-native-wechat-lib'
import { wxUserName } from '../../config/config';

const POLLER_INTERVAL = 1000 * 15;

const BottomBlock = (props: any) : any =>  {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();
  const route = useRoute() || EMPTY_OBJ;

  const {
    groupID,
  } = (route.params || EMPTY_OBJ) as any;

  /**
   * 是否登录
   */
  const isLogin = useSelector((state: any) => state?.userData?.isLogin);

  // 是否有数据未提交
  const needSubmit = React.useRef(false);

  // 本地点击喜欢数量
  const [likeQuantity, setLikeQuantity] = React.useState(0);
    
  // 喜欢数量
  const likeSum = useSelector((state: any) => +state?.live?.livingInfo?.likeSum || 0);
  const likeSumRef = React.useRef(likeSum);

  // im房间消息
  const roomMessages = useSelector((state: any) => state?.im?.roomMessages || EMPTY_ARR);

  // im房间信息
  const room = useSelector((state: any) => state?.im?.room || EMPTY_OBJ);

  // 分享相关参数
  const userAvatar = useSelector((state: any) => state?.userData?.userInfo?.userAvatar);
  const nickName = useSelector((state: any) => state?.userData?.userInfo?.nickName);
  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId);

  /**
   * 邀请码
   */
  const inviteCode = useSelector((state: any) => state?.userData?.userInfo?.inviteCode);

  /**
   * sdk准备好了吗
   */
  const isIMSDKReady = useSelector((state: any) => state?.im?.isIMSDKReady);

  // 直播房间信息 (退出会现执行外层useEffect, 清除liveID, 用memo保存)
  const liveId = useSelector((state: any) => state?.live?.livingInfo?.liveId);
  const liveIdRef = React.useRef(liveId);
  React.useEffect(() => {
    if (liveId) {
      liveIdRef.current = liveId;
    }
  }, [liveId])

  // 发送消息
  const sendMessage = (text: string) => {
    dispatch(sendRoomMessage({to: room?.groupID, type: MessageType.roomMessage, text}));
  }
  
  // 喜欢
  const onPressLike = () => {
    setLikeQuantity((quantity: number) => ++quantity);
  }
  
  // 提交喜欢
  const submitLike = React.useCallback((quantity: number) => {
    if ((liveId || liveIdRef.current)) {
      // 提交、返回新值
      const params = {
        liveId: liveId || liveIdRef.current,
        likeNum: quantity || likeQuantity || 0
      }
      apiLiveLike(params)
        .then(res => {
          console.log(res, '提交&查询喜欢')
          if (isSucceed(res)) {
            setLikeQuantity(0);
            likeSumRef.current = 0;
            if (res?.data) {
              dispatch(updateLivingInfo({likeSum: res?.data}))
            }
          }
        })
        .catch(error => {
          console.log(`apiLiveLike: `, error)
        })
    }
  }, [likeQuantity, liveId]);

  /**
   * 轮询器
   */
  const poller = React.useRef(new Poller({
    interval: POLLER_INTERVAL,
    initExec: false,
    callback: submitLike,
  }));

  React.useEffect(() => {
    if (poller.current) {
      poller.current.stop();
    }
    // 更新ref
    likeSumRef.current = likeQuantity;

    // 更新poller
    poller.current = new Poller({
      interval: POLLER_INTERVAL,
      initExec: false,
      callback: submitLike,
    });

    poller.current.start();
    
    return () => {
      /**
       * 页面退出提交点赞
       */
      poller.current.stop();
    }
  }, [likeQuantity]);

  /**
   * 分享
   */
  const onPressForward = async () => {
    if (!isLogin) {
      navigate('Login');
      return;
    }

    const wxIsInstalled = await WeChat.isWXAppInstalled()

    if (wxIsInstalled) {
      WeChat.shareMiniProgram({
        scene: 0,
        userName: wxUserName,
        title: `${nickName}正在直播，快来围观`,
        webpageUrl: 'https://www.quanpinlive.com',
        thumbImageUrl: userAvatar,
        path: `pages/watch-live/index?invicode=${inviteCode}&liveId=${liveId}&shareUserId=${userId}`
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    } else {
      Toast.fail('请先下载安装微信')
    }

    // share({
    //   liveId,
    //   groupId: room.groupId,
    //   inviteCode
    // }, {
    //   title: '分享',
    //   failOnCancel: false,
    // })
    //   .then((res) => { console.log(res) })
    //   .catch((err) => { err && console.log(err); });
  }

  /**
   * 退出提交
   */
  React.useEffect(() => {
    return () => {
      if (likeSumRef.current) {
        submitLike(likeSumRef.current)
      }
    }
  }, [])

  const view: any = React.useRef();

  /**
   * 重新登录聊天 
   */
  const onPressLoginIm = async() => {
    const isLoginSuccsee = await dispatch(login());
    console.log(isLoginSuccsee, 'isLoginSuccsee');
    if (!isLoginSuccsee) {
      Toast.show('登录失败');
      return
    }
    const joinGroupRes = await dispatch(joinGroup({groupID}));
    if (joinGroupRes) {
      Toast.show('登录成功');
    }
  }

  // 观众
  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}
      ref={c => view.current = c}
    >
      {
        props.showLiveMsg ? (
        <LiveMsg
          msgList={roomMessages}
          msgAdapter={(msg: RoomMessageType): any => {
            const {data} = msg || {};
            const {userName, text, userId, type, isFollowed} = data || {};
            return {
              name: userName,
              id: userId,
              text,
              type,
              isFollowed, // todo: 和主播是否关注
            }
          }}
        />
        ) : null
      }
      <AudienceLiveToolBar
        likeQuantity={(likeQuantity + likeSum) || 0}
        goodsQuantity={0} // todo
        onPressShopBag={props.onPressShopBag}
        onSubmitEditing={sendMessage}
        onPressLike={onPressLike}
        onPressForward={onPressForward}
        value={props.textValue}
        setValue={props.setTextValue}
        style={{marginTop: 28}}
        showLogin={!isIMSDKReady}
        onPressLoginIm={onPressLoginIm}
      />
    </View>
  )
};

BottomBlock.defaultProps = {
  showLiveMsg: true
};

const styles = StyleSheet.create({
  wrapper: {
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    padding: pad,
    justifyContent: 'flex-end',
    // backgroundColor: 'red'
  },
});

export default BottomBlock;