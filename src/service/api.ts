
import { get, post } from './fetch'
import { get1, post1, get2, post2, liveUpload, uploadWorkMedia } from './fetch/index'
import { UpdateParams } from './fetch/fetchOrigin';

// const HOST_PHP = __DEV__ ? 'https://php.quanpinrtmp.com' : ''
// const HOST_JAVA = __DEV__ ? 'https://java.quanpinrtmp.com' : ''

const HOST_PHP = __DEV__ ? 'https://mobile.quanpinlive.com' : 'https://mobile.quanpinlive.com'
const HOST_JAVA = __DEV__ ? 'https://app.quanpinlive.com' : 'https://app.quanpinlive.com'
// 192.168.8.122:2333

export const SANDPAY_PRE = 'https://cashier.sandpay.com.cn/gw/web/order/create?charset=UTF-8&signType=01' // 杉德支付前缀

/**
 * PHP 接口 ==================================================================
 */
// 获取首页数据
export const apiGetIndexData = () => get1(`${HOST_PHP}/index/index`)
// 首页圈重点商品列表
export const apiGetIndexGoodsList = (data: { pageNo: number; pageSize: number }) => get1(`${HOST_PHP}/index/ajaxGetMore`, data)
// 产业带
export const apiGetBeltList = (data: any) => get1(`${HOST_PHP}/index/getBeltGoods`, data)
// 商品分类标签
export const apiGetClassifyList = () => get1(`${HOST_PHP}/goods/categorylist`)
// 分类商品
export const apiGetClassifyGoodsList = (data: any) => get1(`${HOST_PHP}/goods/ajaxGetMore`, data)
// 品牌店铺列表
export const apiBrandList = (data: any) => get1(`${HOST_PHP}/brand/index`, data)
// 关注/取消关注 品牌店铺
export const apiAttentionBrand = (data: any) => get1(`${HOST_PHP}/brand/attention`, data)
// 品牌店铺详情
export const apiBrandInfo = (data: any) => get1(`${HOST_PHP}/brand/brandCategory`, data)
// 品牌店铺商品列表
export const apiBrandGoodsList = (data: any) => get1(`${HOST_PHP}/brand/brandCategoryGoods`,  data)
// 特卖专区
export const apiSaleList = (data: any) => get1(`${HOST_PHP}/goods/saleList`, data)
// 秒杀
export const apiSeckillList = (data: any) => get1(`${HOST_PHP}/index/seckillList`, data)
// 商品详情
export const apiGoodInfo = (data: any) => get1(`${HOST_PHP}/goods/goodsInfo`, data)
// 精选好物标签
export const apiSelectGoodsTags = () => get1(`${HOST_PHP}/index/jxhtCategory`)
// 精选好物列表
export const apiSelectGoodsList = (data: any) => get1(`${HOST_PHP}/index/ajaxGetJxhw`, data)
// 好物详情
export const apiSelectGoodsInfo = (data: any) => get1(`${HOST_PHP}/index/jxhwInfoOne`, data)
// 喜欢 || 取消喜欢 好物
export const apiGoodsIsLike = (data: any) => get1(`${HOST_PHP}/goods/goodsLike`, data)
// 添加地址
export const apiAddAddr = (data: any) => post1(`${HOST_PHP}/user_address/add_address`, data)
// 地址列表
export const apiAddrList = () => get1(`${HOST_PHP}/user_address/index`)
// 删除地址
export const apiDelAddr = (data: any) => get1(`${HOST_PHP}/user_address/delete_address`, data)
// 修改地址
export const apiEditAddr = (data: any) => post1(`${HOST_PHP}/user_address/edit_address`, data)
// 加入购物车
export const apiAddCart = (data: any) => get1(`${HOST_PHP}/cart/addCart`, data)
// 购物车列表
export const apiCartList = () => get1(`${HOST_PHP}/cart/index`)
// 从购物车删除
export const apiDelCartItem = (data: any) => get1(`${HOST_PHP}/cart/delCart/`, data)
// 购物车发生改变
export const apiChangeCart = (data: any) => post1(`${HOST_PHP}/cart/changeUserCart`, data)
// 发表作品 获取添加商品列表
export const apiAddGoods = (data: any) => get1(`${HOST_PHP}/goods/addGoods`, data)
// 首页搜索
export const apiSearch = (data: any) => get1(`${HOST_PHP}/Goods/getGoodsList`, data)
// 我的收藏
export const apiGetEnshrine = (data: any) => get1(`${HOST_PHP}/goods/getEnshrine`, data)
// 我关注的店铺
export const apiGetAttention = (data: any) => get1(`${HOST_PHP}/brand/getAttention`, data)
// 实名认证
export const apiRealName = (data: any) => post1(`${HOST_PHP}/user/authentication`, data)

