import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  Platform,
  StyleSheet,
  PixelRatio,
  Dimensions,
  TouchableWithoutFeedback,
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import * as Linking from 'expo-linking'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import { Toast } from '../../../components/Toast'

interface Props {
  version: string;
  hasNewVer: number;
  updatePath: string;
  forceUpdate: number;
  updateContent: string;
}

export default function Form(props: Props) {
  const { hasNewVer, version, forceUpdate, updateContent, updatePath } = props

  const navigation: any = useNavigation()
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  /**
   * 检查更新
   */
  const checkVersion = () => {
    if (hasNewVer) {
      checkPlatform()
      return
    }

    Toast.success('当前已经是最新版本')
  }

  /**
   * 不同平台的下载逻辑
   */
  const checkPlatform = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('itms-apps://')
    } else {
      setShowUpdateModal(true)
    }
  }

  /**
   * 立即更新
   */
  const downloadNewVersion = () => {
    Linking.openURL('https://baidu.com')
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => navigation.push('AgreementWebView', {url: 'userAgreement', title: '云闪播用户协议'})}>
        <View style={styles.formItem}>
          <Text style={styles.title}>云闪播用户协议与隐私政策</Text>
          <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigation.push('AgreementWebView', {url: 'livePlatformStandard', title: '云闪播直播平台管理规范'})}>
        <View style={styles.formItem}>
          <Text style={styles.title}>云闪播直播平台管理规范</Text>
          <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigation.push('AgreementWebView', {url: 'anchorEntry', title: '云闪播主播入驻服务协议'})}>
        <View style={styles.formItem}>
          <Text style={styles.title}>云闪播主播入驻服务协议</Text>
          <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={checkVersion}>
        <View style={styles.formItem}>
          <Text style={styles.title}>检查更新</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!!hasNewVer && <Text style={styles.dot} />}
            <Ionicons size={20} name='ios-arrow-forward' color={Colors.darkGrey} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Modal
        visible={showUpdateModal}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setShowUpdateModal(false)}
      >
        <View style={styles.updateModalContainer}>
          <ImageBackground source={require('../../../assets/mine-image/update_bgi.png')} style={styles.updateBgi}>
            <Text style={styles.updateTitle}>发现新版本{version}</Text>
            <Text style={styles.updateContent}>{updateContent}</Text>
            <View style={styles.updateBtnGroup}>
              {
                !forceUpdate && <TouchableOpacity style={[styles.updateBtn, styles.cancelBtn]} onPress={() => setShowUpdateModal(false)}>
                  <Text style={[styles.btnText, styles.cancelBtnText]}>取消</Text>
                </TouchableOpacity>
              }
              <TouchableOpacity style={styles.updateBtn} onPress={downloadNewVersion}>
                <Text style={styles.btnText}>立即更新</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </Modal>
    </View>
  )
}

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    backgroundColor: Colors.whiteColor,
    marginTop: pxToDp(10)
  },
  formItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: pxToDp(100),
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1 / PixelRatio.get()
  },
  title: {
    fontSize: pxToDp(30),
    color: Colors.darkBlack,
    fontWeight: '500'
  },
  updateModalContainer: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center'
  },
  updateBgi: {
    width: pxToDp(620),
    height: pxToDp(630),
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: pxToDp(50)
  },
  updateTitle: {
    fontSize: pxToDp(36),
    color: Colors.darkBlack,
    lineHeight: pxToDp(60)
  },
  updateContent: {
    fontSize: pxToDp(26),
    color: Colors.darkGrey,
    lineHeight: pxToDp(60),
    marginBottom: pxToDp(86)
  },
  updateBtnGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  updateBtn: {
    width: pxToDp(260),
    height: pxToDp(68),
    borderRadius: pxToDp(34),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.basicColor
  },
  cancelBtn: {
    borderWidth: pxToDp(1),
    borderColor: Colors.darkGrey,
    backgroundColor: Colors.whiteColor
  },
  btnText: {
    fontSize: pxToDp(24),
    color: Colors.whiteColor
  },
  cancelBtnText: {
    color: Colors.darkGrey
  },
  dot: {
    width: pxToDp(20),
    height: pxToDp(20),
    backgroundColor: Colors.basicColor,
    margin: pxToDp(30),
    borderRadius: pxToDp(10),
    overflow: 'hidden'
  }
})