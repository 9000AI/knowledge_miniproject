Component({
    // ... existing code ...

    /**
     * 组件的初始数据
     */
    data: {
        // ... existing data ...
        articles: [], // 存储文章数据
        hasMore: true, // 是否还有更多数据
        lastId: '', // 上一页最后一条记录的ID
    },

    properties: {
        // 添加文章属性，允许外部传入文章数据
        article: {
            type: Object,
            value: null
        }
    },

    lifetimes: {
        attached() {
            this.fetchArticles(); // 组件加载时请求文章数据
        }
    },

    methods: {
        // 获取文章数据
        fetchArticles() {
            const token = wx.getStorageSync('token'); // 获取token
            if (!token) {
                console.error('未登录');
                return; // 如果未登录，直接返回
            }

            const requestData = {
                lastId: this.data.lastId || "", // 初始请求时传空
                limit: 1,
                sortBy: "time",
                sortOrder: "desc",
                userId: "1001" // 这里可以根据实际情况设置
            };

            wx.request({
                url: 'http://192.168.1.93:8100/knowledge/article/category/cursor',
                method: 'POST',
                data: requestData,
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // 添加token到请求头
                },
                success: (res) => {
                    if (res.data.code === 200) {
                        const newArticles = res.data.data.articles.map(item => ({
                            id: item.id,
                            title: item.title,
                            coverImage: item.coverImage,
                            createTime: item.createTime.split('T')[0], // 格式化时间
                            isMemberOnly: item.isMemberOnly,
                        }));

                        this.setData({
                            articles: this.data.articles.concat(newArticles), // 合并新旧数据
                            hasMore: res.data.data.hasMore,
                            lastId: res.data.data.lastId // 更新lastId
                        });
                    } else {
                        console.error(res.data.message); // 处理错误信息
                    }
                },
                fail: (err) => {
                    console.error("请求失败", err);
                }
            });
        },

        // 添加点击文章跳转方法
        onTap() {
            const article = this.properties.article;
            if (article && article.id) {
                wx.navigateTo({
                    url: `/pages/article-detail/article-detail?id=${article.id}`
                });
            }
        },

        // 加载更多方法
        loadMore() {
            // 触发一个自定义事件，让父组件知道需要加载更多
            this.triggerEvent('loadmore');
        }
    }
});
