const config = require('../../utils/config.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0, // 状态栏高度
    navBarHeight: 44, // 导航栏高度
    memberList: [], // 会员列表数据
    loading: false, // 加载状态
    hasMore: true, // 是否有更多数据
    size: 10, // 每页条数
    lastId: '0', // 用于分页的标识
    categoryId: '', // 分类ID
    categoryTitle: '', // 分类标题
    defaultAvatar: 'https://mini.9000aigc.com/assets/images/default-avatar.png', // 默认头像
    keyword: '', // 搜索关键词
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('会员卡片列表页面加载，参数:', options);
    // 获取系统信息设置状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      categoryId: options.categoryId || '',
      categoryTitle: options.title || '会员列表'
    });

    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: options.title || '会员列表'
    });

    // 加载会员列表
    this.fetchMemberList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      hasMore: true,
      memberList: []
    });
    this.fetchMemberList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.fetchMemberList(true);
    }
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack();
  },

  /**
   * 搜索输入处理
   */
  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value
    });
    
    // 当输入框被清空时，重置并重新获取数据
    if (!e.detail.value.trim()) {
      this.setData({
        hasMore: true,
        memberList: []
      });
      this.fetchMemberList();
    }
  },

  /**
   * 搜索确认
   */
  onSearchConfirm() {
    // 只有当有搜索关键词时才触发搜索
    if (this.data.keyword.trim()) {
      this.setData({
        hasMore: true,
        memberList: []
      });
      this.fetchMemberList();
    }
  },

  /**
   * 获取会员列表数据
   */
  fetchMemberList(isLoadMore = false) {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    const { lastId, size, categoryId, keyword } = this.data;
    
    // 构建请求数据
    const requestData = {
      size: size
    };
    
    // 只有加载更多时才带上lastId参数
    if (isLoadMore && lastId) {
      requestData.lastId = lastId;
    }
    
    // 添加分类ID
    if (categoryId) {
      requestData.categoryId = categoryId;
    }
    
    // 添加搜索关键词
    if (keyword.trim()) {
      requestData.keyword = keyword.trim();
    }
    
    console.log('请求会员列表参数:', requestData);
    
    wx.request({
      url: `${config.baseURL}/knowledge/user/member/scroll`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: requestData,
      success: (res) => {
        console.log('会员列表响应:', res.data);
        
        if (res.data.code === 200 && res.data.data) {
          const list = res.data.data.list || [];
          const nextId = res.data.data.nextId || '';
          const hasMore = res.data.data.hasMore || false;
          
          // 处理会员数据，确保数据格式正确
          const formattedList = list.map(item => ({
            id: item.id || '',
            nickname: item.nickname || '未设置昵称',
            avatar: item.avatar || this.data.defaultAvatar,
            company: item.company || '',
            position: item.position || '',
            about: item.about || '',
            shareableResources: item.shareableResources || '',
            demands: item.demands || '',
            location: item.location || '',
            labels: item.labels || [],
            status: item.status || 0
          }));
          
          this.setData({
            memberList: isLoadMore ? [...this.data.memberList, ...formattedList] : formattedList,
            lastId: nextId,
            hasMore: hasMore
          });
        } else {
          wx.showToast({
            title: res.data.message || '获取会员列表失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ loading: false });
        
        // 如果是下拉刷新，停止下拉刷新动画
        if (wx.stopPullDownRefresh) {
          wx.stopPullDownRefresh();
        }
      }
    });
  },

  /**
   * 会员卡片点击事件
   */
  onMemberCardTap(e) {
    const id = e.currentTarget.dataset.id;

  }
});