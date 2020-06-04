import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'

function FansContent(props: { userInfo?: {} | any; isLogin?: boolean }) {
  const navigation: any = useNavigation()
  const { userInfo = {}, isLogin } = props

  const toPublishedWork = () => {
    isLogin ? navigation.navigate('PublishedWork') : navigation.navigate('Login')
  }

  const toFocusedAnchor = () => {
    isLogin ? navigation.navigate('FocusedAnchor') : navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>

      <TouchableWithoutFeedback onPress={toPublishedWork}>
        <View style={styles.item}>
          <Text style={styles.count}>{userInfo?.publishCount || 0}</Text>
          <Text style={styles.text}>发布</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={toFocusedAnchor}>
        <View style={styles.item}>
          <Text style={styles.count}>{userInfo?.anchorCount || 0}</Text>
          <Text style={styles.text}>关注主播</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.line} />

      <View style={styles.item}>
        <Text style={[styles.count, { color: Colors.darkGrey}]}>{userInfo?.fansCount || 0}</Text>
        <Text style={styles.text}>粉丝</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.count, { color: Colors.darkGrey}]}>{userInfo?.lookCount || 0}</Text>
        <Text style={styles.text}>浏览</Text>
      </View>
      
    </View>
  )
}

export default connect(
  (state: any) => state.userData
)(FansContent)

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: pxToDp(16),
    paddingBottom: pxToDp(14)
  },
  item: {
    flex: 1,
    alignItems: 'center'
  },
  count: {
    fontSize: pxToDp(34),
    fontWeight: '600',
    lineHeight: pxToDp(48),
    color: Colors.darkBlack,
    marginBottom: pxToDp(4)
  },
  text: {
    fontSize: pxToDp(26),
    lineHeight: pxToDp(37),
    color: Colors.darkGrey
  },
  line: {
    height: pxToDp(80),
    width: pxToDp(2),
    backgroundColor: Colors.borderColor
  }
})