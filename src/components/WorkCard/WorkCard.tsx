import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'

import defaultAvatar from '../../assets/mine-image/default_avatar.png'

export default function WorkCard(props: { workInfo: any }) {
  const { workInfo } = props
  const navigation: any = useNavigation()

  const toFoundInfo = () => {
    const params = {
      id: workInfo.worksId,
      width: workInfo.imageWidth,
      height: workInfo.imageHeight
    }

    navigation.navigate('FoundInfo', params)
  }

  return (
    <View style={{
      width: workInfo.width,
      marginBottom: pxToDp(10)
      // height: workInfo.height,
      // position: 'absolute',
      // top: workInfo.top,
      // left: workInfo.left,
      // overflow: 'hidden'
    }}>
      <TouchableWithoutFeedback onPress={toFoundInfo}>
        <ImageBackground
          defaultSource={require('../../assets/mine-image/logo.png')}
          source={{
            uri: workInfo.worksType === 'PICTURE'
              ? workInfo.worksMoreInfo.worksUrl
              : workInfo.worksMoreInfo.videoCover
          }}
          style={{
            width: '100%',
            height: workInfo.height - pxToDp(140)
          }}
        >
          {
            workInfo.worksType === 'VIDEO' && <Image source={require('../../assets/works-image/play_small.png')} style={styles.playIcon} />
          }
        </ImageBackground>
      </TouchableWithoutFeedback>
      <View style={styles.workContent}>
        <Text style={styles.workName} numberOfLines={2}>{workInfo.worksTitle}</Text>
        <View style={styles.anchorInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={ workInfo.userIcon ? { uri: workInfo.userIcon } : defaultAvatar } style={styles.anchorAvatar} />
            <Text style={styles.anchorName}>{workInfo.userName}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('../../assets/works-image/eye.png')} style={styles.eyeIcon} />
            <Text style={styles.watchCount}>{workInfo.watchCount}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  workContent: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    padding: pxToDp(10),
    justifyContent: 'space-between'
  },
  workName: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    lineHeight: pxToDp(36),
    fontWeight: '500',
    marginBottom: pxToDp(10)
  },
  anchorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  anchorAvatar: {
    width: pxToDp(36),
    height: pxToDp(36),
    borderRadius: pxToDp(18)
  },
  anchorName: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(33),
    color: Colors.darkGrey,
    marginLeft: pxToDp(10)
  },
  eyeIcon: {
    width: pxToDp(25),
    height: pxToDp(18)
  },
  watchCount: {
    fontSize: pxToDp(24),
    marginLeft: pxToDp(10),
    color: Colors.darkGrey
  },
  playIcon: {
    position: 'absolute',
    top: pxToDp(20),
    right: pxToDp(20),
    width: pxToDp(36),
    height: pxToDp(36)
  }
})