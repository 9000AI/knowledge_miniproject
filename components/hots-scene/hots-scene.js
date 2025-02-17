Component({
    properties: {
        sceneList: {
            type: Array,
            value: [
                '视频号', '小红书', '抖音',
                '直播', 'IP', '私域',
                '知识付费', 'AI', '出海跨境',
                '大厂转型', '电商转型', '实体'
            ]
        }
    },
    methods: {
        handleCardClick(e) {
            const scene = e.currentTarget.dataset.scene;
            
            // 定义场景与页面路径的映射关系
            const scenePages = {
                '视频号': '/pages/scenes/video-account/index',
                '小红书': '/pages/scenes/xiaohongshu/index',
                '抖音': '/pages/scenes/douyin/index'
            };

            // 获取对应的页面路径
            const pagePath = scenePages[scene];
            
            // 如果存在对应的页面路径，则进行跳转
            if (pagePath) {
                wx.navigateTo({
                    url: pagePath,
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
    }
})
