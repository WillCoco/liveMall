/**
 * 直播结束
 */
import * as React from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {PrimaryText, H2, T1} from 'react-native-normalization-text';
import withPage from '../../../components/HOCs/withPage';
import {EMPTY_OBJ} from '../../../constants/freeze';
import {MediaType} from '../../../liveTypes';
import {clearLiveRoom} from '../../../actions/im';
import {updateLivingStatus} from '../../../actions/live';
import defaultImages from '../../../assets/default-image';
import { Colors } from '../../../constants/Theme';
import Avatar from '../../../components/Avatar';
import ButtonRadius from '../../../components/Buttons/ButtonRadius';
import {shortNum} from '../../../utils/numeric';
import { vw, vh } from '../../../utils/metric';
import { pad } from '../../../constants/Layout';
import { safeBottom } from '../../../constants/DeviceInfo';

const LivingEnd = (props: any) : any =>  {
  const {goBack} = useNavigation();
  const dispatch = useDispatch();

  const livingInfo = useSelector((state: any) => state?.live?.livingInfo || EMPTY_OBJ);

  React.useEffect(() => {
    // 清除该场直播数据
    dispatch(clearLiveRoom('AUDIENCE'));

    // 清除结束状态
    dispatch(updateLivingStatus());
  }, [])

  const livingBg = livingInfo.smallPic ? {uri: livingInfo.smallPic} : defaultImages.livingBg
  console.log(livingBg, 'livingInfo')
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Image
        source={livingBg}
        resizeMode="cover"
        style={styles.imgBg}
      />
      <View style={styles.modal} />
      <H2 color="white" style={{textAlign: 'center', marginTop: vh(20)}}>直播已结束</H2>
      <T1 color="white" style={{textAlign: 'center', marginTop: 8}}><H2 color="theme">{shortNum(livingInfo.watchNum) || 0}</H2>人观看</T1>
      <Avatar
        source={livingInfo.anchorLogo}
        size={100}
        style={{marginTop: pad*6}}
      />
      <PrimaryText color="white" style={{textAlign: 'center', marginTop: pad}}>{livingInfo.anchorName}</PrimaryText>
      <ButtonRadius
        text="返回"
        onPress={() => goBack()}
        style={StyleSheet.flatten([styles.btn, {bottom: pad + props.safeBottom}])}
      />
    </View>
  )
};

LivingEnd.defaultProps = {
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 10
  },
  imgBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  modal: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  btn: {
    width: vw(90),
    position: 'absolute',
  }
});

export default withPage(LivingEnd, {
  statusBarOptions: {
  }
});