import React, { useState } from 'react'
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Carousel } from '@ant-design/react-native'

import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'

interface Props {
  swiperList?: Array<any>  // 传入的轮播图列表
  swiperStyle?: any  // 轮播图样式
  showDots: boolean
  tapSwiper(id: number | string): void
}

function HomeSwiper(props: Props) {
  const { swiperList, showDots } = props
  const navigation = useNavigation()
  const [swiperIndex, setIndex] = useState(0)

  const tapSwiper = (item: any) => {
    if (item.ctype && item.extend) {
      if (item.ctype === 2) {
        navigation.navigate('GoodsInfo', { id: ~~item.extend })
      } else if (item.ctype === 7) {
        navigation.navigate('LivingRoomScreen', { liveId: ~~item.extend })
      } else if (item.ctype === 9) {
        navigation.navigate('ActivityWebView', { url: item.extend })
      }
    } else if (item.ctype && !item.extends) {
      return
    } else {
      navigation.navigate('ActivityWebView', { url: item.activity_url })
    }
  }

  return (
    <>
      <Carousel
        autoplay
        infinite
        dots={showDots}
        style={props.swiperStyle}
        dotStyle={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
        dotActiveStyle={{ backgroundColor: Colors.whiteColor }}
        afterChange={index => setIndex(index)}
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
      </Carousel>
      {/* <View style={swiperStyle.dotContainer}>
        {
          swiperList && swiperList.map((item: any, index: number) => {
            return (
              <View style={[swiperStyle.dotLine, swiperIndex === index && swiperStyle.activeDot]} />
            )
          })
        }
      </View> */}
    </>
  )
}

const swiperStyle = StyleSheet.create({
  swiperImage: {
    // width: '100%',
    height: '100%',
    borderRadius: pxToDp(16)
  },
  dotContainer: {
    position: 'absolute',
    bottom: pxToDp(10),
    right: pxToDp(50),
    flexDirection: 'row'
  },
  dotLine: {
    height: pxToDp(20),
    width: pxToDp(20),
    borderRadius: pxToDp(10),
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginRight: pxToDp(10)
  },
  activeDot: {
    backgroundColor: Colors.whiteColor
  }
})

export default HomeSwiper