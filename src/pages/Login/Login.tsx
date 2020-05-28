import React, { useState } from 'react'
import { Text, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import { toggleLoginState, setToke, setUserInfo } from '../../actions/user'
import { Portal, Toast } from '@ant-design/react-native'
import * as WeChat from 'react-native-wechat-lib'

import Form from './Form/Form'

import { Colors } from '../../constants/Theme'
import pxToDp from '../../utils/px2dp'

import { apiSendVerCode, apiLogin, apiGetUserData, apiWeChatLogin } from '../../service/api'

const phonePattern = /^1[3456789]\d{9}$/

let timer: any

function Logion(props: any) {
  const navigation: any = useNavigation()
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
      Toast.fail('请输入正确的手机号')
      return
    }

    const loading = Toast.loading('')

    apiSendVerCode({ userTel: telNum }).then((res: any) => {
      console.log('发送验证码', res)

      setHasRegister(res)

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
      // Toast.fail('发送失败，请稍后再试')
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

    if (!hasRegister && !invCode) {
      Toast.fail('请输入邀请码')
      return
    }

    const params = {
      userTel: telNum,
      code: verCode,
      inviteCode: invCode
    }

    apiLogin(params).then((res: any) => {
      console.log('注册&登录', res)

      if (res) {
        props.dispatch(toggleLoginState(true))
        props.dispatch(setToke(res))

        Toast.success('登录成功')

        apiGetUserData().then((res: any) => {
          props.dispatch(setUserInfo(res))
        }).catch((err: any) => {
          console.log(err)
        })

        setTimeout(() => {
          navigation.goBack()
        }, 1500)
      }
    }).catch((err: any) => {
      console.log('注册登录', err)
    })
  }

  /**
   * 微信登录
   */
  const loginWithWeChat = () => {
    // navigation.push('BindPhoneNumber')
    // WeChat.isWXAppInstalled().then(res => {
    //   if (res) {
    //     WeChat.sendAuthRequest(
    //       'snsapi_userinfo',
    //       '云闪播微信登录'
    //     ).then((res: any) => {
    //       console.log(res)
    //       if (res.errCode === 0) {
    //         // weChatLogin(res.code)
    //       }
    //     }).catch((err: any) => {
    //       Toast.fail('未获得微信授权')
    //       console.log(err)
    //     })
    //   } else {
    //     Toast.fail('请先到应用商店下载安装微信')
    //   }
    // })
  }

  /**
   * 处理微信登录逻辑
   */
  const weChatLogin = (code: string) => {
    apiWeChatLogin({ code }).then((res: any) => {
      console.log(res, '======')
    }).catch((err: any) => {
      console.log(err)
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
        hasRegister={hasRegister}
        disabledSendBtn={disabled}
        sendMsg={sendMsg}
        changeTelNum={(value: string) => changeTelNum(value)}
        changeVerCode={(value: string) => changeVerCode(value)}
        changeInvCode={(value: string) => changeInvCode(value)}
      />

      <TouchableOpacity style={styles.loginBtnContainer} onPress={toLogin}>
        <Text style={styles.btnText}>登录/注册</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.weChatContent} onPress={loginWithWeChat}>
        <Image source={require('../../assets/login-image/wechat.png')} style={styles.wechatIcon} />
        <Text style={styles.text}>微信登录</Text>
      </TouchableOpacity>

    </ImageBackground>
  )
}

export default connect()(Logion)

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

