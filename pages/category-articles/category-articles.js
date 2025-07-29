const config = require('../../utils/config.js')

Page({
  data: {
    categoryId: '',
    categoryName: '',
    articles: [],
    hasMore: true,
    lastId: '',
    loading: false,
    leftListLoading: false,
    statusBarHeight: 0,
    navBarHeight: 44,
    searchBoxHeight: 60,
    keyword: '',
    leftList: [],
    currentLeftId: 'all',
    scrollHeight: 0,
    currentTags: [],
    tagsLoading: false,
    currentTagId: 'all',
    isSidebarShow: false,
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    const fixedHeaderHeight = systemInfo.statusBarHeight + this.data.navBarHeight + this.data.searchBoxHeight;
    const scrollHeight = systemInfo.windowHeight - fixedHeaderHeight;

    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      categoryId: options.id,
      categoryName: options.name,
      scrollHeight: scrollHeight,
    });

    this.fetchLeftList();
  },

  fetchLeftList() {
    if (this.data.leftListLoading) return;
    this.setData({ leftListLoading: true });

    wx.request({
      url: `${config.baseURL}/knowledge/category/children`,
      method: 'GET',
      data: {
        parentId: this.data.categoryId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 200) {
          const children = res.data.data || [];
          const formattedList = children.map(item => ({
            id: item.id.toString(),
            name: item.name,
            path: item.path
          }));
          // 只有存在子分类时才添加"全部"选项
          const finalList = formattedList.length > 0 
            ? [{ id: 'all', name: '全部' }, ...formattedList]
            : [];
          this.setData({
            leftList: finalList,
            currentLeftId: 'all',
          });
          this.fetchCategoryArticles();
        } else {
          wx.showToast({
            title: res.data.message || '获取分类列表失败',
            icon: 'none'
          });
          this.fetchCategoryArticles();
        }
      },
      fail: (err) => {
        console.error('获取分类列表失败:', err);
        wx.showToast({
          title: '网络错误，无法获取分类',
          icon: 'none'
        });
        this.fetchCategoryArticles();
      },
      complete: () => {
        this.setData({ leftListLoading: false });
      }
    });
  },

  fetchCategoryArticles() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });

    const requestData = {
      lastId: this.data.lastId || "",
      limit: 10
    };

    let effectiveCategoryId = null;

    if (this.data.currentTagId !== 'all') {
      const selectedTag = this.data.currentTags.find(tag => tag.id === this.data.currentTagId);
      if (selectedTag && selectedTag.path) {
        const pathParts = selectedTag.path.split('-');
        effectiveCategoryId = pathParts[pathParts.length - 1];
      } else {
        console.warn('未找到选中的标签或其 path:', this.data.currentTagId);
      }
    }

    if (!effectiveCategoryId) {
      if (this.data.currentLeftId === 'all') {
        effectiveCategoryId = this.data.categoryId;
      } else {
        const selectedLeftItem = this.data.leftList.find(item => item.id === this.data.currentLeftId);
        if (selectedLeftItem && selectedLeftItem.path) {
          const pathParts = selectedLeftItem.path.split('-');
          effectiveCategoryId = pathParts[pathParts.length - 1];
        } else {
          console.warn('未找到左侧选中项或其 path:', this.data.currentLeftId);
          effectiveCategoryId = this.data.categoryId;
        }
      }
    }

    if (effectiveCategoryId) {
        requestData.categoryId = effectiveCategoryId;
    } else {
        console.error("无法确定有效的 categoryId");
        this.setData({ loading: false, hasMore: false });
        return;
    }

    if (this.data.keyword && this.data.keyword.trim()) {
      requestData.title = this.data.keyword.trim();
    }

    console.log('请求文章参数:', requestData);

    wx.request({
      url: `${config.baseURL}/knowledge/article/category/cursor`,
      method: 'POST',
      data: requestData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 200) {
          const responseText = res.data;
          const parsedData = responseText;

          const newArticles = (parsedData.data.articles || []).map(item => ({
            id: item.id.toString(),
            title: item.title,
            coverImage: item.coverImage,
            createTime: item.createTime ? item.createTime.split('T')[0] : '未知时间',
            isMemberOnly: item.isMemberOnly,
            tags: item.tags || []
          }));

          this.setData({
            articles: this.data.lastId ? this.data.articles.concat(newArticles) : newArticles,
            hasMore: parsedData.data.hasMore,
            lastId: parsedData.data.hasMore ? (parsedData.data.lastId?.toString() || '') : '',
          });
        } else {
          wx.showToast({
            title: res.data.message || `加载文章失败 (${res.statusCode})`,
            icon: 'none'
          });
          this.setData({ hasMore: false });
        }
      },
      fail: (err) => {
        console.error('请求文章失败：', err);
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        });
        this.setData({ hasMore: false });
      },
      complete: () => {
        this.setData({ loading: false });
        wx.stopPullDownRefresh();
      }
    });
  },

  loadMore() {
    console.log('触发 loadMore');
    if (this.data.hasMore && !this.data.loading) {
      this.fetchCategoryArticles();
    } else if (!this.data.hasMore) {
      console.log('没有更多数据了');
    } else {
      console.log('正在加载中，请勿重复触发');
    }
  },

  onPullDownRefresh() {
    console.log('触发 onPullDownRefresh');
    this.setData({
      articles: [],
      lastId: '',
      hasMore: true,
    });
    this.fetchCategoryArticles();
  },

  handleBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  onArticleTap(e) {
    const index = e.currentTarget.dataset.index;
    if (index === undefined || index < 0 || index >= this.data.articles.length) {
        console.error('Invalid article index:', index);
        return;
    }
    const article = this.data.articles[index];
    wx.navigateTo({
      url: `/pages/article-detail/article-detail?id=${article.id}`
    });
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({
      keyword: keyword
    });
  },

  handleSearch() {
    console.log('执行搜索, 关键词:', this.data.keyword);
    this.setData({
      articles: [],
      lastId: '',
      hasMore: true,
    }, () => {
      this.fetchCategoryArticles();
    });
  },

  onLeftItemTap(e) {
    const selectedId = e.currentTarget.dataset.id;
    if (selectedId === this.data.currentLeftId || this.data.loading || this.data.tagsLoading) {
      if (selectedId === this.data.currentLeftId) {
        this.hideSidebar(); // 如果点击的是当前已选中的分类，也关闭侧边栏
      }
      return;
    }

    this.hideSidebar(); // 点击任何分类后都关闭侧边栏

    let tagParentId = null;
    let tagsLoadingState = false;
    if (selectedId !== 'all') {
      const selectedItem = this.data.leftList.find(item => item.id === selectedId);
      if (selectedItem && selectedItem.path) {
        tagParentId = selectedItem.path.split('-').pop();
        tagsLoadingState = !!tagParentId;
      } else {
        console.warn('未找到选中项或其 path:', selectedId);
      }
    }

    this.setData({
      currentLeftId: selectedId,
      currentTagId: 'all',
      articles: [],
      lastId: '',
      hasMore: true,
      keyword: '',
      currentTags: [],
      tagsLoading: tagsLoadingState,
    });

    console.log('切换到左侧分类:', selectedId);

    this.fetchCategoryArticles();

    if (tagParentId) {
      this.fetchTags(tagParentId);
    } else {
      this.setData({ tagsLoading: false });
    }
  },

  onTagTap(e) {
    const selectedTagId = e.currentTarget.dataset.id;
    if (!selectedTagId || selectedTagId === this.data.currentTagId || this.data.loading) {
      return;
    }

    console.log('点击顶部标签:', selectedTagId);

    this.setData({
      currentTagId: selectedTagId,
      articles: [],
      lastId: '',
      hasMore: true,
      keyword: '',
    });

    this.fetchCategoryArticles();
  },

  fetchTags(tagParentId) {
    if (!tagParentId) {
      console.log('无效的 tagParentId，不获取标签');
      this.setData({ currentTags: [], tagsLoading: false, currentTagId: 'all' });
      return;
    }
    console.log('开始获取标签，parentId:', tagParentId);
    this.setData({ tagsLoading: true });

    wx.request({
      url: `${config.baseURL}/knowledge/category/children`,
      method: 'GET',
      data: {
        parentId: tagParentId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        let finalTags = [];
        if (res.statusCode === 200 && res.data.code === 200) {
          const tagsData = res.data.data || [];
          if (tagsData.length > 0) {
            const formattedTags = tagsData.map(tag => ({
              id: tag.id.toString(),
              name: tag.name,
              path: tag.path
            }));
            finalTags = [
              { id: 'all', name: '全部', path: '' },
              ...formattedTags
            ];
            console.log('获取并格式化标签:', finalTags);
          } else {
            console.log('未获取到任何子标签，不显示标签栏');
          }
          this.setData({ currentTags: finalTags, currentTagId: 'all' });
        } else {
          console.warn('获取标签失败:', res.data.message || `HTTP ${res.statusCode}`);
          this.setData({ currentTags: [], currentTagId: 'all' });
        }
      },
      fail: (err) => {
        console.error('获取标签网络错误:', err);
        this.setData({ currentTags: [], currentTagId: 'all' });
        wx.showToast({
          title: '获取标签失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ tagsLoading: false });
      }
    });
  },

  toggleSidebar() {
    this.setData({
      isSidebarShow: !this.data.isSidebarShow
    });
  },

  hideSidebar() {
    this.setData({
      isSidebarShow: false
    });
  },
}); 