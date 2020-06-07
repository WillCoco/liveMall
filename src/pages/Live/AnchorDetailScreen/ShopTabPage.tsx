/**
 * 主播详情
 */
import * as React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  PanResponder,
} from 'react-native';
import {PrimaryText, SmallText} from 'react-native-normalization-text';
import Avatar from '../../../components/Avatar';
import PagingList from '../../../components/PagingList';
import GoodsCard from '../../../components/GoodsCard/GoodsCard';
import {Colors} from '../../../constants/Theme';
import {vw} from '../../../utils/metric';
import { pad } from '../../../constants/Layout';
import images from '../../../assets/images/index';
import { AddGoodsTargetType }  from '../../../actions/shop';
import {apiGetGroupGoods} from '../../../service/api';
import {useDispatch} from 'react-redux';
import { EMPTY_ARR } from '../../../constants/freeze';
import { useNavigation } from '@react-navigation/native';
import {isSucceed} from '../../../utils/fetchTools';

const INIT_PAGE_NO = 1;
const PAGE_SIZE = 10;

const AnorchDetailAvatar = (props: {
  isLiving: boolean,
  anchorId: number | string
}) =>  {

  const dispatch = useDispatch();
  const {navigate} = useNavigation();

  /**
   * 前往商品详情
   */
  const toGoodsInfo = (id: number) => {
    navigate('GoodsInfo', { id });
  };


  /**
   * 获取主播商品
   */
  const onRefresh = async () => {
    const result: any = await apiGetGroupGoods({
      anchorId: props?.anchorId,
      pageNo: INIT_PAGE_NO,
      pageSize: PAGE_SIZE,
      selType: AddGoodsTargetType.showcaseGoods
    })
      .catch((err: any) => {console.log(err, 'getGroupGoods')})

      console.log(result, 'resulttttttttt')
    // post1已经对result做了处理, isSucceed返回都是false  @hicks
    // if (isSucceed(result)) {
      return Promise.resolve({result: result?.records || EMPTY_ARR});
    // }
    // return Promise.resolve({result: EMPTY_ARR})
  };


  const onEndReached = async (pageNo: number, pageSize: number) => {
    const result: any = await apiGetGroupGoods({
      anchorId: props?.anchorId,
      pageNo: pageNo,
      pageSize: pageSize,
      selType: AddGoodsTargetType.showcaseGoods
    }) 

    if (isSucceed(result)) {
      return Promise.resolve({result: result?.records || EMPTY_ARR});
    }

    return Promise.resolve({result: EMPTY_ARR})
  };

  return (
    <View style={styles.style}>
      <PagingList
        size={14}
        // initListData={['1223', '2222']}
        //item显示的布局
        renderItem={({item}) => {
          return <GoodsCard 
            goodsInfo={item} 
            tapGoodsCard={(id: number) => toGoodsInfo(id)}
          /> 
        }}
        //下拉刷新相关
        onRefresh={onRefresh}
        //加载更多
        onEndReached={onEndReached}
        // ItemSeparatorComponent={separator}
        initialNumToRender={14}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        // style={{borderTopWidth: 4, borderColor: Colors.pageGreyBg}}
        contentContainerStyle={{paddingHorizontal: pad}}
      />
    </View>
  )
};

AnorchDetailAvatar.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    borderTopWidth: 4,
    borderColor: Colors.pageGreyBg,
    paddingTop: pad
  },
  livingText: {
    color: '#fff',
    backgroundColor: Colors.basicColor,
    height: 18,
    lineHeight: 18,
    paddingHorizontal: 7,
    borderRadius: 9,
    position: 'absolute',
    bottom: -2,
    fontSize: 12,
    // transform: [{translateY: vw(8)}]
  }
});

export default AnorchDetailAvatar;
