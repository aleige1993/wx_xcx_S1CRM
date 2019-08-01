// pages/trade/money/index.js
import { oldPost } from '../../../utils/http.js'
import { $stopWuxRefresher } from '../../../ui-plugins/wux/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyList: [

    ],
    currentType: -1,   // 接收页面传递的type
    money: 0,         //接收页面传递的金额, 接口本身没有此数据
    page: {
      pageSize: 20,
      pageIndex: 0
    },
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {curType, money} = options
    if(curType && curType > 0) {
      this.setData({
        currentType: curType,
        money: money
      }, () => {
        this.getData()
      })
    } else {
      wx.redirectTo({
        url: '../index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 异步加载应收账款列表
   */
  getData(succ) {
    const that = this
    // 异步请求
    oldPost({
      url: '/mybusiness.queryLoansReceivable',
      data: {
        type: that.data.currentType,
      },
      page: that.data.page,
      success: function(data) {
        let arr = []
        if (that.data.page.pageIndex === 0) {
          arr = data.body
        } else {
          arr = that.data.moneyList.concat(data.body)
        }
        that.setData({
          moneyList: arr,
          hasMore: data.body.length == that.data.page.pageSize ? true : false
        })

        succ && succ()
      }
    })
  },

  /**
   * 下拉完成
   */
  onRefresh() {
    console.log('onRefresh')
    // 下拉刷新设置pageIndex为1
    this.setData({
      page: {
        pageIndex: 0,
        pageSize: 20
      }
    }, () => {
      this.getData(() => {
        $stopWuxRefresher()
      })
    })
  },

  /**
     * scroll-view 滚动到底触发
     */
  bindscrolltolower(e) {
    if (e.detail.direction === 'bottom' && this.data.hasMore) {
      // wx.showLoading({
      //   title: '加载下一页',
      //   mask: true
      // })
      const pageIndex = ++this.data.page.pageIndex
      this.setData({
        page: {
          pageIndex,
          pageSize: 20
        }
      }, () => {
        this.getData()
      })
    }
  }
})