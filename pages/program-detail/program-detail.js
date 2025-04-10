Page({
  data: {
    projectId: '',
    projectDetail: {},
    loading: true,
    error: false,
    errorMsg: '加载失败，请重试'
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        projectId: options.id
      })
      this.loadProjectDetail()
    } else {
      this.setData({
        loading: false,
        error: true,
        errorMsg: '项目ID不存在'
      })
    }
  },

  // 加载项目详情
  loadProjectDetail: function() {
    this.setData({
      loading: true,
      error: false
    })

    wx.request({
      url: `https://know-admin.9000aigc.com/knowledge/projects/${this.data.projectId}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log('项目详情响应:', res.data)
        
        if (res.data.code === 200 && res.data.data) {
          this.setData({
            projectDetail: res.data.data,
            loading: false
          })
        } else {
          this.setData({
            loading: false,
            error: true,
            errorMsg: res.data.message || '获取项目详情失败'
          })
        }
      },
      fail: (err) => {
        console.error('请求失败:', err)
        this.setData({
          loading: false,
          error: true,
          errorMsg: '网络错误，请检查网络连接'
        })
      }
    })
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  
  // 分享
  onShareAppMessage: function() {
    return {
      title: this.data.projectDetail.title || '项目详情',
      path: `/pages/program-detail/program-detail?id=${this.data.projectId}`
    }
  }
}) 