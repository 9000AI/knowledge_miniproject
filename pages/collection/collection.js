const config = require('../../utils/config.js')

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 44,
    articles: [],
    loading: false,
    hasMore: true,
    lastId: '',
    limit: 10,
    needRefresh: false
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
    this.fetchCollections();
  },

  onShow() {
    if (this.data.needRefresh) {
      this.setData({
        articles: [],
        lastId: '',
        hasMore: true,
        needRefresh: false
      }, () => {
        this.fetchCollections();
      });
    }
  },

  // 获取收藏文章列表
  fetchCollections() {
    if (this.data.loading || !this.data.hasMore) return;

    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    if (!token || !userInfo) {
      wx.navigateTo({ url: '/pages/auth/auth' });
      return;
    }

    this.setData({ loading: true });

    wx.request({
      url: `${config.baseURL}/knowledge/article/favorite/cursor`,
      method: 'POST',
      data: {
        userId: userInfo.id,
        lastId: this.data.lastId,
        limit: this.data.limit
      },
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          const { articles, hasMore, lastId } = res.data.data;
          
          // 处理文章日期格式
          const formattedArticles = articles.map(article => ({
            ...article,
            createTime: article.createTime.split('T')[0]
          }));

          this.setData({
            articles: this.data.lastId ? [...this.data.articles, ...formattedArticles] : formattedArticles,
            hasMore,
            lastId
          });
        }
      },
      fail: (err) => {
        console.error('获取收藏文章失败：', err);
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  // 跳转到文章详情
  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ needRefresh: true });
    wx.navigateTo({
      url: `/pages/article-detail/article-detail?id=${id}&from=collection`
    });
  },

  // 返回上一页
  handleBack() {
    wx.navigateBack();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      articles: [],
      lastId: '',
      hasMore: true
    }, () => {
      this.fetchCollections();
      wx.stopPullDownRefresh();
    });
  },

  // 触底加载更多
  onReachBottom() {
    if (this.data.hasMore) {
      this.fetchCollections();
    }
  }
});