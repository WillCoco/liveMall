/**
 * 预组货行
 */
import * as React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StyleProp,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {PrimaryText, SmallText, T3, scale, T1} from 'react-native-normalization-text';
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
import Avatar from '../../../components/Avatar';

interface BrandGoodRowProps {
  data: any,
  dataAdapter: (d: any) => {
    img: any,
    bankName: string,
    cardType: string,
    bankAccountNo: string,
    bgNum: string | number
  },
  imgStyle: StyleProp<any>,
  style: StyleProp<any>,
  onPress: (d: any) => any,
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
      onPress={onPress}
    >
      <ImageBackground source={images['bankBg' + props?.bgNum]} style={styles.cardWrapper}>
        <Avatar source={images.bankIcon} style={StyleSheet.flatten([styles.avatar, props.imgStyle])} />
        <View style={styles.contentWrapper}>
          <T3 numberOfLines={1} style={{color: Colors.whiteColor}}>{data.bankName}</T3>
          <T1 numberOfLines={1} style={{color: Colors.whiteColor}}>**** **** **** {data.bankAccountNo}</T1>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
};

BrandGoodRow.defaultProps = {
  data: {
    bank: '银行?',
    cardType: '储蓄卡?',
    cardId: '1231231231231?'
  },
  disabled: false,
  actionText: '添加'
};

const ROW_HEIGHT = 120 + pad;
const styles = StyleSheet.create({
  style: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
    minHeight: ROW_HEIGHT,
    paddingHorizontal: pad,
    paddingVertical: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  cardWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: ROW_HEIGHT,
    paddingVertical: pad * 2,
    paddingHorizontal: pad,
  },
  contentWrapper: {
    flex: 1,
    marginRight: pad,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: pad
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
  typeText: {
    color: Colors.whiteColor,
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