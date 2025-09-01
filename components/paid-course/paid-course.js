const { request } = require('../../utils/request.js')
const config = require('../../utils/config.js')

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
      console.log('组件加载')
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
    async loadCourses() {
      if(this.data.loading || !this.data.hasMore) return
      
      this.setData({ loading: true })
      console.log('开始加载课程')
      
      try {
        const res = await new Promise((resolve, reject) => {
          wx.request({
            url: `${config.baseURL}/knowledge/course/scroll`,
            method: 'POST',
            header: {
              'Content-Type': 'application/json'
            },
            data: {
              size: 20,
              price: 1
            },
            success: resolve,
            fail: reject
          })
        })

        console.log('付费课程请求成功，原始数据:', res.data)
        
        if(res.data.code === 200) {
          const { list, hasMore } = res.data.data
          
          // 处理数据，确保格式一致
          const formattedList = list.map(item => {
            const formatted = {
              id: item.id,
              title: item.title || '',
              coverImage: item.coverImage || item.cover || '', 
              description: item.description || item.desc || '',
              teacherInfo: item.teacherInfo || item.teacher || '未知',
              displayPrice: this.data.userType === 1 ? (item.memberPrice || 0) : (item.price || 0),
              memberPrice: item.memberPrice || 0,
              price: item.price || 0
            }
            return formatted
          })
          
          console.log('格式化后的数据:', formattedList)
          
          // 追加新数据到现有列表
          this.setData({
            courses: [...this.data.courses, ...formattedList],
            hasMore,
            loading: false
          }, () => {
            console.log('数据更新后的课程列表:', this.data.courses)
          })
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          })
        }
      } catch (err) {
        console.error('加载付费课程失败:', err)
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      } finally {
        this.setData({ loading: false })
      }
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