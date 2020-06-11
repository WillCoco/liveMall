/**
 * 直播前的预组货
 */
import * as React from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import { nanoid } from 'nanoid/non-secure';
import {PrimaryText, SmallText, T1, scale} from 'react-native-normalization-text';
import {useNavigation, useRoute, CommonActions, Route} from '@react-navigation/native';
import withPage from '../../../components/HOCs/withPage';
import {vw} from '../../../utils/metric';
import {Colors} from '../../../constants/Theme';
import {pad} from '../../../constants/Layout';
import Empty from '../../../components/Empty';
import GoodCheckRow, {ROW_HEIGHT} from './LiveGoodsManageRow';
import NavBar from '../../../components/NavBar';
import ButtonRadius from '../../../components/Buttons/ButtonRadius';
import PagingList from '../../../components/PagingList';
import CheckBox from '../../../components/CheckBox';
import {startLive, updateLiveConfig} from '../../../actions/live';
import {getWareHouseGoods, AddGoodsTargetType, goodsCheckedFormat} from '../../../actions/shop';
import {Toast} from '../../../components/Toast';
import {brandGoodAdapter} from '../../../utils/dataAdapters';
import {addGroupHouseGoods, changeIsExit, delGroupHouseGoods} from '../../../actions/shop';
import * as api from '../../../service/api';
import { isSucceed } from '../../../utils/fetchTools';

const emptyList: [] = [];
const emptyObj: {} = {};

const PAGE_SIZE = 14;
const INIT_PAGE_NO = 1;

