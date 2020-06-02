import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../constants/Theme'
import { connect } from 'react-redux'
import { apiLogout } from '../../service/api'
import { toggleLoginState, setUserInfo, setToke } from '../../actions/user'
import Toast from 'react-native-tiny-toast'

import Header from './Header/Header'
import Form from './Form/Form'
import pxToDp from '../../utils/px2dp'

function Setting(props: any) {
  const navigation = useNavigation()

  navigation.setOptions({
    headerTitle: '设置',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false,
    headerTransparent: true
  })

  const logOut = () => {
    apiLogout({
      platform: 'app'
    }).then((res: any) => {
      console.log('退出', res)
      props.dispatch(toggleLoginState(false))
      props.dispatch(setToke(''))
      props.dispatch(setUserInfo({}))
      Toast.showSuccess('已退出登录')

      setTimeout(() => {
        navigation.navigate('首页')
      }, 1000)
    }).catch((err: any) => {
      console.log(err)
    })
  }

  return (
    <View style={styles.style}>
      <View>
        <Header />
        <Form />
      </View>
      <TouchableOpacity style={styles.logOut} onPress={logOut}>
        <Text style={styles.logOutText}>退出登录</Text>
      </TouchableOpacity>
    </View>
  )
}

export default connect()(Setting)

const styles = StyleSheet.create({
  style: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logOut: {
    left: '50%',
    marginLeft: pxToDp(-335),
    marginTop: pxToDp(200),
    marginBottom: pxToDp(100),
    width: pxToDp(670),
    height: pxToDp(80),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.basicColor,
    borderRadius: pxToDp(40)
  },
  logOutText: {
    fontSize: pxToDp(32),
    color: Colors.whiteColor
  }
})