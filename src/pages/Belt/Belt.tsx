import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { apiGetBeltList } from '../../service/api'
import GoodsCardRow from '../../components/GoodsCardRow/GoodsCardRow'

import { Colors } from '../../constants/Theme'
import pxToDp from '../../utils/px2dp'

export default function Belt() {
  const navigation = useNavigation()
  const [pageNo, setPageNo] = useState(1)
  const [goodsList, setGoodsList] = useState([])
  const pageSize = 20

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
    apiGetBeltList({ pageNo, pageSize }).then((res: any) => {
      console.log(res, '产业带数据')
      if (res.list.length) setGoodsList(res.list)
    })
  }

  return (
    <View style={styles.container}>
      <Image
        resizeMode='contain'
        style={styles.headerImg}
        source={require('../../assets/belt-image/belt_bgi.png')}
      />
      <ScrollView>
        {
          goodsList && goodsList.map((item, index) => {
            return (
              <GoodsCardRow style={index && { marginTop: pxToDp(10) }} key={`goods-${index}`} goodsInfo={item} />
            )
          })
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  headerImg: {
    width: '100%',
    height: pxToDp(460)
  }
})