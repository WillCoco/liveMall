/**
 *  修复拉流上层图层(聊天窗和底部按钮、输入框)绘制问题
 */
import React from 'react';
import {Keyboard} from 'react-native';

export default function useFixDraw() {
  React.useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardDidHide', () => {
      fetch('fixdrawbug')
      .catch(console.log)
    });

    return () => {
      keyboardListener.remove();
    }
  }, []);
}
