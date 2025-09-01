const shareUtils = require('../../../utils/share.js')

Page({
  data: {
    qrcodeUrl: 'https://miniknowledge-1323732041.cos.ap-guangzhou.myqcloud.com/assets/images/order_kefu.jpg',
    pageTitle: '客服二维码'
  },

  onLoad(options) {
    // 启用分享菜单
    shareUtils.enableShareMenu()
  },

  // 返回首页
  goBack() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },



  // 分享给朋友
  onShareAppMessage(options) {
    return {
      title: '客服二维码 - 联系我们获取更多服务',
      path: '/pages/display/kefu-qrcode/kefu-qrcode',
      imageUrl: this.data.qrcodeUrl
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '客服二维码 - 联系我们获取更多服务',
      query: 'source=timeline',
      imageUrl: this.data.qrcodeUrl
    }
  },

  // 收藏
  onAddToFavorites() {
    return {
      title: '客服二维码',
      imageUrl: this.data.qrcodeUrl,
      query: 'source=favorite'
    }
  }
})