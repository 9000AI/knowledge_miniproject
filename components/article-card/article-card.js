Component({
    options: {
        styleIsolation: 'isolated'
    },
    /**
     * 组件的属性列表
     */
    properties: {
        cardType: {
            type: String,
            value: 'latest' // 默认为最新文章类型
        },
        limit: {
            type: Number,
            value: -1  // 默认值为-1表示显示全部
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 界面文案配置，根据不同类型显示不同标题
        uiConfig: {
            latest: {
                sectionTitle: '最新',
                moreText: '更多'
            },
            nightTalk: {
                sectionTitle: '9000AI夜谈会',
                moreText: '更多'
            },
            column: {
                sectionTitle: 'xx专栏',
                moreText: '更多'
            },
            download: {
                sectionTitle: '资料下载',
                moreText: '更多'
            }
        },
        // 添加图标配置
        icons: {
            rightArrow: 'https://miniknowledge.9000aigc.com/assets/icons/right.png'
        },
        // 不同类型的文章列表
        articleLists: {
            latest: [
                {
                    title: "群响夜话会267期|小公司如何快速招人?群响6年创业血泪掏心窝子分享",
                    time: "2024-03-20",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
                {
                    title: "IP打造实战案例",
                    time: "2024-03-18",
                    tags: ["资料下载", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
                {
                    title: "短视频运营技巧分享",
                    time: "2024-03-20",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
                {
                    title: "群响夜话会267期|小公司如何快速招人?群响6年创业血泪掏心窝子分享",
                    time: "2024-03-20",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
                {
                    title: "IP打造实战案例",
                    time: "2024-03-18",
                    tags: ["资料下载", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
                {
                    title: "短视频运营技巧分享",
                    time: "2024-03-20",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
            ],
            nightTalk: [
                {
                    title: "群响夜话会267期|小公司如何快速招人?",
                    time: "2024-03-20",
                    tags: ["夜话会", "创业分享"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
                {
                    title: "短视频运营技巧分享",
                    time: "2024-03-20",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
                {
                    title: "IP打造实战案例",
                    time: "2024-03-18",
                    tags: ["资料下载", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
                {
                    title: "短视频运营技巧分享",
                    time: "2024-03-20",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/black.jpg"
                },
            ],
            column: [
                {
                    title: "专栏文章1",
                    time: "2024-03-20",
                    tags: ["专栏", "观点"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
                {
                    title: "短视频运营技巧分享",
                    time: "2024-03-20",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
                {
                    title: "IP打造实战案例",
                    time: "2024-03-18",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
                {
                    title: "短视频运营技巧分享",
                    time: "2024-03-20",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/ip.png"
                },
            ],
            download: [
                {
                    title: "短视频运营技巧分享",
                    time: "2024-03-20",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/green.jpg"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/green.jpg"
                },
                {
                    title: "IP打造实战案例",
                    time: "2024-03-18",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/green.jpg"
                },
                {
                    title: "短视频运营技巧分享",
                    time: "2024-03-20",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/green.jpg"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/green.jpg"
                },
                {
                    title: "私域流量增长方法论",
                    time: "2024-03-19",
                    tags: ["资料下载", "全域", "直播"],
                    image: "https://miniknowledge.9000aigc.com/assets/course/green.jpg"
                },
            ]
        },
        currentList: [], // 当前显示的列表
        showAll: false,
        displayList: []  // 用于存储实际显示的列表
    },

    lifetimes: {
        attached() {
            this.updateCurrentList();
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        updateCurrentList() {
            // 根据类型获取对应的文章列表和UI配置
            const type = this.properties.cardType;
            const currentList = this.data.articleLists[type] || [];
            const uiText = this.data.uiConfig[type] || this.data.uiConfig.latest;

            this.setData({
                currentList,
                uiText,
                displayList: this.getDisplayList(currentList)
            });
        },
        getDisplayList(list) {
            if (!this.data.showAll && this.properties.limit > 0) {
                return list.slice(0, this.properties.limit);
            }
            return list;
        },
        onItemTap(e) {
            const index = e.currentTarget.dataset.index;
            const item = this.data.currentList[index];
            
            // 根据不同类型跳转到不同页面
            const pageUrls = {
                latest: '/pages/update-item/update-item',
                nightTalk: '/pages/night-talk/detail',
                column: '/pages/column/detail',
                download: '/pages/download/detail'
            };

            const pageUrl = pageUrls[this.properties.cardType] || pageUrls.latest;

            wx.navigateTo({
                url: `${pageUrl}?id=${index}&title=${encodeURIComponent(item.title)}&time=${item.time}&author=${encodeURIComponent(item.author || '9000AI')}&tags=${encodeURIComponent(JSON.stringify(item.tags))}`
            });
        },
        onMoreTap() {
            // 根据不同类型跳转到不同的列表页
            const listPages = {
                latest: '/pages/update-list/update-list',
                nightTalk: '/pages/night-talk/list',
                column: '/pages/column/list',
                download: '/pages/download/list'
            };

            const pageUrl = listPages[this.properties.cardType] || listPages.latest;

            wx.navigateTo({
                url: pageUrl
            });
        }
    }
})
