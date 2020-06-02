import React from 'react'
import { View, Text, StyleSheet, Image, PixelRatio, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import { Ionicons } from '@expo/vector-icons'
import formatSinglePrice from '../../../utils/formatGoodsPrice'

interface Props {
  orderInfo: any;
  toPay(id: number | string): void;
  cancelOrder(id: number | string): void;
  remindDelivery(id: number | string): void;
  confirmTheGoods(id: number | string): void;
  extendReceiveGoods(id: number | string): void;
}

export default function OrderItem(props: Props) {
  const navigation: any = useNavigation()
  const { orderInfo } = props

  /**
   * 进入品牌店铺
   */
  const toBrandShop = () => {
    navigation.navigate('BrandShop', { id: orderInfo.brandId })
  }

  /**
   * 进入订单详情
   */
  const toOrderDetail = () => {
    if (orderInfo.refundType) {  // 售后订单
      if (orderInfo.processType === 9) {  // 售后完成订单
        navigation.navigate('GoodsInfo', { id: orderInfo.goodsId })
        return
      }
      navigation.navigate('AfterSaleDetail', { id: orderInfo.id })
      return
    }

    if (orderInfo.orderStatus === 1 || 6) {  // 待付款 已取消
      return
    }

    navigation.navigate('OrderDetail', { id: orderInfo.id })    
  }

  /**
   * 查看物流
   */
  const toViewExpress = () => {
    const params = {
      shippingCode: orderInfo.deliveryComCode,
      invoiceNo: orderInfo.deliveryNo
    }
    navigation.navigate('ExpressInfo', params)
  }

  /**
   * 申请退款、售后
   */
  const refund = (item: any) => {
    orderInfo.goodsInfo = item
    navigation.navigate('ApplyForAfterSales', orderInfo)
  }

  /**
   * 再此购买
   */ 
  const buyAgain = () => {
    const goodsId = orderInfo.goodsList[0].goodsId
    navigation.navigate('GoodsInfo', { id: goodsId })
  }

  /**
   * 售后详情
   */
  const toAfterSaleDetail = () => {
    navigation.navigate('AfterSaleDetail', { id: orderInfo.id })
  }

  return (
    <View style={styles.container}>
      {/* 订单头部区域 */}
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={toBrandShop}>
          <View style={styles.headerLeft}>
            <Image source={{ uri: orderInfo.shopImg }} style={styles.shopLogo} />
            <Text style={styles.shopName}>{orderInfo.shopName}</Text>
            <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
          </View>
        </TouchableWithoutFeedback>
        {
          orderInfo.orderStatus
            ? <Text style={styles.orderStatus}>
              {orderInfo.orderStatus === 1
                ? '待付款'
                : orderInfo.orderStatus === 2
                  ? '待发货'
                  : orderInfo.orderStatus === 3
                    ? '卖家已发货'
                    : orderInfo.orderStatus === 4
                      ? '已完成'
                      : orderInfo.orderStatus === 5
                        ? '已关闭' : '已取消'
              }
            </Text>
            : <Text style={styles.orderStatus}>{orderInfo.processType === 9 ? '已关闭' : '售后中'}</Text>
        }
      </View>
      {/* 商品列表 */}
      {
        orderInfo.goodsList.map((item: any, index: number) => {
          return (
            <View key={`goods-${index}`} style={styles.goodsItem}>
              <TouchableWithoutFeedback onPress={toOrderDetail}>
                <Image source={{ uri: item.skuImg || '' }} style={styles.goodsImg} />
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={toOrderDetail}>
                <View style={styles.goodsInfo}>
                  <Text style={styles.goodsName} numberOfLines={2}>{item.goodsName}</Text>
                  <Text style={styles.goodsSku}>{item.specJson}</Text>
                </View>
              </TouchableWithoutFeedback>

              <View style={styles.goodsPrice}>
                <View style={styles.price}>
                  <Text style={{ fontSize: pxToDp(24) }}>¥</Text>
                  <Text style={{ fontSize: pxToDp(28) }}>{formatSinglePrice(item.goodsPrice)}</Text>
                </View>
                <View style={styles.price}>
                  <Text style={{
                    fontSize: pxToDp(26),
                    color: Colors.darkGrey
                  }}>x{item.goodsNum}</Text>
                </View>
              </View>
              {
                orderInfo.orderStatus === 2 && item.afterSalesStatus === 0
                  ? <Text style={styles.refundBtn} onPress={() => refund(item)}>申请退款</Text>
                  : orderInfo.orderStatus === 4 && item.afterSalesStatus === 0
                    ? <Text style={styles.refundBtn} onPress={() => refund(item)}>申请售后</Text>
                    : <Text style={styles.refundBtn}>
                      {item.afterSalesStatus === 1
                        ? '售后中'
                        : item.afterSalesStatus === 2
                          ? '换货完成'
                          : item.afterSalesStatus === 3
                            ? '退款完成' : ''}
                    </Text>
              }
            </View>
          )
        })
      }
      {/* 商品总价、总数 */}
      <View style={styles.orderTotalInfo}>
        <Text style={{ fontSize: pxToDp(24), color: Colors.darkBlack }}>共{orderInfo.goodsList.length}件商品</Text>
        <Text style={{
          fontSize: pxToDp(24),
          color: Colors.darkBlack,
          marginLeft: pxToDp(10)
        }}>合计：</Text>
        <Text style={styles.rmbIcon}>¥</Text>
        <Text style={styles.totalPrice}>{formatSinglePrice(orderInfo.totalAmount || orderInfo.refundMoney)}</Text>
      </View>

      {/* 待付款 按钮组 */}
      {
        orderInfo.orderStatus === 1 &&
        <View style={styles.btnGroup}>
          <Text style={[styles.btn, styles.greyBtn]} onPress={() => props.cancelOrder(orderInfo.id)}>取消订单</Text>
          <Text style={styles.btn} onPress={() => props.toPay(orderInfo.id)}>去付款</Text>
        </View>
      }

      {/* 待发货 按钮组 */}
      {
        orderInfo.orderStatus === 2 &&
        <View style={styles.btnGroup}>
          <Text style={styles.btn} onPress={() => props.remindDelivery(orderInfo.id)}>提醒发货</Text>
        </View>
      }

      {/* 待收货 按钮组 */}
      {
        orderInfo.orderStatus === 3 &&
        <View style={styles.btnGroup}>
          <Text style={[styles.btn, styles.greyBtn]} onPress={() => props.extendReceiveGoods(orderInfo.id)}>延迟收货</Text>
          <Text style={[styles.btn, styles.greyBtn]} onPress={toViewExpress}>查看物流</Text>
          <Text style={styles.btn} onPress={() => props.confirmTheGoods(orderInfo.id)}>确认收货</Text>
        </View>
      }

      {/* 已完成 按钮组 */}
      {
        orderInfo.orderStatus === 4 &&
        <View style={styles.btnGroup}>
          <Text style={styles.btn} onPress={buyAgain}>再次购买</Text>
        </View>
      }

      {/* 售后 按钮组 */}
      {
        orderInfo.orderStatus === 5 && orderInfo.refundType &&
        <View style={styles.btnGroup}>
          <Text style={styles.btn} onPress={toAfterSaleDetail}>售后进度</Text>
        </View>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    marginBottom: pxToDp(20),
    padding: pxToDp(20),
    borderRadius: pxToDp(16)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopLogo: {
    width: pxToDp(64),
    height: pxToDp(64),
    borderRadius: pxToDp(32)
  },
  shopName: {
    fontSize: pxToDp(32),
    fontWeight: '500',
    color: Colors.darkBlack,
    marginLeft: pxToDp(15),
    marginRight: pxToDp(15)
  },
  orderStatus: {
    fontSize: pxToDp(28),
    fontWeight: '500',
    color: Colors.basicColor
  },
  goodsItem: {
    marginTop: pxToDp(20),
    flexDirection: 'row'
  },
  goodsImg: {
    width: pxToDp(180),
    height: pxToDp(180),
    borderRadius: pxToDp(10)
  },
  goodsInfo: {
    width: pxToDp(330),
    marginLeft: pxToDp(20)
  },
  goodsName: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    lineHeight: pxToDp(36),
    fontWeight: '500',
    marginBottom: pxToDp(10)
  },
  goodsSku: {
    fontSize: pxToDp(24),
    fontWeight: '500',
    color: Colors.darkGrey,
    lineHeight: pxToDp(33)
  },
  goodsPrice: {
    flex: 1
  },
  price: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end'
  },
  refundBtn: {
    position: 'absolute',
    bottom: pxToDp(30),
    right: 0,
    fontSize: pxToDp(22),
    color: Colors.yellowColor
  },
  orderTotalInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline'
  },
  rmbIcon: {
    fontSize: pxToDp(28),
    color: Colors.basicColor
  },
  totalPrice: {
    fontSize: pxToDp(32),
    color: Colors.basicColor
  },
  btnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: pxToDp(30)
  },
  btn: {
    height: pxToDp(56),
    lineHeight: pxToDp(56),
    width: pxToDp(170),
    borderRadius: pxToDp(28),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.basicColor,
    textAlign: 'center',
    marginLeft: pxToDp(20),
    fontSize: pxToDp(28),
    color: Colors.basicColor
  },
  greyBtn: {
    color: Colors.lightBlack,
    borderColor: Colors.lightBlack
  }
})