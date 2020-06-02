import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, ImageBackground, TouchableOpacity } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-tiny-toast'
import { apiLiveUploadFile } from '../../../service/api'

interface Props {
  setImageList: (arg0: any[]) => void;
  inputReason: (arg0: string) => void;
}

export default function Reason(props: Props) {
  const [imageList, setImageList] = useState([
    { uri: require('../../../assets/order-image/add.png') }
  ])

  const chooseImage = async (index: number) => {
    if (index) return

    if (imageList.length === 10) {
      Toast.show('最多上传9张图片', { position: 0 })
      return
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
      })

      if (result.cancelled) return

      upLoadImage(result.uri)
    } catch (error) {
      console.log(error)
    }
  }

  const delImage = (index: number) => {
    imageList.splice(index, 1)
    setImageList(JSON.parse(JSON.stringify(imageList)))
    props.setImageList(JSON.parse(JSON.stringify(imageList)))
  }

  const upLoadImage = (imgUri: string) => {
    apiLiveUploadFile({
      fileType: 'PICTURE',
      size: '5',
      unit: 'M',
      file: getImageInfo(imgUri),
    }).then((res: any) => {
      console.log(res)
      if (res.code === 200) {
        setImageList([...imageList, ...[res.data]])
        props.setImageList([...imageList, ...[res.data]])
      } else {
        Toast.show(res.message, { position: 0 })
      }
    }).catch((err: any) => {
      console.log('上传文件错误', err)
    })
  }

  const getImageInfo = (uri: string) => {
    const nameArr = uri.split('/');
    const name = nameArr[nameArr.length - 1];
    const typeArr = name.split('.');
    const type = `image/${typeArr[typeArr.length - 1]}`;

    return {
      uri,
      name,
      type
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>申请原因</Text>
      <TextInput
        multiline
        blurOnSubmit
        placeholder='请输入您的申请原因，如有必要，请上传图片'
        onChangeText={(text) => props.inputReason(text)}
        returnKeyType='done'
        returnKeyLabel="完成"
      />
      <View style={styles.imagePicker}>
        {
          imageList.map((item: any, index: number) => {
            return (
              <View key={`image-${index}`}>
                <TouchableOpacity onPress={() => chooseImage(index)} key={`imag-${index}`}>
                  <ImageBackground
                    style={styles.img}
                    source={index ? { uri: item } : item.uri}
                  />
                </TouchableOpacity>
                {
                  !!index
                  && <TouchableOpacity onPress={() => delImage(index)} style={styles.closeIcon}>
                    <Ionicons
                      size={30}
                      name='ios-close-circle'
                      color={Colors.basicColor}
                    />
                  </TouchableOpacity>
                }
              </View>
            )
          })
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: pxToDp(20),
    backgroundColor: Colors.whiteColor,
    paddingBottom: 0
  },
  title: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    marginBottom: pxToDp(14)
  },
  imagePicker: {
    marginTop: pxToDp(30),
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  img: {
    width: pxToDp(156),
    height: pxToDp(156),
    borderRadius: pxToDp(10),
    marginRight: pxToDp(20),
    marginBottom: pxToDp(20),
    overflow: 'hidden'
  },
  closeIcon: {
    position: 'absolute',
    top: pxToDp(-15),
    right: pxToDp(0)
  }
})