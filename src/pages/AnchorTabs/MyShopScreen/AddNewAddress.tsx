/**
 * 添加地址
 */
import React, { useState, useEffect } from 'react'
import {SmallText, PrimaryText} from 'react-native-normalization-text';
import Toast from 'react-native-tiny-toast'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, PixelRatio, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Picker, Provider } from '@ant-design/react-native'
import ButtonRadius from '../../../components/Buttons/ButtonRadius';
import cityData from '../../../utils/chianCityData'
import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'
import withPage from '../../../components/HOCs/withPage'
import NavBar from '../../../components/NavBar'
import { apiEditAddr, apiAddrList, apiAuReturnedAddress } from '../../../service/api'
import { setAddressList } from '../../../actions/address'
import Iconarrowright from '../../../components/Iconfont/Iconarrowright'
import { useSelector } from 'react-redux'

function AddNewAddress(props) {
  const navigation = useNavigation()
  const route = useRoute()
  const anchorId = useSelector(state => state?.anchorData?.anchorInfo?.anchorId)
  const [addressInfo] = useState(route?.params?.addressInfo || {})
  const [addrValue, setAddrValue] = useState([])  // 级联选择器对应的 code 数组
  const [userName, setUserName] = useState(addressInfo.consignee || '')
  const [userTel, setUserTel] = useState(addressInfo.mobile || '')
  const [province, setProvince] = useState(addressInfo.province || '')
  const [city, setCity] = useState(addressInfo.city || '')
  const [district, setDistrict] = useState(addressInfo.district || '')
  const [addrDetail, setAddrDetail] = useState(addressInfo.address || '')
  const [isDefault, setIsDefault] = useState(0)

  // navigation.setOptions({
  //   headerTitle: route.params.type === 'edit' ? '编辑收货地址' : '新增收货地址',
  //   headerStyle: {
  //     backgroundColor: Colors.basicColor,
  //     elevation: 0,  // 去除安卓状态栏底部阴影
  //   },
  //   headerTitleAlign: 'center',
  //   headerTintColor: Colors.whiteColor,
  //   headerBackTitleVisible: false
  // })

  useEffect(() => {
    if (route?.params?.type === 'edit') {
      discodsCityCode()
    }
  }, [])

  /**
   * 处理省市区的对应代号
   */
  const discodsCityCode = () => {
    const provinceInfo = cityData?.filter(item => item.label === addressInfo.province)[0] || {}
    const cityInfo = provinceInfo?.children?.filter(item => item.label === addressInfo.city)[0] 
    const districtInfo = cityInfo && cityInfo?.children?.filter(item => item.label === addressInfo.district)[0]

    setAddrValue([provinceInfo.value, cityInfo ? cityInfo.value : '0', districtInfo ? districtInfo.value : '0'])
  }

  /**
   * 选择省市区
   * @param value Array
   */
  const onChange = (value: Array<never>) => {
    setAddrValue(value)

    const province = cityData.filter(item => item.value === value[0])[0]
    const city = province.children.filter(item => item.value === value[1])[0]
    const district = city.children.filter(item => item.value === value[2])[0]

    setProvince(province.label)
    setCity(city.label)
    setDistrict(district.label)
  }


  /**
   * 保存地址
   */
  const submit = () => {

    const params = {
      address: province + city + district + addrDetail,
      anchorId,
      id: route?.params?.type === 'edit' ? 123 : '', // 寄回地址主键id（添加-不传或传null，修改传id
      linkTel: userTel,
      name: userName, // 是否默认寄回地址（1-是，2-否）
      status: isDefault
    }

    console.log(params);
    apiAuReturnedAddress(params).then(res => {
      console.log(res);
    })

    Toast.show('保存成功', {
      position: 0
    });
    // navigation.goBack();

    // apiEditAddr(params).then(res => {
    //   console.log('编辑地址', res)

    //   if (res.success) {
    //     Toast.showSuccess('编辑成功')
    //     updateAddrList()
    //     setTimeout(() => {
    //       navigation.goBack()
    //     }, 1500)
    //   }
    // })
  }

  /**
   * 删除地址
   */
  const removeAddress = () => {
    alert('删除')
  }

  /**
   * 更新地址列表
   */
  const updateAddrList = () => {
    // apiAddrList().then((res: any[]) => {
    //   console.log('更新收货地址列表', res)
    //   props.dispatch(setAddressList(res))
    // })
  }

  return (
    <Provider>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <NavBar
          title={route?.params?.type === 'edit' ? '编辑收货地址' : '添加新地址'}
          leftTheme="light"
          titleStyle={{color: '#fff'}}
          style={styles.nav}
        />
        <View style={styles.container}>
          <View style={styles.formItem}>
            <PrimaryText style={styles.formItemTitle}>收件人</PrimaryText>
            <TextInput
              style={styles.input}
              placeholder='请输入收件人姓名'
              defaultValue={userName}
              onChangeText={(text) => setUserName(text)}
              returnKeyType='next'
            />
          </View>

          <View style={styles.formItem}>
            <PrimaryText style={styles.formItemTitle}>手机号码</PrimaryText>
            <TextInput
              maxLength={11}
              style={styles.input}
              keyboardType='phone-pad'
              placeholder='请输入收件人手机号'
              defaultValue={userTel}
              onChangeText={(text) => setUserTel(text)}
              returnKeyType='next'
            />
          </View>

          <View style={StyleSheet.flatten([styles.formItem, {justifyContent: 'space-between'}])}>
            <PrimaryText style={styles.formItemTitle}>所在地区</PrimaryText>
            <Picker
              data={cityData}
              cols={3}
              value={addrValue}
              onChange={onChange}
            >
              <TouchableOpacity style={{flexDirection: 'row'}}>
                <PrimaryText style={{ paddingLeft: pxToDp(10) }}>{`${province}${city}${district}` || '点击选择'}</PrimaryText>
                <Iconarrowright />
              </TouchableOpacity>
            </Picker>
          </View>

          <View style={[styles.formItem, styles.mutilineIpt, {}]}>
            <PrimaryText style={[styles.formItemTitle, { alignSelf: 'baseline', paddingTop: pxToDp(30) }]}>详细地址</PrimaryText>
            <TextInput
              multiline
              blurOnSubmit
              maxLength={40}
              textAlignVertical="top"
              style={[styles.input, {paddingTop: pxToDp(30)}]}
              placeholder='如道路、门牌号、小区、楼栋号、单元室等'
              defaultValue={addrDetail}
              onChangeText={(text) => setAddrDetail(text)}
              returnKeyType='done'
              returnKeyLabel="完成"
            />
          </View>
          <TouchableOpacity onPress={removeAddress} style={styles.delBtn}>
            <PrimaryText style={[styles.submitBtnText, { color: Colors.basicColor, fontWeight: 'normal' }]}>删除地址</PrimaryText>
          </TouchableOpacity>
        </View>
        <ButtonRadius
          style={styles.submitBtn}
          onPress={submit}
        >
          <PrimaryText color="white">保存</PrimaryText>
        </ButtonRadius>
      </ScrollView>
    </Provider>
  )
}

