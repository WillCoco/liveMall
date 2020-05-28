/**
 * 预组货列表
 */
import * as React from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Toast, portal } from '@ant-design/react-native';
import {useSelector, useDispatch} from 'react-redux';
import {PrimaryText, SmallText, T4, scale} from 'react-native-normalization-text';
// import Toast from 'react-native-tiny-toast';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import withPage from '../../../../components/HOCs/withPage';
import PagingList from '../../../../components/PagingList';
import {vw} from '../../../../utils/metric';
import {Colors} from '../../../../constants/Theme';
import {pad, radio} from '../../../../constants/Layout';
import NavBar from '../../../../components/NavBar';
import WarehouseRow from './WarehouseRow';
import CheckBox from '../../../../components/CheckBox';
import {
    AddGoodsTargetType,
    addGoods2WareHouse,
    getWareHouseGoods,
    delWareHouseGoods,
    addGroupHouseGoods,
    delGroupHouseGoods
} from '../../../../actions/shop';
import {brandGoodAdapter} from '../../../../utils/dataAdapters';

const ROW_HEIGHT = 120;
const emptyList: [] = [];
const PAGE_SIZE = 14;
const INIT_PAGE_NO = 1;


const LivingGoodsWareHouse = (props: any) =>  {
  const {navigate, goBack} = useNavigation();
  const dispatch = useDispatch();

  /**
   * 原始数据
   */
  const [dataList, setDataList]: [Array<any>, any] = React.useState(emptyList);

  /**
   * 过滤出选中的, 且是未添加到店铺的
   */
  const canAddFilter = (list: Array<any>) => {
    return list.filter(o => o.isChecked && o.isExist === 2) // todo: 字段修正
  }

  /**
   * 过滤出选中的
   */
  const checkedFilter = (list: Array<any>) => {
    return list.filter(o => o.isChecked) // todo: 字段修正
  }

  /**
   * 选中的列表
   */
  const checkedList = React.useMemo(() => {
    return checkedFilter(dataList)
  }, [dataList]);

  /**
   * 现在是否全选
   */
  const isCheckedAll = React.useMemo(() => {
    if (!dataList || !dataList.length) {
      return false;
    }
    return !dataList.find(o => (!o.isChecked)) // todo: 标识
  }, [dataList]);

  /**
   * 待添加店铺的列表
   */
  const canAddShopList = React.useMemo(() => {
    return canAddFilter(dataList)
  }, [dataList]);

  /**
   * 是否可以选中添加店铺
   */
  const canAddShop = React.useMemo(() => {
    return canAddShopList && canAddShopList.length > 0;
  }, [canAddShopList]);

  /**
   * 是否可选中删除
   */
  const canRemove = checkedList && checkedList.length > 0;

  /**
   * 添加商品返回后刷新
   */
  useFocusEffect(React.useCallback(() => {
    onRefresh(true)
  }, []))

  /**
   * 刷新
   */
  const onRefresh = async (backFresh: boolean = false) => {
    const warehouseGoods: any = await dispatch(getWareHouseGoods({
      pageNo: INIT_PAGE_NO,
      pageSize: PAGE_SIZE,
      selType: AddGoodsTargetType.warehouseGoods
    })) || emptyList;

    console.log(warehouseGoods, 'warehouseGoods')
    backFresh && setDataList(dataFormat(warehouseGoods, dataList))
    return Promise.resolve({result: dataFormat(warehouseGoods, dataList)});
  }

  /**
   * 更多
   */
  const onEndReached = async (pageNo: number, pageSize: number) => {
    const goods: any = await dispatch(getWareHouseGoods({
      pageSize,
      pageNo,
      selType: AddGoodsTargetType.warehouseGoods
    }));

    console.log(goods, '更多');
    const result = Promise.resolve({result: dataFormat(goods, dataList)});

    return result;
  }

  /**
   * 加工原数据
   * 加上isChecked字段
   * @params: {Array} dataList - 预组货列表原数据
   * @params: {Array} checkList - 本地操作选择的
   */
  const dataFormat = (dataList: Array<any>, checkList?: Array<any>) => {
    // 本地选择过之后刷新, format数据
    if (checkList) {
      const checked = checkList.filter(c => c.isChecked)
      const result: Array<any> = [];

      dataList.forEach(d => {
        const matchedGood = checked.find(o => (o.id === d.id && !!o.id)) // todo: 标识
        if (matchedGood) {
          result.push({...d, isChecked: matchedGood.isChecked})
        } else {
          result.push(d)
        }
      })
        console.log(result, 'result')
      return result;
    }

    // 本地没有选择过, format数据默认未选中
    return dataList.map((d: any) => {
      return {
        ...d,
        isChecked: false
      }
    });
  }


  /**
   * 选择单个
   */
  const checkGood = (index: number) => {
    const newDataList = [...dataList];
    newDataList[index].isChecked = !newDataList[index].isChecked;
    console.log(newDataList, '1234')
    setDataList(newDataList);
  }

  /**
   * 全选/反选
   */
  const onPressCheckAll = () => {
    // 全选
    if (!isCheckedAll) {
      const newCheckedList = (dataList || emptyList).map((good: any) => ({...good, isChecked: true}));
      setDataList(newCheckedList);
      return;
    }

    // 取消全选
    const newCheckedList = (dataList || emptyList).map((good: any) => ({...good, isChecked: false}));
    setDataList(newCheckedList);
  }

  /**
   * 移除单个
   */
  const onPressRemove = async (goodsId) => {
      const t = Toast.loading('加载中')
      const Bool: boolean = await dispatch(delWareHouseGoods({
          goodsIdList: [goodsId]
      }));
      portal.remove(t);
      if(Bool) {
          Toast.success('删除成功', 1, undefined, false);
          // 过滤除删除的组货
          const newDataList = dataList.filter(o => o.goodsId !== goodsId);
          setDataList(newDataList)
      };
  };

  /**
   * 移除选中
   */
  const onPressRemoveChecked = async () => {
      const t = Toast.loading('加载中')
      const goodsIdArr = [];
      checkedList.forEach(item => {
          goodsIdArr.push(item.goodsId)
      });
      const Bool: boolean = await dispatch(delWareHouseGoods({
          goodsIdList: [...goodsIdArr]
      }));
      portal.remove(t);
      if(Bool) {
          Toast.success('删除成功', 1, undefined, false);

          // 过滤除删除的组货数组
          const diffDataList = dataList.filter( o => !goodsIdArr.find(i => i === o.goodsId));
          setDataList(diffDataList)
      };
  };

  /**
   * 添加/取消添加 修改数据
   */
  const addOrRemoveFormat = (list: Array<any>, isAdd: boolean) => {
    if (!list || !list.map) {
      return list;
    };

    return list.map((good) => {
      const safeGood = good || {};
      return {...safeGood, isExist: isAdd ? 1 : 2}
    })
  };

  /**
   * 平台商品添加到预组货
   */
  // console.log(checkedList, 'checkedListcheckedListcheckedList')

  const addGoods = async (brandGoods: Array<any>, data: any) => {
    const goodNeed2Add = Array.isArray(data) ? data : [data];
    const goodIdsNeed2Add = goodNeed2Add.map((d: any) => d.goodsId);
    // console.log(goodIdsNeed2Add, 'goodsIdListgoodsIdListgoodsIdList')
    if (goodIdsNeed2Add && goodIdsNeed2Add.length > 0) {
      const addedList = await dispatch(addGoods2WareHouse({
        brandGoods,
        goodIdsNeed2Add
      }));

      // 返回添加完后的
      return addedList;
    }
  }

  /**
   * 添加店铺选中
   */
  const onPressAddChecked = async () => {
      const t = Toast.loading('加载中')
      const goodsIdArr = [];
      checkedList.forEach(item => {
          goodsIdArr.push(item.goodsId)
      });
      const Bool = await dispatch(addGroupHouseGoods({
          goodsIdList: [...goodsIdArr]
      }));
      portal.remove(t);
      if(Bool) {
          Toast.success('添加成功', 1, undefined, false);

          //  添加店铺
          dataList.forEach(item => {
               item.isExist = 1;
          });
          setDataList(dataList.concat([]));
      };
  }

  const onPressAddShop = async (goodsId) => {
      const Bool = await dispatch(addGroupHouseGoods({
          goodsIdList: [goodsId]
      }));

      if(Bool) {
          dataList.forEach(item => {
              if(goodsId === item.goodsId) {
                  item.isExist = item.isExist === 1 ? 2 : 1;
              }
          });
          setDataList(dataList.concat([]));
      }
  };

  const onPressDelShop = async (goodsId) => {
      const Bool = await dispatch(delGroupHouseGoods({
          goodsIdList: [goodsId]
      }));
      if(Bool) {
          dataList.forEach(item => {
              if(goodsId === item.goodsId) {
                  item.isExist = item.isExist === 1 ? 2 : 1;
              }
          });
          setDataList(dataList.concat([]));
      }
  };

  return (
    <View style={styles.style}>
      <NavBar
        leftTheme="light"
        title="预组货"
        titleStyle={styles.navTitle}
        style={styles.nav}
        right={
          () => (
            <TouchableOpacity
              onPress={() => navigate('GoodsSupply', {
                type: AddGoodsTargetType.warehouseGoods,
                onPicked: addGoods,
              })}
              style={styles.navRight}
            >
              <SmallText color="white" style={{}}>添加商品</SmallText>
            </TouchableOpacity>
          )
        }
      />
        <PagingList
          data={dataList}
          setData={setDataList}
          size={14}
          // initListData={warehouseGoods}
          renderItem={({item, index}: any) => {
            return (
              <WarehouseRow
                isChecked={item.isChecked}
                dataAdapter={() => {
                  return brandGoodAdapter(item)
                }}
                onPressCheck={() => {checkGood(index)}}
                onPressRemove={() => {onPressRemove(item.goodsId)}}
                onPressAddShop={() => {onPressAddShop(item.goodsId)}}
                onPressDelShop={() => {onPressDelShop(item.goodsId)}}
                style={{marginBottom: 4}}
              />
            )
          }}
          getItemLayout={(data: any, index: number) => (
            {length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index}
          )}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          keyExtractor={(item: any, index: number) => 'index' + index + item}
          initialNumToRender={14}
          numColumns={1}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={styles.pagingListWrapper}
        />
        <View style={styles.bottomWrapper}>
          <CheckBox
            label="全选"
            isChecked={isCheckedAll}
            labelStyle={{color: Colors.darkGrey}}
            onPress={onPressCheckAll}
          />
          <View style={styles.bottomRightWrapper}>
            <TouchableOpacity disabled={!canAddShop} onPress={onPressAddChecked}>
              <PrimaryText color={canAddShop ? 'theme' : 'grey'}>添加店铺</PrimaryText>
            </TouchableOpacity>
            <View style={styles.strip}/>
            <TouchableOpacity disabled={!canRemove} onPress={onPressRemoveChecked}>
              <PrimaryText color={canRemove ? 'theme' : 'grey'}>删除</PrimaryText>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  )
};

LivingGoodsWareHouse.defaultProps = {
};

const cellWidth = (vw(100 - 28) - 3 * pad) / 3 ;

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  nav: {
    backgroundColor: Colors.basicColor,
  },
  navTitle: {
    color: '#fff',
  },
  navRight: {
    padding: pad,
  },
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 55,
    paddingHorizontal: pad
  },
  bottomRightWrapper: {
    flexDirection: 'row',
  },
  strip: {
    width: 1,
    backgroundColor: Colors.lightGrey,
    marginHorizontal: pad
  }
});

export default withPage(LivingGoodsWareHouse, {
  statusBarOptions: {
    barStyle: 'light-content',
    backgroundColor: 'transparent',
  }
});