import {Dispatch} from 'redux';
import liveActionType from '../constants/Live';
import {LiveConfig,CameraType} from '../reducers/live';
import * as api from '../service/api';
import {isSucceed} from '../utils/fetchTools';
import {EMPTY_OBJ, EMPTY_ARR} from '../constants/freeze';
import {getUniqueId} from 'react-native-device-info';

/**
 * 更新直播参数
 */
interface liveConfigType {
  title?: string,
  cover?: string,
}

/**
 * 更新直播配置(标题、封面)
 */
export const updateLiveConfig = (liveConfig?: LiveConfig) => {
  return {type: liveActionType.UPDATE_LIVE_CONFIG, payload: {liveConfig}}
}

/**
 * 选择商品开始直播
 */
interface startLiveParams {
  goodsIdList: Array<any>,
}
export const startLive = (params: startLiveParams) => {
  return async function(dispatch: Dispatch, getState: any) {
    const {cover, title} = getState().live?.liveConfig || {};
    const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id
    return api.apiStartLive({
      anchorId,
      goodsIdList: params.goodsIdList,
      title,
      smallPic: cover,
      ownerId: getUniqueId(),
    })
    .then((r: any) => {
      console.log(r, 'startLive111');

      if (isSucceed(r)) {
        console.log(r, 'startLive');
        return Promise.resolve(r?.data);
      }
      return Promise.resolve(false);
    })
    .catch((error: any) => {
      console.log(`startLive error: ${error}`)
      return Promise.resolve(false);
    });
  }
}

/**
 * 开始、停止推流
 */
export const updateStarted = (started: boolean) => {
  return async function(dispatch: Dispatch, getState: any) {

    const pusherConfig = getState()?.live?.pusherConfig;
    if (started === pusherConfig.started) {
      return;
    }
    dispatch(updatePusherConfig({...pusherConfig, started}))
  }
}

/**
 * 切换摄像头
 */
export const updatecamera = () => {
  return async function(dispatch: Dispatch, getState: any) {
    const pusherConfig = getState()?.live?.pusherConfig;
    const {camera} = pusherConfig || {};
    const cameraDir = camera === CameraType.front ? CameraType.back : CameraType.front;

    dispatch(updatePusherConfig({...pusherConfig, camera: cameraDir}));
  }
}

/**
 * 调节 美白 磨皮 红润
 */
interface faceBeautyParams {
    repeat: boolean | undefined, // 重置
    type: string,
    value: number
}

export const updateFaceSetting = (params: faceBeautyParams) => {
    return async function(dispatch: Dispatch, getState: any) {
        const pusherConfig = getState()?.live?.pusherConfig;
        const {faceBeautySetting} = pusherConfig || {};

        const singleSetting = {
            [params.type] : params.value
        };
        const newSetting = {...faceBeautySetting, ...singleSetting };
        dispatch(updatePusherConfig({...pusherConfig, faceBeautySetting: newSetting}));
     }
};

/**
 * 重置 美白 磨皮 红润
 */
const INIT_SETTING: any =  {
    beautyLevel : 0,
    whiten : 0,
    redden : 0,
}

export const repeatFaceSetting = () => {
    return async function(dispatch: Dispatch, getState: any) {
        const pusherConfig = getState()?.live?.pusherConfig;
        dispatch(updatePusherConfig({...pusherConfig, faceBeautySetting: INIT_SETTING}));
    }
};

/**
 * 基础美颜
 */
export const updateFaceBeauty = (camera: 'front' | 'back') => {
  return async function(dispatch: Dispatch, getState: any) {
    const pusherConfig = getState()?.live?.pusherConfig;
    if (camera === pusherConfig.camera) {
      return;
    }
    dispatch(updatePusherConfig({...pusherConfig, camera}))
  }
}

/**
 * 发布预告
 */
interface ReleaseTeaserParams {
  advance?: string, // 预告片
  bigPic?: string,
  smallPic: string,
  liveTime: number,
  title: string
}
export const releaseTeaser = (params: ReleaseTeaserParams) => {
  return async function(dispatch: Dispatch, getState: any) {
    const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id

    const opts: any = {
      anchorId,
      smallPic: params.smallPic,
      liveTime: params.liveTime,
      title: params.title,
    };

    if (params.advance) {opts.advance = params.advance};
    if (params.bigPic) {opts.bigPic = params.bigPic};

    console.log(opts, 'optsoptsopts')
    return api.apiReleaseNotice(opts)
    .then((r: any) => {
      return Promise.resolve(isSucceed(r));
    })
    .catch((error: any) => {
      console.log(`releaseTeaser error:`)
      console.log(error)
      return Promise.resolve(false);
    })
  }
}

