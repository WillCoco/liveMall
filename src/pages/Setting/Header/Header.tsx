import React, { useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { connect } from 'react-redux'
import { Colors } from '../../../constants/Theme'
import { Ionicons } from '@expo/vector-icons'
import RNFS from 'react-native-fs'
import { apiUpdateUserInfo, apiGetUserData, apiUploadFile } from '../../../service/api'
import Toast from 'react-native-tiny-toast'
import { setUserInfo } from '../../../actions/user'
import defaultAvatar from '../../../assets/mine-image/default_avatar.png'
import ImagePicker from 'react-native-image-crop-picker';

function Header(props: { dispatch?: any; userInfo?: any }) {
  const { userInfo } = props
  const [editable, setEditable] = useState(false)
  const [nickName, setNickName] = useState('')
  const [avatarPath, setAvatarPath] = useState('')
  const [avatarBase64, setAvatarBase64] = useState('')

  const editName = () => {
    setEditable(!editable)
    setNickName(userInfo.nickName)
  }

  /**
   * 更换头像
   */
  const changeAvatar = async () => {
    if (!editable) return

    ImagePicker.openPicker({
      mediaType: "photo",
    }).then((result: any) => {
      console.log(result, '  ');
      if (result) {
        let imgSuffix = ''

        setAvatarPath(result.path)

        let suffixIndex = (result.path).lastIndexOf('.')
        imgSuffix = result.path.substring(suffixIndex + 1)

        RNFS.readFile(result.path, 'base64').then(res => {
          const tempImgPath = `data:image/${imgSuffix === 'jpg' ? 'jpeg' : imgSuffix};base64,${res}`
          setAvatarBase64(tempImgPath)
          return;
        })
      }
    }).catch(r => console.log('取消选择', r));
  }

  /**
   * 更新用户信息
   */
  const updateUserInfo = async () => {
    if (!nickName) {
      Toast.show('昵称不能为空')
      return
    }

    if (nickName === userInfo.nickName && !avatarPath) {
      setEditable(!editable)
      return
    }

    let params: any = {
      nickName
    }

    if (avatarPath) {
      params[`avatarUrl`] = await apiUploadFile(avatarBase64)
    }

    apiUpdateUserInfo(params).then((res: string) => {
      console.log('修改用户信息', res)
      if (res === 'success') {
        Toast.show('修改成功', { position: 0 })
        setEditable(!editable)
        apiGetUserData().then((res: any) => {
          props.dispatch(setUserInfo(res))
        })
      }
    })
  }

  return (
    <ImageBackground source={require('../../../assets/mine-image/setting_bgi.png')} style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={changeAvatar}>
          <ImageBackground source={avatarPath || userInfo.userAvatar ? { uri: avatarPath || userInfo.userAvatar } : defaultAvatar} style={styles.avatar}>
            {
              editable && <Text style={styles.editAvatar}>更换头像</Text>
            }
          </ImageBackground>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {
            !editable
              ? <Text style={[styles.input, { lineHeight: pxToDp(60) }]}>{userInfo.nickName}</Text>
              : <TextInput
                autoFocus
                editable={editable}
                style={styles.input}
                defaultValue={userInfo.nickName}
                onChangeText={(text) => setNickName(text)}
                returnKeyType='done'
              />
          }

          {
            editable
              ? <TouchableOpacity onPress={updateUserInfo}>
                <Ionicons name='md-checkmark' color={Colors.whiteColor} size={20} />
              </TouchableOpacity>
              : <TouchableOpacity onPress={editName}>
                <Image source={require('../../../assets/mine-image/edit.png')} style={styles.editIcon} />
              </TouchableOpacity>
          }
        </View>
      </View>
    </ImageBackground>
  )
}

export default connect(
  (state: any) => state.userData
)(Header)

const styles = StyleSheet.create({
  container: {
    height: pxToDp(480),
  },
  content: {
    width: pxToDp(200),
    position: 'absolute',
    bottom: pxToDp(50),
    left: '50%',
    marginLeft: pxToDp(-100),
    alignItems: 'center'
  },
  avatar: {
    width: pxToDp(150),
    height: pxToDp(150),
    borderRadius: pxToDp(75),
    marginBottom: pxToDp(15),
    overflow: 'hidden',
    justifyContent: 'flex-end'
  },
  input: {
    width: '100%',
    height: pxToDp(60),
    fontSize: pxToDp(32),
    textAlign: 'center',
    color: Colors.whiteColor,
    padding: 0
  },
  editIcon: {
    width: pxToDp(28),
    height: pxToDp(28)
  },
  editAvatar: {
    paddingTop: pxToDp(5),
    fontSize: pxToDp(20),
    backgroundColor: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    color: Colors.whiteColor,
    height: pxToDp(40)
  }
})