import React, { useState } from 'react'
import { View, StyleSheet, ImageBackground, TouchableOpacity, PermissionsAndroid } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { connect } from 'react-redux'
import { Colors } from '../../../constants/Theme'
import { Ionicons } from '@expo/vector-icons'
import { Toast } from '../../../components/Toast'
import { apiWorkUpload } from '../../../service/api'
import { setMediaList } from '../../../actions/works'
import usePermissions from '../../../hooks/usePermissions'

import ImagePicker from 'react-native-image-crop-picker'

interface Props {
  dispatch?: any;
  pageType: string;
  mediaList: Array<any>;
  fullPathImageList: Array<any>;
  setGifUrl(url: string): void;
  setFullPathImageList([]: Array<any>): void;
}

function ImgPicker(props: Props) {
  usePermissions([
    PermissionsAndroid.PERMISSIONS.CAMERA,
  ])
  const { pageType, mediaList, fullPathImageList } = props

  const chooseImage = async (index: number) => {
    if (index) return

    if (pageType !== 'video' && mediaList.length === 10) {
      Toast.fail('最多上传9张图片')
      return
    }

    if (pageType === 'video' && mediaList.length === 2) {
      Toast.fail('只能上传一个视频')
      return
    }

    ImagePicker.openPicker({
      mediaType: pageType === 'video' ? 'video' : 'photo'
    }).then((result: any) => {
      console.log('图片', result);
      if (result) {
        upLoadImage(result.path)
      }
    }).catch(r => console.log('取消选择', r));
  }

  const delImage = (index: number) => {
    mediaList.splice(index, 1)
    props.dispatch(setMediaList(JSON.parse(JSON.stringify(mediaList))))
  }

  const upLoadImage = (imgUri: string) => {
    const loading = Toast.loading('')

    const params = {
      fileType: pageType === 'video' ? 'VIDEO' : 'PICTURE',
      file: getImageInfo(imgUri),
    }

    apiWorkUpload(params).then((res: any) => {
      Toast.remove(loading)
      console.log('success', res)
      if (res.code === 200) {
        let imgFullPath = res.data.worksUrl
        let imgPath = imgFullPath.substr(0, imgFullPath.lastIndexOf('&', imgFullPath.lastIndexOf('&') - 1))
        let gifFullPath = pageType === 'video' ? res.data.worksGifUrl : ''
        let gifPath = pageType === 'video'
          ? gifFullPath.substr(0, gifFullPath.lastIndexOf('&', gifFullPath.lastIndexOf('&') - 1))
          : ''

        props.dispatch(setMediaList(
          pageType === 'video'
            ? [...mediaList, ...[gifPath]]
            : [...mediaList, ...[imgPath]]
        ))
        props.setFullPathImageList([...fullPathImageList, ...[res.data.worksUrl]])
        pageType === 'video' && props.setGifUrl(res.data.worksGifUrl)
      } else {
        Toast.fail(res.message)
      }
    }).catch((err: any) => {
      Toast.remove(loading)
      console.log('error', err)
    })
  }

  const getImageInfo = (uri: string) => {
    const nameArr = uri.split('/');
    const name = nameArr[nameArr.length - 1];
    const typeArr = name.split('.');

    const type =
      pageType === 'video'
        ? `video/${typeArr[typeArr.length - 1]}`
        : `image/${typeArr[typeArr.length - 1]}`;

    return {
      uri,
      name,
      type
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePicker}>
        {
          mediaList.map((item: any, index: number) => {
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

export default connect(
  (state: any) => state.worksData
)(
  ImgPicker
)

const styles = StyleSheet.create({
  container: {
    padding: pxToDp(20),
    backgroundColor: Colors.whiteColor,
    paddingBottom: 0
  },
  imagePicker: {
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