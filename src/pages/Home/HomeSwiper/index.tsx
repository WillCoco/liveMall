import React from 'react'
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Swiper from 'react-native-swiper'

import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'

interface Props {
  swiperList?: Array<any>  // 传入的轮播图列表
  swiperStyle?: any  // 轮播图样式
  showDots: boolean
  tapSwiper(id: number | string): void
}

function HomeSwiper(props: Props) {
  const { swiperList } = props
  const navigation = useNavigation()

  const tapSwiper = (item: any) => {
    if (item.ctype === 2) {
      navigation.navigate('GoodsInfo', { id: ~~item.extend })
    } if (item.ctype === 7) {
      // navigation.navigate('LiveRoomScreen', { liveId: ~~item.extend })
    } if (item.ctype === 9) {
      navigation.navigate('ActivityWebView', { url: item.extend })
    } else {
      navigation.navigate('ActivityWebView', { url: item.activity_url })
    }
  }

  return (
    <Swiper
      autoplay
      style={props.swiperStyle}
      activeDotColor={Colors.whiteColor}
    >
      {
        swiperList && swiperList.map((item: { original_img: any }, index: any) => {
          return (
            <TouchableWithoutFeedback onPress={() => tapSwiper(item)} key={`swiper-${index}`}>
              <Image
                source={{ uri: item.original_img }}
                resizeMode='cover'
                style={swiperStyle.swiperImage}
              />
            </TouchableWithoutFeedback>
          )
        })
      }
    </Swiper>
  )
}

const swiperStyle = StyleSheet.create({
  swiperImage: {
    width: '100%',
    height: '100%',
    borderRadius: pxToDp(16)
  }
})

export default HomeSwiper