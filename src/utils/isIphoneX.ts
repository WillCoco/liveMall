import {Platform, Dimensions} from 'react-native';

let screenW = Dimensions.get('window').width;
let screenH = Dimensions.get('window').height;

export default function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    ((screenH === 812 && screenW === 375) ||
      (screenH === 896 && screenW === 414))
  );
}
