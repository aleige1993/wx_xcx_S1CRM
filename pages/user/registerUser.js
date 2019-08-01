// pages/user/addTradeUser.js
import request from '../../utils/http.js';
import { $stopWuxRefresher } from '../../ui-plugins/wux/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: {
      pageIndex: 0,
      pageSize: 20,
    },
    userData: [],
    pageData: {},
    searchParams: {},
    registerUserNewCount: 0,
    registerUserCount: 0,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let orderPrams = JSON.parse(options.orderParams);
    const extra = JSON.parse(options.extra)
    if(extra) {
      this.setData({
        registerUserNewCount: extra.registerUserNewCount,
        registerUserCount: extra.registerUserCount
      }, () => {
        this.getData(orderPrams)
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
  getData(orderParams = {},callback) {
    //获取数据
    const that = this
    let data = this.data;
    let params = Object.assign({}, data.searchParams, orderParams);
    this.setParams(params);
    request(
      {
        url: "data.queryRegisterInfo",
        data: params,
        page: {
          ...data.page
        },
        success: (res) => {
          let arr = []
          if (that.data.page.pageIndex === 0) {
            arr = res.body
          } else {
            arr = that.data.userData.concat(res.body)
          }
          that.setData({
            userData: arr,
            hasMore: res.body.length == that.data.page.pageSize ? true : false
          })
        },
        complete: () => {
          callback && callback();
        }
      }
    )

  },
  setParams(params) {
    this.setData({ searchParams: params });
  },


  onRefresh(e) {
    const instance = e.detail.instance
    this.setData({
      pageIndex: 0
    });
    this.getData({}, () => {
      // $stopWuxRefresher('#refresher');
      instance.finishPullToRefresh()
    });
  },
  loadMore(e) {
    const instance = e.detail.instance
    if (this.data.hasMore) {
      const pageIndex = ++this.data.page.pageIndex
      const pageSize = this.data.page.pageSize
      this.setData({
        page: {
          pageIndex,
          pageSize
        }
      }, () => {
        this.getData({}, () => {
          instance.finishLoadmore()
        })
      })
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
      })
      instance.finishLoadmore()
    }
  },
  // bindscrolltolower() {
  //   let data = this.data;
  //   let pageIndex = data.pageIndex;
  //   let pageCount = data.pageData.pageCount;
  //   if (pageIndex < pageCount) {
  //     pageIndex++;
  //     this.setData({ pageIndex: pageIndex });
  //     this.getData();
  //   }
  // }
})
