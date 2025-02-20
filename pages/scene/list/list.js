import mockData from '../../../utils/mock';

Page({
    data: {
        pageConfig: null
    },

    onLoad: function (options) {
        const { scene } = options; // 从页面参数获取场景类型
        
        // 获取对应场景的数据
        const sceneData = mockData.getMockData(scene);
        
        if (sceneData) {
            this.setData({
                pageConfig: sceneData
            });
        } else {
            wx.showToast({
                title: '未找到对应场景',
                icon: 'none'
            });
            setTimeout(() => {
                wx.navigateBack();
            }, 1500);
        }
    },

    handleBack() {
        wx.navigateBack({
            delta: 1
        });
    },

    onArticleTap(e) {
        const { index } = e.currentTarget.dataset;
        const { section, article } = this.getArticleInfo(index);
        
        // 修改跳转到 detail 页面
        wx.navigateTo({
            url: `/pages/scene/detail/detail?scene=${this.data.pageConfig.scene}&articleId=${index + 1}&title=${encodeURIComponent(article.title)}&time=${article.time}&tags=${encodeURIComponent(JSON.stringify(article.tags))}`,
            fail: (err) => {
                console.error('页面跳转失败：', err);
                wx.showToast({
                    title: '页面跳转失败',
                    icon: 'none'
                });
            }
        });
    },

    // 获取文章信息的辅助方法
    getArticleInfo(index) {
        for (const section of this.data.pageConfig.sections) {
            if (index < section.articles.length) {
                return {
                    section,
                    article: section.articles[index]
                };
            }
            index -= section.articles.length;
        }
        return null;
    },

    // 获取场景路径
    getScenePath() {
        const sceneMap = {
            videoAccount: 'video-account',
            xiaohongshu: 'xiaohongshu',
            douyin: 'douyin'
        };
        return sceneMap[this.data.scene] || 'video-account';
    },

    // 获取场景名称
    getSceneName() {
        const sceneMap = {
            videoAccount: '视频号',
            xiaohongshu: '小红书',
            douyin: '抖音'
        };
        return sceneMap[this.data.scene] || '视频号';
    }
})
