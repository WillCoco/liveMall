/**
 * 主播在播商品管理
 */
import * as React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  StyleProp,
  LayoutAnimation,
  SafeAreaView
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import { PrimaryText, SmallText, T4, scale, T3 } from 'react-native-normalization-text';
import PhoneShapWrapper from '../../components/PhoneShapWrapper';
import CheckBox from '../../components/CheckBox';
import {pad} from '../../constants/Layout';
import PagingList from '../../components/PagingList';
import Iconback from '../../components/Iconfont/Iconback';
// import images from '../../assets/images';
import AnchorRow from './AnchorRow';
// import { joinGroup, quitGroup, createGroup, dismissGroup, updateGroupProfile } from '../../actions/im';
import { vh, vw } from '../../utils/metric';
import Empty from '../Empty/index';
import { Colors } from '../../constants/Theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { brandGoodAdapter } from '../../utils/dataAdapters';
import { isSucceed, } from '../../utils/fetchTools';
import { EMPTY_ARR, EMPTY_OBJ } from '../../constants/freeze';
import * as api from '../../service/api';
import {addGroupHouseGoods, changeIsExit, delGroupHouseGoods} from '../../actions/shop';
import { Toast } from '../../components/Toast';

const ROW_HEIGHT = 120;
const PAGE_SIZE = 14;
const INIT_PAGE_NO = 1;

