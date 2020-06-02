/**
 * 图片选择组件
 */
import * as React from 'react';
import {
  View,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {PrimaryText} from 'react-native-normalization-text';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import {Colors} from '../../constants/Theme';
import {pad} from '../../constants/Layout';

interface ImagePickerBoxProps {
  style?: StyleProp<any>,
  dateWrapper?: StyleProp<any>,
  dateWrapperStyle?: StyleProp<any>,
  timeWrapper?: StyleProp<any>,
  timeWrapperStyle?: StyleProp<any>,
  onPicked: (time?: string, type?: PickTimeMode) => undefined,
}

export enum PickTimeMode {
  date = 'date',
  time = 'time',
}

const ImagePickerBox = (props: ImagePickerBoxProps) =>  {
  /**
   * 显示时间选择器
   */
  const [isShowDatePicker, setIsShowDatePicker]: Array<any> = React.useState();

  /**
   * 时间选择器模式
   */
  const [datePickerMode, setDatePickerMode]: [PickTimeMode, any] = React.useState(PickTimeMode.date);
  
  const [hour, setHour]: Array<any> = React.useState();
  const [date, setDate]: Array<any> = React.useState();

  /**
   * 时间format
   */
  const formatDate = (timestamp: number, format: any = {
    Y: undefined,
    M: '月',
    D: '日',
  }) => {
    if (!timestamp) {
      return;
    };
    const t =  dayjs(timestamp);
    if (format.Y) {
      return `${t.year()}${format.Y || ''}${t.month()+1}${format.M || ''}${t.date()}${format.D || ''}`;
    }
    return `${t.month()+1}${format.M || ''}${t.date()}${format.D || ''}`;
  }

  const formatTime = (timestamp: number, format: any = {
    h: '点',
    m: '分',
  }) => {
    if (!timestamp) {
      return;
    };
    const t = dayjs(timestamp);
    return `${t.hour()}${format.h || ''}${t.minute()}${format.m || ''}`
  }

  const dateTime = formatDate(date);
  const hourTime = formatTime(hour);

  const onPressPickDate = (mode?: PickTimeMode) => {
    // android 时间和日期需要分开选择
    setDatePickerMode(mode);
    setIsShowDatePicker(true);
  }

  const onDeteChange = React.useCallback((e: any) => {
    setIsShowDatePicker(false);

    if (e.type === 'set') {
      if (datePickerMode === PickTimeMode.date) {
        setDate(e.nativeEvent.timestamp)
        props.onPicked(formatDate(e.nativeEvent.timestamp, {Y: '.', M: '.'}), PickTimeMode.date);
        return;
      }
      setHour(e.nativeEvent.timestamp)
      console.log(e.nativeEvent.timestamp, 111)
      props.onPicked(formatTime(e.nativeEvent.timestamp, {h: ':'}), PickTimeMode.time);
    }
  }, [dateTime, hourTime, datePickerMode])


  return (
    <View style={StyleSheet.flatten([styles.style, props.style])}>
      {
        <>
          <TouchableOpacity style={StyleSheet.flatten([styles.dateWrapper, props.dateWrapperStyle])} onPress={() => onPressPickDate(PickTimeMode.date)}>
            <PrimaryText style={styles.dateText}>{dateTime || '选择日期'}</PrimaryText>
          </TouchableOpacity>
          <TouchableOpacity style={StyleSheet.flatten([styles.timeWrapper, props.timeWrapperStyle])} onPress={() => onPressPickDate(PickTimeMode.time)}>
            <PrimaryText style={styles.timeText}>{hourTime || '选择时间'}</PrimaryText>
          </TouchableOpacity>
        </>
      }
      {
        isShowDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={new Date()}
            mode={datePickerMode}
            is24Hour={true}
            display="spinner"
            onChange={onDeteChange}
          />
        )
      }
    </View>
  )
};

ImagePickerBox.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flexDirection: 'row',
    // backgroundColor: Colors.bgColor,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {

  },
  dateWrapper: {

  },
  dateText: {
    marginRight: pad
  },
  timeText: {},
  timeWrapper: {},
  placeholderText: {
    color: Colors.lightGrey,
    marginTop: pad * 2
  }
});

export default ImagePickerBox;