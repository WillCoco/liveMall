import React from 'react'
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import formatSinglePrice from '../../../utils/formatGoodsPrice'

import SeckillCountDown from '../../../components/SeckillCountDown/SeckillCountDown'

export default function ActivityBar(props: {
  type: string,
  goodsInfo: any
}) {
  const { type, goodsInfo } = props

  const containerBgi =
    type === 'sale'
      ? require('../../../assets/goods-image/sale_bgi.png')
      : require('../../../assets/goods-image/seckill_bgi.png')
  const saleText =
    type === 'sale'
      ? require('../../../assets/goods-image/sale_text.png')
      : require('../../../assets/goods-image/seckill_text.png')

  return (
    <ImageBackground style={styles.container} source={containerBgi}>
      <View style={styles.saleInfo}>
        <Image source={saleText} style={styles.saleText} />
        <View style={{ marginLeft: pxToDp(24) }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.rmbIcon}>¥</Text><Text style={styles.salePrice}>{formatSinglePrice(goodsInfo.shop_price)}</Text>
          </View>
          <Text style={styles.originalPrice}>¥{formatSinglePrice(goodsInfo.market_price)}</Text>
        </View>
      </View>
      {
        type === 'sale'
          ? <View style={{ marginRight: pxToDp(60) }}>
            <Image source={require('../../../assets/goods-image/sale_text1.png')} style={styles.saleSlogan} />
            <Text style={styles.hasSold}>已抢{goodsInfo.has_sold}件</Text>
          </View>
          : <View style={{ marginRight: pxToDp(40) }}>
            <Text style={styles.seckillText}>距离结束仅剩：</Text>
            <SeckillCountDown />
          </View>
      }
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    height: pxToDp(100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  saleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: pxToDp(20)
  },
  saleText: {
    width: pxToDp(68),
    height: pxToDp(80)
  },
  rmbIcon: {
    fontSize: pxToDp(24),
    color: Colors.whiteColor
  },
  salePrice: {
    fontSize: pxToDp(34),
    fontWeight: '500',
    color: Colors.whiteColor
  },
  originalPrice: {
    fontSize: pxToDp(24),
    color: Colors.whiteColor,
    textDecorationLine: 'line-through',
  },
  saleSlogan: {
    width: pxToDp(140),
    height: pxToDp(28)
  },
  hasSold: {
    height: pxToDp(24),
    lineHeight: pxToDp(24),
    backgroundColor: Colors.whiteColor,
    borderRadius: pxToDp(12),
    overflow: 'hidden',
    paddingLeft: pxToDp(13),
    paddingRight: pxToDp(13),
    marginTop: pxToDp(13),
    fontSize: pxToDp(20),
    color: Colors.basicColor,
    textAlign: 'center'
  },
  seckillText: {
    fontSize: pxToDp(20),
    color: Colors.basicColor,
    lineHeight: pxToDp(36)
  },
  countDonw: {
    flexDirection: 'row',
    height: pxToDp(36),
    alignItems: 'center'
  },
  time: {
    width: pxToDp(36),
    height: pxToDp(36),
    lineHeight: pxToDp(36),
    backgroundColor: Colors.blackColor,
    borderRadius: pxToDp(8),
    overflow: 'hidden',
    color: Colors.whiteColor,
    fontSize: pxToDp(24),
    fontWeight: '500',
    textAlign: 'center'
  }
})