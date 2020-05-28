import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image, PixelRatio, TextInput } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

interface Props {
  countDown: number;
  disabledSendBtn: boolean;
  sendMsg(): void;
  changeTelNum(value: string): void;
  changeVerCode(value: string): void;
  changeInvCode(value: string): void;
}

export default function Form(props: Props) {
  const { disabledSendBtn: disabled, countDown } = props

  return (
    <View style={styles.container}>
      <View style={styles.formItem}>
        <View style={styles.formItemOption}>
          <Image source={require('../../../assets/login-image/icon_tel.png')} style={styles.telIcon} />
          <TextInput
            placeholder='请输入手机号'
            style={styles.input}
            onChangeText={value => props.changeTelNum(value)} maxLength={11}
            keyboardType='phone-pad'
            returnKeyType='next'
          />
        </View>
      </View>
      <View style={styles.formItem}>
        <View style={styles.formItemOption}>
          <Image source={require('../../../assets/login-image/icon_vercode.png')} style={styles.verIcon} />
          <TextInput
            placeholder='请输入验证码'
            style={styles.input}
            onChangeText={value => props.changeVerCode(value)}
            maxLength={6}
            keyboardType='number-pad'
            returnKeyType='next'
          />
        </View>

        <Text style={[styles.sendMeg, disabled && styles.disabledStyle]} onPress={props.sendMsg}>{disabled ? `${countDown}秒重发` : '发送验证码'}</Text>
      </View>

      <View style={styles.formItem}>
        <View style={styles.formItemOption}>
          <Image source={require('../../../assets/login-image/icon_invcode.png')} style={styles.invIcon} />
          <TextInput
            placeholder='请输入邀请码'
            style={styles.input}
            onChangeText={value => props.changeInvCode(value)}
            maxLength={6}
            returnKeyType='done'
          />
        </View>
      </View>

    </View>
  )
}

const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    marginTop: (deviceHeight - pxToDp(240)) / 2
  },
  formItem: {
    width: pxToDp(560),
    height: pxToDp(120),
    marginBottom: pxToDp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1 / PixelRatio.get(),
    backgroundColor: Colors.whiteColor
  },
  formItemOption: {
    paddingLeft: pxToDp(12),
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  telIcon: {
    width: pxToDp(28),
    height: pxToDp(42)
  },
  verIcon: {
    width: pxToDp(32),
    height: pxToDp(36)
  },
  invIcon: {
    width: pxToDp(32),
    height: pxToDp(32)
  },
  input: {
    height: '100%',
    width: pxToDp(300),
    marginLeft: pxToDp(15)
  },
  sendMeg: {
    width: pxToDp(182),
    height: pxToDp(56),
    lineHeight: pxToDp(56),
    textAlign: 'center',
    borderRadius: pxToDp(26),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.yellowColor,
    fontSize: pxToDp(24),
    color: Colors.yellowColor
  },
  disabledStyle: {
    borderColor: Colors.borderColor,
    color: Colors.borderColor
  }
})