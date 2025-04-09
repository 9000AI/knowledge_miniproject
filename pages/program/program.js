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
    // 如果正在加载或者（不是刷新且没有更多数据）则返回
    if (this.data.loading || (!refresh && !this.data.hasMore)) return
    
    this.setData({ loading: true })
    
    const requestData = {
      pageSize: this.data.pageSize
    };

    // 只有在有 lastId 且不是刷新操作时才添加
    if (this.data.lastId && !refresh) {
      requestData.lastId = this.data.lastId;
    }

    if (this.data.searchText && this.data.searchText.trim()) {
      requestData.title = this.data.searchText.trim();
    }

    console.log('发送请求数据:', requestData);  // 添加请求数据日志

    wx.request({
      url: 'https://know-admin.9000aigc.com/knowledge/projects/scroll',
      method: 'POST',
      data: requestData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log('项目列表响应:', res.data);  // 添加响应日志
        
        if (res.data.code === 200) {
          const { list, hasMore, nextLastId } = res.data.data
          
          // 格式化时间
          const formattedList = list.map(item => ({
            ...item,
            createTime: item.createTime ? item.createTime.split('T')[0] : ''
          }))
          
          console.log('格式化后的列表:', formattedList);  // 添加格式化数据日志
          
          // 如果是刷新操作且列表为空，则显示暂无数据
          if (refresh && formattedList.length === 0) {
            this.setData({
              projects: [],
              hasMore: false,
              lastId: '',
              loading: false,
              isRefreshing: false
            })
            return
          }

          // 正常设置数据
          this.setData({
            projects: refresh ? formattedList : [...this.data.projects, ...formattedList],
            hasMore,
            lastId: nextLastId || '',
            loading: false,
            isRefreshing: false
          })
        } else {
          console.error('请求返回错误:', res.data);  // 添加错误响应日志
          wx.showToast({
            title: res.data.message || '加载失败',
            icon: 'none'
          })
          this.setData({
            loading: false,
            isRefreshing: false
          })
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);  // 添加错误日志
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
      isRefreshing: true,
      lastId: '', // 重置 lastId
    })
    this.loadProjects(true)
  },

  // 加载更多
  loadMore: function() {
    if (!this.data.hasMore) return
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
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/program-detail/program-detail?id=${id}`
    });
  }
}) 