Page({
    data: {
        title: '',
        time: '',
        author: '',
        tags: [],
        content: '',
        loading: true,
        showMask: false  // 添加控制蒙版显示的状态
    },

    // 添加返回按钮处理方法
    handleBack() {
        wx.navigateBack({
            delta: 1,
            fail: (err) => {
                console.error('返回失败：', err);
                wx.showToast({
                    title: '返回失败',
                    icon: 'none'
                });
            }
        });
    },

    onLoad: function(options) {
        const { scene, articleId, title, time, tags } = options;
        
        // 先显示加载中
        wx.showLoading({ title: '加载中...' });
        
        // 设置页面数据
        this.setData({
            title: title || '',
            time: time || '',
            tags: tags ? JSON.parse(tags) : [],
            author: '9000AI',  // 可以根据需要设置作者
            loading: false
        });
        
        // Mock 数据，实际项目中这里会调用后端接口
        this.mockLoadArticle(scene, articleId);
        
        wx.hideLoading();
    },

    // Mock 加载文章数据
    mockLoadArticle(scene, articleId) {
        // 模拟不同场景的文章数据
        const mockArticles = {
            '抖音': {
                articles: [
                    {
                        id: '1',
                        title: '抖音运营核心技巧分享',
                        time: '2024-03-20',
                        author: '9000AI',
                        tags: ['运营干货', '实战案例'],
                        content: `
                            <div class="article-content">
                               
                             <p> 前段时间，小杨哥和辛巴的事儿闹得沸沸扬扬，</p>

                             <p> 你们觉得抖音对于小杨哥这个事情是开心还是害怕？ </p>

                             <p> 算法的食物是流量，具体而言就是每一个平台日活的时间， </p>

                             <p> 更进一步地讲是用户在这个平台投射的注意力， 注意力才能带来成交，注意力才能有平台用来进行算法调配的基本资源， </p>

                             <p> 用户时间就是算法推荐平台的基本生产资料，这个生产资料被平台中的KOL吸引创造，KOL 的内容，短视频、直播就是维持这个的基本生产链。 </p>

                             <p> 小杨哥和辛巴的战斗，抖音是利好的， </p>
                              <strong>至少是在背后坐山观虎斗，等着超级头部被消耗被做烂的，</strong>
                                <p> 前段时间，小杨哥和辛巴的事儿闹得沸沸扬扬，</p>

                             <p> 你们觉得抖音对于小杨哥这个事情是开心还是害怕？ </p>

                             <p> 算法的食物是流量，具体而言就是每一个平台日活的时间， </p>

                             <p> 更进一步地讲是用户在这个平台投射的注意力， 注意力才能带来成交，注意力才能有平台用来进行算法调配的基本资源， </p>

                             <p> 用户时间就是算法推荐平台的基本生产资料，这个生产资料被平台中的KOL吸引创造，KOL 的内容，短视频、直播就是维持这个的基本生产链。 </p>

                             <p> 小杨哥和辛巴的战斗，抖音是利好的， </p>
                            </div>
                        `
                    },
                    {
                        id: '2',
                        title: '如何打造爆款抖音内容',
                        time: '2024-03-19',
                        author: '9000AI',
                        tags: ['内容创作', '数据分析'],
                        content: `
                            <div class="article-content">
                                <h2>爆款内容制作指南</h2>
                                <p>1. 选择热门话题</p>
                                <p>2. 制作高质量视频</p>
                                <p>3. 掌握剪辑技巧</p>
                                <img src="https://mini.9000aigc.com/assets/articles/douyin2.png" />
                            </div>
                        `
                    },
                    {
                        id: '3',
                        title: '抖音流量提升实战指南',
                        time: '2024-03-18',
                        author: '9000AI',
                        tags: ['流量运营', '变现技巧'],
                        content: `
                            <div class="article-content">
                                <h2>流量提升策略</h2>
                                <p>1. 了解算法机制</p>
                                <p>2. 互动率优化</p>
                                <p>3. 发布时间选择</p>
                                <img src="https://mini.9000aigc.com/assets/articles/douyin3.png" />
                            </div>
                        `
                    }
                ]
            }
        };

        // 获取对应场景的文章
        const article = mockArticles[scene]?.articles.find(a => a.id === String(articleId));
        
        if (article) {
            this.setData({
                ...article,
                loading: false
            });
        }
        
        wx.hideLoading();
    },

    // 实际项目中的接口调用方法
    async loadArticle(scene, articleId) {
        try {
            const res = await wx.request({
                url: `https://api.example.com/articles/${scene}/${articleId}`,
                method: 'GET'
            });
            
            if (res.statusCode === 200) {
                this.setData({
                    ...res.data,
                    loading: false
                });
            }
        } catch (error) {
            console.error('加载文章失败:', error);
            wx.showToast({
                title: '加载失败',
                icon: 'error'
            });
        } finally {
            wx.hideLoading();
        }
    },

    // 处理解锁按钮点击
    handleUnlock() {
        wx.showModal({
            title: '开通会员',
            content: '开通会员即可解锁全部内容',
            confirmText: '立即开通',
            success(res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/vip/index'  // 跳转到会员页面
                    });
                }
            }
        });
    },

    // 处理收藏按钮点击
    handleCollect() {
        // 这里可以添加收藏逻辑
        wx.showToast({
            title: '收藏成功',
            icon: 'success'
        });
    },

    // 定义页面的分享行为
    onShareAppMessage: function() {
        return {
            title: this.data.title,
            path: `/pages/articles/douyin/index?scene=抖音&articleId=${this.data.id}&title=${this.data.title}&time=${this.data.time}&tags=${JSON.stringify(this.data.tags)}`,
            imageUrl: 'https://mini.9000aigc.com/assets/share/douyin-share.png' // 分享图片
        }
    },

    // 添加滚动监听方法
    onPageScroll(e) {
        // 获取页面高度
        wx.createSelectorQuery()
            .select('.article-content')
            .boundingClientRect((rect) => {
                if (rect) {
                    // 当滚动到内容底部附近时显示蒙版
                    const showMask = e.scrollTop + wx.getSystemInfoSync().windowHeight > rect.height - 200;
                    if (showMask !== this.data.showMask) {
                        this.setData({ showMask });
                    }
                }
            })
            .exec();
    }
});