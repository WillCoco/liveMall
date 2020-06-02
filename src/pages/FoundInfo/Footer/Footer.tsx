import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, PixelRatio, TextInput, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import Toast from 'react-native-tiny-toast'

import { apiPublishWorksComment, apiPublishWorksReply } from '../../../service/api'

const heartIcon = require('../../../assets/works-image/heart2.png')
const heartSolidIcon = require('../../../assets/works-image/heart.png')

interface Props {
  worksInfo: any;
  commentInfo: any;
  isLogin: boolean;
  inputFocus: boolean;
  inputBlur(): void;
  followWorks(): void;
  updateCommentList(): void;
  showGoodsActionSheet(): void;
}

export default function Footer(props: Props) {
  const { worksInfo, inputFocus, commentInfo, isLogin } = props
  const [inputValue, setInputValue] = useState('')
  const inputRef: any = useRef()
  const navigation: any = useNavigation()

  useEffect(() => {
    if (inputFocus) {
      inputRef.current.focus()
    }
  }, [inputFocus])

  const submit = async () => {
    if (!inputValue) return

    let result: any = {}

    if (inputFocus) {  // 回复评论
      const params = {
        toUserId: commentInfo.userId,
        commentId: commentInfo.commentId,
        content: inputValue
      }

      result = await apiPublishWorksReply(params)
    } else {  // 发表评论
      const params = {
        worksId: worksInfo.worksId,
        content: inputValue
      }

      result = await apiPublishWorksComment(params)
    }

    if (result) {
      Toast.showSuccess(inputFocus ? '回复成功' : '评论成功')
      setInputValue('')
      props.updateCommentList()
    }
  }

  return (
    <View style={styles.container}>
      {
        isLogin
          ? <TextInput
            ref={inputRef}
            placeholder={commentInfo && commentInfo.userName ? `回复@${commentInfo.userName}` : '说点什么吧'}
            clearButtonMode='while-editing'
            value={inputValue}
            style={styles.input}
            onChangeText={(text) => setInputValue(text)}
            onSubmitEditing={submit}
            onBlur={props.inputBlur}
            returnKeyType='done'
          />
          : <TouchableOpacity
            style={[styles.input, { justifyContent: 'center', alignItems: 'center' }]}
            onPress={() => navigation.push('Login')}
          >
            <Text>登录后发表评论</Text>
          </TouchableOpacity>
      }

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
    paddingLeft: pxToDp(20),
    padding: 0
  },
  bagIcon: {
    width: pxToDp(42),
    height: pxToDp(38),
    marginBottom: pxToDp(10)
  },
  iconItem: {
    flex: 1,
    alignItems: 'center'
  }
})