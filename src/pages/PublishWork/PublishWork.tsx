import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Colors } from '../../constants/Theme'
import { apiPublishWorks } from '../../service/api'
import { setAddedGoodsList, setMediaList } from '../../actions/works'

import Toast from 'react-native-tiny-toast'

import Form from './Form/Form'
import GoodsList from './GoodsList/GoodsList'
import ImagePicker from './ImagePicker/ImagePicker'
import NetWorkErr from '../../components/NetWorkErr/NetWorkErr'

interface Props {
  dispatch: any;
  addedGoodsList: Array<any>;
  mediaList: Array<any>;
}

function PublishWork(props: Props) {
  const { addedGoodsList, mediaList } = props

  const route: any = useRoute()
  const navigation: any = useNavigation()

  const [title, setTitle] = useState('')
  const [gifUrl, setGifUrl] = useState('')
  const [content, setContent] = useState('')
  const [netWorkErr, setNetWorkErr] = useState(false)
  const [fullPathImageList, setFullPathImageList]: Array<any> = useState([])

  const { type: pageType } = route.params

  navigation.setOptions({
    headerTitle: `发布${pageType === 'video' ? '视频' : '图片'}`,
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false
  })

  useEffect(() => {
    const initWorkData = () => {
      props.dispatch(setAddedGoodsList([]))
      props.dispatch(setMediaList([
        { uri: require('../../assets/order-image/add.png') }
      ]))
    }
    return initWorkData
  }, [])

  /**
   * 发表
   */
  const publish = () => {
    if (!title || !content) {
      Toast.show('标题和内容不能为空', { position: 0 })
      return
    }

    let findGoodsInfoList:
      {
        goodsTitle: any
        goodsPictures: any
        goodsCurPrice: any;
        goodsOriPrice: any;
        goodsId: any
      }[] = []

    addedGoodsList.forEach((item: any, index: number) => {
      findGoodsInfoList[index] = {
        goodsTitle: addedGoodsList[index].goods_name,
        goodsPictures: addedGoodsList[index].original_img,
        goodsCurPrice: addedGoodsList[index].shop_price,
        goodsOriPrice: addedGoodsList[index].market_price,
        goodsId: addedGoodsList[index].goods_id
      }
    })

    const params: any = {
      content,
      filesUrl: fullPathImageList,
      findGoodsInfoList,
      title,
      worksType: pageType === 'video' ? 'VIDEO' : 'PICTURE'
    }

    if (pageType === 'video') {
      params[`worksGifUrl`] = gifUrl
    }

    apiPublishWorks(params).then((res: any) => {
      console.log('发表作品', res)
      setNetWorkErr(false)
      if (res === '请求成功') {
        Toast.showSuccess('已发布')
        props.dispatch(setAddedGoodsList([]))
        props.dispatch(setMediaList([
          { uri: require('../../assets/order-image/add.png') }
        ]))
        setTimeout(() => {
          navigation.goBack()
        }, 1000)
      }
    }).catch((err: any) => {
      console.log('发表作品', err)
      setNetWorkErr(true)
    })
  }

  if (netWorkErr) return <NetWorkErr reload={() => navigation.goBack()} />

  return (
    <View style={styles.container}>
      <Form
        inputTitle={(title: string) => setTitle(title)}
        inputContent={(content: string) => setContent(content)}
      />
      <ImagePicker
        pageType={pageType}
        fullPathImageList={fullPathImageList}
        setGifUrl={(url) => setGifUrl(url)}
        setFullPathImageList={(list: Array<any>) => setFullPathImageList(list) }
      />
      <GoodsList
        publish={publish}
      />
    </View>
  )
}

export default connect(
  (state: any) => state.worksData
)(PublishWork)

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})