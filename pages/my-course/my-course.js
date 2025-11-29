Page({
  data: {
    courses: [],
    pageSize: 10,
    lastId: '',
    hasMore: true,
    loading: false,
    isRefreshing: false
  },
  
  onLoad: function() {
    this.loadCourses()
  },

  onShow: function() {
    // 页面显示时刷新数据
    this.loadCourses(true)
  },

  // 加载课程列表
  loadCourses: function(refresh = false) {
    if (this.data.loading || (!refresh && !this.data.hasMore)) return
    
    this.setData({ loading: true })
    
    const token = wx.getStorageSync('token')
    
    wx.request({
      url: 'http://192.168.1.93:8100/knowledge/user/courses/scroll',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: {
        lastId: refresh ? '' : this.data.lastId,
        pageSize: this.data.pageSize
      },
      success: (res) => {
        if (res.data.code === 401) {
          wx.showModal({
            title: '登录已过期',
            content: '您的登录已过期，请重新登录',
            showCancel: true,
            cancelText: '稍后登录',
            confirmText: '去登录',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/auth/auth'
                })
              }
            }
          })
          return
        }
        if (res.data.code === 200) {
          const { list, hasMore, nextId } = res.data.data
          
          // 格式化时间
          const formattedList = list.map(item => ({
            ...item,
            createTime: item.createTime.split('T')[0]
          }))
          
          this.setData({
            courses: refresh ? formattedList : [...this.data.courses, ...formattedList],
            hasMore,
            lastId: nextId,
            loading: false,
            isRefreshing: false
          })
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          })
          this.setData({
            loading: false,
            isRefreshing: false
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        this.setData({
          loading: false,
          isRefreshing: false
        })
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadCourses(true)
    wx.stopPullDownRefresh()
  },

  // 触底加载更多
  onReachBottom: function() {
    if (this.data.hasMore) {
      this.loadCourses()
    }
  },

  // 跳转到课程详情
  goToCourseDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/course-detail/course-detail?id=${id}`
    })
  }
})