import React, { useState } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../../constants/Theme'
import { Ionicons } from '@expo/vector-icons'
import pxToDp from '../../../utils/px2dp'

interface Props {
  statusBarHeight: number;
  toSearch(searchKey: string): void;
}

function Header(props: Props) {
  const { statusBarHeight } = props
  const navigation = useNavigation()
  const [searchKey, setSearchKey] = useState('')

  return (
    <View style={[styles.container, {
      height: statusBarHeight + pxToDp(70),
      paddingTop: statusBarHeight
    }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name='ios-arrow-back' size={28} color={Colors.whiteColor} />
      </TouchableOpacity>
      <View style={styles.searchBarContainer}>
        <Ionicons name='ios-search' size={20} color={Colors.darkGrey} />
        <TextInput
          placeholder='搜索添加商品'
          style={styles.searchInput}
          clearButtonMode='while-editing'
          onChangeText={(text) => setSearchKey(text)}
          onSubmitEditing={() => props.toSearch(searchKey)}
          returnKeyType='done'
        />
      </View>

    </View>
  )
}

export default connect(
  (state: any) => state.publicData
)(Header)

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.basicColor,
    padding: pxToDp(20),
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchBarContainer: {
    flex: 1,
    height: pxToDp(56),
    borderRadius: pxToDp(28),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: pxToDp(20),
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30)
  },
  searchInput: {
    paddingLeft: pxToDp(20),
    flex: 1,
    padding: 0
  }
})