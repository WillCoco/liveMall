import './shim';
import { UIManager, AppRegistry, Platform, YellowBox } from 'react-native';
import App from './App';
import * as WeChat from 'react-native-wechat-lib'
import { CommonActions } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { getNavigation } from './src/navigation/RootNavgation';


// 导航颜色丢失
enableScreens();

WeChat.registerApp('wx2044e26389662025', 'https://www.championlive.com/apple-app-site-association/').then(res => {
  console.log('微信插件注册成功', res)
}).catch(err => {
  console.log('微信插件注册失败', err)
})

// 错误捕获
global.ErrorUtils.setGlobalHandler(function (err) {
  const navigation = getNavigation();
  try {
    navigation.dispatch(
      CommonActions.navigate('ErrorPage', { errorInfo: err.toString() })
    );
  } catch (err) {
    console.log('global ignore err:', err)
  }
});

// 去除console
if (!__DEV__) {
  global.console.log = () => undefined;
  global.console.warn = () => undefined;
  global.console.info = () => undefined;
  global.console.error = () => undefined;
  global.console.table = () => undefined;
}

// 忽略警告
YellowBox.ignoreWarnings([
  'Setting a timer',
  // node_modules的循环引用
  'rn-fetch-blob',
  'Require cycle: node_modules/rn-fetch-blob/index.js',
  // tim
  'on 接口的 handler 参数推荐使用具名函数',
  'UploadController._init 没有检测到上传插件'
])

// 开启动画
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
AppRegistry.registerComponent('championApp', () => App);
