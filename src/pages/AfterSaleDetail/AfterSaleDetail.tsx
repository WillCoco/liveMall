import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, TextInput, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Colors } from '../../constants/Theme'
import { apiReturnOrderDetail, apiCancelReturnOrder, apiGetShippingList, apiBuyerDeliverGoods } from '../../service/api'
import { Picker } from '@ant-design/react-native'

import pxToDp from '../../utils/px2dp'

import ShopCard from './ShopCard/ShopCard'
import AddiInfoCard from './AddiInfoCard/AddiInfoCard'
import ReturnSchedule from './ReturnSchedule/ReturnSchedule'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'
import { Toast } from '@ant-design/react-native'

export default function AfterSaleDetail() {
  const route: any = useRoute()
  const navigation = useNavigation()
  const [orderInfo, setOrderInfo]: any = useState({})
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [deliverNo, setDeliverNo] = useState('')
  const [expressName, setExpressName] = useState('')
  const [expressList, setExpressList]: any[] = useState([])

  navigation.setOptions({
    headerTitle: `售后详情`,
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    getOrderInfo()
  }, [])

  /**
   * 获取订单详情
   */
  const getOrderInfo = () => {
    apiReturnOrderDetail({ id: route.params.id }).then((res: { orderAfterSalesProcessVOList: any[] }) => {
      console.log('售后详情', res)
      setNetWorkErr(false)
      res.orderAfterSalesProcessVOList.forEach((item: any) => {
        switch (item.type) {
          case 1:
            item.title = '提交申请'
            break
          case 2:
            item.title = '审核通过'
            break
          case 3:
            item.title = '审核拒绝'
            break
          case 4:
            item.title = '买家待发货'
            break
          case 5:
            item.title = '卖家待收货'
            break
          case 6:
            item.title = '卖家已收货'
            break
          case 7:
            item.title = '卖家已发货'
            break
          case 8:
            item.title = '退款通过'
            break
          case 9:
            item.title = '服务关闭'
            break
          default:
            break
        }
      })

      setOrderInfo(res)
      getExpressList(res)
    }).catch((err: any) => {
      console.log('售后详情', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 获取快递列表
   */
  const getExpressList = (orderInfo: any) => {
    let code = ''

    if (orderInfo.buyerDeliveryComCode) {
      code = orderInfo.buyerDeliveryComCode
    }

    apiGetShippingList().then((res: any) => {
      console.log('快递列表', res)

      if (res) {
        let expressInfo = res.filter((item: { shippingCode: string }) => item.shippingCode === code)
        let expressName = expressInfo.length ? expressInfo[0].shippingName : ''

        res.forEach((item: any) => {
          item.value = item.shippingName
          item.label = item.shippingName
        })

        setExpressList(res)
        setExpressName(expressName)
      }
    })
  }

  /**
   * 选择快递公司
   */
  const changeExpress = (value: any) => {
    setExpressName(value[0])
  }

  /**
   * 取消申请
   */
  const cancelApply = () => {
    const { id } = orderInfo

    apiCancelReturnOrder({ id }).then((res: any) => {
      Toast.success('已取消售后申请')

      setTimeout(() => {
        navigation.goBack()
      }, 1500);
    })
  }

  const submit = () => {
    const { orderId } = orderInfo

    if (!deliverNo || !expressName) {
      Toast.fail('请填写完整信息')
      return
    }

    const curExp = expressList.filter((item: any) => item.shippingName === expressName)

    const params = {
      deliverNo,
      shippingId: curExp[0].shippingId,
      id: ~~orderId
    }

    apiBuyerDeliverGoods(params).then((res: any) => {
      Toast.success('已提交')
      setTimeout(() => {
        navigation.goBack()
      }, 1500);
    })
  }

  if (netWorkErr) return <NetWorkErr reload={getOrderInfo} />

  return (
    <ScrollView bounces={false}>
      {/* 店铺商品信息 */}
      <ShopCard orderInfo={orderInfo} />
      {/* 订单附加信息 */}
      <AddiInfoCard orderInfo={orderInfo} />
      {/* 退换进度 */}
      <ReturnSchedule scheduleList={orderInfo.orderAfterSalesProcessVOList} />

      {
        showInput
        && <>
          <View style={styles.item}>
            <Text style={styles.title}>快递公司</Text>
            <Picker
              data={expressList}
              cols={1}
              onChange={(e) => changeExpress(e)}
            >
              <Text>{expressName || '请选择'}</Text>
            </Picker>
          </View>

          <View style={styles.item}>
            <Text style={styles.title}>快递公司</Text>
            <TextInput onChangeText={text => setDeliverNo(text)} placeholder='请填写快递单号' />
          </View></>
      }

      {/* 订单操作 */}
      <View style={styles.action}>
        <Text style={styles.btn} onPress={cancelApply}>取消申请</Text>
        {
          (orderInfo.processType !== 2 && orderInfo.processType !== 4 || orderInfo.type === 1)
          && <Text style={[styles.btn, { backgroundColor: Colors.basicColor }]} onPress={() => {
            showInput ? submit : setShowInput(true)
          }}>
            {showInput ? '确认提交' : '填写快递单号'}
          </Text>
        }
      </View>

      {/* <Modal
        visible={showInput}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setShowInput(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <View style={styles.inputGroup}>
              <Text>快递公司</Text>
              <Picker
                data={expressList}
                cols={1}
                style={{ zindex: 999 }}
              >
                <Text>请选择</Text>
              </Picker>
            </View>

            <View style={styles.inputGroup}>
              <Text>快递单号</Text>
              <TextInput onChangeText={text => setDeliverNo(text)} placeholder='请填写快递单号' />
            </View>


            <View style={styles.btnGroup}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setShowInput(false)}>
                <Text>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn]}>
                <Text style={{ color: Colors.whiteColor }}>确认</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  action: {
    height: pxToDp(140),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
    marginTop: pxToDp(10)
  },
  btn: {
    width: pxToDp(310),
    height: pxToDp(80),
    lineHeight: pxToDp(80),
    borderRadius: pxToDp(40),
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: Colors.lightGrey,
    fontSize: pxToDp(30),
    color: Colors.whiteColor
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.whiteColor,
    padding: pxToDp(30)
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: pxToDp(20)
  },
  cancelBtn: {
    backgroundColor: Colors.lightGrey
  },
  modalBtn: {
    width: pxToDp(240),
    height: pxToDp(80),
    backgroundColor: Colors.basicColor,
    borderRadius: pxToDp(8),
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: pxToDp(1),
    height: pxToDp(100),
    borderBottomColor: Colors.borderColor
  },
  item: {
    backgroundColor: Colors.whiteColor,
    marginTop: pxToDp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    height: pxToDp(80)
  },
  title: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    fontWeight: '500'
  },
  value: {
    fontSize: pxToDp(24),
    color: Colors.darkGrey,
    fontWeight: '500'
  }
})