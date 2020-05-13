import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { connect } from 'react-redux'
import { setUserInfo } from '../../actions/user'
import { apiGetUserData, apiGetOrderCount, apiGetIndexGoodsList } from '../../service/api'
import withPage from '../../components/HOCs/withPage'

import Header from './Header/Header'
import OrdersContent from './OrdersContent/OrdersContent'
import FansContent from './FansContent/FansContent'
import Account from './Account/Account'
import Banner from './Banner/Banner'
import GoodsList from './GoodsList/GoodsList'
import ToolBar from './ToolBar/ToolBar'
import checkIsBottom from '../../utils/checkIsBottom'

function Mine(props) {
  const navigation = useNavigation()
  const pageSize = 20
  const { isLogin } = props
  const focused = useIsFocused()
  const [orderCount, setOrderCount] = useState({})
  const [goodsList, setGoodsList] = useState([])
  let pageNoRef = useRef(1)
  let hasMoreRef = useRef(true)

  useEffect(() => {
    getGoodsList()
  }, [])

  useEffect(() => {
    if (focused) {
      getUserInfo()
      getOrderCount()
    }
  }, [focused])

  /**
   * 加载推荐商品
   */
  const getGoodsList = () => {
    apiGetIndexGoodsList({
      pageNo: pageNoRef.current,
      pageSize
    }).then((res: any) => {
      console.log('推荐商品', res)
      const totalPage = Math.ceil(res.count / pageSize)
      hasMoreRef.current = pageNoRef.current < totalPage
      setGoodsList([...goodsList, ...res.list])
    })
  }

  /**
   * 获取用户信息
   */
  const getUserInfo = () => {
    if (!isLogin) return

    apiGetUserData().then((res: any) => {
      console.log('获取用户信息', res)
      props.dispatch(setUserInfo(res))
    })
  }

  /**
   * 获取订单数量
   */
  const getOrderCount = () => {
    if (!isLogin) return

    apiGetOrderCount().then((res: any) => {
      console.log('订单数量', res)
      setOrderCount(res)
    })
  }

  /**
   * 触底加载
   */
  const onReachBottom = (e: any) => {
    if (hasMoreRef.current && checkIsBottom(e)) {
      pageNoRef.current += 1
      getGoodsList()
    }
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={(e) => onReachBottom(e)}
    >
      {/* 头部区域 */}
      <Header />
      {/* 订单 */}
      <OrdersContent orderCount={orderCount} isLogin={isLogin} />
      {/* 粉丝数量 相关 */}
      <FansContent />
      {/* 账户 */}
      <Account />
      {/* 邀新横幅 */}
      {/* <Banner /> */}
      {/* 工具栏 */}
      <ToolBar />
      {/* 推荐商品 */}
      <GoodsList list={goodsList} />
    </ScrollView>
  )
}

export default connect(
  (state: any) => state.userData
)(withPage(Mine))

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})