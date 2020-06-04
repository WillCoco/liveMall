import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  PixelRatio,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback
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

import { Ionicons } from '@expo/vector-icons'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

import HomeNav from './HomeNav'
import HomeSwiper from './HomeSwiper'
import withPage from '../../components/HOCs/withPage'
import LoadMore from '../../components/LoadMore/LoadMore'
import SearchBar from '../../components/SearchBar/SearchBar'
import CardTitle from '../../components/CardTitle/CardTitle'
import GoodsCard from '../../components/GoodsCard/GoodsCard'
import GoodsCardRow from '../../components/GoodsCardRow/GoodsCardRow'
import SeckillCountDown from '../../components/SeckillCountDown/SeckillCountDown'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

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
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
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
      setNetWorkErr(false)
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
      setNetWorkErr(true)
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
      setNetWorkErr(false)
      const totalPage = Math.ceil(res.count / pageSize)
      hasMoreRef.current = pageNoRef.current < totalPage
      setRecommendGoodsList(isPullDown ? res.list : [...recommendGoodsList, ...res.list])
      setIsComplete(true)
    }).catch((err: any) => {
      console.log('首页圈重点数据', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 下拉刷新
   */
  const onPullDownRefresh = () => {
    pageNoRef.current = 1
    setLoading(true)
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
   * 前往精选话题详情
   */
  const toSelectedGoods = () => {
    navigation.navigate('SelectGoods')
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

  /**
   * 前往品牌店铺
   */
  const toBrandShop = (id: number) => {
    navigation.navigate('BrandShop', { id })
  }

  /**
   * 前往秒杀页
   */
  const toSeckillPage = () => {
    navigation.navigate('Sale', { type: 'seckill' })
  }

  /**
   * 前往精选好物详情
   */
  const toSelectedGoodsInfo = (id: number) => {
    navigation.navigate('SelectGoodsInfo', { id })
  }

  /**
   * 网络错误 重新加载
   */
  // const reload = () => {
  //   initData()
  //   getRecommendGoodsList(false)
  // }

  // if (netWorkErr) return <NetWorkErr reload={reload} />

  // if (!isComplete) return <></>

  return (
    <>
      <View style={{ paddingTop: statusBarHeight, backgroundColor: Colors.basicColor, alignItems: 'center' }}>
        <SearchBar
          hasSearchKey={true}
          isPlaceHolder={true}
          toSearchPage={() => navigation.navigate('HomeSearch')}
        />
      </View>
      <ScrollableTabView
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
                    ? <>
                      {/* 品牌精选 */}
                      <View style={styles.brandList}>
                        <CardTitle title='品牌精选' />
                        <View style={styles.brandsContainer}>
                          {
                            categoryData.list && categoryData.list.map((item: any, index: number) => {
                              return (
                                <TouchableWithoutFeedback key={`brand-${index}`} onPress={() => toBrandShop(item.brand_id)}>
                                  <View style={[styles.brandItem, !!((index + 1) % 4) && { marginRight: pxToDp(60) }]}>
                                    <Image source={{ uri: item.logo }} style={styles.brandLogo} />
                                    <Text style={styles.brandName}>{item.name}</Text>
                                  </View>
                                </TouchableWithoutFeedback>

                              )
                            })
                          }
                        </View>
                      </View>
                      {/* 云闪播热卖 */}
                      <View style={styles.recommendGoodsList}>
                        <CardTitle title='云闪播热卖' />
                        <View style={styles.recommendGoodsListContainer}>
                          {
                            categoryData.shopGoods && categoryData.shopGoods.map((item: any, index: any) => <GoodsCard key={`recommend-${index}`}
                              style={{ marginBottom: pxToDp(20) }} goodsInfo={item} tapGoodsCard={(id: number) => toGoodsInfo(id)} />)
                          }
                        </View>
                      </View>
                    </>
                    : <>
                      {/* 顶部轮播图 */}
                      <ImageBackground
                        resizeMode='stretch'
                        source={require('../../assets/home-image/banner_bg.png')}
                        style={styles.swiperContainer}
                      >
                        <HomeSwiper
                          swiperList={swiperList}
                          swiperStyle={styles.swiper}
                        />
                      </ImageBackground>
                      {/* 导航栏 */}
                      <HomeNav />
                      {/* 活动轮播 */}
                      <View style={styles.activityContainer}>
                        <HomeSwiper
                          showDots={false}
                          swiperList={activityList}
                          swiperStyle={styles.activity}
                        />
                      </View>
                      {/* 精选话题 */}
                      <View style={styles.selectedGoods}>
                        <CardTitle title='精选话题' subTitle={selectedGoodsInfo.subTitle} nextAction={toSelectedGoods} />
                        <ScrollView
                          horizontal={true}
                          style={styles.selectedGoodsList}
                          showsHorizontalScrollIndicator={false}
                        >
                          {
                            selectedGoodsInfo.goodsList && selectedGoodsInfo.goodsList.map((item: any, index: any) => <GoodsCard style={{ marginRight: pxToDp(10) }} key={`selected-${index}`} goodsInfo={item} tapGoodsCard={(id: number) => toSelectedGoodsInfo(id)} />)
                          }
                        </ScrollView>
                      </View>
                      {/* 限时秒杀 */}
                      {!!seckillList.length &&
                        <View style={styles.seckill}>
                          <ImageBackground source={require('../../assets/home-image/seckill_bg.png')} style={styles.seckillHeader}>
                            <View style={styles.seckillText}>
                              <Image source={require('../../assets/home-image/seckill_text.png')} style={styles.seckillTextImg} resizeMode='contain' />
                              <SeckillCountDown />
                            </View>
                            <TouchableOpacity style={styles.seckillSubTitle} onPress={toSeckillPage}>
                              <Text style={styles.seckillSubTitleText}>更多</Text>
                              <Ionicons
                                size={20}
                                name='ios-arrow-forward'
                                color={Colors.whiteColor}
                              />
                            </TouchableOpacity>
                          </ImageBackground>
                          <View style={styles.countDonwList}>
                            {
                              countDownList.map((item, index) => {
                                return (
                                  <View style={styles.countDownItem} key={`time-${index}`}>
                                    <Text style={[styles.countDownTime, timeQuantum === item.timeQuantum && styles.countDownActiveTime]}>{item.timeQuantum}</Text>
                                    <Text style={[styles.countDownState, timeQuantum === item.timeQuantum && styles.countDownActiveState]}>{item.state}</Text>
                                  </View>
                                )
                              })
                            }
                          </View>
                          <View style={styles.seckillGoodsList}>
                            {
                              seckillList && seckillList.map((item: any, index: number) => <GoodsCardRow style={index && { marginTop: pxToDp(10) }} key={`goods-${index}`} goodsInfo={item} />)
                            }
                          </View>
                        </View>
                      }
                      {/* 圈重点 */}
                      <View style={styles.recommendGoodsList}>
                        <CardTitle title='圈重点' />
                        <View style={styles.recommendGoodsListContainer}>
                          {
                            recommendGoodsList.map((item: any, index: any) => <GoodsCard key={`recommend-${index}`}
                              style={{ marginBottom: pxToDp(20) }} goodsInfo={item} tapGoodsCard={(id: number) => toGoodsInfo(id)} />)
                          }
                        </View>
                        <LoadMore hasMore={hasMoreRef.current} />
                      </View>
                    </>
                }
              </ScrollView>
            )
          })
        }
      </ScrollableTabView>
    </>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    height: pxToDp(80)
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.basicColor
  },
  tabsItem: {
    padding: pxToDp(10),
    color: Colors.whiteColor
  },
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
  recommendGoodsList: {
    marginTop: pxToDp(20),
    padding: pxToDp(20),
    backgroundColor: Colors.whiteColor
  },
  recommendGoodsListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: pxToDp(36),
    justifyContent: 'space-between'
  },
  brandList: {
    padding: pxToDp(20),
    paddingBottom: 0,
    backgroundColor: Colors.whiteColor
  },
  brandsContainer: {
    marginTop: pxToDp(20),
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: pxToDp(40)
  },
  brandItem: {
    alignItems: 'center',
    marginBottom: pxToDp(30)
  },
  brandLogo: {
    width: pxToDp(112),
    height: pxToDp(112),
    marginBottom: pxToDp(16),
    borderRadius: pxToDp(56),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.bgColor
  },
  brandName: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack
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