/**
 * 添加银行卡
 */
import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Input} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {PrimaryText} from 'react-native-normalization-text';
import {useNavigation, useRoute} from '@react-navigation/native';
import NavBar from '../../../components/NavBar';
import ButtonRadius from '../../../components/Buttons/ButtonRadius';
import {Colors} from '../../../constants/Theme';
import {vw} from '../../../utils/metric';
import {pad} from '../../../constants/Layout';
import {addBankCard} from '../../../actions/asset';
import FormRow from '../../../components/FormRow';
import withPage from '../../../components/HOCs/withPage';
import {apiBindingBankCard} from '../../../service/api';
import {updateBankCards, updateCurBankCards} from '../../../actions/asset';
import {apiGetUserBankCards} from '../../../service/api';
import Mask from '../../../components/Mask';
import {Toast} from '../../../components/Toast';
import pxToDp from '../../../utils/px2dp'

const ROW_HEIGHT = 120;

const defaultCards: [] = [];
const AddBankCard = (props: any) =>  {
  const {navigate, goBack} = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [name, setName] = React.useState('');
  const [cardNum, setCardNum] = React.useState('');
  let [maskList, maskDispatch] = React.useContext(Mask.context);

  let identityName = useSelector(state => state?.userData?.userInfo?.identityName) || '';
  identityName = '*' + identityName?.substring(1); // 脱敏

  /**
   * 提交绑定
   */
  const onSumbit = async () => {
    
    if (!cardNum) {
      Toast.show('请输入银行卡号');
      return;
    }

    const params = {
      bankAccountNo: cardNum,
    }

    const t = Toast.loading('添加中', true);

    apiBindingBankCard(params).then((res: any) => {
      console.log(res, 'bind');
      Toast.remove(t);

      setCardNum('');
      Toast.show('绑定成功');
      apiGetUserBankCards()
        .then((res: any) => {
          dispatch(updateBankCards(res));
        })
        .catch((err: any) => {
          console.log(err);
        })
      goBack();
    }).catch((err: any) => {
      console.log(err, 'apiBindingBankCard');
      Toast.remove(t);
    })
  };

  /**
   * 输入银行卡号
   */
  const onCardNumInput = (value: string) => {
    if ((/^[0-9]*$/).test(value)) {
      setCardNum(value)
    } 
  }

  return (
    <View style={styles.style}>
      <NavBar
        leftTheme="light"
        title="添加银行卡"
        titleStyle={styles.navTitle}
        style={styles.nav}
      />
      <View style={styles.contentWrapper}>
        <FormRow 
          title={'姓名:'}
          placeholder={'请输入真实姓名'}
          value={identityName}
          bottomDivider
          editable={false}
        />
        <FormRow 
          title={'银行卡号:'}
          placeholder={'请填写银行卡号'}
          value={cardNum}
          onChangeText={onCardNumInput}
          keyboardType={'numeric'}
        />
        <PrimaryText style={styles.tip}>为了资金安全，请填写{identityName}名下单银行卡</PrimaryText>
      </View>
      <ButtonRadius
        text="提交"
        style={StyleSheet.flatten([styles.button, {marginBottom: props.safeBottom || pxToDp(40)}])}
        onPress={onSumbit}
      />
    </View>
  )
};

AddBankCard.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: Colors.bgColor
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
  tip: {
    color: Colors.basicColor,
    padding: pad
  },
  button: {
    width: vw(80),
  },
});

export default withPage(AddBankCard);