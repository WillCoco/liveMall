import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { apiGetCouponList } from '../../service/api'

import moment from 'moment'
import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'
import formatSinglePrice from '../../utils/formatGoodsPrice'

export default function Coupon() {
  const navigation = useNavigation()

  const [couponList, setCouponList]: Array<any> = useState([])

  navigation.setOptions({
    headerTitle: '优惠券',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    getCouponList()
  }, [])

  const getCouponList = () => {
    apiGetCouponList().then((res: Array<any>) => {
      console.log('已领取的优惠券', res)
      setCouponList(res)
    }).catch((err: any) => {
      console.log('已领取的优惠券', err)
      // setNetWorkErr(true)
    })
  }

  const toUseCoupon = (item: any) => {
    const { scope, brandId, goodsId } = item
    
    if (scope === 2) {
      navigation.navigate('BrandShop', { id: brandId })
    } else if (scope === 3) {
      navigation.navigate('GoodsInfo', { id: goodsId })
    } else {
      navigation.navigate('首页')
    }
  }

  if (!couponList.length) {
    return (
      <View style={styles.emptyContainer}>
        <ImageBackground source={require('../../assets/images/img_empty_coupon.png')} style={styles.emptyImg}>
          <Text style={styles.emptyText}>暂无优惠券</Text>
        </ImageBackground>
      </View>
    )
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {
        couponList.map((item: any, index: number) => {
          return (
            <ImageBackground
              source={require('../../assets/goods-image/coupon_not_have.png')}
              style={styles.couponItem}
              key={`coupon-${index}`}
            >
              <View style={styles.couponInfo}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={styles.rmbIcon}>¥</Text><Text style={styles.price}>{formatSinglePrice(item.discountAmount)}</Text>
                  </View>
                  <Text style={styles.couponText}>{item.scope === 1 ? '平台' : item.scope === 2 ? '店铺' : '商品'}优惠券</Text>
                </View>
                <View style={{ marginLeft: pxToDp(30) }}>
                  <Text style={[styles.text, styles.couponName]}>{item.name}</Text>
                  <Text style={[styles.text, styles.couponRule]}>{`满${formatSinglePrice(item.fullAmount)}元可用`}</Text>
                  <Text style={[styles.text, styles.couponDate]}>{moment(item.usefulTimeStart).format('YYYY.MM.DD')}-{moment(item.usefulTimeEnd).format('YYYY.MM.DD')}</Text>
                </View>
              </View>
              <TouchableWithoutFeedback onPress={() => toUseCoupon(item)}>
                <View style={styles.toUse}>
                  <View style={styles.useBtn}>
                    <Text style={styles.useBtnText}>去使用</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ImageBackground>
          )
        })
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyImg: {
    width: pxToDp(380),
    height: pxToDp(360)
  },
  emptyText: {
    fontSize: pxToDp(28),
    color: Colors.darkGrey,
    textAlign: 'center',
    marginTop: pxToDp(298)
  },
  container: {
    alignItems: 'center'
  },
  couponItem: {
    width: pxToDp(710),
    height: pxToDp(140),
    marginTop: pxToDp(20),
    flexDirection: 'row',
    paddingLeft: pxToDp(30)
  },
  couponInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  rmbIcon: {
    fontSize: pxToDp(28),
    color: Colors.whiteColor
  },
  price: {
    fontSize: pxToDp(48),
    color: Colors.whiteColor,
    fontWeight: '600',
    marginLeft: pxToDp(10)
  },
  couponText: {
    fontSize: pxToDp(20),
    color: Colors.whiteColor
  },
  text: {
    color: Colors.whiteColor,
  },
  couponName: {
    fontSize: pxToDp(28)
  },
  couponRule: {
    fontSize: pxToDp(24),
    marginTop: pxToDp(5),
    marginBottom: pxToDp(5)
  },
  couponDate: {
    fontSize: pxToDp(20)
  },
  toUse: {
    width: pxToDp(180),
    justifyContent: 'center',
    alignItems: 'center'
  },
  useBtn: {
    width: pxToDp(120),
    height: pxToDp(44),
    borderRadius: pxToDp(22),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor
  },
  useBtnText: {
    fontSize: pxToDp(24),
    color: Colors.basicColor
  }
})