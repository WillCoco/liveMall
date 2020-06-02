import React from 'react'
import { View, Text, StyleSheet, Image, ImageBackground, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import formatGoodsPrice from '../../../utils/formatGoodsPrice'

import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'

interface Props {
  type: string;
  timeList: Array<any>;
  goodsList: Array<any>;
  changeTimeQuantum(index: number): void;
}

export default function Sale(props: Props) {
  const { goodsList, type, timeList } = props
  const navigation: any = useNavigation()

  const toGoodsInfo = (id: number) => {
    navigation.navigate('GoodsInfo', { id })
  }

  return (
    <ImageBackground source={require('../../../assets/sale-image/header_bgi.png')} style={styles.container}>
      {
        type === 'sale'
          ? <Image source={require('../../../assets/sale-image/sale_text.png')} style={styles.saleText} resizeMode='contain' />
          : <View style={styles.timeQuantumContainer}>
            {
              timeList && timeList.map((item, index) => {
                return (
                  <TouchableWithoutFeedback onPress={() => props.changeTimeQuantum(index)} key={`time-${index}`}>
                    <View style={[styles.timeQuantum, item.ongoing && styles.timeQuantumActive]}>
                      <Text style={[styles.time, item.ongoing && styles.timeActive]}>{item.time}</Text>
                      <Text style={[styles.state, item.ongoing && styles.stateActive]}>{item.state}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              })
            }
          </View>
      }

      <View style={[styles.goodsContainer, type === 'sale' ? { height: pxToDp(570) } : { height: pxToDp(524) }]}>
        {
          goodsList && goodsList.map((item: any, index: number) => {
            return (
              <TouchableWithoutFeedback onPress={() => toGoodsInfo(item.goods_id)} key={`goods-${index}`}>
                <View key={`goods-${index}`} style={styles.goodsItem}>
                  <Image source={{ uri: item.original_img }} style={styles.goodsImg} />
                  <View style={styles.goodsInfo}>
                    <Text style={styles.goodsName} numberOfLines={2}>{item.goods_name}</Text>
                    <View style={styles.goodsPrice}>
                      <Text style={styles.priceText}>{type === 'sale' ? '特价' : '秒杀价'}</Text>
                      <Text style={styles.rmbIcon}>¥</Text>
                      <Text style={styles.salePrice}>{formatGoodsPrice(item.shop_price)}</Text>
                      <Text style={styles.originalPrice}>¥{formatGoodsPrice(item.market_price)}</Text>
                    </View>
                    {
                      type === 'sale' && <Text style={styles.hasSold}>{`${item.has_sold}件已被抢`}</Text>
                    }
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          })
        }
      </View>
    </ImageBackground>
  )
}

const deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: pxToDp(670),
    marginBottom: pxToDp(230)
  },
  saleText: {
    width: pxToDp(480),
    height: pxToDp(92),
    position: 'absolute',
    bottom: pxToDp(400),
    left: (deviceWidth - pxToDp(480)) / 2
  },
  goodsContainer: {
    position: 'absolute',
    width: '100%',
    bottom: pxToDp(-210),
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  goodsItem: {
    width: pxToDp(350),
    backgroundColor: Colors.whiteColor,
    height: '100%',
    borderRadius: pxToDp(20),
    overflow: 'hidden'
  },
  goodsImg: {
    width: '100%',
    height: pxToDp(350)
  },
  goodsInfo: {
    padding: pxToDp(10),
    paddingTop: pxToDp(12)
  },
  goodsName: {
    fontSize: pxToDp(28),
    color: Colors.blackColor,
    lineHeight: pxToDp(40),
    marginBottom: pxToDp(4)
  },
  goodsPrice: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  priceText: {
    fontSize: pxToDp(24),
    color: Colors.darkBlack,
    marginRight: pxToDp(10)
  },
  rmbIcon: {
    fontSize: pxToDp(24),
    color: Colors.basicColor
  },
  salePrice: {
    fontSize: pxToDp(34),
    fontWeight: '500',
    color: Colors.basicColor
  },
  originalPrice: {
    marginLeft: pxToDp(40),
    fontSize: pxToDp(24),
    color: Colors.lightGrey,
    textDecorationLine: 'line-through'
  },
  hasSold: {
    marginTop: pxToDp(10),
    height: pxToDp(30),
    lineHeight: pxToDp(30),
    textAlign: 'center',
    paddingLeft: pxToDp(5),
    paddingRight: pxToDp(5),
    borderRadius: pxToDp(15),
    maxWidth: pxToDp(140),
    backgroundColor: Colors.pinkColor,
    overflow: 'hidden',
    fontSize: pxToDp(20),
    color: Colors.basicColor
  },
  timeQuantumContainer: {
    width: '100%',
    position: 'absolute',
    bottom: pxToDp(400),
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  timeQuantum: {
    alignItems: 'center',
    justifyContent: 'center',
    width: pxToDp(140),
    height: pxToDp(90)
  },
  timeQuantumActive: {
    backgroundColor: Colors.whiteColor,
    borderRadius: pxToDp(10)
  },
  time: {
    color: Colors.whiteColor,
    fontSize: pxToDp(34),
    fontWeight: '600'
  },
  timeActive: {
    color: Colors.basicColor
  },
  state: {
    color: Colors.whiteColor,
    fontSize: pxToDp(24)
  },
  stateActive: {
    color: Colors.basicColor
  }
})