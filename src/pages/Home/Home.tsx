import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl
} from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { connect } from 'react-redux'
import {
  setSearchKey,
  setSwiperList,
  setSeckillList,
  setActivityList,
  setSelectedGoodsInfo
} from '../../actions/home'
import { apiGetIndexData, apiGetIndexGoodsList } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'
import checkIsBottom from '../../utils/checkIsBottom'

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

import IndexTab from './IndexTab/IndexTab'
import BrandTab from './BrandTab/BrandTab'
import withPage from '../../components/HOCs/withPage'
import SearchBar from '../../components/SearchBar/SearchBar'

const pageSize = 20

interface HomeProps {
  dispatch: any
  homeData?: any
  publicData?: any
  swiperList: Array<any>
  selectedGoodsInfo: any
  seckillList: Array<any>
  activityList: Array<any>
}

function Home(props: HomeProps) {
  const { statusBarHeight } = props.publicData
  let { swiperList, activityList, selectedGoodsInfo, seckillList } = props.homeData

  const pageNoRef = useRef(1)
  const hasMoreRef = useRef(true)

  const isFocused: boolean = useIsFocused()
  const navigation: any = useNavigation()

  const [loading, setLoading] = useState(false)
  const [timeQuantum, setTimeQuantum] = useState('')
  const [categoryData, setCategoryData]: any = useState({})
  const [recommendGoodsList, setRecommendGoodsList]: Array<any> = useState([])
  const [categoryList, setCategoryList] = useState([{ name: '首页' }])
  const [countDownList, setCountDownList] = useState([
    { timeQuantum: '10:00', state: '' },
    { timeQuantum: '14:00', state: '' },
    { timeQuantum: '20:00', state: '' }
  ])

  useEffect(() => {
    getRecommendGoodsList(false)
  }, [])

  useEffect(() => {
    if (isFocused) {
      initData()
      setCountDown()
    }
  }, [isFocused])

  /**
   * 加载初始化数据
   */
  const initData = () => {
    apiGetIndexData().then((res: any) => {
      console.log('首页初始化数据', res)
      const selectedGoodsInfo = {
        subTitle: res.jxhtSubCategory?.name || '',
        goodsList: res.jxht
      }

      props.dispatch(setSearchKey(res.hot?.goods_name))
      props.dispatch(setSwiperList(res.banner))
      props.dispatch(setActivityList(res.activity))
      props.dispatch(setSelectedGoodsInfo(selectedGoodsInfo))
      props.dispatch(setSeckillList(res.seckill))

      if (categoryList.length === 1) {
        setCategoryList([...categoryList, ...res.category])
      }
      setLoading(false)
    }).catch((err: any) => {
      console.log('首页初始化数据', err)
    })
  }

  /**
   * 加载圈重点数据
   */
  const getRecommendGoodsList = (isPullDown: boolean) => {
    apiGetIndexGoodsList({
      pageNo: pageNoRef.current,
      pageSize
    }).then((res: any) => {
      console.log('首页圈重点数据', res)
      const totalPage = Math.ceil(res.count / pageSize)
      hasMoreRef.current = pageNoRef.current < totalPage
      setRecommendGoodsList(isPullDown ? res.list : [...recommendGoodsList, ...res.list])
    }).catch((err: any) => {
      console.log('首页圈重点数据', err)
    })
  }

  /**
   * 下拉刷新
   */
  const onPullDownRefresh = () => {
    pageNoRef.current = 1
    setLoading(true)
    getRecommendGoodsList(true)
    initData()
  }

  /**
   * 触底加载
   */
  const onReachBottom = (e: any) => {
    if (hasMoreRef.current && checkIsBottom(e)) {
      pageNoRef.current += 1
      getRecommendGoodsList(false)
    }
  }

  /**
   * 切换 TAB
   */
  const changeTab = (e: any) => {
    setCategoryData(categoryList[e.i])
  }

  /**
   * 设置秒杀状态
   */
  const setCountDown = () => {
    const curHour = new Date().getHours()

    if ((curHour >= 0 && curHour < 10) || curHour >= 20) {
      setTimeQuantum('20:00')
      setCountDownList([
        { timeQuantum: '10:00', state: curHour >= 20 ? '已结束' : '即将开始' },
        { timeQuantum: '14:00', state: '已结束' },
        { timeQuantum: '20:00', state: '正在疯抢' }
      ])
    } else if (curHour >= 10 && curHour < 14) {
      setTimeQuantum('10:00')
      setCountDownList([
        { timeQuantum: '10:00', state: '正在疯抢' },
        { timeQuantum: '14:00', state: '即将开始' },
        { timeQuantum: '20:00', state: '即将开始' }
      ])
    } else {
      setTimeQuantum('14:00')
      setCountDownList([
        { timeQuantum: '10:00', state: '已结束' },
        { timeQuantum: '14:00', state: '正在疯抢' },
        { timeQuantum: '20:00', state: '即将开始' }
      ])
    }
  }

  return (
    <>
      <View style={{ paddingTop: statusBarHeight, backgroundColor: Colors.basicColor, alignItems: 'center' }}>
        <SearchBar
          hasSearchKey={true}
          isPlaceHolder={true}
          toSearchPage={() => navigation.navigate('HomeSearch')}
        />
      </View>
      {
        categoryList.length > 1
          ? <ScrollableTabView
            initialPage={0}
            tabBarUnderlineStyle={{ backgroundColor: Colors.whiteColor }}
            tabBarActiveTextColor={Colors.whiteColor}
            tabBarInactiveTextColor={Colors.whiteColor}
            tabBarBackgroundColor={Colors.basicColor}
            renderTabBar={() => <ScrollableTabBar
              style={{
                borderWidth: 0,
                height: pxToDp(80)
              }}
            />}
            onChangeTab={(e) => changeTab(e)}
          >
            {
              categoryList.map((item, index) => {
                return (
                  <ScrollView
                    tabLabel={item.name}
                    key={`tab-${index}`}
                    showsVerticalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => onReachBottom(e)}
                    refreshControl={
                      <RefreshControl
                        refreshing={loading}
                        onRefresh={onPullDownRefresh}
                      />
                    }
                  >
                    {
                      index
                        ? <BrandTab
                          categoryData={categoryData}
                        />
                        : <IndexTab
                          hasMore={hasMoreRef.current}
                          swiperList={swiperList}
                          seckillList={seckillList}
                          timeQuantum={timeQuantum}
                          activityList={activityList}
                          countDownList={countDownList}
                          selectedGoodsInfo={selectedGoodsInfo}
                          recommendGoodsList={recommendGoodsList}
                        />
                    }
                  </ScrollView>
                )
              })
            }
          </ScrollableTabView>
          : <ScrollView
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={(e) => onReachBottom(e)}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={onPullDownRefresh}
              />
            }
          >
            <IndexTab
              hasMore={hasMoreRef.current}
              swiperList={swiperList}
              seckillList={seckillList}
              timeQuantum={timeQuantum}
              activityList={activityList}
              countDownList={countDownList}
              selectedGoodsInfo={selectedGoodsInfo}
              recommendGoodsList={recommendGoodsList}
            />
          </ScrollView>


      }
    </>
  )
}

