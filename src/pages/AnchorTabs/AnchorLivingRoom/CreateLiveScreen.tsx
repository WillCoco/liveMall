import * as React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import {Toast} from '../../../components/Toast';
import {useSelector, useDispatch} from 'react-redux';
import {PrimaryText, SmallText, scale} from 'react-native-normalization-text';
import {useNavigation} from '@react-navigation/native';
import withPage from '../../../components/HOCs/withPage';
// import NavBar from '../../../../components/NavBar'
// import LiveWindow from '../../../../components/LiveWindow'
import LiveReadyCard from '../../../components/LiveReadyCard';
import {vw} from '../../../utils/metric';
import {Colors} from '../../../constants/Theme';
import images from '../../../assets/images/index';
import {pad} from '../../../constants/Layout';
import {updateLiveConfig, updateFaceSetting, updateStarted} from '../../../actions/live';
import * as api from '../../../service/api';
import LivingFaceCard from '../../../components/LivingFaceCard';

const CreateLiveScreen = (props: any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  /**
   * 修改标题
   */
  const [title, setTitle] = React.useState('')

  /**
   * 上传文件
   */
  const coverUrl: {current: any} = React.useRef();
  const onChangeCover = async (r: any) => {
    console.log(r, '=======');
    coverUrl.current = r;
  };

  const isValidData = (): boolean => {
    if (!coverUrl.current) {
      Toast.show('请选择直播封面');
      return false;
    }

    if (!title) {
      Toast.show('请填写标题');
      return false;
    }

    return true;
  };

  const onNextPress = async () => {
    // 开播
    dispatch(updateStarted(true));

    if (!isValidData()) {
      return;
    }
    const loading = Toast.loading('上传中');
    // 上传
    const result = await api.apiLiveUploadFile({
      fileType: 'PICTURE',
      size: '20',
      unit: 'M',
      file: coverUrl.current,
    });

    console.log(result, 'resultresultresult');

    Toast.remove(loading);

    const cover = result?.data;

    if (!cover) {
      Toast.show('上传失败');
    }

    // 存直播配置
    // dispatch(updateLiveConfig({cover}));

    // 开播
    props.onPressSubmit && props.onPressSubmit({cover, title})
  };

  /*
   * 美颜功能设置
   * */
  const [faceCardVisible, setFaceCardVisible]: [
    boolean | undefined,
    any,
  ] = React.useState(false);

  /**
   * 美颜动画
   */
  const faceCardAnim = (visiable: boolean) => {
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

    setFaceCardVisible(visiable);
  };

  // 滑块
  const onAfterChangeSetting = (value: number, type: string) => {
    dispatch(updateFaceSetting({type, value}));
  };
  // alert(1)

  return (
    <View
      style={StyleSheet.flatten([
        styles.style,
        {paddingBottom: props.safeBottom},
      ])}>
      {/* <LivePerview /> */}
      <View style={styles.contentWrapper}>
        <View
          style={StyleSheet.flatten([
            styles.liveReadyCardWrapper,
            {marginTop: props.safeTop + 80},
          ])}>
          <LiveReadyCard
            title={title}
            onChangeCover={onChangeCover}
            onChangeTitle={setTitle}
          />
        </View>
        <View style={styles.functionBtnWrapper}>
          <TouchableOpacity onPress={() => faceCardAnim(true)}>
            <Image source={images.filterIcon} style={styles.img} />
            <PrimaryText color="white">美颜</PrimaryText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onNextPress} style={styles.button}>
          <PrimaryText style={styles.nextText}>开播</PrimaryText>
        </TouchableOpacity>
        <SmallText
          color="white"
          style={StyleSheet.flatten([
            styles.agreement,
            {paddingBottom: props.safeBottom},
          ])}>
          开播默认已阅读
          <SmallText
            style={{color: Colors.yellowColor}}
            onPress={() => navigation.navigate('AnchorEntryAgreement')}>
            《云闪播主播入驻协议》
          </SmallText>
        </SmallText>
        <LivingFaceCard
          visible={!!faceCardVisible}
          setVisible={setFaceCardVisible}
          onPressClose={() => faceCardAnim(false)}
          onAfterChangeSetting={onAfterChangeSetting}
        />
      </View>
    </View>
  );
};

CreateLiveScreen.defaultProps = {};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    // backgroundColor: Colors.darkBlack,
  },
  navStyle: {
    backgroundColor: 'transparent',
  },
  headWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  liveReadyCardWrapper: {
    flex: 1,
    marginTop: 28,
    paddingHorizontal: pad,
  },
  functionBtnWrapper: {
    flexDirection: 'row',
    width: vw(60),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button: {
    width: vw(70),
    height: 48,
    backgroundColor: Colors.basicColor,
    alignSelf: 'center',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  nextText: {
    color: '#fff',
  },
  agreement: {
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  cellsWrapper: {
    flexDirection: 'row',
    width: vw(60),
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 31,
    height: 35,
  },
});

export default withPage(CreateLiveScreen, {
  navBackOptions: {
    navBackIcon: 'close',
    navBackTheme: 'light',
    navBackPosition: 'right',
  },
  statusBarOptions: {
    barStyle: 'light-content',
    backgroundColor: 'transparent',
  },
});
