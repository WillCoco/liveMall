
import JSEncrypt from 'jsencrypt';
// import AES from './aes';
let CryptoJS = require('crypto-js');
// import {NativeModules} from 'react-native';
// const AES = NativeModules.Aes
// import SimpleCrypto from "simple-crypto-js"
import getRandomString from './randomString';
import { PUBKICK_KEY } from '../../config/config'

/**
 * RSA加密
 */
const RSAEncrypt = (text: string, pbk: string = PUBKICK_KEY) => {
  var en = new JSEncrypt();
  en.setPublicKey(pbk);
  let encrypted;
  try {
    encrypted = en.encrypt(text);
  } catch (err) {
    console.log(err, 'error');
  }
  return encrypted;
}

/**
 * AES加密
 */
const AESEncrypt = async (text: string) => {
  const randomWord = getRandomString();
  let encrypted;
  try {
    let AES_KEY = CryptoJS.enc.Utf8.parse(randomWord);
    // console.log(AES_KEY, 'AES__');
    let sendData = CryptoJS.enc.Utf8.parse(text);
    // console.log(sendData, 'AES__');
    let encryptedBytes = CryptoJS.AES.encrypt(sendData, AES_KEY,{mode:CryptoJS.mode.ECB,padding:CryptoJS.pad.Pkcs7});
    // console.log(encrypted, 'AES__');
    encrypted = CryptoJS.enc.Base64.stringify(encryptedBytes.ciphertext);
  } catch (err) {
    console.log('AES_Encrypt error:', err)
  }
  const appKey = encodeURI(RSAEncrypt(randomWord)).replace(/\+/g, '%2B')
  // console.log(encrypted, 'encrypted');
  // console.log(appKey, 'appKey');

  return {
    encrypted,
    appKey
  }
}


export {
  RSAEncrypt,
  AESEncrypt
}