export default withPage(AddNewAddress);

AddNewAddress.defaultProps = {

};

const styles = StyleSheet.create({
  container: {
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
    backgroundColor: Colors.whiteColor
  },
  submitBtn: {
    position: 'absolute',
    bottom: pxToDp(30),
    left: '50%',
    marginLeft: pxToDp(-335),
    backgroundColor: Colors.basicColor,
    width: pxToDp(670),
    height: pxToDp(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pxToDp(40)
  },
  submitBtnText: {
    fontSize: pxToDp(32),
    fontWeight: '500',
    color: Colors.whiteColor
  },
  formItem: {
    height: pxToDp(100),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: Colors.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  formItemTitle: {
    fontSize: pxToDp(28),
    color: Colors.darkGrey,
    width: pxToDp(120)
  },
  input: {
    flex: 1,
    height: '100%',
  },
  mutilineIpt: {
    flex: -1,
    height: pxToDp(180)
  },
  defaultBtn: {
    backgroundColor: Colors.basicColor,
    alignSelf: 'center',
    width: pxToDp(670),
    height: pxToDp(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pxToDp(40),
    marginTop: pxToDp(30),
    marginBottom: pxToDp(30)
  },
  delBtn: {
    alignSelf: 'center',
    width: pxToDp(670),
    height: pxToDp(80),
    justifyContent: 'center',
  },
  nav: {
    backgroundColor: Colors.basicColor
  }
})