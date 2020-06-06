/**
 * 直播tab
 */
import * as React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {PrimaryText, SmallText, T4, scale} from 'react-native-normalization-text';
import { useNavigation, useRoute, useNavigationState } from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import LiveRecord from './LiveRecord';
import {Colors} from '../../../constants/Theme';
import {pad, radio} from '../../../constants/Layout';
import Iconbacklight from '../../../components/Iconfont/Iconbacklight';
import {vw} from '../../../utils/metric';
import CountDown from '../../../components/CountDown';
import moment from 'moment'
import { Toast } from '../../../components/Toast';
import PagingList from '../../../components/PagingList';
import {apiAnchorParticular} from '../../../service/api';
import { isSucceed } from '../../../utils/fetchTools';
import { EMPTY_OBJ, EMPTY_ARR } from '../../../constants/freeze';
import { clearLiveRoom } from '../../../actions/im';
import { shortNum } from '../../../utils/numeric';
import easyNavigate from '../../../utils/easyNavigate';
import { useSelector } from 'react-redux';

const Row = (props: {
  title: string,
  typeText: string,
  subText: any,
  showDivider?: boolean,
  countDown?: boolean,
  time?: number,
  onPress?: (v?: any) => void
}) => {
  const renderCell = (value: number | string, unit: string) => {
    return (
      <View style={styles.cellWrapper}>
        <SmallText>{value}</SmallText>
        <SmallText>{unit}</SmallText>
      </View>
    )
  }

  const onStop = () => {
    Toast.show('开播时间到啦')
  }

  console.log(props?.time, 'ttttttt')

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.rowWrapper, props.showDivider && styles.divider])}
      onPress={props.onPress}
    >
      <PrimaryText>{props.title}</PrimaryText>
      <View style={StyleSheet.flatten([styles.rowLine2])}>
        <SmallText style={styles.typeText}>{props.typeText}</SmallText>
        {
          props?.countDown 
          && 
          <CountDown
            deadline={props?.time.valueOf()}
            onStop={onStop}
            renderTime={(seconds) => {
              const durationDay = moment.duration(seconds, 'seconds')
              const d = Math.floor(durationDay.asDays()) || 0;
              let restSeconds = seconds - (d * 24 * 3600);
              const durationHour = moment.duration(restSeconds, 'seconds')
              const h = Math.floor(durationHour.asHours()) || 0;
              restSeconds = restSeconds - (h * 3600);
              const durationMinuts = moment.duration(restSeconds, 'seconds')
              const m = Math.floor(durationMinuts.asMinutes()) || 0;
              restSeconds = restSeconds - (m * 60);
              const durationSeconds = moment.duration(restSeconds, 'seconds')
              const s = Math.floor(durationSeconds.asSeconds()) || '0';

              return (
                <View style={styles.renderTimeWrapper}>
                  {renderCell(d, '天')}
                  {renderCell(h, '小时')}
                  {renderCell(m, '分')}
                  {renderCell(s, '秒')}
                  <SmallText> 开播</SmallText>
                </View>
              )
            }}
          />
          || <SmallText style={styles.subText}>{props.subText}</SmallText>
        }
      </View>
    </TouchableOpacity>
  )
}


Row.defaultProps = {
  title: '[标题] 内容',
  typeText: '类型',
  subText: '文字内容',
}

const PAGE_SIZE = 14

