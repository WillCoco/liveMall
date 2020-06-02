import React, { useState } from 'react'
import { TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Colors } from '../../constants/Theme'

import ShopCard from './ShopCard/ShopCard'
import ServiceType from './ServiceType/ServiceType'
import Reason from './Reason/Reason'
import Contact from './Contact/Contact'
import pxToDp from '../../utils/px2dp'
import { apiCreateReturnOrder } from '../../service/api'
import Toast from 'react-native-tiny-toast'

const phonePattern = /^1[3456789]\d{9}$/

export default function ApplyForAfterSales() {
  const route = useRoute()
  const navigation = useNavigation()
  const [orderInfo]: any = useState(route.params)
  const [reason, setReason] = useState('')
  const [tel, setTel] = useState('')
  const [isSubmit, setIsSubmit] = useState(false)
  const [imageList, setImageList]: Array<any> = useState([])
  const [typeList, setTypeList] = useState([
    { value: '仅退款', type: 1, active: true },
    { value: '退货退款', type: 2, active: false },
    { value: '换货', type: 3, active: false }
  ])

  navigation.setOptions({
    headerTitle: `申请售后`,
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  const submit = () => {
    if (isSubmit) return

    setIsSubmit(true)

    const { goodsInfo } = orderInfo

    if (!reason) {
      Toast.show('请填写申请原因', {
        position: 0
      })
      return
    }

    if (!phonePattern.test(tel)) {
      Toast.show('请输入正确的手机号', {
        position: 0
      })
      return
    }

    const params = {
      applyImgs: imageList.splice(1, imageList.length - 1),
      applyReason: reason,
      goodsNum: goodsInfo.goodsNum,
      mobile: tel,
      orderId: orderInfo.id,
      shopId: orderInfo.shopId,
      skuId: goodsInfo.skuId,
      type: typeList.filter(item => item.active)[0].type
    }

    apiCreateReturnOrder(params).then((res: any) => {
      console.log(res, '申请退款')
      setIsSubmit(false)
      if (res) {
        Toast.showSuccess('已提交申请')
        setTimeout(() => {
          navigation.goBack()
        }, 1000)
      } else {
        Toast.show('申请失败', { position: 0 })
      }
    }).catch((err: any) => {
      console.log(err)
      setIsSubmit(false)
    })
  }

  return (
    <ScrollView>
      {/* 店铺、商品信息 */}
      <ShopCard orderInfo={orderInfo} />
      {/* 服务类型 */}
      <ServiceType typeList={typeList} setTypeList={(list: React.SetStateAction<{ type: string; active: boolean }[]>) => setTypeList(JSON.parse(JSON.stringify(list)))} />
      {/* 申请原因 */}
      <Reason
        inputReason={(text: string) => setReason(text)}
        setImageList={(list: any) => setImageList(list)}
      />
      {/* 联系电话 */}
      <Contact inputTel={(value: string) => setTel(value)} />
      {/* 退货说明 */}
      <Text style={styles.tips}>退货说明：退货成功后，退款将原路返回，退款只会退还实际支付的价格。提交退款申请后，售后专员可能与您电话沟通，请保持手机畅通。</Text>
      <TouchableOpacity style={styles.submitBtn} onPress={submit}>
        <Text style={styles.btnText}>提交</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  tips: {
    padding: pxToDp(20),
    fontSize: pxToDp(24),
    color: Colors.darkGrey,
    fontWeight: '500',
    lineHeight: pxToDp(34)
  },
  submitBtn: {
    marginTop: pxToDp(30),
    marginBottom: pxToDp(30),
    width: pxToDp(670),
    height: pxToDp(80),
    borderRadius: pxToDp(40),
    alignSelf: 'center',
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontSize: pxToDp(32),
    color: Colors.whiteColor,
    fontWeight: '500'
  }
})