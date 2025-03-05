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

    async fetchCategories() {
      try {
        const token = wx.getStorageSync('token') || '';
        const res = await wx.request({
          url: 'https://know-admin.9000aigc.com/knowledge/category/first-level',
          method: 'GET',
          header: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });

        if (res.data.code === 200 && Array.isArray(res.data.data)) {
          // 按 sort 降序排序
          const sortedData = res.data.data.sort((a, b) => b.sort - a.sort);
          
          // 只取前三个分类
          const topThree = sortedData.slice(0, 3);
          
          // 映射数据到卡片格式
          const cardList = topThree.map(item => ({
            image: 'https://mini.9000aigc.com/assets/images/zl-one.png', // 默认图片，可根据实际需求修改
            title: item.name
          }));

          this.setData({ 
            cardList,
            categoryList: topThree // 保存完整的分类数据
          });
        }
      } catch (error) {
        console.error('获取分类失败:', error);
        // 使用默认数据
        const defaultData = [
          {
            id: '1',
            name: '加入我们',
            image: 'https://mini.9000aigc.com/assets/images/zl-one.png'
          },
          {
            id: '2',
            name: '李家旺专栏',
            image: 'https://mini.9000aigc.com/assets/images/zl_two.jpg'
          },
          {
            id: '3',
            name: '闭环裂变',
            image: 'https://mini.9000aigc.com/assets/images/zl-three.png'
          }
        ];

        this.setData({
          cardList: defaultData.map(item => ({
            image: item.image,
            title: item.name
          })),
          categoryList: defaultData
        });
      }
    }
  }
})
