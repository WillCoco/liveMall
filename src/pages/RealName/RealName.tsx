import * as React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import NavBar from '../../components/NavBar'
import FormRow from '../../components/FormRow'
import {PrimaryText, SmallText} from 'react-native-normalization-text'
import {Colors} from '../../constants/Theme'
import ButtonRadius from '../../components/Buttons/ButtonRadius'
import {vw} from '../../utils/metric'
import {pad} from '../../constants/Layout'
import withPage from '../../components/HOCs/withPage'
import pxToDp from '../../utils/px2dp'
import { useNavigation } from '@react-navigation/native'
import Mask from '../../components/Mask'
import {apiRealName, apiGetUserData} from '../../service/api'
import {Toast} from '../../components/Toast'
import { setUserInfo } from '../../actions/user'
import { useDispatch } from 'react-redux'

const RealName = props => {
  const [name, setName] = React.useState('')
  const [idNumber, setIdNumber] = React.useState('')
  let [maskList, maskDispatch] = React.useContext(Mask.context);
  const {navigate, goBack} = useNavigation()
  const dispatch = useDispatch()

  /**
   * 前置确认
   */
  const beforeSubmit = () => {

    if (!(/^[\u4E00-\u9FA5]{2,}$/.test(name))) {
      Toast.info('请输入合法的名字')
      return
    }

    if (!(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(idNumber))) {
      Toast.info('请输入合法的身份证号')
      return
    }

    maskDispatch({
      type: Mask.Actions.PUSH,
      payload: {
        type: Mask.ContentTypes.Normal,
        data: {
          text: '实名认证信息一旦提交将无法更改！',
          title: '提示',
          rightBtnText: '确定',
            onPressRight: onSubmit
        }
      }});
  }

  /**
   * 提交实名认证
   */
  const onSubmit = () => {
    const params = {
      identityName: name,
      identityNum: idNumber,
    }

    maskDispatch({
      type: Mask.Actions.REMOVE,
    });

    const loading = Toast.loading('认证中')
    apiRealName(params)
      .then((res: any) => {
        Toast.remove(loading)
        if (res?.success) {
          Toast.info('实名认证通过')
          /**
           * 获取用户信息
           */
          apiGetUserData().then((res: any) => {
            console.log('获取用户信息', res)
            dispatch(setUserInfo(res))
          }).catch((err: any) => {
            console.log('获取用户信息', err)
            // if (err.code === '203' || err.code === '204') {
            //   navigate('Login')
            // }
          })
          goBack()
        }
      })
      .catch((err: any) => {
        console.log(err, 'realname')
        Toast.remove(loading)
      })
  }

  return (
    <View style={styles.style}>
      <NavBar
        leftTheme="light"
        title="实名认证"
        titleStyle={{color: Colors.whiteColor}}
        style={{backgroundColor: Colors.basicColor}}
      />
      <FormRow 
        title={'真实姓名'}
        value={name}
        placeholder={'请输入姓名'}
        onChangeText={setName}
        bottomDivider
      />
      <FormRow 
        title={'身份证号'}
        value={idNumber}
        placeholder={'请输入身份证号码'}
        onChangeText={setIdNumber}
        bottomDivider
        maxLength={18}
      />
      <PrimaryText style={styles.tip}>继续表示同意
        <PrimaryText style={{color: Colors.blueColor}} onPress={() => navigate('PrivacyPolicy')}>云闪播用户隐私政策协议</PrimaryText>
      </PrimaryText>
      <ButtonRadius
        text="开始认证"
        style={styles.button}
        onPress={beforeSubmit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  style: {
    flex: 1,
  },
  tip: {
    marginTop: pad,
    marginHorizontal: pad,
  },
  button: {
    position: 'absolute',
    width: vw(80),
    bottom: pxToDp(100)
  },
})

export default withPage(RealName)