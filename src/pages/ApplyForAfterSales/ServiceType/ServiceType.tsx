import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'

interface Props  {
  typeList: Array<any>;
  setTypeList(typeList: Array<any>): any;
}

export default function ServiceType(props: Props) {
  const { typeList, status } = props

  const toggleType = (index: number) => {
    if (status === 2) return

    typeList.forEach((item: any) => {
      item.active = false
      typeList[index].active = true
    })

    props.setTypeList(typeList)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>服务类型</Text>
      <View style={styles.typeContent}>
        {
          typeList.map((item: any, index: number) => {
            return (
              <Text
                key={`type-${index}`}
                style={[styles.btn, item.active && styles.btnActive]}
                onPress={() => toggleType(index)}
              >{item.value}</Text>
            )
          })
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: pxToDp(10),
    marginBottom: pxToDp(10),
    backgroundColor: Colors.whiteColor,
    padding: pxToDp(20),
    paddingTop: pxToDp(30),
    paddingBottom: pxToDp(30)
  },
  title: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    marginBottom: pxToDp(38)
  },
  typeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30)
  },
  btn: {
    width: pxToDp(200),
    height: pxToDp(60),
    lineHeight: pxToDp(60),
    borderRadius: pxToDp(30),
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: Colors.lightPink,
    color: Colors.basicColor,
    fontSize: pxToDp(26),
    fontWeight: '500'
  },
  btnActive: {
    backgroundColor: Colors.basicColor,
    color: Colors.whiteColor
  }
})