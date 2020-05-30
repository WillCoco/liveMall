/**
 * 直播简介: 主播头像、标题、观看人数
 */
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ImageSourcePropType
} from 'react-native';
import { Toast } from '../../components/Toast'
import { useSelector, useDispatch } from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {PrimaryText, SmallText} from 'react-native-normalization-text';
import Avatar from '../Avatar';
import withSafeArea from '../HOCs/withSafeArea';
import {pad} from '../../constants/Layout';
// import {vw} from '../../utils/metric';
// import {Colors} from '../../constants/Theme';
import FollowButton from '../../components/FollowButton';
import {apiAttentionAnchor, apiEnterLive} from '../../service/api';
import {shortNum} from '../../utils/numeric';
import defaultImages from '../../assets/default-image';
import { isSucceed } from '../../utils/fetchTools';
import { Attention, AttentionParams } from '../../liveTypes';
import { updateLivingInfo } from '../../actions/live';

export type msgList = any[] | undefined;
export type onMsgListResponse = (v: boolean) => any;
const EMPTY_OBJ = Object.freeze({});

interface LiveMsgProps {
  anchorId: number,
  anchorAvatar?: ImageSourcePropType,
  liveTitle: string,
  liveSubTitle: string | number,
  renderItem?: (d: string | object, i: number) => any,
  style?: StyleProp<any>,
  onPress?: (anchorid: number) => any,
  ref?: any,
  isFollowed: boolean,
  safeTop: number,
  name?: string,
  watchNum?: number,
  showFollowButton?: boolean,
  onFollowPress?: (d: any) => any,
}

const LiveIntro = (props: LiveMsgProps) =>  {

  const {navigate} = useNavigation();
  const dispatch = useDispatch();

  const livingInfo = useSelector((state: any) => {
    return state?.live?.livingInfo || EMPTY_OBJ
  })

  console.log(livingInfo, 'livingInfo')
  
  /**
   * 前往主播详情
   */
  const onPress = () => {
    if (livingInfo.anchorId) {
      // 默认跳转主播详情
      navigate('AnchorDetail', {anchorId: livingInfo.anchorId})
    }
  }

  const watchNum = props.watchNum || livingInfo.watchNum;
  
  const name = props.name || livingInfo.anchorName;

  // 用户id
  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId) || '';

  // 是否关注
  const isFollowed = useSelector((state: any) => state?.live?.livingInfo?.isAttention);

  const myAnchorId = useSelector((state: any) => state?.anchorData?.anchorInfo?.anchorId);

  /**
   * 是否显示关注按钮
   */
  const showFollowButton = props.showFollowButton && (livingInfo.anchorId !== myAnchorId && myAnchorId && livingInfo.anchorId);

  /**
   * 取消/关注 
   */
  const onFollowPress = (isFollowed: boolean) => {
    console.log(isFollowed, 'isFollow');
    
    const params = {
      anchorId: livingInfo.anchorId,
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
          props.onFollowPress && props.onFollowPress(isFollowed)
          return;
        }
        Toast.show(isFollowed ? '取消关注失败' : '关注失败')
      })
      .catch((error: any) => console.log(`apiAttentionAnchor: ${error}`))
  }

  const hasAvatar = (livingInfo?.logo && livingInfo?.logo !== '0')

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.wrapper, props.style, {top: props.safeTop + pad}])}
      onPress={onPress}
    >
      <Avatar
        source={hasAvatar ? {uri: livingInfo.anchorLogo} : defaultImages.userAvatarSmall}
        size={40}
        style={{marginRight: 4}}
      />
      <View style={{marginRight: pad}}>
        <SmallText
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >{name}</SmallText>
        <SmallText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{color: '#ccc'}}
        >
          {shortNum(watchNum) || 0} 观看
        </SmallText>
      </View>
      {
        showFollowButton && (
          <FollowButton
            isFollowed={isFollowed === Attention.isAttention}
            onPress={onFollowPress}
          />
        )
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 10,
    left: pad * 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    height: 46,
    borderRadius: 23,
    // width: vw(50),
    // maxWidth: 180,
    padding: 3,
  },
  scrollerWrapper: {
  },
  contentWrapper: {
    justifyContent: 'flex-end',
  },
  title: {
    color: '#fff',
    maxWidth: 100,
  },
})

export default withSafeArea(LiveIntro);