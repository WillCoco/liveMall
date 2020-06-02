import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Colors } from '../../constants/Theme'
import { apiReturnOrderDetail } from '../../service/api'

import pxToDp from '../../utils/px2dp'

import ShopCard from './ShopCard/ShopCard'
import AddiInfoCard from './AddiInfoCard/AddiInfoCard'
import ReturnSchedule from './ReturnSchedule/ReturnSchedule'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

export default function AfterSaleDetail() {
  const route: any = useRoute()
  const navigation: any = useNavigation()
  const [orderInfo, setOrderInfo]: any = useState({})
  const [netWorkErr, setNetWorkErr] = useState(false)

  navigation.setOptions({
    headerTitle: `售后详情`,
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    getOrderInfo()
  }, [])

  /**
   * 获取订单详情
   */
  const getOrderInfo = () => {
    apiReturnOrderDetail({ id: route.params.id }).then((res: { orderAfterSalesProcessVOList: any[] }) => {
      console.log('售后详情', res)
      setNetWorkErr(false)
      res.orderAfterSalesProcessVOList.forEach((item: any) => {
        switch (item.type) {
          case 1:
            item.title = '提交申请'
            break
          case 2:
            item.title = '审核通过'
            break
          case 3:
            item.title = '审核拒绝'
            break
          case 4:
            item.title = '买家待发货'
            break
          case 5:
            item.title = '卖家待收货'
            break
          case 6:
            item.title = '卖家已收货'
            break
          case 7:
            item.title = '卖家已发货'
            break
          case 8:
            item.title = '退款通过'
            break
          case 9:
            item.title = '服务关闭'
            break
          default:
            break
        }
      })

      setOrderInfo(res)
    }).catch((err: any) => {
      console.log('售后详情', err)
      setNetWorkErr(true)
    })
  }

  if (netWorkErr) return <NetWorkErr reload={getOrderInfo} />

  return (
    <ScrollView bounces={false}>
      {/* 店铺商品信息 */}
      <ShopCard orderInfo={orderInfo} />
      {/* 订单附加信息 */}
      <AddiInfoCard orderInfo={orderInfo} />
      {/* 退换进度 */}
      <ReturnSchedule scheduleList={orderInfo.orderAfterSalesProcessVOList} />
      {/* 订单操作 */}
      <View style={styles.action}>
        <Text style={styles.btn}>取消申请</Text>
        {
          (orderInfo.processType !== 2 && orderInfo.processType !== 4 || orderInfo.type === 1)
          && <Text style={[styles.btn, { backgroundColor: Colors.basicColor }]}>填写快递单号</Text>
        }
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  action: {
    height: pxToDp(140),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40)
  },
  btn: {
    width: pxToDp(310),
    height: pxToDp(80),
    lineHeight: pxToDp(80),
    borderRadius: pxToDp(40),
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: Colors.lightGrey,
    fontSize: pxToDp(30),
    color: Colors.whiteColor
  }
})