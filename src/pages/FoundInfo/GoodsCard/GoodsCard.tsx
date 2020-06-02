import React from 'react'
import { View, Text, StyleSheet, Image, PixelRatio, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import formatSinglePrice from '../../../utils/formatGoodsPrice'

interface Props {
  goodsInfo: any;
  hiddenGoods(): void;
}

export default function GoodsCard(props: Props) {
  const { goodsInfo } = props
  const navigation: any = useNavigation()

  const toShare = () => {

  }

  const toGoodsInfo = (id: number) => {
    navigation.navigate('GoodsInfo', { id })
    props.hiddenGoods()
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: goodsInfo.goodsPictures }} style={styles.goodsImg} />
      <View style={styles.goodsInfo}>
        <Text style={styles.goodsName} numberOfLines={2}>{goodsInfo.goodsTitle}</Text>

        <View style={{ flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={toShare}>
            <View style={styles.shareCard}>
              <Text style={styles.shareText}>分享</Text>
              <Text style={styles.sharePrice}>¥{formatSinglePrice(goodsInfo.shareEarn)}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.goodsAction}>
          <View style={styles.goodsPrice}>
            <Text style={styles.rmbIcon}>¥</Text>
            <Text style={styles.salePrice}>{formatSinglePrice(+goodsInfo.goodsCurPrice)}</Text>
            <Text style={styles.originalPrice}>¥{formatSinglePrice(+goodsInfo.goodsOriPrice)}</Text>
          </View>

          <TouchableOpacity style={styles.buyBtn} onPress={() => toGoodsInfo(+goodsInfo.goodsId)}>
            <Image source={require('../../../assets/works-image/btn_bgi.png')} style={styles.buyBtnBgi} />
            <Text style={{
              fontSize: pxToDp(28),
              fontWeight: '500',
              color: Colors.whiteColor
            }}>立即购买</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: pxToDp(20),
    paddingBottom: pxToDp(50),
    flexDirection: 'row'
  },
  goodsImg: {
    width: pxToDp(220),
    height: pxToDp(220),
    borderRadius: pxToDp(16),
    paddingTop: pxToDp(15),
    paddingBottom: pxToDp(15)
  },
  goodsInfo: {
    paddingTop: pxToDp(10),
    paddingLeft: pxToDp(14),
    flex: 1
  },
  goodsName: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack,
    fontWeight: '500',
    lineHeight: pxToDp(36),
    marginBottom: pxToDp(20)
  },
  shareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pxToDp(40),
    borderColor: Colors.basicColor,
    borderWidth: 1 / PixelRatio.get(),
    borderRadius: pxToDp(10),
    overflow: 'hidden'
  },
  shareText: {
    backgroundColor: Colors.basicColor,
    height: '100%',
    paddingTop: pxToDp(5),
    paddingBottom: pxToDp(5),
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    fontSize: pxToDp(24),
    color: Colors.whiteColor
  },
  sharePrice: {
    paddingTop: pxToDp(5),
    paddingBottom: pxToDp(5),
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    color: Colors.basicColor
  },
  buyBtn: {
    width: pxToDp(170),
    height: pxToDp(70),
    justifyContent: 'center',
    alignItems: 'center'
  },
  buyBtnBgi: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  goodsAction: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  goodsPrice: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  rmbIcon: {
    fontSize: pxToDp(24),
    color: Colors.basicColor
  },
  salePrice: {
    fontSize: pxToDp(34),
    color: Colors.basicColor
  },
  originalPrice: {
    fontSize: pxToDp(24),
    color: Colors.lightGrey,
    textDecorationLine: 'line-through',
    marginLeft: pxToDp(15)
  }
})