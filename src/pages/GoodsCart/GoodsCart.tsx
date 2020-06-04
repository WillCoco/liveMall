import React, { useState, useEffect } from 'react'
import { ScrollView, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'

import { setCartList, toggleCartAction } from '../../actions/cart'
import { apiCartList, apiChangeCart, apiDelCartItem } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import Toast from 'react-native-tiny-toast'
import { Colors } from '../../constants/Theme'

import CartItem from '../../components/CartItem/CartItem'
import DefaultContent from './DefaultContent/DefaultContent'
import CartFooterAction from '../../components/CartFooterAction/CartFooterAction'
import CartHeaderButton from '../../components/CartHeaderButton/CartHeaderButton'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

interface Props {
  cartData: any;
  dispatch?: any;
  userData?: any;
}

function Cart(props: Props) {
  const { userData, cartData } = props
  const { isLogin } = userData
  const { cartList } = cartData

  const navigation: any = useNavigation()

  const [isEmpty, setIsEmpty] = useState(true)
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [allCartGoodsInfo, setAllCartGoodsInfo]: any = useState({})

  navigation.setOptions({
    headerTitle: '购物车',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false,
    headerRight: () => <CartHeaderButton />
  })

  useEffect(() => {
    if (isLogin) {
      navigation.addListener('focus', () => {
        getCartList()
      })

      navigation.addListener('blur', () => {
        props.dispatch(toggleCartAction('管理'))
      })
    }
  }, [navigation])

  useEffect(() => {
    if (isLogin && cartList.count) {
      updateCartList(cartList)
    }
  }, [cartList])

  /**
   * 获取购物车列表
   */
  const getCartList = () => {
    apiCartList().then((res: any) => {
      console.log('购物车列表', res)
      setNetWorkErr(false)
      if (!res.count) {
        setIsEmpty(true)
        return
      }
      setIsEmpty(false)
      props.dispatch(setCartList(res))
      calcAllGoodsInfo(res)
    }).catch((err: any) => {
      console.log('购物车列表', err)
      setNetWorkErr(true)
    })
  }

  /**
   * 计算商品总价和数量
   */
  const calcAllGoodsInfo = (cartList: { shop: any }) => {
    const { shop } = cartList
    let totalCount = 0
    let totalSalePrice = 0
    let totalOriginalPrice = 0

    shop.forEach((item: { list: any[] }) => {
      item.list.forEach(_item => {
        if (_item.selected) {
          totalCount += 1
          totalSalePrice += (_item.shop_price * _item.goods_num)
          totalOriginalPrice += (_item.market_price * _item.goods_num)
        }
      })
    })

    setAllCartGoodsInfo({
      totalCount,
      totalSalePrice,
      totalOriginalPrice
    })
  }

  /**
   * 切换到首页
   */
  const toHome = () => {
    navigation.navigate('首页')
  }

  /**
   * 去登录
   */
  const toLogin = () => {
    navigation.navigate('Login')
  }

  /**
   * 减少商品数量
   */
  const minusGoodsNum = (shopId: number, cartId: number) => {
    const { cartList } = cartData

    cartList.shop.forEach((item: { shop_info: { shop_id: number }; list: any[] }) => {
      if (item.shop_info.shop_id === shopId) {
        item.list.forEach(_item => {
          if (_item.cart_id === cartId && _item.goods_num > 1) {
            _item.goods_num -= 1
          }
        })
      }
    })

    calcAllGoodsInfo(cartList)
    props.dispatch(setCartList(Object.assign({}, cartList)))
  }

  /**
   * 增加商品数量
   */
  const addGoodsNum = (shopId: number, cartId: number) => {
    const { cartList } = cartData

    cartList.shop.forEach((item: { shop_info: { shop_id: number }; list: any[] }) => {
      if (item.shop_info.shop_id === shopId) {
        item.list.forEach(_item => {
          if (_item.cart_id === cartId && _item.goods_num < _item.goods_count) {
            _item.goods_num += 1
          }
        })
      }
    })

    calcAllGoodsInfo(cartList)
    props.dispatch(setCartList(Object.assign({}, cartList)))
  }

  /**
   * 全选 or 取消全选
   */
  const toggleAllSelect = () => {
    const { cartList } = props.cartData

    cartList.is_all_selected = cartList.is_all_selected ? 0 : 1

    cartList.shop.forEach((item: { shop_info: { is_selected: any }; list: any[] }) => {
      item.shop_info.is_selected = cartList.is_all_selected
      item.list.forEach(_item => {
        _item.selected = cartList.is_all_selected
      })
    })

    calcAllGoodsInfo(cartList)
    props.dispatch(setCartList(Object.assign({}, cartList)))
  }

  /**
   * 购物车店铺 全选 or 取消全选
   */
  const toggleCartItemAllSelect = (shopId: number) => {
    const { cartList } = props.cartData
    cartList.shop.forEach((
      item: {
        shop_info: { shop_id: number; is_selected: number };
        list: any[]
      }
    ) => {
      if (item.shop_info.shop_id === shopId) {
        item.shop_info.is_selected = item.shop_info.is_selected ? 0 : 1

        item.list.forEach(_item => {
          _item.selected = item.shop_info.is_selected
        })
      }
    })

    checkCartGoodsSelectedState(cartList)
  }

  /**
   * 购物车商品 选择 or 取消选择
   */
  const toggleGoodsSelect = (shopId: number, cartId: number) => {
    const { cartList } = cartData

    cartList.shop.forEach((item: { shop_info: { shop_id: number }; list: any[] }) => {
      if (item.shop_info.shop_id === shopId) {
        item.list.forEach(_item => {
          if (_item.cart_id === cartId) {
            _item.selected = _item.selected ? 0: 1
          }
        })
      }
    })

    checkCartGoodsSelectedState(cartList)
  }

  /**
   * 判断整个购物车的选中状态
   */
  const checkCartGoodsSelectedState = (cartList: any) => {
    cartList.totalSelectedCount = 0

    cartList.shop.forEach((item: {
      list: any[]
      selectedCount: number
      shop_info: { is_selected: number }
    }) => {
      item.selectedCount = 0

      item.list.forEach(_item => {
        if (_item.selected) {
          item.selectedCount += 1
        }

        item.shop_info.is_selected = item.selectedCount === item.list.length ? 1 : 0
      })

      if (item.shop_info.is_selected) {
        cartList.totalSelectedCount += 1
      }

      cartList.is_all_selected = cartList.totalSelectedCount === cartList.shop.length ? 1 : 0
    })

    calcAllGoodsInfo(cartList)
    props.dispatch(setCartList(Object.assign({}, cartList)))
  }

  /**
   * 删除购物车商品
   */
  const delCartGoods = () => {
    const { cartList } = cartData

    let selectedCartIds: any[] = []

    cartList.shop.forEach((item: { list: any[] }) => {
      item.list.forEach(_item => {
        if (_item.selected) {
          selectedCartIds.push(_item.cart_id)
        }
      })
    })

    const params = {
      cart_ids: selectedCartIds.toString()
    }

    apiDelCartItem(params).then((res: any) => {
      console.log('删除购物车商品', res)
      if (res === '操作成功') {
        getCartList()
      }
    }).catch((err: any) => {
      Toast.show(err.message)
    })
  }

  /**
   * 预生成订单
   */
  const createOrder = () => {
    const { cartList } = cartData
    const { totalCount } = allCartGoodsInfo

    if (!totalCount) {
      Toast.show('请选择要结算的商品', {
        position: 0
      })
      return
    }

    cartList.shop.forEach((item: { selectedGoods: any; list: any[] }) => {
      item.selectedGoods = item.list.filter(_item => _item.selected)
    })

    let tempOrderList = cartList.shop.filter((item: { selectedGoods: string | any[] }) => item.selectedGoods.length)

    navigation.navigate('CreateOrder', { tempOrderList })
  }

  /**
   * 更新购物车状态
   */
  const updateCartList = (cartList: { shop: { list: any }[] }) => {
    let cartItems: any[] = []
    let params: { cart_id: any; selected: any; goods_num: any }[] = []

    cartList.shop.forEach((item: { list: any }) => {
      cartItems = [...cartItems, ...item.list]
    })

    cartItems.forEach(item => {
      params.push({
        cart_id: item.cart_id,
        selected: item.selected,
        goods_num: item.goods_num
      })
    })

    apiChangeCart({ cartList: params }).then((res: any) => console.log('购物车状态修改', res))
  }

  if (netWorkErr) return <NetWorkErr reload={getCartList} />

  if (!userData.isLogin) {
    return (
      <DefaultContent type='notLogin' nextAction={toLogin} />
    )
  }

  if (isEmpty) {
    return (
      <DefaultContent type='empty' nextAction={toHome} />
    )
  }

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: pxToDp(125) }}
      >
        {
          cartData.cartList.shop && cartData.cartList.shop.map((item: any, index: number) => {
            return (
              <CartItem
                key={`cart-${index}`}
                cartInfo={item}
                minusGoodsNum={(shopId: number, cartId: number) => minusGoodsNum(shopId, cartId)}
                addGoodsNum={(shopId: number, cartId: number) => addGoodsNum(shopId, cartId)}
                cartItemAllSelect={(shopId: number) => toggleCartItemAllSelect(shopId)}
                goodsSelect={(shopId: number, cartId: number) => toggleGoodsSelect(shopId, cartId)}
              />
            )
          })
        }
      </ScrollView>
      <CartFooterAction
        allCartGoodsInfo={allCartGoodsInfo}
        allSelect={toggleAllSelect}
        createOrder={createOrder}
        delCartGoods={delCartGoods}
      />
    </SafeAreaView>
  )
}

export default connect(
  (state: any) => state
)(Cart)