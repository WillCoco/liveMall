/**
 * 直播店铺(主播详情橱窗)商品管理
 */
import * as React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {PrimaryText, SmallText} from 'react-native-normalization-text';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import NavBar from '../../../components/NavBar';
import withPage from '../../../components/HOCs/withPage';
import LiveGoodManageRow from '../../../components/GoodManageRow/LiveGoodManageRow';
import ButtonRadius from '../../../components/Buttons/ButtonRadius';
import {pad} from '../../../constants/Layout';
import {Colors} from '../../../constants/Theme';
import ScrollableTab from '../../../components/ScrollableTab';
import { vw, vh } from '../../../utils/metric';
import Empty from '../../../components/Empty';
import PagingList from '../../../components/PagingList';
import { AddGoodsTargetType, getWareHouseGoods, addGoods2ShowCase, delGroupHouseGoods } from '../../../actions/shop';
import { Toast } from '../../../components/Toast';

const INIT_PAGE_NO = 1;
const PAGE_SIZE = 10;

const exampleData = [...Array(5)].map((d, index) => ({
  key: `item-${index}`, // For example only -- don't use index as your key!
  label: index,
  backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index *
    5}, ${132})`
}));

const ROW_HEIGHT = 125;

const AnchorShowcaseManage = () =>  {
  const {navigate} = useNavigation();
  /**
   * store橱窗商品
   */
  // const goodsList = useSelector(state => state?.showcase?.showcaseGoods);

  React.useEffect(() => {

  }, [])

  /*
  * 刷新
  * */
  const dispatch = useDispatch();
  const [goodsList, setGoodList]: Array<any> = React.useState([]);

  const onRefresh = async () => {
      setRemoveList([]);

      const goods: any = await dispatch(getWareHouseGoods({
          pageNo: INIT_PAGE_NO,
          pageSize: PAGE_SIZE,
          selType: AddGoodsTargetType.showcaseGoods
      })) || [];

      return {result: goods}
  };

  /*
   * 上拉加载
   * */
  const onEndReached = async (page, size) => {
      // const goods: any = await dispatch(getWareHouseGoods({
      //     pageNo: page,
      //     pageSize: size,
      //     selType: AddGoodsTargetType.showcaseGoods
      // })) || [];
      //
      // setGoodList(goods)
  };

  /**
   * 渲染行
   */
  const renderItem = ({item, index}: any): React.ReactNode => {
    return (
      <LiveGoodManageRow
        data={item}
        onRemovePress={() => onRemovePress(index, item)}
      />
    )
  }

  /**
   * 下移
   */
  const onMoveDownPress = (index: number, item: any) => {
    setData((data: Array<any>) => {
      const newData = [...data];
      newData[index + 1] = item;
      newData[index] = data[index + 1];

      console.log(newData, 'newData')
      return newData;
    })
  };

  /**
   * 上移
   */
  const onMoveUpPress = (index: number, item: any) => {
    setData((data: Array<any>) => {
      const newData = [...data];
      newData[index - 1] = item;
      newData[index] = data[index - 1];

      return newData;
    })
  };

  /**
   * 删除
   */
  const [removeList, setRemoveList]: Array<any> = React.useState([]);
  const onRemovePress = (index: number, item: any) => {
    removeList.push(item.goodsId);
    setRemoveList(removeList);

    setGoodList((data: Array<any>) => {
      const newData = [...data];
      newData.splice(index, 1);
      return newData;
    })
  };

  /**
   * 提交修改
   */
  const onSubmit = async () => {
    if(removeList && removeList.length > 0) {
        const t = Toast.loading('删除中')
        const Bool = await dispatch(delGroupHouseGoods({
            goodsIdList: [...removeList]
        }));
        Toast.remove(t);
        if(Bool){
            Toast.success('删除成功');
            setRemoveList([])
        }else {
            Toast.fail('删除失败');
        }
    }  else {
        Toast.info('没有修改');
    }

  }

  const addGoods = async (brandGoods: Array<any>, data: any) => {
      const goodList = Array.isArray(data) ? data : [data];
      const goodIdsNeed2Add = goodList.map((d: any) => d.goodsId);
      if(goodIdsNeed2Add && goodIdsNeed2Add.length > 0){
          return await dispatch(addGoods2ShowCase({
              brandGoods,
              goodIdsNeed2Add
          }));
      }
  }

  /**
   * 是否空
   */
  // const isEmpty = !goodsList || goodsList.length === 0;

  return (
    <View style={styles.style}>
      <NavBar title="店铺商品管理" leftTheme="light" titleStyle={{color: '#fff'}} style={{backgroundColor: Colors.basicColor}} />
        <PagingList
            data={goodsList}
            setData={setGoodList}
            size={PAGE_SIZE}
            renderItem={renderItem}
            getItemLayout={(data: any, index: number) => (
                {length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index}
            )}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            keyExtractor={(item: any, index: number) => 'index' + index + item}
            initialNumToRender={PAGE_SIZE}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={styles.pagingListWrapper}
        />
      <View style={styles.btnsWrapper}>
        <ButtonRadius
          text="添加商品"
          textStyle={styles.addText}
          style={styles.addBtn}
          onPress={() => navigate('GoodsSupply', {
              type: AddGoodsTargetType.showcaseGoods,
              onPicked: addGoods
          })}
        />
        <ButtonRadius
          text="提交保存"
          textStyle={styles.submitText}
          onPress={onSubmit}
        />
      </View>
    </View>
  )
};

AnchorShowcaseManage.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    paddingBottom: pad * 1.5 + 40
  },
  btnsWrapper: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: pad * 1.5,
    paddingHorizontal: pad
  },
  addBtn: {
    backgroundColor: Colors.pink
  },
  addText: {
    color: Colors.basicColor,
  },
  submitText: {
    color: '#fff',
  },
  contentContainerStyle: {
    paddingBottom: vh(20)
  },
  footer: {
    width: '100%',
    textAlign: 'center',
    // borderTopWidth: StyleSheet.hairlineWidth * 2,
    // borderColor: Colors.navDivider,
    marginTop: pad,
    // paddingTop: pad / 2
  }
});

export default withPage(AnchorShowcaseManage);