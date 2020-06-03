import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'
import formatSinglePrice from '../../../utils/formatGoodsPrice'
import moment from 'moment'

import { apiGetCoupon } from '../../../service/api'
import { isNotchScreen } from '../../../constants/DeviceInfo'

const couponHasBgi = require('../../../assets/goods-image/coupon_has.png')
const couponNotHaveBgi = require('../../../assets/goods-image/coupon_not_have.png')

interface Props {
  goodsInfo: any;
  couponList: Array<any>;
  getGoodsCoupon(): void;
  hideCouponActionSheet(): void; 
}

export default function Coupon(props: Props) {
  const { goodsInfo, couponList } = props

  const getCoupon = (item: any) => {
    if (item.isReceived) return

    apiGetCoupon({ couponsId: item.id }).then((res: any) => {
      console.log('领取优惠券', res)
      if (res) {
        props.getGoodsCoupon()
      }
    })
  }

  return (
    <View style={{ borderRadius: pxToDp(20) }}>
      <View style={styles.container}>
        <Text style={styles.title}>优惠券</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: pxToDp(40), marginBottom: pxToDp(20) }}>
          <Text style={styles.text}>分享最高可赚</Text><Text style={[styles.text, { color: Colors.basicColor }]}>¥{formatSinglePrice(goodsInfo.MyDiscounts)}</Text>
          <Text style={styles.text}>下单最高可优惠</Text><Text style={[styles.text, { color: Colors.basicColor }]}>¥{formatSinglePrice(goodsInfo.MaxDiscounts)}</Text>
        </View>
        {
          couponList && couponList.map((item: any, index: number) => {
            return (
              <ImageBackground
                key={`coupon-${index}`}
                style={styles.couponBgi}
                source={item.isReceived ? couponHasBgi : couponNotHaveBgi}
              >
                <View style={styles.couponContainer}>
                  <View style={{ paddingLeft: pxToDp(30) }}>
                    <View style={styles.couponPrice}>
                      <Text style={styles.rmbIcon}>¥</Text><Text style={styles.amount}>{formatSinglePrice(item.discountAmount)}</Text>
                    </View>
                    <Text style={styles.couponType}>{item.scope === 1 ? '平台' : item.scope === 2 ? '店铺' : '商品'}优惠券</Text>
                  </View>

                  <View style={{ marginLeft: pxToDp(30) }}>
                    <Text style={styles.couponName}>{item.name}</Text>
                    <Text style={styles.couponRule}>满{formatSinglePrice(item.fullAmount)}元可用</Text>
                    <Text style={styles.couponDate}>有效期 {`${moment(item.usefulTimeStart).format('YYYY.MM.DD')}-${moment(item.usefulTimeEnd).format('YYYY.MM.DD')}`}</Text>
                  </View>
                </View>

                <TouchableWithoutFeedback onPress={() => getCoupon(item)}>
                  <View style={styles.getCoupon}>
                    <Text style={styles.getCouponText}>{item.isReceived ? '已经领取' : '立即领取'}</Text>
                  </View>
                </TouchableWithoutFeedback>

              </ImageBackground>
            )
          })
        }
      </View>

      <TouchableOpacity onPress={props.hideCouponActionSheet}>
        <View style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>关闭</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: pxToDp(20),
    paddingTop: pxToDp(40),
    backgroundColor: Colors.whiteColor
  },
  closeBtn: {
    height: isNotchScreen() ? pxToDp(128) : pxToDp(98),
    paddingBottom: isNotchScreen() ? pxToDp(28) : 0,
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeBtnText: {
    fontSize: pxToDp(32),
    fontWeight: '500',
    color: Colors.whiteColor
  },
  title: {
    textAlign: 'center',
    fontSize: pxToDp(32),
    color: Colors.darkBlack,
    fontWeight: '500',
    lineHeight: pxToDp(45)
  },
  text: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack
  },
  couponBgi: {
    width: pxToDp(710),
    height: pxToDp(140),
    marginBottom: pxToDp(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  getCoupon: {
    width: pxToDp(180),
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  getCouponText: {
    fontSize: pxToDp(28),
    fontWeight: '500',
    color: Colors.whiteColor
  },
  couponContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  couponPrice: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  rmbIcon: {
    fontSize: pxToDp(28),
    color: Colors.whiteColor
  },
  amount: {
    fontSize: pxToDp(48),
    color: Colors.whiteColor,
    fontWeight: '500',
    marginLeft: pxToDp(5)
  },
  couponType: {
    fontSize: pxToDp(24),
    color: Colors.whiteColor,
    fontWeight: '500',
    marginTop: pxToDp(5)
  },
  couponName: {
    fontSize: pxToDp(28),
    color: Colors.whiteColor,
    lineHeight: pxToDp(40)
  },
  couponRule: {
    fontSize: pxToDp(24),
    color: Colors.whiteColor
  },
  couponDate: {
    fontSize: pxToDp(20),
    color: Colors.whiteColor
  }
})