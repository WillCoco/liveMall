/**
 * 主播店铺
 */
import shopActionType from '../constants/Shop';
import {Dispatch} from 'redux';
import {sleep} from '../utils/tools';
import * as api from '../service/api';
import Toast from 'react-native-tiny-toast';
import calcStrLength from '../utils/calcStrLength';
import {safeStringify} from '../utils/saftyFn';
import { EMPTY_OBJ } from '../constants/freeze';
import {isSucceed} from "../utils/fetchTools";

/* ----------- 店铺相关 ----------- */
/**
 * 获取店铺商品
 */
export const getShopGoods = (shopGoods: any) => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    // 请求更新

    // 若成功去更新store
    dispatch(updateShopGoods(shopGoods));
  }
}

/**
 * 上架、下架
 */
export const soldOutShopGood = (shopGoods: any) => {
  return {type: shopActionType.UPDATE_SHOP_GOODS, payload: {shopGoods}};
}

/**
 * 添加商品
 */
export const putAwayShopGood = (shopGoods: any) => {
  return {type: shopActionType.UPDATE_SHOP_GOODS, payload: {shopGoods}};
}

/**
 * 更新店铺商品
 */
export const updateShopGoods = (retrunAddress: any) => {
  return {type: shopActionType.UPDATE_SHOP_GOODS, payload: {retrunAddress}};
}

/* ----------- 寄回地址相关 ----------- */
/**
 * 获取寄回地址
 */
export const getReturnAddress = (retrunAddress: any) => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    // 请求更新

    // 若成功去更新store
    dispatch(updateReturnAddress(retrunAddress))
  }
}

/**
 * 编辑店铺寄回地址(增加或修改)
 */
export const editReturnAddress = (retrunAddress: any) => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    // 请求更新

    // 若成功去更新store
    dispatch(updateReturnAddress(retrunAddress))
  }
}

/**
 * 更新店铺寄回地址
 */
export const updateReturnAddress = (retrunAddress: any) => {
  return {type: shopActionType.UPDATE_RETURN_ADDRESS, payload: {retrunAddress}}
}

/* ----------- 橱窗商品相关 ----------- */
/**
 * 获取橱窗商品
 */

// interface GetShowcaseGoodsPrarms {
//     selType: AddGoodsTargetType,
//     pageNo: number,
//     pageSize: number,
// }
// export const getShowcaseGoods = (params: GetShowcaseGoodsPrarms) => {
//   return async function(dispatch: Dispatch<any>, getState: any) {
//     // 请求更新
//     // mock
//     // await sleep(3000);
//     // const showcaseGoods = [1,2,3,4,5,6,7];
//     // console.log(showcaseGoods, 'showcaseGoods')
//       return async function (dispatch: Dispatch<any>, getState: any): Promise<any> {
//           const anchorId = getState()?.anchorData?.anchorInfo?.anchorId;
//           return api.apiDelGroupGoods({
//               ...params,
//               anchorId
//           })
//               .then(r => {
//                   console.log(r)
//                   // 若成功去更新store
//                   // dispatch(updateShowcaseGoods(showcaseGoods));
//                   // return Promise.resolve(showcaseGoods);
//               })
//               .catch(err => {
//                   console.log(`delWareHouseGoods error: ${err}`)
//                       return Promise.resolve(false);
//               })
//       }
//
//   }
// }

/**
 * 更新橱窗商品
 */
export const updateShowcaseGoods = (showcaseGoods: any) => {
  return {type: shopActionType.UPDATE_SHOWCASE_GOODS, payload: {showcaseGoods}};
}

/* ----------- 货源数据相关 ----------- */
/**
 * 获取平台分类品牌
 */
export const getPlatformBrands = () => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id
    return api.apiGetCatBrandAll({anchorId})
      .then((res: any) => {
        if (isSucceed(res)) {
          const platformBrands = res?.data || [];
          dispatch(updatePlatformBrand(platformBrands));

        }
      })
      .catch((err: any) => {
        console.log(`apiGetCatBrandAll error:`)
        console.log(err)
      })
  }
}

