import React, { useEffect, useState, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

import { apiSelectGoodsTags, apiSelectGoodsList } from '../../service/api'

import { Colors } from '../../constants/Theme'
import checkIsBottom from '../../utils/checkIsBottom'

import GoodsCard from './GoodsCard/GoodsCard'
import LoadMore from '../../components/LoadMore/LoadMore'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'
// import NavBar from '../../components/NavBar'

const pageSize = 20

export default function SelectGoods() {
  const navigation: any = useNavigation()

  const indexRef: any = useRef(0)
  const pageNoRef: any = useRef(1)
  const hasMoreRef: any = useRef(true)
  const goodsListRef: any = useRef([])

  const [tags, setTags]: Array<any> = useState([])
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [goodsList, setGoodsList]: Array<any> = useState([])

  navigation.setOptions({
    headerTitle: '人气推荐',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    initData()
  }, [])

  /**
   * 初始化
   */
  const initData = () => {
    apiSelectGoodsTags().then((res: any) => {
      console.log('精选好物标签', res)
      if (res.category.length) {
        setNetWorkErr(false)
        setTags(res.category)
        getGoodsList(res.category[0].cat_id)
      }
    }).catch((err: any) => {
      console.log('精选好物标签', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 切换 TAB
   */
  const changeTab = (e: any) => {
    const { i } = e
    if (e.i === indexRef.current) return
    goodsListRef.current = []
    indexRef.current = i
    pageNoRef.current = 1
    setGoodsList(goodsListRef.current)
    getGoodsList(tags[i].cat_id)
  }

  /**
   * 获取商品列表
   */
  const getGoodsList = (id: number) => {
    const params = {
      pageNo: pageNoRef.current,
      pageSize,
      cat_id: id
    }

    apiSelectGoodsList(params).then((res: any) => {
      console.log('精选好物商品', res)
      if (res.count) {
        const totalPage = Math.ceil(res.count / pageSize)
        hasMoreRef.current = pageNoRef.current < totalPage
        goodsListRef.current = [...goodsListRef.current, ...res.list]
        setGoodsList(goodsListRef.current)
      }
    })
  }

  /**
   * 下拉触底
   */
  const onReachBottom = (e: any) => {
    if (hasMoreRef.current && checkIsBottom(e)) {
      pageNoRef.current += 1
      getGoodsList(tags[indexRef.current].cat_id)
    }
  }

  /**
   * 更新商品列表
   */
  const updateGoodsList = (id: number) => {
    goodsList.forEach((item: any) => {
      if (item.goods_id === id) {
        item.people_like = item.is_like ? item.people_like - 1 : item.people_like + 1
        item.is_like = item.is_like ? 0 : 1
      }
    })

    setGoodsList(JSON.parse(JSON.stringify(goodsList)))
  }

  if (netWorkErr) return <NetWorkErr reload={initData} />

  return (
    <>
      {/* <NavBar
        title="精选好物"
      /> */}

      <ScrollableTabView
        initialPage={0}
        tabBarUnderlineStyle={{ backgroundColor: Colors.basicColor }}
        tabBarActiveTextColor={Colors.darkBlack}
        tabBarInactiveTextColor={Colors.darkBlack}
        tabBarBackgroundColor={Colors.whiteColor}
        renderTabBar={() => <ScrollableTabBar
          style={{ borderBottomWidth: 0 }}
        />}
        onChangeTab={(e) => changeTab(e)}
      >
        {
          tags && tags.map((item: any, index: number) => {
            return (
              <ScrollView
                tabLabel={item.name}
                key={`tag-${index}`}
                onMomentumScrollEnd={(e) => onReachBottom(e)}
              >
                {
                  goodsList && goodsList.map((item: any, index: number) => {
                    return (
                      <GoodsCard
                        key={`goods-${index}`}
                        goodsInfo={item}
                        updateGoodsList={(id: number) => updateGoodsList(id)}
                      />
                    )
                  })
                }
                {!!goodsList.length && <LoadMore hasMore={hasMoreRef.current} />}
              </ScrollView>
            )
          })
        }
      </ScrollableTabView>
    </>
  )
}