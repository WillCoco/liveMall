import React from 'react'
import {
  View,
  Text,
  Image,
  Clipboard,
  StyleSheet,
  PixelRatio,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'
import formatSinglePrice from '../../../utils/formatGoodsPrice'
import { Toast } from '@ant-design/react-native'

const defaultAvatar = require('../../../assets/mine-image/default_avatar.png')
const vipText = require('../../../assets/mine-image/vip_text.png')

interface Props {
  userData: {
    userInfo: any
    isLogin: boolean
  }
  publicData: {
    statusBarHeight: number
  }
}

function Header(props: Props) {
  const navigation: any = useNavigation()
  const {navigate} = useNavigation()
  const { userInfo, isLogin } = props.userData
  const { statusBarHeight } = props.publicData

  const toLogin = () => {
    navigation.push('Login')
  }

  const toCollectGoods = () => {
    if (isLogin) {
      navigation.push('CollectGoods')
    } else {
      toLogin()
    }
  }

  const toMyFocusBrand = () => {
    if (isLogin) {
      navigation.push('Brand', { type: 'focus' })
    } else {
      toLogin()
    }
  }

  const toLikeContent = () => {
    if (isLogin) {
      navigation.push('LikeContent', { type: 'focus' })
    } else {
      toLogin()
    }
  }

  const toCoupon = () => {
    if (isLogin) {
      navigation.push('Coupon')
    } else {
      toLogin()
    }
  }

  const toSetting = () => {
    if (isLogin) {
      navigation.push('Setting')
    } else {
      toLogin()
    }
  }

  const copyInvCode = () => {
    Clipboard.setString(userInfo.inviteCode)
    Toast.success('已复制到剪贴板')
  }

  return (
    <ImageBackground
      resizeMode='stretch'
      source={require('../../../assets/mine-image/header-bgi.png')}
      style={[styles.container, { paddingTop: statusBarHeight }]}
    >
      {/* 顶部右侧操作区域 */}
      <View style={styles.rightOption}>
        <TouchableOpacity onPress={toSetting}>
          <Image source={require('../../../assets/mine-image/icon_setting.png')} style={styles.setIcon} />
        </TouchableOpacity>
      </View>

      {/* 个人信息 */}
      <TouchableWithoutFeedback onPress={() => {
        if (!isLogin) navigate('Login')
      }}>
        <View style={styles.userInfo}>
          {
            isLogin
              ? <Image source={ userInfo.userAvatar ? { uri: userInfo.userAvatar } : defaultAvatar } defaultSource={defaultAvatar} style={styles.avatar} />
              : <Image source={defaultAvatar} style={styles.avatar} />
          }
          <View>
            <Text style={styles.userName}>{isLogin ? userInfo?.nickName : '立即登录'}</Text>
            {
              isLogin && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {
                  userInfo.userLevel && userInfo.userLevel.map((item: any, index: number) => {
                    return (
                      <Text
                        key={`user-${index}`}
                        style={[styles.userLevel, +item >= 1 && styles.userLevelBgc]}
                      >{
                          item === '1'
                            ? '云闪播会员'
                            : item === '2'
                              ? '主播'
                              : item === '3'
                                ? '初级经纪人'
                                : item === '4'
                                  ? '中级经纪人'
                                  : '高级经纪人'
                        }
                      </Text>
                    )
                  })
                }
              </View>
            }
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* 关注、收藏 相关信息 */}
      <View style={styles.otherInfo}>

        <TouchableWithoutFeedback onPress={toCollectGoods}>
          <View style={styles.otherInfoItem}>
            <Text style={styles.count}>{userInfo?.collectionCount || 0}</Text>
            <Text style={styles.text}>商品收藏</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={toMyFocusBrand}>
          <View style={styles.otherInfoItem}>
            <Text style={styles.count}>{userInfo?.storeFollow || 0}</Text>
            <Text style={styles.text}>店铺关注</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={toLikeContent}>
          <View style={styles.otherInfoItem}>
            <Text style={styles.count}>{userInfo?.likeContent || 0}</Text>
            <Text style={styles.text}>喜欢的内容</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={toCoupon}>
          <View style={styles.otherInfoItem}>
            <Text style={styles.count}>{userInfo?.card || 0}</Text>
            <Text style={styles.text}>优惠券</Text>
          </View>
        </TouchableWithoutFeedback>

      </View>

      {/* 会员信息 */}
      <ImageBackground
        source={require('../../../assets/mine-image/vip-card-bgi.png')}
        style={styles.vipCard}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {
            isLogin && <Image
              source={require('../../../assets/mine-image/level.png')}
              style={styles.levelIcon}
            />
          }
          <View style={{ alignSelf: 'center' }}>
            {
              isLogin
              ? <Image source={vipText} style={styles.viptext} resizeMode='contain' />
              : <Text style={[styles.leveltext, styles.vipLevel]}>游客</Text>
            }
            {isLogin && <Text style={styles.invCode} onPress={copyInvCode}>邀请码：{userInfo?.inviteCode}</Text>}
          </View>

        </View>
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <Text style={styles.leveltext}>累计已省:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: pxToDp(24), color: Colors.yellowColor }}>¥</Text>
            <Text style={[styles.leveltext, styles.savePrice]}>{formatSinglePrice(userInfo?.saveMoney || 0)}</Text>
          </View>
        </View>
      </ImageBackground>
    </ImageBackground>
  )
}

