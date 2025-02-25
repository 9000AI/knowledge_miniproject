Page({
  data: {
    courseId: '', // 课程ID
    courseName: '', // 课程名称
    courseInfo: {}, // 课程详细信息
    lessons: [], // 课时列表
    loading: false,
    hasMore: true,
    nextId: '0' // 分页游标
  },

  // 页面加载时获取参数
  onLoad(options) {
    if (options.id) {
      // 先使用传递过来的数据
      this.setData({
        courseId: options.id,
        courseName: options.title ? decodeURIComponent(options.title) : '课程详情',
        courseInfo: {
          title: options.title ? decodeURIComponent(options.title) : '课程详情',
          coverImage: options.cover ? decodeURIComponent(options.cover) : '',
          description: options.desc ? decodeURIComponent(options.desc) : '暂无课程描述',
          teacherInfo: options.teacher ? decodeURIComponent(options.teacher) : '未知'
        }
      })
      
      // 如果没有封面图，再获取课程详情
      if (!options.cover) {
        this.getCourseInfo()
      }
      
      // 加载课时列表
      this.loadLessons()
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },
  
  // 返回上一页
  navigateBack() {
    wx.navigateBack()
  },
  
  // 加载课时列表
  loadLessons() {
    if (this.data.loading || !this.data.hasMore) return
    
    this.setData({ loading: true })
    
    // 使用Promise包装wx.request
    new Promise((resolve, reject) => {
      wx.request({
        url: 'http://192.168.1.93:8100/knowledge/lesson/scroll',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${wx.getStorageSync('token')}`
        },
        data: {
          size: 20,
          courseId: this.data.courseId,
          lastId: this.data.nextId
        },
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
    .then(res => {
      console.log('课时列表请求成功:', res.data)
      if (res.data.code === 200) {
        const { list, hasMore, nextId } = res.data.data
        
        // 追加新数据到现有列表
        this.setData({
          lessons: [...this.data.lessons, ...list],
          hasMore,
          nextId,
          loading: false
        })
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
    .catch(err => {
      console.error('加载课时列表失败:', err)
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
    .finally(() => {
      this.setData({ loading: false })
    })
  },
  
  // 播放课时视频
  playLesson(e) {
    const index = e.currentTarget.dataset.index
    const lesson = this.data.lessons[index]
    
    // 直接播放视频，使用默认视频链接
    wx.navigateTo({
      url: `/pages/video/video?id=${lesson.id}&title=${encodeURIComponent(lesson.title)}&url=${encodeURIComponent(lesson.videoUrl || lesson.coverImage)}&teacher=${encodeURIComponent(this.data.courseInfo.teacherInfo || '未知')}&courseId=${this.data.courseId}`
    })
  },
  
  // 页面上拉触底事件
  onReachBottom() {
    this.loadLessons()
  },
  
  // 获取课程详情
  getCourseInfo() {
    wx.request({
      url: 'http://192.168.1.93:8100/knowledge/course/detail',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      data: {
        id: this.data.courseId
      },
      success: (res) => {
        console.log('课程详情请求成功:', res.data)
        if (res.data.code === 200) {
          this.setData({
            courseInfo: res.data.data || {}
          })
        }
      },
      fail: (err) => {
        console.error('获取课程详情失败:', err)
      }
    })
  }
}) 