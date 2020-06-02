import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

interface Props {
  toSearch: ((e: import("react-native").NativeSyntheticEvent<import("react-native").TextInputSubmitEditingEventData>) => void) | undefined
  inputSearchKey: (arg0: string) => void;
}

export default function SearchBar(props: Props) {
  return (
    <View style={[styles.placeholderSearchBar, styles.searchBar]}>
      <Ionicons
        size={20}
        name='ios-search'
        color={Colors.lightGrey}
      />
      <TextInput
        style={styles.searchKey}
        placeholder='请输入要搜索的内容'
        onChangeText={text => props.inputSearchKey(text)}
        onSubmitEditing={props.toSearch}
        clearButtonMode='while-editing'
        returnKeyType='done'
      />
    </View>
  )
}

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
  searchBar: {
    width: pxToDp(620)
  },
  searchKey: {
    flex: 1,
    color: Colors.lightGrey,
    marginLeft: pxToDp(20),
    padding: 0
  }
})