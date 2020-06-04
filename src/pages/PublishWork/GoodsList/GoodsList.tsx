import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import GoodsCard from '../../../components/WorksGoodsCard/WorksGoodsCard'

interface Props {
  addedGoodsList: Array<any>;
  publish(): void;
}

function GoodsList(props: Props) {
  const navigation: any = useNavigation()
  const { addedGoodsList } = props

  return (
    <View style={styles.container}>
      <ScrollView style={styles.goodsList}>
        {
          addedGoodsList && addedGoodsList.map((item: any, index: number) => {
            return (
              <GoodsCard
                key={`goods-${index}`}
                goodsInfo={item}
                type='del'
              />
            )
          })
        }

        <View style={styles.btnGroup}>
          <TouchableOpacity style={[styles.btn, styles.pinkBtn]} onPress={() => navigation.navigate('WorksGoodsList')}>
            <Text style={{ fontSize: pxToDp(30), color: Colors.basicColor }}>添加商品</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={props.publish}>
            <Text style={{ fontSize: pxToDp(30), color: Colors.whiteColor }}>确认发布</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default connect(
  (state: any) => state.worksData
)(GoodsList)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  btnGroup: {
    padding: pxToDp(30)
  },
  btn: {
    alignSelf: 'center',
    width: pxToDp(670),
    height: pxToDp(80),
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pxToDp(40)
  },
  pinkBtn: {
    backgroundColor: Colors.pinkColor,
    marginBottom: pxToDp(30)
  },
  goodsList: {
    flex: 1
  }
})