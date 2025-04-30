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
    isVip: false,      // 是否是会员
    errorType: '', // 错误类型：'no_access'表示无权访问，'need_vip'表示需要开通会员
    fromPrime: false, // 是否来自会员专区
    lockText: '报名后即可收看', // 锁定文本
    unlockBtnText: '立即报名', // 解锁按钮文本
    showQrcodeModal: false // 控制二维码模态框显示
  },

  // 检查登录状态
  checkLogin() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    if (!token || !userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录后观看视频',
        confirmText: '去登录',
        cancelText: '返回',
        success: (res) => {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/auth/auth'
            })
          } else {
            wx.navigateBack()
          }
        }
      })
      return false
    }
    return true
  },

  // 页面加载时获取参数
  onLoad(options) {
    // 先检查登录状态
    if (!this.checkLogin()) {
      return
    }

    if (options.id) {
      // 获取用户信息和会员状态
      const userInfo = wx.getStorageSync('userInfo')
      const isVip = userInfo?.isVip || false
      
      // 是否来自会员专区
      const fromPrime = options.fromPrime === 'true'
      
      // 根据来源设置不同文本
      const lockText = fromPrime ? '联系客服报名' : '联系客服报名'
      const unlockBtnText = fromPrime ? '立即报名' : '立即报名'
      
      this.setData({
        lessonId: options.id,
        lessonTitle: options.title ? decodeURIComponent(options.title) : '课时播放',
        isVideo: true,
        coverImage: options.coverImage || '',
        teacherInfo: options.teacher ? decodeURIComponent(options.teacher) : '未知',
        courseId: options.courseId || '',
        isVip: isVip,
        fromPrime: fromPrime,
        lockText: lockText,
        unlockBtnText: unlockBtnText
      })
      
      // 获取章节列表
      if (options.courseId) {
        this.loadChapters(options.courseId)
      }

      // 加载当前课时信息
      this.loadLesson(options.id)
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
    // 再次检查登录状态
    if (!this.checkLogin()) {
      return
    }
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
      url: 'https://know-admin.9000aigc.com/knowledge/lesson/scroll',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
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
          
          this.setData({
            chapterList: list || []
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
    // 检查登录状态
    if (!this.checkLogin()) {
      return
    }

    const id = e.currentTarget.dataset.id
    const title = e.currentTarget.dataset.title
    const url = e.currentTarget.dataset.url
    
    // 如果点击的是当前正在播放的章节，不做任何操作
    if (id === this.data.lessonId) return
    
    // 直接播放视频
    this.setData({
      lessonId: id,
      lessonTitle: title,
      videoUrl: url,
      isVideo: true,
      loading: true
    })

    // 更新当前课时信息
    const currentLesson = this.data.chapterList.find(item => item.id === id)
    if (currentLesson) {
      this.setData({
        currentLesson: currentLesson
      })
    }
  },

  // 切换倍速列表显示状态
  toggleRateList() {
    this.setData({
      showRateList: !this.data.showRateList
    })
  },

  // 切换播放倍速
  changePlaybackRate(e) {
    const rate = e.currentTarget.dataset.rate
    this.setData({
      currentRate: rate,
      showRateList: false
    })
  },

  // 加载课时列表
  async loadChapterList() {
    if(!this.data.hasMore || this.data.loading) return;
    
    this.setData({ loading: true });

    try {
      const promise = new Promise((resolve, reject) => {
        wx.request({
          url: 'https://know-admin.9000aigc.com/knowledge/lesson/scroll',
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            courseId: this.data.courseId,
            lastId: this.data.nextId,
            size: 20
          },
          success: resolve,
          fail: reject
        });
      });

      const res = await promise;

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
        const promise = new Promise((resolve, reject) => {
          wx.request({
            url: `https://know-admin.9000aigc.com/knowledge/lesson/${lessonId}`,
            method: 'GET',
            header: {
              'Content-Type': 'application/json'
            },
            data: {
            },
            success: resolve,
            fail: reject
          });
        });

        const res = await promise;
        
        if(res.data.code === 200) {
          lesson = res.data.data;
        } else if(res.data.code === 500 && res.data.message === '无权访问该课时') {
          this.setData({ 
            errorType: 'no_access',
            loading: false
          });
          return;
        } else {
          this.setData({ 
            errorType: 'need_vip',
            loading: false
          });
          return;
        }
      }
      
      if(lesson) {
        console.log('当前课时信息:', lesson);  // 添加日志
        // 直接使用后端返回的视频地址
        this.setData({ 
          currentLesson: lesson,
          videoUrl: lesson.videoUrl || '',
          errorType: lesson.videoUrl ? '' : 'need_vip'
        });
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
    // 显示客服二维码
    this.setData({
      showQrcodeModal: true
    });
  },

  // 跳转到课程购买页
  goBuyCourse() {
    // 显示客服二维码
    this.setData({
      showQrcodeModal: true
    });
  },
  
  // 关闭二维码模态框
  closeQrcodeModal() {
    this.setData({
      showQrcodeModal: false
    });
  },
  
  // 阻止事件冒泡
  stopPropagation() {
    // 仅用于阻止事件冒泡
    return;
  }
}) 