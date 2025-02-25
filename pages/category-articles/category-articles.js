const config = require('../../utils/config.js')

Page({
  data: {
    categoryId: '',
    categoryName: '',
    articles: [],
    hasMore: true,
    lastId: '',
    loading: false,
    statusBarHeight: 0,
    navBarHeight: 44,
    keyword: '',
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      categoryId: options.id,
      categoryName: options.name
    });
    this.fetchCategoryArticles();
  },

  fetchCategoryArticles() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo'); // 获取用户信息
    
    if (!token || !userInfo) {
      console.error('未登录或用户信息缺失');
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    }

    // 构建请求参数
    const requestData = {
      categoryId: this.data.categoryId,
      lastId: this.data.lastId || "",
      limit: 10,
      userId: userInfo.id
    };

    // 如果有搜索关键词，添加到请求参数
    if (this.data.keyword && this.data.keyword.trim()) {
      requestData.title = this.data.keyword.trim();
    }

    wx.request({
      url: `${config.baseURL}/knowledge/article/category/cursor`,
      method: 'POST',
      data: requestData,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          // 获取原始响应文本
          const responseText = res.data;
          // 手动解析 JSON，保持数字精度
          const parsedData = JSON.parse(JSON.stringify(responseText), (key, value) => {
            // 检查是否是文章 ID 字段
            if ((key === 'id' || key === 'lastId') && typeof value === 'number') {
              return value.toString();
            }
            return value;
          });

          const newArticles = parsedData.data.articles.map(item => ({
            id: item.id,  // 这里的 id 已经是字符串了
            title: item.title,
            coverImage: item.coverImage,
            createTime: item.createTime.split('T')[0],
            isMemberOnly: item.isMemberOnly
          }));

          this.setData({
            articles: [...this.data.articles, ...newArticles],
            hasMore: parsedData.data.hasMore,
            lastId: parsedData.data.lastId,
            loading: false
          });
        }
      },
      fail: (err) => {
        console.error('请求失败：', err);
        this.setData({ loading: false });
      }
    });
  },

  loadMore() {
    if (this.data.hasMore) {
      this.fetchCategoryArticles();
    }
  },

  onPullDownRefresh() {
    this.setData({
      articles: [],
      lastId: '',
      hasMore: true
    });
    this.fetchCategoryArticles();
    wx.stopPullDownRefresh();
  },

  handleBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  onArticleTap(e) {
    const article = this.data.articles[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: `/pages/article-detail/article-detail?id=${article.id}`
    });
  },

  // 处理搜索输入
  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value
    });

    // 如果输入框为空，重置搜索
    if (!e.detail.value.trim()) {
      this.setData({
        articles: [],
        lastId: '',
        hasMore: true
      }, () => {
        this.fetchCategoryArticles(); // 直接重新获取文章
      });
    }
  },

  // 处理搜索确认（点击键盘搜索按钮）
  handleSearch() {
    // 重置列表状态
    this.setData({
      articles: [],
      lastId: '',
      hasMore: true
    }, () => {
      // 重新获取文章列表
      this.fetchCategoryArticles();
    });
  },
}); 