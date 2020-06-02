import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

export default function Contact(props: { inputTel: (arg0: string) => void }) {
  return (
    <View style={styles.container}>
      <Text>联系电话</Text>
      <TextInput
        maxLength={11}
        keyboardType='phone-pad'
        placeholder='请输入您的联系方式'
        onChangeText={(text) => props.inputTel(text)}
        returnKeyType='done'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: pxToDp(10),
    height: pxToDp(80),
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    backgroundColor: Colors.whiteColor,
    justifyContent: 'space-between'
  }
})