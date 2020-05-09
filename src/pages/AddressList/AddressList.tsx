import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, PixelRatio, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import { setChoosedAddr } from '../../actions/address'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/Theme'
import pxToDp from '../../utils/px2dp'

function AddressList(props) {
  const navigation = useNavigation()
  const { addressList } = props

  navigation.setOptions({
    headerTitle: '收货地址',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  /**
   * 添加新地址
   */
  const createNewAddress = () => {
    console.log(111)
    navigation.push('CreateOrEditAddr', { type: 'create' })
  }

  /**
   * 编辑地址
   */
  const editAddress = (item: any) => {
    navigation.push('CreateOrEditAddr', { type: 'edit', addressInfo: item })
  }

  /**
   * 选择该地址
   */
  const chooseThisAddr = (item: any) => {
    props.dispatch(setChoosedAddr(item))
    navigation.goBack()
  }

  return (
    <View>
      <ScrollView style={styles.container}>
        {
          addressList && addressList.map((item: any, index: number) => {
            return (
              <View key={`addr-${index}`} style={styles.addrItem}>
                <Text style={styles.nameAvatar}>{item.consignee.slice(0, 1)}</Text>

                <TouchableWithoutFeedback onPress={() => chooseThisAddr(item)}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                      <Text style={styles.userName}>{item.consignee}</Text>
                      <Text style={styles.userTel}>{item.mobile}</Text>
                    </View>
                    <Text style={styles.addrInfo} numberOfLines={2}>{`${item.province}${item.city}${item.district}${item.address}`}</Text>
                  </View>
                </TouchableWithoutFeedback>


                <TouchableOpacity onPress={() => editAddress(item)} style={styles.editBtn}>
                  <Text style={styles.editBtnText}>编辑</Text>
                </TouchableOpacity>
              </View>
            )
          })
        }
      </ScrollView>

      <TouchableOpacity onPress={createNewAddress} style={styles.addBtn}>
        <Ionicons
          size={40}
          name='ios-add'
          color={Colors.whiteColor}
        />
        <Text style={styles.addBtnText}>添加新地址</Text>
      </TouchableOpacity>

    </View>
  )
}

export default connect(
  (state: any) => state.addressData
)(AddressList)

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingBottom: pxToDp(120)
  },
  addBtn: {
    position: 'absolute',
    left: '50%',
    bottom: pxToDp(30),
    marginLeft: pxToDp(-335),
    width: pxToDp(670),
    height: pxToDp(80),
    backgroundColor: Colors.basicColor,
    borderRadius: pxToDp(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addBtnText: {
    fontSize: pxToDp(32),
    color: Colors.whiteColor,
    fontWeight: '500',
    marginLeft: pxToDp(20)
  },
  addrItem: {
    paddingLeft: pxToDp(20),
    paddingTop: pxToDp(30),
    paddingBottom: pxToDp(30),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameAvatar: {
    width: pxToDp(72),
    height: pxToDp(72),
    lineHeight: pxToDp(72),
    textAlign: 'center',
    backgroundColor: '#bbb',
    fontSize: pxToDp(30),
    fontWeight: '500',
    color: Colors.whiteColor,
    borderRadius: pxToDp(36),
    overflow: 'hidden',
    marginRight: pxToDp(28)
  },
  editBtn: {
    width: pxToDp(120),
    height: pxToDp(60),
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1 / PixelRatio.get(),
    borderLeftColor: Colors.borderColor,
    marginLeft: pxToDp(28)
  },
  editBtnText: {
    fontSize: pxToDp(26),
    color: Colors.darkGrey,
    fontWeight: '500'
  },
  userName: {
    fontSize: pxToDp(32),
    fontWeight: '500',
    color: Colors.darkBlack
  },
  userTel: {
    fontSize: pxToDp(24),
    color: Colors.darkGrey,
    marginLeft: pxToDp(40)
  },
  addrInfo: {
    marginTop: pxToDp(10),
    fontSize: pxToDp(26),
    color: Colors.lightBlack,
    lineHeight: pxToDp(37)
  }
})