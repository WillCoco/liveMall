import { Platform } from 'react-native';
import Share, {Options} from 'react-native-share';
import {MediaType} from '../liveTypes';
import {downloadUrl} from '../constants/Urls';
import {getParam} from '../service/fetch/getParams';

// const url = 'https://awesome.contents.com/';
// const title = 'Awesome Contents';
// const message = 'Please check this out.';
// const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';

export enum ShareType {
  goodInfo = 'goodInfo',
  teaser = 'teaser', // 预告
  living = 'living', // 直播
  record = 'record', // 回放
}

const share = (params: any, options: any) => {

  const sharePrefix = options.sharePrefix || `${downloadUrl}`;

  const shareUrl = `?${getParam(params)}` || '';

  console.log(shareUrl, 'shareUrlshareUrlshareUrlshareUrlshareUrl')

  const message = `
邀请您加入云闪播，主播团队带货，正品大牌折上折！
购物更划算！
--------------
下载链接：
--------------
${params.inviteCode ? `注册填写邀请口令：${params.inviteCode}` : ''}
${params.liveId ? '--------------' : ''}
${params.liveId ? `直播间ID：${params.liveId}` : ''}
`

  const opts = Platform.select({
    default: {
      title: options.title || '分享',
      url: downloadUrl,
      message,
      failOnCancel: options.failOnCancel,
    },
  });
  
  return Share.open(opts);
}

export default share;
