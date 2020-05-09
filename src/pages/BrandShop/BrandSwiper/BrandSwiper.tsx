import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import Swiper from 'react-native-swiper'
import pxToDp from '../../../utils/px2dp'


export default function BrandSwiper(props) {
  const { swiperList } = props

  return (
    <View style={styles.swiperContainer}>
      <Swiper style={styles.wrapper}>
        {
          swiperList && swiperList.map((item: any, index: number) => {
            return (
              <Image key={`swiper-${index}`} source={{ uri: item.image_url }} style={styles.img} />
            )
          })
        }
      </Swiper>
    </View>
  )
}


const styles = StyleSheet.create({
  swiperContainer: {
    height: pxToDp(460)
  },
  img: {
    width: '100%',
    height: '100%'
  }
})