import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

export default function ClassifyContent(props: { goodsList: Array<any> }) {
  const { goodsList } = props
  const navigation: any = useNavigation()

  const toGoodsInfo = (id: number) => {
    navigation.navigate('GoodsInfo', { id })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.goodsList}>
        {
          goodsList && goodsList.map((item: any, index: number) => {
            return (
              <TouchableWithoutFeedback key={`goods-${index}`} onPress={() => toGoodsInfo(item.goods_id)}>
                <View style={styles.goodsItem}>
                  <Image source={{ uri: item.original_img }} style={styles.goodsImg} />
                  <Text style={styles.goodsName} numberOfLines={1}>{item.goods_name}</Text>
                </View>
              </TouchableWithoutFeedback>
            )
          })
        }
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: pxToDp(570),
    backgroundColor: Colors.whiteColor
  },
  goodsList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  goodsItem: {
    width: pxToDp(110),
    margin: pxToDp(15)
  },
  goodsImg: {
    width: pxToDp(110),
    height: pxToDp(110),
    borderRadius: pxToDp(55)
  },
  goodsName: {
    fontSize: pxToDp(26),
    color: Colors.darkBlack,
    marginTop: pxToDp(10)
  }
})