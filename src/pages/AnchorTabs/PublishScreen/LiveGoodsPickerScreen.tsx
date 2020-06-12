/**
 * 
 */
import * as React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {PrimaryText, SmallText, T4} from 'react-native-normalization-text';
import {useNavigation} from '@react-navigation/native';
import withPage from '../../../components/HOCs/withPage';
import {vw} from '../../../utils/metric';
import {Colors} from '../../../constants/Theme';
import {pad} from '../../../constants/Layout';
import NavBar from '../../../components/NavBar';
import GoodsCategoryScroll from '../../../components/GoodsCategoryScroll';
import Empty from '../../../components/Empty';
import GoodCheckBlock from '../../../components/GoodCheckBlock';
import Iconcartlight from '../../../components/Iconfont/Iconcartlight';


const CreateLiveScreen = (props: any) => {
  const {navigate, goBack} = useNavigation();
  const dispatch = useDispatch();

  const onNextPress = () => {
    // 存直播配置

    // 跳转
  }

  const liveConfig = useSelector((state: any) => state?.live?.liveConfig);

  console.log(liveConfig, 'liveConfig')

  /**
   * 选择的种类
   */
  const [checkedCategory, setCheckedCategory]: Array<any> = React.useState();

  /**
   * 提交更改
   */
  const onSubmit = () => {
    // 提交更改

    // 跳转
    navigate('LiveGoodsManageScreen')
  }

  const data = [1,2,3,4,5,6,7,8,9,4,5,6,7,8,9,10];
  const goods = [1,2,3,4,5,6,7,8,9,4,5,6,7,8,9,10];

  return (
    <View style={styles.style}>
      <NavBar title="直播组货" />
        {
          data && data.length > 0 ? (
            <View style={styles.contentWrapper}>
              <GoodsCategoryScroll
                data={data}
                onChecked={setCheckedCategory}
                style={{width: vw(28), marginRight: pad}}
              />
              <View style={{flex: 1}}>
                <PrimaryText style={styles.goodBlockTitle}>合作商品</PrimaryText>
                <FlatList
                  data={goods}
                  renderItem={({item}) => {
                    return (
                      <GoodCheckBlock />
                    )
                  }}
                  keyExtractor={(item: any, index: number) => 'index' + index + item}
                  numColumns={3}
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                  style={{paddingRight: pad}}
                />
              </View>
            </View>) : (
              <Empty />
            )
        }
      <View style={styles.bottomWrapper}>
        <View style={styles.pickedQuantity}>
          <View style={styles.pickedQuantityBall}>
            <Iconcartlight  />
          </View>
        </View>
        <TouchableOpacity style={styles.btnWrapper} onPress={onSubmit}>
          <PrimaryText color="white">完成修改直播商品列表</PrimaryText>
        </TouchableOpacity>
      </View>
    </View>
  )
};

CreateLiveScreen.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottomWrapper: {
    flexDirection: 'row',
    height: 48
  },
  navStyle: {
    backgroundColor: 'transparent',
  },
  btnWrapper: {
    flex: 1,
    backgroundColor: Colors.basicColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickedQuantity: {
    width: vw(28) + 10,
    backgroundColor: Colors.darkBg
  },
  pickedQuantityBall: {
    height: 58,
    width: 58,
    borderRadius: 29,
    backgroundColor: Colors.yellowColor,
    position: 'absolute',
    top: -29,
    left: '50%',
    transform: [{translateX: -29}],
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  goodBlockTitle: {
    marginTop: pad * 2,
    marginBottom: pad
  }
});

export default withPage(CreateLiveScreen, {
  navBackOptions: {
    navBackIcon: 'close',
    navBackTheme: 'light',
    navBackPosition: 'right',
  },
  statusBarOptions: {
    barStyle: 'dark-content',
    backgroundColor: '#fff',
  }
});