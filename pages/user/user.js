// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时刷新用户信息
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/auth/auth'
            })
          }, 1500)
        }
      })
    }
  },

  goToCompleteProfile() {
    // 跳转到资料完善页面
    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          this.logout()
        }
      }
    })
  },

  logout() {
    wx.showLoading({
      title: '退出中...',
      mask: true
    })

    wx.request({
      url: 'http://192.168.1.93:8100/knowledge/user/logout',
      method: 'POST',
      success: () => {
        // 清除本地存储的用户信息和token
        wx.removeStorageSync('userInfo')
        wx.removeStorageSync('token')
        
        wx.showToast({
          title: '已退出登录',
          icon: 'success',
          duration: 2000
        })

        // 延迟跳转到登录页
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/auth/auth'
          })
        }, 1500)
      },
      fail: (err) => {
        console.error('退出登录失败:', err)
        wx.showToast({
          title: '退出失败，请重试',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }
})