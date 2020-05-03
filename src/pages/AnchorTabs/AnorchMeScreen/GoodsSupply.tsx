/**
 * 添加商品页
 * 商品货源(平台、个人)
 */
import * as React from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {PrimaryText, SmallText, T4} from 'react-native-normalization-text';
import Toast from 'react-native-tiny-toast';
import {useNavigation} from '@react-navigation/native';
import withPage from '../../../components/HOCs/withPage';
import {vw} from '../../../utils/metric';
import {Colors} from '../../../constants/Theme';
import { pad, radio } from '../../../constants/Layout';
import NavBar from '../../../components/NavBar';
import GoodsCategoryScroll from '../../../components/GoodsCategoryScroll';
import Empty from '../../../components/Empty';
import GoodCheckBlock from '../../../components/GoodCheckBlock';
import Iconcartlight from '../../../components/Iconfont/Iconcartlight';
import {getPlatformBrands} from '../../../actions/shop';
import images from '../../../assets/images/index';


const GoodsSupply = (props: any) =>  {
  const {navigate, goBack} = useNavigation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    let loading: any;
    const getData = async () => {
      loading = Toast.showLoading('');
      await dispatch(getPlatformBrands());
      Toast.hide(loading);
    };
    getData();

    return () => {
      Toast.hide(loading);
    }
  }, [])

  const onPressBrand = () => {
    // 跳转
    navigate('BrandGoods', {brandId: '1'})
  }

  // 平台品牌
  const platformBrands = useSelector(state => state?.shop?.platformBrands) || [];

  /**
   * 选择的种类
   */
  const [checkedCategory, setCheckedCategory]: Array<any> = React.useState(0);

  /**
   * 种类下的品牌
   */
  const brandsList = React.useMemo(() => {
    console.log(platformBrands, checkedCategory, 'brans')
    return platformBrands[checkedCategory]?.brans || [1,2,3];
  }, [checkedCategory])

  console.log(platformBrands, 'platformBrands')
  return (
    <View style={styles.style}>
      <NavBar leftTheme="light" title="添加商品" titleStyle={styles.navTitle} style={styles.nav} />
        {
          platformBrands && platformBrands.length > 0 ? (
            <View style={styles.contentWrapper}>
              <GoodsCategoryScroll
                data={platformBrands}
                onChecked={setCheckedCategory}
                style={{width: vw(28), marginRight: pad}}
              />
              <View style={{flex: 1, marginTop: pad}}>
                <FlatList
                  data={[brandsList]}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity style={styles.brandStyle} onPress={onPressBrand}>
                        <View style={styles.imgWrapper}>
                          <Image
                            style={styles.img}
                            source={props.good?.img || images.goodCover}
                            resizeMode="cover"
                          />
                        </View>
                        <SmallText>{}品牌名称</SmallText>
                      </TouchableOpacity>
                    )
                  }}
                  keyExtractor={(item: any, index: number) => 'index' + index + item}
                  numColumns={3}
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                  style={{paddingRight: pad}}
                />
              </View>
            </View>
            ) : (
              <Empty />
            )
        }
    </View>
  )
};

GoodsSupply.defaultProps = {
};

const cellWidth = (vw(100 - 28) - 3 * pad) / 3 ;

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: '#fff',
  },
  nav: {
    backgroundColor: Colors.basicColor,
  },
  navTitle: {
    color: '#fff',
  },
  bottomWrapper: {
    flexDirection: 'row',
    height: 48
  },
  navStyle: {
    backgroundColor: 'transparent',
  },
  btnWrapper: {
    flex: 1,
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickedQuantity: {
    width: vw(28) + 10,
    backgroundColor: Colors.darkBg
  },
  pickedQuantityBall: {
    height: 58,
    width: 58,
    borderRadius: 29,
    backgroundColor: Colors.yellowColor,
    position: 'absolute',
    top: -29,
    left: '50%',
    transform: [{translateX: -29}],
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  goodBlockTitle: {
    marginTop: pad * 2,
    marginBottom: pad
  },
  brandStyle: {
    width: cellWidth,
    backgroundColor: '#fff',
    marginBottom: pad,
    alignItems: 'center',
  },
  imgWrapper: {
    width: cellWidth,
    height: cellWidth,
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: radio,
  },
});

export default withPage(GoodsSupply, {
  statusBarOptions: {
    barStyle: 'light-content',
    backgroundColor: 'transparent',
  }
});