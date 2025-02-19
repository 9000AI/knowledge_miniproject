Page({
  data: {
    title: '',
    time: '',
    author: '',
    tags: [],
    content: '',
    loading: true,
    pdfUrl: '', // PDF 文件链接
    error: false,
    errorMsg: ''
  },

  handleBack() {
    wx.navigateBack({
      delta: 1,
      fail: (err) => {
        console.error('返回失败：', err);
        wx.showToast({
          title: '返回失败',
          icon: 'none'
        });
      }
    });
  },

  onLoad: function(options) {
    const { scene, articleId, title, time, tags } = options;
    
    // 先显示加载中
    wx.showLoading({ title: '加载中...' });
    
    // 设置页面数据
    this.setData({
      title: title || '',
      time: time || '',
      tags: tags ? JSON.parse(tags) : [],
      author: '9000AI',
      loading: false
    });
    
    // Mock 数据，实际项目中这里会调用后端接口
    this.mockLoadArticle(scene, articleId);
    
    wx.hideLoading();
  },

  mockLoadArticle(scene, articleId) {
    // 模拟不同场景的文章数据
    const mockArticles = {
      '视频号': {
        articles: [
          {
            id: '1',
            title: '视频号运营核心技巧分享',
            time: '2024-03-20',
            author: '9000AI',
            tags: ['运营干货', '实战案例'],
            isPdf: true,
            pdfUrl: 'https://www.example.com/path/to/your/pdf.pdf'
          },
          // ... 可以添加更多文章
        ]
      }
    };

    // 获取对应场景的文章
    const article = mockArticles[scene]?.articles.find(a => a.id === String(articleId));
    
    if (article) {
      if (article.isPdf) {
        // 如果是 PDF 文章，设置 pdfUrl
        this.setData({
          ...article,
          loading: false
        });
        this.mockLoadPdfContent(article.pdfUrl);
      } else {
        // 如果是普通文章，设置 content
        this.setData({
          ...article,
          loading: false
        });
      }
    }
  },

  mockLoadPdfContent(url) {
    setTimeout(() => {
      this.setData({
        loading: false,
        pdfUrl: url || 'https://www.nuaa.edu.cn/_js/_portletPlugs/swfPlayer/pdfjs22228/web/viewer.html?file=/_upload/article/files/3d/8d/78ed42f44031bcb6793b0eb27af1/8e6ad93b-4902-4fd8-bba5-bfabaf852885.pdf'
      });
    }, 1500);
  },

  // PDF 加载失败处理
  handleError() {
    this.setData({
      loading: false,
      error: true,
      errorMsg: 'PDF 文件加载失败，请稍后重试'
    });
  }
});
