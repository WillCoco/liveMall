/**
 * 一些环境相关配置，打包注意修改
 */

const isDevelop = false; // true 开发环境 false 生产环境

/** ----------------- 请求接口 ----------------- */
export const HOST_PHP = isDevelop
  ? 'https://mobile.quanpinlive.com'
  : 'https://mobile.yunshanbo.cn';
export const HOST_JAVA = isDevelop
  ? 'https://app.quanpinlive.com'
  : 'https://app.yunshanbo.cn';

/** ----------------- RSA 加密公钥 ----------------- */
export const PUBKICK_KEY = isDevelop
  ? 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC47SZrn8veaJMTfLYFGOyHS1X5wSXlPkxFssmKciudtewz/uMAlNubW1KUKNJuacUK1D6huZB2IKDM17rEVx00VzTiV9ZlskMNKgDbAX8clz66npwp3a2egmzDCi7N+NYqV27xRifvg3cJ+AsTQlFibt/jRg7eHfE1yM7VTJlhBQIDAQAB'
  : 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDY9JB9emnfD0v7FGJhwEOivnemrPeRnuN0gPBauwVUBfp6gNy+qXXzNlapquA7231LX4sJniUvgrv4pYC4MfOlWjmzo6ZneKF/kkLtbktnvU45Y97+LxZa8jkRZppLAgxJcvOLHkBoVzU8pHXePLh6ibKQ5vhacsFrHFn4UFFdwIDAQAB'

/** ----------------- 微信开放平台 ----------------- */
export const wxUserName = isDevelop ? 'gh_fc399d40a762' : 'gh_cb6b0a2f2ce3';

/** ----------------- TIM ID ----------------- */
export const SDKAppID = isDevelop ? 1400382455 : 1400312574;
