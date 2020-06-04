import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, PixelRatio } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

import formatGoodsPrice from '../../../utils/formatGoodsPrice'

interface Props {
  brandInfo: any;
  isLogin: boolean;
  focusBrandShop(brandInfo: any): any;
}

function BrandCard(props: Props) {
  const navigation: any = useNavigation()
  const { brandInfo, isLogin } = props

  const { goods: goodsList } = brandInfo

  const toGoodsInfo = (id: number) => {
    navigation.navigate('GoodsInfo', { id })
  }

  const toBrandShop = () => {
    const { brand_id: id } = brandInfo
    navigation.navigate('BrandShop', { id })
  }

  /**
   * 关注、取消关注
   */
  const focusBrandShop = () => {
    if (!isLogin) navigation.navigate('Login')

    props.focusBrandShop(brandInfo)
  }

  if (!goodsList) return <></>

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.brandHeader}>
        <TouchableWithoutFeedback onPress={toBrandShop}>
          <View style={styles.brandInfo}>
            <Image style={styles.brandLogo} source={{ uri: brandInfo?.logo || '' }} />
            <Text style={styles.brandName}>{brandInfo?.name || ''}</Text>
          </View>
        </TouchableWithoutFeedback>
        <Text
          onPress={focusBrandShop}
          style={[styles.focusText, brandInfo.is_focus ? styles.isFocus : styles.noFocus]}
        >{brandInfo.is_focus ? '已关注' : '关注'}</Text>
      </View>
      {/* 商品列表 */}
      <View style={styles.goodsList}>
        {
          goodsList && goodsList.map((item: any, index: number) => {
            return (
              <TouchableWithoutFeedback onPress={() => toGoodsInfo(item.goods_id)} key={`goods-${index}`}>
                <View style={styles.goodsItem}>
                  <Image source={{ uri: item.original_img }} style={styles.goodsImg} />
                  <View style={styles.goodsInfo}>
                    <Text style={styles.goodsName} numberOfLines={1}>{item.goods_name}</Text>
                    <View style={styles.goodsPrice}>
                      <Text style={styles.rmbIcon}>¥</Text>
                      <Text style={styles.salePrice}>{formatGoodsPrice(item.shop_price)}</Text>
                      <Text style={styles.originalPrice}>¥{formatGoodsPrice(item.market_price)}</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          })
        }
      </View>
    </View>
  )
}

export default connect(
  (state: any) => state.userData
)(BrandCard)

const styles = StyleSheet.create({
  container: {
    padding: pxToDp(20),
    paddingTop: pxToDp(30),
    paddingBottom: pxToDp(30),
    backgroundColor: Colors.whiteColor,
    marginBottom: pxToDp(10)
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: pxToDp(30)
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandLogo: {
    width: pxToDp(66),
    height: pxToDp(66),
    borderRadius: pxToDp(33)
  },
  brandName: {
    marginLeft: pxToDp(10),
    fontSize: pxToDp(30),
    color: Colors.darkBlack
  },
  focusText: {
    width: pxToDp(120),
    height: pxToDp(40),
    borderRadius: pxToDp(20),
    fontSize: pxToDp(26),
    lineHeight: pxToDp(40),
    textAlign: 'center',
    overflow: 'hidden',
    color: Colors.whiteColor
  },
  isFocus: {
    backgroundColor: Colors.bgColor,
    color: Colors.darkGrey
  },
  noFocus: {
    backgroundColor: Colors.basicColor
  },
  goodsList: {
    flexDirection: 'row'
  },
  goodsItem: {
    width: pxToDp(220),
    height: pxToDp(330),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.borderColor,
    borderRadius: pxToDp(10),
    overflow: 'hidden',
    marginRight: pxToDp(20)
  },
  goodsImg: {
    width: '100%',
    height: pxToDp(220),
    borderTopLeftRadius: pxToDp(10),
    borderTopRightRadius: pxToDp(10),
    overflow: 'hidden'
  },
  goodsInfo: {
    padding: pxToDp(10)
  },
  goodsName: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    fontWeight: '500',
    marginBottom: pxToDp(5)
  },
  goodsPrice: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  rmbIcon: {
    fontSize: pxToDp(24),
    color: Colors.basicColor
  },
  salePrice: {
    fontSize: pxToDp(34),
    color: Colors.basicColor,
    fontWeight: '400'
  },
  originalPrice: {
    fontSize: pxToDp(24),
    color: Colors.darkGrey,
    marginLeft: pxToDp(30),
    textDecorationLine: 'line-through'
  }
})