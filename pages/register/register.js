Page({
  data: {
    isAgree: false,
    avatarUrl: '',
    nickName: '微信用户',
    loginCode: '' // 存储 wx.login 获取的 code
  },

  onLoad() {
    // 页面加载时就获取登录凭证
    this.getLoginCode()
  },

  // 获取登录凭证
  getLoginCode() {
    wx.login({
      success: (res) => {
        if (res.code) {
          this.setData({ loginCode: res.code })
        }
      }
    })
  },

  // 选择头像
  onChooseAvatar(e) {
    this.setData({
      avatarUrl: e.detail.avatarUrl
    })
  },

  // 输入昵称
  onInputNickname(e) {
    this.setData({
      nickName: e.detail.value
    })
  },

  handleAgreeChange(e) {
    this.setData({
      isAgree: e.detail.value.length > 0
    })
  },

  // 获取手机号并注册
  getPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      return
    }

    // 检查是否同意协议
    if (!this.data.isAgree) {
      wx.showModal({
        title: '温馨提示',
        content: '请您仔细阅读《用户协议》《隐私协议》，接受后可开始使用我们的服务',
        cancelText: '不同意',
        confirmText: '同意',
        success: (res) => {
          if (res.confirm) {
            this.setData({ isAgree: true })
            this.register(e.detail.code)
          }
        }
      })
      return
    }

    this.register(e.detail.code)
  },

  // 注册
  async register(phoneCode) {
    // 校验数据
    if (!this.data.avatarUrl) {
      wx.showToast({
        title: '请选择头像',
        icon: 'none'
      })
      return
    }

    if (!this.data.nickName || this.data.nickName.trim() === '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '注册中...' })
    
    try {
      const requestData = {
        code: this.data.loginCode,
        phoneCode: phoneCode,
        userInfo: {
          avatarUrl: this.data.avatarUrl,
          nickName: this.data.nickName
        }
      }
      
      console.log('注册请求参数：', requestData)

      // 使用 Promise 包装 wx.request，添加超时和重试机制
      const result = await new Promise((resolve, reject) => {
        const requestTask = wx.request({
          url: 'http://192.168.1.93:8100/knowledge/user/register',
          method: 'POST',
          data: requestData,
          timeout: 15000, // 增加超时时间到 15 秒
          header: {
            'content-type': 'application/json'
          },
          success: (res) => {
            console.log('请求成功：', res)
            resolve(res)
          },
          fail: (err) => {
            console.error('请求失败：', err)
            reject(err)
          }
        })

        // 添加请求中断处理
        requestTask.onHeadersReceived((res) => {
          console.log('收到响应头：', res)
        })
      })

      console.log('完整的接口返回：', result)

      // 检查返回数据结构
      const response = result.data
      if (!response || typeof response.code === 'undefined') {
        throw new Error('接口返回数据格式错误')
      }

      console.log('注册接口返回数据：', response)
      
      if (response.code === 200) {
        // 保存用户信息和token
        const userData = response.data
        wx.setStorageSync('token', userData.token)
        wx.setStorageSync('userInfo', userData)
        
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000
        })

        // 延迟跳转到首页
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)
      } else {
        // 业务错误处理
        wx.showToast({
          title: response.message || '注册失败',
          icon: 'none',
          duration: 2000
        })
      }

      wx.hideLoading()
    } catch (error) {
      wx.hideLoading()
      console.error('注册请求失败：', error)
      
      // 优化错误提示
      let errorMsg = '网络请求失败'
      if (error.errMsg) {
        if (error.errMsg.includes('timeout')) {
          errorMsg = '服务器响应超时，请检查网络后重试'
          // 可以考虑自动重试
          wx.showModal({
            title: '提示',
            content: '注册请求超时，是否重试？',
            success: (res) => {
              if (res.confirm) {
                // 延迟 1 秒后重试
                setTimeout(() => {
                  this.register(phoneCode)
                }, 1000)
              }
            }
          })
          return
        } else if (error.errMsg.includes('fail')) {
          errorMsg = '网络连接失败，请检查网络设置'
        }
      } else if (error.message) {
        errorMsg = error.message
      }
      
      wx.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 3000
      })
    }
  },

  showUserAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议内容...',
      showCancel: false
    })
  },

  showPrivacyAgreement() {
    wx.showModal({
      title: '隐私协议',
      content: '这里是隐私协议内容...',
      showCancel: false
    })
  }
}) 
