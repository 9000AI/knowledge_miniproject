// // index.js
// const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// Page({
//   data: {
//     sceneList: [
//       '视频号', '小红书', '抖音',
//       '直播', 'IP', '私域',
//       '知识付费', 'AI 技术', '出海跨境',
//       '大厂转型', '电商转型', '实体'
//     ],
//     motto: 'Hello World',
//     userInfo: {
//       avatarUrl: defaultAvatarUrl,
//       nickName: '',
//     },
//     hasUserInfo: false,
//     canIUseGetUserProfile: wx.canIUse('getUserProfile'),
//     canIUseNicknameComp: wx.canIUse('input.type.nickname'),
//     cardImages: ['one', 'two', 'three', 'four', 'five', 'six',
//       'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
//   },
//   bindViewTap() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onChooseAvatar(e) {
//     const { avatarUrl } = e.detail
//     const { nickName } = this.data.userInfo
//     this.setData({
//       "userInfo.avatarUrl": avatarUrl,
//       hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
//     })
//   },
//   onInputChange(e) {
//     const nickName = e.detail.value
//     const { avatarUrl } = this.data.userInfo
//     this.setData({
//       "userInfo.nickName": nickName,
//       hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
//     })
//   },
//   getUserProfile(e) {
//     // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
//     wx.getUserProfile({
//       desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
//       success: (res) => {
//         console.log(res)
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     })
//   },
//   navigateToSearchArticles() {
//     wx.navigateTo({
//       url: '../search/search' // 跳转到 all-article 页面
//     });
//   },
//   // 添加搜索框点击事件处理函数
//   onSearchTap() {
//     wx.navigateTo({
//       url: '/pages/search/search'
//     });
//   }
// })
// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    sceneList: [
      '视频号', '小红书', '抖音',
      '直播', 'IP', '私域',
      '知识付费', 'AI', '出海跨境',
      '大厂转型', '电商转型', '实体'
    ],
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
    topCardList: [
      {
        image: 'https://mini.9000aigc.com/assets/images/zl-one.png',
        title: '加入我们'
      },
      {
        image: 'https://mini.9000aigc.com/assets/images/zl_two.jpg',
        title: '李家旺专栏'
      },
      {
        image: 'https://mini.9000aigc.com/assets/images/zl-three.png',
        title: '闭环裂变'
      }
    ]
  },
  onLoad() {
    // 移除登录检查相关代码
  },
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
  navigateToSearchArticles() {
    wx.navigateTo({
      url: '../search/search' // 跳转到 all-article 页面
    });
  },
  onSearchTap() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  }


})
