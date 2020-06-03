import React from 'react'
import { View, Text, StyleSheet, Platform, PixelRatio, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Stepper from '../../../components/Stepper/Stepper'

import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import formatSinglePrice from '../../../utils/formatGoodsPrice'
import { isIphone11, isNotchScreen } from '../../../constants/DeviceInfo'

interface Props {
  curSku: string;
  sku: Array<any>;
  curSkuInfo: any;
  goodsNum: number;
  buttonType: string;
  addCount(): void;
  nextAction(): void;
  minusCount(): void;
  hideGoodsSkuActionSheet(): void;
  changeSku(key: string, index: number): void;
}

export default function GoodsSKu(props: Props) {
  const { sku, curSku, curSkuInfo, goodsNum, buttonType } = props

  return (
    <View>
      <View>
        {/* 商品信息 */}
        <View style={styles.goodsInfo}>
          <Image source={{ uri: curSkuInfo.img_url }} style={styles.goodsImg} />
          <View style={styles.goodsDetail}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.rmbIcon}>¥</Text><Text style={styles.goodsPrice}>{formatSinglePrice(curSkuInfo.shop_price)}</Text>
            </View>
            <Text style={{ fontSize: pxToDp(28), lineHeight: pxToDp(40) }}>库存{curSkuInfo.goods_count}件</Text>
            <Text style={{ fontSize: pxToDp(28), lineHeight: pxToDp(40) }}>已选：{curSku.split('_').join(',')}</Text>
            <Text style={{ fontSize: pxToDp(24), lineHeight: pxToDp(40) }}>此商品可及时发货（预计3天内发货）</Text>
          </View>
          <TouchableOpacity onPress={props.hideGoodsSkuActionSheet}>
            <Ionicons
              size={25}
              name='ios-close-circle-outline'
              color={Colors.darkGrey}
            />
          </TouchableOpacity>
        </View>

        {/* 规格 */}
        {
          sku.map((item: any, index: number) => {
            return (
              <View key={`sku-${index}`} style={styles.sku}>
                <Text style={{
                  fontSize: pxToDp(28),
                  color: Colors.darkBlack,
                  lineHeight: pxToDp(40),
                  fontWeight: '500',
                  marginBottom: pxToDp(24)
                }}>{item.key}</Text>
                <View style={styles.skuContent}>
                  {
                    item.options && item.options.map((_item: any, _index: number) => {
                      return (
                        <Text
                          key={`sku-info-${_index}`}
                          style={[styles.skuInfo, _item.checked && styles.isChecked]}
                          onPress={() => props.changeSku(item.key, _index)}
                        >{_item.text}</Text>
                      )
                    })
                  }
                </View>
              </View>
            )
          })
        }

        {/* 购买数量 */}
        <View style={styles.goodsCount}>
          <Text style={styles.goodsCountText}>购买数量</Text>
          <Stepper
            minusCount={props.minusCount}
            addCount={props.addCount}
            goodsNum={goodsNum}
          />
        </View>
      </View>

      <TouchableOpacity onPress={props.nextAction}>
        <View style={styles.addToCart}>
          <Text style={styles.addToCartText}>{buttonType === 'add' ? '加入购物车' : '立即购买'}</Text>
        </View>
      </TouchableOpacity>
    </View>

  )
}

const styles = StyleSheet.create({
  addToCart: {
    height: isNotchScreen() ? pxToDp(128) : pxToDp(98),
    paddingBottom: isNotchScreen() ? pxToDp(28) : 0,
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addToCartText: {
    fontSize: pxToDp(32),
    fontWeight: '500',
    color: Colors.whiteColor
  },
  goodsInfo: {
    padding: pxToDp(20),
    paddingBottom: pxToDp(30),
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: 'row'
  },
  goodsImg: {
    width: pxToDp(238),
    height: pxToDp(238),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.borderColor,
    borderRadius: pxToDp(10)
  },
  goodsDetail: {
    marginTop: pxToDp(10),
    marginLeft: pxToDp(20),
    width: pxToDp(405)
  },
  rmbIcon: {
    fontSize: pxToDp(24),
    color: Colors.basicColor
  },
  goodsPrice: {
    fontSize: pxToDp(34),
    color: Colors.basicColor,
    fontWeight: '500',
    lineHeight: pxToDp(33),
    marginBottom: pxToDp(10)
  },
  sku: {
    padding: pxToDp(20),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: Colors.borderColor
  },
  skuContent: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  skuInfo: {
    backgroundColor: Colors.bgColor,
    padding: pxToDp(20),
    paddingTop: pxToDp(10),
    paddingBottom: pxToDp(10),
    marginBottom: pxToDp(25),
    marginRight: pxToDp(25),
    borderRadius: pxToDp(10),
    overflow: 'hidden',
    fontSize: pxToDp(24),
    color: Colors.darkBlack
  },
  isChecked: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.basicColor,
    backgroundColor: Colors.lightPink,
    color: Colors.basicColor
  },
  goodsCount: {
    padding: pxToDp(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: pxToDp(120),
    marginBottom: pxToDp(200),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: Colors.borderColor
  },
  goodsCountText: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    fontWeight: '500'
  }
})