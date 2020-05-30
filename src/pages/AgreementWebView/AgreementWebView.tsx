/**
 * 协议页面
 */
import React from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { WebView } from 'react-native-webview'
import { Colors } from '../../constants/Theme'

export default function ActivityWebView() {
  const route: any = useRoute()
  const navigation: any = useNavigation()

  navigation.setOptions({
    headerTitle: '协议',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  return (
    <WebView
      style={{ opacity: 0.99 }}
      source={{ uri: route.params.url }}
    />
  )
}