Component({
    properties: {
        sceneList: {
            type: Array,
            value: [
                { name: '小红书', english: 'LittleRedBook', bgColor: '#d4ea3a' },
                { name: '视频号', english: 'VideoAccount', bgColor: '#d4ea3a' },
                { name: '抖音', english: 'Douyin', bgColor: '#d4ea3a' },
                { name: 'AI', english: 'Artificial', bgColor: '#d4ea3a' },
                { name: 'IP', english: 'Intellectual', bgColor: '#d4ea3a' },
                { name: '私域', english: 'PrivateDomain', bgColor: '#d4ea3a' },
                { name: '直播操盘', english: 'LiveStreaming', bgColor: '#d4ea3a' },
                { name: '腾讯生态', english: 'TencentEcosystem', bgColor: '#d4ea3a' },
                { name: '商业认识', english: 'BusinessInsight', bgColor: '#d4ea3a' }
            ]
        },
        industryList: {
            type: Array,
            value: [
                { name: '出海跨境', english: 'Overseas', bgColor: '#dadad8' },
                { name: '情感', english: 'Emotion', bgColor: '#dadad8' },
                { name: '教育', english: 'Education', bgColor: '#dadad8' },
                { name: '本地同城', english: 'LocalCity', bgColor: '#dadad8' },
                { name: '文化', english: 'Culture', bgColor: '#dadad8' },
                { name: '大健康', english: 'Healthcare', bgColor: '#dadad8' }
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
            const pagePath = scenePages[scene.name];
            
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
        },
        handleIndustryClick(e) {
            const industry = e.currentTarget.dataset.industry;
            console.log('点击了行业卡片:', industry.name);
            // 这里可以添加行业卡片的点击事件处理逻辑
        }
    }
})
