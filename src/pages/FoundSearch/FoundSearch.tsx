import React, { useState, useRef } from 'react'
import { View, Text, ScrollView, ImageBackground, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import pxToDp from '../../utils/px2dp'
import Toast from 'react-native-tiny-toast'
import waterFall from '../../utils/waterFall'
import { Colors } from '../../constants/Theme'
import { apiSearchWork } from '../../service/api'
import checkIsBottom from '../../utils/checkIsBottom'

import MasonryList from '@appandflow/masonry-list'

import SearchBar from './SearchBar/SearchBar'
import WorkCard from '../../components/WorkCard/WorkCard'
import LoadMore from '../../components/LoadMore/LoadMore'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

const pageSize = 20

export default function FoundSearch() {
  const pageNoRef = useRef(1)
  const hasMoreRef = useRef(true)

  const navgation: any = useNavigation()

  navgation.setOptions({
    headerTitle: () => <SearchBar
      inputSearchKey={(text: string) => setSearchKey(text)}
      toSearch={toSearch}
    />,
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  // const [maxHeight, setMaxHeight] = useState(0)
  const [isEmpty, setIsEmpty] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [worksList, setWorksList]: Array<any> = useState([])

  const toSearch = () => {
    if (!searchKey) {
      Toast.show('搜索关键字不能为空', { position: 0 })
      return
    }

    const params = {
      page: pageNoRef.current,
      pageSize,
      searchKeyword: searchKey
    }

    apiSearchWork(params).then((res: any) => {
      console.log('发现搜索', res)
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
      console.log('发现搜索', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 触底加载
   */
  const onReachBottom = (e: any) => {
    if (hasMoreRef.current && checkIsBottom(e)) {
      pageNoRef.current += 1
      toSearch()
    }
  }

  if (netWorkErr) return <NetWorkErr reload={toSearch} />

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <ImageBackground source={require('../../assets/images/emptyList.png')} style={styles.emptyImg}>
          <Text style={{ fontSize: pxToDp(24), color: Colors.darkGrey, textAlign: 'center' }}>没有找到你想要的，换个关键词试试吧</Text>
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
        renderItem={({ item }) => <WorkCard workInfo={item} />}
        getHeightForItem={({ item }) => item.height}
      />
      {!!worksList.length && <LoadMore hasMore={hasMoreRef.current} />}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyImg: {
    width: pxToDp(380),
    height: pxToDp(360),
    paddingTop: pxToDp(300)
  }
})