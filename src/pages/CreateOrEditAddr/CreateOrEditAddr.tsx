import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, PixelRatio } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Picker, Provider } from '@ant-design/react-native'
import { connect } from 'react-redux'
import { setAddressList } from '../../actions/address'
import cityData from '../../utils/chianCityData'
import { Colors } from '../../constants/Theme'
import pxToDp from '../../utils/px2dp'
import { apiEditAddr, apiAddrList, apiAddAddr, apiDelAddr } from '../../service/api'
import Toast from 'react-native-tiny-toast'

interface Props {
  dispatch: (arg0: { type: string; payload: any[] }) => void
}

function CreateOrEditAddr(props: Props) {
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const pageType = route.params.type
  const addressInfo = route.params.addressInfo ? route.params.addressInfo : {}

  const [isDefault, setIsDefault] = useState(0)
  const [city, setCity] = useState(addressInfo.city || '')
  const [addrValue, setAddrValue]: Array<any> = useState([])  // 级联选择器对应的 code 数组
  const [userTel, setUserTel] = useState(addressInfo.mobile || '')
  const [province, setProvince] = useState(addressInfo.province || '')
  const [district, setDistrict] = useState(addressInfo.district || '')
  const [userName, setUserName] = useState(addressInfo.consignee || '')
  const [addrDetail, setAddrDetail] = useState(addressInfo.address || '')

  navigation.setOptions({
    headerTitle: pageType === 'edit' ? '编辑收货地址' : '新增收货地址',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    if (pageType === 'edit') {
      discodsCityCode()
    }
  }, [])

  /**
   * 处理省市区的对应代号
   */
  const discodsCityCode = () => {
    const provinceInfo = cityData.filter(item => item.label === addressInfo.province)[0]
    const cityInfo = provinceInfo.children.filter((item: { label: any }) => item.label === addressInfo.city)[0]
    const districtInfo = cityInfo && cityInfo.children.filter((item: { label: any }) => item.label === addressInfo.district)[0]

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

  const submit = async () => {
    let params: any = {
      city,
      province,
      district,
      consignee: userName,
      mobile: userTel,
      address: addrDetail,
      is_default: isDefault
    }

    let result: any = {}

    for (const key in params) {
      if (params[key].length === 0) {
        Toast.show('请填写完整信息', {
          position: 0
        })
        return
      }
    }

    try {
      if (pageType === 'edit') {
        params[`address_id`] = addressInfo.address_id

        result = await apiEditAddr(params)
      } else {
        result = await apiAddAddr(params)
      }

      if (result.success) {
        Toast.showSuccess('编辑成功')
        updateAddrList()
        setTimeout(() => {
          navigation.goBack()
        }, 1500)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 删除地址
   */
  const remove = () => {
    const { address_id } = addressInfo

    apiDelAddr({ address_id }).then((res: any) => {
      console.log('删除地址', res)
      if (res.success) {
        updateAddrList()
        navigation.goBack()
      }
    })
  }

  /**
   * 更新地址列表
   */
  const updateAddrList = () => {
    apiAddrList().then((res: any[]) => {
      console.log('更新收货地址列表', res)
      props.dispatch(setAddressList(res))
    })
  }

  return (
    <Provider>
      <View style={{ height: '100%' }}>
        <View style={styles.container}>
          <View style={styles.formItem}>
            <Text style={styles.formItemTitle}>收件人</Text>
            <TextInput
              style={styles.input}
              placeholder='请输入收件人姓名'
              defaultValue={userName}
              onChangeText={(text) => setUserName(text)}
              returnKeyType='next'
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formItemTitle}>手机号码</Text>
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

          <View style={styles.formItem}>
            <Text style={styles.formItemTitle}>所在地区</Text>
            <Picker
              data={cityData}
              cols={3}
              value={addrValue}
              onChange={onChange}
            >
              <Text style={{ paddingLeft: pxToDp(10) }}>{`${province}${city}${district}` || '点击选择'}</Text>
            </Picker>
          </View>

          <View style={[styles.formItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.formItemTitle}>详细地址</Text>
            <TextInput
              maxLength={40}
              placeholder='如道路、门牌号、小区、楼栋号、单元室等'
              defaultValue={addrDetail}
              onChangeText={(text) => setAddrDetail(text)}
              returnKeyType='done'
            />
          </View>
        </View>

        <TouchableOpacity onPress={() => {
          Toast.showSuccess('设置成功，请保存')
          setIsDefault(1)
        }} style={styles.defaultBtn}>
          <Text style={styles.submitBtnText}>设为默认地址</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={remove} style={styles.delBtn}>
          <Text style={[styles.submitBtnText, { color: Colors.basicColor, fontWeight: 'normal' }]}>删除地址</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={submit} style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>保存</Text>
        </TouchableOpacity>

      </View>
    </Provider>
  )
}

export default connect()(CreateOrEditAddr)

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
    alignItems: 'center'
  },
  formItemTitle: {
    fontSize: pxToDp(28),
    color: Colors.darkGrey,
    width: pxToDp(120)
  },
  input: {
    flex: 1,
    height: '100%',
    paddingLeft: pxToDp(10)
  },
  mutilineIpt: {
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
    alignItems: 'center',
    borderRadius: pxToDp(40),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.basicColor
  }
})