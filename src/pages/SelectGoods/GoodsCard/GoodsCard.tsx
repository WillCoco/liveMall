import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'

import { apiGoodsIsLike } from '../../../service/api'

interface Props {
  goodsInfo: any
  updateGoodsList(id: number | string): void
}

export default function GoodsCard(props: Props) {
  const { goodsInfo } = props
  const navigation: any = useNavigation()

  const toGoodsInfo = () => {
    const { goods_id: id } = goodsInfo
    navigation.navigate('SelectGoodsInfo', { id })
  }

  const changeLikeGoods = () => {
    const { is_like, goods_id } = goodsInfo

    apiGoodsIsLike({
      goods_id,
      type: is_like ? 0 : 1
    }).then((res: any) => {
      console.log('喜欢/取消喜欢', res)

      props.updateGoodsList(goods_id)
    })
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toGoodsInfo}>
        <Image source={{ uri: goodsInfo.original_img }} style={styles.goodsImg} />
      </TouchableWithoutFeedback>
      <View style={styles.goodsInfo}>
        <Text style={styles.goodsName} numberOfLines={1} onPress={toGoodsInfo}>{goodsInfo.goods_name}</Text>
        <Text style={styles.goodsDes} numberOfLines={2} onPress={toGoodsInfo}>{goodsInfo.content}</Text>
        <TouchableWithoutFeedback onPress={changeLikeGoods}>
          <View style={styles.likesCount}>
            <Text style={styles.likesText}>{goodsInfo.people_like}人喜欢</Text>
            <Ionicons
              size={20}
              name={goodsInfo.is_like ? 'ios-heart' : 'ios-heart-empty'}
              color={goodsInfo.is_like ? Colors.basicColor : Colors.lightGrey}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    height: pxToDp(220),
    marginTop: pxToDp(10),
    padding: pxToDp(20),
    paddingTop: pxToDp(10),
    paddingBottom: pxToDp(10),
    flexDirection: 'row'
  },
  goodsImg: {
    width: pxToDp(200),
    height: pxToDp(200),
    borderRadius: pxToDp(10)
  },
  goodsInfo: {
    marginLeft: pxToDp(32),
    paddingTop: pxToDp(10)
  },
  goodsName: {
    width: pxToDp(480),
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    fontWeight: '500'
  },
  goodsDes: {
    marginTop: pxToDp(12),
    fontSize: pxToDp(24),
    width: pxToDp(480),
    color: Colors.lightBlack,
    lineHeight: pxToDp(33),
    marginBottom: pxToDp(20)
  },
  likesCount: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  likesText: {
    fontSize: pxToDp(26),
    color: Colors.darkGrey,
    marginRight: pxToDp(10)
  }
})