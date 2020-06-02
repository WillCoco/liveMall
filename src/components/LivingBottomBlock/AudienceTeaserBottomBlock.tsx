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
import {apiLiveLike} from '../../service/api';
import { isSucceed } from '../../utils/fetchTools';
import share, { ShareType } from '../../utils/share';
import { useNavigation } from '@react-navigation/native';

const BottomBlock = (props: any) : any =>  {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();
  const isLogin = useSelector((state: any) => state?.userData?.isLogin);

  // 是否有数据未提交
  const needSubmit = React.useRef(false);

  // 本地点击喜欢数量
  const [likeQuantity, setLikeQuantity] = React.useState(0);

  // 喜欢数量
  const likeSum = useSelector((state: any) => +state?.live?.livingInfo?.likeSum || 0);
  const likeSumRef = React.useRef(likeSum);

  // 点击喜欢
  const onPressLike = () => {
    if (!isLogin) {
      navigate('Login');
      return;
    }
    needSubmit.current = true;
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
    console.log(needSubmit.current, likeQuantity)
    if (needSubmit.current && (likeQuantity > 0 || quantity > 0) && (liveId || liveIdRef.current)) {
      // 提交、返回新值
      const params = {
        liveId: liveId || liveIdRef.current,
        likeNum: quantity || likeQuantity
      }
      apiLiveLike(params)
        .then(res => {
          if (isSucceed(res)) {
            // setLikeQuantity(0);
            likeSumRef.current = 0;
          }
          // 重置
          needSubmit.current = false;
        })
        .catch(error => {
          // 重置
          needSubmit.current = false;
          console.log(`apiLiveLike: ${error}`)
        })
    }
  }, [likeQuantity, needSubmit.current]);
  
  // 转发分享
  const onPressForward = () => {
    if (!isLogin) {
      navigate('Login');
      return;
    }

    share({
      liveId,
      inviteCode
    }, {
      title: '分享',
      failOnCancel: false,
    })
      .then((res) => { console.log(res) })
      .catch((err) => { err && console.log(err); });  
  }

  /**
   * 轮询器
   */
  const poller = React.useRef(new Poller({
    interval: 1000 * 10,
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
      interval: 1000 * 10,
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