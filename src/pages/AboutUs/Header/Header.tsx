import React from 'react'
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

export default function Header() {
  return (
    <ImageBackground source={require('../../../assets/mine-image/about_us_bgi.png')} style={styles.container}>
      <Image source={require('../../../assets/mine-image/logo.png')} style={styles.logo} />
      <Text style={styles.name}>圈品商城</Text>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    height: pxToDp(460),
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  logo: {
    width: pxToDp(150),
    height: pxToDp(150)
  },
  name: {
    fontSize: pxToDp(32),
    fontWeight: '500',
    marginTop: pxToDp(10),
    marginBottom: pxToDp(80),
    color: Colors.whiteColor
  }
})