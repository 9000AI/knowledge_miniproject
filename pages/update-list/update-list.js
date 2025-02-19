Page({
  data: {
    statusBarHeight: 0, // 状态栏高度
    navBarHeight: 44    // 导航栏高度固定为44px
  },
  
  handleBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  onLoad: function (options) {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    
    // 设置状态栏高度
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
  }
}) 