Page({
    data: {
        articleList: [
            {
                title: "视频号运营核心技巧分享视频号运营核心技巧分享视频号运营核心技巧分享视频号运营核心技巧分享视频号运营核心技巧分享",
                time: "2024-03-20",
                tags: ["运营干货", "实战案例"]
            },
            {
                title: "如何打造爆款视频号内容",
                time: "2024-03-19",
                tags: ["内容创作", "数据分析"]
            },
            {
                title: "视频号流量提升实战指南",
                time: "2024-03-18",
                tags: ["流量运营", "变现技巧"]
            },
            {
                title: "视频号运营核心技巧分享",
                time: "2024-03-20",
                tags: ["运营干货", "实战案例"]
            },
            {
                title: "如何打造爆款视频号内容",
                time: "2024-03-19",
                tags: ["内容创作", "数据分析"]
            },
            {
                title: "视频号流量提升实战指南",
                time: "2024-03-18",
                tags: ["流量运营", "变现技巧"]
            },
            {
                title: "视频号运营核心技巧分享",
                time: "2024-03-20",
                tags: ["运营干货", "实战案例"]
            },
            {
                title: "如何打造爆款视频号内容",
                time: "2024-03-19",
                tags: ["内容创作", "数据分析"]
            },
            {
                title: "视频号流量提升实战指南",
                time: "2024-03-18",
                tags: ["流量运营", "变现技巧"]
            },
            {
                title: "视频号运营核心技巧分享",
                time: "2024-03-20",
                tags: ["运营干货", "实战案例"]
            },
            {
                title: "如何打造爆款视频号内容",
                time: "2024-03-19",
                tags: ["内容创作", "数据分析"]
            },
            {
                title: "视频号流量提升实战指南",
                time: "2024-03-18",
                tags: ["流量运营", "变现技巧"]
            }
        ]
    },
    handleBack() {
        wx.navigateBack({
            delta: 1
        });
    },
    onLoad: function (options) {
        // 页面加载时执行
    },
    onReady: function () {
        // 页面初次渲染完成时执行
    },
    onShow: function () {
        // 页面显示时执行
    },
    onArticleTap(e) {
        const index = e.currentTarget.dataset.index;
        const article = this.data.articleList[index];
        
        wx.navigateTo({
            url: `/pages/articles/video-account/index?scene=视频号&articleId=${index + 1}&title=${article.title}&time=${article.time}&tags=${JSON.stringify(article.tags)}`,
            fail: (err) => {
                console.error('页面跳转失败：', err);
                wx.showToast({
                    title: '页面跳转失败',
                    icon: 'none'
                });
            }
        });
    }
})
