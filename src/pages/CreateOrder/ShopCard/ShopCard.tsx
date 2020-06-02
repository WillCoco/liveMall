import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TextInput } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import formatSinglePrice from '../../../utils/formatGoodsPrice'

interface Props {
  shopInfo: {
    shop_info: any
    selectedGoods: any
  }
  showCoupon: (arg0: number) => void
  inputMemo: (arg0: string, arg1: any) => void
}

export default function ShopCard(props: Props) {
  const navigation: any = useNavigation()
  const { shop_info, selectedGoods } = props.shopInfo

  const toBrandShop = () => {
    navigation.push('BrandShop', { id: shop_info.brand_id })
  }

  return (
    <View style={styles.container}>

      {/* 店铺 头部区域 */}
      <TouchableWithoutFeedback onPress={toBrandShop}>
        <View style={styles.shopHeader}>
          <Image source={{ uri: shop_info.shop_logo }} style={styles.shopLogo} />
          <Text style={styles.shopName}>{shop_info.shop_name}</Text>
          <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
        </View>
      </TouchableWithoutFeedback>

      {/* 商品信息 */}
      {
        selectedGoods.map((item: any, index: number) => {
          return (
            <View style={styles.goodsItem} key={`goods-${index}`}>
              <Image source={{ uri: item.original_img }} style={styles.goodsImg} />
              <View style={styles.goodsInfo}>
                <Text style={styles.goodsName} numberOfLines={2}>{item.goods_name}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.goodsSku} numberOfLines={1}>{item.spec_key_name}</Text>
                </View>
              </View>
              <View style={styles.goodsPrice}>
                <View style={styles.price}>
                  <Text style={{
                    fontSize: pxToDp(24),
                    color: Colors.darkBlack
                  }}>¥</Text><Text style={{
                    fontSize: pxToDp(28),
                    color: Colors.darkBlack
                  }}>{formatSinglePrice(item.shop_price)}</Text>
                </View>
                <Text style={styles.goodsCount}>x{item.goods_num}</Text>
              </View>
            </View>
          )
        })
      }

      {/* 订单信息 */}
      <View style={styles.orderInfo}>

        <View style={styles.orderInfoItem}>
          <Text style={styles.label}>配送方式</Text>
          <View style={styles.value}>
            <Text style={styles.valueText}>快递</Text>
            <View style={styles.memo}>
              <Text style={styles.memoText}>{shop_info.carriage ? formatSinglePrice(shop_info.carriage) : '包邮'}</Text>
            </View>
          </View>
        </View>

        {
          shop_info.discountDesc && <View style={styles.orderInfoItem}>
            <Text style={styles.label}>金牌会员优惠</Text>
            <View style={styles.value}>
              <Text style={styles.valueText}>{shop_info.discountDesc}</Text>
              <View style={styles.memo}>
                <Text style={[styles.memoText, { color: Colors.basicColor }]}>-¥{formatSinglePrice(shop_info.saleDiscount)}</Text>
              </View>
            </View>
          </View>
        }

        <View style={styles.orderInfoItem}>
          <Text style={styles.label}>店铺优惠</Text>
          {
            shop_info.couponList.length !== 1
              ? <TouchableWithoutFeedback onPress={() => props.showCoupon(shop_info.shop_id)}>
                {
                  shop_info.choosedCoupon && shop_info.choosedCoupon.id === -1
                    ? <Text>不使用优惠券</Text>
                    : <View style={styles.value}>
                      <Text style={styles.valueText}>{`满${formatSinglePrice(shop_info.choosedCoupon.fullAmount)}减${formatSinglePrice(shop_info.choosedCoupon.discountAmount)}`}</Text>
                      <View style={styles.memo}>
                        <Text style={[styles.memoText, { color: Colors.basicColor }]}>-¥{formatSinglePrice(shop_info.choosedCoupon.discountAmount)}</Text>
                        <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
                      </View>
                    </View>
                }

              </TouchableWithoutFeedback>
              : <Text>暂无可用优惠券</Text>
          }
        </View>

        <View style={styles.orderInfoItem}>
          <Text style={styles.label}>订单备注</Text>
          <View style={styles.value}>
            <TextInput
              placeholder='请输入备注信息'
              onChangeText={(text) => props.inputMemo(text, shop_info.shop_id)}
              returnKeyType='done'
            />
          </View>
        </View>
      </View>

      <View style={styles.shopCardTotalInfo}>
        <Text style={{
          fontSize: pxToDp(24),
          color: Colors.darkGrey,
          marginRight: pxToDp(10)
        }}>共{selectedGoods.length}件</Text>
        <Text style={{
          fontSize: pxToDp(24),
          color: Colors.darkBlack
        }}>小计：</Text>
        <Text style={{
          fontSize: pxToDp(24),
          color: Colors.basicColor
        }}>¥</Text>
        <Text style={{
          fontSize: pxToDp(32),
          color: Colors.basicColor
        }}>{formatSinglePrice(shop_info.totalPrice)}</Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    padding: pxToDp(20),
    borderRadius: pxToDp(16),
    marginTop: pxToDp(20),
    marginBottom: pxToDp(20)
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pxToDp(20)
  },
  shopLogo: {
    width: pxToDp(64),
    height: pxToDp(64),
    borderRadius: pxToDp(32)
  },
  shopName: {
    fontSize: pxToDp(32),
    color: Colors.blackColor,
    fontWeight: '600',
    marginLeft: pxToDp(10),
    marginRight: pxToDp(10)
  },
  goodsItem: {
    flexDirection: 'row',
    marginBottom: pxToDp(20)
  },
  goodsImg: {
    width: pxToDp(180),
    height: pxToDp(180),
    borderRadius: pxToDp(10),
    backgroundColor: Colors.lightGrey
  },
  goodsInfo: {
    marginLeft: pxToDp(20)
  },
  goodsName: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    fontWeight: '500',
    lineHeight: pxToDp(36),
    maxWidth: pxToDp(330)
  },
  goodsSku: {
    backgroundColor: Colors.bgColor,
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    height: pxToDp(44),
    lineHeight: pxToDp(44),
    borderRadius: pxToDp(4),
    marginTop: pxToDp(20),
    maxWidth: pxToDp(330)
  },
  goodsPrice: {
    flex: 1
  },
  price: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  goodsCount: {
    alignSelf: 'flex-end',
    fontSize: pxToDp(26),
    fontWeight: '500',
    color: Colors.darkGrey
  },
  orderInfo: {

  },
  orderInfoItem: {
    height: pxToDp(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    fontWeight: '500',
    width: pxToDp(174),
    textAlign: 'right'
  },
  value: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: pxToDp(20)
  },
  valueText: {
    fontSize: pxToDp(26),
    color: Colors.lightGrey
  },
  memo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  memoText: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    marginRight: pxToDp(16)
  },
  shopCardTotalInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    marginTop: pxToDp(20)
  }
})