/**
 * 更新平台品牌
 */
export const updatePlatformBrand = (platformBrands: any) => {
  return {type: shopActionType.UPDATE_PLATFORM_BRNDS, payload: {platformBrands}};
}

/**
 * 获取品牌下商品
 */
export enum AddGoodsTargetType {
  warehouseGoods = 1, // 1.预组货添加商品
  showcaseGoods,  // 2.橱窗添加商品
}

interface GetPlatformBrandsGoodsPrarms {
  addType: AddGoodsTargetType,
  brandId: number, // 品牌id
  pageNo: number,
  pageSize: number,
}

export const getPlatformBrandsGoods = (params: GetPlatformBrandsGoodsPrarms) => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    // 请求
    const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id

    return api.apiGetBrandGoodsList({
      ...params,
      anchorId
    })
      .then((r: any) => {
        const {records} = r || {};
        console.log(records, 'recordsrecordsrecords')
        // dispatch(updatePlatformGoods(records || []));

        return Promise.resolve(records || []);
      })
      .catch(err => {
        console.log(`apiGetBrandGoodsList error: ${err}`)
        return Promise.resolve([]);
      })
  }
}

/**
 * 更新品牌商品
 */
export const updatePlatformGoods = (platformGoods: any) => {
  return {type: shopActionType.UPDATE_PLATFORM_GOODS, payload: {platformGoods}};
}

/**
 * 更新个人店铺商品
 */
export const updatePersonalGoods = (personalGoods: any) => {
  return {type: shopActionType.UPDATE_PERSONAL_GOODS, payload: {personalGoods}};
}

/* ----------- 预组货相关 ----------- */

/**
 * 添加预组货仓库商品
 * @returns
 */
interface AddGoods2WareHouseParams {
  brandGoods: Array<any>, // 品牌商品
  goodIdsNeed2Add: Array<string>, // 待添加的ids
}
export const addGoods2WareHouse = (params: AddGoods2WareHouseParams) => {
  return async function(dispatch: Dispatch<any>, getState: any) {
    const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id
      console.log(params, 'parmassss')

    const goodsIdList = params.goodIdsNeed2Add || [];
    return api.apiAddGroupGoods({
      goodsIdList,
      anchorId
    })
    .then(r => {
      const isSucceed = r && r.code === 200 && r.success;

      if (isSucceed) {

        console.log(goodsIdList, 'goodsIdListgoodsIdList')

        const newPlatformGoods = changeIsExit(
          params.brandGoods,
          (platformGood) => goodsIdList.indexOf(platformGood.goodsId) !== -1,
          true,
        );
        console.log(newPlatformGoods, 'newPlatformGoods')

        return Promise.resolve(newPlatformGoods)
      }
    })
    .catch(err => {
      console.log(`addGoods2WareHouse error: ${err}`)
      return Promise.resolve(false);
    })
  }
}

/*
* 商品管理添加商品到橱窗
* */
interface AddGoods2ShowCaseParams {
    brandGoods: Array<any>, // 品牌商品
    goodIdsNeed2Add: Array<string>, // 待添加的ids
}

export const addGoods2ShowCase = (params: AddGoods2ShowCaseParams) => {
    return async function(dispatch: Dispatch<any>, getState: any) {
        const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id
        console.log(params, 'parmassss')

        const goodsIdList = params.goodIdsNeed2Add || [];
        return api.apiAddAnchorGoods({
            goodsIdList,
            anchorId
        })
            .then(r => {
                const isSucceed = r && r.code === 200 && r.success;

                if (isSucceed) {

                    const newPlatformGoods = changeIsExit(
                        params.brandGoods,
                        (platformGood) => goodsIdList.indexOf(platformGood.goodsId) !== -1,
                        true,
                    );
                    console.log(newPlatformGoods, 'newPlatformGoods')

                    return Promise.resolve(newPlatformGoods)
                }
            })
            .catch(err => {
                console.log(`addGoods2ShowCase error: ${err}`)
                return Promise.resolve(false);
            })
    }
}

