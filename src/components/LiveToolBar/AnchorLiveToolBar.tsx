/**
 * 直播消息工具栏目
 */
import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import {scale, PrimaryText, SmallText} from 'react-native-normalization-text';
import {vw} from '../../utils/metric'
import {Colors} from '../../constants/Theme';
import { pad, radio } from '../../constants/Layout';
import images from '../../assets/images';

export type msgList = any[] | undefined;

interface LiveToolBarProps {
  style?: StyleProp<any>,
  inputPlaceholder?: string,
  inputStyle?: StyleProp<any>,
  onPressShopBag: () => any,
  onPressBubble: () => any,
  onPressShare: () => any,
  // onPressFaceBeauty: () => any,
  // onPressWhiten: () => any,
  // onPressRedden: () => any,
  onPressFace: () => any,
  onPressFilter: () => any,
  onPressLoginIm?: (v: any) => any,
  showLogin: boolean, // 是否显示登录
}

const LiveToolBar = (props: LiveToolBarProps) : any =>  {
  // alert(props.onPressShopBag)
  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
      <TouchableOpacity onPress={props.onPressShopBag}>
        <Image
          source={images.anchorShoppingIcon}
          style={styles.shopBagImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {
        props.showLogin ? (
          <View style={styles.loginWrapper}>
            <TouchableOpacity onPress={props.onPressLoginIm} style={styles.login}>
              <PrimaryText color="white">登录聊天</PrimaryText>
            </TouchableOpacity>
          </View>
        ) : null
      }
      <View style={styles.cellsWrapper}>
        <TouchableOpacity style={styles.cell} onPress={props.onPressFace}>
            <Image
              source={images.filterIcon}
              style={styles.img}
              resizeMode="contain"
            />
            <SmallText color="white">美颜</SmallText>
        </TouchableOpacity>
        {
          props.showLogin ? (
            <TouchableOpacity onPress={props.onPressBubble} style={styles.cell}>
              <Image
                source={images.editBubbleIcon}
                style={styles.img}
                resizeMode="contain"
              />
              <SmallText color="white">气泡</SmallText>
            </TouchableOpacity>
          ) : null
        }
        
        <TouchableOpacity onPress={props.onPressShare} style={styles.cell}>
          <Image
            source={images.anchorShareIcon}
            style={styles.img}
            resizeMode="contain"
          />
          <SmallText color="white">分享</SmallText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

LiveToolBar.defaultProps = {
  inputPlaceholder: '说点好听的'
}

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  shopBagImg: {
    width: scale(42),
    height: scale(50)
  },
  cellsWrapper: {
    flexDirection: 'row',
    width: vw(60),
    justifyContent: 'space-between'
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: 32,
    height: 35,
  },
  loginWrapper: {
    height: scale(35),
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  login: {
    paddingHorizontal: pad,
    backgroundColor: Colors.opacityDarkBg,
    borderRadius: radio
  },
})
export default LiveToolBar;