const config = require('./config.js')

// 请求队列
let requestQueue = []
let isRefreshing = false

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

    // 创建请求任务
    const executeRequest = () => {
      wx.request({
        ...options,
        header,
        success: (res) => {
          // 处理 token 失效情况
          if (res.data.code === 401) {
            // 如果已经在刷新token，则将请求加入队列
            if (isRefreshing) {
              requestQueue.push(() => {
                executeRequest()
              })
              return
            }

            isRefreshing = true
            
            // 清除本地存储
            wx.removeStorageSync('token')
            wx.removeStorageSync('userInfo')
            
            // 显示友好提示
            wx.showModal({
              title: '登录已过期',
              content: '您的登录已过期，请重新登录',
              showCancel: true,
              cancelText: '稍后登录',
              confirmText: '去登录',
              success: (res) => {
                if (res.confirm) {
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

                // 执行队列中的请求
                requestQueue.forEach(callback => callback())
                requestQueue = []
                isRefreshing = false
              }
            })
            reject(new Error('token失效'))
            return
          }
          
          resolve(res)
        },
        fail: reject
      })
    }

    executeRequest()
  })
}

// 导出请求方法
module.exports = {
  request
}