/**
 * 直播首页轮播
 */
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import PagingList from '../../../components/PagingList';
import ScrollableTab from '../../../components/ScrollableTab';
import LiveSummaryBlock from '../../../components/LiveSummaryBlock';
import {pad} from '../../../constants/Layout';
import {Colors} from '../../../constants/Theme';
import {vw} from '../../../utils/metric';
import {getGroupList} from '../../../actions/im';
import {useDispatch} from 'react-redux';
import {apiGetLiveStreamList} from '../../../service/api';
import {useSelector} from 'react-redux';
import images from '../../../assets/images';
import {PrimaryText} from 'react-native-normalization-text'
import pxToDp from '../../../utils/px2dp';
import { EMPTY_ARR, EMPTY_OBJ } from '../../../constants/freeze';
import { isSucceed } from '../../../utils/fetchTools';
import {useIsFocused} from '@react-navigation/native';

interface LiveBannerProps {
  style?: StyleProp<any>,
  imageStyle?: StyleProp<any>,
}

const LiveBanner = (props: LiveBannerProps) : any =>  {

  const userId = useSelector(state => state?.userData?.userInfo?.userId) || ''
  const isFocused = useIsFocused()
  const [followList, setFollowList]: [Array<any>, any] = React.useState([]) // 关注列表
  const [selectList, setSelectlist]: [Array<any>, any] = React.useState([]) // 精选列表
  const isLogin = useSelector(state => state?.userData?.isLogin) || false // 未登录不显示关注列表

  const mockList = [
    {
      anchorId: 123,
      anchorLogo: '',
      anchorName: '1234',
      isAdvance: '1', // string 是否有预告（1：有；2：没有）
      isBack: '1', // string 是否有回放（1：有；2：没有）
      likeSum: 200,	// string 点赞数量
      liveId: 234213,	// integer($int64)直播间id
      livePic: 'https://goss.veer.com/creative/vcg/veer/800water/veer-302989341.jpg', // string 直播封面
      liveStatus: '1',	// string 直播状态（1：预告；2：直播中；3：回放）
      liveTitle: '1234',	// string 直播标题
      viewsNum: '999', // 	string观看人数
    }
  ]

  const renderItem = (d: any) => {
    return (
      <LiveSummaryBlock
        liveInfo={d.item}
      />
    )
  }

  /**
   * 从直播间返回刷新数据
   */
  React.useEffect(() => {
    if (isFocused) {
      onRefresh('1', true)
      onRefresh('2', true)
    }
  }, [isFocused])

  /**
   * 切换tab
   */
  const changeTab = (e: any) => {
    console.log(e.i);
  }

  /**
   * 刷新
   * @param type 类型 1-精选 2-关注
   * @param backFresh 返回时是否刷新
   */
  const onRefresh = async (type: string, backFresh: boolean) => {
    const result = await apiGetLiveStreamList({
      liveType: type,
      page: 1,
      pageSize: 20,
      userId
    })
    .catch((r: any) => {console.log(r, 'LiveStreamList')});

    if (isSucceed(result)) {
      if (backFresh) {
        type === '1' ? setSelectlist(result?.data?.records || EMPTY_ARR) : setFollowList(result?.data?.records || EMPTY_ARR)
      }
      return Promise.resolve({result: result?.data?.records || EMPTY_ARR});
    }

    if (backFresh) {
      type === '1' ? setSelectlist(result?.data?.records || EMPTY_ARR) : setFollowList(result?.data?.records || EMPTY_ARR)
    }
    return Promise.resolve({result: EMPTY_ARR});
  };

  /**
   * 更多
   */
  const onEndReached = async (page: number, pageSize: number, type: string) => {
    const result = await apiGetLiveStreamList({
      liveType: type,
      pageSize,
      page,
      userId,
    })
    .catch((r: any) => {console.log(r, 'LiveStreamList')});

    if (isSucceed(result)) {
      return Promise.resolve({result: result?.data?.records || EMPTY_ARR});
      // type === '1' ? setSelectlist(result?.data?.records || EMPTY_ARR) : setFollowList(result?.data?.records || EMPTY_ARR)
    }
    return Promise.resolve({result: EMPTY_ARR});
    // type === '1' ? setSelectlist(EMPTY_ARR) : setFollowList(EMPTY_ARR)
  };

  return (
    <View
      style={StyleSheet.flatten([styles.wrapper, props.style])}
    >
      {
        isLogin 
        &&
        <ScrollableTabView
          initialPage={1}
          tabBarTextStyle={{
          }}
          tabBarUnderlineStyle={{
            backgroundColor: Colors.basicColor,
            width: 50,
            alignSelf: 'center',
            left: vw(25) - 25,
          }}
          tabBarActiveTextColor="#000"
          onChangeTab={changeTab}
        >
          <PagingList
            tabLabel={"关注"}
            size={14}
            data={followList}
            setData={setFollowList}
            //item显示的布局
            renderItem={(renderItem)}
            //下拉刷新相关
            onRefresh={() => onRefresh('2')}
            //加载更多
            onEndReached={(page, size) => onEndReached(page, size, '2')}
            // ItemSeparatorComponent={separator}
            keyExtractor={(item, index) => 'index' + index + item}
            initialNumToRender={14}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            style={{borderTopWidth: 4, borderColor: Colors.pageGreyBg}}
            contentContainerStyle={{paddingHorizontal: pad}}
          />
          <PagingList
            tabLabel={"精选"}
            size={14}
            data={selectList}
            setData={setSelectlist}
            //item显示的布局
            renderItem={renderItem}
            //下拉刷新相关
            onRefresh={() => onRefresh('1')}
            //加载更多
            onEndReached={(page, size) => onEndReached(page, size, '1')}
            // ItemSeparatorComponent={separator}
            keyExtractor={(item, index) => 'index' + index + item}
            initialNumToRender={14}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            style={{borderTopWidth: 4, borderColor: Colors.pageGreyBg}}
            contentContainerStyle={{paddingHorizontal: pad}}
          />
        </ScrollableTabView>
        ||
        <View style={{ flex: 1}}>
          <View style={styles.selectorTitle}>
            <PrimaryText style={{textAlign: 'center', fontWeight: 'bold',}}>精选</PrimaryText>
          </View>
          <PagingList
            size={14}
            //item显示的布局
            renderItem={renderItem}
            //下拉刷新相关
            onRefresh={() => onRefresh('1')}
            //加载更多
            onEndReached={(page, size) => onEndReached(page, size, '1')}
            // ItemSeparatorComponent={separator}
            keyExtractor={(item, index) => 'index' + index + item}
            initialNumToRender={14}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            style={{borderTopWidth: 4, borderColor: Colors.pageGreyBg}}
            contentContainerStyle={{paddingHorizontal: pad}}
          />
        </View>
      }
      
    </View>
  )
};

LiveBanner.defaultProps = {
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopWidth: 4,
    borderColor: Colors.pageGreyBg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectorTitle: { // 精选列表标题
    width: pxToDp(100),
    height: pxToDp(100),
    marginLeft: pad * 2,
    borderBottomWidth: 4,
    borderBottomColor: Colors.basicColor,
    justifyContent: 'center',
  }
});

export default LiveBanner;