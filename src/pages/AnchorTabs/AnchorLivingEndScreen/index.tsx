/**
 * 主播端直播结束
 */
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Icon, Divider, ListItem} from 'react-native-elements';
import {PrimaryText, SmallText, T4, TinyText} from 'react-native-normalization-text';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigation, CommonActions, useRoute } from '@react-navigation/native'
import withPage from '../../../components/HOCs/withPage';
import images from '../../../assets/images';
import {Colors} from '../../../constants/Theme';
import {vw} from '../../../utils/metric';
import {pad} from '../../../constants/Layout';
import {updateLivingStatus} from '../../../actions/live';

  const dataList = [
  {title: '直播时长', key: 'liveDuration',},
  {title: '获得点赞数', key: 'liveSum',},
  {title: '观众总数', key: 'watchSum',},
  {title: '新增粉丝数', key: 'addFavourite',},
  {title: '下单数量', key: 'orderSum',},
  {title: '总成交金额', key: 'moneySum',},
]

const AnorchLivingEndScreen = (props: any) : any =>  {
  const {dispatch: davDispatch, goBack} = useNavigation();
  const dispatch = useDispatch();
  const anchorId = useSelector((state: any) => state?.anchorData?.anchorInfo?.anchorId) || ''
  const route = useRoute();

  console.log(route?.params, 'liveendliveendliveendliveendliveend');

  const endData = route?.params
  
  React.useEffect(() => {
    return () => {
      // 重置观看端 结束字段
      dispatch(updateLivingStatus(false));
    }
  }, [])

  // 直接返回到主播tab
  const onPressClose = () => {
    goBack()

    // davDispatch((state: any) => {
    //   const routes = state.routes.filter((r: any) => {
    //     return !(r.name === 'LiveGoodsManage' || r.name === 'CreateLiveScreen' || r.name === 'AnchorLivingEnd');
    //   });
    //   console.log(routes, 111)

    //   console.log(11)

    //   return CommonActions.reset({
    //     ...state,
    //     routes,
    //     index: routes.length - 1,
    //   });
    // })
  }

  return (
    <View style={{flex: 1}}>
      <ImageBackground source={images.liveEndBg} style={styles.wrapper}>
        <View style={{paddingTop: props.safeTop}}>
          <TouchableOpacity style={styles.close} onPress={onPressClose} >
            <Icon name="close" color={Colors.whiteColor}/>
          </TouchableOpacity>
          <Image source={images.liveEndTitle} style={styles.title} />
          <PrimaryText color="white" style={{textAlign: 'center', paddingVertical: pad * 1.5}}>直播ID:{anchorId}</PrimaryText>
          <View style={styles.dataWrapper}>
            <View style={styles.subTitleLine}>
              <Image source={images.liveEndData} style={styles.subIcon} />
              <T4 style={styles.subTitle}>本场直播数据</T4>
              <Divider style={{backgroundColor: Colors.yellowColor}}/>
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingVertical: pad * 2}}>
              {
                dataList.map(item => {
                  return (
                    <View style={styles.dataItem} key={item.title}>
                      <Text>{endData && endData[item.key] || 0}</Text>
                      <Text style={{color: Colors.darkGrey}}>{item.title}</Text>
                    </View>
                  )
                })
              }
            </View>
            {
              endData?.bestSellGoodsRes?.goodsId
               && 
              (
                <View>
                  <View style={styles.divider}></View>
                  <View style={styles.subTitleLine}>
                    <Image source={images.liveEndGoods} style={styles.subIcon} />
                    <T4 style={styles.subTitle}>本场销量最佳商品</T4>
                  </View>
                  <ListItem
                    leftAvatar={{ source: {uri: endData?.bestSellGoodsRes?.originalImg || ''}, rounded: false}}
                    title={endData?.bestSellGoodsRes?.goodsName}
                    subtitle={endData?.bestSellGoodsRes?.goodsSku}
                    subtitleStyle={{color: Colors.darkGrey, paddingVertical: pad}}
                    rightTitle={
                      <PrimaryText style={styles.fontYellow}>
                        {endData?.bestSellGoodsRes?.totalNum}<TinyText style={styles.fontYellow}> 元</TinyText>
                      </PrimaryText>
                    }
                  />
                </View>
              )
            }
            {
              endData && Object.keys(endData?.bestBrowseGoodsRes).length
               && 
              <View>
                <View style={styles.divider}></View>
                <View style={styles.subTitleLine}>
                  <Image source={images.liveEndGoods} style={styles.subIcon} />
                  <T4 style={styles.subTitle}>本场销量人气商品</T4>
                </View>
                <ListItem
                  leftAvatar={{ source: {uri: endData?.bestBrowseGoodsRes?.originalImg}, rounded: false}}
                  title={endData?.bestBrowseGoodsRes?.goodsName}
                  rightTitle={endData?.bestBrowseGoodsRes?.totalNum}
                  rightTitleStyle={{color: Colors.yellowColor}}
                  rightSubtitle={'最高观看人数'}
                  rightSubtitleStyle={{fontSize: 12, width: 90}}
                />
              </View>
            }
          </View>
      </View>
      </ImageBackground>
    </View>
  )
};

AnorchLivingEndScreen.defaultProps = {

};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: vw(100),
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: pad * 1.5,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  close: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    width: 150,
    height: 28,
    alignSelf: 'center',
    marginTop: pad
  },
  dataWrapper: {
    width: '100%',
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    paddingVertical: pad * 2,
    paddingHorizontal: pad * 1.5,
  },
  dataItem: {
    width: '33%',
    height: 50,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider
  },
  subTitleLine: {
    flexDirection: 'row',
    paddingVertical: pad,
  },
  subIcon: {
    width: 14,
    height: 16,
    marginRight: 5,
  },
  subTitle: {
    color: Colors.basicColor,
    fontWeight: 'bold',
  },
  fontYellow: {
    color: Colors.yellowColor
  }
});

export default withPage(AnorchLivingEndScreen, {
  statusBarOptions: {
  }
});