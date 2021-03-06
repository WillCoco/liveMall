/**
 * 主播端直播结束 直播已结束
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
import {PrimaryText, SmallText, T4, TinyText, scale} from 'react-native-normalization-text';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigation, CommonActions, useRoute } from '@react-navigation/native'
import withPage from '../../../components/HOCs/withPage';
import images from '../../../assets/images';
import {Colors} from '../../../constants/Theme';
import {vw} from '../../../utils/metric';
import {pad} from '../../../constants/Layout';
import {updateLivingStatus} from '../../../actions/live';
import formatSinglePrice from '../../../utils/formatGoodsPrice';
import easyNavigate from '../../../utils/easyNavigate';

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
    easyNavigate('AnchorTabs', {
      excludeRouteNames: ['AnchorTabs', 'LiveGoodsManage'],
    })
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
                      <Text style={{color: '#222', fontWeight: 'bold'}}>
                        {
                          item.key === 'moneySum'
                          && formatSinglePrice(endData && endData[item.key] || 0)
                          || endData && endData[item.key] || 0
                        }
                      </Text>
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
                    titleStyle={styles.itemTitle}
                    subtitle={endData?.bestSellGoodsRes?.goodsSku}
                    subtitleStyle={{color: Colors.darkGrey, paddingVertical: pad}}
                    rightTitle={
                      <PrimaryText style={styles.fontYellow}>
                        {formatSinglePrice(endData?.bestSellGoodsRes?.totalNum || 0)}<TinyText style={styles.fontYellow}> 元</TinyText>
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
                  titleStyle={styles.itemTitle}
                  rightTitle={formatSinglePrice(endData?.bestBrowseGoodsRes?.totalNum || 0)}
                  rightTitleStyle={{color: Colors.yellowColor}}
                  rightSubtitle={'最高观看人数'}
                  rightSubtitleStyle={{fontSize: scale(12), width: scale(90), textAlign: 'right'}}
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
    width: scale(150),
    height: scale(28),
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
  itemTitle: {
    fontSize: scale(12),
    color: '#222',
    fontWeight: 'bold'
  },
  subTitleLine: {
    flexDirection: 'row',
    paddingVertical: pad,
  },
  subIcon: {
    width: scale(14),
    height: scale(16),
    marginRight: scale(5),
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