import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

interface Props {
  isEmpty: boolean;
  choosedAddress?: any;
  defaultAddress?: any;
}

export default function AddressBar(props: Props) {
  const { isEmpty } = props
  const addressInfo = props.choosedAddress || props.defaultAddress
  const navigation: any = useNavigation()

  /**
   * 点击地址栏
   */
  const nextAction = () => {
    console.log(isEmpty)

    if (isEmpty) {
      navigation.navigate('CreateOrEditAddr', { type: 'add' })
      return
    }

    navigation.navigate('AddressList')
  }

  const Address = () => {
    return (
      <View style={styles.address}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: pxToDp(15) }}>
          <Text style={styles.userName}>{addressInfo.consignee}</Text>
          <Text style={styles.useTel}>{addressInfo.mobile}</Text>
        </View>
        <Text numberOfLines={2} style={styles.addrInfo}>{`${addressInfo.province}${addressInfo.city}${addressInfo.district}${addressInfo.address}`}</Text>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={nextAction}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../../assets/order-image/addr_icon.png')} style={styles.addrIcon} />
          {
            isEmpty
              ? <Text style={styles.addrTipText}>添加收货地址</Text>
              : addressInfo
                ? <Address />
                : <Text style={styles.addrTipText}>选择收货地址</Text>
          }
        </View>
        <Ionicons
          size={20}
          name='ios-arrow-forward'
          color={Colors.darkGrey}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: pxToDp(20),
    borderRadius: pxToDp(16)
  },
  addrIcon: {
    width: pxToDp(72),
    height: pxToDp(72),
    marginRight: pxToDp(20)
  },
  addrTipText: {
    fontSize: pxToDp(30),
    color: Colors.darkBlack,
    fontWeight: '500'
  },
  address: {
    width: pxToDp(480)
  },
  addrInfo: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(33),
    color: Colors.lightBlack
  },
  userName: {
    fontSize: pxToDp(30),
    color: Colors.darkBlack,
    fontWeight: '500',
    marginRight: pxToDp(20)
  },
  useTel: {
    fontSize: pxToDp(24),
    fontWeight: '400',
    color: Colors.darkGrey
  }
})