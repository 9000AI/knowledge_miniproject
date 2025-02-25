const config = require('../../utils/config.js')

Component({
  data: {
    categories: [],
    // 描述文案池
    descList: [
      '商业新玩法',
      '市场新机遇',
      '科技新未来',
      '变现新方向',
      '升级新方案',
      '价值新高地',
      '市场新商机',
      '营销新赛道',
      '创新新思路',
      '运营新模式'
    ],
    // 添加图片名称数组
    cardImages: [
      'one', 'two', 'three', 'four', 'five', 'six',
      'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'
    ]
  },

  // 添加生命周期函数
  lifetimes: {
    attached() {
      // 组件加载时就获取数据
      this.getFirstLevelCategories()
    }
  },

  methods: {
    // 获取随机描述
    getRandomDesc() {
      const index = Math.floor(Math.random() * this.data.descList.length)
      return this.data.descList[index]
    },

    // 获取一级分类
    getFirstLevelCategories() {
      const token = wx.getStorageSync('token')
      
      if (!token) {
        console.error('未登录')
        return
      }

      wx.request({
        url: `${config.baseURL}/knowledge/category/first-level`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success: (res) => {
          if (res.data.code === 200) {
            // 为每个分类添加随机描述
            const categoriesWithDesc = res.data.data.map(item => ({
              ...item,
              desc: this.getRandomDesc()
            }))
            this.setData({
              categories: categoriesWithDesc
            })
          }
        },
        fail: (err) => {
          console.error('请求失败：', err)
        }
      })
    },

    // 添加点击分类的处理方法
    onTapCategory(e) {
      const category = e.currentTarget.dataset.category;
      wx.navigateTo({
        url: `../category-articles/category-articles?id=${category.id}&name=${category.name}`
      });
    }
  }
}) 