Page({
    data: {
        articles: [], // 存储文章数据
        hasMore: true, // 是否还有更多数据
        lastId: '', // 上一页最后一条记录的ID
    },

    onLoad() {
        this.fetchArticles(); // 页面加载时请求文章数据
    },

    fetchArticles() {
        const token = wx.getStorageSync('token'); // 获取token
        if (!token) {
            console.error('未登录');
            return; // 如果未登录，直接返回
        }

        const requestData = {
            lastId: this.data.lastId || "", // 初始请求时传空
            limit: 10,
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

    loadMore() {
        if (this.data.hasMore) {
            this.fetchArticles(); // 加载更多文章
        }
    }
});
