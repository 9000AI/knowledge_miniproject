const config = require('./config.js')

// 统一的请求拦截器
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    
    // 合并请求头
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }
    
    // 如果有token，添加到请求头
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    wx.request({
      ...options,
      header,
      success: (res) => {
        // 处理 token 失效情况
        if (res.data.code === 401) {
          // 清除本地存储
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          
          // 显示友好提示
          wx.showModal({
            title: '登录已过期',
            content: '您的登录已过期，请重新登录',
            showCancel: false,
            success: () => {
              // 保存当前页面路径
              const pages = getCurrentPages()
              const currentPage = pages[pages.length - 1]
              const url = `/${currentPage.route}`
              wx.setStorageSync('redirect_url', url)
              
              // 跳转到登录页
              wx.reLaunch({
                url: '/pages/auth/auth'
              })
            }
          })
          reject(new Error('token失效'))
          return
        }
        
        resolve(res)
      },
      fail: reject
    })
  })
}

// 导出请求方法
module.exports = {
  request
} 