/**
 * 直播数据分析
 */
/**
 * @Author: lyh
 * @Date: 2020/5/13
 * @Last Modified by: lyh
 * @Last Modified time: 2020/5/13
 **/
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import dayjs from 'dayjs';
import {PrimaryText,scale} from 'react-native-normalization-text';
import {useNavigation} from '@react-navigation/native';
import { connect } from 'react-redux';
import { Toast, Portal } from '@ant-design/react-native';

import withPage from '../../../components/HOCs/withPage';
import { pad } from '../../../constants/Layout';
import images from '../../../assets/images'
import NavBar from '../../../components/NavBar';
import { apiGetLiveDataList, apiGetLiveListAll } from '../../../service/api';
import {isIOS, isAndroid} from '../../../constants/DeviceInfo';
import PagingList from '../../../components/PagingList';
import ImagePickerBox from '../../../components/DatePicker';
import Echart from '../../../components/Echart';
import { isSucceed } from '../../../utils/fetchTools';

const LiveInfoCard = (props: {
    addFavourite: number,
    createTime: string,
    likeSum: number,
    liveDuration: string,
    orderSum: number,
    watchSum: number,
    moneySum: number
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.infoTitle}>
                <Image source={images.anchorMicrophone} style={styles.microphoneImg}></Image>
                <PrimaryText style={styles.title}>{props.createTime}直播</PrimaryText>
            </View>
            <View style={styles.box}>
                <View style={styles.tableItem}>
                    <View>
                        <PrimaryText style={styles.contentTitle}>{props.liveDuration}</PrimaryText>
                        <PrimaryText style={styles.headTitle}>直播时长</PrimaryText>
                    </View>
                    <View>
                        <PrimaryText style={styles.contentTitle}>{props.addFavourite}</PrimaryText>
                        <PrimaryText style={styles.headTitle}>今日点赞数</PrimaryText>
                    </View>
                    <View>
                        <PrimaryText style={styles.contentTitle}>{props.likeSum}</PrimaryText>
                        <PrimaryText style={styles.headTitle}>观众总数</PrimaryText>
                    </View>
                </View>
                <View style={styles.tableItem}>
                    <View>
                        <PrimaryText style={styles.contentTitle}>{props.watchSum}</PrimaryText>
                        <PrimaryText style={styles.headTitle}>新增粉丝</PrimaryText>
                    </View>
                    <View>
                        <PrimaryText style={styles.contentTitle}>{props.orderSum}</PrimaryText>
                        <PrimaryText style={styles.headTitle}>下单数量</PrimaryText>
                    </View>
                    <View>
                        <PrimaryText style={styles.contentTitle}>{props.moneySum}</PrimaryText>
                        <PrimaryText style={styles.headTitle}>成交金额</PrimaryText>
                    </View>
                </View>
            </View>
        </View>
    )
};

const LivesAnalyze = (props) =>  {
    const {anchorInfo = {}} = props;

    const {goBack} = useNavigation();

    const [liveInfoList, setLiveInfoList] = useState([]);

    /*
    *  获取直播数据
    * */
    const [time, setTime] = useState();
    const [echartDate, setEchartDate] = useState([]);

    /*
    *  k线数据
    * */
    const getDataListMonth = async (time: string) => {
        const {anchorId} = anchorInfo;
        const result = await apiGetLiveListAll({
            anchorId,
            dateScope: time
        }).catch(err => console.log(err, 'error'));

        console.log(result, 'result')
        if(isSucceed(result)) {
            setEchartDate(result?.data || [])
        }
    };

    useEffect(() => {
        getDataListMonth(time)
    }, [time]);


    const getDataListFn = (date: string) => {
        const t = Toast.loading('加载中');
        const {anchorId} = anchorInfo;
        const params = {
            anchorId,
            dateScope: date,
            pageNo: 1,
            pageSize: 10,
        }
        apiGetLiveDataList(params).then(res => {
            Portal.remove(t)
            setTime(params.dateScope);
            const {records = []} = res;
            setLiveInfoList(records)
        }).catch(err => {
            Portal.remove(t)
            Toast.fail('获取数据失败');
            console.log(err, 'error')
        });
    };

    /*
    * 上拉加载更多
    * */
    const onEndReached = (page, size) => {
        const {anchorId} = anchorInfo;
        apiGetLiveDataList({
            anchorId,
            dateScope: time,
            pageNo: page,
            pageSize: size,
        }).then(res => {
            const {records = []} = res;
            return Promise.resolve({result: records});
        }).catch(err => {
            console.log(err, 'error')
        });
    };


    return (
        <ImageBackground
            style={styles.container}
            source={require('../../../assets/images/anchorLiveBg.png')}
        >
            <NavBar
                leftTheme="light"
                title=""
                style={styles.navWrapper}
                onLeftPress={goBack}
            />
            <View style={[styles.style,{alignItems:'center'}]}>
                <View>
                    <View >
                        <View style={styles.cardSty}>
                            <Echart data={echartDate} />
                        </View>
                    </View>
                    <View style={{alignSelf: 'flex-start'}}>
                        <ImagePickerBox onPicked={getDataListFn}
                        />
                    </View>
                </View>
                <PagingList
                    refreshable={false}
                    size={10}
                    data={liveInfoList}
                    setData={setLiveInfoList}
                    initListData={liveInfoList}
                    renderItem={({item, index}) => {
                        return (
                            <LiveInfoCard
                                addFavourite={item.addFavourite}
                                createTime={item.createTime}
                                likeSum={item.likeSum}
                                moneySum={item.moneySum}
                                liveDuration={item.liveDuration}
                                orderSum={item.orderSum}
                                watchSum={item.watchSum}
                                key={`_${index}`}/>
                        )
                    }}
                    onRefresh={() => null}
                    onEndReached={onEndReached}
                    initialNumToRender={10}>
                </PagingList>
            </View>
        </ImageBackground>
    )
};

LivesAnalyze.defaultProps = {
};

const styles = StyleSheet.create({
    style: {
        flex: 1,
    },
    container: {
        width: '100%',
        height: '100%',
    },
    navWrapper: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent'
    },
    cardSty: {
        width: 345,
        height: 219,
        borderRadius: 12,
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    card: {
        width: 345,
        height: 169,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginTop: pad,
        marginBottom: pad,
    },
    box: {
        flex:1,
        justifyContent: 'space-around'
    },
    infoTitle: {
        flexDirection: 'row',
        marginTop: 22,
        marginBottom: 22,
    },
    microphoneImg: {
        width: 13,
        height: 16,
        marginLeft: 15,
        marginRight: 8,
    },
    title: {
        fontSize: 15,
        color: '#FF321B',
        fontWeight: 'bold'
    },
    tableItem: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    contentTitle: {
        fontSize: 12,
        color: '#222222',
        alignSelf: 'center',
        marginBottom: 2,
    },
    headTitle: {
        fontSize: 12,
        color: '#999999',
        alignSelf: 'center'
    }
});

export default connect(
    (state: any) => state.anchorData
)(withPage(LivesAnalyze));