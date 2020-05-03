/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

const Iconcartlight = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M142.336 157.920256h794.278912c25.933824 5.18656 33.995776 16.26624 27.328512 43.600896-10.008576 41.039872-44.34944 151.419904-102.701056 329.962496-3.03104 8.609792-15.460352 16.093184-41.951232 20.4032-34.42688 5.60128-223.891456 21.588992-563.505152 47.461376l4.6592 52.27008c343.6032-26.175488 531.534848-42.033152 568.679424-48.0768 45.0816-7.334912 75.445248-25.616384 86.25152-56.3712 59.00288-180.514816 93.47584-291.320832 103.912448-334.113792 13.779968-56.497152-14.826496-95.812608-77.228032-107.097088L142.336 105.472v52.448256z"
        fill={getIconColor(color, 0, '#ffffff')}
      />
      <Path
        d="M290.569216 697.459712c-6.56384-3.171328-12.033024-6.40512-15.9744-9.472-2.59584-2.019328-4.8128-4.46464-6.68672-7.308288-4.005888-6.074368-5.732352-12.4928-5.955584-15.507456-1.133568-7.171072-1.133568-7.171072-4.902912-28.5696a47052.168192 47052.168192 0 0 0-12.21632-68.93568c-12.691456-71.31648-25.537536-142.633984-37.74464-209.206272-2.029568-11.063296-2.029568-11.063296-4.062208-22.109184-31.413248-170.554368-50.999296-268.884992-58.360832-285.78816-8.24832-18.93888-23.114752-32.402432-41.900032-40.794112C86.084608 2.317312 69.951488-0.0512 57.622528 0.003072L29.394944 0C13.727744-0.002048 1.026048 11.738112 1.024 26.220544 1.021952 40.704 13.7216 52.446208 29.387776 52.44928l28.351488 0.003072c4.617216-0.02048 12.83072 1.185792 20.342784 4.54144 6.77376 3.02592 11.344896 7.165952 13.955072 13.1584 4.871168 11.186176 26.09152 117.722112 55.06048 275.003392 2.028544 11.026432 2.028544 11.026432 4.05504 22.071296 12.189696 66.47808 25.020416 137.715712 37.69856 208.954368 4.436992 24.9344 8.538112 48.08704 12.204032 68.864 3.764224 21.368832 3.764224 21.368832 4.594688 26.108928 0.489472 8.26368 4.28544 22.372352 13.81376 36.825088 4.960256 7.52128 11.121664 14.319616 18.597888 20.13696 7.46496 5.807104 16.283648 11.02336 26.23488 15.828992 15.233024 7.359488 30.1056 12.5184 40.572928 15.437824l8.192 1.117184h538.55232c15.666176 0 28.366848-11.74016 28.366848-26.22464 0-14.482432-12.700672-26.223616-28.367872-26.223616H317.472768c-7.283712-2.259968-17.222656-5.915648-26.903552-10.591232zM369.468416 967.486464c29.5936 0 53.582848-22.176768 53.582848-49.533952 0-27.357184-23.990272-49.534976-53.582848-49.534976-29.5936 0-53.581824 22.177792-53.581824 49.534976s23.989248 49.533952 53.581824 49.533952z m0 55.36256C306.801664 1022.849024 256 975.885312 256 917.952512S306.80064 813.056 369.468416 813.056c62.666752 0 113.46944 46.963712 113.46944 104.896512s-50.802688 104.896512-113.46944 104.896512zM766.780416 967.486464c29.5936 0 53.582848-22.176768 53.582848-49.533952 0-27.357184-23.990272-49.534976-53.582848-49.534976-29.5936 0-53.581824 22.177792-53.581824 49.534976s23.989248 49.533952 53.581824 49.533952z m0 55.36256C704.113664 1022.849024 653.312 975.885312 653.312 917.952512S704.11264 813.056 766.780416 813.056c62.666752 0 113.46944 46.963712 113.46944 104.896512s-50.802688 104.896512-113.46944 104.896512z"
        fill={getIconColor(color, 1, '#ffffff')}
      />
    </Svg>
  );
};

Iconcartlight.defaultProps = {
  size: 18,
};

export default Iconcartlight;