import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../constants/Theme'
import { apiMyAttentionList } from '../../service/api'
import PagingList from '../../components/PagingList'
import AnchorCard from './AnchorCard/AnchorCard'
import Empty from '../../components/Empty'
import withPage from '../../components/HOCs/withPage'
import { useSelector } from 'react-redux'
import images from '../../assets/images'
import { isSucceed } from '../../utils/fetchTools'
import { EMPTY_ARR } from '../../constants/freeze'
import { clearLiveRoom } from '../../actions/im';

function FocusedAnchor(props: any) {
  const navigation = useNavigation()
  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId);

  const dispatch = useDispatch();

  navigation.setOptions({
    headerTitle: '关注的主播',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  /**
   * 获取关注列表
   */
  const onRefresh = async () => {
    let params = {
      pageNo: 1,
      pageSize: 10,
      userId
    }
    
    const result = await apiMyAttentionList(params)

    if (isSucceed(result)) {
      return Promise.resolve({result: result?.data?.records || EMPTY_ARR})
    }

    return Promise.resolve({EMPTY_ARR})
  }

  /**
   * 更多
   */
  const onEndReached = async (pageNo: number, pageSize: number) => {
    let params = {
      pageNo,
      pageSize,
      userId
    }
    
    const result = await apiMyAttentionList(params)

    if (isSucceed(result)) {
      return Promise.resolve({result: result?.data?.records || EMPTY_ARR})
    }

    return Promise.resolve({EMPTY_ARR})
  }

  /**
   * 点击进入
  */
 const onPress = (item: any) => {
    dispatch(clearLiveRoom());

    navigation.navigate('LivingRoomScreen', {
      liveId: item?.liveId,
      groupID: item?.groupId || `live${item?.liveId}`,
      anchorId: item?.anchorId,
      mediaType: item?.liveStatus,
    });
 }

  return (
    <View style={StyleSheet.flatten([styles.container, {marginBottom: props.safeBottom}])}>
      <PagingList
        // data={myAttentionList}
        // setData={setMyAttentionList}
        size={14}
        // initListData={warehouseGoods}
        renderItem={({item, index}: any) => {
          return (
            <AnchorCard
              key={`anchor-${index}`}
              item={item}
              onPress={() => onPress(item)}
            />
          )
        }}
        empty={
          <Empty 
            img={images.emptyAttention}
            text='暂无关注的主播'
            style={{marginTop: '20%'}}
            textStyle={{width: '70%', textAlign: 'center'}}
          />
        }
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        keyExtractor={(item, index) => 'index' + index + item}
        initialNumToRender={14}
        numColumns={1}
        columnWrapperStyle={{justifyContent: 'space-between'}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default withPage(FocusedAnchor)