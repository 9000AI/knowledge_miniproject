Page({
  data: {
    currentTab: 0  // 当前选中的选项卡索引
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
  }
})
