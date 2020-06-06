/**
 * 动态获取android权限 hook 
 */
import React from 'react';
import * as ImagePicker from 'expo-image-picker';

const DEFAULT_IMAGES_OPTIONS = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  // allowsEditing: true, // 这引起了cancelled
  allowsMultipleSelection: false,
  aspect: [4, 3],
  quality: 1,
  exif: false,
}

const DEFAULT_VEDIOS_OPTIONS = {
  mediaTypes: ImagePicker.MediaTypeOptions.Videos,
}

const pick = async (options: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images
}) : Promise<any> => {
  let ops: any;
  
  if (options.mediaTypes === ImagePicker.MediaTypeOptions.Images) {
    ops = DEFAULT_IMAGES_OPTIONS
  } else if (options.mediaTypes === ImagePicker.MediaTypeOptions.Videos) {
    ops = DEFAULT_VEDIOS_OPTIONS
  }
  
  try {
    let result = await ImagePicker.launchImageLibraryAsync(ops);
    console.log(result, 'resultresultresultresult')
    if (!result?.cancelled) {
      return result
    }
  } catch (E) {
    console.log(E);
  }
};

 export default pick;