import * as React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  PermissionsAndroid
} from 'react-native';
import {T1, SmallText} from 'react-native-normalization-text';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import NavBar from '../../../components/NavBar';
import withPage from '../../../components/HOCs/withPage';
import Avatar from '../../../components/Avatar';
import images from '../../../assets/images/index';
import {vw, vh} from '../../../utils/metric';
import {pad} from '../../../constants/Layout';
import {LinearGradient} from 'expo-linear-gradient';
import { apiAnchorHomePage } from '../../../service/api';
import {setAnchorInfo} from '../../../actions/anchor';
import {isWorkLiveNow, closeLive, anchorToLive, updateStarted} from '../../../actions/live';
import {useDispatch, useSelector} from 'react-redux';
import Mask from '../../../components/Mask';
import usePermissions from '../../../hooks/usePermissions';
import { shortNum } from '../../../utils/numeric';
import { EMPTY_OBJ } from '../../../constants/freeze';
import { isSucceed } from '../../../utils/fetchTools';
import { Toast } from '../../../components/Toast';

const PublishScreen = (props: any) =>  {
  const [maskList, maskDispatch] = React.useContext(Mask.context);
  const {navigate, reset} = useNavigation();
  const dispatch = useDispatch();
  const anchorInfo = useSelector((state: any) => state?.anchorData?.anchorInfo) || EMPTY_OBJ;
  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId);

  // 提前获取权限
  const isPermissionGranted = usePermissions([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);

  // 操作空闲
  const isIdle = React.useRef(true);

  /**
   * tab的返回到 我的
   */
  const onBackPress = () => {
    reset({
      index: 0,
      routes: [{ name: 'Root', params: {initialRoute: '我的'}}],
    });

    // navigate('我的')
  }

  /**
   * 检测下有没有直播
   * 可选关闭或者继续直播
   */
  const [allowBack, setAllowBack] = React.useState(true);
  const checkIsLiveNow = async () => {
    const r: any = await dispatch(isWorkLiveNow());
    if (!r) {
      setAllowBack(true);
      return
    }

    const {liveId, groupId} = r;

    if (!!liveId) {
      setAllowBack(false);
      maskDispatch({
        type: Mask.Actions.PUSH,
        payload: {
          type: Mask.ContentTypes.Normal,
          data: {
            title: '您有直播未正常关闭',
            text: '是否恢复上次直播',
            rightBtnText: '恢复直播',
            leftBtnText: '关闭',
            onPressLeft: async () => {
              // 关闭直播件
              const type = 1; // 1 保存回放, 2 不保存
              const r1: any = await dispatch(closeLive({liveId, type}));
              // navigate('AnchorLivingEnd', r1?.data);
              return true;
            },
            onPressRight: () => {
              // 继续去直播
              if (!isIdle) {
                return true;
              }
              isIdle.current = false;
              const r2 = dispatch(anchorToLive({liveId}));
              if (!!r2) {
                // 开启推流
                dispatch(updateStarted(true));
                // 跳转
                navigate('AnorchLivingRoomScreen', {isRecoverMode: true, groupID: groupId, liveId});
              }
              return true;
            },
          }
        }})
    }
  }

  /**
   * 拉取主播数据并查看是否存在直播
   */
  useFocusEffect(
    React.useCallback(() => {
      apiAnchorHomePage({userId})
      .then((res: any) => {
        dispatch(setAnchorInfo(res));
        checkIsLiveNow();
      })
      .catch(console.warn)
      
    }, [])
  ), [anchorInfo];

  /**
   * 处理android返回
   */
  useFocusEffect(
    React.useCallback(() => {
      const onBackPressAndroid = () => {
        if(allowBack) {
          onBackPress()
        }
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPressAndroid);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPressAndroid);
      }
    }, [])
  );

  const hasAvatar = (anchorInfo?.logo && anchorInfo?.logo !== '0')

  return (
    <View style={styles.style}>
      <LinearGradient
        colors={['#FF321B', '#FF604E', '#fff']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      <NavBar leftTheme="light" title="" style={styles.navWrapper} onLeftPress={onBackPress} />
      <Avatar size={65} style={{marginTop: props.safeTop + vh(8)}} source={hasAvatar ? {uri: anchorInfo.logo} : images.userAvatar}/>
      <T1 style={styles.nameText}>{anchorInfo.name || '主播昵称'}</T1>
      <SmallText style={styles.followText}>{anchorInfo.favouriteAmount ? shortNum(anchorInfo.favouriteAmount) : 0}粉丝</SmallText>
      <View style={styles.entranceWrapper}>
        <TouchableOpacity
          style={styles.entranceImgWrapper}
          onPress={() => navigate('LiveGoodsManage', {
            btnText: '下一步',
            onPressSubmit: (goodsIdList: Array<string>) => {
              // 跳转到直播预览
              navigate('AnorchLivingRoomScreen', {
                goodsIdList
              });
            }
          })}
        >
          <Image
            style={StyleSheet.flatten([styles.entranceImg])}
            source={images.publishLive}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.entranceImg}
          onPress={() => navigate('CreateTeaserScreen')}
        >
          <Image
            style={styles.entranceImg}
            source={images.publishTeaser}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  )
};

PublishScreen.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    alignItems: 'center'
  },
  nameText: {
    color: '#fff',
    marginTop: pad
  },
  followText: {
    color: '#fff',
  },
  entranceWrapper: {
    flex: 1,
    width: vw(72),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vh(6)
  },
  entranceImgWrapper: {
  },
  entranceImg: {
    width: vw(30),
    height: vw(81),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 103,
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent'
  },
});

export default withPage(PublishScreen, {
  statusBarOptions: {
    barStyle: 'light-content',
    backgroundColor: 'transparent'
  }
});