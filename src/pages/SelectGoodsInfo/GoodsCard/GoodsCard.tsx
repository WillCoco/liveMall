import React from 'react'
import { View, Text, StyleSheet, PixelRatio, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import { useNavigation } from '@react-navigation/native'

export default function GoodsCard(props: { style?: any; goodsInfo?: any }) {
  const { goodsInfo } = props
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.navigate('GoodsInfo', { id: goodsInfo.goods_id })}>
      <View style={[styles.container, props.style]}>
        <Image source={{ uri: goodsInfo.original_img }} style={styles.goodsImg} />
        <View style={styles.goodsInfo}>
          <Text numberOfLines={2} style={styles.goodsName}>{goodsInfo.goods_name}</Text>
          <View style={styles.likes}>
            <Ionicons
              size={20}
              name={goodsInfo.is_like ? 'ios-heart' : 'ios-heart-empty'}
              color={goodsInfo.is_like ? Colors.basicColor : Colors.lightGrey}
            />
            <Text style={styles.likesCount}>{goodsInfo.people_like}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: pxToDp(350),
    height: pxToDp(510),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.borderColor,
    borderRadius: pxToDp(16)
  },
  goodsImg: {
    width: '100%',
    height: pxToDp(350),
    borderTopLeftRadius: pxToDp(16),
    borderTopRightRadius: pxToDp(16),
    overflow: 'hidden'
  },
  goodsInfo: {
    padding: pxToDp(10)
  },
  goodsName: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    lineHeight: pxToDp(36),
    marginBottom: pxToDp(15)
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  likesCount: {
    marginLeft: pxToDp(15),
    fontSize: pxToDp(24),
    color: Colors.darkGrey
  }
})