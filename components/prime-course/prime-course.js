Component({
  properties: {
  },
  
  data: {
    courses: [], // 存储课程列表
    loading: false,
    hasMore: true,
    nextId: '0'  // 分页游标
  },

  lifetimes: {
    attached() {
      this.loadCourses() // 组件加载时获取课程
    }
  },

  methods: {
    // 加载课程列表
    loadCourses() {
      if(this.data.loading || !this.data.hasMore) return
      
      this.setData({ loading: true })
      
      // 使用Promise包装wx.request
      new Promise((resolve, reject) => {
        wx.request({
          url: 'https://know-admin.9000aigc.com/knowledge/course/scroll',
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            size: 20,
            price: 0,  // 会员专区
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
        console.log('请求成功:', res.data) // 添加日志
        if(res.data.code === 200) {
          const { list, hasMore, nextId } = res.data.data
          
          // 追加新数据到现有列表
          this.setData({
            courses: [...this.data.courses, ...list],
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
        console.error('加载课程失败:', err) // 添加详细错误日志
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      })
      .finally(() => {
        this.setData({ loading: false })
      })
    },
    
    // 跳转到课时列表页面
    navigateToLesson(e) {
      const id = e.currentTarget.dataset.id
      const title = e.currentTarget.dataset.title
      const coverImage = e.currentTarget.dataset.cover
      const description = e.currentTarget.dataset.desc
      const teacherInfo = e.currentTarget.dataset.teacher
      
      wx.navigateTo({
        url: `/pages/lesson/lesson?id=${id}&title=${encodeURIComponent(title || '课程详情')}&cover=${encodeURIComponent(coverImage || '')}&desc=${encodeURIComponent(description || '')}&teacher=${encodeURIComponent(teacherInfo || '')}&fromPrime=true`
      })
    }
  }
})
