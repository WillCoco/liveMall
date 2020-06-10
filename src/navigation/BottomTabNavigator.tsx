import React from 'react'
import { StyleSheet, Image, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import pxToDp from '../utils/px2dp'
import { Colors } from '../constants/Theme'
import { useSelector } from 'react-redux'

import HomeScreen from '../pages/Home/Home'
import FoundScreen from '../pages/Found/Found'
import CartScreen from '../pages/Cart/Cart'
import MineScreen from '../pages/Mine/Mine'
import LiveHomeScreen from '../pages/Live/LiveHomeScreen'

import homeIcon from '../assets/tab-bar-icon/home.png'
import homeActiveIcon from '../assets/tab-bar-icon/homeActive.png'
import liveIcon from '../assets/tab-bar-icon/live.png'
import liveActiveIcon from '../assets/tab-bar-icon/liveActive.png'
import foundIcon from '../assets/tab-bar-icon/found.png'
import foundActiveIcon from '../assets/tab-bar-icon/foundActive.png'
import cartIcon from '../assets/tab-bar-icon/cart.png'
import cartActiveIcon from '../assets/tab-bar-icon/cartActive.png'
import mineIcon from '../assets/tab-bar-icon/me.png'
import mineActiveIcon from '../assets/tab-bar-icon/meActive.png'

import SearchBar from '../components/SearchBar/SearchBar'
import CartHeaderButton from '../components/CartHeaderButton/CartHeaderButton'

const BottomTab = createBottomTabNavigator()
const INITIAL_ROUTE_NAME = '首页'

function BottomTabNavigator({ navigation, route }: any) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html

  const showHeader = () => {
    if (getHeaderTitle(route) === '我的' || getHeaderTitle(route) === '首页') return false
    return true
  }

  const liveStatus = useSelector((state: any) => state?.publicData?.showLiveTab)

  navigation.setOptions({
    headerShown: showHeader(),
    headerTitle: () => getTabItemComponent(getHeaderTitle(route), navigation),
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerRight: () => getHeaderTitle(route) === '购物车' && <CartHeaderButton />
  })

  return (
    <BottomTab.Navigator
      initialRouteName={route?.params?.initialRoute || INITIAL_ROUTE_NAME}
      tabBarOptions={{
        activeTintColor: Colors.basicColor,
        inactiveTintColor: Colors.lightGrey
      }}
    >
      <BottomTab.Screen
        name="首页"
        component={HomeScreen}
        options={{
          title: '首页',
          tabBarIcon: ({ focused }) => <Image style={styles.tabBarImage} source={focused ? homeActiveIcon : homeIcon} />
        }}
      />
      {
        !!liveStatus && <BottomTab.Screen
          name="直播"
          component={LiveHomeScreen}
          options={{
            title: '直播',
            tabBarIcon: ({ focused }) => <Image style={styles.tabBarImage} source={focused ? liveActiveIcon : liveIcon} />,
          }}
        />
      }
      {!!liveStatus && <BottomTab.Screen
        name="发现"
        component={FoundScreen}
        options={{
          title: '发现',
          tabBarIcon: ({ focused }) => <Image style={styles.tabBarImage} source={focused ? foundActiveIcon : foundIcon} />,
        }}
      />}
      <BottomTab.Screen
        name="购物车"
        component={CartScreen}
        options={{
          title: '购物车',
          tabBarIcon: ({ focused }) => <Image style={styles.tabBarImage} source={focused ? cartActiveIcon : cartIcon} />,
        }}
      />
      <BottomTab.Screen
        name="我的"
        component={MineScreen}
        options={{
          title: '我的',
          tabBarIcon: ({ focused }) => <Image style={styles.tabBarImage} source={focused ? mineActiveIcon : mineIcon} />,
        }}
      />
    </BottomTab.Navigator>
  )
}

/**
 * 获取页面标题
 * @param route 路由信息
 */
function getHeaderTitle(route:
  {
    state:
    {
      routes:
      { [x: string]: { name: string } };
      index: React.ReactText
    }
  }) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME

  return routeName
}

function getTabItemComponent(routeName: String, navigation: string[]) {
  switch (routeName) {
    case '直播':
      return <SearchBar
        hasSearchKey={false}
        isPlaceHolder={true}
        toSearchPage={() => navigation.navigate('LiveSearchScreen')}
      />
    case '发现':
      return <SearchBar
        hasSearchKey={false}
        isPlaceHolder={true}
        toSearchPage={() => navigation.navigate('FoundSearch')}
      />
    case '购物车':
      return <Text style={styles.navBarTitleText}>购物车</Text>
    default:
      break
  }
}

const styles = StyleSheet.create({
  tabBarImage: {
    width: pxToDp(50),
    height: pxToDp(50)
  },
  homeSearchBar: {
    width: pxToDp(710),
    height: pxToDp(56),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: pxToDp(28),
    paddingLeft: pxToDp(26)
  },
  searchKey: {
    color: Colors.lightGrey,
    marginLeft: pxToDp(20)
  },
  navBarTitleText: {
    fontSize: pxToDp(30),
    color: Colors.whiteColor,
    fontWeight: '500'
  }
})

export default BottomTabNavigator