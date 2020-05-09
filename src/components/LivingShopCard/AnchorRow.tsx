/**
 * 主播行
 */
import * as React from 'react';
import {
  View,
  Image,
  StyleSheet,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import { PrimaryText, SmallText, T4, scale, T3 } from 'react-native-normalization-text';
import { pad, radio } from '../../constants/Layout';
import ShareProfit from '../ShareProfit';
import DiscountPrice from '..//DiscountPrice';
import Iconremove from '../Iconfont/Iconremove';
import CheckBox from '../CheckBox';
import images from '../../assets/images/index';
import ButtonRadius from '../Buttons/ButtonRadius';
import {Colors} from '../../constants/Theme';

interface AnchorRowProps {
  data: any,
  dataAdapter: (d: any) => any,
  imgStyle: StyleProp<any>,
  style: StyleProp<any>,
  isChecked: boolean,
  index: number,
  onPressBuy: (d?: any) => any,
}

const AnchorRow = (props: AnchorRowProps) =>  {
  const data = (props.dataAdapter ? props.dataAdapter(props.data) : props.data) || {};

  return (
    <View style={StyleSheet.flatten([styles.style, props.style])}>
      <View>
        <Image source={data.img || images.goodCover} style={StyleSheet.flatten([styles.img, props.imgStyle])} resizeMode="cover" />
        <T3 style={styles.index}>{props.index}</T3>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.titleWrapper}>
          <PrimaryText numberOfLines={2} style={{flex: 1}}>{data.title}</PrimaryText>
        </View>
        <ShareProfit profit={111} style={{flex: -1}} />
          <View style={styles.rowBetween}>
            <DiscountPrice discountPrice={120} price={110} />
            <ButtonRadius
              text="去购买"
              size={30}
              style={{width: scale(75), borderRadius: radio * 2}}
              onPress={props.onPressBuy}
            />
          </View>
      </View>
    </View>
  )
};

AnchorRow.defaultProps = {
  data: {
    title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题',
  },
};

const ROW_HEIGHT = 120;
const styles = StyleSheet.create({
  style: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
    backgroundColor: '#fff',
  },
  contentWrapper: {
    flex: 1,
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: radio,
    marginRight: pad
  },
  index: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#fff',
    backgroundColor: Colors.opacityDarkBg1,
    paddingHorizontal: pad
  },
  checkImgWrapper: {
    height: '100%',
    paddingHorizontal: pad,
    justifyContent: 'center'
  },
  titleWrapper: {
    // width: '100%',
    height: scale(42),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  removeBtn: {
    padding: pad,
  },
  rowBetween: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AnchorRow;