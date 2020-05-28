/**
 * 直播间底部bock业务组件
 */
import * as React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
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
import { shareUrlPerfix } from '../../constants/Urls';
import { ShareType } from '../../utils/share';
import { EMPTY_OBJ, EMPTY_ARR } from '../../constants/freeze';

const BottomBlock = (props: any) : any =>  {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();
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

  /**
   * 邀请码
   */
  const inviteCode = useSelector((state: any) => state?.userData?.userInfo?.inviteCode);

  // 直播房间信息 (退出会现执行外层useEffect, 清除liveID, 用memo保存)
  const liveId = useSelector((state: any) => state?.live?.livingInfo?.liveId);
  const liveIdRef = React.useRef(liveId);
  React.useEffect(() => {
    if (liveId) {
      liveIdRef.current = liveId;
    }
  }, [liveId])

  // const liveIdPersist = React.useMemo(() => {
  //   return liveId
  // }, [])

  // console.log(liveId, 333344)

  // 发送消息
  const sendMessage = (text: string) => {
    dispatch(sendRoomMessage({to: room?.groupID, type: MessageType.roomMessage, text}));
  }
  
  // 喜欢
  const onPressLike = () => {
    if (!isLogin) {
      navigate('Login');
      return;
    }
    
    needSubmit.current = true;
    setLikeQuantity((quantity: number) => ++quantity);
  }
  
  // 提交喜欢
  const submitLike = React.useCallback((quantity: number) => {
    if (needSubmit.current && (likeQuantity > 0 || quantity > 0) && (liveId || liveIdRef.current)) {
      // 提交、返回新值
      const params = {
        liveId: liveId || liveIdRef.current,
        likeNum: quantity || likeQuantity
      }
      apiLiveLike(params)
        .then(res => {
          if (isSucceed(res)) {
            // setLikeQuantity(0);
            likeSumRef.current = 0;
          }
          // 重置
          needSubmit.current = false;
        })
        .catch(error => {
          // 重置
          needSubmit.current = false;
          console.log(`apiLiveLike: ${error}`)
        })
    }
  }, [likeQuantity, needSubmit.current, liveId]);

  /**
   * 轮询器
   */
  const poller = React.useRef(new Poller({
    interval: 1000 * 10,
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
      interval: 1000 * 10,
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
  const onPressForward = () => {
    if (!isLogin) {
      navigate('Login');
      return;
    }

    share({
      liveId,
      groupId: room.groupId,
      inviteCode
    }, {
      title: '分享',
      failOnCancel: false,
    })
      .then((res) => { console.log(res) })
      .catch((err) => { err && console.log(err); });
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


  // 观众
  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
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
      <AudienceLiveToolBar
        likeQuantity={(likeQuantity + likeSum) || 0}
        onPressShopBag={props.onPressShopBag}
        onSubmitEditing={sendMessage}
        onPressLike={onPressLike}
        onPressForward={onPressForward}
        style={{marginTop: 28}}
      />
    </View>
  )
};

BottomBlock.defaultProps = {
};

const styles = StyleSheet.create({
  wrapper: {
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    padding: pad,
    justifyContent: 'flex-end'
  },
});

export default BottomBlock;