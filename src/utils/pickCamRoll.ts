/**
 * 动态获取android权限 hook 
 */
import React from 'react';
import ImagePicker from 'react-native-image-picker';

const DEFAULT_OPTIONS =  {
  mediaType: 'photo',
}

const pick = async (options: any = DEFAULT_OPTIONS): Promise<any> => {
  const opts = {...DEFAULT_OPTIONS, ...options, }
  return new Promise((resolve, reject) => {
    ImagePicker.launchImageLibrary(opts, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        resolve(response)
      }
    });
  })
};

 export default pick;