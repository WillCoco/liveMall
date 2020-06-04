import React from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  PixelRatio,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import HomeNav from '../HomeNav'
import HomeSwiper from '../HomeSwiper'
import LoadMore from '../../../components/LoadMore/LoadMore'
import CardTitle from '../../../components/CardTitle/CardTitle'
import GoodsCard from '../../../components/GoodsCard/GoodsCard'
import GoodsCardRow from '../../../components/GoodsCardRow/GoodsCardRow'
import SeckillCountDown from '../../../components/SeckillCountDown/SeckillCountDown'

import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

interface Props {
  hasMore: boolean
  timeQuantum: string
  swiperList: Array<any>
  seckillList: Array<any>
  activityList: Array<any>
  countDownList: Array<any>
  recommendGoodsList: Array<any>
  selectedGoodsInfo: {
    subTitle: string
    goodsList: Array<any>
  }
}

export default function IndexTab(props: Props) {
  const {
    hasMore,
    swiperList,
    seckillList,
    timeQuantum,
    activityList,
    countDownList,
    selectedGoodsInfo,
    recommendGoodsList
  } = props

  const navigation = useNavigation()

  return (
    <>
      {/* 顶部轮播图 */}
      <ImageBackground
        resizeMode='stretch'
        source={require('../../../assets/home-image/banner_bg.png')}
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
        <CardTitle
          title='精选话题'
          subTitle={selectedGoodsInfo.subTitle}
          nextAction={() => navigation.navigate('SelectGoods')}
        />
        <ScrollView
          horizontal={true}
          style={styles.selectedGoodsList}
          showsHorizontalScrollIndicator={false}
        >
          {
            selectedGoodsInfo.goodsList
            && selectedGoodsInfo.goodsList.map((item: any, index: any) => {
              return (
                <GoodsCard
                  goodsInfo={item}
                  key={`selected-${index}`}
                  style={{ marginRight: pxToDp(10) }}
                  tapGoodsCard={(id: number) => navigation.navigate('SelectGoodsInfo', { id })}
                />
              )
            })
          }
        </ScrollView>
      </View>
      {/* 限时秒杀 */}
      {!!seckillList.length &&
        <View style={styles.seckill}>
          <ImageBackground source={require('../../../assets/home-image/seckill_bg.png')} style={styles.seckillHeader}>
            <View style={styles.seckillText}>
              <Image source={require('../../../assets/home-image/seckill_text.png')} style={styles.seckillTextImg} resizeMode='contain' />
              <SeckillCountDown />
            </View>
            <TouchableOpacity style={styles.seckillSubTitle} onPress={() => navigation.navigate('Sale', { type: 'seckill' })}>
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
                    <Text
                      style={[
                        styles.countDownTime,
                        timeQuantum === item.timeQuantum && styles.countDownActiveTime
                      ]}>{item.timeQuantum}</Text>
                    <Text
                      style={[
                        styles.countDownState,
                        timeQuantum === item.timeQuantum && styles.countDownActiveState
                      ]}>{item.state}</Text>
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
            recommendGoodsList.map((item: any, index: any) => {
              return (
                <GoodsCard
                  key={`recommend-${index}`}
                  style={{ marginBottom: pxToDp(20) }}
                  goodsInfo={item}
                  tapGoodsCard={(id: number) => navigation.navigate('GoodsInfo', { id })}
                />
              )
            })
          }
        </View>
        <LoadMore hasMore={hasMore} />
      </View></>
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
    paddingRight: pxToDp(20),
    minHeight: pxToDp(240)
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