/**
 * JAVA 接口 ==================================================================
 */
// 获取 token
export const apiGetToken = (data: any) => post1(`${HOST_JAVA}/miniApp/login`, data)
// 发送验证码
export const apiSendVerCode = (data: any) => get1(`${HOST_JAVA}/user/sendAppMessage`, data)
// 更新用户信息
export const apiUpdateUserInfo = (data: any) => post1(`${HOST_JAVA}/miniApp/updateUserInfo`, data)
// 注册 & 登录
export const apiLogin = (data: any) => post1(`${HOST_JAVA}/user/appRegisterOrLogin`, data)
// 我的页面
export const apiGetUserData = () => get1(`${HOST_JAVA}/user/getUserInfo`)
// 发现模块 获取作品
export const apiGetWorks = (data: any) => post1(`${HOST_JAVA}/find/getWorks`, data)
// 获取发现详情
export const apiGetWorksDetailInfo = async (data: any) => post1(`${HOST_JAVA}/find/getWorksDetailInfo`, data)
// 查询优惠金额 （预生成订单）
export const apiGetSellerDiscount = (data: any) => post1(`${HOST_JAVA}/order/getSellerDiscount`, data)
// 发布作品
export const apiPublishWorks = (data: any) => post1(`${HOST_JAVA}/find/publishWorks`, data)
// 关注/取消关注作品
export const apiFollowWorks = (data: any) => post1(`${HOST_JAVA}/find/followWorks`, data)
// 发布作品评论
export const apiPublishWorksComment = (data: any) => post1(`${HOST_JAVA}/find/publishWorksComment`, data)
// 发布作品评论回复
export const apiPublishWorksReply = (data: any) => post1(`${HOST_JAVA}/find/publishWorksReply`, data)
// 获取作品评论更多回复
export const apiGetMoreReply = (data: any) => post1(`${HOST_JAVA}/find/getMoreReply`, data)
// 获取作品更多评论
export const  apiGetMoreComment = (data: any) => post1(`${HOST_JAVA}/find/getMoreComment`, data)
// 发现模块搜索
export const apiSearchWork = (data: any) => post1(`${HOST_JAVA}/find/searchWorks`, data)
// 创建订单
export const apiCreateOrder = (data: any) => post2(`${HOST_JAVA}/order/create`, data)
// 获取订单列表
export const apiGetOrderList = (data: any) => get1(`${HOST_JAVA}/order/getOrderList`, data)
// 获取订单数量
export const apiGetOrderCount = () => get1(`${HOST_JAVA}/order/getOrderCountStatistics`)
// 取消订单
export const apiCancelOrder = (data: any) => get1(`${HOST_JAVA}/order/cancelOrder`, data)
 // 确认收货
