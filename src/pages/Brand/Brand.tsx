import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, StyleSheet, ImageBackground } from 'react-native'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'
import { apiBrandList, apiGetAttention, apiAttentionBrand } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'
import checkIsBottom from '../../utils/checkIsBottom'

import BrandCard from './BrandCard/BrandCard'
import LoadMore from '../../components/LoadMore/LoadMore'
import Toast from 'react-native-tiny-toast'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

const pageSize = 20

export default function Brand() {
  const route: any = useRoute()
  const navgation: any = useNavigation()
  const isFocused: boolean = useIsFocused()

  const pageNoRef = useRef(1)
  const hasMoreRef = useRef(true)

  const [complete, setComplete] = useState(false)
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [brandList, setBrandList]: Array<any> = useState([])

  const pageType = route.params.type

  navgation.setOptions({
    headerTitle: pageType === 'default' ? '超级品牌' : '品牌关注',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    if (isFocused && !brandList.length) {
      getBrandList()
    }
  }, [isFocused])

  const getBrandList = async () => {
    let result: any = {}

    const params = {
      pageNo: pageNoRef.current,
      pageSize
    }

    try {
      if (pageType === 'default') {
        result = await apiBrandList(params)
      } else {
        result = await apiGetAttention(params)
      }

      setNetWorkErr(false)

      setComplete(true)

      const totalPage = Math.ceil(result.count / pageSize)

      hasMoreRef.current = pageNoRef.current < totalPage

      console.log(result, '品牌列表')

      setBrandList([...brandList, ...result.list])
    } catch (error) {
      setNetWorkErr(true)
    }
  }

  /**
   * 关注/取消关注
   */
  const focusBrandShop = (brandInfo: any) => {
    const { brand_id, is_focus } = brandInfo

    apiAttentionBrand({
      brand_id,
      type: is_focus ? 0 : 1
    }).then((res: any) => {
      console.log('关注/取消关注', res)
      const params = {
        pageNo: 1,
        pageSize: pageNoRef.current * pageSize
      }

      if (pageType === 'default') {
        apiBrandList(params).then((res: any) => {
          setBrandList(JSON.parse(JSON.stringify(res.list)))
        }).catch((err: any) => {
          Toast.show(err.message, { position: 0 })
        })
      } else {
        brandList.forEach((item: any, index: number) => {
          if (item.brand_id === brand_id) {
            brandList.splice(index, 1)
          }
        })

        setBrandList(JSON.parse(JSON.stringify(brandList)))
      }
    })
  }

  /**
   * 触底加载
   */
  const onReachBottom = (e: any) => {
    if (hasMoreRef.current && checkIsBottom(e)) {
      pageNoRef.current += 1
      getBrandList()
    }
  }

  if (netWorkErr) return <NetWorkErr reload={getBrandList} />

  if (!brandList.length && complete) {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../assets/images/img_empty_brand.png')} style={styles.emptyImg}>
          <Text style={styles.emptyText}>暂无关注的店铺</Text>
        </ImageBackground>
      </View>
    )
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={(e) => onReachBottom(e)}
    >
      {
        brandList && brandList.map((item: any, index: number) => {
          return (
            <BrandCard
              key={`brand-${index}`}
              brandInfo={item}
              focusBrandShop={(brandInfo: any) => focusBrandShop(brandInfo)}
            />
          )
        })
      }
      <LoadMore hasMore={hasMoreRef.current} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyImg: {
    width: pxToDp(380),
    height: pxToDp(360)
  },
  emptyText: {
    fontSize: pxToDp(28),
    color: Colors.lightBlack,
    textAlign: 'center',
    marginTop: pxToDp(298)
  }
})