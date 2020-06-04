import React from 'react'
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet, PixelRatio } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

import CardTitle from '../../../components/CardTitle/CardTitle'
import GoodsCard from '../../../components/GoodsCard/GoodsCard'

interface Props {
  categoryData: {
    list: Array<any>
    shopGoods: Array<any>
  }
}

export default function BrandTab(props: Props) {
  const { categoryData } = props

  const { list: brandList, shopGoods } = categoryData

  const navigation = useNavigation()

  /**
   * 前往品牌店铺
   */
  const toBrandShop = (id: number) => {
    navigation.navigate('BrandShop', { id })
  }

  return (
    <>
      {/* 品牌精选 */}
      <View style={styles.brandList}>
        <CardTitle title='品牌精选' />
        <View style={styles.brandsContainer}>
          {
            brandList && brandList.map((item: any, index: number) => {
              return (
                <TouchableWithoutFeedback key={`brand-${index}`} onPress={() => toBrandShop(item.brand_id)}>
                  <View style={[styles.brandItem, !!((index + 1) % 4) && { marginRight: pxToDp(60) }]}>
                    <Image source={{ uri: item.logo }} style={styles.brandLogo} />
                    <Text style={styles.brandName}>{item.name}</Text>
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }
        </View>
      </View>
      {/* 云闪播热卖 */}
      <View style={styles.recommendGoodsList}>
        <CardTitle title='云闪播热卖' />
        <View style={styles.recommendGoodsListContainer}>
          {
            shopGoods
            && shopGoods.map((item: any, index: any) => {
              return (
                <GoodsCard
                  key={`recommend-${index}`}
                  style={{ marginBottom: pxToDp(20) }}
                  goodsInfo={item}
                  tapGoodsCard={(id: number) => navigation.navigate('GoodsInfo', { id })}
                />
              )

            })
          }
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  brandList: {
    padding: pxToDp(20),
    paddingBottom: 0,
    backgroundColor: Colors.whiteColor
  },
  brandsContainer: {
    marginTop: pxToDp(20),
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  brandItem: {
    alignItems: 'center',
    marginBottom: pxToDp(30),
  },
  brandLogo: {
    width: pxToDp(112),
    height: pxToDp(112),
    marginBottom: pxToDp(16),
    borderRadius: pxToDp(56),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.bgColor
  },
  brandName: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack
  },
  recommendGoodsList: {
    marginTop: pxToDp(20),
    padding: pxToDp(20),
    backgroundColor: Colors.whiteColor
  },
  recommendGoodsListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: pxToDp(36),
    justifyContent: 'space-between'
  }
})