Page({
  data: {
    projects: [],
    pageSize: 10,
    lastId: '',
    hasMore: true,
    loading: false,
    isRefreshing: false,
    searchText: ''
  },
  
  onLoad: function() {
    this.loadProjects()
  },

  onShow: function() {
    // 页面显示时可以选择是否刷新
  },

  // 加载项目列表
  loadProjects: function(refresh = false) {
    if (this.data.loading || (!refresh && !this.data.hasMore)) return
    
    this.setData({ loading: true })
    
    // 从本地存储获取token
    const token = wx.getStorageSync('token')
    
    wx.request({
      url: 'http://192.168.1.93:8100/knowledge/projects/scroll',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 添加token到请求头
      },
      data: {
        lastId: refresh ? '' : this.data.lastId,
        pageSize: this.data.pageSize,
        title: this.data.searchText || undefined
      },
      success: (res) => {
        if (res.data.code === 401) {
          wx.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          // 可以在这里跳转到登录页
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        if (res.data.code === 200) {
          const { list, hasMore, nextLastId } = res.data.data
          
          // 格式化时间
          const formattedList = list.map(item => ({
            ...item,
            createTime: item.createTime.split('T')[0]
          }))
          
          this.setData({
            projects: refresh ? formattedList : [...this.data.projects, ...formattedList],
            hasMore,
            lastId: nextLastId,
            loading: false,
            isRefreshing: false
          })
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          })
          this.setData({
            loading: false,
            isRefreshing: false
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        this.setData({
          loading: false,
          isRefreshing: false
        })
      }
    })
  },

  // 下拉刷新
  onRefresh: function() {
    this.setData({
      isRefreshing: true
    })
    this.loadProjects(true)
  },

  // 加载更多
  loadMore: function() {
    this.loadProjects()
  },

  // 搜索输入
  onSearchInput: function(e) {
    const searchText = e.detail.value
    this.setData({
      searchText,
      lastId: '',
      hasMore: true
    }, () => {
      this.loadProjects(true)
    })
  },

  // 跳转到详情页
  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id
    // TODO: 实现跳转到详情页的逻辑
    wx.showToast({
      title: '详情页开发中',
      icon: 'none'
    })
  }
}) 