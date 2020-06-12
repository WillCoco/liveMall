/**
 * 主播直播预览和开播
 */
import * as React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute, CommonActions, Route} from '@react-navigation/native';
import CreateLiveScreen from './CreateLiveScreen';
import LiveWindow from '../../../components/LiveWindow';
import LivePusher from '../../../components/LivePusherNew';
import withPage from '../../../components/HOCs/withPage';
import { EMPTY_OBJ } from '../../../constants/freeze';
import {Toast} from '../../../components/Toast';
import {startLive, updateStarted} from '../../../actions/live';

const AnchorLivingRoom = (props: any) =>  {
  const route = useRoute()
  const dispatch = useDispatch();

  /**
   * 直播数据
   */
  const [liveInfo, setLiveInfo]: any = React.useState();

  /**
   * 直播商品
   */
  const {goodsIdList} = (route.params || EMPTY_OBJ) as any;

  /**
   * 是否开启直播配置
   */
  const started = useSelector((state: any) => state?.live?.pusherConfig?.started);

  /**
   * 是否显示开播
   */
  const showAnchowWindow = React.useMemo(() => {
    return (
      started &&
      liveInfo?.liveId &&
      liveInfo?.groupId
    )
  }, [started, liveInfo])

  /**
   * 确认开播
   */
  const onStartLive = async (liveInfo: any) => {
    console.log(goodsIdList, '选中要去直播卖的商品');
    const loading = Toast.loading('加载中');

    // 开始直播
    const r = await dispatch(startLive({goodsIdList, cover: liveInfo?.cover, title: liveInfo?.cover})) as any;

    console.log(r, '创建直播');

    Toast.remove(loading);

    if (r) {
      // 重置开播参数
      setLiveInfo({
        liveId: r.liveId,
        groupId: r.groupId,
      });
    }
  }

  console.log(liveInfo, 'liveInfoliveInfoliveInfoliveInfo')

  /**
   * 有liveId\groupId, 开启直播
  */
  React.useEffect(() => {
    console.log(liveInfo?.liveId, 'livinfp12e')

    if (liveInfo?.liveId && liveInfo?.groupId) {
      console.log(liveInfo.liveId, 'liveInfo.liveIdliveInfo.liveIdliveInfo.liveId')
      dispatch(updateStarted(true));
    }
  }, [liveInfo])

  return (
    <View style={styles.style}>
      <LivePusher />
      <View style={styles.maskWrapper}>
        {
          showAnchowWindow ? (
            <LiveWindow.Anchor
              style={styles.livingWrapper}
              safeTop={props.safeTop}
              safeBottom={props.safeBottom}
              groupID={liveInfo.groupId}
              liveId={liveInfo.liveId}
            />
          ) : (
            <CreateLiveScreen
              onPressSubmit={onStartLive}
            />
          )
        }
      </View>
    </View>
  )
};

AnchorLivingRoom.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
  },
  livingWrapper: {
    flex: 1
  },
  maskWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default withPage(AnchorLivingRoom, {
  statusBarOptions: {
    barStyle: 'dark-content',
    backgroundColor: 'transparent',
  },
});