import { UIManager, AppRegistry, Text } from 'react-native';
import App from './App';
// console.log(registerRootComponent, 'registerRootComponent')
import { enableScreens } from 'react-native-screens';
enableScreens();

// 错误捕获
global.ErrorUtils.setGlobalHandler(function (err) {
  console.log('Just ignore', err);
});

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
AppRegistry.registerComponent('championApp', () => App);
