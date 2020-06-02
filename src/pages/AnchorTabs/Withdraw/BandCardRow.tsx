/**
 * 预组货行
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
import {PrimaryText, SmallText, T4, scale} from 'react-native-normalization-text';
import {useNavigation} from '@react-navigation/native';
import withPage from '../../../components/HOCs/withPage';
import PagingList from '../../../components/PagingList';
import {vw} from '../../../utils/metric';
import {Colors} from '../../../constants/Theme';
import { pad, radio } from '../../../constants/Layout';
import NavBar from '../../../components/NavBar';
import GoodsCategoryScroll from '../../../components/GoodsCategoryScroll';
import Empty from '../../../components/Empty';
import ButtonRadius from '../../../components/Buttons/ButtonRadius';
import ShareProfit from '../../../components/ShareProfit';
import DiscountPrice from '../../../components/DiscountPrice';
import Iconremove from '../../../components/Iconfont/Iconremove';
import {getPlatformBrands} from '../../../actions/shop';
import images from '../../../assets/images/index';
import defaultImages from '../../../assets/default-image';

interface BrandGoodRowProps {
  data: any,
  dataAdapter: (d: any) => {
    img: any,
    bank: string,
    cardType: string,
    cardId: string,
  },
  imgStyle: StyleProp<any>,
  style: StyleProp<any>,
  onPressRemove: (d: any) => any,
  onPress: (d: any) => any,
  disabled?: boolean,
  isAdded: boolean, // 是否已经添加
  actionText: string,
}

const BrandGoodRow = (props: BrandGoodRowProps) =>  {

  const data = (props.dataAdapter ? props.dataAdapter(props.data) : props.data) || {};

  /**
   * 点击整行
   */
  const onPress= () => {
    props.onPress && props.onPress(props.data);
  }

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.style, props.style])}
    >
      <Image source={data.img || defaultImages.goodCover} style={StyleSheet.flatten([styles.img, props.imgStyle])} resizeMode="cover" />
      <View style={styles.contentWrapper}>
        <PrimaryText numberOfLines={1} style={{}}>{data.bank}</PrimaryText>
        <PrimaryText numberOfLines={1} style={{}}>{data.cardType}</PrimaryText>
        <PrimaryText numberOfLines={1} style={{}}>{data.cardId}</PrimaryText>
      </View>
    </TouchableOpacity>
  )
};

BrandGoodRow.defaultProps = {
  data: {
    bank: '',
    cardType: '',
    cardId: ''
  },
  disabled: false,
  actionText: '添加'
};

const ROW_HEIGHT = 120;
const styles = StyleSheet.create({
  style: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
    backgroundColor: '#fff'
    // paddingHorizontal: pad
  },
  contentWrapper: {
    flex: 1,
    height: 100,
    marginRight: pad,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: radio,
    marginRight: pad
  },
  checkImg: {
    height: 20,
    width: 20,
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
    padding: pad
  },
  button: {
    width: 80,
    position: 'absolute',
    bottom: pad,
    right: pad,
  }
});

export default withPage(BrandGoodRow);