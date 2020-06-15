/**
 * 直播封面、标题编辑
 */
import * as React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { pad, radioLarge } from '../../constants/Layout';
import ImagePickerBox from '../../components/ImagePickerBox';

const LiveReadyCard = (props: {
  onChangeCover: (cover?: string) => any,
  onChangeTitle: (title?: string) => any,
  title: string,
}) =>  {
  // const dispatch = useDispatch();
  
  React.useEffect(() => {
  }, [])

  // 封面
  const onChangeCover = (cover?: any): any => {
    props.onChangeCover(cover)
  }

  // console.log('liveCover', liveCover)

  return (
    <View style={styles.style}>
      <ImagePickerBox
        onPicked={(r?: any) => {onChangeCover(r)}}
        style={styles.imgWrapper}
      />
      <View style={styles.contentWrapper}>
        <TextInput
          multiline
          blurOnSubmit
          value={props.title}
          onChangeText={props.onChangeTitle}
          textAlignVertical="top"
          placeholder="编辑直播标题"
          placeholderTextColor="#FFF"
          maxLength={20}
          returnKeyLabel="完成"
          returnKeyType="done"
          style={styles.input}
          onSubmitEditing={props.onSubmitEditing}
        />
      </View>
    </View>
  )
};

LiveReadyCard.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: pad,
    borderRadius: radioLarge,
    height: 135,
  },
  imgWrapper: {
    width: 115,
    height: 115,
    marginRight: pad,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    flex: 1,
  },
  input: {
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    color: '#fff'
    // lineHeight: 12
  }
});

export default LiveReadyCard;