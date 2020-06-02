import TIM from 'tim-js-sdk';
import genSig from '../helpers/genSig';

let options = {
  // SDKAppID: 1400313779 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
  SDKAppID: 1400312574 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};

// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示

// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
tim.setLogLevel(__DEV__ ? 0 : 1); // 0普通级别，日志量较多，接入时建议使用

// 测试开发使用
// const generator = new genSig(1400313779, 'cdaae4b78b240035a2e909b3c0450a77cba67e81d0e0cfc3cf0a60c92bb00fd7', 604800);

// let userSig = generator.genTestUserSig('test01');// 测试

// let getUserSig = (userID: string) => generator.genTestUserSig(userID);

export default {tim, TIM, /* userSig, getUserSig */};