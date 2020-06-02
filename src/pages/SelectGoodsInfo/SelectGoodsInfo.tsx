import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Colors } from '../../constants/Theme'
import { Ionicons } from '@expo/vector-icons'

import { apiSelectGoodsInfo } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import formatSinglePrice from '../../utils/formatGoodsPrice'

import Swiper from './Swiper/Swiper'
import GoodsCard from './GoodsCard/GoodsCard'
import CardTitle from '../../components/CardTitle/CardTitle'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

export default function SelectGoodsInfo() {
  const route: any = useRoute()
  const navigation: any = useNavigation()

  const [goodsInfo, setGoodsInfo]: any = useState({})
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [goodsList, setGoodsList]: Array<any> = useState([])
  const [swiperList, setSwiperList]: Array<any> = useState([])

  navigation.setOptions({
    headerTitle: '',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false,
    headerTransparent: true
  })

  useEffect(() => {
    getSelectedInfo()
  }, [])

  const getSelectedInfo = () => {
    apiSelectGoodsInfo({
      goods_id: route.params.id
    }).then((res: any) => {
      console.log('精选好物详情', res)
      setNetWorkErr(false)
      setSwiperList(res.goods_img)
      setGoodsInfo(res.goods)
      setGoodsList(res.recommend)
    }).catch((err: any) => {
      console.log('精选好物详情', err)
      setNetWorkErr(true)
    })
  }

  const toGoodsInfo = () => {
    const id = goodsInfo.goods_id
    navigation.push('GoodsInfo', { id })
  }

  if (netWorkErr) return <NetWorkErr reload={getSelectedInfo} />

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} bounces={false}>
        {/* 轮播题 */}
        <Swiper swiperList={swiperList} />
        {/* 商品信息 */}
        <View style={styles.goodsInfo}>
          <Text style={styles.goodsName} numberOfLines={1}>{goodsInfo.goods_name}</Text>
          <Text style={styles.content}>{goodsInfo.content}</Text>
        </View>
        {/* 推荐商品列表 */}
        <View style={styles.goodsList}>
          <CardTitle title='你可能还想看' />
          <View style={styles.goodsListContainer}>
            {
              goodsList && goodsList.map((item: any, index: number) => {
                return (
                  <GoodsCard key={`goods-${index}`} goodsInfo={item} style={{ marginBottom: pxToDp(20) }} />
                )
              })
            }
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerActionBar}>
        <View style={styles.footerLeft}>
          <Ionicons
            size={20}
            name={goodsInfo.is_like ? 'ios-heart' : 'ios-heart-empty'}
            color={goodsInfo.is_like ? Colors.basicColor : Colors.lightGrey}
          />
          <Text style={styles.likesCount}>{goodsInfo?.people_like || 0}人喜欢</Text>
        </View>
        <TouchableOpacity onPress={toGoodsInfo} style={styles.footerRight}>
          <Text style={styles.goodsPrice}>¥{formatSinglePrice(goodsInfo?.shop_price || 0)}去看看</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingBottom: pxToDp(98)
  },
  goodsInfo: {
    backgroundColor: Colors.whiteColor,
    padding: pxToDp(20),
    marginBottom: pxToDp(10)
  },
  goodsName: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    marginBottom: pxToDp(14)
  },
  content: {
    fontSize: pxToDp(24),
    color: Colors.lightBlack,
    lineHeight: pxToDp(33)
  },
  goodsList: {
    backgroundColor: Colors.whiteColor,
    padding: pxToDp(20)
  },
  goodsListContainer: {
    marginTop: pxToDp(37),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  footerActionBar: {
    width: '100%',
    height: pxToDp(98),
    flexDirection: 'row'
  },
  footerLeft: {
    flex: 1,
    backgroundColor: Colors.blackColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerRight: {
    flex: 1,
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  goodsPrice: {
    fontSize: pxToDp(28),
    color: Colors.whiteColor,
    fontWeight: '500'
  },
  likesCount: {
    fontSize: pxToDp(28),
    color: Colors.whiteColor,
    fontWeight: '500',
    marginLeft: pxToDp(15)
  }
})