const LiveTabPage = (props: {
  isLiving: boolean,
  trailers?: any[],
  liveRecords: any[],
  tabLabel?: string,
  userId: string | number,
  anchorId: string | number
}) =>  {
  const navigation = useNavigation();
  const {navigate, goBack} = navigation;
  const dispatch = useDispatch();
  const selfAnchorId = useSelector((state: any) => state?.anchorData?.anchorInfo?.anchorId) || '';

  const routes = useNavigationState(state => state.routes);

  /**
   * 下拉刷新
   */
  const onRefresh = async () => {
    const params = {
      anchorId: props?.anchorId,
      userId: props?.userId,
      pageNo: 1,
      pageSize: PAGE_SIZE,
    };

    const result = await apiAnchorParticular(params).catch(console.warn);

    if (isSucceed(result)) {
      // 增加精彩回放标题
      result?.data?.liveList?.records.some((item: any, index: number) => {
        if(item.liveStatus === '3') {
          result?.data?.liveList?.records.splice(index, 0, {liveStatus: '4'})
          return true
        }
      })
      return Promise.resolve({result: result?.data?.liveList?.records || EMPTY_ARR});
    }

    return Promise.resolve({result: EMPTY_ARR})
  }

  /**
   * 上拉
   */
  const onEndReached = async (pageNo: number, pageSize: number) => {
    const params = {
      anchorId: props?.anchorId,
      userId: props?.userId,
      pageNo: pageNo,
      pageSize: pageSize,
    };

    const result = await apiAnchorParticular(params).catch(console.warn);

    if (isSucceed(result)) {
      return Promise.resolve({result: result?.data?.liveList?.records || EMPTY_ARR});
    }

    return Promise.resolve({result: EMPTY_ARR})
  };

  /**
   * 点击直播中
   */
  const goLive = (item: any) => {
    const lastRouteName = routes[routes.length - 2].name;
    if (item?.anchorId === selfAnchorId) {
      // 如果主播查看自己直播间 则返回
      goBack();
    } else if (lastRouteName === 'AnorchLivingRoomScreen') {
      // 如果从主播直播进入
      goBack();
    } else if (lastRouteName === 'LivingRoomScreen') {
      // 如果从观看直播进入
      goBack();
    } else {
      // 从其他详情页面
      dispatch(clearLiveRoom());
      navigate('LivingRoomScreen', {
        liveId: item?.liveId,
        groupID: item?.groupId || `live${item?.liveId}`,
        anchorId: item?.anchorId,
        mediaType: item?.liveStatus
      })
    }
  }

  /**
   * 点击预告和回放
   */
  const toLiveingRoom = (item: any) => {
    const lastRouteName = routes[routes.length - 2].name;
    console.log(lastRouteName, 'lastRouteNamelastRouteNamelastRouteName')

    if (lastRouteName === 'AnorchLivingRoomScreen') {
      Toast.show('您正在直播');
      // dispatch(clearLiveRoom());
      // 如果从主播直播进入: 干掉主播页面, 并跳转到预告、回放页面
      // easyNavigate('LivingRoomScreen', {
      //   excludeRouteNames: ['AnorchLivingRoomScreen'],
      //   params: {
      //     liveId: item?.liveId,
      //     groupID: item?.groupId || `live${item?.liveId}`,
      //     anchorId: item?.anchorId,
      //     mediaType: item?.liveStatus
      //   }
      // })
    } else {
      // 从其他详情页面
      dispatch(clearLiveRoom());
      navigate('LivingRoomScreen', {
        liveId: item?.liveId,
        groupID: item?.groupId || `live${item?.liveId}`,
        anchorId: item?.anchorId,
        mediaType: item?.liveStatus
      })
    }
  }

  /**
   * 渲染行
   */
  const renderRow = (item: any) => {
    let index
    index = item.index
    item = item.item
    // console.log(item, '主播详情项目')
    if (item.liveStatus === '2') {
      return (
        <Row
          key={`_${index}`}
          title={item.liveTitle}
          typeText="直播中"
          subText={shortNum(item.watchNum) + '观看'}
          showDivider
          onPress={() => goLive(item)}
        />
      )
    } else if (item.liveStatus === '1') {
      return <Row
        key={`item_${index}`}
        title={item?.liveTitle}
        typeText='预告'
        countDown={true}
        time={item?.liveTime}
        showDivider
        onPress={() => toLiveingRoom(item)}
      />
    } else if (item.liveStatus === '3') {
        return (
          <LiveRecord
            img={item?.smallPic}
            title={item?.liveTitle}
            time={(new Date(item?.liveTime)).toLocaleString()}
            viewTimes={shortNum(item?.watchNum) || 0}
            goodsQuantity={item?.liveProductnum || 0}
            key={`item_${index}`}
            onPress={() => toLiveingRoom(item)}
          />
        )
      } else if (item.liveStatus === '4') {
        return (
          <View>
            <T4>精彩回放</T4>
          </View>
        )
      }
    }


  return (
    <View style={styles.style}>
      <PagingList
        // data={props?.liveRecords}
        size={PAGE_SIZE}
        renderItem={(item: any) => renderRow(item)}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        initialNumToRender={PAGE_SIZE}
        numColumns={1}
      />
    </View>
  )
};

LiveTabPage.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopWidth: 4,
    borderColor: Colors.pageGreyBg,
    paddingHorizontal: pad
  },
  rowWrapper: {
    paddingVertical: 9,
    paddingHorizontal: pad,
  },
  rowLine2: {
    flexDirection: 'row',
    marginTop: 4
  },
  typeText: {
    height: 24,
    width: 70,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Colors.basicColor,
    color: '#fff',
    marginRight: 14,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderColor: Colors.divider
  },
  subText: {
  },
  liveRecordsWrapper: {
    padding: pad
  },
  cellWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vauleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: radio,
    marginHorizontal: 3
  },
  renderTimeWrapper: {
    flexDirection: 'row',
    marginTop: pad
  },
});

export default LiveTabPage;
