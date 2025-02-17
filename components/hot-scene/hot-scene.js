// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

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
            'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
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
