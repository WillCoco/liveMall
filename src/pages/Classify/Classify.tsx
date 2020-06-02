import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { apiGetClassifyList, apiGetClassifyGoodsList } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'

import ClassiftyTab from './ClassifyTab/ClassifyTab'
import SearchBar from '../../components/SearchBar/SearchBar'
import ClassifyContent from './ClassifyContent/ClassifyContent'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

const pageSize = 20

export default function Classify() {
  const navigation: any = useNavigation()
  const [pageNo, setPageNo] = useState(1)
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [goodsList, setGoodsList]: Array<any> = useState([])
  const [classifyTabs, setClassifyTabs]: Array<any> = useState([])

  navigation.setOptions({
    headerTitle: '分类',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    getClassifyTabs()
  }, [])

  /**
   * 获取标签
   */
  const getClassifyTabs = () => {
    apiGetClassifyList().then((res: any) => {
      setNetWorkErr(false)
      console.log(res, '分类标签')
      res.categoryList.forEach((item: any, index: number) => {
        item.active = false
        res.categoryList[0].active = true
      })
      setClassifyTabs(res.categoryList)
      getGoodsList(res.categoryList[0].id)
    }).catch((err: any) => {
      console.log('分类标签', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 获取标签对应的商品列表
   * @param id 标签 id 
   */
  const getGoodsList = (id: number) => {
    apiGetClassifyGoodsList({ pageNo, pageSize, id }).then((res: { goodsList: Array<any> }) => {
      setNetWorkErr(false)
      console.log(res, '当前标签对应的商品列表')
      setGoodsList(res.goodsList)
    }).catch((err: any) => {
      console.log('当前标签对应的商品列表', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 切换标签
   * @param index 索引值
   */
  const changeTab = (index: number) => {
    classifyTabs.forEach((item: any) => {
      item.active = false
      classifyTabs[index].active = true
    })

    setClassifyTabs(JSON.parse(JSON.stringify(classifyTabs)))

    getGoodsList(classifyTabs[index].id)
  }

  if (netWorkErr) return <NetWorkErr reload={getClassifyTabs} />

  return (
    <>
      <View style={styles.searchBar}>
        <SearchBar
          hasSearchKey={false}
          isPlaceHolder={true}
          iconColor={Colors.darkGrey}
          searchKeyStyle={{ color: Colors.darkGrey }}
          searchBarStyle={{ backgroundColor: Colors.bgColor }}
          toSearchPage={() => navigation.navigate('HomeSearch')}
        />
      </View>
      <View style={styles.content}>
        <ClassiftyTab tabs={classifyTabs} changeTab={(index: number) => changeTab(index)} />
        <ClassifyContent goodsList={goodsList} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    minHeight: '90%'
  },
  searchBar: {
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    paddingTop: pxToDp(20),
    paddingBottom: pxToDp(40)
  }
})