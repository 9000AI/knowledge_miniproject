Page({
    data: {
        title: '',
        time: '',
        author: '', // 添加作者字段
        content: ''  // 用于存储 Markdown 内容
    },

    onLoad: function (options) {
        const { id, title, time, author } = options;

        this.setData({
            title: decodeURIComponent(title),
            time: time,
            author: author || '9000AI', // 设置默认作者
        });

        // 加载文章内容
        this.loadArticle(id)
    },

    async loadArticle(id) {
        try {
            wx.showLoading({ title: '加载中...' })

            // Mock HTML 内容示例
            const content = `
                <div class="article-content">
                    
                    <p class="wemark-p">这是一篇示例文章的内容。</p>
                    
                    <h3 class="wemark-h3">主要内容</h3>
                    
                    <ul class="wemark-ul">
                        <li class="wemark-li">第一点：AI 助手如何提升工作效率</li>
                        <li class="wemark-li">第二点：如何利用 AI 进行内容创作</li>
                        <li class="wemark-li">第三点：AI 工具的实际应用场景</li>
                    </ul>

                    <p class="wemark-p">更多精彩内容，请访问 <a class="wemark-link" href="https://example.com">我们的网站</a></p>

                    <div class="wemark-image-wrapper">
                        <img 
                            class="wemark-img"
                            src="https://mini.9000aigc.com/assets/course/ip.png" 
                            alt="示例图片"
                            mode="widthFix"
                        />
                        <p class="wemark-image-caption">图片说明：AI 应用实例</p>
                    </div>

                    <blockquote class="wemark-blockquote">
                        <p class="wemark-p">重要提示：AI 只是工具，关键在于如何合理运用。</p>
                    </blockquote>
                </div>
            `;

            // 设置 content，现在传入的是 HTML 字符串
            this.setData({ content });

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

    // 处理链接点击
    handleLinkTap(e) {
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
    },

    // 处理返回按钮点击
    handleBack() {
        wx.navigateBack({
            delta: 1
        });
    }
})
