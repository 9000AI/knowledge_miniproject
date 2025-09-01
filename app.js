// app.js
const config = require('./utils/config.js')
const { request } = require('./utils/request.js')

App({
  onLaunch() {
    // 初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'your-env-id',
        traceUser: true,
      })
    }

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取审核开关状态
    this.getAuditSwitchStatus()

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录成功：', res.code)
      },
      fail: err => {
        console.error('登录失败：', err)
      }
    })
  },

  async getAuditSwitchStatus() {
    try {
      const requestParams = {
        url: `${config.baseURL}/knowledge/audit/status`,
        method: 'GET',
        data: {
          appId: config.audit.appId,
          name: config.audit.name
        }
      }
      
      console.log('审核开关请求参数:', requestParams)
      
      const res = await request(requestParams)
      
      console.log('审核开关响应参数:', res.data)
      
      if (res.data.code === 200) {
        this.globalData.auditSwitchEnabled = res.data.data
        console.log('审核开关状态:', res.data.data)
      } else {
        console.error('获取审核开关状态失败:', res.data.message)
        // 默认开启，确保功能可用
        this.globalData.auditSwitchEnabled = true
      }
    } catch (err) {
      console.error('审核开关API请求失败:', err)
      // 默认开启，确保功能可用
      this.globalData.auditSwitchEnabled = true
    }
  },

  globalData: {
    userInfo: null,
    auditSwitchEnabled: true  // 审核开关状态，默认开启
  }
})
