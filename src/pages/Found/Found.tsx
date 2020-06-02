import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { connect } from 'react-redux'
import { apiGetWorks } from '../../service/api'

import pxToDp from '../../utils/px2dp'
import waterFall from '../../utils/waterFall'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/Theme'
import checkIsBottom from '../../utils/checkIsBottom'

import WorkCard from '../../components/WorkCard/WorkCard'
import LoadMore from '../../components/LoadMore/LoadMore'

const pageSize = 20
const deviceHeight = Dimensions.get('window').height

function Found(props: { isLogin: boolean }) {
  const { isLogin } = props

  const pageNoRef = useRef(1)
  const hasMoreRef = useRef(true)

  const navigation: any = useNavigation()
  const isFocused: boolean = useIsFocused()

  const [maxHeight, setMaxHeight] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showMask, setShowMask] = useState(false)
  const [workList, setWorkList]: Array<any> = useState([])

  useEffect(() => {
    getFoundList(false)
  }, [])

  useEffect(() => {
    if (!isFocused) setShowMask(false)
  }, [isFocused])

  /**
   * 加载发现数据
   * @param isPullDown 是否是下拉刷新
   */
  const getFoundList = async (isPullDown: boolean) => {
    const params = {
      page: pageNoRef.current,
      pageSize: pageSize,
      sort: 0
    }

    apiGetWorks(params).then((res: any) => {
      console.log('发现数据', res)
      setLoading(false)
      if (!res.worksInfoList) return

      res.worksInfoList.forEach((item: any) => {
        item.imageWidth = item.worksMoreInfo.imageWidth
        item.imageHeight = item.worksMoreInfo.imageHeight
      })

      let tempList = [...workList, ...waterFall(res.worksInfoList).items]
      let maxH = waterFall(tempList).maxHeight

      const totalPage = Math.ceil(res.totalCount / pageSize)
      hasMoreRef.current = pageNoRef.current < totalPage
      setWorkList(isPullDown ? waterFall(res.worksInfoList).items : tempList)
      setMaxHeight(isPullDown ? waterFall(res.worksInfoList).maxHeight : maxH)
    }).catch((err: any) => {
      console.log('发现数据', err)
    })
  }
  /**
   * 下拉刷新
   */
  const onPullDownRefresh = () => {
    pageNoRef.current = 1
    getFoundList(true)
  }

  /**
   * 触底加载
   */
  const onReachBottom = (e: any) => {
    if (hasMoreRef.current && checkIsBottom(e)) {
      pageNoRef.current += 1
      getFoundList(false)
    }
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => onReachBottom(e)}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onPullDownRefresh}
          />
        }
        style={{ height: deviceHeight }}
      >
        <View style={{ height: maxHeight }}>
          {
            workList && workList.map((item: any, index: number) => {
              return (
                <WorkCard key={`work-${index}`} workInfo={item} />
              )
            })
          }
        </View>

        <LoadMore hasMore={hasMoreRef.current} />
      </ScrollView>

      <View style={styles.addContainer}>
        {
          showMask && <TouchableWithoutFeedback
            onPress={() => navigation.push('PublishWork', { type: 'video' })}
          >
            <Image source={require('../../assets/works-image/video.png')} style={styles.mediaIcon} />
          </TouchableWithoutFeedback>
        }

        {
          showMask && <TouchableWithoutFeedback
            onPress={() => navigation.push('PublishWork', { type: 'photo' })}
          >
            <Image source={require('../../assets/works-image/photo.png')} style={styles.mediaIcon} />
          </TouchableWithoutFeedback>
        }

        {
          isLogin && <TouchableWithoutFeedback onPress={() => setShowMask(showMask ? false : true)}>
            <View style={[styles.icon]}>
              <Ionicons name='ios-add' size={40} color={Colors.whiteColor} style={{ lineHeight: pxToDp(100) }} />
            </View>
          </TouchableWithoutFeedback>
        }
      </View>

      {
        showMask && <TouchableOpacity style={styles.mask} onPress={() => setShowMask(false)} />
      }
    </>
  )
}

export default connect(
  (state: any) => state.userData
)(Found)

const styles = StyleSheet.create({
  addContainer: {
    position: 'absolute',
    bottom: 120,
    right: 10,
    zIndex: 999
  },
  icon: {
    width: pxToDp(100),
    height: pxToDp(100),
    borderRadius: pxToDp(50),
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  mediaIcon: {
    width: pxToDp(100),
    height: pxToDp(100),
    marginBottom: pxToDp(40)
  },
  flatList: {
    padding: pxToDp(10)
  }
})