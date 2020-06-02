import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import { setUserInfo } from '../../actions/user'
import { apiGetUserData, apiGetOrderCount, apiGetIndexGoodsList } from '../../service/api'

import Header from './Header/Header'
import ToolBar from './ToolBar/ToolBar'
import Account from './Account/Account'
import ShareBar from './ShareBar/ShareBar'
import GoodsList from './GoodsList/GoodsList'
import PosterCard from './PosterCard/PosterCard'
import FansContent from './FansContent/FansContent'
import checkIsBottom from '../../utils/checkIsBottom'
import OrdersContent from './OrdersContent/OrdersContent'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'
import ActionSheet from '../../components/ActionSheet/ActionSheet'
// import Banner from './Banner/Banner'

const pageSize = 20

function Mine(props: { dispatch: any; isLogin: boolean; }) {
  const { isLogin } = props

  const pageNoRef = useRef(1)
  const hasMoreRef = useRef(true)

  const focused: boolean = useIsFocused()
  const navigation: any = useNavigation()

  const [netWorkErr, setNetWorkErr] = useState(false)
  const [orderCount, setOrderCount]: any = useState({})
  const [goodsList, setGoodsList]: Array<any> = useState([])
  const [showShareBar, setShowShareBar] = useState(false)
  const [showPoster, setShowPoster] = useState(false)
  const [posterPath, setPosterPath] = useState('')

  useEffect(() => {
    getGoodsList()
  }, [])

  useEffect(() => {
    if (focused) {
      getUserInfo()
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
      setNetWorkErr(false)
      const totalPage = Math.ceil(res.count / pageSize)
      hasMoreRef.current = pageNoRef.current < totalPage
      setGoodsList([...goodsList, ...res.list])
    }).catch((err: any) => {
      console.log('推荐商品', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 获取用户信息
   */
  const getUserInfo = () => {
    if (!isLogin) return

    apiGetUserData().then((res: any) => {
      console.log('获取用户信息', res)
      setNetWorkErr(false)
      props.dispatch(setUserInfo(res))
      getOrderCount()  // 获取订单数量
    }).catch((err: any) => {
      console.log('获取用户信息', err)
      // if (err.code === '203' || err.code === '204') {
      //   navigation.navigate('Login')
      // }
      // setNetWorkErr(true)
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

  /**
   * 显示分享卡片
   */
  const showPosterContainer = (img: string) => {
    setShowPoster(true)
    setPosterPath(`data:image/png;base64,${img}`)
  }

  /**
   * 网络异常 重新加载
   */
  // const reload = () => {
  //   getUserInfo()
  //   getGoodsList()
  // }

  // if (netWorkErr) return <NetWorkErr reload={reload} />

  return (
    <>
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
        <ToolBar showShareBar={() => setShowShareBar(true)} />
        {/* 推荐商品 */}
        <GoodsList list={goodsList} hasMore={hasMoreRef.current} />
      </ScrollView>

      <ActionSheet isShow={showShareBar}>
        <ShareBar
          hideShareBar={() => setShowShareBar(false)}
          setPosterPath={(img: string) => showPosterContainer(img)}
        />
      </ActionSheet>

      <PosterCard
        show={showPoster}
        path={posterPath}
        hidePosterCard={() => setShowPoster(false)}
      />
    </>
  )
}

export default connect(
  (state: any) => state.userData
)(Mine)

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})