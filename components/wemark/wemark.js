Component({
    properties: {
        html: {
            type: String,
            value: '',
            observer() {
                this.parseHtml();
            }
        }
    },
    data: {
        nodes: []
    },
    methods: {
        parseHtml() {
            if (this.data.html) {
                // 使用小程序的 rich-text 组件支持的节点格式
                this.setData({
                    nodes: this.data.html
                });
            }
        },

        // 处理链接点击
        onLinkTap(e) {
            const url = e.currentTarget.dataset.url;
            if (url.startsWith('http')) {
                wx.setClipboardData({
                    data: url,
                    success: () => {
                        wx.showToast({
                            title: '链接已复制',
                            icon: 'success'
                        });
                    }
                });
            }
        }
    }
}); 