/**
 * 获取预组货仓库商品
 */
interface GetGoods2WareHouseParams {
  "pageNo": number,
  "pageSize": number,
  "selType": AddGoodsTargetType
}
export const getWareHouseGoods = (params: GetGoods2WareHouseParams) => {
  return async function(dispatch: Dispatch<any>, getState: any): Promise<any> {
    const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id
    return api.apiGetGroupGoods({
      ...params,
      anchorId
    })
      .then(r => {
        const {records} = r || {};
        return Promise.resolve(records || []);
      })
      .catch(err => {
        console.log(`getWareHouseGoods error: ${err}`)
        return Promise.resolve([]);
      })
  }
}

/**
 * 添加商品页面中取消添加预组货商品
 */
interface DelGoods2WareHouseParams {
    brandGoods: Array<any>, // 品牌商品
    goodIdsNeed2Del: Array<string>,
}
export const delWareHouseGoods2 = (params: DelGoods2WareHouseParams) => {
    return async function(dispatch: Dispatch<any>, getState: any) {
        const anchorId = getState()?.anchorData?.anchorInfo?.anchorId; // id

        const goodsIdList = params.goodIdsNeed2Del || [];
        return api.apiDelGroupGoods({
            goodsIdList,
            anchorId
        })
            .then(r => {
                const isSucceed = r && r.code === 200 && r.success;

                if (isSucceed) {

                    const newPlatformGoods = changeIsExit(
                        params.brandGoods,
                        (platformGood) => goodsIdList.indexOf(platformGood.goodsId) !== -1,
                        false,
                    );
                    console.log(newPlatformGoods, 'newPlatformGoods')

                    return Promise.resolve(newPlatformGoods)
                }
            })
            .catch(err => {
                console.log(`addGoods2ShowCase error: ${err}`)
                return Promise.resolve(false);
            })
    }
}

/**
 * 预组货页面上删除商品
 */
export const delWareHouseGoods = (params: DelGoods2WareHouseParams) => {
    return async function (dispatch: Dispatch<any>, getState: any): Promise<any> {
        const anchorId = getState()?.anchorData?.anchorInfo?.anchorId;
        return api.apiDelGroupGoods({
            ...params,
            anchorId
        })
            .then(r => {
                if(isSucceed(r)) {
                    return Promise.resolve(true);
                }
            })
            .catch(err => {
                // console.log(`delWareHouseGoods error: ${err}`)
                return Promise.resolve(false);
            })
    }
};

/**
 * 预组货添加商品到橱窗
 */
interface AddGroup2WareHouseParams {
    "goodsIdList": Array<number>,
}
export const addGroupHouseGoods = (params: AddGroup2WareHouseParams) => {
    return async function (dispatch: Dispatch<any>, getState: any): Promise<any> {
        const anchorId = getState()?.anchorData?.anchorInfo?.anchorId;
        return api.apiAddAnchorGoods({
            ...params,
            anchorId
        })
            .then(r => {
                if(isSucceed(r)) {
                    return Promise.resolve(true);
                }
            })
            .catch(err => {
                // console.log(`AddGroupHouseGoods error: ${err}`)
                return Promise.resolve(false);
            })
    }
};


/**
 * 预组货删除商品到橱窗
 */
interface DelGroup2WareHouseParams {
    "goodsIdList": Array<number>,
}
export const delGroupHouseGoods = (params: DelGroup2WareHouseParams) => {
    return async function (dispatch: Dispatch<any>, getState: any): Promise<any> {
        const anchorId = getState()?.anchorData?.anchorInfo?.anchorId;
        return api.apiDelAnchorGoods({
            ...params,
            anchorId
        })
            .then(r => {
                if(isSucceed(r)) {
                    return Promise.resolve(true);
                }
            })
            .catch(err => {
                console.log(`DelGroup2WareHouseParams error: ${err}`)
                return Promise.resolve(false);
            })
    }
};