export const apiConfirmReceiveGoods = (data: any) => get1(`${HOST_JAVA}/order/confirmReceiveGoods`, data)
// 订单发起支付
export const apiPayOrder = (data: any) => get2(`${HOST_JAVA}/order/payOrder`, data)
// 提醒发货
export const apiReminderDeliverGoods = (data: any) => get1(`${HOST_JAVA}/order/reminderDeliverGoods`, data)
// 延长收货
export const apiExtendReceiveGoods = (data: any) => get1(`${HOST_JAVA}/order/extendReceiveGoods`, data)
// 获取订单详情
export const apiGetOrderDetail = (data: any) => get1(`${HOST_JAVA}/order/getOrderDetail`, data)
// 获取充值信息
export const apiGetRechargeInfo = (data: any) => get1(`${HOST_JAVA}/miniApp/getRechargeInfo`, data)
// 查询邮费
export const apiGetCalCarriage = (data: any) => post1(`${HOST_JAVA}/order/calCarriage`, data)
// 查询未使用的优惠券
export const apiGetCouponList = () => get1(`${HOST_JAVA}/coupons/unusedList`)
// 获取可领取优惠券列表
export const apiGetUnclaimedCoupons = (data: any) => get1(`${HOST_JAVA}/coupons/couponsList`, data)
// 领取优惠券
export const apiGetCoupon = (data: any) => get1(`${HOST_JAVA}/coupons/getCoupins`, data)
// 获取我喜欢的内容
export const apiGetUserFavorite = (data: any) => post1(`${HOST_JAVA}/user/getUserFavorite`, data)
// 发现详情 点赞
export const apiGiveLaud = (data: any) => post1(`${HOST_JAVA}/find/giveLaud`, data)
// 我的作品
export const apiGetUserWorks = (data: any) => post1(`${HOST_JAVA}/user/getUserWorksInfo`, data)
// 管理我的作品
export const apiWorksManage = (data: any) => post1(`${HOST_JAVA}/user/userWorksManage`, data)
// 查询商品的优惠相关信息
export const apiGetOrderDiscountDetail = (data: any) => post1(`${HOST_JAVA}/order/getOrderDiscountDetail`, data)
// 提交售后申请
export const apiCreateReturnOrder = (data: any) => post1(`${HOST_JAVA}/order/createReturnGoods`, data)
// 售后订单详情
export const apiReturnOrderDetail = (data: any) => get1(`${HOST_JAVA}/order/getAfterSalesDetail`, data)
// 售后订单列表
export const apiGetReturnOrderList = (data: any) => get1(`${HOST_JAVA}/order/getAfterSalesList`, data)
// 取消售后申请
export const apiCancelReturnOrder = (data: any) => get1(`${HOST_JAVA}/order/cancelAfterSalesApply`, data)
// 卖家售后发货
export const apiBuyerDeliverGoods = (data: any) => post1(`${HOST_JAVA}/order/buyerDeliverGoods`, data)
// 获取售后发货支持的快递列表
export const apiGetShippingList = () => get1(`${HOST_JAVA}/order/getShippingList`)
// 退出
export const apiLogout = (data: any) => get1(`${HOST_JAVA}/user/logout`, data)
// 查看物流
export const apiQueryExpress = (data: any) => get1(`${HOST_JAVA}/order/queryExpress`, data)
// 分享生成图片
export const apiCreatePoster = (data: any) => get1(`${HOST_JAVA}/userShare/userGoodShare`, data)
// 发布作品 上传文件
export const apiWorkUpload = (data: any) => uploadWorkMedia(`${HOST_JAVA}/find/uploadFile`, data)
// 查询订单支付状态
export const apiQueryOrderPayStatus = (data: any) => get1(`${HOST_JAVA}/order/queryOrderPayStatus`, data)
// 检查更新
export const apiCheckUpdate = (data: { ver: string, appType: number }) => get1(`${HOST_JAVA}/suppliers/versionCheck`, data)
// 微信登录
export const apiWeChatLogin = (data: { code: string }) => post1(`${HOST_JAVA}/user/appWecharLogin`, data)
// 微信注册
export const apiWeChatRegister = (data: {
  userTel: string,
  unionId: string,
  inviteCode: string,
  code: string
}) => post1(`${HOST_JAVA}/user/appWecharRegister`, data)

