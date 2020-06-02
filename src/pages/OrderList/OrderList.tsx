import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, View, Text, StyleSheet, ImageBackground } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  apiPayOrder,
  apiCancelOrder,
  apiGetOrderList,
  apiExtendReceiveGoods,
  apiGetReturnOrderList,
  apiConfirmReceiveGoods,
  apiReminderDeliverGoods
} from '../../service/api'

import pxToDp from '../../utils/px2dp'
import { Toast } from '../../components/Toast'
import { Colors } from '../../constants/Theme'
import checkIsBottom from '../../utils/checkIsBottom'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

import OrderItem from './OrderItem/OrderItem'
import LoadMore from '../../components/LoadMore/LoadMore'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'
import sandpaySerializeURL from '../../utils/sandpaySerializeURL'

const pageSize = 20
const tabList = ['全部', '待付款', '待发货', '待收货', '已完成', '退款/售后']

export default function OrderList() {
  const indexRef = useRef(0)
  const pageNoRef = useRef(1)
  const orderListRef: any = useRef([])
  const hasMoreRef = useRef(true)
  const completeRef = useRef(false)

  const route: any = useRoute()
  const navigation: any = useNavigation()

  const [netWorkErr, setNetWorkErr] = useState(false)
  const [orderList, setOrderList]: Array<any> = useState([])
  
  navigation.setOptions({
    headerTitle: `我的订单`,
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    initData()
  }, [])

  /**
   * 初始化
   */
  const initData = () => {
    indexRef.current = route.params.index

    if (indexRef.current === 5) {
      getReturnOrderList()
    } else {
      getOrderList(indexRef.current)
    }
  }

  /**
   * 切换 TAB
   */
  const changeTab = (e: any) => {
    if (e.i === indexRef.current) return

    pageNoRef.current = 1
    indexRef.current = e.i
    orderListRef.current = []
    completeRef.current = false
    setOrderList(orderListRef.current)

    if (indexRef.current === 5) {
      getReturnOrderList()
    } else {
      getOrderList(indexRef.current)
    }
  }

  /**
   * 获取订单列表
   */
  const getOrderList = (index: number) => {
    const loading = Toast.loading('')

    const params = index
      ? {
        pageNo: pageNoRef.current,
        pageSize,
        orderStatus: index
      }
      : {
        pageNo: pageNoRef.current,
        pageSize
      }

    apiGetOrderList(params).then((res: any) => {
      setNetWorkErr(false)
      Toast.remove(loading)

      console.log('获取订单列表', res)

      const totalPage = Math.ceil(res.total / pageSize)

      hasMoreRef.current = pageNoRef.current < totalPage
      completeRef.current = true
      orderListRef.current = [...orderListRef.current, ...res.records]

      setOrderList(orderListRef.current)
    }).catch((err: any) => {
      console.log('获取订单列表')
      setNetWorkErr(true)
      Toast.remove(loading)
    })
  }

  /**
   * 获取售后订单列表
   */
  const getReturnOrderList = () => {
    const loading = Toast.loading('')

    apiGetReturnOrderList({
      pageSize,
      pageNo: pageNoRef.current
    }).then((res: any) => {
      Toast.remove(loading)
      setNetWorkErr(false)
      console.log('售后订单列表', res)
      res.records.forEach((item: any) => {
        item.goodsList = [{
          goodsId: item.goodsId,
          goodsName: item.goodsName,
          goodsNum: item.goodsNum,
          goodsPrice: item.payPrice,
          skuId: item.skuId,
          skuImg: item.skuImg,
          specJson: item.specJson
        }]
      })

      const totalPage = Math.ceil(res.count / pageSize)

      hasMoreRef.current = pageNoRef.current < totalPage
      completeRef.current = true
      orderListRef.current = [...orderListRef.current, ...res.records]

      setOrderList(orderListRef.current)
    }).catch((err: any) => {
      console.log('售后订单列表')
      setNetWorkErr(true)
      Toast.remove(loading)
    })
  }

  /**
   * 取消订单
   */
  const cancelOrder = (id: number) => {
    apiCancelOrder({ orderId: id }).then(() => {
      orderList.forEach((item: any, index: number) => {
        if (item.id === id) {
          orderList.splice(index, 1)
        }
      })
      setOrderList(JSON.parse(JSON.stringify(orderList)))
      Toast.success('已取消该订单')
    }).catch((err: any) => {
      console.log(err.message)
    })
  }

  /**
   * 提醒发货
   */
  const remindDelivery = (id: number) => {
    apiReminderDeliverGoods({ orderId: id }).then(() => {
      Toast.success('已提醒卖家')
    }).catch((err: any) => {
      console.log(err.message)
    })
  }

  /**
   * 确认收货
   */
  const confirmTheGoods = (id: number) => {
    apiConfirmReceiveGoods({ orderId: id }).then(() => {
      Toast.success('已完成收货')
    }).catch((err: any) => {
      console.log(err.message)
    })
  }

  /**
   * 去支付
   */
  const toPay = (id: number) => {
    let loading = Toast.loading('')
    apiPayOrder({ id, payType: 2 }).then((res: any) => {
      Toast.remove(loading)

      console.log('去支付', res)

      if (res.code !== 200) {
        Toast.fail('创建订单失败')
        return
      }

      const payURL = sandpaySerializeURL(res.data)

      const params = {
        url: payURL,
        orderSn: res.data.orderSn,
        payType: res.data.payType
      }

      navigation.navigate('PayWebView', params)
    }).catch((err: any) => {
      console.log(err.message)
      Toast.remove(loading)
    })
  }

  /**
   * 延迟收货
   */
  const extendReceiveGoods = (id: number) => {
    apiExtendReceiveGoods({ orderId: id }).then(() => {
      Toast.success('已延长收货时间')
    }).catch((err: any) => {
      console.log(err.message)
    })
  }

  /**
   * 触底加载
   */
  const onReachBottom = (e: any) => {
    if (hasMoreRef.current && checkIsBottom(e)) {
      pageNoRef.current += 1
      indexRef.current === 5 ? getReturnOrderList() : getOrderList(indexRef.current)
    }
  }

  if (netWorkErr) return <NetWorkErr reload={initData} />

  return (
    <ScrollableTabView
      initialPage={route.params.index}
      tabBarUnderlineStyle={{ backgroundColor: Colors.basicColor }}
      tabBarActiveTextColor={Colors.darkBlack}
      tabBarInactiveTextColor={Colors.darkBlack}
      tabBarBackgroundColor={Colors.whiteColor}
      renderTabBar={() => <ScrollableTabBar
        style={{ borderBottomWidth: 0 }}
      />}
      onChangeTab={(e) => changeTab(e)}
    >
      {
        tabList.map((item: string, index: number) => {
          return (
            <ScrollView
              tabLabel={item}
              key={`tab-${index}`}
              style={{ padding: pxToDp(20), flex: 1 }}
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={(e) => onReachBottom(e)}
            >
              {
                !!orderList.length
                  ? orderList.map((_item: any, _index: number) => {
                    return (
                      <OrderItem
                        orderInfo={_item}
                        key={`order-${_index}`}
                        cancelOrder={(id: number) => cancelOrder(id)}
                        remindDelivery={(id: number) => remindDelivery(id)}
                        confirmTheGoods={(id: number) => confirmTheGoods(id)}
                        toPay={(id: number) => toPay(id)}
                        extendReceiveGoods={(id: number) => extendReceiveGoods(id)}
                      />
                    )
                  })
                  : <View style={styles.emptyContainer}>
                    <ImageBackground source={require('../../assets/images/emptyList.png')} style={styles.emptyImg}>
                      <Text style={styles.emptyText}>暂无订单</Text>
                    </ImageBackground>
                  </View>
              }
              {!!orderList.length && completeRef.current && <LoadMore hasMore={hasMoreRef.current} />}
            </ScrollView>
          )
        })
      }
    </ScrollableTabView>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flexDirection: 'row',
    marginTop: '50%',
    justifyContent: 'center'
  },
  emptyImg: {
    width: pxToDp(380),
    height: pxToDp(360),
    paddingTop: pxToDp(300)
  },
  emptyText: {
    fontSize: pxToDp(28),
    color: Colors.lightBlack,
    textAlign: 'center'
  }
})