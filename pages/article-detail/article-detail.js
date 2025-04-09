const config = require('../../utils/config.js')

Page({
  data: {
    id: '',
    content: '',
    loading: true,
    statusBarHeight: 0,
    navBarHeight: 44,
    isCollected: false,
    title: '',
    fromCollection: false,
    isMemberOnly: false,
    isLoggedIn: false,
    showLoginButton: false,
    userType: null,
    isUnlocked: false,
    buttonText: '登录账号，阅读完整内容',
    showQrcodeModal: false
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      id: options.id,
      fromCollection: options.from === 'collection'
    });
    this.checkLoginStatus();
    this.fetchArticleDetail();
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    const userType = wx.getStorageSync('userType');
    
    this.setData({
      isLoggedIn: !!(token && userInfo),
      userType: userType || null
    });
  },

  fetchArticleDetail() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    wx.request({
      url: `${config.baseURL}/knowledge/article/${this.data.id}`,
      method: 'GET',
      data: userInfo ? { userId: userInfo.id } : {},
      header: token ? { 'Authorization': `Bearer ${token}` } : {},
      success: (res) => {
        if (res.data.code === 200 && res.data.data) {
          let content = res.data.data.content;
          content = this.processRichTextContent(content);
          
          // 打印isUnlocked的值
          console.log('文章解锁状态 isUnlocked:', res.data.data.isUnlocked);
          
          // 根据登录状态、会员限制和是否解锁来决定是否显示登录按钮
          const isUnlocked = res.data.data.isUnlocked || false;
          const showLoginButton = (!this.data.isLoggedIn || (this.data.isLoggedIn && !isUnlocked));
          const buttonText = this.data.isLoggedIn ? (isUnlocked ? '' : '加入会员查看更多') : '登录账号，阅读完整内容';
          
          this.setData({
            content,
            loading: false,
            title: res.data.data.title || '文章详情',
            isCollected: this.data.fromCollection ? true : (res.data.data.isCollected || false),
            isMemberOnly: res.data.data.isMemberOnly || false,
            isUnlocked: isUnlocked,
            showLoginButton,
            buttonText
          });
        }
      },
      fail: (err) => {
        console.error('请求失败：', err);
        this.setData({ loading: false });
      }
    });
  },

  // 处理登录按钮点击
  handleLogin() {
    // 如果已登录但文章未解锁，显示客服二维码模态框
    if (this.data.isLoggedIn && !this.data.isUnlocked) {
      this.setData({
        showQrcodeModal: true
      });
    } else {
      // 未登录用户跳转到登录页
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
    }
  },
  
  // 关闭二维码模态框
  closeQrcodeModal() {
    this.setData({
      showQrcodeModal: false
    });
  },
  
  // 阻止事件冒泡
  stopPropagation() {
    // 仅用于阻止事件冒泡
    return;
  },

  processRichTextContent(html) {
    // 如果是完整的HTML文档，提取body中的内容
    if (html.includes('<!DOCTYPE html>') || html.includes('<html')) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        html = bodyMatch[1].trim();
      }
    }
    return html;
  },

  handleBack() {
    // 获取当前页面栈
    const pages = getCurrentPages();
    
    // 如果页面栈中有多个页面，则正常返回
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      // 如果只有当前页面，则跳转到首页
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  onShareAppMessage() {
    return {
      title: this.data.title,
      path: `/pages/article-detail/article-detail?id=${this.data.id}`,
      imageUrl: 'https://miniknowledge.9000aigc.com/assets/images/logo_avatar.png'
    };
  },

  // 处理收藏/取消收藏
  handleCollection() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    if (!token || !userInfo) {
      wx.navigateTo({ url: '/pages/auth/auth' });
      return;
    }

    // 如果来自收藏页面，直接设置 actionType 为 0（取消收藏）
    const actionType = this.data.fromCollection ? 0 : (this.data.isCollected ? 0 : 1);

    wx.request({
      url: `${config.baseURL}/knowledge/article/favorite/toggle`,
      method: 'POST',
      data: {
        userId: userInfo.id,
        articleId: this.data.id,
        actionType: actionType
      },
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200 && res.data.data) {
          // 更新收藏状态
          this.setData({
            isCollected: !this.data.isCollected
          });
          
          // 显示操作提示
          wx.showToast({
            title: this.data.isCollected ? '收藏成功' : '已取消收藏',
            icon: 'success'
          });

          // 如果是从收藏页面进来的，取消收藏后返回上一页
          if (this.data.fromCollection && !this.data.isCollected) {
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          }
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  // 在页面显示时检查登录状态
  onShow() {
    this.checkLoginStatus();
  },
}); 