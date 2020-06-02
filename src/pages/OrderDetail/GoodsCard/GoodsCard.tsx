import React from 'react'
import { View, Text, StyleSheet, PixelRatio, Image, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import formatSinglePrice from '../../../utils/formatGoodsPrice'

export default function GoodsCard(props: { detail: any }) {
  const navigation: any = useNavigation()
  const { detail: orderInfo } = props

  /**
   * 进入品牌店铺
   */
  const toBrandShop = () => {
    navigation.navigate('BrandShop', { id: orderInfo.id })
  }

  /**
   * 退换
   */
  const refund = (item: any) => {
    orderInfo.goodsInfo = item
    navigation.navigate('ApplyForAfterSales', orderInfo)
  }

  /**
   * 进入商品详情
   */
  const toGoodsInfo = (id: number) => {
    navigation.navigate('GoodsInfo', { id })
  }

  return (
    <View style={styles.container}>
      <View style={styles.shopInfo}>

        {/* 店铺信息 */}
        <TouchableWithoutFeedback onPress={toBrandShop}>
          <View style={styles.shopHeader}>
            <Image source={{ uri: orderInfo.shopImg }} style={styles.shopLogo} />
            <Text style={styles.shopName}>{orderInfo.shopName}</Text>
            <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
          </View>
        </TouchableWithoutFeedback>

        {/* 商品信息 */}
        <View style={styles.goodsList}>
          {
            orderInfo.goodsList && orderInfo.goodsList.map((item: any, index: number) => {
              return (
                <View key={`goods-${index}`} style={styles.goodsItem}>

                  <TouchableWithoutFeedback onPress={() => toGoodsInfo(item.goodsId)}>
                    <Image source={{ uri: item.skuImg }} style={styles.goodsImg} />
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback onPress={() => toGoodsInfo(item.goodsId)}>
                    <View style={styles.goodsInfo}>
                      <Text style={styles.goodsName} numberOfLines={2}>{item.goodsName}</Text>
                      <Text style={styles.goodsSku}>{item.specJson}</Text>
                    </View>
                  </TouchableWithoutFeedback>

                  <View style={styles.goodsOtherInfo}>
                    <View style={styles.goodsPrice}>
                      <Text style={styles.rmbIcon}>¥</Text><Text>{formatSinglePrice(item.goodsPrice)}</Text>
                    </View>
                    <View style={styles.goodsPrice}>
                      <Text style={styles.goodsNum}>x{item.goodsNum}</Text>
                    </View>
                    {
                      (orderInfo.orderStatus === 2 || orderInfo.orderStatus === 4)
                      && item.afterSalesStatus === 0
                      && <TouchableWithoutFeedback onPress={() => refund(item)}>
                        <View style={[styles.goodsPrice, styles.refundBtn]}>
                          <Text style={{
                            fontSize: pxToDp(28),
                            color: Colors.lightBlack
                          }}>退换</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    }
                  </View>
                </View>
              )
            })
          }
        </View>
      
        {/* 优惠信息 */}
        <View>
          <View style={styles.saleItem}>
            <Text style={styles.text}>商品总价</Text>
            <Text style={styles.text}>¥{formatSinglePrice(orderInfo.originTotalAmount)}</Text>
          </View>
          <View style={styles.saleItem}>
            <Text style={styles.text}>运费</Text>
            <Text style={styles.text}>¥{formatSinglePrice(orderInfo.carriage)}</Text>
          </View>
          <View style={styles.saleItem}>
            <Text style={styles.text}>金牌会员权益</Text>
            <Text style={styles.text}>¥{formatSinglePrice(orderInfo.saleDiscount)}</Text>
          </View>
          <View style={styles.saleItem}>
            <Text>订单总价</Text>
            <Text>¥{formatSinglePrice(orderInfo.totalAmount)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.priceInfo}>
        <Text style={{
          fontSize: pxToDp(28),
          color: Colors.darkBlack,
          fontWeight: '500'
        }}>实付款</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{
            fontSize: pxToDp(24),
            color: Colors.basicColor
          }}>¥</Text><Text style={{
            fontSize: pxToDp(32),
            color: Colors.basicColor,
            fontWeight: '600'
          }}>{formatSinglePrice(orderInfo.totalAmount)}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: pxToDp(10),
    paddingBottom: pxToDp(10),
    backgroundColor: Colors.whiteColor
  },
  priceInfo: {
    height: pxToDp(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: Colors.borderColor,
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20)
  },
  shopInfo: {
    padding: pxToDp(20),
    paddingBottom: pxToDp(10)
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  shopLogo: {
    width: pxToDp(66),
    height: pxToDp(66),
    borderRadius: pxToDp(33),
    marginRight: pxToDp(10)
  },
  shopName: {
    fontSize: pxToDp(32),
    fontWeight: '600',
    marginRight: pxToDp(10)
  },
  goodsList: {
    paddingTop: pxToDp(30),
    paddingBottom: pxToDp(10)
  },
  goodsItem: {
    flexDirection: 'row'
  },
  goodsImg: {
    width: pxToDp(180),
    height: pxToDp(180),
    borderRadius: pxToDp(10),
    marginBottom: pxToDp(20)
  },
  goodsInfo: {
    width: pxToDp(330),
    marginLeft: pxToDp(20)
  },
  goodsName: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(36),
    fontWeight: '500',
    color: Colors.darkBlack,
    marginBottom: pxToDp(10)
  },
  goodsSku: {
    fontSize: pxToDp(24),
    color: Colors.darkGrey,
    lineHeight: pxToDp(33)
  },
  goodsOtherInfo: {
    flex: 1
  },
  goodsPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end'
  },
  rmbIcon: {
    fontSize: pxToDp(24),
    color: Colors.darkBlack,
    lineHeight: pxToDp(33)
  },
  price: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    lineHeight: pxToDp(33)
  },
  goodsNum: {
    fontSize: pxToDp(26),
    color: Colors.darkGrey
  },
  refundBtn: {
    marginTop: pxToDp(30),
    width: pxToDp(170),
    height: pxToDp(56),
    borderRadius: pxToDp(28),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.borderColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  saleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: pxToDp(10)
  },
  text: {
    fontSize: pxToDp(24),
    color: Colors.darkGrey,
    lineHeight: pxToDp(33)
  }
})