/*
 * 主播相关接口 ==========================================================================================
 */
// 成为主播
export const apiBuyAnchor = (data: any) => post2(`${HOST_JAVA}/order/buyAnchor`, data)
// 成为经纪人
export const apiBuyBroker = (data: any) => post2(`${HOST_JAVA}/order/buyBroker`, data)
// 获取经纪人信息
export const apiGetAgentInfo = () => get2(`${HOST_JAVA}/user/getAgentInfo`)
// 主播添加商品到主播店铺
export const apiAddAnchorGoods = (data: any) => post2(`${HOST_JAVA}/anchor/addAnchorGoods`, data)
// 主播添加商品到主播预组货
export const apiAddGroupGoods = (data: any) => post2(`${HOST_JAVA}/anchor/addGroupGoods`, data)
// 开播后确认是否存在直播封面
export const apiAffirmCover = (data: any) => post2(`${HOST_JAVA}/anchor/affirmCover`, data)
// 直播重新组货
export const apiAnewAddLiveGoods = (data: any) => post2(`${HOST_JAVA}/anchor/anewAddLiveGoods`, data)
// 新增或修改寄回地址
export const apiAuReturnedAddress = (data: any) => post(`${HOST_JAVA}/anchor/auReturnedAddress`, data)
// 主播删除预组货商品
export const apiDelGroupGoods = (data: any) => post2(`${HOST_JAVA}/anchor/delGroupGoods`, data)
// 删除主播直播回放
export const apiDelLivePlayback = (data: any) => post(`${HOST_JAVA}/anchor/delLivePlayback`, data)
// 删除寄回地址
export const apiDelReturnedAddress = (data: any) => post(`${HOST_JAVA}/anchor/delReturnedAddress`, data)
// 我的预告列表
export const apiGetAdvanceList = (data: any) => get2(`${HOST_JAVA}/anchor/getAdvanceList`, data)
// 主播预组货(店铺)添加商品品牌商品列表
export const apiGetBrandGoodsList = (data: any) => post(`${HOST_JAVA}/anchor/getBrandGoodsList`, data)
// 主播添加预组货分类品牌数据
export const apiGetCatBrandAll = (data: any) => get2(`${HOST_JAVA}/anchor/getCatBrandAll`, data)
// 主播预组货(店铺)商品列表
export const apiGetGroupGoods = (data: any) => post1(`${HOST_JAVA}/anchor/getGroupGoods`, data)
// 主播直播数据列表
export const apiGetLiveDataList = (data: any) => post1(`${HOST_JAVA}/anchor/getLiveDataList`, data)
// 我的直播列表
export const apiGetLiveList = (data: any) => get2(`${HOST_JAVA}/anchor/getLiveList`, data)
// 我的直播列表 一个月
export const apiGetLiveListAll = (data: any) => get2(`${HOST_JAVA}/anchor/getLiveDataAll`, data)
// 分页查询寄回地址列表
export const apiGetReturnAddressList = (data: any) => post(`${HOST_JAVA}/anchor/getReturnAddressList`, data)
// 主播消息通知列表
export const apiGetUserChatList = (data: any) => get2(`${HOST_JAVA}/anchor/getUserChatList`, data)
// 主播我的主页信息
export const apiAnchorHomePage = (data: any) => get1(`${HOST_JAVA}/anchor/HomePage`, data)
// 直播上传文件
export const apiLiveUploadFile = (file: UpdateParams) => liveUpload(`${HOST_JAVA}/anchor/liveUploadFile`, file)
// 直播发布预告
export const apiReleaseNotice= (data: any) => post2(`${HOST_JAVA}/anchor/releaseNotice`, data)
// 直播间商品管理数据列表
export const apiSelLiveGoods= (data: any) => get2(`${HOST_JAVA}/anchor/selLiveGoods`, data)
// 准时开播页面展示数据
export const apiSelStartLive= (data: any) => post2(`${HOST_JAVA}/anchor/selStartLive`, data)
// 选择商品开始直播
export const apiStartLive= (data: any) => post2(`${HOST_JAVA}/anchor/startLive`, data)
// 结束直播
export const apiCloseLive= (data: any) => get2(`${HOST_JAVA}/anchor/closeLive`, data)
// 继续直播 (只进入)
export const apiAnchorToLive= (data: any) => get2(`${HOST_JAVA}/anchor/anchorToLive`, data)
// 是否在直播
export const apiIsWorkLiveNow = (data: any) => get2(`${HOST_JAVA}/anchor/isWorkLiveNow`, data)
// 主播在预组货取消添加店铺商品
export const apiDelAnchorGoods = (data: any) => post2(`${HOST_JAVA}/anchor/delAnchorBrandGoods`, data)
// 获取imUserSig
export const apiGetUserSig = (data: any) => get2(`${HOST_JAVA}/anchor/getUserSig`, data)
// 更新直播间浏览量
export const apiUpdBrowseNum = (data: any) => get2(`${HOST_JAVA}/anchor/updBrowseNum`, data)
// 查询商品是否在售
export const isSaleGoods = (data: any) => get2(`${HOST_JAVA}/anchor/isSaleGoods`, data)