const styles = StyleSheet.create({
  swiperContainer: {
    backgroundColor: Colors.whiteColor,
    paddingTop: pxToDp(20),
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20)
  },
  swiper: {
    height: pxToDp(240),
    borderRadius: pxToDp(16),
    overflow: 'hidden'
  },
  activityContainer: {
    height: pxToDp(220),
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    paddingBottom: pxToDp(20)
  },
  activity: {
    width: pxToDp(710),
    borderRadius: pxToDp(16)
  },
  selectedGoods: {
    backgroundColor: Colors.whiteColor,
    marginTop: pxToDp(20),
    padding: pxToDp(20)
  },
  selectedGoodsList: {
    marginTop: pxToDp(36),
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  seckill: {
    marginTop: pxToDp(20)
  },
  seckillHeader: {
    height: pxToDp(76),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20)
  },
  seckillText: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  seckillTextImg: {
    width: pxToDp(144),
    height: pxToDp(36),
    marginRight: pxToDp(12)
  },
  seckillSubTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  seckillSubTitleText: {
    color: Colors.whiteColor,
    fontSize: pxToDp(26),
    marginRight: pxToDp(10)
  },
  countDown: {
    flexDirection: 'row'
  },
  time: {
    height: pxToDp(36),
    lineHeight: pxToDp(36),
    backgroundColor: Colors.blackColor,
    color: Colors.whiteColor,
    width: pxToDp(40),
    textAlign: 'center'
  },
  colon: {
    marginLeft: pxToDp(5),
    marginRight: pxToDp(5)
  },
  countDonwList: {
    height: pxToDp(140),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor
  },
  countDownItem: {
    alignItems: 'center'
  },
  countDownTime: {
    fontSize: pxToDp(34),
    color: Colors.darkBlack,
    fontWeight: '600',
    marginBottom: pxToDp(10)
  },
  countDownActiveTime: {
    color: Colors.basicColor
  },
  countDownState: {
    height: pxToDp(40),
    lineHeight: pxToDp(40),
    textAlign: 'center',
    fontSize: pxToDp(26),
    borderRadius: pxToDp(20),
    overflow: 'hidden',
    paddingLeft: pxToDp(5),
    paddingRight: pxToDp(5),
    color: Colors.lightBlack
  },
  countDownActiveState: {
    backgroundColor: Colors.basicColor,
    color: Colors.whiteColor
  },
  seckillGoodsList: {

  }
})

export default connect(
  (state: any) => state
)(withPage(Home))