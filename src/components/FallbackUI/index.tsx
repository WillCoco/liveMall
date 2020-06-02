/**
 * @author: Xu Ke
 * @date: 2020/1/8 5:58 PM
 * @Description: 404页面
 * @lastModificationBy:
 * @lastModification:
 * @lastModificationDate:
 */
import React from 'react';
import {View, ImageBackground, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images';
import pxToDp from '../../utils/px2dp';
import pad from '../../constants/Layout';
import {PrimaryText} from 'react-native-normalization-text';
import {Colors} from '../../constants/Theme';



const RootError = (props: {
  errorInfo?: string
}) => {
  const {goBack, navigate, reset} = useNavigation();

  const goHome = () => {
    reset({
      index: 0,
      routes: [{ name: 'Root', params: {initialRoute: '首页'}}],
    });
  };
  
  const showInfo = !!__DEV__ && props.errorInfo
  
  return (
    <View style={styles.wrapper}>
      <ImageBackground source={require('../../assets/default-image/err_network.png')} style={styles.errNetWorkImg} >
        <Text style={styles.text}>页面出错</Text>
      </ImageBackground>
      <TouchableOpacity style={styles.reloadBtn} onPress={goHome}>
        <Text style={styles.reloadText}>点击前往首页</Text>
      </TouchableOpacity>
      {showInfo ? <Text style={styles.text}>{props.errorInfo}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
  title: {
    textAlign: 'center',
  },
  img: {
    width: pxToDp(380),
    height: pxToDp(360)
  },
  text: {
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
  },
  errNetWorkImg: {
    width: pxToDp(380),
    height: pxToDp(360),
    paddingTop: pxToDp(300)
  },
  reloadBtn: {
    height: pxToDp(50),
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    borderRadius: pxToDp(25)
  },
  reloadText: {
    fontSize: pxToDp(24),
    color: Colors.whiteColor
  }
});

export default RootError;
