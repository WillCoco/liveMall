/**
 * 
 */
import * as React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  StyleProp,
} from 'react-native';
import {PrimaryText, SmallText, T4} from 'react-native-normalization-text';
import DateTimePicker from '@react-native-community/datetimepicker';
import { vw } from '../../../utils/metric';
import { radioLarge, pad, radio } from '../../../constants/Layout';
import { Colors } from '../../../constants/Theme';
import MaskContext from '../MaskContext';
import {Actions} from '../reducer';

const IOSDatePicker = (props: {
  onPicked: (v?: any) => any,
  style: StyleProp<any>,
}) =>  {
  const [, dispatch] = React.useContext(MaskContext)

  /**
   * 时间选择器模式
   */
  const time: {current: number | undefined} = React.useRef(Date.now());


  const onDeteChange = (e: any) => {
    time.current = e.nativeEvent.timestamp;
  }

  /**
   * 
   */
  const onPressLeft = () => {
    dispatch({type: Actions.REMOVE});
  }

  /**
   * 
   */
  const onPressRight = () => {
    props.onPicked(time.current);
    dispatch({type: Actions.REMOVE});
  }

  return (
    <View style={StyleSheet.flatten([styles.style, props.style])}>
      <DateTimePicker
        testID="dateTimePicker"
        timeZoneOffsetInMinutes={0}
        value={new Date()}
        mode="datetime"
        is24Hour={true}
        display="default"
        onChange={onDeteChange}
        style={StyleSheet.flatten([styles.picker,])}
        locale="zh_CN"
      />
      <View style={styles.btnsWrapper}>
        <PrimaryText
          onPress={onPressLeft}
          style={StyleSheet.flatten([styles.button, styles.leftButton])}
        >
          取消
        </PrimaryText>
        <PrimaryText 
          onPress={onPressRight}
          style={StyleSheet.flatten([styles.button, styles.rightButton])}
        >
          确认
        </PrimaryText>
      </View>
    </View>
  )
};

IOSDatePicker.defaultProps = {
  leftBtnText: '取消'
};

const styles = StyleSheet.create({
  style: {
    width: vw(86),
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: radioLarge,
    paddingVertical: pad * 2,
    alignItems: 'center'
  },
  picker: {
    width: '100%',
  },
  btnsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    marginTop: pad * 4,
    paddingHorizontal: pad * 2
  },
  button: {
    fontWeight: 'bold'
  },
  leftButton: {
    color: Colors.lightGrey
  },
  rightButton: {
    marginLeft: pad * 3,
    color: Colors.basicColor,
  }
});

export default IOSDatePicker;