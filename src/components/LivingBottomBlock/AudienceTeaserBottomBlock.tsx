/**
 * 回放底部bock业务组件
 */
import * as React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {AudienceTeaserToolBar} from '../LiveToolBar';
import {pad} from '../../constants/Layout';
import Poller from '../../utils/poller';
import {apiLiveLike, wxUserName} from '../../service/api';
import { isSucceed } from '../../utils/fetchTools';
import share, { ShareType } from '../../utils/share';
import { useNavigation } from '@react-navigation/native';

import * as WeChat from 'react-native-wechat-lib' 
import { Toast } from '@ant-design/react-native';

const POLLER_INTERVAL = 1000 * 15;

const BottomBlock = (props: any) : any =>  {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();
  const isLogin = useSelector((state: any) => state?.userData?.isLogin);

  // 本地点击喜欢数量
  const [likeQuantity, setLikeQuantity] = React.useState(0);

  // 喜欢数量
  const likeSum = useSelector((state: any) => +state?.live?.livingInfo?.likeSum || 0);
  const likeSumRef = React.useRef(likeSum);

  // 分享相关参数
  const userAvatar = useSelector((state: any) => state?.userData?.userInfo?.userAvatar);
  const nickName = useSelector((state: any) => state?.userData?.userInfo?.nickName);
  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId);

  // 点击喜欢
  const onPressLike = () => {
    setLikeQuantity(quantity => ++quantity);
  }

  // 直播房间信息 (退出会现执行外层useEffect, 清除liveID, 用memo保存)
  const liveId = useSelector((state: any) => state?.live?.livingInfo?.liveId);
  const liveIdRef = React.useRef(liveId);
  React.useEffect(() => {
    if (liveId) {
      liveIdRef.current = liveId;
    }
  }, [liveId])

  /**
   * 邀请码
   */
  const inviteCode = useSelector((state: any) => state?.userData?.userInfo?.inviteCode);
  
  // 提交喜欢
  const submitLike = React.useCallback((quantity: number) => {
    if ((liveId || liveIdRef.current)) {
      // 提交、返回新值
      const params = {
        liveId: liveId || liveIdRef.current,
        likeNum: quantity || likeQuantity
      }
      apiLiveLike(params)
        .then(res => {
          if (isSucceed(res)) {
            setLikeQuantity(0);
            likeSumRef.current = 0;
          }
        })
        .catch(error => {
          console.log(`apiLiveLike: ${error}`)
        })
    }
  }, [likeQuantity]);
  
  // 转发分享
  const onPressForward = async () => {
    if (!isLogin) {
      navigate('Login');
      return;
    }

    const wxIsInstalled = await WeChat.isWXAppInstalled()

    if (wxIsInstalled) {
      WeChat.shareMiniProgram({
        scene: 0,
        userName: wxUserName,
        title: `${nickName}正在直播，快来围观`,
        webpageUrl: 'https://www.quanpinlive.com',
        thumbImageUrl: userAvatar,
        path: `pages/watch-live/index?invicode=${inviteCode}&liveId=${liveId}&shareUserId=${userId}`
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    } else {
      Toast.fail('请先下载安装微信')
    }

    // share({
    //   liveId,
    //   inviteCode
    // }, {
    //   title: '分享',
    //   failOnCancel: false,
    // })
    //   .then((res) => { console.log(res) })
    //   .catch((err) => { err && console.log(err); });  
  }

  /**
   * 轮询器
   */
  const poller = React.useRef(new Poller({
    interval: POLLER_INTERVAL,
    initExec: false,
    callback: submitLike,
  }));

  React.useEffect(() => {
    // 更新ref
    likeSumRef.current = likeQuantity;

    // 更新轮询器
    if (poller.current) {
      poller.current.stop();
    }

    poller.current = new Poller({
      interval: POLLER_INTERVAL,
      initExec: false,
      callback: submitLike,
    });

    poller.current.start();
    
    return () => {
      poller.current.stop();
    }
  }, [likeQuantity])

  /**
   * 退出提交
   */
 React.useEffect(() => {
  return () => {
    if (likeSumRef.current) {
      submitLike(likeSumRef.current)
    }
  }
 }, [])

  // 观众
  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
      <AudienceTeaserToolBar
        likeQuantity={(likeQuantity + likeSum) || 0}
        onPressLike={onPressLike}
        onPressForward={onPressForward}
        style={{marginTop: 28}}
      />
    </View>
  )
};

BottomBlock.defaultProps = {
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: pad,
    justifyContent: 'flex-end',
  },
});

export default BottomBlock;