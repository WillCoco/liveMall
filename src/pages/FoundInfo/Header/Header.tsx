import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import pxToDp from '../../../utils/px2dp'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { Colors } from '../../../constants/Theme'

function Header(props: { statusBarHeight: number; opacity: number }) {
  const navigation = useNavigation()
  const { statusBarHeight, opacity } = props

  return (
    <View style={[styles.container, {
      height: statusBarHeight + pxToDp(70),
      paddingTop: statusBarHeight,
      backgroundColor: `rgba(255, 50, 27, ${opacity})`,
      width: '100%'
    }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name='ios-arrow-back' size={28} color={Colors.whiteColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <AntDesign name='sharealt' size={20} color={Colors.whiteColor} />
      </TouchableOpacity>
    </View>
  )
}

export default connect(
  (state: any) => state.publicData
)(Header)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})