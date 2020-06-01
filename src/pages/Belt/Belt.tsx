import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { apiGetBeltList } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'
import checkIsBottom from '../../utils/checkIsBottom'

import LoadMore from '../../components/LoadMore/LoadMore'
import GoodsCardRow from '../../components/GoodsCardRow/GoodsCardRow'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

const pageSize = 20

export default function Belt() {
  const navigation: any = useNavigation()
  
  let pageNoRef = useRef(1)
  let hasMoreRef = useRef(true)
  
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [goodsList, setGoodsList]: Array<any> = useState([])

  navigation.setOptions({
    headerTitle: '产业带',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false,
    headerTransparent: true
  })

  useEffect(() => {
    getBeltGoodsList()
  }, [])

  /**
   * 获取产业带商品列表
   */
  const getBeltGoodsList = () => {
    apiGetBeltList({
      pageNo: pageNoRef.current,
      pageSize
    }).then((res: any) => {
      console.log(res, '产业带数据')
      setNetWorkErr(false)
      if (res.count) {
        const totalPage = Math.ceil(res.count / pageSize)

        hasMoreRef.current = pageNoRef.current < totalPage

        setGoodsList([...goodsList, ...res.list])
      }
    }).catch((err: any) => {
      console.log('产业带数据', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 触底加载
   */
  const onReachBottom = (e: any) => {
    if (hasMoreRef.current && checkIsBottom(e)) {
      pageNoRef.current += 1
      getBeltGoodsList()
    }
  }

  if (netWorkErr) return <NetWorkErr reload={getBeltGoodsList} />

  return (
    <>
      <Image
        resizeMode='cover'
        style={styles.headerImg}
        source={require('../../assets/belt-image/belt_bgi.png')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => onReachBottom(e)}
      >
        {
          goodsList && goodsList.map((item: any, index: number) => {
            return (
              <GoodsCardRow style={index && { marginTop: pxToDp(10) }} key={`goods-${index}`} goodsInfo={item} />
            )
          })
        }
        <LoadMore hasMore={hasMoreRef.current} />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  headerImg: {
    width: '100%',
    height: pxToDp(460)
  }
})