import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { apiGetEnshrine } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'

import GoodsCard from '../../components/GoodsCardRow/GoodsCardRow'
import LoadMore from '../../components/LoadMore/LoadMore'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

const pageSize = 20

export default function CollectGoods() {
  let pageNoRef = useRef(1)
  let hasMoreRef = useRef(true)

  const navigation: any = useNavigation()
  
  const [complete, setComplete] = useState(false)
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [goodsList, setGoodsList]: Array<any> = useState([])

  navigation.setOptions({
    headerTitle: '商品收藏',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    getMyCollectGoods()
  }, [])

  const getMyCollectGoods = () => {
    apiGetEnshrine({
      pageNo: pageNoRef.current,
      pageSize
    }).then((res: any) => {
      console.log('我的收藏', res)
      setNetWorkErr(false)
      setComplete(true)
      if (!res.count) return
      const totalPage = Math.ceil(res.count / pageSize)
      hasMoreRef.current = pageNoRef.current < totalPage
      setGoodsList([...goodsList, ...res.list])
    }).catch((err: any) => {
      console.log('我的收藏', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 触底加载
   */
  const onBeachBottom = () => {
    if (!hasMoreRef.current) return
    pageNoRef.current += 1
    getMyCollectGoods()
  }

  if (netWorkErr) return <NetWorkErr reload={getMyCollectGoods} />

  if (!goodsList.length && complete) {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../assets/images/img_nocollect.png')} style={styles.emptyImg}>
          <Text style={styles.emptyText}>暂无收藏</Text>
        </ImageBackground>
      </View>
    )
  }

  return (
    <ScrollView
      onMomentumScrollEnd={onBeachBottom}
    >
      {
        goodsList.map((item: any, index: number) => {
          return (
            <GoodsCard
              goodsInfo={item}
              key={`goods-${index}`}
              style={index && { marginTop: pxToDp(10) }}
            />
          )
        })
      }
      <LoadMore hasMore={hasMoreRef.current} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyImg: {
    width: pxToDp(380),
    height: pxToDp(360),
  },
  emptyText: {
    fontSize: pxToDp(28),
    color: Colors.lightBlack,
    textAlign: 'center',
    marginTop: pxToDp(298)
  }
})