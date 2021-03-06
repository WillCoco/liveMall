import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { apiQueryOrderPayStatus } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'
import formatSinglePrice from '../../utils/formatGoodsPrice'
import retry from '../../service/fetch/retry';

const successIcon = require('../../assets/order-image/pay_success.png')
const failedIcon = require('../../assets/order-image/pay_failed.png')

export default function Result() {
  const route: any = useRoute()
  const navigation = useNavigation()

  const [orderPrice, setOrderPrice] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [paySuccess, setPaySuccess] = useState(false)
  const [resultType, setResultType] = useState('')
  const [systemBusy, setSystemBusy] = useState(false)

  const { orderSn, payType, nextBtnText, nextRoute } = route.params

  navigation.setOptions({
    headerTitle: `支付结果`,
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false,
    headerLeft: () => { },
    gesturesEnabled: false
  })

  useEffect(() => {
    queryOrderStauts()
  }, [])

  /**
   * 查询订单支付状态
   */
  const queryOrderStauts = () => {
    const params = {
      orderSn,
      payType
    }

    // apiQueryOrderPayStatus(params).then((res: any) => {
    //   setCompleted(true)
    //   setPaySuccess(true)
    //   setOrderPrice(res.totalAmount)
    //   setResultType(res.orderStatus)
    //   console.log('订单支付成功', res)
    // }).catch((err: any) => {
    //   setCompleted(true)
    //   setPaySuccess(false)
    //   console.log('订单支付失败', err)
    // })


    // 重试
    const queryOrderStautsWithRetry = retry(apiQueryOrderPayStatus, {
      getShouldRetry: (res: any) => {
        return res?.orderStatus === '01'
      },
    })
    
    queryOrderStautsWithRetry(params)
      .then(res => {


        setCompleted(true)
        // setPaySuccess(true)
        setOrderPrice(res.totalAmount)
        setResultType(res.orderStatus)
        console.log('订单查询到结果', res)

        
      })
      .catch(err => {

        // 杉德次数超限 显示系统繁忙
        setSystemBusy(true)
        setResultType('99999')

        // setCompleted(true)
        // setPaySuccess(false)
        console.log('系统繁忙', err)
      })
  }

  /**
   * 返回
   */
  const goBack = () => {
    if (route.params.key) {
      navigation.navigate({name: 'LiveRoomScreen', key: route.params.key })
    } else {
      navigation.navigate(nextRoute || '首页')
    }
  }

  if (!completed) return <></>

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={
          resultType === '00' ? successIcon : failedIcon
        } style={styles.icon} />
        {/* <Text style={styles.statusText}>{paySuccess ? resultType === '00' ? '支付成功' : '订单处理中' : '支付失败'}</Text> */}
        <Text style={styles.statusText}>
          {
            systemBusy 
              ? '系统繁忙'
              : resultType === '00' 
              ? '支付成功' 
              : resultType === '01'
                ? '订单处理中' 
                : '支付失败'
          }
        </Text>
        {paySuccess && <Text style={styles.price}>¥{formatSinglePrice(orderPrice)}</Text>}
      </View>
      <TouchableOpacity style={styles.completeBtn} onPress={goBack}>
        <Text style={styles.text}>{route.params.key ? '返回直播间' : nextBtnText || '继续购物'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  content: {
    marginTop: pxToDp(340),
    alignItems: 'center'
  },
  icon: {
    width: pxToDp(120),
    height: pxToDp(120)
  },
  statusText: {
    fontSize: pxToDp(32),
    color: Colors.darkBlack,
    fontWeight: '500',
    marginTop: pxToDp(40),
    marginBottom: pxToDp(30),
    lineHeight: pxToDp(45)
  },
  price: {
    fontSize: pxToDp(60),
    lineHeight: pxToDp(84),
    fontWeight: '600',
    color: Colors.darkBlack
  },
  completeBtn: {
    marginTop: pxToDp(100),
    width: pxToDp(670),
    height: pxToDp(80),
    borderRadius: pxToDp(40),
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: pxToDp(30),
    color: Colors.whiteColor
  }
})