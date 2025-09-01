const config = require('../../utils/config.js')

Component({
  data: {
    hotSceneList: [],
    industryList: []
  },

  lifetimes: {
    attached() {
      this.fetchCategories();
    }
  },

  methods: {
    fetchCategories() {
      // 使用 Promise 方式处理请求
      new Promise((resolve, reject) => {
        wx.request({
          url: `${config.baseURL}/knowledge/category/first-level`,
          method: 'GET',
          success: (res) => {
            resolve(res.data);
          },
          fail: (error) => {
            reject(error);
          }
        });
      })
      .then(response => {
        if (response.code === 200 && Array.isArray(response.data)) {
          // 按 sort 降序排序
          const sortedData = response.data.sort((a, b) => a.sort - b.sort);
          
          // 分离热门场景（201-209）和行业联营（301-306）数据
          const hotSceneList = sortedData
            .filter(item => item.sort >= 201 && item.sort <= 209)
            .map(item => ({
              name: item.name,
              id: item.id,
              sort: item.sort,
              bgColor: '#d4ea3a' // 热门场景使用绿色背景
            }));

          const industryList = sortedData
            .filter(item => item.sort >= 301 && item.sort <= 306)
            .map(item => ({
              name: item.name,
              id: item.id,
              sort: item.sort,
              bgColor: '#dadad8' // 行业联营使用灰色背景
            }));

          // 按 sort 升序排序，确保显示顺序正确
          hotSceneList.sort((a, b) => a.sort - b.sort);
          industryList.sort((a, b) => a.sort - b.sort);

          this.setData({ 
            hotSceneList,
            industryList
          });
        } else {
          console.error('接口返回数据格式错误:', response);
          this.setDefaultData();
        }
      })
      .catch(error => {
        console.error('获取分类失败:', error);
        this.setDefaultData();
      });
    },

    setDefaultData() {
      // 设置默认数据
      this.setData({
        hotSceneList: [
          { name: '小红书', bgColor: '#d4ea3a', id: '1' },
          { name: '视频号', bgColor: '#d4ea3a', id: '2' },
          { name: '抖音', bgColor: '#d4ea3a', id: '3' }
        ],
        industryList: [
          { name: '出海跨境', bgColor: '#dadad8', id: '4' },
          { name: '情感', bgColor: '#dadad8', id: '5' },
          { name: '教育', bgColor: '#dadad8', id: '6' }
        ]
      });
    },

    handleCardClick(e) {
      const scene = e.currentTarget.dataset.scene;
      // 跳转到分类文章列表页面
      wx.navigateTo({
        url: `/pages/category-articles/category-articles?id=${scene.id}&name=${scene.name}`,
        fail(err) {
          console.error('页面跳转失败：', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },

    handleIndustryClick(e) {
      const industry = e.currentTarget.dataset.industry;
      // 跳转到分类文章列表页面
      wx.navigateTo({
        url: `/pages/category-articles/category-articles?id=${industry.id}&name=${industry.name}`,
        fail(err) {
          console.error('页面跳转失败：', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    }
  }
})
