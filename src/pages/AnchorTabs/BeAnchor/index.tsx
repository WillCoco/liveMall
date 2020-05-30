/**
 * 主播权益
 */
import * as React from 'react'
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native'
import {PrimaryText} from 'react-native-normalization-text'
import {useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'
import NavBar from '../../../components/NavBar'
import {Colors} from '../../../constants/Theme'
import {pad} from '../../../constants/Layout'
import images from '../../../assets/images'
import ButtonRadius from '../../../components/Buttons/ButtonRadius'
import withPage from '../../../components/HOCs/withPage'
import pxToDp from '../../../utils/px2dp'
import BeAnchorRow from './BeAnchorRow'
import {apiBuyAnchor} from'../../../service/api'
import CheckBox from '../../../components/CheckBox'
import {Toast} from '../../../components/Toast'
import formatGoodsPrice from '../../../utils/formatGoodsPrice'
import sandpaySerializeURL from '../../../utils/sandpaySerializeURL'

const BeAnchor = (props: any) =>  {
  const {navigate} = useNavigation()
  const beAnchorPrice = useSelector((state: any) => state?.userData?.userInfo?.liveMoney) // 开通主播的价格
  // const userId = useSelector(state => state?.userData?.userInfo?.userId) || ''
  
  const [checked, setChecked] = React.useState(true) // 勾选框

  const anchorRights = [
    {title: '直播权限', text: '一键直播、简单卖货', source: require('../../../assets/be-anchor-image/bg0.png')},
    {title: '入驻特权', text: '开启个人店铺、上架商品', source: require('../../../assets/be-anchor-image/bg1.png')},
    {title: '专属培训', text: '专业导师 专门指导', source: require('../../../assets/be-anchor-image/bg2.png')},
    {title: '解锁特权', text: '解锁成为经纪人的权益', source: require('../../../assets/be-anchor-image/bg3.png')},
    {title: '更高返佣', text: '扩大返佣人数  提高返佣收益', source: require('../../../assets/be-anchor-image/bg4.png')},
  ]

  /**
   * 开通
   */
  const submit = () => {
    if (!checked) {
      Toast.info('您还未同意服务协议')
      return
    }

    apiBuyAnchor(2).then((res: any) => {

      if (res.code !== 200) {
        Toast.show('创建订单失败')
        return
      }

      const payURL = sandpaySerializeURL(res.data)

      const params = {
        url: payURL,
        orderSn: res.data.orderSn,
        payType: res.data.payType,
      }

      console.log('成为主播', params)

      navigate('PayWebView', params)
    })
      .catch(console.warn)
  }
 
  return (
    <View style={styles.style}>
      <NavBar
        leftTheme="light"
        title="主播权益"
        titleStyle={styles.navTitle}
        style={styles.nav}
      />
      
      <ScrollView 
        style={styles.rightsWrapper}
        showsVerticalScrollIndicator={false}
      >
        {
          anchorRights.map((item, index) => {
            return <BeAnchorRow 
              key={item.title}
              {...item}
            />
          })
        }
        <View style={styles.checkBox}>
          <CheckBox 
            isChecked={checked}
            onPress={() => {setChecked((c) =>  !c)}}
            style={{paddingHorizontal: pad}}
          />
          <PrimaryText>同意<PrimaryText style={{color: Colors.blueColor}} onPress={() => navigate('AnchorEntryAgreement')}>《云闪播主播入驻服务协议》</PrimaryText></PrimaryText>
        </View>
      </ScrollView>
      <View style={styles.beAnchorWrapper}>
        <Image source={images.beAnchorIcon} style={styles.beAnchorIconStyle}/>
        <View>
          <PrimaryText style={styles.price}>云闪播主播套餐¥{formatGoodsPrice(beAnchorPrice)}/年</PrimaryText>
          <ButtonRadius 
            text="立即开通"
            onPress={submit}
          />
        </View>
      </View>
    </View>
  )
};

BeAnchor.defaultProps = {
}

const styles = StyleSheet.create({
  style: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  nav: {
    backgroundColor: Colors.basicColor,
  },
  navTitle: {
    color: '#fff',
  },
  rightsWrapper: {
    flex: 1,
    padding: pad,
    paddingTop: pad * 1.5,
  },
  checkBox: {
    flexDirection: 'row',
    // height: pxToDp(80),
    marginBottom: pad * 4,
  },
  beAnchorWrapper: {
    flexDirection: 'row',
    padding: pad * 1.5,
    paddingBottom: pad * 2,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: Colors.whiteColor,
  },
  beAnchorIconStyle: {
    width: pxToDp(120),
    height: pxToDp(120),
    marginRight: pad * 2,
  },
  price: {
    fontWeight: '600',
    marginBottom: pad,
  }
})

export default withPage(BeAnchor)