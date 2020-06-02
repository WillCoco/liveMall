/**
 * 资产管理
 */
import * as React from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'
import {PrimaryText, T4} from 'react-native-normalization-text';
import ImageText from '../../../components/ImageText';
import ButtonOutLine from '../../../components/Buttons/ButtonOutLine';
import NavBar from '../../../components/NavBar';
import withPage from '../../../components/HOCs/withPage';
import { Colors } from '../../../constants/Theme';
import { pad } from '../../../constants/Layout';
import images from '../../../assets/images/index';
import {apiGetUserAssetsStatistics} from '../../../service/api';
import Toast from 'react-native-tiny-toast';
import Mask from '../../../components/Mask';
import {useSelector, useDispatch} from 'react-redux';
import {setAnchorAssetsInfo} from '../../../actions/asset';
import formatSinglePrice from '../../../utils/formatGoodsPrice';

const AssetManage = (props: any) =>  {
  const {navigate, replace} = useNavigation();
  const [assetsInfo, setAssetsInfo] = React.useState({})
  const identityName = useSelector(state => state?.userData?.userInfo?.identityName);
  const [maskList, maskDispatch] = React.useContext(Mask.context);
  const dispatch = useDispatch();

  /**
   * 店铺资金
   */
  const assetTypes = [
    {key: 'accountMoney', img: images.assetAvailable, text: '可提现金额'},
    {key: 'willSettle', img: images.assetWaitForSettle, text: '待结算金额'},
    {key: 'frozenMoney', img: images.assetFrozen, text: '冻结金额'},
  ];

  /**
   * 我的收入
   */
  const incomeTypes = [
    {key: 'shareProfit', img: images.incomeShare, text: '分享收入'},
    {key: 'inviteProfit', img: images.incomeInvite, text: '邀请收入'},
    {key: 'buySelfProfit', img: images.incomeShop, text: '自购返现'},
    {key: 'activityProfit', img: images.incomeActive, text: '活动奖励'},
  ];

  /**
   * 获取用户资产
   */
  React.useEffect(() => {
    apiGetUserAssetsStatistics().then((res: any) => {
      console.log(res, 'getuserAssetsStatistics');
      setAssetsInfo(res);
      dispatch(setAnchorAssetsInfo(res));
    })
    .catch((err: any) => {
      console.log('anchorAsset:', err);
    })
  }, []);

  /**
   * 提现前置校验
   */
  const beforeWithdraw = () => {
    // 是否实名
    if (!identityName) {
      maskDispatch({
        type: Mask.Actions.PUSH,
        payload: {
          type: Mask.ContentTypes.Normal,
          data: {
            text: '为了您的资金安全，请先前往实名认证！',
            title: '提示',
            rightBtnText: '去实名认证',
            onPressRight: () => {
              maskDispatch({type: Mask.Actions.REMOVE})
              navigate('RealName')
            }
          }
        }
      });
      return;
    }
    // 去提现
    navigate('Withdraw');
  };

  const RenderRow = (props: {
    text: string,
    quantity: number,
    img: any,
    style?: StyleProp<any>
  }) => {
    return (
      <View style={StyleSheet.flatten([styles.row, props.style])}>
          <Image source={props.img} style={styles.img} resizeMode="contain" />
          <View style={styles.rowTextWrapper}>
            <PrimaryText style={{marginBottom: 8}}>{props.text}</PrimaryText>
            <T4>¥{props.quantity}</T4>
          </View>
      </View>
    )
  }

  return (
    <View style={styles.style}>
      <NavBar
        title="资金管理"
        titleStyle={{color: '#fff', marginLeft: 6}}
        leftTheme="light"
        right={() => (
          <TouchableOpacity onPress={() => navigate('AnchroBill')} style={{/* width: 80, borderWidth: 1, */ padding: pad}}>
            <PrimaryText color="white">账单</PrimaryText>
          </TouchableOpacity>
        )}
        style={styles.navWrapper}
      />
      <View style={StyleSheet.flatten([styles.headerWrapper, {height: 230 + props.safeTop}])}>
        <Image style={styles.imgBg} source={images.anchorShopBg} resizeMode="stretch" />
        <View style={styles.assetContentWrapper}>
          {
            assetTypes.map((row, index) => {
              return (
                <ImageText
                  key={`assetTypes_${index}`}
                  disabled
                  text={row.text}
                  img={row.img}
                  style={{flex: 1}}
                  imgStyle={{height: 40, width: 40}}
                  textStyle={{color: '#fff', marginTop: 6}}
                >
                  <PrimaryText color="white" style={{marginTop: 2}}>¥{formatSinglePrice(assetsInfo[row.key] || 0) }</PrimaryText>
                </ImageText>
              )
            })
          }
        </View>
        <ButtonOutLine
          text="提现"
          textStyle={{color: '#fff'}}
          style={styles.buttonStyle}
          onPress={beforeWithdraw}
        />
      </View>
      <View style={styles.contentWrapper}>
        <T4 style={styles.title}>我的收入</T4>
        {
          incomeTypes.map((income, index) => {
            return (
              <RenderRow
                key={`income_row_${index}`}
                text={income.text}
                img={income.img}
                quantity={formatSinglePrice(assetsInfo[income.key] || 0)}
                style={{borderTopWidth: index !== 0 ? 1 : 0, borderColor: Colors.divider}}
              />
            )
          })
        }
      </View>
    </View>
  )
};

AssetManage.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: Colors.bgColor
  },
  navWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 101,
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  headerWrapper: {
    backgroundColor: 'transparent',
  },
  buttonStyle: {
    marginBottom: pad,
    borderColor: '#fff'
  },
  assetContentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: pad * 3
  },
  imgBg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    position: 'absolute'
  },
  contentWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: pad,
    paddingTop: pad * 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pad * 2,
    paddingHorizontal: pad
  },
  rowTextWrapper: {
    flex: 1,
  },
  img: {
    width: 48,
    height: 48,
    marginRight: pad
  }
});

export default withPage(AssetManage, {
  statusBarOptions: {
    barStyle: 'light-content'
  }
});