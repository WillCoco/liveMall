import React from 'react'
import { View, Text, StyleSheet, Platform, PixelRatio, TextInput, Image, TouchableOpacity } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

const heartSolidIcon = require('../../../assets/works-image/heart.png')
const heartIcon = require('../../../assets/works-image/heart2.png')

export default function Footer(props: any) {
  const { worksInfo } = props

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='说点什么吧'
        style={styles.input}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>

        <TouchableOpacity style={styles.iconItem} onPress={() => props.followWorks()}>
          <Image source={worksInfo.isFollow ? heartIcon : heartSolidIcon} style={styles.bagIcon} />
          <Text style={{
            fontSize: pxToDp(24),
            color: Colors.darkBlack
          }}>{worksInfo.followCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconItem} onPress={() => props.showGoodsActionSheet()}>
          <Image source={require('../../../assets/works-image/shopping_bag.png')} style={styles.bagIcon} />
          <Text style={{
            fontSize: pxToDp(24),
            color: Colors.darkBlack
          }}>{(worksInfo.worksRelationGoods && worksInfo.worksRelationGoods.length) || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: pxToDp(Platform.OS === 'ios' ? 128 : 108),
    paddingBottom: pxToDp(Platform.OS === 'ios' ? 20 : 0),
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: Colors.borderColor,
    backgroundColor: Colors.whiteColor,
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
    justifyContent: 'space-between'
  },
  input: {
    width: pxToDp(440),
    height: pxToDp(52),
    backgroundColor: Colors.bgColor,
    borderRadius: pxToDp(26),
    paddingLeft: pxToDp(20)
  },
  bagIcon: {
    width: pxToDp(40),
    height: pxToDp(38),
    marginBottom: pxToDp(10)
  },
  iconItem: {
    flex: 1,
    alignItems: 'center'
  }
})