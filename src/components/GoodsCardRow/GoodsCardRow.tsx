import React from 'react'
import { View, Text, Image, StyleSheet, PixelRatio, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'
import formatGoodsPrice from '../../utils/formatGoodsPrice'

interface Props {
  style?: any;
  goodsInfo?: any;
}

export default function GoodsCardRow(props: Props) {
  const { goodsInfo } = props
  const navigation: any = useNavigation()

  const toGoodsInfo = () => {
    const { goods_id: id } = goodsInfo
    navigation.push('GoodsInfo', { id })
  }

  return (
    <TouchableWithoutFeedback onPress={toGoodsInfo}>
      <View style={[styles.container, props.style]}>
        <Image source={{ uri: goodsInfo.original_img }} style={styles.goodsImg} />
        <View style={styles.goodsInfo}>
          <Text style={styles.goodsName} numberOfLines={2} onPress={toGoodsInfo}>{goodsInfo.goods_name}</Text>
          <View style={styles.goodsShare}>
            {/* {
            goodsInfo.is_proprietary
              ? <ImageBackground source={require('../../assets/home-image/badge_bg.png')} style={styles.badgeBg}>
                <Text style={styles.badgeText}>自营</Text>
              </ImageBackground>
              : <Text />
          } */}
            <Text />
            <View style={styles.shareCard}>
              <Text style={styles.shareText}>分享</Text>
              <Text style={styles.sharePrice}>¥{formatGoodsPrice(goodsInfo.MyDiscounts || 0)}</Text>
            </View>
          </View>
          <View style={styles.goodsPrice}>
            <Text style={styles.rmbIcon}>¥</Text>
            <Text style={styles.salePrice}>{formatGoodsPrice(goodsInfo.shop_price)}</Text>
            <Text style={styles.originalPrice}>¥{formatGoodsPrice(goodsInfo.market_price)}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: pxToDp(240),
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    backgroundColor: Colors.whiteColor
  },
  goodsImg: {
    width: pxToDp(220),
    height: pxToDp(220),
    borderRadius: pxToDp(16)
  },
  goodsInfo: {
    width: pxToDp(470),
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    marginLeft: pxToDp(14)
  },
  goodsName: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(36),
    color: Colors.darkBlack
  },
  goodsShare: {
    marginTop: pxToDp(17),
    marginBottom: pxToDp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badgeBg: {
    width: pxToDp(48),
    height: pxToDp(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: pxToDp(20),
    color: Colors.whiteColor
  },
  shareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pxToDp(40),
    borderColor: Colors.basicColor,
    borderWidth: 1 / PixelRatio.get(),
    borderRadius: pxToDp(10),
    overflow: 'hidden'
  },
  shareText: {
    backgroundColor: Colors.basicColor,
    height: '100%',
    paddingTop: pxToDp(5),
    paddingBottom: pxToDp(5),
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    color: Colors.whiteColor,
    fontSize: pxToDp(22)
  },
  sharePrice: {
    paddingTop: pxToDp(5),
    paddingBottom: pxToDp(5),
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    color: Colors.basicColor
  },
  goodsPrice: {
    flexDirection: 'row'
  },
  rmbIcon: {
    fontSize: pxToDp(24),
    color: Colors.basicColor
  },
  salePrice: {
    fontSize: pxToDp(34),
    color: Colors.basicColor,
    marginRight: pxToDp(16),
    lineHeight: pxToDp(33)
  },
  originalPrice: {
    fontSize: pxToDp(24),
    color: Colors.lightGrey,
    textDecorationLine: 'line-through',
    lineHeight: pxToDp(33)
  }
})