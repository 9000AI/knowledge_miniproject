Component({
    options: {
        styleIsolation: 'isolated'
    },
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        updateList: [
            {
                title: "短视频运营技巧分享",
                time: "2024-03-20",
                tags: ["资料下载", "全域", "直播"],
                image: "https://mini.9000aigc.com/assets/course/green.jpg"
            },
            {
                title: "私域流量增长方法论",
                time: "2024-03-19",
                tags: ["资料下载", "全域", "直播"],
                image: "https://mini.9000aigc.com/assets/course/green.jpg"
            },
            {
                title: "IP打造实战案例",
                time: "2024-03-18",
                tags: ["资料下载", "全域", "直播"],
                image: "https://mini.9000aigc.com/assets/course/green.jpg"
            },
            {
                title: "短视频运营技巧分享",
                time: "2024-03-20",
                tags: ["资料下载", "全域", "直播"],
                image: "https://mini.9000aigc.com/assets/course/green.jpg"
            },
            {
                title: "私域流量增长方法论",
                time: "2024-03-19",
                tags: ["资料下载", "全域", "直播"],
                image: "https://mini.9000aigc.com/assets/course/green.jpg"
            },
        ]
    },

    lifetimes: {
        attached() {
            // 组件生命周期函数
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onItemTap(e) {
            const index = e.currentTarget.dataset.index;
            // 处理点击事件
            wx.showToast({
                title: '查看详情' + (index + 1),
                icon: 'none'
            });
        }
    }
})
