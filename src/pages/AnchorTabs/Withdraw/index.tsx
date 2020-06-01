/**
 * 提现
 */
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Image,
  ScrollView
} from 'react-native';
import {ListItem} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {PrimaryText, TinyText, T4} from 'react-native-normalization-text';
import {useNavigation, useRoute} from '@react-navigation/native';
import NavBar from '../../../components/NavBar';
import ButtonRadius from '../../../components/Buttons/ButtonRadius';
import {Colors} from '../../../constants/Theme';
import {vw} from '../../../utils/metric';
import {pad} from '../../../constants/Layout';
import {addBankCard} from '../../../actions/asset';
import { sleep } from '../../../utils/tools';
import FormRow from '../../../components/FormRow';
import CountDown from '../../../components/CountDown';
import Mask from '../../../components/Mask';
import withPage from '../../../components/HOCs/withPage';
import {apiGetUserBankCards, apiWithdraw} from '../../../service/api';
import pxToDp from '../../../utils/px2dp';
import images from '../../../assets/images';
import {updateCurBankCards} from '../../../actions/asset';
import { apiSendVerCode } from '../../../service/api';
import { Toast } from '../../../components/Toast';

const Withdraw = (props: any) =>  {
  const {navigate, goBack, replace} = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [withdrawNum, setWithdrawNum] = React.useState('');
  const [verifyCode, setVerifyCode] =  React.useState('');
  let [maskList, maskDispatch] = React.useContext(Mask.context);
  const curBankCard = useSelector((state: any) => state?.asset?.curBankCard) || {}; // 当前选中银行卡
  const [showCountDown, setShowCountDown] = React.useState(false); // 是否显示获取验证码倒计时
  const accountMoney = useSelector((state: any) => state?.asset?.anchorAssetsInfo?.accountMoney) || 0; // 可提现金额
  const userTel = useSelector((state: any) => state?.userData?.userInfo?.userTel) || '' // 手机号

  React.useEffect(() => {
    apiGetUserBankCards()
      .then((res: any) => {
        if (!curBankCard?.id) {
          const defaultBankCard = res?.length !== 0 && res?.[0] || {};
          dispatch(updateCurBankCards(defaultBankCard));
        }
      })
      .catch((err: any) => {
        console.log('apiGetUserBankCards:', err);
      })

  }, []);

  /**
   * 当前银行卡
   */
  const {
    card,
  } = route.params || {}

  /**
   * 展示倒计时
   */
  const renderCoundDown = (second: number) => {
    return <PrimaryText>{'' + second}s后重发</PrimaryText>
  }
  
  /**
   * 发送验证码
   */
  const getCode = () => {

    const loading = Toast.loading('', true)

    apiSendVerCode({ userTel: 17681610221 }).then((res: any) => {
      console.log('发送验证码', res)

      Toast.remove(loading)

      Toast.success('验证码已发送')

      setShowCountDown(true);

    }).catch((err: any) => {
      // Toast.fail('发送失败，请稍后再试')
      console.log('发送验证码', err)
    })
  }

  /**
   * 提交提现
   */
  const onSumbit = async () => {
    
    if (!(+withdrawNum) || (+withdrawNum > +accountMoney)) {
      Toast.show('请输入正确的提现金额');
      return;
    }

    if (verifyCode.length < 6) {
      Toast.show('请输入正确的验证码')
      return;
    }

    const params = {
      "amount": withdrawNum,
      "code": verifyCode,
      "userBankCardId": curBankCard.id
    };

    const t = Toast.loading('提现中', true)
    apiWithdraw(params)
      .then( (res: any) => {
        if (res?.message?.indexOf('手机验证码不正确')) {
          maskDispatch({
            type: Mask.Actions.PUSH,
            payload: {
              type: Mask.ContentTypes.Normal,
              data: {
                text: '验证码错误，请重新输入!',
                title: '提示',
                showLeftBtn: false,
                rightBtnText: '确定',
                onPressRight: () => {maskDispatch({type: Mask.Actions.REMOVE})}
              }
            }});
          return;
        }
        Toast.remove(t)
        Toast.show('提现成功')
        goBack();
      })
      .catch((err: any) => {
        console.log(err, '提现申请');
        Toast.remove(t)
      })
  };

  return (
    <ScrollView contentContainerStyle={styles.style}>
      <NavBar
        leftTheme="light"
        title="提现"
        titleStyle={styles.navTitle}
        style={styles.nav}
      />
      <View style={styles.contentWrapper}>
        {
          curBankCard?.id
          && 
          <ListItem
            title={
              <T4 style={{marginBottom: pad}}>{curBankCard?.bankName}</T4>
            }
            subtitle={
              <TinyText>尾号{curBankCard?.bankAccountNo}储蓄卡</TinyText>
            }
            leftAvatar={{ source: images.bankIcon}}
            chevron
            style={{marginBottom: pad}}
            onPress={() => replace('BankCardBag')}
          />
          ||
          <TouchableOpacity onPress={() => navigate('AddBankCard')} style={styles.addButton}>
            <Image source={images.addBankCardIcon} style={styles.addIcon} />
            <PrimaryText >添加银行卡</PrimaryText>
          </TouchableOpacity>
        }
        <FormRow
          title={'提现金额'}
          placeholder={`可提现金额¥${accountMoney / 100}`}
          value={withdrawNum}
          onChangeText={setWithdrawNum}
          keyboardType='numeric'
        />
        <FormRow 
          title={'验证码'}
          value={verifyCode}
          onChangeText={setVerifyCode}
          keyboardType='numeric'
          rightTitle={
            showCountDown
            && <CountDown
              deadline={Date.now() + 60000}
              renderTime={
                second => renderCoundDown(second)
              }
              onStop={() => setShowCountDown(false)}
            />
            || <PrimaryText style={{color: Colors.blueColor}} onPress={getCode}>获取验证码</PrimaryText>
          }
          maxLength={6}
        />
        <TinyText style={{padding: pad}}>每次提现将会收取0.50元手续费，建议减少提现次数，避免造成资金损失</TinyText>
      </View>
     
      <ButtonRadius
        text="提交"
        style={styles.button}
        onPress={onSumbit}
      />
    </ScrollView>
  )
};

Withdraw.defaultProps = {
};

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
  contentWrapper: {
    flex: 1,
  },
  button: {
    width: vw(80),
    marginBottom: pxToDp(40)
  },
  addIcon: {
    width: 18,
    height: 18,
    marginRight: pad,
  },
  addButton: {
    height: pxToDp(100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    marginBottom: pad
  },
});

export default withPage(Withdraw);