/**
 * 观众在播商品购买
 */
import * as React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  StyleProp,
  LayoutAnimation
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {PrimaryText, T4} from 'react-native-normalization-text';
// import LiveIntro from '../LiveIntro';
// import LivingBottomBlock from '../LivingBottomBlock';
// import LivePusher from '../LivePusher';
// import L from '../../constants/Layout';
// import Iconcloselight from '../../components/Iconfont/Iconcloselight';
// import Iconchangecamera from '../../components/Iconfont/Iconchangecamera';
// import NoticeBubble from '../../components/NoticeBubble';
import {pad} from '../../constants/Layout';
// import images from '../../assets/images';
import AudienceRow, {ROW_HEIGHT} from './AudienceRow';
// import { joinGroup, quitGroup, createGroup, dismissGroup, updateGroupProfile } from '../../actions/im';
import { vh } from '../../utils/metric';
import Empty from '../Empty/index';
import { Colors } from '../../constants/Theme';
import { EMPTY_ARR, EMPTY_OBJ } from '../../constants/freeze';
import PagingList from '../PagingList';
import {apiSelLiveGoods} from '../../service/api';
import { isSucceed } from '../../utils/fetchTools';
import { brandGoodAdapter } from '../../utils/dataAdapters';
import { sendRoomMessage } from '../../actions/im';
import { MessageType } from '../../reducers/im';

const PAGE_SIZE = 14;
const INIT_PAGE_NO = 1;

const AudienceShopCard = (props: {
  goods: Array<any>,
  goodsQuantity: number,
  visible: boolean,
  style: StyleProp<any>,
  onPressClose: () => any,
}) => {
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const route: any = useRoute();

  /**
   * 直播id
   */
  const liveId = useSelector((state: any) => state?.live?.livingInfo?.liveId);

  /**
   * 主播id
   */
  const anchorId = route.params?.anchorId;

  console.log(anchorId, 'anchorIdanchorIdanchorId')

  /**
   * 数量
   */
  const [goodsQuantity, setGoodsQuantity] = React.useState(0)

  /**
   * 直播商品
   */
  const onPressBuy = (good: any) => {
    // todo 请求接口

    // todo 请求是否下架

    // 
    navigate('GoodsInfo', {
      id: good?.goodsId,
      shareUserId: anchorId,
      onOrderCompleted: (info: any) => {
        const safeInfo = info || {};
        requestAnimationFrame(() => {
          let quantity;
          try {
            const [orders] = safeInfo?.shopReqs || EMPTY_OBJ;
            const [order] = orders?.orderGoodsReqs || EMPTY_ARR;
            quantity = order.goodsNum;
          } catch (err) {
            quantity = 1;
          }

          console.log(safeInfo, 'inffooooooo')
          dispatch(sendRoomMessage({text: `下单了${quantity}件`, type: MessageType.order}))
        })
      }
    });
  }

  

  console.log(liveId, 'liveIdliveIdliveId')

  /**
   * 直播商品
   */
  // const [livingGoods, setLivingGoods] = React.useState(EMPTY_ARR);

  /**
   * 获取在售直播商品
   */
  const onRefresh = async () => {
    const result = await apiSelLiveGoods({
      liveId,
      pageSize: PAGE_SIZE,
      pageNo: INIT_PAGE_NO,
    })
      .catch((r: any) => {console.log(r, 'selLiveGoods')});

    console.log(result, '44444')
    if (isSucceed(result)) {
      setGoodsQuantity(result?.data?.total);
      return Promise.resolve({result: result?.data?.records || EMPTY_ARR});
    }

    setGoodsQuantity(0);
    return Promise.resolve({result: EMPTY_ARR});
  }

  const onEndReached = async (pageNo: number, pageSize: number) => {
    const result = await apiSelLiveGoods({
      liveId,
      pageSize,
      pageNo,
    })
    .catch((r: any) => {console.log(r, 'selLiveGoods')});

    console.log(result, 'result')
    if (isSucceed(result)) {
      setGoodsQuantity(result?.data?.total);
      return Promise.resolve({result: result?.data?.records || EMPTY_ARR});
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
            <View style={styles.contentStyle}>
              <T4 style={styles.title}>共{goodsQuantity}件商品</T4>
              <PagingList
                size={PAGE_SIZE}
                renderItem={({item, index}) => {
                  console.log(item, 'itemssss')
                  const safeItem = item || EMPTY_OBJ;
                  return (
                    <AudienceRow
                      data={item}
                      dataAdapter={brandGoodAdapter}
                      key={`anchorShopCard_${index}`}
                      onPressBuy={onPressBuy}
                      index={index + 1}
                      style={{borderBottomWidth: 1, borderColor: Colors.divider}}
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
                numColumns={1}
                contentContainerStyle={styles.contentContainerStyle}
              />
            </View>
      </View>
  )
};

AudienceShopCard.defaultProps = {
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
  contentStyle: {
    height: vh(70),
    width: '100%',
    backgroundColor: '#fff',
    padding: pad,
  },
  title: {
    marginBottom: pad * 2
  },
  scroll: {
  },
});

export default AudienceShopCard;