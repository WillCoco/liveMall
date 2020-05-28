/**
 * 直播首页轮播
 */
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  PanResponder,
  Image,
  StyleProp,
  TouchableHighlight,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Swiper from 'react-native-swiper';
import images from '../../../assets/images';
import defaultImages from '../../../assets/default-image';
import {apiUserLiveBanner} from '../../../service/api';
import {clearLiveRoom} from '../../../actions/im';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import { MediaType } from '../../../liveTypes';
import { EMPTY_OBJ } from '../../../constants/freeze';

interface LiveBannerProps {
  // bannerList?: any[],
  style?: StyleProp<any>,
  imageStyle?: StyleProp<any>,
}

const DEFAULT_BANNER = [{bimgobject: defaultImages.banner}]
const LiveBanner = (props: LiveBannerProps) : React.ReactElement =>  {

  const [bannerList, setBannerList] = React.useState(DEFAULT_BANNER);
  const {navigate} = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  

  React.useEffect(() => {
    if (isFocused) {
      initBanner();
    }
  }, [isFocused]);

  const initBanner = () => {
    apiUserLiveBanner().then((res: any) => {
      console.log(res, 'banner');
      setBannerList(res || DEFAULT_BANNER)
    })
    .catch(console.warn)
  };

  return (
    <View
      style={StyleSheet.flatten([styles.wrapper, props.style])}
    >
      <Swiper
        autoplay={true}
      >
        {
          bannerList.map((banner: any, i) => {
            const bannerSource = typeof banner?.bimgobject === 'string' ? {uri: banner?.bimgobject} : banner?.bimgobject;

            return (
              <TouchableHighlight 
                key={`banner_${i}`}
                onPress={() => {
                  const {liveId, groupId, anchorId, liveStatus} = banner || EMPTY_OBJ;
                  if (liveId && groupId && anchorId && liveStatus) {
                    // 在直播跳直播
                    dispatch(clearLiveRoom());
                    navigate('LivingRoomScreen', {
                      liveId,
                      groupID: groupId,
                      anchorId,
                      mediaType: liveStatus,
                    })
                    return;
                  }

                  if (anchorId) {
                    // 不在直播跳详情
                    navigate('AnchorDetail', {anchorId})
                  }
                }}
              >
                <Image
                  key={`banner_${i}`}
                  source={bannerSource}
                  resizeMode="cover"
                  resizeMethod="resize"
                  style={StyleSheet.flatten([styles.image, props.imageStyle])}
                />
              </TouchableHighlight>
            )
          })
        }
      </Swiper>
    </View>
  )
};

LiveBanner.defaultProps = {
};

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
  },
  image: {
    width: '100%',
    height: 200,
  }
});

export default LiveBanner;