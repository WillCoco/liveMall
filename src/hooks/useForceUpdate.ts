/**
 * 强制刷新
 *  修复图层绘制问题
 */
import React from 'react';

export default function useForceUpdate() {
  const [_, forceUpdate] = React.useState(0);
  return () => forceUpdate(x => x + 1);
}
