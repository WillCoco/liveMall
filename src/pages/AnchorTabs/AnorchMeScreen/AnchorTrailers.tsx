/**
 * 我的预告
 */
import * as React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {PrimaryText, SmallText, T2} from 'react-native-normalization-text';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LiveWindow from '../../../components/LiveWindow';
import withPage from '../../../components/HOCs/withPage';
import NavBar from '../../../components/NavBar';
import PagingList from '../../../components/PagingList';
import images from '../../../assets/images';
import {pad} from '../../../constants/Layout';
import {Colors} from '../../../constants/Theme';
import { getAdvanceList, updateLivingInfo } from '../../../actions/live';
import { clearLiveRoom } from '../../../actions/im';
import pxToDp from '../../../utils/px2dp';
import {EMPTY_OBJ} from '../../../constants/freeze';
import { MediaType } from '../../../liveTypes';
import share, { ShareType } from '../../../utils/share';

const ROW_HEIGHT = pxToDp(300);
const INIT_PAGE_NO = 1;
const PAGE_SIZE = 10;

const TrailersCard = (props: {
  img: any,
  remind: boolean,
  title: string,
  liveTime: string,
  onSharePress: () => void,
  onRemindPress: () => void
  onPress: () => void
}) => {
    const {navigate} = useNavigation();

    return (
    <TouchableOpacity
      style={{flexDirection: 'row', width: pxToDp(690), borderRadius: pxToDp(pad * 2), overflow: 'hidden', backgroundColor: Colors.whiteColor, marginLeft: pxToDp(pad * 3), marginTop: (pad * 3)}}
      onPress={props.onPress}
    >
      <Image source={props.img} style={styles.trailersCover} />
      <View style={styles.trailersDetail}>
        <PrimaryText color="emphasis" style={styles.liveTitle} numberOfLines={2}>{props.title}</PrimaryText>
        <T2 color="grey" style={styles.liveTime}>{props.liveTime}</T2>
        <View style={{width: pxToDp(360), marginTop: pxToDp(50), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: pxToDp(180)}}>
            <TouchableOpacity onPress={props.onSharePress} style={styles.operationButton}>
              <Image source={images.iconShare} style={styles.shareImg} />
              <T2 style={styles.buttonText} color="grey">分享</T2>
            </TouchableOpacity>
            {/*<TouchableOpacity onPress={props.onRemindPress} style={styles.operationButton}>*/}
              {/*<Image source={props.remind ? images.iconHasRemind : images.iconRemind} style={styles.remindImg} />*/}
              {/*<T2 style={styles.buttonText} color="grey">{props.remind ? '已提醒' : '开播提醒'}</T2>*/}
            {/*</TouchableOpacity>*/}
          </View>
          <Text style={styles.punctuality} onPress={() => navigate('CreateLiveScreen')}>准时开播</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const AnchorTrailers = () =>  {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();

  /**
   * 邀请码
   */
  const inviteCode = useSelector((state: any) => state?.userData?.userInfo?.inviteCode);

  const trailersList = [
    {
      remind: false,
      img: images.liveCover,
      title: '我就知道你想看杨迪和薇娅互黑薇娅互黑薇娅互黑薇娅',
      liveTime: '开播时间：2020年1月13日19:00'
    },
    {
      remind: false,
      img: images.liveCover,
      title: '我就知道你想看杨迪和薇娅互黑薇娅互黑薇娅互黑薇娅',
      liveTime: '开播时间：2020年1月13日19:00'
    },
  ];

  /**
   * 点击分享按钮
   */
  const onSharePress = (item) => {
    share({
      liveId: item?.liveId,
      groupId: item?.groupID,
      inviteCode
    }, {
      title: '分享',
      failOnCancel: false,
    })
      .then((res) => { console.log(res) })
      .catch((err) => { err && console.log(err); });  
  };

  /**
   * 点击开播提醒
   */
  const onRemindPress = (remind: boolean, index: number) => {
    console.log('提醒flag：', remind)
    console.log('索引：', index)
    if(!remind) {
      trailersList[index].remind = true
    }else {
      trailersList[index].remind = false
    }
  }

  /**
   * 刷新
   */
  const onRefresh = async () => {
    const trailersList: any = await dispatch(getAdvanceList({
      pageNo: INIT_PAGE_NO,
      pageSize: PAGE_SIZE,
    })) || EMPTY_OBJ;

    console.log(trailersList, 'trailersList')

    return Promise.resolve({result: trailersList});
  }

  /**
   * 更多
   */
  const onEndReached = async (pageNo: number, pageSize: number) => {
    const trailersList: any = await dispatch(getAdvanceList({
      pageSize,
      pageNo,
    }));

    console.log(trailersList, '更多');
    const result = Promise.resolve({result: trailersList});

    return result;
  }

  return (
    <View style={styles.style}>
      <NavBar
        leftTheme="light"
        title="我的预告"
        titleStyle={styles.navTitle}
        style={styles.nav}
      />
      <PagingList
        size={14}
        // initListData={warehouseGoods}
        renderItem={({item, index}: any) => {
          const {
            smallPic,
            title,
            liveTime,
            liveId,
            anchorId,
            anchorLogo
          } = item || EMPTY_OBJ;
          return (
            <TrailersCard
              key={`_${index}`}
              img={smallPic ? {uri: smallPic} : null} // todo预告默认
              title={title}
              remind={item.remind}
              liveTime={liveTime}
              onSharePress={() => onSharePress(item)}
              onRemindPress={() => onRemindPress(item.remind, index)}
              onPress={() => {
                dispatch(clearLiveRoom());

                navigate('LivingRoomScreen', {
                  mediaType: MediaType.teaser,
                  liveId,
                  anchorId,
                  liveTime
                });
              }
              }
            />
          )
        }}
        getItemLayout={(data: any, index: number) => (
          {length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index}
        )}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        keyExtractor={(item: any, index: number) => 'index' + index + item}
        initialNumToRender={14}
        numColumns={1}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        contentContainerStyle={styles.pagingListWrapper}
      />
    </View>
  )
};

AnchorTrailers.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
  },
  nav: {
    backgroundColor: Colors.basicColor,
  },
  navTitle: {
    color: '#fff',
  },
  myTrailersPage: {

  },
  trailersCover: {
    width: pxToDp(300),
    height: pxToDp(300),
    marginRight: pad
  },
  trailersDetail: {
    flex: 1,
    paddingTop: pxToDp(pad * 3),
    paddingBottom: pxToDp(pad * 3),
    paddingRight: pxToDp(pad * 2)
  },
  liveTitle: {
    fontSize: pxToDp(30),
    width: pxToDp(360)
  },
  liveTime: {
    width: pxToDp(360),
    marginTop: pxToDp(pad * 2),
    fontSize: pxToDp(20)
  },
  operationButton: {
    flex: 1
  },
  shareImg: {
    width: pxToDp(40),
    height: pxToDp(34),
    marginBottom: pxToDp(pad)
  },
  buttonText: {
    fontSize: pxToDp(20),
  },
  remindImg: {
    width: pxToDp(34),
    height: pxToDp(38),
    marginBottom: pxToDp(8),
    marginLeft: pxToDp(23)
  },
  punctuality: {
    width: pxToDp(160),
    height: pxToDp(62),
    fontSize: pxToDp(26),
    fontWeight: 'bold',
    borderRadius: pxToDp(31),
    backgroundColor: Colors.basicColor,
    color: Colors.whiteColor,
    lineHeight: pxToDp(62),
    textAlign: 'center',
    overflow: 'hidden'
  },

});

export default withPage(AnchorTrailers, {
  statusBarOptions: {
    backgroundColor: 'transparent'
  }
});