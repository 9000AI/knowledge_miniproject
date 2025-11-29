const config = require('../../utils/config.js')
const shareUtils = require('../../utils/share.js')

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
    showQrcodeModal: false,
    tagStyle: {
      body: 'color: #2B2B2B; line-height: 1.9; word-break: break-word;',
      h1: 'font-size: 48rpx; font-weight: 800; text-align: center; margin: 40rpx 0 28rpx; line-height: 1.35; letter-spacing: 1rpx; color: #0F0F0F; text-shadow: 0 2rpx 6rpx rgba(0,0,0,0.06);',
      h2: 'font-size: 40rpx; font-weight: 700; margin: 36rpx 0 22rpx; line-height: 1.4; padding-left: 20rpx;',
      h3: 'font-size: 34rpx; font-weight: 700; margin: 30rpx auto 18rpx; color: #222; line-height: 1.45; background: #E3F1B2; padding: 12rpx 16rpx; border-radius: 12rpx; display: table;',
      h4: 'font-size: 30rpx; font-weight: 600; margin: 24rpx 0 14rpx; color: #333; line-height: 1.5; padding-left: 16rpx; border-left: 6rpx solid #E5F2A8;',
      h5: 'font-size: 28rpx; font-weight: 600; margin: 20rpx 0 12rpx; color: #444; line-height: 1.55;',
      h6: 'font-size: 26rpx; font-weight: 600; margin: 18rpx 0 10rpx; color: #555; line-height: 1.6;',
      p: 'text-align: justify; margin: 18rpx 0; line-height: 1.9; color: #2B2B2B;',
      img: 'display: block; width: 100%; border-radius: 16rpx; box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08); margin: 24rpx auto;',
      blockquote: 'margin: 24rpx 0; padding: 20rpx 24rpx; background: #F7FAEF; border-left: 8rpx solid #C8E256; color: #445; border-radius: 12rpx;',
      ul: 'margin: 16rpx 0; padding-left: 40rpx;',
      ol: 'margin: 16rpx 0; padding-left: 40rpx;',
      li: 'margin: 8rpx 0; line-height: 1.9;',
      a: 'color: #007ACC; text-decoration: underline; word-break: break-all;',
      strong: 'color: #101010;',
      code: 'font-family: Menlo, Consolas, Monaco, monospace; background: #F5F7FA; padding: 4rpx 8rpx; border-radius: 8rpx; color: #C7254E;',
      pre: 'font-family: Menlo, Consolas, Monaco, monospace; background: #0F172A; color: #E2E8F0; padding: 20rpx; border-radius: 12rpx; overflow: auto; line-height: 1.8; margin: 24rpx 0;',
      hr: 'border: none; border-top: 2rpx solid #EEE; margin: 24rpx 0;',
      table: 'width: 100%; border-collapse: collapse; margin: 24rpx 0; font-size: 28rpx;',
      th: 'background: #F5F7FA; border: 2rpx solid #EEE; padding: 12rpx 16rpx; text-align: left; color: #333; font-weight: 600;',
      td: 'border: 2rpx solid #EEE; padding: 12rpx 16rpx; color: #444;'
    },
    containerStyle: 'font-size: 30rpx; line-height: 1.9; color: #2B2B2B; word-break: break-word;'
  },

  onLoad(options) {
    // 启用分享菜单
    shareUtils.enableShareMenu()
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
          
          // 根据登录状态、会员限制和是否解锁来决定是否显示登录按钮
          const isUnlocked = res.data.data.isUnlocked || false;
          const showLoginButton = (!this.data.isLoggedIn || (this.data.isLoggedIn && !isUnlocked));
          const buttonText = this.data.isLoggedIn ? (isUnlocked ? '' : '加入会员查看更多') : '登录账号，阅读完整内容';
          
          // 如果内容为空或只有图片，添加一些提示文本
          if (!content || content.trim() === '') {
            content = '<p>内容加载中...</p>';
          }
          
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

  // 分享给好友
  onShareAppMessage(options) {
    const { title, id } = this.data
    return {
      title: title || '精彩文章分享',
      path: `/pages/article-detail/article-detail?id=${id}&source=share`,
      imageUrl: 'https://mini.9000aigc.com/assets/images/share-article.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { title, id } = this.data
    return {
      title: title || '精彩文章分享',
      query: `id=${id}&source=timeline&t=${Date.now()}`,
      imageUrl: 'https://mini.9000aigc.com/assets/images/share-article-timeline.png'
    }
  },

  // 添加到收藏
  onAddToFavorites() {
    const { title, id } = this.data
    return {
      title: title || '精彩文章收藏',
      imageUrl: 'https://mini.9000aigc.com/assets/images/favorite-article.png',
      query: `id=${id}&source=favorite&t=${Date.now()}`
    }
  },

  // 复制文章链接
  copyArticleLink() {
    const { id, title } = this.data
    const link = `${shareUtils.getBaseUrl()}/pages/article-detail/article-detail?id=${id}&from=copy`
    
    wx.setClipboardData({
      data: link,
      success: () => {
        wx.showToast({
          title: '文章链接已复制',
          icon: 'success',
          duration: 2000
        })
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  }
}); 