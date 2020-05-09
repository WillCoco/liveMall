/**
 * 主播账单
 */
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native'
import { PrimaryText, T4, SmallText } from 'react-native-normalization-text';
import { DatePicker } from '@ant-design/react-native'
import ImageText from '../../../components/ImageText';
import ButtonOutLine from '../../../components/Buttons/ButtonOutLine';
import NavBar from '../../../components/NavBar';
import withPage from '../../../components/HOCs/withPage';
import { Colors } from '../../../constants/Theme';
import { pad } from '../../../constants/Layout';
import images from '../../../assets/images/index';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Empty from '../../../components/Empty';
import { vw, vh } from '../../../utils/metric';
import { Feather } from '@expo/vector-icons';
import pxToDp from '../../../utils/px2dp';

const AnchroBill = props =>  {

  const billList: Array<any> = [];
  const isEmpty = !billList || billList.length === 0;
  const ROW_HEIGHT = 125;
  const [data, setData]: Array<any> = React.useState(billList);
  const [billDate, setBillDate]: any = React.useState(new Date());


  /**
   * 渲染行
   */
  const renderItem = ({item, index, drag, isActive}: any): React.ReactNode => {
    return (
      <ListItem
        leftAvatar={{source: images.BOCIcon}}
        title={'提现'}
        subtitle={'2020.04.11  12:22'}
        subtitleStyle={{color: Colors.darkGrey, marginTop: pad}}
        rightTitle={'+12.90¥'}
        rightTitleStyle={{fontWeight: 'bold'}}
        bottomDivider
      />
    )
  }

  /**
   * 改变时间
   */
  const onDatePicker = value => {
    setBillDate(value)

    // TODO: 根据时间拉取接口
  }

  return (
    <View style={styles.style}>
      <NavBar
        title="账单"
        titleStyle={{color: Colors.whiteColor, marginLeft: 6}}
        leftTheme="light"
        style={styles.navWrapper}
      />
      <View style={StyleSheet.flatten([styles.headerWrapper, {height: 230 + props.safeTop}])}>
        <Image style={styles.imgBg} source={images.anchorShopBg} resizeMode="stretch" />
      </View>
      <View style={StyleSheet.flatten([styles.billWrapper, {top: props.safeTop + pxToDp(88)}])}>
        <View style={styles.billTimer}>
          <PrimaryText style={{color: Colors.whiteColor}}>{billDate.getFullYear() + '年' + (billDate.getMonth() + 1) + '月'}</PrimaryText>
          <DatePicker
            value={billDate}
            mode="month"
            minDate={new Date(2020, 4)}
            maxDate={new Date(2099, 11)}
            onChange={onDatePicker}
            format="YYYY-MM"
            title="时间"
          >
            <Feather name="more-horizontal" size={24} color="white" />
          </DatePicker>
        </View>
        <View style={styles.billContainer}>
          {
            !isEmpty ? <Empty text="暂无数据" /> : (
              <DraggableFlatList
                data={[1,2,3,4]||data}
                renderItem={renderItem}
                keyExtractor={(item, index) => `draggable-item-${index}`}
                onDragEnd={({ data }) => setData(data)}
                contentContainerStyle={styles.contentContainerStyle}
                ListFooterComponent={() => {
                  return (
                    <SmallText color="grey" style={styles.footer}>没有更多啦~</SmallText>
                  )
                }}
                getItemLayout={(data, index) => (
                  {length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index}
                )}
              />
            )
          }
        </View>
      </View>
    </View>
  )
};

AnchroBill.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  navWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 101,
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  headerWrapper: {
    backgroundColor: 'transparent',
  },
  imgBg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    position: 'absolute'
  },
  billWrapper: {
    width: '100%',
    position: 'absolute',
    padding: pad,
  },
  billTimer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: Colors.whiteColor,
    fontWeight: 'bold',
    marginBottom: pad * 2,
  },
  billContainer: {
    height: vh(80),
    backgroundColor: Colors.whiteColor,
  },
  contentContainerStyle: {
  },
  footer: {
    width: '100%',
    textAlign: 'center',
    marginTop: pad,
  }
});

export default withPage(AnchroBill, {
  statusBarOptions: {
    barStyle: 'light-content',
  }
});