const LiveGoodsManage = (props: any) =>  {
  const {navigate, goBack, dispatch: navDisPatch, reset} = useNavigation();
  const dispatch = useDispatch();

  /**
   * 页面参数
   */
  const route = useRoute();
  const {
    navTitle = '预组货',
    nextNav = 'AnorchLivingRoomScreen',
    btnText,
    liveId,
    onPressSubmit,
  } : {
    navTitle?: string, // navTitle
    nextNav?: string, // 
    btnText?: string, // 
    liveId?: string,
    onPressSubmit?: () => any,
  } = route.params || emptyObj;

  React.useEffect(() => {
    // 清空标题等配置
    return () => {
      dispatch(updateLiveConfig())
    }
  }, [])

  /**
   * 预组货列表
   *  添加是否选中
   */
  const warehouseGoods = useSelector((state: any) => {
    const list = state?.shop?.warehouseGoods;
    return list.map((good: any) => {
      return ({
        ...good,
        isChecked: false
      })
    }) || emptyList;
  });

  /**
   * 预组货货物
   */
  const [dataList, setDataList]: Array<any> = React.useState(warehouseGoods);

  /**
   * 过滤出选中的
   */
  const checkedFilter = (list: Array<any>) => {
    return list.filter(o => o.isChecked) // todo: 字段修正
  }

  /**
   * 选中的预组货
   */
  const checkedList = React.useMemo(() => {
    return checkedFilter(dataList)
  }, [dataList]);

  console.log(dataList, 'dataListdataList')

  /**
   * 选择
   */
  const checkGood = (index: number) => {
    const newDataList = [...dataList];
    newDataList[index].isChecked = !newDataList[index].isChecked;

    console.log(newDataList, 'newDataList');
    setDataList(newDataList);
  }

  /**
   * 现在是否全选
   */
  const isCheckedAll = React.useMemo(() => {
    if (!dataList || !dataList.length) {
      return false;
    }
    return !dataList.find((o: any) => (!o.isChecked)) // todo: 标识
  }, [dataList]);

  /**
   * 全选/反选
   */
  const onPressCheckAll = () => {
    // 全选
    if (!isCheckedAll) {
      const newDataList = dataList.map((good: any) => ({...good, isChecked: true}));
      setDataList(newDataList);
      return;
    }

    const newDataList = dataList.map((good: any) => ({...good, isChecked: false}));
    setDataList(newDataList);
  }

  /**
   * 添加/取消店铺
   */
  const addShop = async (data: any) => {
    const goodsIdList = Array.isArray(data) ? checkedList.map(d => d.goodsId) : [data?.goodsId];
    // const loading = Toast.loading('添加中');
    const isSucceed = await dispatch(addGroupHouseGoods({goodsIdList}));
    console.log(goodsIdList, 'goodsIdList')
    if (!!isSucceed) {
      setDataList(changeIsExit(dataList, (item) => goodsIdList.indexOf(item.goodsId) !== -1, true))
      Toast.success('添加成功');
    }
    // Portal.remove(loading);
  }

  /**
   * 取消店铺
   */
  const removeShop = async (data: any) => {
    const goodsIdList = Array.isArray(data) ? checkedList.map(d => d.goodsId) : [data?.goodsId];
    // const loading = Toast.loading('删除中');
    const isSucceed = await dispatch(delGroupHouseGoods({goodsIdList}));
    console.log(goodsIdList, 'goodsIdList')
    if (!!isSucceed) {
      setDataList(changeIsExit(dataList, (item) => goodsIdList.indexOf(item.goodsId) !== -1, false))
      Toast.success('删除成功');
    }
    // Portal.remove(loading);
  }

  /**
   * 确认预检
   */
  const isVaildData = () => {
    if (!checkedList || checkedList.length === 0) {
      Toast.show('请至少选择一个商品')
      return false;
    }

    return true;
  }

  /**
   * 刷新
   */
  const onRefresh = async () => {
    const goods: any = await dispatch(getWareHouseGoods({
      pageNo: INIT_PAGE_NO,
      pageSize: PAGE_SIZE,
      selType: AddGoodsTargetType.warehouseGoods
    })) || [];

    console.log(goods, 'goodsgoodsgoodsgoods')
    console.log(goodsCheckedFormat(goods, dataList), 2222222)
    
    const r = Promise.resolve({result: goodsCheckedFormat(goods, dataList)});
    return r;
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
    const result = Promise.resolve({result: goodsCheckedFormat(goods, dataList)});

    return result;
  };

  /**
   * 确认开播
   */
  const onStartLive = async () => {
    if (!isVaildData()) {
      return;
    }

    const goodsIdList = checkedList.map(d => d.goodsId);
    console.log(goodsIdList, '选中要去直播卖的商品');

    const loading = Toast.loading('加载中');

    // 提交更改
    const r = await dispatch(startLive({goodsIdList})) as any;

    console.log(r, '创建直播');

    Toast.remove(loading);

    if (r) {
      // 重置开播参数
      dispatch(updateLiveConfig())

      // 跳转并缩短路由
      navDisPatch((state: any) => {
      // Remove the home route from the stack
        const routes = state.routes.filter((r: any) => (
          !(r.name === 'CreateLiveScreen' || r.name === 'LiveGoodsManage')
        ));
        routes.push({
          key: `${nextNav}-${nanoid()}`,
          name: nextNav,
          params: {
            groupID: r?.groupId,
            liveId: r?.liveId,
            roomName: r?.roomName,// 房间名称
          }
        })

        return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        });
    }
  }

  /**
   * 更改预组货
   */
  const changeWarehouse = async () => {
    const loading = Toast.loading('提交中');
    const goodsIdList = checkedList.map(d => d.goodsId);
    console.log(goodsIdList, '选中要去直播卖的商品');

    api.apiAnewAddLiveGoods({goodsIdList: goodsIdList, liveId})
      .then((r: any) => {
        Toast.remove(loading);
        if (isSucceed(r)) {
          Toast.show('提交成功')
          goBack();
        }
      })
      .catch((err: any) => {
        Toast.remove(loading);
        console.log('apiAnewAddLiveGoods err:', err)
      })
    
  }

  const isToLive = nextNav === 'AnorchLivingRoomScreen';
  /**
   * 点击
   */
  const onPress = async () => {
    // 去直播
    if (isToLive) {
      if (!isVaildData()) {
        return;
      }
      // onStartLive();
      navigate('CreateLiveScreen');
      return;
    }
    await changeWarehouse();
    onPressSubmit && onPressSubmit();
  }


  const length = checkedList && checkedList.length || 0

  return (
    <View style={styles.style}>
      <NavBar title={navTitle} leftTheme="light" titleStyle={{color: '#fff'}} style={{backgroundColor: Colors.basicColor}} />
      <PagingList
          data={dataList}
          setData={setDataList}
          size={PAGE_SIZE}
          // initListData={warehouseGoods}
          renderItem={({item, index}: any) => {
            return (
              <GoodCheckRow
                isChecked={item?.isChecked}
                dataAdapter={() => {
                  console.log(brandGoodAdapter(item), 'itemitemitemitem')
                  return brandGoodAdapter(item)
                }}
                onPressCheck={() => checkGood(index)}
                onPressAddShop={() => item?.isExist === 1 ? removeShop(item) : addShop(item)} // 是否在橱窗列表
                style={{
                  marginBottom: 4,
                }}
              />
            )
          }}
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
      <View style={styles.summaryWrapper}>
        <CheckBox
          label="全选"
          isChecked={isCheckedAll}
          labelStyle={{color: Colors.darkGrey}}
          onPress={onPressCheckAll}
        />
        <ButtonRadius
          text={`${(btnText || '下一步')}(${length})`}
          onPress={onPress}
        />
      </View>
    </View>
  )
};

LiveGoodsManage.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  summaryWrapper: {
    flexDirection: 'row',
    height: scale(58),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pad,
    backgroundColor: '#fff'
  },
  deleteButton: {
    height: 28,
    width: 60,
    backgroundColor: Colors.opacityBasicColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  deleteText: {
    color: Colors.basicColor,
  },
  bottomWrapper: {
    height: 48,
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 8,
  },
  rowWrapper: {
    paddingHorizontal: pad,
    backgroundColor: '#fff'
  }
});

export default withPage(LiveGoodsManage, {
  statusBarOptions: {
    backgroundColor: 'transparent',
    barStyle: 'light-content',
  }
});