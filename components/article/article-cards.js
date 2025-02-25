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
            rightArrow: 'https://mini.9000aigc.com/assets/icons/right.png'
        },
        currentList: [], // 当前显示的列表
        showAll: false,
        displayList: [],  // 用于存储实际显示的列表
        articles: [] // 存储后端返回的文章数据
    },

    lifetimes: {
        attached() {
            // 组件加载时获取数据
            this.fetchArticles();
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 获取文章数据
        fetchArticles() {
            // 这里模拟调用后端API
            const mockData = {
                code: 200,
                message: "操作成功",
                data: {
                    records: [
                        {
                            "id": "1892139561056780289",
                            "title": "刘量量，你上学没戏了。。。。",
                            "coverImage": "https://knowledge.9000aigc.com/article/cover/2025-02/cover-557a4d56ce15410a9b50d866a852cf17.png",
                            "summary": "测试文章",
                            "categories": [
                                {
                                    "id": "1892030725616566273",
                                    "parentId": "0",
                                    "name": "AI 技术",
                                    "level": 1,
                                    "sort": 101,
                                    "path": "1892030725616566273",
                                    "createTime": "2025-02-19T09:57:32",
                                    "updateTime": "2025-02-19T09:57:32"
                                }
                            ],
                            "tags": [
                                {
                                    "id": "1892055058640543746",
                                    "name": "抖音",
                                    "createTime": "2025-02-19T11:34:13",
                                    "updateTime": "2025-02-19T11:34:13"
                                }
                            ],
                            "memberOnly": 1,
                            "isMemberOnly": true,
                            "isUnlocked": false,
                            "status": 1,
                            "viewCount": 0,
                            "likeCount": 0,
                            "createTime": "2025-02-19T17:10:00",
                            "updateTime": "2025-02-19T17:10:00"
                        },
                        {
                            "id": "1892138654046928897",
                            "title": "群响夜话会 267 期｜小公司如何快速招人？群响 6 年创业血泪掏心窝子分享",
                            "coverImage": "https://knowledge.9000aigc.com/article/cover/2025-02/cover-557a4d56ce15410a9b50d866a852cf17.png",
                            "summary": "测试文章",
                            "categories": [
                                {
                                    "id": "1892030725616566273",
                                    "name": "AI 技术"
                                },
                                {
                                    "id": "1891759814472683522",
                                    "name": "小红书"
                                },
                                {
                                    "id": "1892043728181264385",
                                    "name": "抖音"
                                }
                            ],
                            "tags": [
                                {
                                    "id": "1892055058640543746",
                                    "name": "抖音"
                                },
                                {
                                    "id": "1892085447371268097",
                                    "name": "小红书"
                                }
                            ],
                            "memberOnly": 1,
                            "isMemberOnly": true,
                            "isUnlocked": false,
                            "status": 1,
                            "viewCount": 0,
                            "likeCount": 0,
                            "createTime": "2025-02-19T17:06:24",
                            "updateTime": "2025-02-19T17:06:24"
                        }
                    ],
                    "total": 2,
                    "size": 10,
                    "current": 1,
                    "pages": 1
                }
            };
            
            // 处理返回的数据
            const articles = mockData.data.records.map(item => ({
                id: item.id,
                title: item.title,
                coverImage: item.coverImage,
                tags: item.tags.map(tag => tag.name), // 提取标签名称
                updateTime: item.updateTime.split('T')[0], // 格式化时间
                isMemberOnly: item.isMemberOnly,
                categories: item.categories.map(cat => cat.name) // 添加分类信息
            }));

            this.setData({
                articles,
                currentList: articles,
                displayList: this.getDisplayList(articles)
            });
        },
        updateCurrentList() {
            // 根据类型获取对应的文章列表和UI配置
            const type = this.properties.cardType;
            const currentList = this.data.articles.filter(item => item.type === type) || [];
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
                url: `${pageUrl}?id=${index}&title=${encodeURIComponent(item.title)}&time=${item.updateTime}&author=${encodeURIComponent(item.author || '9000AI')}&tags=${encodeURIComponent(JSON.stringify(item.tags))}`
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
