import retry from '../src/service/fetch/retry'
import { sleep } from '../src/utils/tools';
import { isSucceed } from '../src/utils/fetchTools';

it('重试机制-错误', async () => {
  let tryTimes = 0;

  const getDataFail = async () => {
    tryTimes++;
    console.log('尝试次数:', tryTimes);

    await sleep(1000);

    return {
      code: 404,
      success: false,
    };
  }
  
  const getDataWithRetry = retry(getDataFail, {
    times: 5
  });

  const result = await getDataWithRetry();  
  console.log(result, '失败')
});

it('重试机制-成功', async () => {
  let tryTimes = 0;

  const getDataSuc = async () => {
    tryTimes++;
    console.log('尝试次数:', tryTimes);

    await sleep(1000);

    return {
      code: 200,
      success: true,
    };
  }
  
  const getDataWithRetrySuc = retry(getDataSuc, {
    times: 5
  });

  const result1 = await getDataWithRetrySuc();
  
  console.log(result1, '成功');
});