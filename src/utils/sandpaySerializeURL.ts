/**
 * 杉德支付路径拼接
 * @param param 支付接口返回的数据
 * @returns {string} 支付跳转url
 */

interface SandPayParams {
  data: string
  sign: string
  orderSn?: string
  payType?: string
}

import {SANDPAY_PRE} from '../service/api';

export default function sandpaySerializeURL(param: SandPayParams) {
  let payURL: string = SANDPAY_PRE;

  for (let item in param) {
    payURL += '&' + item + '=' + encodeURIComponent(param[item])
  }

  return payURL
}