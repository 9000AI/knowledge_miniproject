const config = require('../../utils/config.js')

Component({
  properties: {
    cardList: {
      type: Array,
      value: []
    }
  },

  data: {
    categoryList: [] // 添加存储分类数据的数组
  },

  lifetimes: {
    attached() {
      this.fetchCategories();
    }
  },

  methods: {
    handleCardClick(e) {
      const index = e.currentTarget.dataset.index;
      const category = this.data.categoryList[index];
      
      // 跳转到分类文章列表页面
      wx.navigateTo({
        url: `/pages/category-articles/category-articles?id=${category.id}&name=${category.name}`,
        fail(err) {
          console.error('页面跳转失败：', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },

    fetchCategories() {
      const token = wx.getStorageSync('token') || '';
      
      wx.request({
        url: `${config.baseURL}/knowledge/category/first-level`,
        method: 'GET',
        header: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          if (res.data && res.data.code === 200 && Array.isArray(res.data.data)) {
            // 分离出 featured 为 1 的数据（不要求必须有 cover_image）
            const featuredData = res.data.data.filter(item => 
              item.featured === 1
            );
            
            // 分离出其他数据（排除featured=1的分类）
            const otherData = res.data.data.filter(item => 
              item.featured !== 1
            );
            
            // 对 featured 数据按 sort 降序排序
            featuredData.sort((a, b) => b.sort - a.sort);
            
            // 对其他数据按 sort 降序排序
            otherData.sort((a, b) => b.sort - a.sort);
            
            // 合并数据，featured 在前
            const sortedData = featuredData.concat(otherData);
            
            // 只取前三个分类
            const topThree = sortedData.slice(0, 3);
            
            // 映射数据到卡片格式
            const cardList = topThree.map(item => ({
              image: item.cover_image || 'https://miniknowledge.9000aigc.com/assets/images/zl-one.png',
              title: item.name
            }));

            this.setData({ 
              cardList,
              categoryList: topThree // 保存完整的分类数据
            });
          } else {
            console.error('获取分类失败: 响应格式错误', res);
            this.useDefaultData();
          }
        },
        fail: (error) => {
          console.error('获取分类失败:', error);
          this.useDefaultData();
        }
      });
    },

    useDefaultData() {
      // 使用默认数据
      const defaultData = [
        {
          id: '1896820356350521346',
          name: '有趣有料',
          cover_image: 'https://miniknowledge.9000aigc.com/assets/images/zl-one.png'
        },
        {
          id: '1896820726854365185',
          name: '李家旺专栏',
          cover_image: 'https://miniknowledge.9000aigc.com/assets/images/zl_two.jpg'
        },
        {
          id: '1896820777026629634',
          name: '闭环裂变',
          cover_image: 'https://miniknowledge.9000aigc.com/assets/images/zl-three.png'
        }
      ];

      this.setData({
        cardList: defaultData.map(item => ({
          image: item.cover_image,
          title: item.name
        })),
        categoryList: defaultData
      });
    }
  }
})
