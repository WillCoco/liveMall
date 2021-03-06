import React, { useState } from 'react'
import { Text, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { toggleLoginState, setToke, setUserInfo } from '../../actions/user'
import { Portal, Toast } from '@ant-design/react-native'

import Form from './Form/Form'

import { Colors } from '../../constants/Theme'
import pxToDp from '../../utils/px2dp'

import { apiSendVerCode, apiWeChatRegister, apiGetUserData } from '../../service/api'

const phonePattern = /^1[3456789]\d{9}$/

let timer: any

function BindPhoneNumber(props: any) {
  const navigation = useNavigation()
  const route: any = useRoute()

  const unionId = route.params

  const [telNum, setTelNum] = useState('')
  const [verCode, setVerCode] = useState('')
  const [invCode, setInvCode] = useState('')
  const [disabled, setDisabled] = useState(false)
  let [countDown, setCountDown] = useState(60)

  navigation.setOptions({
    headerTitle: '',
    headerStyle: {
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false,
    headerTransparent: true
  })

  /**
   * 输入手机号
   */
  const changeTelNum = (value: string) => {
    setTelNum(value)
  }

  /**
   * 输入验证码
   */
  const changeVerCode = (value: string) => {
    setVerCode(value)
  }

  /**
   * 输入邀请码
   */
  const changeInvCode = (value: string) => {
    setInvCode(value)
  }

  /**
   * 发送验证码
   */
  const sendMsg = () => {
    if (disabled) return

    if (!phonePattern.test(telNum)) {
      Toast.fail('请输入正确的手机号')
      return
    }

    const loading = Toast.loading('')

    apiSendVerCode({ userTel: telNum }).then((res: any) => {
      console.log('发送验证码', res)

      Portal.remove(loading)

      Toast.success('验证码已发送')

      setDisabled(true)

      timer = setInterval(() => {
        setCountDown(countDown--)
        if (countDown <= 0) {
          clearInterval(timer)
          setDisabled(false)
          setCountDown(60)
        }
      }, 1000)
    }).catch((err: any) => {
      console.log('发送验证码', err)
    })
  }

  /**
   * 登录操作
   */
  const toLogin = () => {
    if (!phonePattern.test(telNum)) {
      Toast.fail('请输入正确的手机号')
      return
    }

    // if (verCode.length !== 6) {
    //   Toast.fail('请输入正确的验证码')
    //   return
    // }
    if (!verCode) {
      Toast.fail('请输入正确的验证码')
      return
    }

    if (!invCode) {
      Toast.fail('请输入邀请码')
      return
    }

    const params = {
      userTel: telNum,
      code: verCode,
      inviteCode: invCode,
      unionId
    }

    apiWeChatRegister(params).then((res: any) => {
      console.log('绑定手机号', res)

      if (res) {
        props.dispatch(toggleLoginState(true))
        props.dispatch(setToke(res))

        Toast.success('绑定成功')

        apiGetUserData().then((res: any) => {
          props.dispatch(setUserInfo(res))
        }).catch((err: any) => {
          console.log(err)
        })

        setTimeout(() => {
          navigation.navigate('首页')
        }, 1500)
      }
    }).catch((err: any) => {
      console.log('注册登录', err)
    })
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/login-image/login_bgi.png')}
    >
      <Image
        style={styles.logo}
        source={require('../../assets/login-image/logo.png')}
      />

      <Form
        countDown={countDown}
        disabledSendBtn={disabled}
        sendMsg={sendMsg}
        // userTel={telNum}
        changeTelNum={(value: string) => changeTelNum(value)}
        changeVerCode={(value: string) => changeVerCode(value)}
        changeInvCode={(value: string) => changeInvCode(value)}
      />

      <TouchableOpacity style={styles.loginBtnContainer} onPress={toLogin}>
        <Text style={styles.btnText}>绑定账号</Text>
      </TouchableOpacity>

    </ImageBackground>
  )
}

export default connect()(BindPhoneNumber)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  logo: {
    position: 'absolute',
    width: pxToDp(240),
    height: pxToDp(240),
    top: pxToDp(140),
    right: pxToDp(88)
  },
  loginBtnContainer: {
    width: pxToDp(600),
    height: pxToDp(90),
    backgroundColor: Colors.basicColor,
    borderRadius: pxToDp(45),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pxToDp(90)
  },
  btnText: {
    fontSize: pxToDp(28),
    color: Colors.whiteColor
  },
  weChatContent: {
    alignItems: 'center',
    marginTop: pxToDp(50)
  },
  wechatIcon: {
    width: pxToDp(80),
    height: pxToDp(80)
  },
  text: {
    fontSize: pxToDp(30),
    color: Colors.darkBlack,
    marginTop: pxToDp(10)
  }
})

