Page({
  data: {
    promotionId: '',
    userInfo: null
  },

  onLoad() {
    // 页面加载时获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    console.log('当前用户信息：', userInfo); // 打印用户信息，方便调试
    
    if (!userInfo || !userInfo.id) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/auth/auth'
            });
          }, 1500);
        }
      });
      return;
    }

    this.setData({
      userInfo: userInfo
    });
  },

  // 监听输入框值变化
  onInput(e) {
    const value = e.detail.value.trim();
    console.log('输入的值：', value); // 添加日志查看输入值
    this.setData({
      promotionId: value
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 提交推广
  submitPromotion() {
    const finderId = this.data.promotionId;
    
    if (!finderId) {
      wx.showToast({
        title: '请输入视频号ID',
        icon: 'none'
      });
      return;
    }

    // 检查用户ID
    if (!this.data.userInfo || !this.data.userInfo.id) {
      wx.showToast({
        title: '用户信息无效，请重新登录',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/auth/auth'
            });
          }, 1500);
        }
      });
      return;
    }

    wx.showLoading({
      title: '提交中...'
    });

    const token = wx.getStorageSync('token');

    wx.request({
      url: 'http://192.168.1.93:8100/knowledge/wx/shop/league/promoter/add',
      method: 'POST',
      data: {
        finderId: finderId,
        userId: this.data.userInfo.id  // 使用用户信息中的id
      },
      header: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code === 200) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              setTimeout(() => {
                wx.navigateBack();
              }, 2000);
            }
          });
        } else {
          wx.showToast({
            title: res.data.message || '添加失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (error) => {
        console.error('接口调用失败：', error);
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        });
      }
    });
  }
}); 