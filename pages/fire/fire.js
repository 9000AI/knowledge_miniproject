// pages/fire/fire.js
const shareUtils = require('../../utils/share.js')
const config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, // 当前选中的 tab 索引
    statusBarHeight: 0, // 状态栏高度
    cardList: [],
    memberList: [], // 改为数组存储所有会员
    memberInfo: null, // 改为 null，不再使用静态数据
    lastId: '', // 用于分页
    hasMore: true, // 是否还有更多数据
    size: 10, // 每页数量
    defaultAvatar: 'https://mini.9000aigc.com/assets/images/default-avatar.png', // 默认头像
    keyword: '', // 搜索关键词
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('fire页面加载');
    // 启用分享菜单
    shareUtils.enableShareMenu()
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
    this.fetchCardList();
    this.fetchMemberList(); // 获取会员列表
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      lastId: '',
      hasMore: true
    });
    this.fetchCardList();
    this.fetchMemberList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.hasMore) {
      this.fetchMemberList(true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return shareUtils.getShareConfig('fire', 'friend')
  },

  // 分享到朋友圈
  onShareTimeline() {
    return shareUtils.getShareConfig('fire', 'timeline')
  },

  // 添加到收藏
  onAddToFavorites() {
    return shareUtils.getShareConfig('fire', 'favorite')
  },

  // 复制链接
  copyPageLink() {
    shareUtils.copyLink('fire', { from: 'miniprogram' })
  },

  // 切换 tab
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      currentTab: index,
      lastId: '',
      hasMore: true,
      keyword: '', // 切换 tab 时清空搜索关键词
      memberList: []
    });
    this.fetchCardList();
    this.fetchMemberList();
  },

  // 导航到搜索页面
  navigateToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  // 获取卡片列表数据
  fetchCardList() {
    wx.request({
      url: `${config.baseURL}/knowledge/member/category/page`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        current: 1,
        size: 2,
        keyword: ''
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            cardList: res.data.data.records || []
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

  // 卡片点击事件
  onCardTap(e) {
    const id = e.currentTarget.dataset.id;
    const cardInfo = this.data.cardList.find(item => item.id === id) || {};
    
    wx.navigateTo({
      url: `/pages/member-card-list/member-card-list?categoryId=${id}&title=${cardInfo.title || '会员列表'}`
    });
  },

  // 查看更多点击事件
  onViewMore() {
    wx.navigateTo({
      url: '/pages/more/more'  // 跳转到更多列表页面
    });
  },

  // 搜索输入处理
  onSearchInput(e) {
    const newKeyword = e.detail.value;
    this.setData({
      keyword: newKeyword
    });

    // 当输入框被清空时，重置列表并重新获取数据
    if (!newKeyword.trim()) {
      this.setData({
        lastId: '',
        hasMore: true,
        memberList: []
      });
      this.fetchMemberList();
    }
  },

  // 搜索确认（点击回车）
  onSearchConfirm() {
    // 只有当有搜索关键词时才触发搜索
    if (this.data.keyword.trim()) {
      this.setData({
        lastId: '',
        hasMore: true,
        memberList: []
      });
      this.fetchMemberList();
    }
  },

  // 获取会员列表数据
  fetchMemberList(isLoadMore = false) {
    const { lastId, size, currentTab, keyword } = this.data;
    
    // 根据当前选中的 tab 确定 labelType
    let labelType = null;
    switch(currentTab) {
      case 1: labelType = 1; break; // 流量主
      case 2: labelType = 2; break; // 品牌方
      case 3: labelType = 3; break; // 供应链
      case 4: labelType = 4; break; // 服务商
      case 5: labelType = 5; break; // 投资人
      default: labelType = null; // 全部
    }

    // 构建请求体
    const requestData = {
      size,
      labelType,
      keyword: keyword.trim() // 添加关键词搜索
    };

    // 只有加载更多时才带上 lastId
    if (isLoadMore && lastId) {
      requestData.lastId = lastId;
    }

    // 显示加载中
    wx.showLoading({
      title: '加载中...'
    });

    wx.request({
      url: `${config.baseURL}/knowledge/user/member/scroll`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: requestData,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code === 200) {
          const newList = res.data.data.list || [];
          
          this.setData({
            memberList: isLoadMore ? [...this.data.memberList, ...newList] : newList,
            lastId: res.data.data.nextLastId || '',
            hasMore: res.data.data.hasMore
          });
        } else {
          wx.showToast({
            title: res.data.message || '获取数据失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },

  // 会员卡片点击事件
  onMemberCardTap(e) {
    console.log('会员卡片被点击');
    const memberId = e.currentTarget.dataset.id;
    // 找到对应的会员信息
    const memberInfo = this.data.memberList.find(item => item.id === memberId);
    
    // 将会员信息转为字符串传递
    wx.navigateTo({
      url: `/pages/member-detail/member-detail?memberInfo=${encodeURIComponent(JSON.stringify(memberInfo))}`,
    });
  }
})