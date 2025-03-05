const config = require('../../utils/config.js')

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 44,
    keyword: '',
    searchResults: [],
    hasSearched: false,
    loading: false,
    currentFilter: '', // 当前选中的筛选类型
    showDropdown: false, // 是否显示下拉菜单
    // 用于存储接口返回的标签数据
    filterOptions: {
      1: [], // 平台标签
      2: [], // 流量形态标签
      3: [], // 行业标签
      4: []  // 来源标签
    },
    articles: [], // 添加文章列表数据
    hasMore: true,
    lastId: '',
    tagIds: [],
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
    // 加载标签数据
    this.fetchTags();
    // 加载文章列表
    this.fetchArticles();
  },

  // 获取标签数据
  fetchTags() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    if (!token || !userInfo) {
      wx.navigateTo({ url: '/pages/auth/auth' });
      return;
    }

    wx.request({
      url: `${config.baseURL}/knowledge/tag/page`,
      method: 'POST',
      data: {
        current: 1,
        size: 999
      },
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          // 处理标签数据，按type分类
          const tags = res.data.data.records;
          const filterOptions = {
            1: [
              { id: 'all_1', name: '全部', selected: true } // 添加全部选项
            ],
            2: [
              { id: 'all_2', name: '全部', selected: true }
            ],
            3: [
              { id: 'all_3', name: '全部', selected: true }
            ],
            4: [
              { id: 'all_4', name: '全部', selected: true }
            ]
          };

          // 将接口返回的标签添加到对应分类中
          tags.forEach(tag => {
            filterOptions[tag.type].push({
              id: tag.id,
              name: tag.name,
              selected: false
            });
          });

          this.setData({ filterOptions });
        }
      },
      fail: (err) => {
        console.error('获取标签失败：', err);
      }
    });
  },

  // 添加获取文章列表的方法
  fetchArticles() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/auth/auth' });
      return;
    }

    const requestData = {
      lastId: this.data.lastId || "",
      limit: 10,
      sortBy: "time",
      sortOrder: "desc"
    };

    wx.request({
      url: 'https://know-admin.9000aigc.com/knowledge/article/category/cursor',
      method: 'POST',
      data: requestData,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          const newArticles = res.data.data.articles.map(item => ({
            id: item.id,
            title: item.title,
            coverImage: item.coverImage,
            createTime: item.createTime.split('T')[0],
            isMemberOnly: item.isMemberOnly,
          }));

          this.setData({
            articles: this.data.articles.concat(newArticles),
            hasMore: res.data.data.hasMore,
            lastId: res.data.data.lastId
          });
        }
      }
    });
  },

  // 添加加载更多方法
  loadMore() {
    if (!this.data.hasMore || this.data.loading) return;
    
    if (this.data.keyword) {
      // 如果是搜索结果的加载更多，调用搜索方法
      this.handleSearch();
    } else {
      // 如果是默认列表的加载更多，调用获取文章列表方法
      this.fetchArticles();
    }
  },

  // 处理搜索输入
  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value
    });

    // 如果输入框为空，自动重置搜索
    if (!e.detail.value.trim()) {
      this.setData({
        articles: [],
        lastId: '',
        hasMore: true
      }, () => {
        this.handleSearch(); // 触发搜索
      });
    }
  },

  // 处理搜索按钮点击
  handleSearch() {
    const { keyword, tagIds } = this.data;

    // 重置搜索相关状态
    this.setData({ 
      loading: true,
      articles: [], // 清空文章列表
      lastId: '', // 重置 lastId
    });

    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    if (!token || !userInfo) {
      wx.navigateTo({ url: '/pages/auth/auth' });
      return;
    }

    // 构建请求参数
    const requestData = {
      userId: userInfo.id,
      lastId: this.data.lastId || "",
      limit: 999
    };

    // 如果搜索框不为空，添加标题搜索
    if (keyword && keyword.trim()) {
      requestData.title = keyword.trim();
    }

    // 如果有选中的标签，添加到请求参数
    if (tagIds && tagIds.length > 0) {
      requestData.tagIds = tagIds;
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
          const newArticles = res.data.data.articles.map(item => ({
            id: item.id,
            title: item.title,
            coverImage: item.coverImage,
            createTime: item.createTime.split('T')[0],
            isMemberOnly: item.isMemberOnly,
          }));

          this.setData({
            articles: this.data.lastId ? [...this.data.articles, ...newArticles] : newArticles,
            hasMore: res.data.data.hasMore,
            lastId: res.data.data.lastId,
            loading: false
          });
        }
      },
      fail: (err) => {
        console.error('请求失败：', err);
        this.setData({ 
          loading: false
        });
        wx.showToast({
          title: '请求失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 处理返回按钮点击
  handleBack() {
    wx.navigateBack();
  },

  // 切换下拉菜单
  toggleDropdown(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentFilter: this.data.currentFilter === type ? '' : type,
      showDropdown: this.data.currentFilter !== type
    });
  },

  // 选择筛选选项
  selectOption(e) {
    const { currentFilter, filterOptions } = this.data;
    const index = e.currentTarget.dataset.index;
    
    // 更新选中状态
    filterOptions[currentFilter].forEach((item, i) => {
      // 如果点击的是"全部"，则只选中"全部"
      if (index === 0) {
        item.selected = i === 0;
      } else {
        // 如果点击的是其他选项，则取消"全部"的选中状态
        if (i === 0) {
          item.selected = false;
        } else {
          item.selected = i === index;
        }
      }
    });

    this.setData({
      filterOptions,
      showDropdown: false
    });

    // 收集所有已选中的非"全部"标签ID
    const selectedTags = [];
    Object.keys(filterOptions).forEach(type => {
      const selectedTag = filterOptions[type].find(tag => tag.selected && !tag.id.startsWith('all_'));
      if (selectedTag) {
        selectedTags.push(selectedTag.id);
      }
    });

    // 更新请求参数并重新搜索
    this.setData({
      tagIds: selectedTags,
      lastId: '' // 重置分页
    }, () => {
      this.handleSearch(); // 触发搜索
    });
  },

  // 添加文章详情页导航方法
  navigateToDetail(e) {
    const articleId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/article-detail/article-detail?id=${articleId}`
    });
  },
}); 