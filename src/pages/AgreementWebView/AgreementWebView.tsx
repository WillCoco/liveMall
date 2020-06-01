/**
 * 协议页面
 */
import React from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { WebView } from 'react-native-webview'
import { Colors } from '../../constants/Theme'
import withPage from '../../components/HOCs/withPage'
import { AGREEMENT_ADD } from '../../service/api'

// 云闪播主播入驻服务协议 path: 'anchorEntry',
// 云闪播直播平台管理规范 path: 'livePlatformStandard',
// 商家入驻协议 path: 'merchantEntry',
// 平台商家违规管理规则path: 'merchantViolateRules',
// 云闪播用户隐私政策协议 path: 'privacyPolicy',
// 平台违禁类目管理规则path: 'prohibitedCategoryRules',
// 云闪播供货框架协议path: 'supplyFramework',
// 云闪播用户协议 path: 'userAgreement',

function AgreementWebView() {
  const route: any = useRoute()
  const navigation: any = useNavigation()

  const agreementUrl = AGREEMENT_ADD + route?.params?.url
  const title = route?.params?.title 

  navigation.setOptions({
    headerTitle: title || '协议',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })


  console.log(agreementUrl);

  return (
    <WebView
      style={{ opacity: 0.99 }}
      source={{ uri: agreementUrl }}
    />
  )
}

export default withPage(AgreementWebView)