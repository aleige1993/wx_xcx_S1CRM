// components/refresh-scroll-view/index.js
import computedBehavior from '../behaviors/computedBehavior.js'
import classNames from '../../utils/classNames.js'

const defaultStyle = 'transition: transform .4s; transform: translate3d(0px, 0px, 0px) scale(1);'
Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    prefixCls: {
      type: String,
      value: 'wux-refresher',
    },
    pullingIcon: {
      type: String,
      value: '',
    },
    pullingText: {
      type: String,
      value: '下拉刷新',
    },
    refreshingIcon: {
      type: String,
      value: '',
    },
    refreshingText: {
      type: String,
      value: '正在刷新',
    },
    disablePullingRotation: {
      type: Boolean,
      value: false,
    },
    distance: {
      type: Number,
      value: 30,
    },
    prefixLCls: {
      type: String,
      value: 'wux-loader'
    },
    isShowLoadingText: {
      type: Boolean,
      value: true
    },
    loadingText: {
      type: String,
      value: '正在加载更多'
    },
    loadNoDataText: {
      type: String,
      value: '没有更多数据'
    },
    noData: {
      type: Boolean,
      value: true
    },
    scrollViewOffset: {
      type: Number,
      value: 0,
      observer: function(h) {
        // const query = this.createSelectorQuery();
        // query.select(`#zref`).boundingClientRect(function (res) {
        //   console.log(res)
          
        // }).exec()
        console.log('scrollViewOffset observer')
        if(h > 0) {
          this.setData({
            sheight: h
          })
        }
        // const that = this
        // wx.getSystemInfo({
        //   success: function(res) {
        //     console.log(res, h)
        //     that.setData({
        //       sheight: res.windowHeight - h
        //     })
        //   },
        // })
      }
    },
    scrollTop: {
      type: Number,
      value: 0,
      observer: function (n) {
        let that = this

        // 获取节点高度
        const query = wx.createSelectorQuery();
        query.select(`#${this.id}`).boundingClientRect(function (res) {
          that.setData({
            newContentHeight: res.height
          })
        }).exec()

        const {
          newContentHeight,
          oldContentHeight,
          windowHeight,
          distance,
          loading,
          noData
        } = this.data

        if (windowHeight && !this.isRefreshing()) {

          // 到临界点时触发上拉加载 
          // 防止节点高度一致时引发重复加载
          if (
            n > newContentHeight - windowHeight - (distance * 1.5) &&
            loading === false &&
            noData === false && newContentHeight !== oldContentHeight
          ) {

            this.setData({
              loading: true,
              refreshing: false,
              oldContentHeight: newContentHeight
            })

            this.triggerEvent('loadmore')

          } else if (
            loading === false &&
            noData === false
          ) {

            // 隐藏上拉加载动画
            this.hide()

          } else if (loading === true) {

            // 如果在加载中，保持内容的高度一致，以此来防止临界点重复加载
            this.setData({
              oldContentHeight: newContentHeight
            })

          }

          this.deactivate()
        }
      }
    },
  },

  // observers: {
  //   'scrollViewOffset': function (numberA, numberB) {
  //     console.log(numberA, numberB)
  //   }
  // },

  computed: {
    classes() {
      const {
        prefixCls,
        pullingText,
        pullingIcon,
        disablePullingRotation,
        refreshingText,
        refreshingIcon,
        visible,
        active,
        refreshing,
        lVisible,
        tail,
        prefixLCls,
        loading,
        noData,
      } = this.data
      const wrap = classNames(prefixCls, {
        [`${prefixCls}--hidden`]: !visible,
        [`${prefixCls}--visible`]: visible,
        [`${prefixCls}--active`]: active,
        [`${prefixCls}--refreshing`]: refreshing,
        [`${prefixCls}--refreshing-tail`]: tail,
      })
      const content = classNames(`${prefixCls}__content`, {
        [`${prefixCls}__content--text`]: pullingText || refreshingText,
      })
      const iconPulling = classNames(`${prefixCls}__icon-pulling`, {
        [`${prefixCls}__icon-pulling--disabled`]: disablePullingRotation,
      })
      const textPulling = `${prefixCls}__text-pulling`
      const iconRefreshing = `${prefixCls}__icon-refreshing`
      const textRefreshing = `${prefixCls}__text-refreshing`
      const pIcon = pullingIcon || `${prefixCls}__icon--arrow-down`
      const rIcon = refreshingIcon || `${prefixCls}__icon--refresher`

      const lWrap = classNames(prefixLCls, {
        [`${prefixLCls}--hidden`]: !loading,
        [`${prefixLCls}--visible`]: loading,
        [`${prefixLCls}--end`]: noData,
      })
      const lContent = `${prefixLCls}__content`

      return {
        wrap,
        content,
        iconPulling,
        textPulling,
        iconRefreshing,
        textRefreshing,
        pIcon,
        rIcon,
        lWrap,
        lContent,
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    style: defaultStyle,
    visible: false,
    active: false,
    refreshing: false,
    tail: false,
    lVisible: false,
    noData: false, // 是否没有更多数据
    windowHeight: 0,  // 窗口高度
    newContentHeight: 0,  // 新节点内容高度
    oldContentHeight: 0,   // 旧节点内容高度
    loading: false,   // 判断是否正在加载
    sheight: 0      // scroll-view 的高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
         * 显示
         */
    activate() {
      this.setData({
        style: defaultStyle,
        visible: true,
        loading: true
      })
    },
    /**
     * 隐藏
     */
    deactivate() {
      if (this.activated) this.activated = false

      this.setData({
        style: defaultStyle,
        loading: false,
        visible: false,
        active: false,
        refreshing: false,
        tail: false,
      })
    },
    /**
     * 正在刷新
     */
    refreshing() {
      this.setData({
        style: 'transition: transform .4s; transform: translate3d(0, 50px, 0) scale(1);',
        visible: true,
        active: true,
        refreshing: true,

        // 刷新时重新初始化加载状态
        loading: false,
        noData: false,
        newContentHeight: 0,
        oldContentHeight: 0,
        lVisible: false,
      })
    },
    loadmore() {
      this.setData({
        style: 'transition: transform .4s; transform: translate3d(0, -30px, 0) scale(1);',
        lVisible: true,
        active: true,
        refreshing: true,
        loading: true,

        // 刷新时重新初始化加载状态
        // loading: false,
        noData: false,
        newContentHeight: 0,
        oldContentHeight: 0,
        visible: false,
      })
    },
    /**
     * 刷新后隐藏动画
     */
    tail() {
      this.setData({
        visible: true,
        active: true,
        refreshing: true,
        tail: true,
      })
    },
    /**
     * 加载后隐藏动画
     */
    hide() {
      this.setData({
        lVisible: false,
      })
    },
    /**
     * 正在下拉
     * @param {Number} diffY 距离
     */
    move(diffY) {
      // console.log(diffY)
      const style = `transition-duration: 0s; transform: translate3d(0, ${diffY}px, 0) scale(1);`
      // const className = diffY < this.data.distance ? 'visible' : 'active'
      let className = ''
      if( diffY < 0) {
        this.setData({
          style,
          // loading: true
        })
      } else {
        className = diffY < this.data.distance ? 'visible' : 'active'
        this.setData({
          style,
          [className]: true,
        })
      }
      
    },
    /**
     * 判断是否正在刷新
     */
    isRefreshing() {
      return this.data.refreshing
    },
    /**
     * 判断是否正在加载
     */
    isLoading() {
      return this.data.loading
    },
    /**
     * 获取触摸点坐标
     */
    getTouchPosition(e) {
      if (!e.changedTouches[0]) {
        return {
          x: 0,
          y: 0
        }
      }
      return {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
      }
    },
    /**
     * 创建定时器
     */
    requestAnimationFrame(callback) {
      let currTime = new Date().getTime()
      let timeToCall = Math.max(0, 16 - (currTime - this.lastTime))
      let timeout = setTimeout(() => {
        callback.bind(this)(currTime + timeToCall)
      }, timeToCall)
      this.lastTime = currTime + timeToCall
      return timeout
    },
    /**
     * 清空定时器
     */
    cancelAnimationFrame(timeout) {
      clearTimeout(timeout)
    },
    /**
     * 下拉刷新完成后的函数
     */
    finishPullToRefresh() {
      setTimeout(() => {
        this.requestAnimationFrame(this.tail)
        setTimeout(() => this.deactivate(), 200)
      }, 200)
    },
    /**
     * 上拉加载完成后的函数
     */
    finishLoadmore(bool) {
      if (bool === true) {
        setTimeout(() => {
          this.setData({
            noData: true,
            loading: false,
          })
        }, 200)
      } else {
        setTimeout(() => {
          this.setData({
            loading: false
          })
          this.requestAnimationFrame(this.hide)
          setTimeout(() => this.deactivate(), 200)
        }, 200)
      }
    },
    /**
     * 手指触摸动作开始
     */
    bindtouchstart(e) {
      if (this.isRefreshing() || this.isLoading()) return false

      const p = this.getTouchPosition(e)

      this.start = p
      this.diffX = this.diffY = 0

      // this.activate()
    },
    /**
     * 手指触摸后移动
     */
    bindtouchmove(e) {
      if (!this.start || this.isRefreshing() || this.isLoading()) return false

      const p = this.getTouchPosition(e)

      this.diffX = p.x - this.start.x
      this.diffY = p.y - this.start.y

      // if (this.diffY < 0) return false

      this.diffY = this.diffY > 0 ? Math.pow(this.diffY, 0.8) : -Math.pow(Math.abs(this.diffY), 0.8)
      if (!this.activated) {
        this.activated = true
        if (this.diffY > this.data.distance) {
          this.triggerEvent('pulling')
        } else if(Math.abs(this.diffY) > this.data.distance){
          // this.setData({
          //   loading: true
          // })
        }
        
      } else if (this.activated && this.diffY < this.data.distance) {
        this.activated = false
      }

      this.move(this.diffY)
    },
    /**
     * 	手指触摸动作结束
     */
    bindtouchend(e) {
      this.start = false
      if (this.isRefreshing()) return false

      this.deactivate()

      if (this.diffY > this.data.distance) {
        this.refreshing()
        this.triggerEvent('refresh', {instance: this})
        // this.finishPullToRefresh()
      } else if (this.diffY < 0 && Math.abs(this.diffY) > this.data.distance) {
        this.setData({
          loading: true
        }, () => {
          this.loadmore()
          this.triggerEvent('loadMore', { instance: this })
          // this.finishLoadmore()
        })
      }
    },

    /**
     * scroll-view 滚动到底触发
     */
    scrolltolower(e) {
      this.triggerEvent('scrolltolower')
      // if (e.detail.direction === 'bottom' && this.data.hasMore) {
      //   // wx.showLoading({
      //   //   title: '加载下一页',
      //   //   mask: true
      //   // })
      //   const pageIndex = ++this.data.page.pageIndex
      //   this.setData({
      //     page: {
      //       pageIndex,
      //       pageSize: 20
      //     }
      //   }, () => {
      //     this.getData()
      //   })
      // }
    }
  },

  created() {
    this.lastTime = 0
    this.activated = false
  },
  attached() {
    
  },
  ready() {
    let that = this
    // const page = getCurrentPages()
    // console.log(page)
    console.log('component ready')
    if(this.data.sheight == 0) {
      wx.getSystemInfo({
        success: function (res) {
          const windowHeight = res.windowHeight   // 除去微信头部的可显示区域高度
          const query = that.createSelectorQuery()
          query.select('#refresher-cus').boundingClientRect((rect) => {
            that.setData({
              windowHeight,
              sheight: windowHeight - rect.top
            })
          }).exec()
        }
      });
    }
    
  }
})
