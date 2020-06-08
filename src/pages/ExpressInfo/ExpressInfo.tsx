import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'

import ExpressStepper from '../../components/ExpressStepper/ExpressStepper'
import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'
import { apiQueryExpress, apiGetShippingList } from '../../service/api'

function ExpressInfo(props: { userTel: string }) {
  const { userTel } = props

  const route: any = useRoute()
  const navigation = useNavigation()
  const { invoiceNo, shippingCode } = route.params
  const [expressList, setExpressList]: any[] = useState()
  const [expressName, setExpressName] = useState('')

  navigation.setOptions({
    headerTitle: '查看物流',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    queryExpress()
    queryExpressList()
  }, [])

  const queryExpressList = () => {
    apiGetShippingList().then(res => {
      console.log(res)
      res.forEach((item: any) => {
        if (item.shippingCode === shippingCode) {
          setExpressName(item.shippingName)
        }
      })
    })
  }

  const queryExpress = () => {
    const params = {
      shippingCode,
      invoiceNo,
      customerName: userTel.substr(7)
    }

    apiQueryExpress(params).then((res: any) => {
      setExpressList(res.data.reverse())
    }).catch((err: any) => {
      console.log(err)
    })
  }

  return (
    <>
      <View style={styles.container}>
        <Image source={require('../../assets/login-image/logo.png')} style={styles.logo} />
        <View style={styles.content}>
          <Text style={styles.expressName}>{expressName}</Text>
          <Text style={styles.expressCode}>运单号:{invoiceNo}</Text>
          {/* <Text style={styles.expressTel}>客服电话：321412</Text> */}
        </View>
      </View>
      <ExpressStepper expressList={expressList} />
    </>
  )
}

export default connect(
  (state: any) => state.userData.userInfo
)(ExpressInfo)

const styles = StyleSheet.create({
  container: {
    padding: pxToDp(20),
    paddingTop: pxToDp(30),
    paddingBottom: pxToDp(30),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor
  },
  logo: {
    width: pxToDp(122),
    height: pxToDp(122),
    borderRadius: pxToDp(61),
    margin: pxToDp(20)
  },
  content: {
    marginBottom: pxToDp(10)
  },
  expressName: {
    fontSize: pxToDp(30),
    lineHeight: pxToDp(42),
    color: Colors.darkBlack
  },
  expressCode: {
    fontSize: pxToDp(30),
    lineHeight: pxToDp(42),
    color: Colors.darkBlack
  },
  expressTel: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(42),
    color: Colors.darkBlack
  }
})