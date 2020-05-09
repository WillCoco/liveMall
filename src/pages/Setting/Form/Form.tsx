import React from 'react'
import { View, Text, StyleSheet, PixelRatio, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

export default function Form(props) {
  const navigation = useNavigation()
  const realname = ''

  const contactService = () => {
    console.log('联系客服')
  }

  const inviteFriends = () => {
    console.log('邀请好友')
  }

  const goRealname = () => {
    if (realname) return
    navigation.push('RealName')
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => navigation.push('AddressList')}>
        <View style={styles.formItem}>
          <Text style={styles.title}>我的收货地址</Text>
          <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={contactService}>
        <View style={styles.formItem}>
          <Text style={styles.title}>联系客服</Text>
          <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigation.push('AboutUs')}>
        <View style={styles.formItem}>
          <Text style={styles.title}>关于圈品</Text>
          <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={inviteFriends}>
        <View style={styles.formItem}>
          <Text style={styles.title}>邀请好友</Text>
          <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={goRealname}>
        <View style={[styles.formItem, { borderBottomWidth: 0 }]}>
          <Text style={styles.title}>实名认证</Text>
          {
            realname 
              && <Text>{realname}</Text> 
              || <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
          }
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    backgroundColor: Colors.whiteColor,
    marginTop: pxToDp(10)
  },
  formItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: pxToDp(100),
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1 / PixelRatio.get()
  },
  title: {
    fontSize: pxToDp(30),
    color: Colors.darkBlack,
    fontWeight: '500'
  }
})