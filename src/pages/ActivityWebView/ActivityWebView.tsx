import React from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { WebView } from 'react-native-webview'
import { Colors } from '../../constants/Theme'
import { useSelector } from 'react-redux';

export default function ActivityWebView() {
  const route: any = useRoute()
  const navigation: any = useNavigation()

  /**
  * 实例
  */
  const webviewEl: { current: any } = React.useRef(null);

  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId) || '';

  // const injectedJavascript = `(function() {
  //   window.postMessage = function(data) {
  //     window.ReactNativeWebView.postMessage(data);
  //   };
  // })()`;

  navigation.setOptions({
    headerTitle: '活动页面',
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
      ref={ref => webviewEl.current = ref}
      style={{ opacity: 0.99 }}
      source={{ uri: route.params.url+ '?userId='+ userId + '&platform=app' }}
      // injectedJavaScript={injectedJavascript}
      // onMessage={(event) => { console.log(event.nativeEvent.data); }}
      // onLoadEnd={() => {
      //   webviewEl.current.postMessage(
      //     JSON.stringify({ userId, token, platform: 'app' })
      //   )
      // }}
    />
  )
}