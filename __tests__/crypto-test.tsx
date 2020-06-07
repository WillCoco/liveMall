import {AESEncrypt, RSAEncrypt} from '../src/helpers/crypto'
import { sleep } from '../src/utils/tools';


it('AESEncrypt',() => {
  const result = AESEncrypt('我是待加密数据')
  console.log(result, 'result')
});