import { UIManager, AppRegistry, Text } from 'react-native';
import App from './App';
// console.log(registerRootComponent, 'registerRootComponent')
import { CommonActions } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { getNavigation } from './src/navigation/RootNavgation'

// 导航颜色丢失
enableScreens();

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
