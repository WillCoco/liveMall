import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'

const navList = [
  {
    text: '品牌',
    icon: require('../../../assets/home-image/icon_brand.png'),
    path: 'Brand'
  }, {
    text: '分类',
    icon: require('../../../assets/home-image/icon_classify.png'),
    path: 'Classify'
  }, {
    text: '特卖专区',
    icon: require('../../../assets/home-image/icon_sale.png'),
    path: 'Sale'
  }, {
    text: '产业带',
    icon: require('../../../assets/home-image/icon_belt.png'),
    path: 'Belt'
  }
]

export default function HomeNav() {
  const navigation: any = useNavigation()

  const nextAction = (path: any) => {
    if (path === 'Brand') {
      navigation.navigate('Brand', { type: 'default' })
    } else if (path === 'Sale') {
      navigation.navigate('Sale', { type: 'sale' })
    } else {
      navigation.navigate(path)
    }
  }

  return (
    <View style={styles.navContainer}>
      {
        navList.map((item, index) => {
          return (
            <TouchableWithoutFeedback
              key={`nav-${index}`}
              onPress={() => nextAction(item.path)}
            >
              <View style={styles.navItem}>
                <Image source={ item.icon } style={styles.navIcon} />
                <Text style={styles.navText}>{item.text}</Text>
              </View>
            </TouchableWithoutFeedback>
          )
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: pxToDp(40),
    paddingBottom: pxToDp(35)
  },
  navItem: {
    alignItems: 'center'
  },
  navIcon: {
    width: pxToDp(100),
    height: pxToDp(100)
  },
  navText: {
    color: Colors.darkBlack,
    fontSize: pxToDp(28),
    marginTop: pxToDp(14)
  }
})