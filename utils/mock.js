const mockData = {
    // 视频号场景
    videoAccount: {
        scene: 'videoAccount',  // 添加场景标识
        title: '视频号运营',
        subtitle: '专业的视频号运营方案',
        sections: [
            {
                title: '1.视频号基础认知',
                articles: [
                    {
                        id: '1',
                        title: "视频号运营核心技巧分享",
                        time: "2024-03-20",
                        tags: ["运营干货", "实战案例"],
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
                    // ... 更多视频号基础文章
                ]
            },
            {
                title: '2.视频号的流量玩法和赚钱方向',
                articles: [
                    {
                        title: "视频号变现方案详解",
                        time: "2024-03-19",
                        tags: ["变现方案", "案例分析"]
                    },
                    // ... 更多变现相关文章
                ]
            }
        ]
    },

    // 小红书场景
    xiaohongshu: {
        scene: 'xiaohongshu',
        title: '小红书运营',
        subtitle: '专业的小红书运营方案',
        sections: [
            {
                title: '1.小红书运营入门',
                articles: [
                    {
                        id: '1',
                        title: "小红书笔记制作技巧",
                        time: "2024-03-20",
                        tags: ["笔记创作", "基础入门"],
                        content: `
                            <div class="article-content">
                                <h2>小红书笔记制作技巧</h2>
                                <p>1. 选择合适的标题</p>
                                <p>2. 图文排版技巧</p>
                                <p>3. 互动引导方法</p>
                            </div>
                        `
                    },
                    // ... 更多小红书入门文章
                ]
            },
            {
                title: '2.小红书高级运营',
                articles: [
                    {
                        title: "小红书爆款账号打造",
                        time: "2024-03-19",
                        tags: ["账号运营", "数据分析"]
                    },
                    // ... 更多高级运营文章
                ]
            }
        ]
    },

    // 抖音场景
    douyin: {
        title: '抖音运营',
        subtitle: '专业的抖音运营方案',
        sections: [
            {
                title: '1.抖音内容创作',
                articles: [
                    {
                        title: "抖音短视频制作技巧",
                        time: "2024-03-20",
                        tags: ["视频制作", "内容创作"]
                    },
                    // ... 更多抖音创作文章
                ]
            },
            {
                title: '2.抖音直播运营',
                articles: [
                    {
                        title: "抖音直播带货实战",
                        time: "2024-03-19",
                        tags: ["直播技巧", "带货方法"]
                    },
                    // ... 更多直播相关文章
                ]
            }
        ]
    },

    // 直播场景
    live: {
        title: '直播运营',
        subtitle: '专业的直播运营方案',
        sections: [
            {
                title: '1.直播基础入门',
                articles: [
                    {
                        title: "直播间运营技巧",
                        time: "2024-03-20",
                        tags: ["直播技巧", "基础入门"]
                    }
                ]
            }
        ]
    },

    // IP场景
    ip: {
        title: 'IP运营',
        subtitle: '专业的IP运营方案',
        sections: [
            {
                title: '1.IP打造基础',
                articles: [
                    {
                        title: "IP定位与规划",
                        time: "2024-03-20",
                        tags: ["IP打造", "规划方法"]
                    }
                ]
            }
        ]
    },

    // ... 其他场景的数据配置
};

// 获取场景数据的方法
const getMockData = (scene) => {
    return mockData[scene] || null;
};

// 添加获取文章详情的方法
const getArticleDetail = (scene, articleId) => {
    const sceneData = mockData[scene];
    if (!sceneData) return null;

    // 遍历所有section查找文章
    for (const section of sceneData.sections) {
        const article = section.articles.find(a => a.id === articleId);
        if (article) return article;
    }
    return null;
};

export default {
    getMockData,
    getArticleDetail
}; 