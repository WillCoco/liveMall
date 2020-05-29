/**
 * 推流组件
 */
import React from 'react';
import {
    View,
    ScrollView,
    PermissionsAndroid,
    StyleSheet,
    StyleProp,
    InteractionManager
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
// import {Streaming} from 'pili-streaming-react-native';
// import {NodePlayerView, NodeCameraView} from 'react-native-nodemediaclient';
import {PrimaryText} from 'react-native-normalization-text';
import {vw, vh} from '../../utils/metric';
// import { isAndroid, safeTop } from '../../constants/DeviceInfo';
// import {updateStarted} from '../../actions/live';
import usePermissions from '../../hooks/usePermissions';
import {consts, Streaming} from 'pili-streaming-react-native';

interface LivePusherProps {
    style?: StyleProp<any>,
    onStateChange?: (v: any) => any
}

const LivePusher = React.forwardRef((props: LivePusherProps, ref: any) : any =>  {
    const dispatch = useDispatch();

    /**
     * 实例
     */
    const pusher: {current: any} = React.useRef();

    /**
     * 必要权限
     */
    const isPermissionGranted = usePermissions([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    React.useEffect(() => {
        // dispatch(updateStarted(true))
        // console.log('updateStarted')
        // dispatch(updateStarted(false))
        // 打开
        return () => {
            // 关闭
            // Toast.show('close')

            // return dispatch(updateStarted(false))
            // pusher.current && pusher.current.stopPreview();
        }
    }, [])


    /**
     * 推流配置
     */
    const pusherConfig = useSelector((state: any) => state?.live?.pusherConfig)

    /**
     * 直播间信息
     */
    const pushUrl = useSelector((state: any) => state?.live?.livingInfo?.pushUrl)

    /**
     * 加载推流的条件
     */
    const showPusher = !!(isPermissionGranted && pushUrl);

    /**
     * 播放器状态
     */
    const [status, setStatus]: [number | undefined, any] = React.useState()

    
    console.log(isPermissionGranted, 'b01_isPermissionGranted')
    console.log(pusherConfig, 'b01_pusherConfig')
    console.log(pushUrl, 'b01_pushUrl')
    console.log(showPusher, 'b01_showPusher')

    const onStateChange =(v: any) => {
        setStatus(v);
        props.onStateChange && props.onStateChange(v);
        console.log(v, 'onStateChange')
    }

    const onStreamInfoChange =(v: any) => {
        console.log(v, 'onStreamInfoChange')
    }

    return (
      <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
        {showPusher ? (
            <Streaming
                {...pusherConfig}
                onStateChange={onStateChange}
                onStreamInfoChange={onStreamInfoChange}
            />
        ) : null}
        {/* {(status && status !== 2) ? <PrimaryText color="white" style={styles.loading}>连接中</PrimaryText> : null} */}
      </View>
    );
})

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    scrollerWrapper: {
    },
    contentWrapper: {
        justifyContent: 'flex-end',
    },
    loading: {
        position: 'absolute',
        top: vh(50) - 20,
        left: vw(50) - 20,
    }
})

export default LivePusher;