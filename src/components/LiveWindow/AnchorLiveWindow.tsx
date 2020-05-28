/**
 * 主播直播窗体
 */
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  LayoutAnimation,
  BackHandler,
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux'
import LiveIntro from '../LiveIntro';
import LivingBottomBlock from '../LivingBottomBlock';
import LivePusher from '../LivePusherNew';
import L from '../../constants/Layout';
import Iconcloselight from '../../components/Iconfont/Iconcloselight';
import Iconchangecamera from '../../components/Iconfont/Iconchangecamera';
import NoticeBubble from '../../components/NoticeBubble';
import Mask from '../../components/Mask';
import AnchorShopCard from '../../components/LivingShopCard/AnchorShopCard';
import withPage from '../../components/HOCs/withPage';
import {pad} from '../../constants/Layout';
import { joinGroup, dismissGroup, updateGroupProfile, sendRoomMessage, } from '../../actions/im';
import { anchorToLive, closeLive, updatecamera, updateFaceSetting, faceBeautyParams } from '../../actions/live';
import Toast from 'react-native-tiny-toast';
import { MessageType } from '../../reducers/im';
import LivingFaceCard from '../../components/LivingFaceCard';

import { clearLoginStatus } from '../../actions/user';
import { isSucceed } from '../../utils/fetchTools';
import { EMPTY_OBJ } from '../../constants/freeze';
import share, { ShareType } from '../../utils/share';
import Poller from '../../utils/poller';
import { getLiveViewNum } from '../../actions/live';
import useFixDraw from '../../hooks/useFixDraw';

interface LiveWindowProps {
  style?: StyleProp<any>,
  liveData?: any,
  safeTop: number,
  safeBottom: number,
}

interface LiveWindowParams {
  groupID: string,
  liveId: string,
}

