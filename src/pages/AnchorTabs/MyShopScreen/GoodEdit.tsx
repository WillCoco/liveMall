/**
 * 商品编辑
 */
import * as React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {T4, SmallText} from 'react-native-normalization-text';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import NavBar from '../../../components/NavBar';
import withPage from '../../../components/HOCs/withPage';
import GoodManageRow from '../../../components/GoodManageRow/shopGoofManageRow';
import ButtonRadius from '../../../components/Buttons/ButtonRadius';
import {pad} from '../../../constants/Layout';
import {Colors} from '../../../constants/Theme';
import ScrollableTab from '../../../components/ScrollableTab';
import { vw, vh } from '../../../utils/metric';
import Empty from '../../../components/Empty/';
import PagingList from '../../../components/PagingList';
import ImagePickerBox from '../../../components/ImagePickerBox';
import {getShopGoods} from '../../../actions/shop';
import { Toast } from '../../../components/Toast';

const MAX_BANNER_LENGTH = 9;

const GoodEdit = () =>  {
  const navigation = useNavigation();
  const route = useRoute();

  /**
   * 选择还是添加
   */
  const {type, goodInfo} : {
    type?: 'add' | 'edit',
    goodInfo?: any
  } = route?.params || {}

  /**
   * 商品数据
   */
  const [coverImg, setCoverImg]: Array<any> = React.useState(); // 封面
  const [bannerImgs, setBannerImgs]: Array<any> = React.useState([]); // banner
  const [expressFee, setExpressFee]: Array<any> = React.useState(); // 运费
  const [price, setPrice] = React.useState(); // 价格
  const [marketPrice, setMarketPrice]: Array<any> = React.useState(); // 市场价格
  const [returnAddress, setReturnAddress]: Array<any> = React.useState(); // 寄回地址
  

  /**
   * banner选择
   */
  const onPickedBanner = (bannerUri: any, index: number) => {
    setBannerImgs((bannerUris: Array<any>) => {
      const newBanners = [...bannerUris];

      if (!bannerUri) {
        // 删除
        newBanners.splice(index, 1);
        console.log(newBanners, 'newBanners', index);
        return newBanners;
      } else {
        // 增加
        newBanners[index] = bannerUri;
        return newBanners;
      }
    })
  }

  /**
   * banner pick 盒子
   */
  const bannerPickBoxs = bannerImgs.length < MAX_BANNER_LENGTH ? [...bannerImgs, undefined] : [...bannerImgs];

  console.log(bannerPickBoxs, 'bannerPickBoxs')

  return (
    <ScrollView style={styles.style}>
      <NavBar title="商品编辑" leftTheme="light" titleStyle={styles.navText} style={styles.nav} />
      {/* 封面 */}
      <View style={styles.blockWrapper}>
        <T4 style={styles.nickText}>上传商品封面</T4>
        <SmallText>尺寸建议1:1，图片格式支持jpg\png\gif，可上传1张</SmallText>
        <ImagePickerBox
          onPicked={setCoverImg}
          style={styles.coverPicker}
        />
      </View>
      {/* banner */}
      <View style={styles.blockWrapper}>
        <T4 style={styles.nickText}>上传商品banner图</T4>
        <SmallText>尺寸建议750*460，图片格式支持jpg\png\gif，最多可上传9张</SmallText>
        <View style={styles.bannerPickWrapper}>
          {
            bannerPickBoxs.map((banner, index) => {
              console.log(banner, index, 11111)
              return (
                <ImagePickerBox
                  key={`banner_pick_${index}_${banner}`}
                  initImg={banner}
                  onPicked={(uri) => onPickedBanner(uri, index)}
                  style={styles.bannerPicker}
                />
              )
            })
          }
        </View>
      </View>
      {/* 规格 */}

      {/* 颜色 */}
      <View style={styles.blockWrapper}>
        <T4 style={styles.nickText}>上传商品banner图</T4>
      </View>
    </ScrollView>
  )
};

GoodEdit.defaultProps = {
};

const BANNER_WIDTH = (vw(100) - (5 * pad)) / 3;
const BANNER_HEIGHT = BANNER_WIDTH * 460 / 750;

const styles = StyleSheet.create({
  style: {
    flex: 1,
  },
  navText: {
    color: '#fff'
  },
  nav: {
    backgroundColor: Colors.basicColor,
  },
  blockWrapper: {
    paddingHorizontal: pad,
    paddingTop: pad,
    paddingBottom: pad * 2,
    borderBottomWidth: 4,
    borderBottomColor: Colors.bgColor,
    backgroundColor: '#fff',
  },
  coverPicker: {
    marginTop: pad
  },
  bannerPickWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: pad,
  },
  bannerPicker: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    marginHorizontal: pad / 2,
    marginBottom: pad / 2
  }
});

export default withPage(GoodEdit);