/**
 * 用户直播相关接口 (观看端) ==============================================================
 */
// 添加订单的直播间id
export const apiAddOrderLiveId = (data: any) => get(`${HOST_JAVA}/userLive/addOrderLiveId`, data)
// 主播页详情
export const apiAnchorParticular = (data: any) => get2(`${HOST_JAVA}/userLive/anchorParticular`, data)
// 关注/取关主播
export const apiAttentionAnchor = (data: any) => post2(`${HOST_JAVA}/userLive/attentionAnchor`, data)
// 点击进入直播间
export const apiEnterLive = (data: any) => get2(`${HOST_JAVA}/userLive/enterLive`, data)
// 获取精选/关注直播列表
export const apiGetLiveStreamList = (data: any) => post2(`${HOST_JAVA}/userLive/getLiveStreamList`, data)
// 直播间点亮红心
export const apiLiveLike = (data: any) => get2(`${HOST_JAVA}/userLive/liveLike`, data)
// 我的关注列表
export const apiMyAttentionList = (data: any) => get2(`${HOST_JAVA}/userLive/myAttentionList`, data)
// 搜索直播列表
export const apiSearchLiveStreamList = (data: any) => get1(`${HOST_JAVA}/userLive/searchLiveStreamList`, data)
// 直播间的购物袋
export const apiShoppingBag = (data: any) => get2(`${HOST_JAVA}/userLive/shoppingBag`, data)
// 用户直播列表轮播图
export const apiUserLiveBanner = () => post1(`${HOST_JAVA}/userLive/userLiveBanner`)
// 获取观看人数
export const apiGetLiveViewNum = (data: any) => get2(`${HOST_JAVA}/userLive/getLiveViewNum`, data)
// 上传用户头像本地base64
export const apiUploadFile = (data: any) => post1(`${HOST_JAVA}/user/uploadFile`, data)

/**
 * 资产相关的接口 ==============================================================
 */
// 绑定银行卡
export const apiBindingBankCard = (data: any) => post2(`${HOST_JAVA}/assets/bindingBankCard`, data)
// 查询用户账单列表
export const apiGetUserAssetsRecords = (data: any) => post2(`${HOST_JAVA}/assets/getUserAssetsRecords`, data)
// 查询用户资产信息
export const apiGetUserAssetsStatistics = () => get1(`${HOST_JAVA}/assets/getUserAssetsStatistics`)
// 查询用户银行卡列表
export const apiGetUserBankCards = () => get1(`${HOST_JAVA}/assets/getUserBankCards`)
// 发起提现申请
export const apiWithdraw = (data: any) => post2(`${HOST_JAVA}/assets/withdraw`, data)