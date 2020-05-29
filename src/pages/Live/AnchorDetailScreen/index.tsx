/**
 * 主播详情
 */
import * as React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  PanResponder,
} from 'react-native';
import {PrimaryText, SmallText, T3, scale} from 'react-native-normalization-text';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import AnorchDetailAvatar from './AnorchDetailAvatar';
import LiveTabPage from './LiveTabPage';
import ShopTabPage from './ShopTabPage';
import {Colors} from '../../../constants/Theme';
import withPage from '../../../components/HOCs/withPage';
import {vw} from '../../../utils/metric';
import ScrollableTab from '../../../components/ScrollableTab';
import FollowButton from '../../../components/FollowButton';
import {pad} from '../../../constants/Layout';
import {apiAnchorParticular} from '../../../service/api';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {EMPTY_OBJ, EMPTY_ARR} from '../../../constants/freeze';
import {useDispatch} from 'react-redux';
import {apiAttentionAnchor} from '../../../service/api';
import { Attention, AttentionParams } from '../../../liveTypes';
import {isSucceed} from '../../../utils/fetchTools';
import {Toast} from '../../../components/Toast';
import { updateLivingInfo } from '../../../actions/live';
import images from '../../../assets/images';
import { shortNum } from '../../../utils/numeric';

const AnchorDetail = (props: any) =>  {
  const bgUrl = 'https://goss.veer.com/creative/vcg/veer/800water/veer-302989341.jpg';
  const route = useRoute();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId) || ''
  const isFollowed = useSelector((state: any) => state?.live?.livingInfo?.isAttention);
  const [anchorDetail, setAnchorDetail]: [any, any] = React.useState(EMPTY_OBJ); // 主播详情
  const [liveList, setLiveList]: [any, any] = React.useState(EMPTY_ARR); // 主播tab
  const PAGE_SIZE = 14;
  const {anchorId, hideFollowButton} = route?.params

  /**
   * 点击关注按钮
   */
  const onFollowPress = (isFollowed: boolean) => {
    console.log(isFollowed, 'isFollow');
    const params = {
      anchorId: anchorId,
      attentionType: !isFollowed ? AttentionParams.attention : AttentionParams.cancelAttention, // 1：关注；2：取关
      userId: userId,
    }

    apiAttentionAnchor(params)
      .then((res: any) => {
        if (isSucceed(res)) {
          Toast.show(isFollowed ? '取消关注成功' : '关注成功')
          const isAttention = isFollowed ? Attention.notAttention : Attention.isAttention;
          dispatch(updateLivingInfo({isAttention}));

          // 发送关注消息
          // if (!isFollowed) {
          //   dispatch(sendRoomMessage({text: '关注了主播', type: MessageType.follow}))
          // }
          return;
        }
        Toast.show(isFollowed ? '取消关注失败' : '关注失败')
      })
      .catch((error: any) => console.log(`apiAttentionAnchor: ${error}`))
  }

  React.useEffect(() => {
    const params = {
      anchorId,
      pageNo: 1,
      pageSize: PAGE_SIZE,
      userId
    }

    apiAnchorParticular(params)
      .then((res: any) => {
        setAnchorDetail(res?.data);
        setLiveList(res?.data?.liveList?.records)
      })
      .catch(console.warn);
  }, []);

  return (
    <View
      style={StyleSheet.flatten([styles.wrapper, {marginBottom: props.safeBottom}])}
    >
      <View style={styles.headerBlcokWrapper}>
        <View style={styles.headerWrapper}>
          <Image style={styles.headerBg} source={images.anchorDetail} resizeMode="cover" resizeMethod="resize" />
          <AnorchDetailAvatar
            isLiving={anchorDetail?.liveStatus === 2}
            onPress={() => {}}
            style={{marginTop: 36}}
            source={anchorDetail?.anchorLogo}
          />
          <T3 style={styles.nickName}>{anchorDetail?.anchorName || '主播'}</T3>
          <View style={styles.row}>
            <PrimaryText style={styles.anchorInfo}>粉丝: {shortNum(anchorDetail?.fansNum) || 0}</PrimaryText>
            <View style={styles.strip} />
            <PrimaryText style={styles.anchorInfo}>直播: {anchorDetail?.liveNum || 0}</PrimaryText>
          </View>
          {
            !hideFollowButton && 
            <FollowButton
              isFollowed={isFollowed === Attention.isAttention}
              onPress={onFollowPress}
              style={{paddingHorizontal: 40, marginTop: pad}}
              size={{width: 200, height: 26}}
            />
          }
        </View>
      </View>
      <ScrollableTabView
        initialPage={0}
        tabBarActiveTextColor="#000"
        tabBarUnderlineStyle={{
          backgroundColor: Colors.basicColor,
          width: 50,
          alignSelf: 'center',
          left: vw(25) - 25,
        }}
        renderTabBar={(props) => {
          return (
            <ScrollableTab {...props} />
          )
        }}
      >
        <LiveTabPage
          tabLabel="直播"
          isLiving={anchorDetail?.liveStatus === 2}
          // trailers={trailers}
          liveRecords={liveList}
          anchorId={anchorId}
          userId={userId}
        />
        <ShopTabPage
          tabLabel="店铺"
          anchorId={anchorId}
        />
      </ScrollableTabView>
    </View>
  )
};

AnchorDetail.defaultProps = {
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBlcokWrapper: {
    height: vw(75),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  nickName: {
    color: '#fff',
    marginTop: pad,
  },
  anchorInfo: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center'
  },
  strip: {
    width: 1,
    height: '80%',
    backgroundColor: '#fff',
    marginHorizontal: pad * 1.5
  }
});

export default withPage(AnchorDetail, {
  navBackOptions: {
    navBackTheme: 'light'
  }
});