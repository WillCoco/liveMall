import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, Platform, TouchableOpacity } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import { setAddressList } from '../../actions/address'
import { apiAddrList, apiGetOrderDiscountDetail, apiCreateOrder } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import Toast from 'react-native-tiny-toast'
import { Portal, Toast as AntToast } from '@ant-design/react-native'
import { Colors } from '../../constants/Theme'
import formatSinglePrice from '../../utils/formatGoodsPrice'

import ShopCard from './ShopCard/ShopCard'
import CouponList from './CouponList/CouponList'
import AddressBar from './AddressBar/AddressBar'
import ActionSheet from '../../components/ActionSheet/ActionSheet'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'
import sandpaySerializeURL from '../../utils/sandpaySerializeURL'

interface Props {
  choosedAddress: {}
  dispatch: (arg0: { type: string; payload: any[] }) => void
}

function CreateOrder(props: Props) {
  const route: any = useRoute()
  const navigation: any = useNavigation()

  const [curShopId, setCurShopId] = useState(0)
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [showCoupon, setShowCoupon] = useState(false)
  const [isEmptyAddr, setIsEmptyAddr] = useState(true)
  const [orderTotalCount, setOrderTotalCount] = useState(0)
  const [orderTotalPrice, setOrderTotalPrice] = useState(0)
  const [tempOrderList, setTempOrderList]: Array<any> = useState([])
  const [defaultAddress, setDefaultAddress]: Array<any> = useState([])

  navigation.setOptions({
    headerTitle: '确认订单',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    navigation.addListener('focus', () => {
      getAddressList()
    })

    getOrderDiscountDetail()
  }, [])

  /**
   * 获取商品优惠信息
   */
  const getOrderDiscountDetail = () => {
    const { tempOrderList } = route.params

    let req: {
      orderGoodsReqs: { goodsNum: number; skuId: number }[]
      shopId: number
      userCouponsId: string | number
    }[] = []

    tempOrderList.forEach((item: {
      selectedGoods: any[]
      shop_info: { shop_id: number }
      chooseCoupon: { id: number }
    }) => {
      let orderGoodsReqs: {
        goodsNum: number
        skuId: number
      }[] = []

      item.selectedGoods.forEach((_item: {
        goods_num: number
        sku_id: number
      }) => {
        orderGoodsReqs.push({
          goodsNum: _item.goods_num,
          skuId: ~~_item.sku_id
        })
      })

      req.push({
        orderGoodsReqs,
        shopId: item.shop_info.shop_id,
        userCouponsId: item.chooseCoupon && item.chooseCoupon.id > 0 ? item.chooseCoupon.id : ''
      })
    })

    apiGetOrderDiscountDetail(req).then((res: any) => {
      console.log('获取订单优惠信息', res)
      setNetWorkErr(false)

      tempOrderList.forEach((item: {
        shop_info: {
          shop_id: any;
          carriage: any;
          couponList: any[];
          discountDesc: any;
          saleDiscount: any;
          totalPrice: number;
          totalCount: number;
          curTotalPrice: any;
          choosedCoupon: any
        };
        selectedGoods: any[]
      }) => {
        item.shop_info.totalPrice = 0
        item.shop_info.totalCount = 0

        item.selectedGoods.forEach(_item => {
          item.shop_info.totalPrice += (_item.shop_price * _item.goods_num)
          item.shop_info.totalCount += _item.goods_num
          item.shop_info.curTotalPrice = item.shop_info.totalPrice  // 实际价格，不可改变，用于计算使用优惠券的价格
        })

        const emptyCoupon = [{
          id: -1,
          value: '不使用优惠券',
          isChoosed: false,
          discountAmount: 0,
          fullAmount: 0
        }]

        res.forEach((_item: {
          shopId: any;
          carriage: any;
          saleDiscount: any;
          discountDesc: any;
          availableCoupons: any[];
        }) => {
          if (_item.shopId === item.shop_info.shop_id) {
            item.shop_info.couponList = [..._item.availableCoupons, ...emptyCoupon]  // 可用优惠券列表
            item.shop_info.discountDesc = _item.discountDesc  // 优惠描述
            item.shop_info.saleDiscount = _item.saleDiscount  // 优惠金额
            item.shop_info.carriage = _item.carriage  // 邮费
            item.shop_info.choosedCoupon = _item.availableCoupons.filter(item => item.isChoosed)[0]
          }
        })
      })

      calcUsedCouponPrice(tempOrderList)
    }).catch((err: any) => {
      console.log('获取订单优惠信息', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 获取收货地址列表
   */
  const getAddressList = () => {
    apiAddrList().then((res: any[]) => {
      console.log('获取收货地址列表', res)
      setNetWorkErr(false)
      if (!res.length) {
        setIsEmptyAddr(true)
        return
      }

      props.dispatch(setAddressList(res))

      setIsEmptyAddr(false)

      setDefaultAddress(res.filter((item: { is_default: number }) => item.is_default === 1)[0])
    }).catch((err: any) => {
      console.log('获取收货地址列表', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 输入订单备注
   */
  const inputMemo = (value: string, id: number) => {
    tempOrderList.forEach((item: {
      shop_info: { shop_id: number; memo: string }
    }) => {
      if (id === item.shop_info.shop_id) {
        item.shop_info.memo = value
      }
    })

    setTempOrderList(JSON.parse(JSON.stringify(tempOrderList)))
  }

  /**
   * 显示优惠券面板
   */
  const showCouponActionSheet = (id: number) => {
    setCurShopId(id)
    setShowCoupon(true)
  }

  /**
   * 隐藏优惠券面板
   */
  const hideCoupon = () => {
    setShowCoupon(false)
  }

  /**
   * 选择优惠券
   */
  const chooseCoupon = (shopId: number, couponId: number) => {
    tempOrderList.forEach((item: any) => {
      if (item.shop_info.shop_id === shopId) {
        item.shop_info.couponList.forEach((_item: any) => {
          _item.isChoosed = false
          if (_item.id === couponId) {
            _item.isChoosed = true
            item.shop_info.choosedCoupon = _item
          }
        })
      }
    })

    calcUsedCouponPrice(tempOrderList)
  }

  /**
   * 计算优惠后价格
   */
  const calcUsedCouponPrice = (tempOrderList: any[]) => {
    let orderTotalPrice = 0  // 订单商品总价
    let orderTotalCount = 0  // 订单商品总数

    tempOrderList.forEach(item => {
      if (item.shop_info.choosedCoupon) {
        item.shop_info.totalPrice = item.shop_info.curTotalPrice + item.shop_info.carriage - item.shop_info.choosedCoupon.discountAmount  // 优惠后的商品总价
      } else {
        item.shop_info.totalPrice = item.shop_info.curTotalPrice + item.shop_info.carriage  // 优惠后的商品总价
      }

      orderTotalPrice += item.shop_info.totalPrice
      orderTotalCount += item.selectedGoods.length

      setOrderTotalPrice(orderTotalPrice)
      setOrderTotalCount(orderTotalCount)
    })

    setTempOrderList(JSON.parse(JSON.stringify(tempOrderList)))
  }

  /**
   * 提交订单
   */
  const submitOrder = () => {
    const addressInfo = Object.keys(props.choosedAddress).length ? props.choosedAddress : defaultAddress

    if (!addressInfo || !addressInfo.address_id) {
      AntToast.fail('请选择收货地址')
      return
    }

    if (orderTotalPrice < 0) {
      AntToast.fail('价格计算有误，请重新确认')
      return
    }

    let shopReqs: {
      deliveryType: number // 配送方式
      remark: any // 备注
      shopId: any // 购物车 ID
      orderGoodsReqs: any
      userCouponsId: string
    }[] = []
    let cartIds: any[] = []
    let userCouponsId = ''

    const loading = AntToast.loading('')

    tempOrderList.forEach((item: any, index: number) => {
      item.orderGoodsReqs = []

      item.selectedGoods.forEach((_item: any, _index: number) => {
        item.orderGoodsReqs.push({
          goodsNum: _item.goods_num,  // 商品数量
          skuId: ~~_item.sku_id,  // 规格 id
          shareUserId: route.params.shareUserId
        })

        cartIds.push(_item.cart_id)
      })

      if (item.shop_info.choosedCoupon && item.shop_info.choosedCoupon.id > 0) {
        userCouponsId = item.shop_info.choosedCoupon.id
      }

      shopReqs[index] = {
        deliveryType: 0,  // 配送方式
        remark: tempOrderList[index].shop_info.memo,  // 备注
        shopId: tempOrderList[index].shop_info.shop_id,  // 购物车 ID
        orderGoodsReqs: tempOrderList[index].orderGoodsReqs,
        userCouponsId
      }
    })

    let params: any = {
      cartIds,
      payType: 2,  //  支付方式
      shopReqs,
      userAddressId: addressInfo.address_id
    }

    if (route.params.liveId) {
      params[`liveId`] = route.params.liveId
    }

    apiCreateOrder(params).then((res: any) => {
      Portal.remove(loading)
      // setNetWorkErr(false)
      console.log('提交订单', res)

      if (res.code !== 200) {
        Toast.show('创建订单失败')
        return
      }

      route.params.onOrderCompleted && route.params.onOrderCompleted(params)

      const payURL = sandpaySerializeURL(res.data)

      const payParams = {
        url: payURL,
        orderSn: res.data.orderSn,
        payType: res.data.payType,
        key: route.params.key && route.params.key || ''
      }

      console.log('创建订单路由参数', payParams)

      navigation.navigate('PayWebView', payParams)
    }).catch((err: any) => {
      console.log('提交订单', err)
      Portal.remove(loading)
      // setNetWorkErr(true)
    })
  }

  /**
   * 网络异常 重新加载
   */
  // const reload = () => {
  //   getAddressList()
  //   getOrderDiscountDetail()
  // }

  // if (netWorkErr) return <NetWorkErr reload={reload} />

  return (
    <View>
      <ScrollView style={styles.container}>
        {/* 地址选择栏 */}
        <AddressBar defaultAddress={Object.keys(props.choosedAddress).length ? props.choosedAddress : defaultAddress} isEmpty={isEmptyAddr} />
        {/* 店铺 */}
        {
          tempOrderList && tempOrderList.map((item: any, index: number) => {
            return (
              <ShopCard shopInfo={item} key={`shop-${index}`} inputMemo={(value: string, id: number) => inputMemo(value, id)} showCoupon={(id: number) => showCouponActionSheet(id)} />
            )
          })
        }
        {/* 支付 */}
        {/* <View style={styles.payContainer}>
          <View style={styles.payItem}>
            <Image source={require('../../assets/order-image/pay_icon.png')} style={styles.payIcon} />
            <Text style={styles.payText}>支付方式</Text>
          </View>
          <View style={styles.payItem}>
            <Text style={[styles.payText, { marginRight: pxToDp(30) }]}>微信支付</Text>
            <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
          </View>
        </View> */}
      </ScrollView>
      {/* 提交订单 */}
      <View style={styles.submitBar}>
        <Text style={styles.totalCount}>共{orderTotalCount}件</Text>
        <Text style={styles.curPayText}>实付款：</Text>
        <Text style={styles.rmbIcon}>¥</Text>
        <Text style={styles.totalPrice}>{formatSinglePrice(orderTotalPrice)}</Text>
        <TouchableOpacity onPress={submitOrder}>
          <View style={styles.submitBtn}><Text style={styles.submitBtnText}>提交订单</Text></View>
        </TouchableOpacity>
      </View>

      {/* 优惠券面板 */}
      <ActionSheet isShow={showCoupon}>
        <CouponList
          orderList={tempOrderList}
          curShopId={curShopId}
          hideCoupon={hideCoupon}
          chooseCoupon={(shopId: number, couponId: number) => chooseCoupon(shopId, couponId)}
        />
      </ActionSheet>
    </View>
  )
}

export default connect(
  (state: any) => state.addressData
)(CreateOrder)

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: pxToDp(20),
    paddingBottom: pxToDp(Platform.OS === 'ios' ? 128 : 110)
  },
  submitBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: Platform.OS === 'ios' ? pxToDp(128) : pxToDp(100),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: pxToDp(30),
    paddingBottom: Platform.OS === 'ios' ? pxToDp(28) : 0,
    justifyContent: 'flex-end'
  },
  payContainer: {
    height: pxToDp(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: pxToDp(10),
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    backgroundColor: Colors.whiteColor,
    borderRadius: pxToDp(16)
  },
  payItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  payIcon: {
    width: pxToDp(44),
    height: pxToDp(42),
    marginRight: pxToDp(25)
  },
  payText: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    fontWeight: '500'
  },
  submitBtn: {
    width: pxToDp(206),
    height: pxToDp(72),
    backgroundColor: Colors.basicColor,
    borderRadius: pxToDp(36),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: pxToDp(20)
  },
  submitBtnText: {
    fontSize: pxToDp(28),
    color: Colors.whiteColor,
    fontWeight: '500'
  },
  totalPrice: {
    fontSize: pxToDp(32),
    fontWeight: '500',
    color: Colors.basicColor
  },
  rmbIcon: {
    fontSize: pxToDp(24),
    color: Colors.basicColor
  },
  curPayText: {
    fontSize: pxToDp(24),
    color: Colors.darkBlack
  },
  totalCount: {
    fontSize: pxToDp(24),
    color: Colors.darkGrey,
    marginRight: pxToDp(20)
  }
})