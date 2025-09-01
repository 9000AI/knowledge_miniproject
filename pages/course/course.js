const shareUtils = require('../../utils/share.js')

Page({
  data: {
    currentTab: 0  // 当前选中的选项卡索引
  },

  onLoad() {
    // 启用分享菜单
    shareUtils.enableShareMenu()
  },

  // 切换选项卡
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if (this.data.currentTab !== index) {
      this.setData({
        currentTab: index
      });
    }
  },

  // 监听页面触底事件
  onReachBottom() {
    if (this.data.currentTab === 0) {
      // 会员专区触底加载
      const primeCourse = this.selectComponent('#prime-course')
      if (primeCourse) {
        primeCourse.loadCourses()
      }
    } else if (this.data.currentTab === 1) {
      // 付费课程触底加载
      const paidCourse = this.selectComponent('#paid-course')
      if (paidCourse) {
        paidCourse.loadCourses()
      }
    }
  },

  // 分享给好友
  onShareAppMessage(options) {
    return shareUtils.getShareConfig('course', 'friend')
  },

  // 分享到朋友圈
  onShareTimeline() {
    return shareUtils.getShareConfig('course', 'timeline')
  },

  // 添加到收藏
  onAddToFavorites() {
    return shareUtils.getShareConfig('course', 'favorite')
  },

  // 复制链接
  copyPageLink() {
    shareUtils.copyLink('course', { from: 'miniprogram' })
  }
})
