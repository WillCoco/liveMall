import {NativeModules} from 'react-native';
// import JSEncrypt from 'jsencrypt';

// const pubkey =
//   'MMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC47SZrn8veaJMTfLYFGOyHS1X5wSXlPkxFssmKciudtewz/uMAlNubW1KUKNJuacUK1D6huZB2IKDM17rEVx00VzTiV9ZlskMNKgDbAX8clz66npwp3a2egmzDCi7N+NYqV27xRifvg3cJ+AsTQlFibt/jRg7eHfE1yM7VTJlhBQIDAQAB';

const Aes = NativeModules.Aes;

const generateKey = (
  password: string,
  salt: string,
  cost: number,
  length: number,
) => Aes.pbkdf2(password, salt, cost, length);

const encryptData = async (text: string, key: any) => {
  return Aes.randomKey(16).then((iv: any) => {
    return Aes.encrypt(text, key, iv).then((cipher: any) => ({
      cipher,
      iv,
    }));
  });
};

// const randomWord = (randomFlag: boolean, min: number, max: number) => {
//   let str = '';
//   let range = min;
//   let arr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
//   // 随机产生
//   if (randomFlag) {
//     range = Math.round(Math.random() * (max - min)) + min;
//   }
//   for (let i = 0; i < range; i++) {
//     var pos = Math.round(Math.random() * (arr.length - 1));
//     str += arr[pos];
//   }
//   return str;
// };

// export const rand = randomWord(true, 16, 16);

// export const getCode = (pass: string) => {
//   var encrypt = new JSEncrypt();
//   encrypt.setPublicKey(pubkey);
//   var d = encrypt.encrypt(pass);

//   var ps = encodeURI(d).replace(/\+/g, '%2B');
//   return ps;
// };

export const encrypt = async (params: string) => {
  try {
    const genKey = await generateKey('Arnold', 'salt', 5000, 256);

    const enData = await encryptData(params, genKey);

    return enData;
  } catch (e) {
    console.error(e);
  }
};
