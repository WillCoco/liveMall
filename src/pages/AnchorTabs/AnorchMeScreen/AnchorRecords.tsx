/**
 * 直播记录
 * AnchorRecords
 */
/**
 * @Author: lyh
 * @Date: 2020/5/13
 * @Last Modified by: lyh
 * @Last Modified time: 2020/5/13
 **/
// import * as React from 'react';
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
  PermissionsAndroid,
  Linking,
  Platform,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {PrimaryText, SmallText, T1} from 'react-native-normalization-text';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import withPage from '../../../components/HOCs/withPage';
import NavBar from '../../../components/NavBar';
import images from '../../../assets/images';
import {pad} from '../../../constants/Layout';
import {Colors} from '../../../constants/Theme';
import pxToDp from '../../../utils/px2dp';
import {apiGetLiveList} from '../../../service/api';
import {connect} from 'react-redux';
import PagingList from '../../../components/PagingList';
import share, {ShareType} from '../../../utils/share';
import usePermissions from '../../../hooks/usePermissions';
import RNFS from 'react-native-fs';
import {Toast, Portal} from '@ant-design/react-native';
import {EMPTY_ARR, EMPTY_OBJ} from '../../../constants/freeze';
import {isSucceed} from '../../../utils/fetchTools';
import { updateLivingInfo } from '../../../actions/live';
import { clearLiveRoom } from '../../../actions/im';

const RecordsCard = (props: {
  smallPic: any;
  title: string;
  watchNum: number; // 观看次数
  liveGoodsNum: number; // 直播商品
  goodsNum: number; // 销售商品总量
  addFavourite: number; // 增粉
  moneyNum: number; // 销售额
  startTime: string;
  rtmpPath: string;
  onPress: () => void;
  onSharePress: () => void;
  onDownloadPress: () => void;
}) => {
  return (
    <View
      style={{
        width: pxToDp(690),
        borderRadius: pxToDp(24),
        backgroundColor: '#fff',
        marginLeft: pxToDp(pad * 3),
        marginTop: pxToDp(pad * 4),
        flexDirection: 'row',
        overflow: 'hidden',
      }}>
      <TouchableOpacity onPress={props.onPress} style={styles.liveDetail}>
        <Image source={{uri: props.smallPic}} style={styles.coverImg} />
        <Image source={images.iconPlay} style={styles.livePlayIcon} />
      </TouchableOpacity>
      <View style={styles.recordsDetail}>
        <TouchableOpacity onPress={props.onPress} style={styles.detail}>
          <PrimaryText
            color="emphasis"
            style={styles.liveTitle}
            numberOfLines={2}>
            {props.title}
          </PrimaryText>
          <View
            style={{
              flexDirection: 'row',
              width: pxToDp(360),
              marginTop: pxToDp(pad),
              alignItems: 'center',
            }}>
            <SmallText color="grey" style={styles.listItem} numberOfLines={2}>
              {props.watchNum || 0}次观看 丨 {props.liveGoodsNum}件商品 | 卖出
              {props.goodsNum}件 | 销售额 {props.moneyNum} | 增粉{' '}
              {props.addFavourite}
            </SmallText>
          </View>
          <SmallText color="grey" style={styles.liveTime}>
            {props.startTime}
          </SmallText>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            width: pxToDp(360),
            marginTop: pxToDp(pad * 2),
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={props.onSharePress}
            style={{
              flexDirection: 'row',
              width: pxToDp(115),
              alignItems: 'center',
            }}>
            <Image source={images.iconShare} style={styles.shareImg} />
            <T1 style={styles.operationButton} color="grey">
              分享
            </T1>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={props.onDownloadPress}
            style={{
              flexDirection: 'row',
              width: pxToDp(115),
              alignItems: 'center',
            }}>
            <Image source={images.iconDownload} style={styles.downloadImg} />
            <T1 color="grey" style={styles.operationButton}>
              下载
            </T1>
          </TouchableOpacity>
          <SmallText style={styles.status} onPress={props.onPress}>
            回放
          </SmallText>
        </View>
      </View>
    </View>
  );
};

