// 分享功能通用工具函数
const shareUtils = {
  // 获取小程序基础URL
  getBaseUrl() {
    return 'https://miniknowledge.9000aigc.com'
  },

  // 生成分享配置
  getShareConfig(page, type = 'friend') {
    const configs = {
      index: {
        title: '知识付费平台 - 找资料、做项目、进课程',
        path: '/pages/index/index',
        imageUrl: 'https://mini.9000aigc.com/assets/images/share-index.png'
      },
      program: {
        title: '精品项目集合 - 实战项目经验分享',
        path: '/pages/program/program',
        imageUrl: 'https://mini.9000aigc.com/assets/images/share-program.png'
      },
      course: {
        title: '精品课程 - 会员专区、付费课程',
        path: '/pages/course/course',
        imageUrl: 'https://mini.9000aigc.com/assets/images/share-course.png'
      },
      fire: {
        title: '进圈子 - 热门社群交流',
        path: '/pages/fire/fire',
        imageUrl: 'https://mini.9000aigc.com/assets/images/share-fire.png'
      },
      user: {
        title: '个人中心 - 我的学习空间',
        path: '/pages/user/user',
        imageUrl: 'https://mini.9000aigc.com/assets/images/share-user.png'
      }
    }

    const config = configs[page] || configs.index
    
    // 朋友圈分享特殊处理
    if (type === 'timeline') {
      return {
        title: config.title,
        query: `source=timeline&t=${Date.now()}`,
        imageUrl: config.imageUrl
      }
    }
    
    // 收藏特殊处理
    if (type === 'favorite') {
      return {
        title: config.title,
        imageUrl: config.imageUrl,
        query: `source=favorite&t=${Date.now()}`
      }
    }
    
    // 默认分享给朋友
    return {
      title: config.title,
      path: `${config.path}?source=share&t=${Date.now()}`,
      imageUrl: config.imageUrl
    }
  },

  // 生成分享链接
  generateShareLink(page, params = {}) {
    const baseUrl = this.getBaseUrl()
    const pageMap = {
      index: 'index',
      program: 'program',
      course: 'course',
      fire: 'fire',
      user: 'user'
    }
    
    const pagePath = pageMap[page] || 'index'
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&')
    
    return `${baseUrl}/pages/${pagePath}?${queryString}`
  },

  // 复制链接功能
  copyLink(page, params = {}) {
    const link = this.generateShareLink(page, params)
    
    wx.setClipboardData({
      data: link,
      success: function(res) {
        wx.showToast({
          title: '链接已复制',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(err) {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 2000
        })
        console.error('复制失败:', err)
      }
    })
  },

  // 启用分享菜单
  enableShareMenu() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
}

module.exports = shareUtils