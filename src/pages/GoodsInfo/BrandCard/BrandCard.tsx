import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import { Ionicons } from '@expo/vector-icons'

export default function BrandCard(props: { goodsInfo: any }) {
  const { goodsInfo } = props
  const navigation: any = useNavigation()

  const toBrandShop = () => {
    const { supplier_id: id } = goodsInfo
    navigation.push('BrandShop', { id })
  }

  return (
    <TouchableWithoutFeedback onPress={toBrandShop}>
      <View style={styles.container}>
        <View style={styles.brandInfo}>
          <Image source={{ uri: goodsInfo.shop_logo }} style={styles.logo} />
          <View>
            <Text style={styles.brandName}>{goodsInfo.shop_name}</Text>
            {!!goodsInfo.desc && <Text style={styles.slogan}>{goodsInfo.desc}</Text>}
          </View>
        </View>
        <Ionicons
          size={20}
          name='ios-arrow-forward'
          color={Colors.darkGrey}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    height: pxToDp(120),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20)
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: pxToDp(80),
    height: pxToDp(80),
    borderRadius: pxToDp(40),
    marginRight: pxToDp(10)
  },
  brandName: {
    fontSize: pxToDp(30),
    color: Colors.blackColor,
    fontWeight: '500',
    marginBottom: pxToDp(8)
  },
  slogan: {
    fontSize: pxToDp(24),
    color: Colors.darkGrey
  }
})