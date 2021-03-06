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
  Animated
} from 'react-native';
import { scale, PrimaryText, TinyText } from 'react-native-normalization-text';
import {vw} from '../../utils/metric'
import {Colors} from '../../constants/Theme';
import {pad} from '../../constants/Layout';
import images from '../../assets/images';
import {shortNum} from '../../utils/numeric';

export type msgList = any[] | undefined;
export type onMsgListResponse = (v: boolean) => any;

interface LiveToolBarProps {
  style?: StyleProp<any>,
  likeQuantity?: number,
  onPressShopBag: (v?: any) => any,
  onPressForward: (v?: any) => any,
  onPressLike: (v?: any) => any,
}

const LiveToolBar = (props: LiveToolBarProps) : any =>  {
  const [value, setValue] = React.useState('');
  const [animValue, setAnimValue] = React.useState(new Animated.Value(0));

  const likeQuantity = props.likeQuantity || 0;

  const onPressLike = (v: any) => {
    start();
    props.onPressLike(v)
  }

  /**
   * 动画
   */
  const start = () => {
    const ani = Animated.spring(animValue, {
      toValue: 1,
      // duration: 500,
      useNativeDriver: true
    });
    ani.stop();
    ani.start(({finished}) => {
      setAnimValue(new Animated.Value(0))
    })
  }

  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
      <TouchableOpacity onPress={props.onPressShopBag}>
        <Image
          source={images.anchorShoppingIcon}
          style={styles.shopBagImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={props.onPressForward} style={{marginRight: pad}}>
          <Image
            source={images.forwardIcon}
            style={styles.img}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressLike} style={{alignItems: 'center'}}>
          <Animated.Image
            source={images.liveLikeIcon}
            style={StyleSheet.flatten([styles.img, {
              transform: [{
                scale: animValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.2, 1]  // 0 : 150, 0.5 : 75, 1 : 0
                })
              }],
            }])}
            resizeMode="contain"
          />
          <TinyText style={styles.likeQty}>{shortNum(likeQuantity)}</TinyText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

LiveToolBar.defaultProps = {
}

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 4
  },
  input: {
    height: scale(35),
    width: vw(50),
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: scale(35) / 2,
    backgroundColor: Colors.opacityDarkBg,
    marginHorizontal: pad,
    color: '#fff',
    fontSize: scale(14),
  },
  img: {
    width: scale(35),
    height: scale(35),
  },
  shopBagImg: {
    width: scale(42),
    height: scale(50),
  },
  likeQty: {
    height: scale(14),
    minWidth: scale(30),
    lineHeight: scale(14),
    position: 'absolute',
    top: -scale(11),
    color: '#fff',
    backgroundColor: Colors.basicColor,
    textAlign: 'center',
    borderRadius: scale(7),
    overflow: 'hidden'
  }
})
export default LiveToolBar;