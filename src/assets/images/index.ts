const images : {
  [key: string]: any
} = {
  // 默认头像
  get userAvatar() {
    return require('../mine-image/default_avatar.png')
  },
  // 默认播封面
  get liveCover() {
    return require('./userAvatar.jpg')
  },
  // 待编辑播封面
  get editLiveCover() {
    return require('./editLiveCover.png')
  },
  // 默认banner
  get liveBanner() {
    return require('./userAvatar.jpg')
  },
  // 默认商品图
  get goodCover() {
    return require('./userAvatar.jpg')
  },
  // 默认直播间背景
  get livingbg() {
    return require('./livingbg.png')
  },
  // 成为主播
  get beAnchorIcon() {
    return require('../be-anchor-image/beAnchorIcon.png')
  },
  // ❤️ 喜欢
  get heart() {
    return require('./heart.png')
  },
  // 直播中icon
  get livingTypeIcon() {
    return require('./livingTypeIcon.png')
  },
  // 回放、预告背景icon
  get liveTypeBgIcon() {
    return require('./liveTypeBgIcon.png')
  },
  // 购物
  get shoppingIcon() {
    return require('./shoppingIcon.png')
  },
  // 转发
  get forwardIcon() {
    return require('./forwardIcon.png')
  },
  // 点赞
  get liveLikeIcon() {
    return require('./liveLikeIcon.png')
  },
  // 用户消息等级tag
  get userLv1() {
    return require('./userLv1.png')
  },
  get userLv2() {
    return require('./userLv2.png')
  },
  get userLv3() {
    return require('./userLv3.png')
  },
  get userLv4() {
    return require('./userLv4.png')
  },
  get userLv5() {
    return require('./userLv4.png')
  },
  get userLv6() {
    return require('./userLv4.png')
  },
  // 发布直播
  get publishLive() {
    return require('./publishLive.png')
  },
  // 发布预告
  get publishTeaser() {
    return require('./publishTeaser.png')
  },
  // 列表缺省
  get emptyList() {
    return require('./emptyList.png')
  },
  // 未选中
  get uncheckedIcon() {
    return require('./unchekedIcon.png')
  },
  // 选中红
  get checkedIcon() {
    return require('./chekedIcon.png')
  },
  // 选中黄
  get checkedYellowIcon() {
    return require('./chekedYellowIcon.png')
  },
  // 滤镜
  get filterIcon() {
    return require('./filter.png')
  },
  // 美颜
  get faceBeautyIcon() {
    return require('./faceBeauty.png')
  },
  // 滤镜
  get editBubbleIcon() {
    return require('./editBubble.png')
  },
  // 美颜
  get anchorShareIcon() {
    return require('./anchorShare.png')
  },
  // 主播-消息
  get liveMessageIcon() {
    return require('./message.png')
  },
  // 主播消息-默认头像
  get messageDefaultAvatar() {
    return require('./messageDefaultAvatar.png')
  },
  // 购物包
  get anchorShoppingIcon() {
    return require('./anchorShopIcon.png')
  },
  // 主播我的组货
  get anchorPieceGoods() {
    return require('./anchorPieceGoods.png')
  },
  // 主播我的店铺
  get anchorShop() {
    return require('./anchorShop.png')
  },
  // 主播店铺商品管理
  get anchorGoodsManage() {
    return require('./anchorGoodsManage.png')
  },
  // 成为经纪人
  get anchorBeAgent() {
    return require('./anchorBeAgent.png')
  },
  // 主播我的直播
  get anchorMyRecords() {
    return require('./anchorMyRecords.png')
  },
  // 主播我的预告
  get anchorMyTrailer() {
    return require('./anchorMyTrailer.png')
  },
  // 主播我的宝贝
  get anchorMyGoods() {
    return require('./anchorMyGoods.png')
  },
  // 主播我的直播数据
  get anchorLiveAnalyze() {
    return require('./anchorLiveAnalyze.png')
  },
  // 主播我的背景
  get anchorMeBg() {
    return require('./anchorMeBg.png')
  },
  // 主播我的店铺背景
  get anchorShopBg() {
    return require('./anchorShopBg.png')
  },
  // 个人店铺订单
  get orderUnpaid() {
    return require('./orderUnpaid.png')
  },
  get orderUnfilled() {
    return require('./orderUnfilled.png')
  },
  get orderWaitForReceiving() {
    return require('./orderWaitForReceiving.png')
  },
  get orderCompleted() {
    return require('./orderCompleted.png')
  },
  get orderAfterSale() {
    return require('./orderAfterSale.png')
  },
  // 直播结束
  get liveEndBg() {
    return require('./liveEndBg.png')
  },
  get liveEndTitle() {
    return require('./liveEndTitle.png')
  },
  get liveEndData() {
    return require('./liveEndData.png')
  },
  get liveEndGoods() {
    return require('./liveEndGoods.png')
  },
  // 店铺资金
  get assetAvailable() {
    return require('./assetAvailable.png')
  },
  get assetHaveSettled() {
    return require('./assetHaveSettled.png')
  },
  get assetWaitForSettle() {
    return require('./assetWaitForSettle.png')
  },
  // 店铺工具
  get toolGoodsManage() {
    return require('./toolGoodsManage.png')
  },
  get toolassetsManage() {
    return require('./toolassetsManage.png')
  },
  get toolAddressManage() {
    return require('./toolAddressManage.png')
  },
  get toolAnchorManage() {
    return require('./toolAnchorManage.png')
  },
  get toolShopEnter() {
    return require('./toolShopEnter.png')
  },
  // 资金图标
  get incomeLive() {
    return require('./incomeLive.png')
  },
  get incomeShop() {
    return require('./incomeShop.png')
  },
  get incomeInvite() {
    return require('./incomeInvite.png')
  },
  // 银行卡背景图
  get bankBgBlue() {
    return require('../bank-card-image/bgBlue.png')
  },
  get bankBgOrange() {
    return require('../bank-card-image/bgOrange.png')
  },
  get bankBgRed() {
    return require('../bank-card-image/bgRed.png')
  },
  get bankBgGreen() {
    return require('../bank-card-image/bgGreen.png')
  },
  // 添加银行卡icon
  get addBankCardIcon() {
    return require('../bank-card-image/add.png')
  },
  get addBankButton() {
    return require('../bank-card-image/bgButton.png')
  },
  // 银行卡icon
  get BOCIcon() {
    return require('../bank-card-image/BOC.png')
  },
  // 主播tabs
  get tabShop() {
    return require('./tabShop.png')
  },
  get tabShopActive() {
    return require('./tabShopActive.png')
  },
  get tabLiveActive() {
    return require('./tabLiveActive.png')
  },
  get tabLive() {
    return require('./tabLive.png')
  },
  get tabMeActive() {
    return require('./tabMeActive.png')
  },
  get tabMe() {
    return require('./tabMe.png')
  },
  // 房间消息是否关注
  get roomMessageUnFollowed() {
    return require('./roomMessageUnFollowed.png')
  },
  get roomMessageFollowed() {
    return require('./roomMessageFollowed.png')
  },
  get iconPlay() {
    return require('./iconPlay.png')
  },
  get iconShare() {
    return require('./iconShare.png')
  },
  get iconDownload() {
    return require('./iconDownload.png')
  },
  get watchLiveCover() {
    return require('./watchLiveCover.png')
  },
  get recordsBgImg() {
    return require('./recordsBgImg.png')
  },
  get iconRemind() {
    return require('./iconRemind.png')
  },
  get iconHasReminded() {
    return require('./iconHasReminded.png')
  },
  // 成为经纪人
  get agentBg() {
    return require('../agent-image/agentBg.png')
  },
  get agentBgTop() {
    return require('../agent-image/agentBgTop.png')
  },
  get agent() {
    return require('../agent-image/agent.png')
  },
  get beAgentBg() {
    return require('../agent-image/beAgentBg.png')
  },
  get beAgent() {
    return require('../agent-image/beAgent.png')
  },
  get wxBg() {
    return require('../agent-image/wxBg.png')
  },
  get wxIcon() {
    return require('../agent-image/wxIcon.png')
  },
  get checkBeAgent() {
    return require('../agent-image/check.png')
  },
  get unCheckBeAgent() {
    return require('../agent-image/unCheck.png')
  },
  get anchorMicrophone() {
      return require('./anchorMicrophone.png')
  }
}

export default images;