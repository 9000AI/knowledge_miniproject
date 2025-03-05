Component({
  properties: {
  },
  
  data: {
    courses: [], // 存储课程列表
    loading: false,
    hasMore: true,
    nextId: '0',  // 分页游标
    userType: 0,  // 用户类型，默认为普通用户
  },

  lifetimes: {
    attached() {
      // 获取用户信息
      const userInfo = wx.getStorageSync('userInfo')
      this.setData({
        userType: userInfo?.userType || 0
      })
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
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${wx.getStorageSync('token')}`
          },
          data: {
            size: 20,
            price: 1,  // 付费课程
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
        console.log('付费课程请求成功:', res.data)
        if(res.data.code === 200) {
          const { list, hasMore, nextId } = res.data.data
          
          // 处理数据，确保格式一致
          const formattedList = list.map(item => ({
            ...item,
            teacherInfo: item.teacherInfo || item.teacher || '未知', // 兼容不同的字段名
            coverImage: item.coverImage || item.cover || '', // 兼容不同的字段名
            description: item.description || item.desc || '', // 兼容不同的字段名
            // 根据用户类型显示不同价格
            displayPrice: this.data.userType === 1 ? item.memberPrice : item.price
          }))
          
          // 追加新数据到现有列表
          this.setData({
            courses: [...this.data.courses, ...formattedList],
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
        console.error('加载付费课程失败:', err)
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
      
      console.log('付费课程点击:', {id, title, coverImage, description, teacherInfo})
      
      wx.navigateTo({
        url: `/pages/lesson/lesson?id=${id}&title=${encodeURIComponent(title || '课程详情')}&cover=${encodeURIComponent(coverImage || '')}&desc=${encodeURIComponent(description || '')}&teacher=${encodeURIComponent(teacherInfo || '未知')}`
      })
    }
  }
}) 