/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

const Iconremove = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M764.416 850.432c0 30.208-24.576 54.784-54.784 54.784H314.368c-30.208 0-54.784-24.576-54.784-54.784V268.288h504.832v582.144zM369.152 169.984c0-6.144 5.12-11.264 11.264-11.264h263.68c6.144 0 11.264 5.12 11.264 11.264v33.28H369.152v-33.28z m559.616 32.768H720.896v-33.28c0-41.984-34.304-76.8-76.8-76.8h-263.68c-41.984 0-76.8 34.304-76.8 76.8v33.28H95.232c-18.432 0-33.28 14.848-33.28 33.28s14.848 33.28 33.28 33.28h98.304v581.632c0 66.56 54.272 120.832 120.832 120.832h395.264c66.56 0 120.832-54.272 120.832-120.832V268.288h98.304c18.432 0 33.28-14.848 33.28-33.28s-14.848-32.256-33.28-32.256zM512 806.4c18.432 0 33.28-14.848 33.28-33.28V421.376c0-18.432-14.848-33.28-33.28-33.28s-33.28 14.848-33.28 33.28V773.12c0 18.432 14.848 33.28 33.28 33.28m-154.112 0c18.432 0 33.28-14.848 33.28-33.28V421.376c0-18.432-14.848-33.28-33.28-33.28s-33.28 14.848-33.28 33.28V773.12c1.024 18.432 15.872 33.28 33.28 33.28m308.224 0c18.432 0 33.28-14.848 33.28-33.28V421.376c0-18.432-14.848-33.28-33.28-33.28s-33.28 14.848-33.28 33.28V773.12c0 18.432 14.848 33.28 33.28 33.28"
        fill={getIconColor(color, 0, '#666666')}
      />
    </Svg>
  );
};

Iconremove.defaultProps = {
  size: 18,
};

export default Iconremove;
