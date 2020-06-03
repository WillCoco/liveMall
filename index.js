import { UIManager, AppRegistry } from 'react-native';
import App from './App';
import * as WeChat from 'react-native-wechat-lib'
// console.log(registerRootComponent, 'registerRootComponent')
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
      CommonActions.navigate('ErrorPage', {errorInfo: err.toString()})
    );
  } catch(err) {
    console.log('global ignore err:', err)
  }
});

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
AppRegistry.registerComponent('championApp', () => App);
