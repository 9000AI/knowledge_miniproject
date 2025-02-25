// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
    properties: {
        sceneList: {
            type: Array,
            value: [
                { 
                    title: '视频号', 
                    desc: '带货新风口',
                    scene: 'videoAccount'  // 添加场景标识
                },
                { 
                    title: '小红书', 
                    desc: '社区新商机',
                    scene: 'xiaohongshu'
                },
                { 
                    title: '抖音', 
                    desc: '直播新赛道',
                    scene: 'douyin'
                },
                { 
                    title: '直播', 
                    desc: '互动新模式',
                    scene: 'live'
                },
                { 
                    title: 'IP', 
                    desc: '价值新高地',
                    scene: 'ip'
                },
                { 
                    title: '私域', 
                    desc: '运营新思路',
                    scene: 'private'
                },
                { 
                    title: '知识付费', 
                    desc: '变现新方向',
                    scene: 'knowledge'
                },
                { 
                    title: 'AI 技术', 
                    desc: '科技新未来',
                    scene: 'ai'
                },
                { 
                    title: '出海跨境', 
                    desc: '市场新机遇',
                    scene: 'overseas'
                },
                { 
                    title: '大厂转型', 
                    desc: '升级新方案',
                    scene: 'enterprise'
                },
                { 
                    title: '电商转型', 
                    desc: '营销新渠道',
                    scene: 'ecommerce'
                },
                { 
                    title: '实体', 
                    desc: '商业新玩法',
                    scene: 'physical'
                }
            ]
        }
    },
    data: {
        motto: 'Hello World',
        userInfo: {
            avatarUrl: defaultAvatarUrl,
            nickName: '',
        },
        hasUserInfo: false,
        canIUseGetUserProfile: wx.canIUse('getUserProfile'),
        canIUseNicknameComp: wx.canIUse('input.type.nickname'),
        cardImages: ['one', 'two', 'three', 'four', 'five', 'six',
            'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'],
        hotSceneTitle: '热门场景',
        verticalTitle: '垂直领域'
    },
    methods: {
        bindViewTap() {
            wx.navigateTo({
                url: '../logs/logs'
            })
        },
        onChooseAvatar(e) {
            const { avatarUrl } = e.detail
            const { nickName } = this.data.userInfo
            this.setData({
                "userInfo.avatarUrl": avatarUrl,
                hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
            })
        },
        onInputChange(e) {
            const nickName = e.detail.value
            const { avatarUrl } = this.data.userInfo
            this.setData({
                "userInfo.nickName": nickName,
                hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
            })
        },
        getUserProfile(e) {
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            wx.getUserProfile({
                desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    console.log(res)
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        },
        onTap(e) {
            const index = e.currentTarget.dataset.index
            this.triggerEvent('itemTap', { index })
        },
        handleCardClick(e) {
            const { scene, title } = e.currentTarget.dataset.item;
            
            // 跳转到对应的列表页
            wx.navigateTo({
                url: `/pages/scene/list/list?scene=${scene}`,
                fail: (err) => {
                    console.error('页面跳转失败：', err);
                    wx.showToast({
                        title: '页面跳转失败',
                        icon: 'none'
                    });
                }
            });
        }
    }
})
