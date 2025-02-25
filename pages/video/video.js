Page({
  data: {
    lessonId: '', // 课时ID
    lessonTitle: '', // 课时标题
    videoUrl: '', // 视频URL
    isPlaying: false, // 是否正在播放
    currentTime: 0, // 当前播放时间
    duration: 0, // 视频总时长
    durationText: '', // 格式化后的时长文本
    loading: true, // 加载状态
    isVideo: false, // 是否是视频链接
    coverImage: '', // 封面图片URL
    teacherInfo: '未知', // 讲师信息
    courseId: '', // 课程ID
    chapterList: [], // 章节列表
    playbackRates: [0.5, 1.0, 1.25, 1.5, 2.0], // 可选的播放倍速
    currentRate: 1.0, // 当前播放倍速
    showRateList: false, // 控制倍速列表的显示
    currentLesson: {}, // 当前播放的课时信息
    hasMore: true,     // 是否还有更多数据
    nextId: '',        // 下一页的ID
  },

  // 页面加载时获取参数
  onLoad(options) {
    if (options.id) {
      // 判断是否是视频链接
      const defaultVideoUrl = 'https://mini.9000aigc.com/assets/video/mini_video_compressed.mp4';
      const isVideo = true; // 因为我们知道是视频，所以直接设置为 true
      
      this.setData({
        lessonId: options.id,
        lessonTitle: options.title ? decodeURIComponent(options.title) : '课时播放',
        videoUrl: defaultVideoUrl,
        isVideo: isVideo,
        coverImage: options.coverImage || '',
        teacherInfo: options.teacher ? decodeURIComponent(options.teacher) : '未知',
        courseId: options.courseId || ''
      })
      
      // 获取章节列表
      if (options.courseId) {
        this.loadChapters(options.courseId)
      }
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },
  
  // 返回上一页
  navigateBack() {
    wx.navigateBack()
  },
  
  // 视频加载完成
  onVideoLoad() {
    console.log('视频加载完成')  // 添加日志，查看是否触发
    this.setData({
      loading: false
    })
  },
  
  // 视频播放状态变化
  onVideoPlay() {
    this.setData({
      isPlaying: true
    })
  },
  
  // 视频暂停状态变化
  onVideoPause() {
    this.setData({
      isPlaying: false
    })
  },
  
  // 视频播放进度变化
  onTimeUpdate(e) {
    this.setData({
      currentTime: e.detail.currentTime
    })
  },
  
  // 视频加载元数据完成
  onVideoMeta(e) {
    console.log('视频元数据加载完成', e.detail)  // 添加日志
    const duration = e.detail.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const durationText = `${minutes}分${seconds}秒`;
    
    this.setData({
      duration: duration,
      durationText: durationText,
      loading: false  // 在这里也设置 loading 为 false
    })
  },
  
  // 视频播放结束
  onVideoEnd() {
    this.setData({
      isPlaying: false
    })
    
    // 可以在这里添加播放完成后的逻辑，比如推荐下一个课时
  },
  
  // 视频播放出错
  onVideoError(e) {
    console.error('视频加载失败:', e)  // 添加详细错误日志
    this.setData({
      loading: false  // 出错时也需要关闭 loading
    })
    wx.showToast({
      title: '视频加载失败',
      icon: 'error'
    })
  },
  
  // 加载章节列表
  loadChapters(courseId) {
    wx.request({
      url: 'http://192.168.1.93:8100/knowledge/lesson/scroll',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      data: {
        size: 20,
        courseId: courseId,
        lastId: '0'
      },
      success: (res) => {
        console.log('章节列表请求成功:', res.data)
        if (res.data.code === 200) {
          const { list } = res.data.data
          
          // 给每个章节添加测试视频URL
          const processedList = list.map(item => ({
            ...item,
            videoUrl: 'https://mini.9000aigc.com/assets/video/mini_video_compressed.mp4'
          }))
          
          this.setData({
            chapterList: processedList || []
          })
        }
      },
      fail: (err) => {
        console.error('加载章节列表失败:', err)
      }
    })
  },
  
  // 播放章节
  playChapter(e) {
    const id = e.currentTarget.dataset.id
    const title = e.currentTarget.dataset.title
    const url = e.currentTarget.dataset.url
    
    // 如果点击的是当前正在播放的章节，不做任何操作
    if (id === this.data.lessonId) return
    
    this.setData({
      lessonId: id,
      lessonTitle: title,
      videoUrl: url,
      isVideo: true,  // 因为我们确定是视频，直接设置为 true
      loading: true
    })
  },

  // 切换倍速列表显示状态
  toggleRateList() {
    this.setData({
      showRateList: !this.data.showRateList
    })
  },

  // 选择播放倍速
  changePlaybackRate(e) {
    const rate = parseFloat(e.currentTarget.dataset.rate)
    this.setData({
      currentRate: rate,
      showRateList: false
    })
    
    // 获取视频实例并设置播放速度
    const videoContext = wx.createVideoContext('lessonVideo')
    videoContext.playbackRate(rate)
  },

  // 加载课时列表
  async loadChapterList() {
    if(!this.data.hasMore || this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const res = await wx.cloud.callContainer({
        path: '/knowledge/lesson/scroll',
        method: 'POST',
        data: {
          courseId: this.data.courseId,
          lastId: this.data.nextId,
          size: 20
        }
      });

      if(res.data.code === 200) {
        const { list, hasMore, nextId } = res.data.data;
        
        this.setData({
          chapterList: [...this.data.chapterList, ...list],
          hasMore,
          nextId,
          // 如果是第一次加载且没有指定播放的课时,默认播放第一个
          currentLesson: !this.data.currentLesson.id && list.length > 0 ? list[0] : this.data.currentLesson
        });
      }
    } catch(err) {
      console.error('加载课时列表失败:', err);
      wx.showToast({
        title: '加载失败,请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 加载指定课时
  async loadLesson(lessonId) {
    try {
      // 先查找本地列表
      let lesson = this.data.chapterList.find(item => item.id === lessonId);
      
      if(!lesson) {
        // 如果本地没有,从服务器获取
        const res = await wx.cloud.callContainer({
          path: `/knowledge/lesson/${lessonId}`,
          method: 'GET'
        });
        
        if(res.data.code === 200) {
          lesson = res.data.data;
        }
      }
      
      if(lesson) {
        this.setData({ currentLesson: lesson });
      }
    } catch(err) {
      console.error('加载课时失败:', err);
      wx.showToast({
        title: '加载失败,请重试',
        icon: 'none'
      });
    }
  },

  // 跳转到会员购买页
  goToVip() {
    wx.navigateTo({
      url: '/pages/vip/vip'
    });
  }
}) 