/**
 * 是否在直播
 */
export const isWorkLiveNow = () => {
  return async function(dispatch: Dispatch, getState: any): Promise<any> {
    const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id

    return api.apiIsWorkLiveNow({anchorId})
    .then((r: any) => {
      console.log(r, '是否在直播')
      if (isSucceed(r)) {
        return Promise.resolve(r?.data);
      }
      return Promise.resolve(false);
    })
    .catch((error: any) => {
      console.log(`isWorkLiveNow error: ${error}`)
      return Promise.resolve();
    })
  }
}


/**
 * 关闭直播
 */
enum CloseType {
  keepRecord = 1,
  dontKeepRecord,
}
interface CloseLiveParams {
  liveId: string,
  type?: CloseType,
}
export const closeLive = (params: CloseLiveParams) => {
  return async function(dispatch: Dispatch, getState: any) {
    const defaultType = 1; // 1 保存回放, 2 不保存
    return api.apiCloseLive({type: defaultType, ...params})
    .then((r: any) => {
      console.log(r, 'closeLive')
      if (isSucceed(r)) {
        return Promise.resolve(r.data);
      }
      return Promise.resolve(false);
    })
    .catch((error: any) => {
      console.log(`isWorkLiveNow error:`, error)
      return Promise.resolve();
    })
  }
}

/**
 * 去直播
 */
interface anchorToLiveParams {
  liveId: string,
}
export const anchorToLive = (params: anchorToLiveParams) => {
  return async function(dispatch: Dispatch, getState: any) {
    const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id
    const pusherConfig = getState()?.live?.pusherConfig;

    return api.apiAnchorToLive({...params, anchorId})
    .then((r: any) => {
      console.log(r, 'anchorToLive')

      if (isSucceed(r)) {
        // 更新推流地址
        const livingInfo = r?.data;
        // dispatch(updatePusherConfig({outputUrl: pushUrl}));

        // 更新初始观看人数、头像、昵称、推流地址等
        if (livingInfo) {
          dispatch(updateLivingInfo(livingInfo))
            console.log('89909')
          dispatch(updatePusherConfig({...pusherConfig,rtmpURL: livingInfo.pushUrl}));
        }

        return Promise.resolve(r?.data);
      }
      return Promise.resolve(false);
    })
    .catch((error: any) => {
      console.log(`anchorToLive error: ${error}`)
    })
  }
}

/**
 * 获取预告
 */
interface GetAdvanceListParams {
  pageNo: number,
  pageSize: number,
}
export const getAdvanceList = (params: GetAdvanceListParams) => {
  return async function(dispatch: Dispatch, getState: any) {
    const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id

    return api.apiGetAdvanceList({...params, anchorId})
    .then((r: any) => {
      console.log(r, '获取预告')
      if (isSucceed(r)) {
        const {records} = r?.data || EMPTY_OBJ;
        return Promise.resolve(records || EMPTY_ARR);
      }
      return Promise.resolve(EMPTY_ARR);
    })
    .catch((error: any) => {
      console.log(`getAdvanceList error: ${error}`)
      return Promise.resolve(EMPTY_ARR);
    })
  }
}

/**
 * 获取观看人数
 */
interface GetLiveViewNumParams {
  liveId: string | number,
}
export const getLiveViewNum = (params: GetLiveViewNumParams) => {
  return async function(dispatch: Dispatch, getState: any) {
    return api.apiGetLiveViewNum(params)
    .then((r: any) => {
      // console.log(r, '获取观看人数')
      if (isSucceed(r)) {
        dispatch(updateLivingInfo({watchNum: r?.data}))
      }
    })
    .catch((error: any) => {
      console.log(`getLiveViewNum error: `, error)
      // return Promise.resolve(EMPTY_ARR);
    })
  }
}

/**
 * 更新推流配置
 */
export const updatePusherConfig = (pusherConfig: any) => {
  return {type: liveActionType.UPDATE_PUSHER_CONFIG, payload: {pusherConfig}}
}

/**
 * 更新直播
 */
export const updateLivingInfo = (livingInfo?: any) => {
  return {type: liveActionType.UPDATE_LIVING_INFO, payload: {livingInfo}}
}

/**
 * 更新观众端房间直播状态
 */
export function updateLivingStatus(isLiveOver?: boolean) {
  return {type: liveActionType.UPDATE_LIVING_STATUS, payload: {isLiveOver}}
}

/**
 * 更新主播端房间直播状态(是否禁播)
 */
export function updateAnchorLivingStatus(isAnchorLiveOver: boolean) {
  return {type: liveActionType.UPDATE_ANCHOR_LIVING_STATUS, payload: {isAnchorLiveOver}}
}