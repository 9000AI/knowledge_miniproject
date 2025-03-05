const config = require('../../utils/config.js')

Page({
  data: {
    statusBarHeight: 0,
    userProfile: null,
    showEditModal: false,
    showLabelModal: false,
    currentField: '',
    editValue: '',
    editTitle: '',
    labelOptions: [
      { code: 1, name: '流量主' },
      { code: 2, name: '品牌方' },
      { code: 3, name: '供应链' },
      { code: 4, name: '服务商' },
      { code: 5, name: '投资人' }
    ],
    selectedLabels: []
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    })
    this.fetchUserProfile()
  },

  onShow() {
    this.fetchUserProfile()
  },

  fetchUserProfile() {
    const userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token')

    if (!userInfo || !token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
      return
    }

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: `${config.baseURL}/knowledge/user/info/profile`,
      method: 'GET',
      data: {
        userId: userInfo.id
      },
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            userProfile: res.data.data,
            selectedLabels: res.data.data.labels?.map(label => label.code) || []
          })
        } else {
          wx.showToast({
            title: res.data.message || '获取信息失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('获取用户资料失败:', err)
        wx.showToast({
          title: '获取信息失败',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  handleBack() {
    wx.navigateBack()
  },

  // 处理编辑点击
  handleEdit(e) {
    const field = e.currentTarget.dataset.field
    let title = ''
    let value = ''

    // 根据字段设置标题和值
    switch (field) {
      case 'realName':
        title = '真实姓名'
        value = this.data.userProfile.realName || ''
        break
      case 'userPhone':
        title = '手机号码'
        value = this.data.userProfile.userPhone || ''
        break
      case 'company':
        title = '公司'
        value = this.data.userProfile.company || ''
        break
      case 'position':
        title = '职位'
        value = this.data.userProfile.position || ''
        break
      case 'about':
        title = '个人介绍'
        value = this.data.userProfile.about || ''
        break
      case 'shareableResources':
        title = '可分享资源'
        value = this.data.userProfile.shareableResources || ''
        break
      case 'demands':
        title = '需求'
        value = this.data.userProfile.demands || ''
        break
      case 'address.address':
        title = '详细地址'
        value = this.data.userProfile.address?.address || ''
        break
    }

    this.setData({
      showEditModal: true,
      currentField: field,
      editValue: value,
      editTitle: title
    })
  },

  // 处理标签编辑
  handleEditLabels() {
    // 更新标签选中状态
    const labelOptions = this.data.labelOptions.map(label => ({
      ...label,
      selected: this.data.selectedLabels.includes(label.code)
    }))

    this.setData({
      showLabelModal: true,
      labelOptions
    })
  },

  // 处理地址编辑
  handleEditAddress(e) {
    const type = e.currentTarget.dataset.type
    if (type === 'region') {
      wx.chooseLocation({
        success: (res) => {
          // 更新地址信息
          const userProfile = this.data.userProfile
          if (!userProfile.address) {
            userProfile.address = {}
          }
          userProfile.address.province = res.address.split('省')[0] + '省'
          userProfile.address.city = res.address.split('市')[0].split('省')[1] + '市'
          userProfile.address.district = res.address.split('区')[0].split('市')[1] + '区'
          this.setData({ userProfile })
        }
      })
    }
  },

  // 处理输入变化
  handleInputChange(e) {
    this.setData({
      editValue: e.detail.value
    })
  },

  // 确认编辑
  confirmEdit() {
    const { currentField, editValue, userProfile } = this.data
    
    // 处理嵌套字段（如 address.address）
    if (currentField.includes('.')) {
      const [parent, child] = currentField.split('.')
      if (!userProfile[parent]) {
        userProfile[parent] = {}
      }
      userProfile[parent][child] = editValue
    } else {
      userProfile[currentField] = editValue
    }

    this.setData({
      userProfile,
      showEditModal: false
    })
  },

  // 关闭编辑弹窗
  closeEditModal() {
    this.setData({
      showEditModal: false
    })
  },

  // 切换标签选中状态
  toggleLabel(e) {
    const code = e.currentTarget.dataset.code
    const labelOptions = this.data.labelOptions.map(label => {
      if (label.code === code) {
        return { ...label, selected: !label.selected }
      }
      return label
    })
    this.setData({ labelOptions })
  },

  // 确认标签选择
  confirmLabels() {
    const selectedLabels = this.data.labelOptions
      .filter(label => label.selected)
      .map(label => ({
        code: label.code,
        name: label.name,
        weight: 50 // 默认权重
      }))

    const userProfile = this.data.userProfile
    userProfile.labels = selectedLabels

    this.setData({
      userProfile,
      selectedLabels: selectedLabels.map(label => label.code),
      showLabelModal: false
    })
  },

  // 关闭标签弹窗
  closeLabelModal() {
    this.setData({
      showLabelModal: false
    })
  },

  // 保存所有修改
  handleSave() {
    const userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token')

    if (!userInfo || !token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '保存中...',
      mask: true
    })

    // 构建请求数据
    const { userProfile } = this.data
    const requestData = {
      userId: userInfo.id,
      realName: userProfile.realName,
      company: userProfile.company,
      position: userProfile.position,
      about: userProfile.about,
      shareableResources: userProfile.shareableResources,
      demands: userProfile.demands,
      labels: userProfile.labels?.map(label => label.code) || [],
      province: userProfile.address?.province,
      city: userProfile.address?.city,
      district: userProfile.address?.district,
      address: userProfile.address?.address
    }

    wx.request({
      url: `${config.baseURL}/knowledge/user/info/profile`,
      method: 'PUT',
      data: requestData,
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          wx.hideLoading()
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500,
            mask: true,
            success: () => {
              // 延迟返回，让用户看到成功提示
              setTimeout(() => {
                // 返回上一页（用户页面）
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.message || '保存失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: (err) => {
        console.error('保存失败:', err)
        wx.hideLoading()
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
}) 