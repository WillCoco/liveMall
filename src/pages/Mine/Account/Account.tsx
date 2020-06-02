import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'

import CardTitle from '../../../components/CardTitle/CardTitle'
import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'
import formatSinglePrice from '../../../utils/formatGoodsPrice'

function Account(props: { userInfo?: {} | any; isLogin?: boolean }) {
  const { userInfo = {}, isLogin } = props
  const navigation: any = useNavigation()

  const toAccountInfo = () => {
    if (!isLogin) {
      navigation.navigate('Login')
      return
    }

    navigation.navigate('AssetManage')
  }

  return (
    <View style={styles.container}>
      <CardTitle title='我的账户' subTitle='钱包' nextAction={toAccountInfo} />
      <View style={styles.accountInfo}>
        <View style={[styles.accountItem, { marginBottom: pxToDp(60) }]}>
          <Image source={require('../../../assets/mine-image/img_yifanxian.png')} style={styles.icon} />
          <View style={styles.accountDetail}>
            <Text style={styles.text}>已返金额</Text>
            <Text style={styles.price}>¥{formatSinglePrice(userInfo.hasSettle || 0)}</Text>
          </View>
        </View>
        <View style={[styles.accountItem, { marginBottom: pxToDp(60) }]}>
          <Image source={require('../../../assets/mine-image/icon_yiti.png')} style={styles.icon} />
          <View style={styles.accountDetail}>
            <Text style={styles.text}>已提金额</Text>
            <Text style={styles.price}>¥{formatSinglePrice(userInfo.hasWithdraw || 0)}</Text>
          </View>
        </View>
        <View style={styles.accountItem}>
          <Image source={require('../../../assets/mine-image/img_daifanxian.png')} style={styles.icon} />
          <View style={styles.accountDetail}>
            <Text style={styles.text}>待返金额</Text>
            <Text style={styles.price}>¥{formatSinglePrice(userInfo.willSettle || 0)}</Text>
          </View>
        </View>
        <View style={styles.accountItem}>
          <Image source={require('../../../assets/mine-image/icon_keti.png')} style={styles.icon} />
          <View style={styles.accountDetail}>
            <Text style={styles.text}>可提金额</Text>
            <Text style={styles.price}>¥{formatSinglePrice(userInfo.accountMoney || 0)}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default connect(
  (state: any) => state.userData
)(Account)

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    marginTop: pxToDp(20),
    marginBottom: pxToDp(20),
    padding: pxToDp(20),
    paddingTop: pxToDp(30),
    paddingBottom: pxToDp(40)
  },
  accountInfo: {
    flexDirection: 'row',
    marginTop: pxToDp(40),
    flexWrap: 'wrap'
  },
  icon: {
    width: pxToDp(80),
    height: pxToDp(80)
  },
  accountItem: {
    paddingLeft: pxToDp(40),
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  accountDetail: {
    marginLeft: pxToDp(12)
  },
  text: {
    fontSize: pxToDp(26),
    color: Colors.darkGrey,
    lineHeight: pxToDp(37)
  },
  price: {
    fontSize: pxToDp(30),
    fontWeight: '600',
    color: Colors.darkBlack,
    lineHeight: pxToDp(42)
  }
})