const LiveWindow = (props: LiveWindowProps) : any =>  {
  const {goBack, replace, reset} = useNavigation();
  const route = useRoute();

  const {
    groupID,
    liveId,
  }: LiveWindowParams = (route.params || EMPTY_OBJ) as LiveWindowParams;

  console.log(useNavigation(), 'useNavigation()useNavigation()useNavigation()')
  const dispatch = useDispatch();

  /**
   * 商品卡
   */
  let [maskList, maskDispatch] = React.useContext(Mask.context);

  /**
   * 实例
   */
  let camera: {current: any} = React.useRef();

  /**
   * 推流状态
   */
  const [pusherStatus, setPusherStatus] = React.useState();

  const onStateChange = (status: any) => {
    setPusherStatus(status)
    console.log(status, 'status')
  }

  /**
   * 切换摄像头
   */
  const switchCamera = () => {
    dispatch(updatecamera())
  };

  /**
   * 所在房间信息
   */
  const room = useSelector((state: any) => state?.im?.room);

  /**
   * 所在房间成员数量
   */
  const roomMemberNum = useSelector((state: any) => state?.im?.roomMemberNum);

  /**
   * 邀请码
   */
  const inviteCode = useSelector((state: any) => state?.userData?.userInfo?.inviteCode);

  /**
   * im加群状态
   */
  const [isIMJoinSecceed, setIsIMJoinSecceed]: [undefined|boolean, any] = React.useState(undefined);

  /**
   * 直播结束
   */
  const isAnchorLiveOver = useSelector((state: any) => state?.live?.isAnchorLiveOver);
  

  /**
   * 轮询器
   */
  const poller = React.useRef(new Poller({
    interval: 1000 * 30,
    initExec: false,
    callback: () => dispatch(getLiveViewNum({liveId})),
  }));

  const onConfirmClose = async () => {
    dispatch(closeLive({liveId}))
      .then((data: any) => {
        if (data) {
          replace('AnchorLivingEnd', data);
          return;
        }
        Toast.show('关闭失败');
      })
      .catch((r: any) => console.log('closeLive', r));
    return true;
  }

  /**
   * 退出直播
   */
  const onPressClose = async () => {
    maskDispatch({
      type: Mask.Actions.PUSH,
      payload: {
        type: Mask.ContentTypes.Normal,
        data: {
          text: `有${roomMemberNum}人正在观看你的直播 确认关闭直播吗？`,
          title: '关闭直播间?',
          rightBtnText: '确定',
          onPressRight: onConfirmClose
        }
      }});
  };

  /**
   * 商品卡可见
   */
  const [shopCardVisible,  setShopCardVisible]: [boolean | undefined, any] = React.useState(false);

  /*
  * 美颜功能设置
  * */
  const [faceCardVisible,  setFaceCardVisible]: [boolean | undefined, any] = React.useState(false);

  /**
   *
   */
  React.useEffect(() => {
    // 加群
    dispatch(joinGroup({groupID}, {shoudSendMsg: false}))
      .then((success?: boolean) => {
        setIsIMJoinSecceed(!!success)
      })
      .catch((err: any) => {
        console.log(err, 'err');
        // 找不到指定群组 显示结束
        setIsIMJoinSecceed(false)
      });

    // 获取推流地址
    dispatch(anchorToLive({liveId}))
      .catch((err: any) => {
        console.log(err, 'err');
      });

    // 请求观看人数
    poller.current.start();

    return () => {
    poller.current.stop();
    }
  }, []);

  // React.useEffect(() => {
  //   if (camera.current) {
  //     camera.current.start()
  //   }
  //   // 获取主播推流地址
  //
  //   return () => {
  //     camera.current.stop()
  //   }
  // }, [camera.current])

  /**
   * 公告气泡
   */
  const noticeBubbleText = room?.notification;

  const onPressBubble = () => {
    if (room?.groupID) {
      // 显示输入框
      maskDispatch({
        type: Mask.Actions.PUSH,
        payload: {
          type: Mask.ContentTypes.Prompt,
          data: {
            title: '请输入气泡内容',
            rightBtnText: '确定',
            onPressRight: (v: string) => {
              dispatch(updateGroupProfile({notification: v}));
              return true;
            }
          }
        }});
    }
  }

  /**
   * 卡片动画
   */
  const shopCardAnim = (visiable: boolean) => {
    LayoutAnimation.configureNext({
      duration: 200,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.2,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      }
    });

    // LayoutAnimation.spring();
    setShopCardVisible(visiable)
  }

  /**
   * 美颜动画
   */
  const faceCardAnim = (visiable: boolean) => {
    LayoutAnimation.configureNext({
      duration: 200,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.2,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      }
    });

     setFaceCardVisible(visiable)
  }

  /**
   * 处理android返回
  */
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
          onPressClose()
          return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  // // 美颜设置参数
  // const { pusherConfig } = useSelector((state: any) => state?.live)
  // const {beautyLevel,redden,whiten} = pusherConfig?.faceBeautySetting;

  // 滑块
  const onAfterChangeSetting = (value: number, type:string) => {
      dispatch(updateFaceSetting({type, value}))
  };

  /**
   * 分享
  */
  const onPressShare = () => {
    share({
      liveId,
      groupId: groupID,
      inviteCode
    }, {
      title: '分享',
      failOnCancel: false,
    })
      .then((res) => { console.log(res) })
      .catch((err) => { err && console.log(err); });
  }

  // 期望修复气泡显示
  useFixDraw();

  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
      <LivePusher
        onStateChange={onStateChange}
      />
      {/*  backgroundColor: 'rgba(0,0,0,0.01)' 修复摄像上层气泡边缘显示问题 */}
      <View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.01)', zIndex: 1}}>
        <LiveIntro />
        <LivingBottomBlock.Anchor
          onPressShopBag={() => shopCardAnim(true)}
          onPressBubble={onPressBubble}
          onPressShare={onPressShare}
          onPressFace={() => faceCardAnim(true)}
        />
        <TouchableOpacity onPress={switchCamera} style={StyleSheet.flatten([styles.camera, {top: props.safeTop + (pad * 2)}])}>
          <Iconchangecamera size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressClose} style={StyleSheet.flatten([styles.close, {top: props.safeTop + (pad * 2)}])}>
          <Iconcloselight size={24} />
        </TouchableOpacity>
        {
          !!noticeBubbleText ?
            <NoticeBubble
              text={noticeBubbleText}
              style={styles.noticeBubble}
            /> : null
        }
        <AnchorShopCard
          visible={!!shopCardVisible}
          setVisible={setShopCardVisible}
          onPressClose={() => shopCardAnim(false)}
          safeBottom={props.safeBottom}
        />
        <LivingFaceCard
            visible={!!faceCardVisible}
            setVisible={setFaceCardVisible}
            onPressClose={() => faceCardAnim(false)}
            onAfterChangeSetting={onAfterChangeSetting}
        />
      </View>
    </View>
  )
};


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollerWrapper: {
  },
  contentWrapper: {
    justifyContent: 'flex-end',
  },
  close: {
    position: 'absolute',
    right: pad * 1.5,
  },
  camera: {
    position: 'absolute',
    right: pad * 5.5,
  },
  imgBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }
});

export default withPage(LiveWindow);