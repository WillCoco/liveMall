/**
 * 直播店铺商品管理行
 *  预览、编辑、上架、删除
 * 用于:
 *  商品管理
 */
import * as React from 'react';
import { Colors } from '../../constants/Theme';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { T3, PrimaryText, SmallText, scale } from 'react-native-normalization-text';
import Iconarrowright from '../Iconfont/Iconarrowright';
import ButtonOutLine from '../../components/Buttons/ButtonOutLine';
// import defaultImages from '../../assets/images/default-images';
import defaultImages from '../../assets/default-image';
import { pad, radio } from '../../constants/Layout';
import DiscountPrice from '../../components/DiscountPrice';
import formatGoodsPrice from '../../utils/formatGoodsPrice';

interface GoodManageRowProps {
  data: {
      originalImg: string,
      goodsName: string,
      shopPrice: string,
      marketPrice: string,
  },
  onRemovePress: () => any,
}

const GoodManageRow = (props: GoodManageRowProps) =>  {
  /**
   * 适配数据
   */

  const { data } = props;
  return (
    <View style={styles.style} >
      <View style={StyleSheet.flatten([styles.row])}>
        {/* 图 */}
        <View style={styles.imgWrapper}>
          <Image
            resizeMode="cover"
            source={data.originalImg ? {uri: data.originalImg} : defaultImages.goodCover}
            style={styles.img}
          />
        </View>
        {/* 描述 */}
        <View style={styles.contentWrapper}>
          <View style={styles.titleWrapper}>
            <PrimaryText style={styles.title} numberOfLines={2}>{data.goodsName}</PrimaryText>
          </View>
            <DiscountPrice discountPrice={formatGoodsPrice(+data.shopPrice)} price={formatGoodsPrice(+data.marketPrice)} />

          {/* 操作 */}
          <View style={StyleSheet.flatten([styles.buttonsWrapper, ])}>
            {/*<ButtonOutLine*/}
              {/*text="上移"*/}
              {/*size={scale(26)}*/}
              {/*style={styles.btn}*/}
              {/*onPress={props.onMoveUpPress}*/}
            {/*/>*/}
            {/*<ButtonOutLine*/}
              {/*text="下移"*/}
              {/*size={scale(26)}*/}
              {/*style={styles.btn}*/}
              {/*onPress={props.onMoveDownPress}*/}
            {/*/>*/}
            <ButtonOutLine
              text="删除"
              size={scale(26)}
              textStyle={{color: Colors.basicColor}}
              style={StyleSheet.flatten([styles.btn, {color: Colors.basicColor, borderColor: Colors.basicColor}])}
              onPress={props.onRemovePress}
            />
          </View>
        </View>
      </View>
    </View>
  )
};

GoodManageRow.defaultProps = {
  // dataAdapter: (data: any) => ({
  //   isOnSale: data.isOnSale,
  //   img: data.img || images.goodCover,
  //   title: data.title || 'Nike耐克男鞋AJ',
  //   SKUQuantity: data.SKUQuantity || 1, // 库存
  //   saleQuantity: data.salesQuantity || 123, // 销量
  //   priceSign: data.priceSign || '¥ ', // 销量
  //   price: data.price || 't123.33', // 销量
  // }),
};

const ROW_HEIGHT = 125;

const styles = StyleSheet.create({
  style: {
    flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // alignItems: 'center',
    height: ROW_HEIGHT,
    minHeight: ROW_HEIGHT,
    maxHeight: ROW_HEIGHT,
    backgroundColor: '#fff',
    borderBottomWidth: 4,
    borderColor: Colors.divider,
    paddingHorizontal: pad,
    paddingVertical: pad / 2
  },
  titleWrapper: {
    height: scale(42),
    // justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
  },
  price: {
    color: Colors.basicColor,
  },
  imgWrapper: {
    marginRight: pad
  },
  arrow: {
    transform: [{skewX: '180deg'}]
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  img: {
    height: 110,
    width: 110,
    borderRadius: radio
  },
  row: {
    flexDirection: 'row'
  },
  buttonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginLeft: pad * 3,
  },
  btn: {
    width: scale(50),
    marginLeft: pad
  }
});

export default GoodManageRow;