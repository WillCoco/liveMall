import * as React from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {PrimaryText, SmallText, scale} from 'react-native-normalization-text';
import withPage from '../../../components/HOCs/withPage';
import ImagePickerBox from '../../../components/ImagePickerBox';
import VedioPickerBox from '../../../components/VedioPickerBox';
import DateTimePicker, {PickTimeMode} from '../../../components/DateTimePicker';
import NavBar from '../../../components/NavBar';
import { pad, radio, radioLarge } from '../../../constants/Layout';
import {Colors} from '../../../constants/Theme';
import { isIOS, isAndroid } from '../../../constants/DeviceInfo';
import {releaseTeaser} from '../../../actions/live';
import * as api from '../../../service/api';
import {Toast} from '../../../components/Toast';
import { vh } from '../../../utils/metric';
import moment from 'moment';
// alert(moment(['2015', '5', '4']))

const CreateTraserScreen = (props: {
  safeTop: number,
  safeBottom: number,
}) =>  {
  const {goBack} = useNavigation();

  const dispatch = useDispatch();

  /**
   * 选择图片
   */
  const [cover1, setCover1]: Array<any> = React.useState();
  const [cover2, setCover2]: Array<any> = React.useState();

  /**
   * 选择视频
   */
  const [video, setVideo]: Array<any> = React.useState();

  /**
   * 直播时间
   */
  const liveTime: {current: [string | undefined, string | undefined]} = React.useRef([undefined, undefined]);

  /**
   * 标题
   */
  const [title, setTitle]: Array<any> = React.useState();

  /**
   * 内容简介
   */
  const [introductoryText, setIntroductoryText]: Array<any> = React.useState();

  // 时间戳
  const liveTimeStamp: {current: any} = React.useRef();

  console.log(liveTimeStamp, 'liveTimeStampliveTimeStampliveTimeStamp')

  const onPickedTime = (time: string, type?: string) => {
    if (isAndroid()) {
      if (type === PickTimeMode.date) {
        liveTime.current[0] = time;
      } else if (type === PickTimeMode.time) {
        liveTime.current[1] = time;
      }

      // 收集满了计算时间戳
      if (liveTime.current[0] && liveTime.current[1]) {
        // const t = new Date(liveTime.current.join(' '))
        const d = liveTime.current[0].split('.');
        const year = d[0];
        const mouth = +d[1] - 1;
        const day = d[2];

        const t = liveTime.current[1].split(':')
        // liveTimeStamp.current = t.getTime && t.getTime();
        
        // const t = new Date(liveTime.current.join(' '))
        // alert(t)
        const mo = moment([year, mouth, day, t[0], t[1]]);

        liveTimeStamp.current = mo.valueOf();

        // alert(mo);

        console.log(liveTimeStamp.current, 'liveTimeStamp.currentliveTimeStamp.current')
      }
    } else {
      const t = new Date(time)
      liveTimeStamp.current = t.getTime && t.getTime();

      console.log(t, liveTimeStamp.current, time,)
    }

    if (liveTimeStamp.current < Date.now()) {
      Toast.show('请选择合适的时间');
    }
    // todo: ios
  }

  /**
   * 选择封面图1
   */
  const onPickedCover1 = (cover: any) => {
    // console.log(cover, '22223okkdkkkk')
    setCover1(cover);
  }


 /**
   * 选择视频
   */
  const onPickedVideo = (video: any) => {
    if (!!video) {
      isValidVideo(video);
    }
    setVideo(video);
  }

  const isValidVideo = (video: any) => {
    if (!video) {
      Toast.show('视频选择失败');
      return false;
    }
    
    if (!video.uri) {
      Toast.show('视频选择失败');
      return false;
    }

    if (video.duration && video.duration > 20 * 1000) {
      Toast.show('所选视频太长');
      return false;
    }

    return true;
  }

  /**
   * 提交前审核 
   */
  const isDataVaild = (): boolean => {
    if (!cover1) {
      Toast.show('请选择封面图');
      return false;
    }

    console.log(liveTimeStamp.current, 'liveTimeStamp.currentliveTimeStamp.currentliveTimeStamp.current');
    if (!liveTimeStamp.current) {
      Toast.show('请选择开播时间');
      return false;
    }

    // 20s
    if (video) {
      if (video.duration > (0.2 * 60 * 1000)) {
        Toast.show('所选视频太长');
        return false;
      }
    }

    if (liveTimeStamp.current < Date.now()) {
      Toast.show('请选择合适的时间');
      return false;
    }

    if (!title) {
      Toast.show('请填写标题');
      return false;
    }

    return true;
  }

  /**
   * 提交 
   */
  const onSubmitPress = async () => {
    if (!isDataVaild()) {
      return;
    }
    const loading = Toast.loading('上传中');

    // 上传封面
    const coverUpload = api.apiLiveUploadFile({
      fileType: 'PICTURE',
      size: '20',
      unit: 'M',
      file: cover1,
    });

    // 上传视频
    let videoUpload;
    if (video) {
      videoUpload = api.apiLiveUploadFile({
        fileType: 'VIDEO',
        size: '20',
        unit: 'M',
        file: video,
      });
    }

    const {data: coverResult, message: coverMessage} = (await coverUpload) || {};
    const {data: videoResult, message: videoMessage} = (await videoUpload) || {};

    // console.log(coverResult,  'videoResultvideoResult');

    if (!coverResult) {
      Toast.remove(loading);
      Toast.show(coverMessage || '上传封面失败')
      return;
    }

    if (video && !videoResult) {
      Toast.remove(loading);
      Toast.show(videoMessage || '上传视频失败')
      return;
    }

    // console.log(1)

    // const cover = result?.data;

    const isSucceed = await dispatch(releaseTeaser({
      title,
      smallPic: coverResult,
      advance: videoResult,
      bigPic: coverResult,
      liveTime: liveTimeStamp.current,
    }));
    Toast.remove(loading);

    if (isSucceed) {
      goBack();
      Toast.show('发布成功');
    }
  }

  return (
    <View style={styles.style}>
    <ScrollView style={styles.scroll}>
      <NavBar title="发布预告" />
      <View style={styles.contentWrapper}>
        <PrimaryText style={styles.title}>直播封面图(必填)</PrimaryText>
        <View style={styles.row}>
          <ImagePickerBox
            placeholderText="封面图"
            onPicked={onPickedCover1}
            style={{marginRight: pad}}
          />
        </View>
        {/* <View style={styles.row}>
          <ImagePickerBox
            placeholderText="封面图2"
            onPicked={onPickedCover2}
            style={{marginRight: pad}}
          />
        </View> */}
        <PrimaryText style={styles.title}>预告片(可选)</PrimaryText>
        <VedioPickerBox
          onPicked={onPickedVideo}
        />
        <SmallText style={styles.vedioDescText}>时长: 20s内</SmallText>
        <SmallText style={styles.vedioDescText}>大小: 20M内</SmallText>
        <SmallText style={styles.vedioDescText}>建议：化妆小视频（加速版），室内换衣（加速版），室外造型秀（视觉冲击）等等</SmallText>
      </View>
      <View style={StyleSheet.flatten([styles.divider])} />
      <View style={styles.contentWrapper}>
        <View style={StyleSheet.flatten([styles.rowWrapper, styles.bottomDivider])}>
          <PrimaryText style={styles.title}><PrimaryText color="theme">* </PrimaryText> 直播时间</PrimaryText>
          <DateTimePicker
            onPicked={onPickedTime}
            style={{position: 'absolute', left: -pad, paddingLeft: scale(70) + pad * 3}}
          />
          {/* <PrimaryText onPress={() => onPressPickDate('date')} style={styles.title}>{formatDate(liveTime) || '选择日期'}</PrimaryText> */}
          {/* <PrimaryText onPress={() => onPressPickDate('time')} style={styles.title}>{formatTime(liveTime) || '选择时间'}</PrimaryText> */}
        </View>
        <View style={StyleSheet.flatten([styles.rowWrapper, styles.bottomDivider])}>
          <PrimaryText style={styles.title}><PrimaryText color="theme">* </PrimaryText> 直播标题</PrimaryText>
          <TextInput
            placeholder="请输入10个汉字内直播间名称"
            maxLength={10}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        {/* <PrimaryText style={styles.title}>内容简介</PrimaryText> */}
        {/* <TextInput
          multiline
          textAlignVertical="top"
          placeholder="介绍直播内容或注意事项，少于60字"
          maxLength={60}
          value={introductoryText}
          onChangeText={setIntroductoryText}
          style={styles.contentInput}
        /> */}
      </View>
      
    </ScrollView>
      <TouchableOpacity
        style={StyleSheet.flatten([
          styles.btnWrapper,
          {height: 48, marginBottom: props.safeBottom}
        ])}
        onPress={onSubmitPress}
      >
        <PrimaryText color="white">发布预告</PrimaryText>
      </TouchableOpacity>
    </View>
  )
};

CreateTraserScreen.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  contentWrapper: {
    padding: pad
  },
  title: {
    fontWeight: '600',
    // marginTop: 24,
    marginVertical: 10,
    marginRight: pad
  },
  row: {
    flexDirection: 'row'
  },
  coverWrapper: {
    height: 120,
    width: 120,
    backgroundColor: Colors.bgColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImg: {
    height: 120,
    width: 120
  },
  videoWrapper: {
    height: 194,
    backgroundColor: Colors.bgColor,
    borderRadius: radio,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pad,
  },
  vedioDescText: {
    marginVertical: 4
  },
  backgroundVideo: {
    flex: -1,
    height: '100%',
    width: 120,
  },
  btnWrapper: {
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3 * pad
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  divider: {
    borderTopWidth: 8,
    borderColor: Colors.divider
  },
  bottomDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderColor: Colors.divider
  },
  contentInput: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: radioLarge,
    borderColor: Colors.divider,
    minHeight: 146,
    padding: pad
  }
});

export default withPage(CreateTraserScreen, {
  statusBarOptions: {
    barStyle: 'dark-content',
    backgroundColor: 'transparent',
  }
});