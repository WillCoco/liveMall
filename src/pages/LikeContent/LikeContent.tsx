import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { apiGetUserFavorite } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import waterFall from '../../utils/waterFall'
import { Colors } from '../../constants/Theme'
import checkIsBottom from '../../utils/checkIsBottom'

import MasonryList from '@appandflow/masonry-list'

import WorkCard from '../../components/WorkCard/WorkCard'
import LoadMore from '../../components/LoadMore/LoadMore'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

const pageSize = 20

export default function LikeContent() {
  const pageNoRef = useRef(1)
  const hasMoreRef = useRef(true)

  const navigation: any = useNavigation()
  
  // const [maxHeight, setMaxHeight] = useState(0)
  const [isEmpty, setIsEmpty] = useState(false)
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [worksList, setWorksList]: Array<any> = useState([])

  navigation.setOptions({
    headerTitle: '喜欢的内容',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    getWorksList()
  }, [])

  const getWorksList = () => {
    apiGetUserFavorite({
      page: pageNoRef.current,
      pageSize
    }).then((res: any) => {
      console.log('我喜欢的内容', res)
      setNetWorkErr(false)
      setIsEmpty(!res.totalCount)
      if (!res.totalCount) return

      res.worksInfoList.forEach((item: any) => {
        item.imageWidth = item.worksMoreInfo.imageWidth
        item.imageHeight = item.worksMoreInfo.imageHeight
      })

      let tempList = [...worksList, ...waterFall(res.worksInfoList).items]
      // let maxH = waterFall(tempList).maxHeight

      const totalPage = Math.ceil(res.totalCount / pageSize)

      hasMoreRef.current = pageNoRef.current < totalPage

      setWorksList(tempList)
      // setMaxHeight(maxH)
    }).catch((err: any) => {
      console.log('我喜欢的内容', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 触底加载
   */
  const onReachBottom = (e: any) => {
    if (hasMoreRef.current && checkIsBottom(e)) {
      pageNoRef.current += 1
      getWorksList()
    }
  }

  if (netWorkErr) return <NetWorkErr reload={getWorksList} />

  if (isEmpty) {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../assets/images/img_empty-like.png')} style={styles.emptyImg}>
          <Text style={styles.emptyText}>暂无喜欢的内容</Text>
        </ImageBackground>
      </View>
    )
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={(e) => onReachBottom(e)}
      style={{ padding: pxToDp(10), paddingRight: 0 }}
    >
      <MasonryList
        numColumns={2}
        data={worksList}
        keyExtractor={(item: any, index: number) => `goods-${index}` }
        renderItem={({ item }) => <WorkCard workInfo={item} />}
        getHeightForItem={({ item }) => item.height}
      />
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
    height: pxToDp(360)
  },
  emptyText: {
    fontSize: pxToDp(28),
    color: Colors.darkGrey,
    textAlign: 'center',
    marginTop: pxToDp(298)
  }
})