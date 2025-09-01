// pages/user/user.js
const config = require('../../utils/config.js')
const shareUtils = require('../../utils/share.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoggedIn: false,
    userInfo: {
      avatar: '',
      nickname: '',
      userType: 0
    },
    collectionCount: 0,
    courseCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 启用分享菜单
    shareUtils.enableShareMenu()
    this.checkLoginStatus()
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
    this.checkLoginStatus()
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
    return shareUtils.getShareConfig('user', 'friend')
  },

  // 分享到朋友圈
  onShareTimeline() {
    return shareUtils.getShareConfig('user', 'timeline')
  },

  // 添加到收藏
  onAddToFavorites() {
    return shareUtils.getShareConfig('user', 'favorite')
  },

  // 复制链接
  copyPageLink() {
    shareUtils.copyLink('user', { from: 'miniprogram' })
  },

  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token')
    
    if (userInfo && token) {
      this.setData({ 
        isLoggedIn: true,
        userInfo 
      })
      // this.getCollectionCount() // 接口不存在，暂时注释
      // this.getCourseCount() // 接口不存在，暂时注释
    } else {
      this.setData({ 
        isLoggedIn: false,
        userInfo: {
          avatar: '',
          nickname: '',
          userType: 0
        },
        collectionCount: 0,
        courseCount: 0
      })
    }
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/auth'
    })
  },

  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    } else {
      this.setData({
        userInfo: {
          nickName: '未登录用户',
          avatarUrl: '默认头像URL'
        }
      })
      wx.showToast({
        title: '登录后享受更多功能',
        icon: 'none',
        duration: 2000
      })
    }
  },

  goToCardDetail() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      this.goToLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/card-detail/card-detail'
    })
  },

  goToCompleteProfile() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      this.goToLogin()
      return
    }
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
      url: `${config.baseURL}/knowledge/user/logout`,
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

        // 更新页面状态为未登录
        this.checkLoginStatus()
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
  },

  // 获取收藏数量
  // getCollectionCount() {
  //   const token = wx.getStorageSync('token');
  //   const userInfo = wx.getStorageSync('userInfo');

  //   if (!token || !userInfo) {
  //     return;
  //   }

  //   wx.request({
  //     url: `${config.baseURL}/knowledge/article/collection/count`,
  //     method: 'GET',
  //     header: {
  //       'Authorization': `Bearer ${token}`
  //     },
  //     success: (res) => {
  //       if (res.data.code === 200) {
  //         this.setData({
  //           collectionCount: res.data.data || 0
  //         });
  //       }
  //     }
  //   });
  // },

  // 跳转到收藏文章列表
  goToCollections() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      this.goToLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/collection/collection'
    });
  },

  // 跳转到我的课程页面
  goToMyCourse: function() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      this.goToLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/my-course/my-course'
    })
  },

  // 获取课程数量
  getCourseCount: function() {
    const token = wx.getStorageSync('token')
    
    if (!token) {
      return;
    }
    
    wx.request({
      url: 'http://192.168.1.93:8100/knowledge/user/courses/count',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            courseCount: res.data.data
          })
        }
      }
    })
  },

  goToPromotion() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      this.goToLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/promotion/promotion'
    });
  },
})