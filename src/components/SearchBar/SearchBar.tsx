import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { connect } from 'react-redux'

import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'

import { pad } from '../../constants/Layout'

interface Props {
  iconColor: string
  searchKey: string
  searchBarStyle: any
  searchKeyStyle: any
  hasSearchKey: boolean
  isPlaceHolder: boolean
  toSearchPage(): void
  toSearch(searchKey: string): void
  inputSearchKey(text: string): void
}

function SearchBar(props: Props) {

  const toSearchPage = () => props.toSearchPage()

  if (props.isPlaceHolder) {
    return (
      <View style={[styles.placeholderSearchBar, props.searchBarStyle]}>
        <Ionicons
          size={20}
          name='ios-search'
          color={props.iconColor || Colors.lightGrey}
          style={{marginRight: pad}}
        />
        <Text
          numberOfLines={1}
          style={[styles.searchKey, props.searchKeyStyle]}
          onPress={toSearchPage}
        >{props.hasSearchKey ? props.searchKey : '请输入要搜索的内容'}</Text>
      </View>
    )
  } else {
    return (
      <View style={[styles.placeholderSearchBar, styles.searchBar]}>
        <Ionicons
          size={20}
          name='ios-search'
          color={Colors.lightGrey}
        />
        <TextInput
          style={styles.searchKey}
          placeholder={props.hasSearchKey ? props.searchKey : '请输入要搜索的内容'}
          onChangeText={(text: string) => props.inputSearchKey(text)}
          onSubmitEditing={() => props.toSearch(props.searchKey)}
          clearButtonMode='while-editing'
        />
      </View>
    )
  }
}

export default connect(
  (state: any) => state.homeData
)(SearchBar)

const styles = StyleSheet.create({
  placeholderSearchBar: {
    width: pxToDp(710),
    height: pxToDp(56),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: pxToDp(28),
    paddingLeft: pxToDp(26),
    paddingRight: pxToDp(26)
  },
  searchBar:{
    width: pxToDp(600)
  },
  searchKey: {
    flex: 1,
    color: Colors.lightGrey,
    marginLeft: pxToDp(20),
    padding: 0
  }
})