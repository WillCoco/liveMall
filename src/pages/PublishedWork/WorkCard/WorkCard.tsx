import React from 'react'
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import moment from 'moment'

export default function WorkCard(props: { workAction?: any; workInfo?: any }) {
  const { workInfo } = props

  const navigation: any = useNavigation()

  const toFoundInfo = () => {
    if (workInfo.auditStatus !== 1) return

    const params = {
      id: workInfo.worksId,
      width: workInfo.worksMoreInfo.imageWidth,
      height: workInfo.worksMoreInfo.imageHeight
    }

    navigation.navigate('FoundInfo', params)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toFoundInfo}>
        <ImageBackground source={{ uri: workInfo.worksType === 'VIDEO' ? workInfo.worksMoreInfo.videoCover : workInfo.worksMoreInfo.worksUrl }} style={styles.workImg} resizeMode='cover'>
          {
            workInfo.worksType === 'VIDEO' && <Image source={require('../../../assets/works-image/play.png')} style={styles.playIcon} />
          }
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.workInfo}>
        <View>
          <Text style={styles.title}>{workInfo.worksTitle}</Text>

          <View style={styles.workCount}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../../assets/works-image/eye.png')} style={styles.eyeIcon} />
              <Text style={{ fontSize: pxToDp(22), color: Colors.lightBlack, marginLeft: pxToDp(5) }}>{workInfo.watchCount}</Text>
              <Image source={require('../../../assets/works-image/heart.png')} style={styles.heartIcon} />
              <Text style={{ fontSize: pxToDp(22), color: Colors.lightBlack, marginLeft: pxToDp(5) }}>{workInfo.followCount}</Text>
            </View>
            <Text style={styles.createTime}>{moment(workInfo.createTime).format('YYYY.MM.DD')}</Text>
          </View>

        </View>
        <View style={styles.workFooter}>
          <Text style={{
            fontSize: pxToDp(24),
            color: workInfo.auditStatus === 0 ? Colors.basicColor : workInfo.auditStatus === 1 ? '#347CFF' : Colors.yellowColor
          }}>{workInfo.auditStatus === 0 ? '审核中' : workInfo.auditStatus === 1 ? '已上架' : '已下架'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.btn, styles.delBtn]} onPress={() => props.workAction(workInfo.worksId, 4)}>删除</Text>
            {
              !!workInfo.auditStatus && <Text style={[styles.btn]} onPress={() => props.workAction(workInfo.worksId, workInfo.auditStatus === 1 ? 2 : 1)}>{workInfo.auditStatus === 1 ? '下架' : '上架'}</Text>
            }
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: pxToDp(10),
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    marginBottom: pxToDp(10)
  },
  workImg: {
    width: pxToDp(220),
    height: pxToDp(220),
    borderRadius: pxToDp(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  workInfo: {
    marginLeft: pxToDp(14),
    justifyContent: 'space-between',
    paddingBottom: pxToDp(10)
  },
  title: {
    fontSize: pxToDp(28),
    fontWeight: '500',
    lineHeight: pxToDp(36),
    color: Colors.darkBlack,
    marginBottom: pxToDp(16)
  },
  playIcon: {
    width: pxToDp(50),
    height: pxToDp(50)
  },
  workCount: {
    width: pxToDp(470),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  eyeIcon: {
    width: pxToDp(36),
    height: pxToDp(36)
  },
  heartIcon: {
    width: pxToDp(30),
    height: pxToDp(28),
    marginLeft: pxToDp(15)
  },
  createTime: {
    fontSize: pxToDp(24),
    color: Colors.darkGrey
  },
  workFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btn: {
    width: pxToDp(120),
    height: pxToDp(44),
    lineHeight: pxToDp(44),
    borderRadius: pxToDp(22),
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: Colors.basicColor,
    color: Colors.whiteColor,
    fontSize: pxToDp(24)
  },
  delBtn: {
    marginRight: pxToDp(20),
    backgroundColor: '#ffc7c2',
    color: Colors.basicColor
  }
})