export default connect(
  (state: any) => state
)(Header)

const styles = StyleSheet.create({
  container: {
    height: pxToDp(550),
    borderBottomLeftRadius: pxToDp(52),
    borderBottomRightRadius: pxToDp(52),
    overflow: 'hidden'
  },
  rightOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: pxToDp(30)
  },
  liveBgi: {
    width: pxToDp(160),
    height: pxToDp(58),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: pxToDp(29)
  },
  setIcon: {
    width: pxToDp(40),
    height: pxToDp(40),
    marginLeft: pxToDp(30)
  },
  liveText: {
    marginRight: pxToDp(5),
    color: Colors.basicColor,
    fontSize: pxToDp(24)
  },
  userInfo: {
    paddingLeft: pxToDp(30),
    marginTop: pxToDp(10),
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: pxToDp(130),
    height: pxToDp(130),
    borderRadius: pxToDp(65),
    marginRight: pxToDp(20)
  },
  userName: {
    fontSize: pxToDp(36),
    fontWeight: '600',
    color: Colors.whiteColor,
    marginBottom: pxToDp(10)
  },
  userLevel: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.whiteColor,
    paddingLeft: pxToDp(14),
    paddingRight: pxToDp(14),
    height: pxToDp(32),
    lineHeight: pxToDp(32),
    fontSize: pxToDp(20),
    color: Colors.whiteColor,
    borderRadius: pxToDp(16),
    marginRight: pxToDp(10)
  },
  userLevelBgc: {
    backgroundColor: Colors.yellowColor,
    overflow: 'hidden'
  },
  otherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  otherInfoItem: {
    alignItems: 'center',
    marginTop: pxToDp(36)
  },
  count: {
    color: Colors.whiteColor,
    fontSize: pxToDp(34),
    fontWeight: '600',
    lineHeight: pxToDp(48),
    marginBottom: pxToDp(4)
  },
  text: {
    color: Colors.whiteColor,
    fontSize: pxToDp(26)
  },
  vipCard: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: pxToDp(692),
    height: pxToDp(120),
    marginLeft: pxToDp(-346),
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
    flexDirection: 'row'
  },
  levelIcon: {
    width: pxToDp(48),
    height: pxToDp(56),
  },
  leveltext: {
    color: Colors.yellowColor
  },
  vipLevel: {
    marginLeft: pxToDp(30),
    fontSize: pxToDp(40),
    fontWeight: '600'
  },
  savePrice: {
    fontSize: pxToDp(32),
    fontWeight: '600',
    marginLeft: pxToDp(5)
  },
  invCode: {
    marginLeft: pxToDp(30),
    color: Colors.yellowColor
  },
  viptext: {
    width: pxToDp(200),
    marginLeft: pxToDp(30)
  }
})