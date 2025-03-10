// pages/user/user.js
const config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    this.getUserInfo();
    this.getCollectionCount(); // 获取收藏数量
    this.getCourseCount();
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

  goToCardDetail() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/card-detail/card-detail'
    })
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
  },

  // 获取收藏数量
  getCollectionCount() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    if (!token || !userInfo) {
      wx.navigateTo({ url: '/pages/auth/auth' });
      return;
    }

    wx.request({
      url: `${config.baseURL}/knowledge/article/collection/count`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            collectionCount: res.data.data || 0
          });
        }
      }
    });
  },

  // 跳转到收藏文章列表
  goToCollections() {
    wx.navigateTo({
      url: '/pages/collection/collection'
    });
  },

  // 跳转到我的课程页面
  goToMyCourse: function() {
    wx.navigateTo({
      url: '/pages/my-course/my-course'
    })
  },

  // 获取课程数量
  getCourseCount: function() {
    const token = wx.getStorageSync('token')
    
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
})