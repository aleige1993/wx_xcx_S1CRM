// pages/modifyPrice/historyInfo/index.js

import {
  newPost
} from '../../../utils/http.js'
import { $stopWuxRefresher } from '../../../ui-plugins/wux/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList: [],
    currentId: 0,
    status: 1,
    page: {
      pageIndex: 1,
      pageSize: 10
    },
    hasMore: true    // 是否有更多数据, 下来加载更多时使用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id) {
      this.setData({
        currentId: options.id,
        status: options.type
      }, () => {
        this.getData()
      })
    } else {
      wx.navigateBack({
        delta: 1
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onRefresh() {
    this.setData({
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      showList: [],
      hasMore: true    // 是否有更多数据, 下来加载更多时使用
    }, () => {
      this.getData(() => {
        $stopWuxRefresher();
      })
    })
  },

  getData(succ) {
    const that = this
    newPost({
      url: 'dealer/goods/getPriceHistoryList',
      data: {
        id: that.data.currentId,
        status: that.data.status,
        ...that.data.page
      },
      success: function (data) {
        const obj = {}
        let arr = []
        if (that.data.page.pageIndex === 1) {
          arr = data.body
        } else {
          arr = that.data.showList.concat(data.body)
        }
        that.setData({
          showList: arr,
          hasMore: arr.length > 9 ? true : false
        })

        succ && succ()
      }
    })
  },

  /**
     * scroll-view 滚动到底触发
     */
  bindscrolltolower(e) {
    console.log(e)
    if (e.detail.direction === 'bottom' && this.data.hasMore) {
      // wx.showLoading({
      //   title: '加载下一页',
      //   mask: true
      // })
      const pageIndex = ++this.data.page.pageIndex
      this.setData({
        page: {
          pageIndex,
          pageSize: 10
        }
      }, () => {
        this.getData()
      })
    }
  }
})