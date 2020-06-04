/**
 * 回放
 */
import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  LayoutAnimation,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import VideoPlayer from '../VideoPlayer';
// import VideoPlayer from 'react-native-video-controls';
import { useDispatch, useSelector } from "react-redux";
import LiveIntro from "../LiveIntro";
import LivingBottomBlock from "../LivingBottomBlock";
import Iconcloselight from "../Iconfont/Iconcloselight";
import { pad } from "../../constants/Layout";
import defaultImages from "../../assets/default-image";
import { MediaType } from "../../liveTypes";
import AudienceShopCard from "../LivingShopCard/AudienceShopCard";
import { vw, vh } from "../../utils/metric";
import { PrimaryText } from "react-native-normalization-text";
import { apiEnterLive } from '../../service/api';
import { updateLivingInfo } from '../../actions/live';
import withPage from '../HOCs/withPage';
import { Colors } from '../../constants/Theme';
import { isSucceed } from '../../utils/fetchTools';
import { EMPTY_OBJ } from '../../constants/freeze';
import Poller from '../../utils/poller';
import { getLiveViewNum } from '../../actions/live';

interface LiveVideoProps {
  style?: StyleProp<any>;
  liveData?: any;
  safeTop: number;
}

interface LiveWindowParams {
  liveId: string | number, // 直播id
  groupID: string, // im群组
  mediaType: MediaType, // 媒体类型
  anchorId: string,
  // mediaSource: string, // 拉流地址、 video
}

const LiveVideo = (props: LiveVideoProps): any => {
  const { goBack, replace } = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute() || EMPTY_OBJ;

  const {
    liveId,
    anchorId
  } : LiveWindowParams = (route.params || EMPTY_OBJ) as LiveWindowParams;

  // 用户id
  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId) || '';

  // 回放uri
  const backUrl = useSelector((state: any) => state?.live?.livingInfo?.backRtmp) || '';

  /**
   * 轮询器
   */
  const poller = React.useRef(new Poller({
    interval: 1000 * 10,
    initExec: false,
    callback: () => dispatch(getLiveViewNum({liveId})),
  }));

  /**
   * 进入回放
   */
  React.useEffect(() => {
    // 获取回放信息
    const params = {
      liveId,
      userId,
    }

    apiEnterLive(params)
      .then((res: any) => {
        if (isSucceed(res)) {
          console.log(res, '进入列表');
          // res.watchNum = res.watchNum -1; // 这里重新会重复加人数
          dispatch(updateLivingInfo({...res?.data, liveId, anchorId}))
        }
      })
      .catch((error: any) => console.log(`apiEnterLive:` + error))

    // 请求观看人数
    poller.current.start();

    return () => {
      poller.current.stop();
    }
  }, []);

  /**
   * 播放器状态
   */
  const [playerStatus, setPlayerStatus]: [
    undefined | boolean,
    any
  ] = React.useState(undefined);

  const onPlayerStatus = (status: number | string) => {
    console.log(status, "status");
    setPlayerStatus(status);
  };

  /**
   * 播放器示例
   */
  const player: { current: any } = React.createRef();

  /**
   * 退出直播
   */
  const closeLive = () => {
    // player.current?.stop(); // 停止播放器实例
    goBack();
  };

  /**
   * 商品卡可见
   */
  const [shopCardVisible, setShopCardVisible]: [
    boolean | undefined,
    any
  ] = React.useState();

  /**
   * 卡片动画
   */
  const shopCardAnim = (visiable: boolean) => {
    Keyboard.dismiss();
    LayoutAnimation.configureNext({
      duration: 200,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.2,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    // LayoutAnimation.spring();
    setShopCardVisible(visiable);
  };

  const smallPic = useSelector((state: any) => state?.live?.livingInfo?.smallPic);

  // bigPic返回不对
  const bgUri = smallPic ? {uri: smallPic} : defaultImages.livingBg

  // video实例
  const video: any = React.useRef();

  React.useEffect(() => {

    return () => {
      try {
        video.current.stop();
      } catch(err) {}
    }
  }, [])


  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
      <Image
        source={bgUri}
        resizeMode="cover"
        style={styles.imgBg}
      />
      {
        backUrl ? (
          <VideoPlayer
            ref={r => video.current = r}
            source={{uri: backUrl}} // Can be a URL or a local file.
            repeat
            // fullscreen
            disableBack
            disableVolume
            // disableSeekbar
            disableFullscreen
            resizeMode="cover"
            style={styles.video}
            // controlsWrapper={{marginBottom: 50}}
            seekbarWrapper={{marginBottom: 65}}
            seekColor={Colors.basicColor}
            seekBallColor="#fff"
            bottomControlGroupStyle={{marginBottom: 0, height: 24}}
          />
        ) : null
      }
      <View style={styles.livingBottomBlock}>
        <LivingBottomBlock.AudienceRecord onPressShopBag={() => shopCardAnim(true)} />
      </View>
      <LiveIntro
        showFollowButton
      />
      <TouchableOpacity
        onPress={closeLive}
        style={StyleSheet.flatten([
          styles.close,
          { top: props.safeTop + pad * 2 },
        ])}
      >
        <Iconcloselight size={24} />
      </TouchableOpacity>
      <AudienceShopCard
        visible={!!shopCardVisible}
        onPressClose={() => shopCardAnim(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  livingBottomBlock: {
    flex: -1,
    position: "absolute",
    height: 68,
    left: 0,
    bottom: 0,
    right: 0,
  },
  scrollerWrapper: {},
  contentWrapper: {
    justifyContent: "flex-end",
  },
  close: {
    position: "absolute",
    right: pad * 1.5,
  },
  imgBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: vh(100),
    minWidth: vw(100),
  },
});

export default withPage(LiveVideo);
