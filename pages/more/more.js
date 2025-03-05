Page({
  data: {
    statusBarHeight: 20, // 状态栏高度，默认值
    cardList: [],
    current: 1,
    size: 10,
    total: 0,
    hasMore: true
  },

  onLoad() {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
    
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    }
    
    this.fetchCardList();
  },

  // 获取卡片列表数据
  fetchCardList(isLoadMore = false) {
    const { current, size } = this.data;
    const token = wx.getStorageSync('token');
    
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    }

    wx.request({
      url: 'https://know-admin.9000aigc.com/knowledge/member/category/page',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        current: isLoadMore ? current + 1 : 1,
        size,
        keyword: ''
      },
      success: (res) => {
        if (res.data.code === 200) {
          const { records, total, current } = res.data.data;
          
          this.setData({
            cardList: isLoadMore ? [...this.data.cardList, ...records] : records,
            current,
            total,
            hasMore: records.length === size
          });
        } else if (res.data.code === 401) {
          // token失效，跳转登录页
          wx.removeStorageSync('token');
          wx.navigateTo({
            url: '/pages/auth/auth'
          });
        } else {
          wx.showToast({
            title: res.data.message || '获取数据失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.fetchCardList(false);
    wx.stopPullDownRefresh();
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore) {
      this.fetchCardList(true);
    }
  },

  // 卡片点击事件
  onCardTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  }
}); 