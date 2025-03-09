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
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      id: options.id,
      fromCollection: options.from === 'collection'
    });
    this.fetchArticleDetail();
  },

  fetchArticleDetail() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    if (!token || !userInfo) {
      wx.navigateTo({ url: '/pages/auth/auth' });
      return;
    }

    wx.request({
      url: `${config.baseURL}/knowledge/article/${this.data.id}`,
      method: 'GET',
      data: { userId: userInfo.id },
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.data.code === 200 && res.data.data) {
          let content = res.data.data.content;
          content = this.processRichTextContent(content);
          
          this.setData({
            content,
            loading: false,
            title: res.data.data.title || '文章详情',
            isCollected: this.data.fromCollection ? true : (res.data.data.isCollected || false)
          });
        }
      },
      fail: (err) => {
        console.error('请求失败：', err);
        this.setData({ loading: false });
      }
    });
  },

  processRichTextContent(html) {
    // 如果是完整的HTML文档，提取body中的内容
    if (html.includes('<!DOCTYPE html>') || html.includes('<html')) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        html = bodyMatch[1].trim();
      }
    }

    // 处理图片样式
    html = html.replace(/<img[^>]*>/gi, (match) => {
      const style = 'max-width:100%;height:auto;display:block;margin:20rpx auto;';
      if (match.indexOf('style=') === -1) {
        return match.replace(/<img/i, `<img style="${style}"`);
      } else {
        return match.replace(/style="([^"]*)"/i, `style="$1;${style}"`);
      }
    });

    // 处理标题样式
    html = html.replace(/<h([1-6])[^>]*>/gi, (match, level) => {
      const fontSize = {
        1: '24px',
        2: '20px',
        3: '18px',
        4: '16px',
        5: '14px',
        6: '12px'
      }[level];
      return `<h${level} style="font-size:${fontSize};font-weight:bold;margin:20rpx 0;">`;
    });

    // 处理段落样式
    html = html.replace(/<p[^>]*>/gi, '<p style="margin:16rpx 0;line-height:1.6;">');

    // 处理列表样式
    html = html.replace(/<ul[^>]*>/gi, '<ul style="margin:16rpx 0;padding-left:32rpx;">');
    html = html.replace(/<ol[^>]*>/gi, '<ol style="margin:16rpx 0;padding-left:32rpx;">');
    html = html.replace(/<li[^>]*>/gi, '<li style="margin:8rpx 0;">');

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
}); 