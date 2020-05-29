/**
 * 店铺商品管理
 */
import * as React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
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
import {getShopGoods} from '../../../actions/shop';
import { Toast } from '../../../components/Toast';

const ROW_HEIGHT = 168;

const GoodsManage = () =>  {
  const shopGoods = useSelector((state: any) => state?.shop?.shopGoods);

  const {navigate} = useNavigation();
  const dispatch = useDispatch();

  /**
   * 获取商品
   */
  const onRefresh = () => {
    // dispatch(getShopGoods())

    return Promise.resolve({
      result: [1,2,3,4,5,6,7,8,9]
    });
  }

  const onEndReached = () => {

  }

  /**
   * 在售的商品
   */
  const goodsOnSale: Array<any> = [1,2,3,4,5,6,7,8,9];

  /**
   * 下架的商品
   */
  const goodsPulled: Array<any> = [];

  /**
   * 显示空
   */
  const showGoodsOnSaleEmpty = !goodsOnSale || goodsOnSale.length === 0;
  const showGoodsPulledEmpty = !goodsPulled || goodsPulled.length === 0;

  /**
   * 点击预览
   */
  const onPreviewPress = () => {
    // toDelete: mock
    navigate('GoodsInfo', {id: '1762'})
  };

  /**
   * 点击新增
   */
  const onAddPress = () => {
    navigate('GoodEdit');
  };

  /**
   * 点击编辑
   */
  const onEditPress = () => {
    navigate('GoodEdit');
  };

  /**
   * 点击上架
   */
  const onPutawayPress = () => {
    // 
    alert('上架')
    Toast.show('上架成功');
  };

  /**
   * 点击下架
   */
  const onTakedownPress = () => {
    alert('下架');
    Toast.show('下架成功');
  };

  /**
   * 点击删除
   */
  const onRemovePress = () => {

  };

  return (
    <View style={styles.style}>
      <NavBar title="店铺商品" leftTheme="light" titleStyle={{color: '#fff'}} style={{backgroundColor: Colors.basicColor}} />
      <ScrollableTabView
        initialPage={0}
        tabBarActiveTextColor="#000"
        tabBarUnderlineStyle={{
          backgroundColor: Colors.basicColor,
          width: 50,
          alignSelf: 'center',
          left: vw(25) - 25,
        }}
        renderTabBar={(props) => {
          return (
            <ScrollableTab {...props} tabStyle={{backgroundColor: '#fff'}} style={styles.tabBarWrapper} />
          )
        }}
      >
        <View tabLabel={`出售中(${goodsOnSale.length})`} style={{flex: 1}}>
          {
            showGoodsOnSaleEmpty ? <Empty /> : (
              <PagingList
                tabLabel={`出售中(${goodsOnSale.length})`}
                size={14}
                initListData={goodsOnSale}
                renderItem={({item, index}) => {
                  return (
                    <GoodManageRow
                      key={`goodsOnSale_${index}`}
                      data={item}
                      onPreviewPress={() => onPreviewPress(item)}
                      onEditPress={() => onEditPress(item)}
                      onPutawayPress={() => onPutawayPress(item)}
                      onTakedownPress={() => onTakedownPress(item)}
                      onRemovePress={() => onRemovePress(item)}
                    />
                  )
                }}
                getItemLayout={(data, index) => (
                  {length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index}
                )}
                onRefresh={onRefresh}
                onEndReached={onEndReached}
                keyExtractor={(item, index) => 'index' + index + item}
                initialNumToRender={14}
                numColumns={1}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                contentContainerStyle={styles.pagingListWrapper}
              />
            )
          }
        </View>
        <View tabLabel={`已下架(${goodsPulled.length})`} style={{flex: 1}}>
          {
            showGoodsPulledEmpty ? <Empty /> : (
              <PagingList
                tabLabel={`出售中(${goodsOnSale.length})`}
                size={14}
                initListData={goodsOnSale}
                renderItem={({item, index}) => {
                  return (
                    <GoodManageRow
                      key={`goodsOnSale_${index}`}
                    />
                  )
                }}
                getItemLayout={(data, index) => (
                  {length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index}
                )}
                onRefresh={onRefresh}
                onEndReached={onEndReached}
                keyExtractor={(item, index) => 'index' + index + item}
                initialNumToRender={14}
                numColumns={1}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                contentContainerStyle={styles.pagingListWrapper}
              />
            )
          }
        </View>
      </ScrollableTabView>
      <ButtonRadius
        text="添加商品"
        style={styles.button}
        onPress={onAddPress}
      />
    </View>
  )
};

GoodsManage.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
  },
  tabWrapper: {
    flex: 1,
    borderTopWidth: 4,
    borderColor: Colors.divider,
    borderWidth: 1
  },
  tabBarWrapper: {
    borderBottomWidth: 4,
    borderColor: Colors.bgColor
  },
  contentWrapper: {
    paddingBottom: vh(20),
  },
  button: {
    position: 'absolute',
    bottom: pad,
    width: vw(80)
  },
  pagingListWrapper: {
    paddingBottom: vh(10),
  }
});

export default withPage(GoodsManage);