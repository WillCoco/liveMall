import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, PixelRatio } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'
import formatSinglePrice from '../../utils/formatGoodsPrice'

interface Props {
  cartInfo: any
  cartItemAllSelect(shop_id: number): void
  addGoodsNum(shop_id: number, cart_id: number): void
  goodsSelect(shop_id: number, cart_id: number): void
  minusGoodsNum(shop_id: number, cart_id: number): void
}

export default function CartItem(props: Props) {
  const navigation: any = useNavigation()
  const { cartInfo } = props

  const toBrandShop = (id: number) => {
    navigation.navigate('BrandShop', { id })
  }

  const toGoodsInfo = (id: number) => {
    navigation.navigate('GoodsInfo', { id })
  }

  return (
    <View style={styles.container}>
      {/* 店铺信息 */}
      <View style={styles.cartHeader}>
        <TouchableWithoutFeedback onPress={() => props.cartItemAllSelect(cartInfo.shop_info.shop_id)}>
          {
            cartInfo.shop_info.is_selected
              ? <Ionicons name='ios-checkmark-circle' color={Colors.basicColor} size={20} />
              : <Ionicons name='ios-radio-button-off' color={Colors.darkGrey} size={20} />
          }
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => toBrandShop(cartInfo.shop_info.brand_id)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: cartInfo.shop_info.shop_logo }} style={styles.shopLogo} />
            <Text style={styles.shopName}>{cartInfo.shop_info.shop_name}</Text>
            <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* 商品列表 */}
      {
        cartInfo.list && cartInfo.list.map((item: any, index: number) => {
          return (
            <View key={`goods-${index}`} style={styles.goodsContainer}>
              <TouchableWithoutFeedback onPress={() => props.goodsSelect(cartInfo.shop_info.shop_id, item.cart_id)}>
                {
                  item.selected
                    ? <Ionicons style={{ alignSelf: 'center' }} name='ios-checkmark-circle' color={Colors.basicColor} size={20} />
                    : <Ionicons style={{ alignSelf: 'center' }} name='ios-radio-button-off' color={Colors.darkGrey} size={20} />
                }
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={() => toGoodsInfo(item.goods_id)}>
                <Image source={{ uri: item.original_img }} style={styles.goodsImg} />
              </TouchableWithoutFeedback>

              <View>

                <TouchableWithoutFeedback onPress={() => toGoodsInfo(item.goods_id)}>
                  <Text style={styles.goodName} numberOfLines={2}>{item.goods_name}</Text>
                </TouchableWithoutFeedback>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.sku} numberOfLines={2}>{item.spec_key_name}</Text>
                </View>

                <View style={styles.actionContent}>
                  <View style={styles.price}>
                    <Text style={styles.rmbIcon}>¥</Text>
                    <Text style={styles.salePrice}>{formatSinglePrice(item.shop_price)}</Text>
                    <Text style={styles.originalPrice}>¥{formatSinglePrice(item.market_price)}</Text>
                  </View>

                  {/* 步进器 */}
                  <View style={styles.stepper}>
                    <TouchableWithoutFeedback
                      onPress={
                        () => {
                          if (item.goods_num === 1) return
                          props.minusGoodsNum(cartInfo.shop_info.shop_id, item.cart_id)
                        }
                      }>
                      <View style={styles.action}>
                        <Ionicons
                          size={20}
                          name='ios-remove'
                          color={Colors.darkBlack}
                        />
                      </View>
                    </TouchableWithoutFeedback>

                    <View style={styles.count}>
                      <Text>{item.goods_num}</Text>
                    </View>

                    <TouchableWithoutFeedback onPress={
                      () => {
                        if (item.goods_num < item.goods_count) {
                          props.addGoodsNum(cartInfo.shop_info.shop_id, item.cart_id)
                        }
                      }
                    }>
                      <View style={styles.action}>
                        <Ionicons
                          size={20}
                          name='ios-add'
                          color={Colors.darkBlack}
                        />
                      </View>
                    </TouchableWithoutFeedback>

                  </View>

                </View>
              </View>
            </View>
          )
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: pxToDp(20),
    backgroundColor: Colors.whiteColor,
    marginBottom: pxToDp(10)
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pxToDp(15)
  },
  shopLogo: {
    width: pxToDp(64),
    height: pxToDp(64),
    borderRadius: pxToDp(32),
    marginLeft: pxToDp(25),
    marginRight: pxToDp(10)
  },
  shopName: {
    fontSize: pxToDp(30),
    fontWeight: '600',
    color: Colors.blackColor,
    marginRight: pxToDp(10)
  },
  goodsContainer: {
    flexDirection: 'row',
    paddingTop: pxToDp(20),
    paddingBottom: pxToDp(20)
  },
  goodsImg: {
    width: pxToDp(180),
    height: pxToDp(180),
    marginLeft: pxToDp(30),
    marginRight: pxToDp(20)
  },
  goodName: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(36),
    color: Colors.darkBlack,
    fontWeight: '500',
    width: pxToDp(454)
  },
  sku: {
    backgroundColor: Colors.bgColor,
    padding: pxToDp(10),
    paddingTop: pxToDp(5),
    paddingBottom: pxToDp(5),
    borderRadius: pxToDp(4),
    overflow: 'hidden',
    marginTop: pxToDp(20),
    lineHeight: pxToDp(36),
    maxWidth: pxToDp(454),
    fontSize: pxToDp(28),
    color: Colors.darkGrey
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: pxToDp(20)
  },
  price: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rmbIcon: {
    fontSize: pxToDp(24),
    color: Colors.basicColor
  },
  salePrice: {
    fontSize: pxToDp(34),
    color: Colors.basicColor,
    marginRight: pxToDp(15)
  },
  originalPrice: {
    fontSize: pxToDp(24),
    color: Colors.darkGrey,
    textDecorationLine: 'line-through'
  },
  stepper: {
    width: pxToDp(180),
    height: pxToDp(40),
    borderRadius: pxToDp(10),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.borderColor,
    flexDirection: 'row',
    alignItems: 'center'
  },
  action: {
    width: pxToDp(50),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  count: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftColor: Colors.borderColor,
    borderLeftWidth: 1 / PixelRatio.get(),
    borderRightColor: Colors.borderColor,
    borderRightWidth: 1 / PixelRatio.get()
  }
})