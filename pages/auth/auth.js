const app = getApp()
const config = require('../../utils/config.js')

Page({
  data: {
    isChecking: true, // 是否在检查登录状态
    message: '', // 用于显示登录状态
    isAgree: false
  },

  onLoad() {
    // 检查是否已登录
    const token = wx.getStorageSync('token')
    if (token) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  async checkLoginStatus() {
    try {
      // 从本地存储获取 token
      const token = wx.getStorageSync('token')
      
      if (!token) {
        // 情况1：没有 token，说明没注册过
        this.setData({ isChecking: false })
        return
      }

      // 验证 token 是否有效
      const checkResult = await this.checkToken(token)
      
      if (!checkResult.valid) {
        // 情况2：token 过期
        wx.removeStorageSync('token') // 清除无效 token
        this.setData({ isChecking: false })
        return
      }

      // 情况3：token 有效，直接跳转到首页
      wx.reLaunch({
        url: '/pages/index/index'
      })

    } catch (error) {
      console.error('检查登录状态失败:', error)
      this.setData({ isChecking: false })
    }
  },

  checkToken(token) {
    return new Promise((resolve) => {
      wx.request({
        url: `${config.baseURL}/knowledge/user/check-token`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${token}` // 在请求头中携带 token
        },
        success: (res) => {
          // 根据后端返回判断 token 是否有效
          if (res.statusCode === 200) {
            resolve({ valid: true })
          } else {
            resolve({ valid: false })
          }
        },
        fail: (err) => {
          console.error('检查 token 失败:', err)
          resolve({ valid: false })
        }
      })
    })
  },

  // 获取手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      console.log('获取手机号失败:', e.detail.errMsg)
      return
    }

    // 检查是否同意协议
    if (!this.data.isAgree) {
      console.log('用户未同意协议')
      wx.showModal({
        title: '提示',
        content: '请先阅读并同意用户协议',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            // 用户点击确定后，自动勾选协议
            this.setData({ 
              isAgree: true 
            })
            // 重新触发登录流程
            this.getPhoneNumber(e)
          }
        }
      })
      return
    }

    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('获取登录凭证成功, code:', res.code)
          this.wxSilentLogin(res.code)
        } else {
          console.error('获取登录凭证失败:', res.errMsg)
          wx.showToast({
            title: '登录失败,请重试',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('wx.login 调用失败:', err)
        wx.showToast({
          title: '登录失败,请重试',
          icon: 'none'
        })
      }
    })
  },

  handleAgreeChange(e) {
    this.setData({
      isAgree: e.detail.value.length > 0
    })
  },

  showAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议内容...',
      showCancel: false
    })
  },

  // 显示隐私协议
  showPrivacyAgreement() {
    // TODO: 跳转到隐私协议页面或显示协议内容
    wx.showModal({
      title: '隐私协议',
      content: '这里是隐私协议内容...',
      showCancel: false
    })
  },

  // 处理微信一键登录
  handleWxLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('微信登录凭证：', res.code)
          this.wxSilentLogin(res.code)
        } else {
          this.showMessage('登录失败：' + res.errMsg)
        }
      },
      fail: (err) => {
        console.error('wx.login 调用失败：', err)
        this.showMessage('获取登录凭证失败')
      }
    })
  },

  // 调用后端静默登录接口
  wxSilentLogin(code) {
    wx.showLoading({
      title: '登录中...',
      mask: true
    })

    wx.request({
      url: `${config.baseURL}/knowledge/user/wx-silent-login?code=${code}`,
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        console.log('登录请求响应:', res.data)
        
        if (res.data.code === 200) {
          const { data } = res.data
          
          // 如果头像是临时路径，需要上传到服务器
          if (data.avatar && data.avatar.startsWith('http://tmp/')) {
            // 先把临时头像下载到本地
            wx.downloadFile({
              url: data.avatar,
              success: (downloadRes) => {
                if (downloadRes.statusCode === 200) {
                  // 上传到自己的服务器
                  wx.uploadFile({
                    url: `${config.baseURL}/knowledge/upload/image`,
                    filePath: downloadRes.tempFilePath,
                    name: 'file',
                    success: (uploadRes) => {
                      const uploadResult = JSON.parse(uploadRes.data)
                      if (uploadResult.code === 200) {
                        // 更新用户头像为永久地址
                        data.avatar = uploadResult.data.url
                      }
                      // 保存用户信息
                      wx.setStorageSync('userInfo', data)
                    }
                  })
                }
              }
            })
          }
          
          // 保存用户信息和token
          wx.setStorageSync('token', data.token)
          wx.setStorageSync('userInfo', data)
          
          if (data.needReg) {
            console.log('用户未注册,跳转注册页面')
            wx.navigateTo({
              url: '/pages/register/register'
            })
          } else {
            console.log('登录成功,用户信息:', data)
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1500
            })
            
            // 获取重定向URL
            const redirectUrl = wx.getStorageSync('redirect_url')
            wx.removeStorageSync('redirect_url') // 使用后立即清除
            
            setTimeout(() => {
              if (redirectUrl) {
                // 重定向到之前的页面
                wx.reLaunch({
                  url: redirectUrl
                })
              } else {
                // 默认跳转到首页
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            }, 1500)
          }
        } else {
          wx.showToast({
            title: res.data.message || '登录失败,请重试',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('登录请求失败:', err)
        wx.showToast({
          title: '网络错误,请重试',
          icon: 'none'
        })
      }
    })
  },

  // 显示消息提示
  showMessage(msg) {
    this.setData({ message: msg })
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },

  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  // 添加获取 code 方法
  getLoginCode() {
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('获取到的 code:', res.code)
          wx.showToast({
            title: 'Code 已打印到控制台',
            icon: 'none'
          })
        } else {
          console.log('获取 code 失败:', res.errMsg)
          wx.showToast({
            title: '获取 code 失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('wx.login 调用失败:', err)
        wx.showToast({
          title: '获取 code 失败',
          icon: 'none'
        })
      }
    })
  }
}) 