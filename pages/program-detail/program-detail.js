const shareUtils = require('../../utils/share.js')
const config = require('../../utils/config.js')

Page({
  data: {
    projectId: '',
    projectDetail: {},
    loading: true,
    error: false,
    errorMsg: '加载失败，请重试'
  },

  onLoad: function(options) {
    // 启用分享菜单
    shareUtils.enableShareMenu()
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
      url: `${config.baseURL}/knowledge/projects/${this.data.projectId}`,
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
  
  // 分享给好友
  onShareAppMessage: function() {
    const { projectDetail, projectId } = this.data
    return {
      title: `${projectDetail.title || '精品项目'} - 项目详情`,
      path: `/pages/program-detail/program-detail?id=${projectId}&source=share`,
      imageUrl: projectDetail.coverImage || 'https://mini.9000aigc.com/assets/images/share-project.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { projectDetail, projectId } = this.data
    return {
      title: `${projectDetail.title || '精品项目'} - 项目详情`,
      query: `id=${projectId}&source=timeline&t=${Date.now()}`,
      imageUrl: projectDetail.coverImage || 'https://mini.9000aigc.com/assets/images/share-project-timeline.png'
    }
  },

  // 添加到收藏
  onAddToFavorites() {
    const { projectDetail, projectId } = this.data
    return {
      title: `${projectDetail.title || '精品项目'} - 项目收藏`,
      imageUrl: projectDetail.coverImage || 'https://mini.9000aigc.com/assets/images/favorite-project.png',
      query: `id=${projectId}&source=favorite&t=${Date.now()}`
    }
  },

  // 复制项目链接
  copyProjectLink() {
    const { projectId, projectDetail } = this.data
    const link = `${shareUtils.getBaseUrl()}/pages/program-detail/program-detail?id=${projectId}&from=copy`
    
    wx.setClipboardData({
      data: link,
      success: () => {
        wx.showToast({
          title: '项目链接已复制',
          icon: 'success',
          duration: 2000
        })
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  }
})