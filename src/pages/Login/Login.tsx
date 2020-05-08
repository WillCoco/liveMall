import React, { useState } from 'react'
import { Text, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import { toggleLoginState, setToke } from '../../actions/user'
import Toast from 'react-native-tiny-toast'

import Form from './Form/Form'

import { Colors } from '../../constants/Theme'
import pxToDp from '../../utils/px2dp'

import { apiSendVerCode, apiLogin } from '../../service/api'

const phonePattern = /^1[3456789]\d{9}$/

let timer: any

function Logion(props: any) {
  const navigation = useNavigation()
  const [telNum, setTelNum] = useState('')
  const [verCode, setVerCode] = useState('')
  const [invCode, setInvCode] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [hasRegister, setHasRegister] = useState(true)
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
      Toast.show('请输入正确的手机号', {
        position: 0
      })
      return
    }

    const loading = Toast.showLoading('')

    apiSendVerCode({ userTel: telNum }).then(res => {
      console.log('发送验证码', res)

      setHasRegister(res)

      Toast.hide(loading)

      Toast.showSuccess('验证码已发送')

      setDisabled(true)

      timer = setInterval(() => {
        setCountDown(countDown--)
        if (countDown <= 0) {
          clearInterval(timer)
          setDisabled(false)
          setCountDown(60)
        }
      }, 1000)
    })
  }

  /**
   * 登录操作
   */
  const toLogin = () => {
    if (!phonePattern.test(telNum)) {
      Toast.show('请输入正确的手机号', {
        position: 0
      })
      return
    }

    if (verCode.length !== 6) {
      Toast.show('请输入正确的验证码', {
        position: 0
      })
      return
    }

    const params = {
      userTel: telNum,
      code: verCode,
      inviteCode: invCode
    }

    apiLogin(params).then(res => {
      console.log('注册&登录', res)

      if (res) {
        props.dispatch(toggleLoginState(true))
        props.dispatch(setToke(res))

        Toast.showSuccess('登录成功')

        setTimeout(() => {
          navigation.goBack()
        }, 1500)
      }
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
        telNum={telNum}
        verCode={verCode}
        invCode={invCode}
        disabledSendBtn={disabled}
        countDown={countDown}
        hasRegister={hasRegister}
        changeTelNum={(value: string) => changeTelNum(value)}
        changeVerCode={(value: string) => changeVerCode(value)}
        changeInvCode={(value: string) => changeInvCode(value)}
        sendMsg={sendMsg}
      />

      <TouchableOpacity style={styles.loginBtnContainer} onPress={toLogin}>
        <Text style={styles.btnText}>登录/注册</Text>
      </TouchableOpacity>

    </ImageBackground>
  )
}

export default connect()(Logion)

const styles = StyleSheet.create({
  container: {
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
  }
})

