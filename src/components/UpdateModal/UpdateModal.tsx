import React from 'react'
import {
  View,
  Text,
  Modal,
  Linking,
  Platform,
  Dimensions,
  PixelRatio,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'


interface Props {
  showUpdateModal: boolean,
  version: string,
  updateContent: string,
  forceUpdate: number,
  updatePath: string,
  hideUpdateModal(): void
}

export default function UpdateModal(props: Props) {
  const {
    showUpdateModal,
    version,
    updateContent,
    forceUpdate,
    updatePath,
    hideUpdateModal
  } = props

  const downloadNewVersion = () => {
    if (Platform.OS === 'ios') {
      // Linking.openURL('itms-apps://')
      Linking.openURL('https://download.yunshanbo.cn')
    } else {
      Linking.openURL(updatePath)
    }
  }

  return (
    <Modal
      visible={showUpdateModal}
      transparent={true}
      animationType='fade'
      onRequestClose={() => hideUpdateModal()}
    >
      <View style={styles.updateModalContainer}>
        <ImageBackground source={require('../../assets/mine-image/update_bgi.png')} style={styles.updateBgi}>
          <Text style={styles.updateTitle}>发现新版本{version}</Text>
          <ScrollView>
          <Text style={styles.updateContent}>{updateContent}</Text>
          </ScrollView>
          <View style={styles.updateBtnGroup}>
            {
              !forceUpdate && <TouchableOpacity style={[styles.updateBtn, styles.cancelBtn]} onPress={() => hideUpdateModal()}>
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
    alignItems: 'center',
    padding: pxToDp(30),
    paddingBottom: pxToDp(50),
    paddingTop: pxToDp(380),
    borderRadius: pxToDp(20),
    overflow: 'hidden'
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