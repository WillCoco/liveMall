import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  title: string;
  subTitle?: string;
  nextAction: ((event: import("react-native").GestureResponderEvent) => void) | undefined
}

export default function CardTitle(props: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      {
        !!props.subTitle && <TouchableOpacity style={styles.subTitle} onPress={props.nextAction}>
          <Text style={styles.subTitleText}>{props.subTitle}</Text>
          <Ionicons
            size={20}
            name='ios-arrow-forward'
            color={Colors.darkGrey}
          />
        </TouchableOpacity>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: pxToDp(34),
    fontWeight: 'bold',
    color: Colors.darkBlack
  },
  subTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  subTitleText: {
    fontSize: pxToDp(26),
    color: Colors.darkGrey,
    marginRight: pxToDp(10)
  }
})