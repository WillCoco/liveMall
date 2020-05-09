/**
 * 直播间底部bock业务组件
 */
import * as React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import {
  Modal, Toast,
} from '@ant-design/react-native';
import {useSelector, useDispatch} from 'react-redux';
import LiveMsg from '../LiveMsg';
import {Anchor as AnchorLiveToolBar} from '../LiveToolBar';
import {vh} from '../../utils/metric';
import {pad} from '../../constants/Layout';
import {RoomMessageType} from '../../reducers/im';
import {setGroupMemberMuteTime, getGroupMemberProfile} from '../../actions/im';

const LivingRoomScreen = (props: any) : any =>  {
  const dispatch = useDispatch();
  

  // 房间消息
  const roomMessages = useSelector(state => state?.im?.roomMessages);

  // 房间信息
  const room = useSelector(state => state?.im?.room);

  // 获取成员是否禁言
  const getUserSilent = async (userID: string) => {
    const info: any = await dispatch(getGroupMemberProfile({userID})) || {};

    console.log(info, 'sdkadjalkas')

    // 未禁言中
    if (info && (info.muteUntil * 1000 <= Date.now())) {
      return false;
    }

    return true;
  }

  // 观众
  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
      <LiveMsg
        msgList={roomMessages}
        msgAdapter={(msg: RoomMessageType) => {
          const {data, description} = msg || {};
          const {userName, text, userId} = data || {};
          return {
            name: userName,
            id: userId,
            text,
            type: description,
            isFollowed: props.isFollowed // todo: 和主播是否关注
          }
        }}
        onPressMsg={async (data: any) => {
          const {userName, userId} = data.data;
          // 查询是否禁言
          const isSilent = await getUserSilent(userId);

          const title = isSilent ? '是否取消禁言' : '是否禁言'
          Modal.alert(
            title,
            userName + ' ' + userId,
            [
              {
                text: '取消',
                style: 'cancel',
              },
              { text: '确定', onPress: () => {
                const options: any = {userID: userId}

                // 禁言或者取消禁言
                if (isSilent) {
                  options.muteTime = 0;
                }

                dispatch(setGroupMemberMuteTime(options))
              }},
            ]
          )
        }}
        // style={{maxHeight: 200, width: 200}}
      />
      <AnchorLiveToolBar
        style={{marginTop: 28}}
        onPressShopBag={props.onPressShopBag}
        onPressBubble={props.onPressBubble}
        onPressShare={props.onPressShare}
        onPressFaceBeauty={props.onPressFaceBeauty}
        onPressFilter={props.onPressFilter}
      />
    </View>
    
  )
};

LivingRoomScreen.defaultProps = {
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: pad,
    paddingBottom: pad,
  },
});

export default LivingRoomScreen;