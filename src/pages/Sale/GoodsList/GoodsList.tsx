import React from 'react'
import { View, Text, StyleSheet, Image, PixelRatio, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

import formatGoodsPrice from '../../../utils/formatGoodsPrice'

interface Props {
  type: string;
  goodsList: Array<any>;
}

export default function GoodsList(props: Props) {
  const { goodsList, type } = props
  const navigation: any = useNavigation()

  const toGoodsInfo = (id: number) => {
    navigation.navigate('GoodsInfo', { id })
  }

  return (
    <View style={styles.container}>
      {
        goodsList && goodsList.map((item: any, index: number) => {
          return (
            <View style={styles.goodsItem} key={`goods-${index}`}>
              <TouchableWithoutFeedback onPress={() => toGoodsInfo(item.goods_id)}>
                <Image source={{ uri: item.original_img }} style={styles.goodsImg} />
              </TouchableWithoutFeedback>
              <View style={styles.goodsInfo}>
                <Text style={styles.goodsName} numberOfLines={2} onPress={() => toGoodsInfo(item.goods_id)}>{item.goods_name}</Text>
                <View style={styles.shareCard}>
                  <Text style={styles.shareText}>分享</Text>
                  <Text style={styles.sharePrice}>¥{formatGoodsPrice(item.MyDiscounts)}</Text>
                </View>
                <View style={styles.goodsPrice}>
                  <Text style={styles.rmbIcon}>¥</Text>
                  <Text style={styles.salePrice}>{formatGoodsPrice(item.shop_price)}</Text>
                  <Text style={styles.originalPrice}>¥{formatGoodsPrice(item.market_price)}</Text>
                </View>
                <ImageBackground source={require('../../../assets/sale-image/buy_btn.png')} style={styles.buyBtn} >
                  <Text style={styles.buyText} onPress={() => toGoodsInfo(item.goods_id)}>马上抢</Text>
                  {
                    type === 'sale' && <Text style={styles.hasSold}>{`${item.has_sold}件已抢`}</Text>
                  }
                </ImageBackground>
              </View>
            </View>
          )
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  goodsItem: {
    position: 'relative',
    padding: pxToDp(20),
    paddingTop: pxToDp(10),
    paddingBottom: pxToDp(10),
    backgroundColor: Colors.whiteColor,
    marginBottom: pxToDp(10),
    flexDirection: 'row'
  },
  goodsImg: {
    width: pxToDp(220),
    height: pxToDp(220),
    borderRadius: pxToDp(10)
  },
  goodsInfo: {
    marginLeft: pxToDp(14),
    paddingTop: pxToDp(10)
  },
  goodsName: {
    width: pxToDp(470),
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    lineHeight: pxToDp(36)
  },
  shareCard: {
    maxWidth: pxToDp(160),
    flexDirection: 'row',
    alignItems: 'center',
    height: pxToDp(40),
    borderColor: Colors.basicColor,
    borderWidth: 1 / PixelRatio.get(),
    borderRadius: pxToDp(10),
    overflow: 'hidden',
    marginTop: pxToDp(15)
  },
  shareText: {
    fontSize: pxToDp(24),
    backgroundColor: Colors.basicColor,
    height: '100%',
    paddingTop: pxToDp(5),
    paddingBottom: pxToDp(5),
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    color: Colors.whiteColor
  },
  sharePrice: {
    paddingTop: pxToDp(5),
    paddingBottom: pxToDp(5),
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    color: Colors.basicColor
  },
  goodsPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: pxToDp(13)
  },
  rmbIcon: {
    fontSize: pxToDp(24),
    color: Colors.basicColor
  },
  salePrice: {
    fontSize: pxToDp(34),
    color: Colors.basicColor
  },
  originalPrice: {
    fontSize: pxToDp(24),
    color: Colors.lightGrey,
    marginLeft: pxToDp(15),
    textDecorationLine: 'line-through'
  },
  buyBtn: {
    position: 'absolute',
    width: pxToDp(160),
    height: pxToDp(80),
    bottom: pxToDp(20),
    right: pxToDp(20),
    borderRadius: pxToDp(10),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buyText: {
    fontSize: pxToDp(28),
    fontWeight: '500',
    color: Colors.whiteColor
  },
  hasSold: {
    fontSize: pxToDp(22),
    color: Colors.whiteColor,
    marginTop: pxToDp(5)
  }
})