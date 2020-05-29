import * as React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler
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
import {isWorkLiveNow, closeLive, anchorToLive} from '../../../actions/live';
import {useDispatch, useSelector} from 'react-redux';
import Mask from '../../../components/Mask';
import { isSucceed } from '../../../utils/fetchTools';
import {shortNum} from '../../../utils/numeric';

const PublishScreen = (props: any) =>  {
  const [maskList, maskDispatch] = React.useContext(Mask.context);
  const {navigate, reset} = useNavigation();
  const dispatch = useDispatch();
  const anchorInfo = useSelector((state: any) => state?.anchorData?.anchorInfo) || {}
  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId)

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
              const r2 = dispatch(anchorToLive({liveId}));
              navigate('AnorchLivingRoomScreen', {groupID: groupId, liveId});
              return true;
            },
          }
        }})
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      checkIsLiveNow();
      apiAnchorHomePage({userId})
      .then((res: any) => {
        dispatch(setAnchorInfo(res))
      })
      .catch(console.warn)
    }, [])
  );

  React.useEffect(() => {

  }, [])

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

          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPressAndroid);
      }, [])
  );

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
      <Avatar size={65} style={{marginTop: props.safeTop + vh(8)}} source={anchorInfo.logo && {uri: anchorInfo.logo} || images.userAvatar}/>
      <T1 style={styles.nameText}>{anchorInfo?.name || '主播昵称'}</T1>
      <SmallText style={styles.followText}>{shortNum(anchorInfo?.favouriteAmount) || 0}粉丝</SmallText>
      <View style={styles.entranceWrapper}>
        <TouchableOpacity
          style={styles.entranceImgWrapper}
          onPress={() => navigate('CreateLiveScreen')}
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