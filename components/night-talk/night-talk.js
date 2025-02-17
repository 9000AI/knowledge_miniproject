Component({
    options: {
        styleIsolation: 'isolated'
    },
    /**
     * 组件的属性列表
     */
    properties: {
        limit: {
            type: Number,
            value: -1  // 默认值为-1表示显示全部
        }
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
                image: "https://mini.9000aigc.com/assets/course/black.jpg"
            },
            {
                title: "私域流量增长方法论",
                time: "2024-03-19",
                tags: ["全域", "直播"],
                image: "https://mini.9000aigc.com/assets/course/black.jpg"
            },
            {
                title: "IP打造实战案例",
                time: "2024-03-18",
                tags: ["资料下载", "直播"],
                image: "https://mini.9000aigc.com/assets/course/black.jpg"
            },
            {
                title: "短视频运营技巧分享",
                time: "2024-03-20",
                tags: ["资料下载", "全域", "直播"],
                image: "https://mini.9000aigc.com/assets/course/black.jpg"
            },
            {
                title: "私域流量增长方法论",
                time: "2024-03-19",
                tags: ["全域", "直播"],
                image: "https://mini.9000aigc.com/assets/course/black.jpg"
            },
        ],
        displayList: [],
        showAll: false
    },

    lifetimes: {
        attached() {
            // 组件生命周期函数
            this.setData({
                displayList: this.data.updateList
            });
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onItemTap(e) {
            const index = e.currentTarget.dataset.index;
            const item = this.data.updateList[index];

            // 跳转到文章详情页时添加作者参数
            wx.navigateTo({
                url: `/pages/update-item/update-item?id=${index}&title=${encodeURIComponent(item.title)}&time=${item.time}&author=${encodeURIComponent(item.author || '9000AI')}&tags=${encodeURIComponent(JSON.stringify(item.tags))}`
            });
        },
        getDisplayList() {
            // 根据 showAll 状态决定是否显示全部
            if (!this.data.showAll && this.properties.limit > 0) {
                return this.data.updateList.slice(0, this.properties.limit);
            }
            return this.data.updateList;
        },
        onMoreTap() {
            // 修改为跳转到列表页
            wx.navigateTo({
                url: '/pages/night-list/night-list'
            });
        }
    }
})
