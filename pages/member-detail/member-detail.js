Page({
  data: {
    statusBarHeight: 20,
    memberInfo: null,
    defaultAvatar: 'https://mini.9000aigc.com/assets/images/default-avatar.png'
  },

  onLoad(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });

    // 直接从参数中获取会员信息
    if (options.memberInfo) {
      try {
        const memberInfo = JSON.parse(decodeURIComponent(options.memberInfo));
        this.setData({ memberInfo });
      } catch (error) {
        console.error('解析会员信息失败：', error);
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      }
    }
  },

  // 返回上一页
  onBack() {
    wx.navigateBack();
  }
}); 