const AnchorShopCard = (props: {
  goods: Array<any>,
  goodsQuantity: number,
  visible: boolean,
  setVisible: (visible: boolean) => any,
  style: StyleProp<any>,
  onPressClose: () => any,
  safeBottom: number,
}) =>  {
  const {navigate, goBack} = useNavigation();
  const route = useRoute()
  const dispatch = useDispatch();

  // const {liveId} = (route.params || EMPTY_OBJ) as any;

  /**
   * 直播商品
   */
  const livingGoods = useSelector((state: any) => (state?.live?.livingGoods || EMPTY_ARR));

  const liveId = useSelector((state: any) => state?.live?.livingInfo?.liveId);


  const [dataList, setDataList]: any = React.useState(livingGoods);

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
    return !dataList.find(o => (!o.isChecked)) // todo: 标识
  }, [dataList]);
  
  /**
   * 是否可批量提交
   */
  const canSubmit = React.useMemo(() => {
    return dataList.find(o => (o.isChecked)) // todo: 标识
  }, [dataList]);

   /**
   * 全选/反选
   */
  const onPressCheckAll = () => {
    // 全选
    if (!isCheckedAll) {
      const newCheckedList = (dataList || EMPTY_ARR).map((good: any) => ({...good, isChecked: true}));
      setDataList(newCheckedList);
      return;
    }

    // 取消全选
    const newCheckedList = (dataList || EMPTY_ARR).map((good: any) => ({...good, isChecked: false}));
    setDataList(newCheckedList);
  }

  if (!props.visible) {
    return null
  }

  /**
   * 添加到橱窗
   */
  const onPressAddShop = async (data: any) => {
    const goodsIdList = Array.isArray(data) ? checkedList.map(d => d.goodsId) : [data?.goodsId];
    // const loading = Toast.loading('添加中');
    const isSucceed = await dispatch(addGroupHouseGoods({goodsIdList}));
    console.log(goodsIdList, 'goodsIdList')
    if (!!isSucceed) {
      setDataList(changeIsExit(dataList, (item) => goodsIdList.indexOf(item.goodsId) !== -1, true))
      // Portal.remove(loading);
      Toast.success('添加成功');
    }
  }

  /**
   * 从橱窗删除
   */
  const onPressRemoveShop = async (data: any) => {
    const goodsIdList = Array.isArray(data) ? checkedList.map(d => d.goodsId) : [data?.goodsId];
    // const loading = Toast.loading('删除中');
    const isSucceed = await dispatch(delGroupHouseGoods({goodsIdList}));
    // console.log(goodsIdList, 'goodsIdList')
    // Portal.remove(loading);
    if (!!isSucceed) {
      setDataList(changeIsExit(dataList, (item) => goodsIdList.indexOf(item.goodsId) !== -1, false))
      Toast.success('删除成功');
    }
  }

  /**
   * 选择
   */
  const checkGood = (index: number) => {
    const newDataList = [...dataList];
    newDataList[index].isChecked = !newDataList[index].isChecked;

    // console.log(newDataList, '单选')
    setDataList(newDataList);
  }

  /**
   * 获取在售直播商品
   */
  const onRefresh = async () => {
    const result = await api.apiSelLiveGoods({
      liveId,
      pageSize: PAGE_SIZE,
      pageNo: INIT_PAGE_NO,
    })
      .catch((r: any) => {console.log(r, 'selLiveGoods')});

      // console.log(result?.data?.records || EMPTY_ARR, 1111111111111)

    if (isSucceed(result)) {
      // console.log(result?.data?.records, 'result')
      // setDataList(result?.data?.records || EMPTY_ARR)
      return Promise.resolve({result: result?.data?.records || EMPTY_ARR});
    }

    return Promise.resolve({result: EMPTY_ARR});
  }
  console.log(dataList, '12')
  
  /**
   * 获取更多在售直播商品
   */
  const onEndReached = async (pageNo: number, pageSize: number) => {
    const result = await api.apiSelLiveGoods({
      liveId,
      pageSize,
      pageNo,
    })
    .catch((r: any) => {console.log(r, 'selLiveGoods')});

    // console.log(result, 'result')
    const newList = result?.data?.records || EMPTY_ARR;
    if (isSucceed(result)) {
      return Promise.resolve({result: newList});
    }
    return Promise.resolve({result: EMPTY_ARR});
  };

  if (!props.visible) {
    return null
  }
  
  return (
    <View style={StyleSheet.flatten([styles.style])}>
      <TouchableWithoutFeedback onPress={props.onPressClose}>
        <View style={{flex: 1}} />
      </TouchableWithoutFeedback>
      <View>
        <PhoneShapWrapper
          style={StyleSheet.flatten([styles.contentStyle, {paddingBottom: props.safeBottom}])}
        >
          <View style={styles.cardTitleWrapper}>
            <TouchableOpacity
              style={StyleSheet.flatten([styles.titleLeft])}
              onPress={() => props.setVisible(false)}
            >
              <Iconback size={scale(10)} />
              <SmallText style={{}}>返回直播间</SmallText>
            </TouchableOpacity>
            <T4 style={styles.titleCenter}>直播商品管理</T4>
            <TouchableOpacity
              onPress={() => {
                navigate(
                  'LiveGoodsManageAgain',
                  {
                    nextNav: 'live',
                    liveId,
                    btnText: '提交',
                    onPressSubmit: async (goodsIdList: Array<string>) => {
                      // 提交
                      const loading = Toast.loading('提交中');
                      console.log(goodsIdList, '选中要去直播卖的商品');
                      await api.apiAnewAddLiveGoods({goodsIdList: goodsIdList, liveId})
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

                      // 刷新列表
                      const res = await onRefresh();
                      setDataList(res?.result || EMPTY_ARR);
                    }
                  })
              }}
            >
              <SmallText style={styles.titleRight}>重新组货</SmallText>
            </TouchableOpacity>
          </View>
          <View style={styles.scrollWrapper}>
            <PagingList
              data={dataList}
              setData={setDataList}
              size={14}
              // initListData={warehouseGoods}
              renderItem={({item, index}: any) => {
                return (
                  <AnchorRow
                    data={item}
                    dataAdapter={brandGoodAdapter}
                    key={`anchorShopCard_${index}`}
                    isChecked={item.isChecked}
                    // index={index}
                    style={{borderBottomWidth: 1, borderColor: Colors.divider}}
                    onPressCheck={() => checkGood(index)}
                    onPressAddShop={() => onPressAddShop(item)}
                    onPressRemoveShop={() => onPressRemoveShop(item)}
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
          </View>
          <View style={StyleSheet.flatten([styles.rowBetween, {backgroundColor: '#fff'}])}>
            <View style={StyleSheet.flatten([styles.rowBetween, {flex: 1, paddingHorizontal: pad}])}>
              <CheckBox
                label="全选"
                isChecked={isCheckedAll}
                labelStyle={{color: Colors.lightBlack, fontSize: scale(11)}}
                onPress={onPressCheckAll}
              />
              <View style={styles.textWrapper}>
                <SmallText style={styles.summaryText}>共</SmallText>
                <T3 color="theme" style={StyleSheet.flatten([styles.summaryText, {lineHeight: scale(20)}])}>{checkedList.length || 0}</T3>
                <SmallText style={styles.summaryText}>件商品</SmallText>
              </View>
            </View>
            
            <TouchableOpacity
              disabled={!canSubmit}
              onPress={() => onPressAddShop(checkedList)}
              style={StyleSheet.flatten([
                styles.submit,
                {
                  backgroundColor: canSubmit ? Colors.basicColor : Colors.darkGrey
                }
              ])}
            >
              <T4 color="white">上架</T4>
            </TouchableOpacity>
          </View>
        </PhoneShapWrapper>
        </View>
    </View>
  )
};

AnchorShopCard.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    backgroundColor: Colors.opacityDarkBg,
  },
  cardTitleWrapper: {
    padding: pad,
    paddingBottom: pad * 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.divider,
  },
  titleRight: {
    textAlign: 'right',
    alignItems: 'center',
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleCenter: {
    flexDirection: 'row',
    textAlign: 'center',
    marginRight: scale(20)
  },
  contentStyle: {
    height: vh(70),
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: pad,
  },
  pagingListWrapper: {
    backgroundColor: Colors.bgColor,
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  scroll: {
  },
  rowBetween: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  submit: {
    backgroundColor: Colors.basicColor,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: vw(34),
    maxWidth: 200,
    minWidth: 140,
  },
  summaryText: {
    lineHeight: scale(16),
  }
});

export default AnchorShopCard;