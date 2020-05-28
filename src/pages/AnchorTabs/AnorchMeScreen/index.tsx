/**
 * 组货
 */
import * as React from 'react';
import Avatar from '../../../components/Avatar';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {T4, SmallText, PrimaryText} from 'react-native-normalization-text';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import withPage from '../../../components/HOCs/withPage';
import NavBar from '../../../components/NavBar';
import images from '../../../assets/images';
import ToolRow from '../../../components/ToolRow';
import {pad} from '../../../constants/Layout';
import {Colors} from '../../../constants/Theme';
import {useDispatch, useSelector} from 'react-redux';
import {apiAnchorHomePage} from '../../../service/api';
import {setAnchorInfo} from '../../../actions/anchor';

const ToolCell = (props: {
  text: string,
  img: any,
  onPress: () => void,
}) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.toolCellWrapper}>
      <Image source={props.img} style={styles.toolImg}/>
      <PrimaryText color="secondary" style={styles.greyText}>{props.text}</PrimaryText>
    </TouchableOpacity>
  )
}

const AnorchMeScreen = () =>  {
  const {navigate, reset} = useNavigation();
  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId) || '';
  const anchorInfo = useSelector((state: any) => state?.anchorData?.anchorInfo) || {};
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const dataList = [
    {img: images.anchorMyRecords, text: '我的直播', onPress: () => navigate('AnchorRecords'), showRightText: true, rightTitle: anchorInfo.liveAmount},
    {img: images.anchorMyTrailer, text: '我的预告', onPress: () => navigate('AnchorTrailers'), showRightText: true, rightTitle: anchorInfo.advanceAmount},
    {img: images.anchorLiveAnalyze, text: '直播数据', onPress: () => navigate('LivesAnalyze')},
  ];

  const toolsList = [
    {img: images.anchorPieceGoods, text: '预组货', onPress: () => navigate('LivingGoodsWareHouse')},
    {img: images.anchorGoodsManage, text: '店铺商品管理', onPress: () => navigate('AnchorShowcaseManage')},
    {img: images.anchorShop, text: '我的店铺', onPress: () => navigate('AnchorDetail', 
      {anchorId: anchorInfo?.anchorId, hideFollowButton: true})},
    {img: images.anchorBeAgent, text: '成为经纪人', onPress: () => navigate('BeAgent')}
  ];

  /**
   * 获取主播详情
   */
  React.useEffect(() => {
    if (isFocused) {
      apiAnchorHomePage({userId})
      .then((res: any) => {
        dispatch(setAnchorInfo(res))
      })
      .catch(console.warn)
    }
  }, [isFocused]);

  /**
   * tab的返回到 我的 
   */
  const onBackPress = () => {
    reset({
      index: 0,
      routes: [{ name: 'Root', params: {initialRoute: '我的'}}],
    });

    // navigate('我的')
  }

  return (
    <ScrollView style={styles.style}>
      <NavBar 
        leftTheme="light" 
        title="" 
        style={styles.navWrapper} 
        onLeftPress={onBackPress} 
        // right={
        //   () => {
        //     return (
        //       <TouchableOpacity onPress={() => {navigate('Message')}}>
        //         <Image 
        //           style={styles.messageIcon} 
        //           source={images.liveMessageIcon} 
        //           resizeMode="stretch" 
        //         />
        //       </TouchableOpacity>
        //     )
        //   }
        // }
      />
      <View style={styles.headerWrapper}>
        <Image style={styles.imgBg} source={images.anchorMeBg} resizeMode='stretch' />
        <Avatar size={60} style={styles.avatar} source={anchorInfo?.logo && {uri: anchorInfo.logo} || images.userAvatar} />
        <SmallText color="white" style={styles.idText}>直播ID: {anchorInfo?.anchorId}</SmallText>
      </View>
      <View style={styles.blockWrapper}>
        <T4 style={styles.nickText}>{anchorInfo?.name || '主播昵称'}</T4>
        <SmallText style={styles.followText}>{anchorInfo?.favouriteAmount || 0}粉丝</SmallText>
        {
          dataList.map((row, index) => {
            return (
              <ToolRow
                key={`_${index}`}
                title={row.text}
                img={row.img}
                onPress={row.onPress}
                showRightText={row.showRightText}
                rightTitle={row.rightTitle}
              />
            )
          })
        }
      </View>
      <T4 style={styles.title}>我的工具</T4>
      <View style={StyleSheet.flatten([styles.blockWrapper, styles.row])}>
        {
          toolsList.map((row, index) => {
            return (
              <ToolCell
                key={`_${index}`}
                text={row.text}
                img={row.img}
                onPress={row.onPress}
              />
            )
          })
        }
      </View>
    </ScrollView>
  )
};

AnorchMeScreen.defaultProps = {

};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  headerWrapper: {
    paddingBottom: pad,
    backgroundColor: '#fff',
  },
  imgBg: {
    width: '100%',
    height: 158,
    backgroundColor: '#fff',
  },
  nickText: {
    paddingLeft: pad * 2,
    marginBottom: pad,
  },
  followText: {
    marginBottom: pad,
    paddingLeft: pad * 2
  },
  title: {
    padding: pad,
    backgroundColor: '#fff'

  },
  blockWrapper: {
    paddingHorizontal: pad * 2,
    paddingTop: pad,
    paddingBottom: pad * 2,
    borderBottomWidth: 4,
    borderBottomColor: Colors.bgColor,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  avatar: {
    position: 'absolute',
    top: 100,
    left: pad * 3
  },
  messageIcon: {
    width: 20,
    height: 18
  },
  idText: {
    position: 'absolute',
    top: '60%',
    right: pad
  },
  toolCellWrapper: {
    alignItems: 'center'
  },
  toolImg: {
    width: 46,
    height: 46,
  },
  greyText: {
    marginTop: 4
  },
  navWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent'
  },
});

export default withPage(AnorchMeScreen, {
  statusBarOptions: {
    barStyle: 'light-content',
    backgroundColor: 'transparent',
  }
});