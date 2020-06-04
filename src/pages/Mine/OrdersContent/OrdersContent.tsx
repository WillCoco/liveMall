import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, PixelRatio } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'

import CardTitle from '../../../components/CardTitle/CardTitle'

interface Props {
  orderCount: any;
  isLogin: boolean;
}

export default function OrdersContent(props: Props) {
  const navigation: any = useNavigation()
  const { orderCount, isLogin } = props

  const toOrderList = (index: number) => {
    if (isLogin) {
      navigation.navigate('OrderList', { index })
    } else {
      navigation.navigate('Login')
    }
  }

  return (
    <View style={styles.container}>
      <CardTitle title='我的订单' subTitle='查看全部' nextAction={() => toOrderList(0)} />
      <View style={styles.orderList}>
        <TouchableWithoutFeedback onPress={() => toOrderList(1)}>
          <View style={styles.orderItem}>
            <Image source={require('../../../assets/mine-image/icon_daifukuan.png')} style={styles.orderIcon} />
            <Text style={styles.orderText}>待付款</Text>
            {
              !!orderCount.notPayingCount && <Text style={styles.badge}>{orderCount?.notPayingCount || 0}</Text>
            }
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => toOrderList(2)}>
          <View style={styles.orderItem}>
            <Image source={require('../../../assets/mine-image/icon_daifahuo.png')} style={styles.orderIcon} />
            <Text style={styles.orderText}>待发货</Text>
            {
              !!orderCount.notDeliverCount && <Text style={styles.badge}>{orderCount?.notDeliverCount || 0}</Text>
            }
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => toOrderList(3)}>
          <View style={styles.orderItem}>
            <Image source={require('../../../assets/mine-image/icon_daishouhuo.png')} style={styles.orderIcon} />
            <Text style={styles.orderText}>待收货</Text>
            {
              !!orderCount.notReceivingCount && <Text style={styles.badge}>{orderCount?.notReceivingCount || 0}</Text>
            }
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => toOrderList(4)}>
          <View style={styles.orderItem}>
            <Image source={require('../../../assets/mine-image/icon_wancheng.png')} style={styles.orderIcon} />
            <Text style={styles.orderText}>已完成</Text>
            {/* {
              !!orderCount.receivedCount && <Text style={styles.badge}>{orderCount?.receivedCount || 0}</Text>
            } */}
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => toOrderList(5)}>
          <View style={styles.orderItem}>
            <Image source={require('../../../assets/mine-image/icon_tuikuan.png')} style={styles.orderIcon} />
            <Text style={styles.orderText}>退款/售后</Text>
            {
              !!orderCount.afterSalesCount && <Text style={styles.badge}>{orderCount?.afterSalesCount || 0}</Text>
            }
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    marginTop: pxToDp(10),
    marginBottom: pxToDp(20),
    paddingTop: pxToDp(30),
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20)
  },
  orderList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: pxToDp(20),
    marginBottom: pxToDp(30)
  },
  orderItem: {
    flex: 1,
    alignItems: 'center'
  },
  orderIcon: {
    width: pxToDp(80),
    height: pxToDp(80)
  },
  orderText: {
    fontSize: pxToDp(26),
    fontWeight: '500',
    lineHeight: pxToDp(37),
    color: Colors.darkBlack,
    marginTop: pxToDp(4)
  },
  badge: {
    position: 'absolute',
    top: pxToDp(10),
    right: pxToDp(30),
    height: pxToDp(28),
    minWidth: pxToDp(28),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.basicColor,
    borderRadius: pxToDp(14),
    textAlign: 'center',
    lineHeight: pxToDp(28),
    backgroundColor: Colors.whiteColor,
    color: Colors.basicColor,
    paddingLeft: pxToDp(5),
    paddingRight: pxToDp(5),
    fontSize: pxToDp(22)
  }
})