const AnchorRecords = (props) => {
  const {anchorInfo = {}} = props;
  const [liveList, setLiveList] = useState([]);
  const dispatch = useDispatch();

  const {navigate} = useNavigation();

  /**
   * 邀请码
   */
  const inviteCode = useSelector(
    (state: any) => state?.userData?.userInfo?.inviteCode,
  );

  useEffect(() => {}, []);

  /**
   * 下拉刷新
   * */
  const onRefresh = async (pageNo: number, pageSize: number) => {
    const {anchorId} = anchorInfo;
    const params = {
      anchorId,
      pageNo: pageNo,
      pageSize: pageSize,
    };
    const result = await apiGetLiveList(params).catch((err: any) =>
      console.log(err),
    );
    if (isSucceed(result)) {
      const records = result?.data?.records || EMPTY_ARR;
      const noBackArr = records.filter((o) => o.isBack === 1);
      return Promise.resolve({result: noBackArr});
    }
    return Promise.resolve({result: EMPTY_ARR});
  };

  /**
   * 上拉刷新
   */
  const onEndReached = async (pageNo: number, pageSize: number) => {
    const {anchorId} = anchorInfo;
    const params = {
      anchorId,
      pageNo: pageNo,
      pageSize: pageSize,
    };
    const result = await apiGetLiveList(params).catch((err: any) =>
      console.log(err),
    );
    if (isSucceed(result)) {
      return Promise.resolve({result: result?.data?.records || EMPTY_ARR});
    }
    return Promise.resolve({result: EMPTY_ARR});
  };

  /**
   * 点击分享按钮
   */
  const onSharePress = (item: any) => {
    share(
      {
        liveId: item?.liveId,
        groupId: item?.groupId,
        inviteCode,
      },
      {
        title: '分享',
        failOnCancel: false,
      },
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  /**
   * 点击下载按钮
   */
  const onDownloadPress = async (url) => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const t = Toast.loading('已在后台下载...');
      if (!url) {
        Portal.remove(t);
        Toast.fail('视频不存在');
        return;
      }
      // const saveImageUrl = 'https://gslb.miaopai.com/stream/9Q5ADAp2v5NHtQIeQT7t461VkNPxvC2T.mp4?vend=miaopai&';

      const dirs =
        Platform.OS === 'ios'
          ? RNFS.LibraryDirectoryPath
          : RNFS.DocumentDirectoryPath;
      const pathName = new Date().getTime() + '.mp4';
      const downloadDest =
        Platform.OS === 'ios'
          ? `${dirs}/${pathName}`
          : `file://${dirs}/${pathName}`;
      const option = {
        fromUrl: url,
        toFile: downloadDest,
      };

      const ret = RNFS.downloadFile(option);
      ret.promise.then((res) => {
        if (res && res.statusCode === 200) {
          CameraRoll.saveToCameraRoll(downloadDest)
            .then(function (result) {
              Portal.remove(t);
              Toast.success('视频已保存至相册');
            })
            .catch(function (error) {
              console.log(error, 'errorerrorerrorerror');
              Portal.remove(t);
              Toast.fail('视频保存失败');
            });
          return;
        }
        Portal.remove(t);
        Toast.show('获取视频资源失败');
      });
    }
  };

  // /*
  // * 跳转回放
  // * */
  // const navigateFn = () => {
  //
  // };

  return (
    <View style={styles.style}>
      <NavBar title="我的直播" />
      <PagingList
        size={10}
        data={liveList}
        setData={setLiveList}
        renderItem={({item, index}) => {
          return (
            <RecordsCard
              key={`_${index}`}
              smallPic={item.smallPic}
              title={item.title}
              sale={item.sale}
              watchNum={item.watchNum}
              goodsNum={item.goodsNum}
              liveGoodsNum={item.liveGoodsNum}
              addFavourite={item.addFavourite}
              moneyNum={item.moneyNum}
              startTime={item.startTime}
              onPress={() => {
                dispatch(clearLiveRoom());
                
                navigate('LivingRoomScreen', {
                  liveId: item?.liveId,
                  groupID: item?.groupId || `live${item?.liveId}`,
                  anchorId: item?.anchorId,
                  mediaType: item?.liveStatus,
                });
              }}
              onSharePress={() => onSharePress(item)}
              onDownloadPress={() => onDownloadPress(item.rtmpPath)}
            />
          );
        }}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        initialNumToRender={10}></PagingList>
    </View>
  );
};

AnchorRecords.defaultProps = {};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    paddingBottom: pxToDp(pad * 2),
  },
  myLivePage: {},
  liveDetail: {
    width: pxToDp(300),
    height: pxToDp(300),
    position: 'relative',
    marginRight: pxToDp(pad * 2),
  },
  coverImg: {
    width: pxToDp(300),
    height: pxToDp(300),
  },
  livePlayIcon: {
    width: pxToDp(70),
    height: pxToDp(70),
    position: 'absolute',
    top: pxToDp(115),
    left: pxToDp(115),
  },
  recordsDetail: {
    flex: 1,
    paddingRight: pxToDp(pad),
    paddingTop: pxToDp(pad * 3),
    paddingBottom: pxToDp(pad * 3),
  },
  detail: {
    width: pxToDp(360),
  },
  liveTitle: {
    fontWeight: 'bold',
  },
  listItem: {
    width: pxToDp(360),
    // lineHeight: pxToDp(40),
    marginRight: pxToDp(pad),
    marginLeft: pxToDp(pad),
  },
  interval: {
    width: pxToDp(2),
    height: pxToDp(18),
    backgroundColor: Colors.lightGrey,
  },
  liveTime: {
    marginTop: pxToDp(pad * 2),
  },
  operationButton: {
    fontSize: pxToDp(24),
  },
  shareImg: {
    width: pxToDp(41),
    height: pxToDp(35),
    marginRight: pxToDp(pad),
  },
  downloadImg: {
    width: pxToDp(34),
    height: pxToDp(34),
    marginRight: pxToDp(pad),
  },
  status: {
    color: Colors.basicColor,
    overflow: 'hidden',
    paddingTop: pxToDp(pad),
    paddingBottom: pxToDp(pad),
    paddingLeft: pxToDp(pad * 2),
    paddingRight: pxToDp(pad * 2),
    borderRadius: pxToDp(pad * 2),
    backgroundColor: 'rgba(255,50,27,0.1)',
    // borderWidth: 1 / PixelRatio.get()
  },
});

export default connect((state: any) => state.anchorData)(
  withPage(AnchorRecords, {
    statusBarOptions: {
      barStyle: 'dark-content',
    },
  }),
);
