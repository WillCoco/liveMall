/**
 *  键盘hook
 */
import React from 'react';
import {Keyboard} from 'react-native';

export default function useFixDraw() {
  const [h, sH] = React.useState(0)

  React.useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardDidShow', (e) => {
      sH(e.endCoordinates.height);
    });

    const keyboardListener1 = Keyboard.addListener('keyboardDidHide', (e) => {
      sH(0);
    });

    return () => {
      keyboardListener.remove();
      keyboardListener1.remove();
    }
  }, []);

  return {
    isShow: !!h,
    keyboardHeight: h,
  }
}
