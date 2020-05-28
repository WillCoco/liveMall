/**
 * 直播缩略块
 */
import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  StyleProp,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {PrimaryText, SmallText, TinyText, scale} from 'react-native-normalization-text';
import {vw} from '../../utils/metric';
import {pad, radio, radioLarge} from '../../constants/Layout';
import {Colors} from '../../constants/Theme';
import Avatar from '../Avatar';
import images from '../../assets/images';
import defaultImages from '../../assets/default-image';
import {MediaType} from '../../liveTypes';
import { updateLivingInfo } from '../../actions/live';
import { clearLiveRoom } from '../../actions/im';

export type msgList = any[] | undefined;
export type onMsgListResponse = (v: boolean) => any;

interface LiveSummaryBlockProps {
  style?: StyleProp<any>,
  liveInfo?: any,
}

const LiveSummaryBlock = (props: LiveSummaryBlockProps) : any =>  {

  const {navigate} = useNavigation();
  const dispatch = useDispatch();

  /**
   * 封面图格式错误处理 TODO:捕捉不到
   */
  const onImageLoadError = (err: any) => {
    console.log(err, 'image-err');
  } 

  /**
   * 根据类型去定义LiveWindow的播放类型(直播、回放、预告)
   */
  const type: MediaType = props.liveInfo?.liveStatus;
  let liveTypeEle;
  switch (type) {
    case MediaType.living:
      liveTypeEle = (
        <Image
          source={images.livingTypeIcon}
          style={styles.liveTypeIcon}
          resizeMode="contain"
        />
      );
      break;
    case MediaType.record:
      liveTypeEle = (
        <>
          <Image
            source={images.liveTypeBgIcon}
            style={styles.liveTypeIcon}
            resizeMode="contain"
          />
          <TinyText color="white" style={styles.liveTypeText}>回放</TinyText>
        </>
      );
      break;
    case MediaType.teaser:
      liveTypeEle = (
        <>
          <Image
            source={images.liveTypeBgIcon}
            style={styles.liveTypeIcon}
            resizeMode="contain"
          />
          <TinyText color="white" style={styles.liveTypeText}>预告</TinyText>
        </>
      );
      break;
     default:
     liveTypeEle = (
      <>
        <Image
          source={images.liveTypeBgIcon}
          style={styles.liveTypeIcon}
          resizeMode="contain"
        />
        <TinyText color="white" style={styles.liveTypeText}>类型</TinyText>
      </>
    );
  }
  
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.wrapper, props.style])}
      onPress={() => {
        dispatch(clearLiveRoom());
        navigate('LivingRoomScreen', {
          liveId: props.liveInfo?.liveId,
          groupID: props.liveInfo?.groupId || `live${props.liveInfo?.liveId}`,
          anchorId: props.liveInfo?.anchorId,
          mediaType: type
        })}
      }
    >
      <Image
        defaultSource={require('../../assets/mine-image/logo.png')}
        source={
          (props.liveInfo?.livePic && props.liveInfo?.livePic !== '0')
            ? {uri: props.liveInfo?.livePic} 
            : defaultImages.livingCover
        }
        style={styles.img}
        onError={(e) => onImageLoadError}
      />
      <View style={styles.liveTitleWrapper}>
        {liveTypeEle}
        <TinyText color="white">{props.liveInfo?.viewsNum || '0'}</TinyText>
      </View>
      <View style={styles.titleWrapper}>
        <PrimaryText
          style={styles.titleText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {props.liveInfo?.liveTitle || '直播标题'}
        </PrimaryText>
      </View>
      
      <View style={styles.bottomBar}>
        <View style={styles.anorchInfoWrapper}>
          <Avatar size={scale(20)} style={{marginRight: pad / 2}} source={props.liveInfo?.anchorLogo}/>
          <SmallText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{width: scale(50)}}
          >
            {props.liveInfo?.anchorName || '主播昵称'}
          </SmallText>
        </View>
        <View style={styles.hotWrapper}>
          <Image
            source={images.heart}
            style={styles.heart}
            resizeMode="contain"
          />
          <SmallText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.hotText}>
              {props.liveInfo?.likeSum || 0}
          </SmallText>
        </View>
      </View>
    </TouchableOpacity>
  )
}

LiveSummaryBlock.defaultProps = {
}

const cardWidth = vw(50) - (1.25*pad)
const styles = StyleSheet.create({
  wrapper: {
    width: cardWidth,
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: pad / 2,
    borderRadius: radioLarge,
    elevation: 1,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: Colors.borderColor
  },
  liveTitleWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    left: 10,
    paddingRight: pad,
    paddingLeft: 34,
    height: 20,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.opacityDarkBg,
    overflow: 'hidden',
  },
  liveTypeIcon: {
    width: 28,
    height: 20,
    right: 0.5,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  liveTypeText: {
    position: 'absolute',
    left: 3
  },
  img: {
    width: cardWidth,
    height: cardWidth,
  },
  anorchInfoWrapper: {
    flexDirection: 'row',
  },
  titleWrapper: {
    width: '100%',
    height: scale(36),
    padding: 7,
    justifyContent: 'center'
  },
  titleText: {
    lineHeight: scale(16),
  },
  bottomBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: pad,
    paddingTop: pad / 2,
    paddingBottom: pad / 2,
  },
  heart: {
    height: scale(20),
    width: scale(20),
    marginRight: 6
  },
  hotWrapper: {
    flexDirection: 'row',
    marginRight: 6,
  },
  hotText: {
    width: scale(30),
  }
})

export default LiveSummaryBlock;