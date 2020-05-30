/**
 * 数据适配器
 */
import formatSinglePrice from './formatGoodsPrice';

const EMPTY_OBJ = {};

/**
 * 获取
 * 品牌商品
 */
export const brandGoodAdapter = (good: any) => {
  if (!good) {
    return EMPTY_OBJ;
  }

  return {
    img: good.originalImg,
    title: good.goodsName,
    discountPrice: formatSinglePrice(good.shopPrice), // 折扣价
    pirce: formatSinglePrice(good.marketPrice), // 市场价
    profit: formatSinglePrice(good.rebate) || 0,
    isAdded: good.isExist === 1, // 1 存在, 2 不存在
    goodsId: good.goodsId,  // id
    storeCount: good.storeCount, // 总库存
  }
}


/**
 * 主播信息
 */
export const anchorInfoAdapter = (info: any) => {
  if (!info) {
    return EMPTY_OBJ;
  }

  console.log(info, 'infoinfoinfo')
  return {
    ...info,
  }
}
