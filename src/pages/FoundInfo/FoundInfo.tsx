import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { apiGetWorksDetailInfo, apiGetMoreComment, apiFollowWorks, apiGetMoreReply } from '../../service/api'

import Toast from 'react-native-tiny-toast'
import pxToDp from '../../utils/px2dp'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/Theme'

import VideoPlayer from 'react-native-video-controls'

import Header from './Header/Header'
import Swiper from './Swiper/Swiper'
import Footer from './Footer/Footer'
import Comment from './Comment/Comment'
import WorksCard from './WorksCard/WorksCard'
import GoodsCard from './GoodsCard/GoodsCard'
import ActionSheet from '../../components/ActionSheet/ActionSheet'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

const commentPageSize = 10

function FoundInfo(props: { userData: { userInfo?: any; isLogin?: boolean } }) {
  const { isLogin } = props.userData
  
  const navigation: any = useNavigation()
  const route: any = useRoute()
  
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [navOpacity, setNavOpacity] = useState(0)
  const [videoHeight, setVideoHeight] = useState(0)
  const [showGoods, setShowGoods] = useState(false)
  const [inputFocus, setInputFocus] = useState(false)
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [commentCount, setCommentCount] = useState(0)
  let [commentPageNo, setCommentPageNo] = useState(1)
  const [worksInfo, setWorksInfo]: any = useState({})
  const [swiperList, setSwiperList]: Array<any> = useState([])
  const [commentList, setCommentList]: Array<any> = useState([])
  const [commentInfo, setCommentInfo]: Array<any> = useState({})

  const { id: worksId, width, height } = route.params

  navigation.setOptions({
    headerShown: false
  })

  useEffect(() => {
    getWorksInfo(true)
  }, [])

  /**
   * 获取作品信息
   */
  const getWorksInfo = (isInit: boolean) => {
    let params: any = {
      worksId
    }

    if (isLogin) {
      params[`userId`] = props.userData.userInfo.userId
    }

    apiGetWorksDetailInfo(params).then((res: any) => {
      console.log('发现详情', res)
      // setNetWorkErr(false)
      if (!res) {
        Toast.show('作品不存在', {
          position: 0
        })
        setTimeout(() => {
          navigation.goBack()
        }, 1000)
        return
      }

      initShowReplyList(res.commentInfoList, isInit)
      setCommentCount(res.commentCount)
      setSwiperList(res.worksMoreInfoList)
      setWorksInfo(res)
      if (res.worksType === 'VIDEO') {
        setVideoUrl(res.worksMoreInfoList[0].worksUrl)
        const deviceWidth = Dimensions.get('window').width
        setVideoHeight(deviceWidth / (width / height))
      }

      setIsLoaded(true)
    }).catch((err: any) => {
      console.log('作品详情', err)
      // setNetWorkErr(true)
      setTimeout(() => {
        navigation.goBack()
      }, 1000)
    })
  }

  /**
   * 监听页面滚动
   * @param e 事件参数
   */
  const scrollPage = (e: any) => {
    const scrollY = e.nativeEvent.contentOffset.y

    if ((scrollY / pxToDp(460)) <= 1) {
      setNavOpacity(scrollY / pxToDp(460))
    }
  }

  /**
   * 展开 or 收起 评论
   */
  const toggleCommentCount = () => {
    if (commentList.length < commentCount) {  // 展开更多
      getMoreComment()
    } else {  // 收起评论
      setCommentList(commentList.slice(0, 5))
      setCommentPageNo(1)
    }
  }

  /**
   * 获取更多评论
   */
  const getMoreComment = () => {
    const params: any = {
      page: commentPageNo,
      pageSize: commentPageSize,
      worksId: worksInfo.worksId
    }

    if (isLogin) params[`userId`] = props.userData.userInfo.userId

    apiGetMoreComment(params).then((res: any) => {
      console.log('获取更多评论', res)
      if (commentPageNo === 1) {
        initShowReplyList(res, false)
      } else {
        initShowReplyList([...commentList, ...res], false)
      }

      setCommentPageNo(++commentPageNo)
    })
  }

  /**
   * 关注 or 取消关注 作品
   */
  const followWorks = () => {
    const { worksId, isFollow } = worksInfo

    const params = {
      followOperate: isFollow ? 0 : 1,
      worksId
    }

    if (!isLogin) {
      navigation.navigate('Login')
      return
    }

    apiFollowWorks(params).then((res: { isFollow: any }) => {
      console.log('关注or取消关注作品', res)

      worksInfo.isFollow = res.isFollow
      worksInfo.followCount
        = res.isFollow
          ? worksInfo.followCount + 1
          : worksInfo.followCount - 1

      setWorksInfo(JSON.parse(JSON.stringify(worksInfo)))
    })
  }

  /**
   * 初始化展示的回复数据（前两条）
   */
  const initShowReplyList = (list: any, isInit: boolean) => {
    list.forEach((item: any) => {
      if (isInit) {
        if (item.replyInfoList.length > 2) {
          item.showReplyInfoList = item.replyInfoList.slice(0, 2)
        } else {
          item.showReplyInfoList = item.replyInfoList
        }

        item.totalReplyCount = item.unexpandedRepayCount + item.replyInfoList.length
        item.replyPageNo = 1
      } else {
        commentList.forEach((_item: any) => {
          if (_item.commentId === item.commentId && _item.showReplyInfoList.length > 2) {
            item.showReplyInfoList = _item.showReplyInfoList
            item.replyPageNo = _item.replyPageNo
          } else {
            item.showReplyInfoList = item.replyInfoList.slice(0, 2)
            item.replyPageNo = 1
          }
        })
        item.totalReplyCount = item.unexpandedRepayCount + 2
      }
    })

    setCommentList(list)
  }

  /**
   * 展开 or 收起 回复
   */
  const toggleReplyCount = (id: string) => {
    commentList.forEach((item: any) => {
      if (item.commentId === id) {
        if (item.totalReplyCount === (item.showReplyInfoList && item.showReplyInfoList.length)) {  // 收起回复
          packUpReply(id)
        } else {  // 获取更多回复
          getMoreReply(id, item.replyPageNo)
        }
      }
    })
  }

  /**
   * 获取更多回复
   */
  const getMoreReply = (id: string, pageNo: number) => {
    const params = {
      page: pageNo,
      pageSize: 10,
      commentId: id,
    }

    apiGetMoreReply(params).then((res: any) => {
      console.log('获取更多回复', res)
      commentList.forEach((item: any) => {
        if (item.commentId === id) {
          if (pageNo === 1) {
            item.showReplyInfoList = res
          } else {
            item.showReplyInfoList = [...item.showReplyInfoList, ...res]
          }
        }

        item.replyPageNo = ++item.replyPageNo
      })

      setCommentList(JSON.parse(JSON.stringify(commentList)))
    })
  }

  /**
   * 收起回复
   */
  const packUpReply = (id: string) => {
    commentList.forEach((item: any) => {
      if (item.commentId === id) {
        item.showReplyInfoList = item.showReplyInfoList.slice(0, 2)
        item.replyPageNo = 1
      }
    })

    setCommentList(JSON.parse(JSON.stringify(commentList)))
  }

  /**
   * 展示商品窗口
   */
  const showGoodsActionSheet = () => {
    if (!isLogin) {
      navigation.navigate('Login')
      return
    }

    if (!!worksInfo.worksRelationGoods.length) {
      setShowGoods(true)
      return
    }
    Toast.show('没有相关商品', {
      position: 0
    })
  }

  /**
   * 隐藏商品窗口
   */
  const hiddenGoodsActionSheet = () => {
    setShowGoods(false)
  }

  /**
   * 更新评论列表
   */
  const updateCommentList = () => {
    setCommentPageNo(1)

    commentList.forEach((item: { replyPageNo: number }) => {
      item.replyPageNo = 1
    })

    getWorksInfo(false)
  }

  /**
   * 回复评论
   */
  const focusReply = (commentInfo: any) => {
    if (isLogin) {
      setInputFocus(true)
      setCommentInfo(commentInfo)
    }
  }

  /**
   * 评论点赞
   */
  const giveLaud = (commentInfo: any) => {
    commentList.forEach((item: any) => {
      if (item.commentId === commentInfo.commentId) {
        item.getLaudCount = item.isLike ? item.getLaudCount - 1 : item.getLaudCount + 1
        item.isLike = !item.isLike
      }
    })

    setCommentList(JSON.parse(JSON.stringify(commentList)))
  }

  // if (netWorkErr) return <NetWorkErr reload={() => getWorksInfo(false)} />

  if (!isLoaded) return <></>

  return (
    <View style={styles.container}>
      <Header opacity={navOpacity} />

      <ScrollView
        onScroll={(e) => scrollPage(e)}
        scrollEventThrottle={200}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {
          worksInfo.worksType === 'PICTURE'
            ? <Swiper swiperList={swiperList} />
            : <VideoPlayer
              source={{ uri: `${videoUrl}` }}
              disableFullscreen
              disableBack
              disableVolume
              style={{
                width: Dimensions.get('window').width,
                height: videoHeight
              }}
            />
        }

        <WorksCard worksInfo={worksInfo} />
        <Comment
          isLogin={isLogin}
          commentInfoList={commentList}
          commentCount={commentCount}
          toggleCommentCount={toggleCommentCount}
          toggleReplyCount={(id: string) => toggleReplyCount(id)}
          toReply={(commentInfo: any) => focusReply(commentInfo)}
          giveLaud={(commentInfo: any) => giveLaud(commentInfo)}
        />
      </ScrollView>

      <Footer
        isLogin={isLogin}
        worksInfo={worksInfo}
        inputFocus={inputFocus}
        commentInfo={commentInfo}
        followWorks={followWorks}
        showGoodsActionSheet={showGoodsActionSheet}
        updateCommentList={updateCommentList}
        inputBlur={() => {
          setInputFocus(false)
          setCommentInfo({})
        }}
      />

      <ActionSheet
        isShow={showGoods}
      >
        <TouchableOpacity style={styles.closeIcon} onPress={() => setShowGoods(false)}>
          <Ionicons
            size={25}
            name='ios-close-circle-outline'
            color={Colors.darkGrey}
          />
        </TouchableOpacity>
        {
          worksInfo.worksRelationGoods && worksInfo.worksRelationGoods.map((item: any, index: number) => {
            return (
              <GoodsCard
                key={`goods-${index}`}
                goodsInfo={item}
                hiddenGoods={hiddenGoodsActionSheet}
              />
            )
          })
        }
      </ActionSheet>
    </View>
  )
}

export default connect(
  (state: any) => state
)(FoundInfo)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  closeIcon: {
    alignItems: 'flex-end',
    padding: pxToDp(20)
  }
})