/**
 * 单选 选中/取消 预组货仓库商品
 * // todo: 改成id判断
 */
// export const checkWarehouseGoods = (index: number) => {
//   return async function(dispatch: Dispatch<any>, getState: any): Promise<any> {
//     const warehouseGoods = getState()?.shop?.warehouseGoods || [];
//     const newWarehouseGoods = [...warehouseGoods];

//     if (newWarehouseGoods[index]) {
//       newWarehouseGoods[index].isChecked = !newWarehouseGoods[index].isChecked
//     }


//     dispatch(updateWarehouseGoods(newWarehouseGoods));
//   }
// }

/**
 * 全选/取消 预组货仓库商品
 */
// export const checkAllWarehouseGoods = (isChecked: boolean) => {
//   return async function(dispatch: Dispatch<any>, getState: any): Promise<any> {
//     const warehouseGoods = getState()?.shop?.warehouseGoods || [];
//     const newWarehouseGoods = warehouseGoods.map((good: any) => {
//       return {
//         ...good,
//         isChecked
//       }
//     });

//     dispatch(updateWarehouseGoods(newWarehouseGoods));
//   }
// }

/**
 * 添加成功 修改isExited字段
 */
// export const isExitedHandler = (isChecked: boolean) => {
//   return async function(dispatch: Dispatch<any>, getState: any): Promise<any> {

//     const warehouseGoods = getState()?.shop?.warehouseGoods || [];
//     const newWarehouseGoods = warehouseGoods.map((good: any) => {
//       return {
//         ...good,
//         isChecked
//       }
//     });

//     dispatch(updateWarehouseGoods(newWarehouseGoods));
//   }
// }

/**
 * 更新预组货仓库商品
 */
export const updateWarehouseGoods = (warehouseGoods: any) => {
  return {type: shopActionType.UPDATE_WAREHOUSE_GOODS, payload: {warehouseGoods}};
}


// tools
/**
 * 加工原数据
 * 加上isChecked字段
 * @params: {Array} dataList - 预组货列表原数据
 * @params: {Array} checkList - 本地操作选择的
 * @params: {function} isMatchedGood - 是否匹配
 */
export const goodsCheckedFormat = (dataList: Array<any>, checkList?: Array<any>, isMatch?: (g?: any) => boolean) => {
  // 本地选择过之后刷新, format数据
  if (checkList) {
    const checked = checkList.filter(c => c.isChecked)
    const result: Array<any> = [];

    dataList.forEach(d => {
      console.log(d, 'ddddd')
      console.log(checked, 'checked')
      const matchedGood = isMatch ? isMatch(d) : checked.find(o => (o.goodsId === d.goodsId && !!o.goodsId)) // todo: 标识
      if (matchedGood) {
        result.push({...d, isChecked: matchedGood.isChecked})
      } else {
        result.push(d)
      }
    })

    return result;
  }

  // 本地没有选择过, format数据默认未选中
  return dataList.map((d: any) => {
    return {
      ...d,
      isChecked: false
    }
  });
}

/**
 * 修改是否添加
 * @param list
 * @param isMatch
 * @param isAdd
 */
export const changeIsExit = (list: Array<any>, isMatch: (v: any) => boolean, isAdd?: boolean) => {
  if (!list || !list.map) {
    return list;
  };

  console.log(list, 'llisttttt')
  return list.map((good) => {
    const safeGood = good || EMPTY_OBJ;
    // console.log(safeGood, 'safeGood')
    // console.log(list, 'list')
    // console.log(isMatch(safeGood), 'isMatch(safeGood)')
    if (isMatch(safeGood)) {
      return {...safeGood, isExist: isAdd ? 1 : 2}
    }

    return good
  })
}

