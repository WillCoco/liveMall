import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Carousel } from '@ant-design/react-native'
import Swiper from 'react-native-swiper'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'


export default function BrandSwiper(props: { swiperList: Array<any> }) {
  const { swiperList } = props

  return (
    <View style={styles.swiperContainer}>
      <Carousel
        dots
        autoplay
        infinite
        dotStyle={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
        dotActiveStyle={{ backgroundColor: Colors.whiteColor }}
      >
        {
          swiperList && swiperList.map((item: any, index: number) => {
            return (
              <Image key={`swiper-${index}`} source={{ uri: item.image_url }} style={styles.img} />
            )
          })
        }
      </Carousel>
    </View>
  )
}


const styles = StyleSheet.create({
  swiperContainer: {
    height: pxToDp(750)
  },
  img: {
    width: '100%',
    height: '100%'
  }
})