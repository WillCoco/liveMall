/**
 * 
 */
import * as React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {PrimaryText, T4} from 'react-native-normalization-text';
import { vw } from '../../../utils/metric';
import ButtonRadius from '../../Buttons/ButtonRadius';
import { radioLarge, pad, radio } from '../../../constants/Layout';
import { StyleProp } from 'react-native';
import { Colors } from '../../../constants/Theme';
import MaskContext from '../MaskContext';
import {Actions} from '../reducer';

const Normal = (props: {
  title: string,
  text: string,
  leftBtnText: string,
  showLeftBtn: boolean,
  rightBtnText: string,
  showRightBtn: boolean,
  disabledLeft?: boolean,
  disabledRight?: boolean,
  onPressLeft: (v?: any) => any,
  onPressRight: (v?: any) => any,
  textStyle: StyleProp<any>,
  titleStyle: StyleProp<any>,
}) =>  {
  const [, dispatch] = React.useContext(MaskContext)

  /**
   * 取消
   */
  const onPressLeft = () => {
    if (props.onPressLeft) {
      const needRemove = props.onPressLeft();
      if (needRemove) {
        dispatch({type: Actions.REMOVE});
      }
      return;
    }
    dispatch({type: Actions.REMOVE});
  }
  
  /**
   * 确定
   */
  const onPressRight = () => {
    const needRemove = props.onPressRight();
    if (needRemove) {
      dispatch({type: Actions.REMOVE});
    }
  }

  return (
    <View style={styles.style}>
      <T4 style={StyleSheet.flatten([styles.title, props.titleStyle])}>{props.title}</T4>
      <PrimaryText style={StyleSheet.flatten([styles.text, props.textStyle])}>{props.text}</PrimaryText>
      <View style={styles.btnsWrapper}>
        {
          props.showLeftBtn &&
          <ButtonRadius
            size={40}
            disabled={props.disabledLeft}
            text={props.leftBtnText}
            onPress={onPressLeft}
            style={StyleSheet.flatten([styles.button, styles.leftButton])}
          />
        }
        {
          props.showRightBtn && 
          <ButtonRadius
            size={40}
            disabled={props.disabledRight}
            text={props.rightBtnText}
            onPress={onPressRight}
            style={StyleSheet.flatten([styles.button, styles.rightButton])}
          />
        }
      </View>
    </View>
  )
};

Normal.defaultProps = {
  leftBtnText: '取消',
  showLeftBtn: true,
  showRightBtn: true,
};

const styles = StyleSheet.create({
  style: {
    width: vw(86),
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: radioLarge,
    padding: pad * 2,
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    maxWidth: vw(60),
    marginTop: pad * 2,
    padding: pad,
  },
  btnsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginTop: pad * 2
  },
  button: {
    width: 120,
    borderRadius: radio,
  },
  leftButton: {
    backgroundColor: Colors.lightGrey,
    marginRight: pad * 4
  },
  rightButton: {

  }
});

export default Normal;