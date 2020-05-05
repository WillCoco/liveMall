import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, PixelRatio } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import calcStrLength from '../../../utils/calcStrLength'

export default function Form(props: any) {
  const [textLength, setTextLength] = useState(40)

  const inputTitle = (text: string) => {
    setTextLength(40 - calcStrLength(text))
    props.inputTitle(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder='请输入标题'
          maxLength={20}
          style={styles.titleInput}
          onChangeText={(text) => inputTitle(text)}
        />
        <Text style={styles.textLength}>{~~(textLength / 2)}字</Text>
      </View>
      <View style={styles.textarea}>
        <TextInput
          placeholder='添加文字心得'
          multiline
          style={styles.textareaInput}
          onChangeText={(text) => props.inputContent(text)}
        />
      </View>
      <View style={styles.imagePicker}>
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    backgroundColor: Colors.whiteColor
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleInput: {
    flex: 1,
    height: pxToDp(100),
    fontSize: pxToDp(28)
  },
  textLength: {
    width: pxToDp(62),
    fontSize: pxToDp(26),
    color: Colors.darkGrey
  },
  textarea: {
    borderTopColor: Colors.borderColor,
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1 / PixelRatio.get(),
    paddingTop: pxToDp(20),
    paddingBottom: pxToDp(20),
    minHeight: pxToDp(240)
  },
  textareaInput: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(36)
  },
  imagePicker: {
    
  }
})