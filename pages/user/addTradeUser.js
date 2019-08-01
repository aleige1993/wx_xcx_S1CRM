// pages/user/addTradeUser.js
import request from '../../utils/http.js';
import { $stopWuxRefresher } from '../../ui-plugins/wux/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    pageSize: 10,
    userData: [],
    pageData: {},
    type: 1,
    searchParams:{
      newTrade:1,
      isTrade:1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderPrams = JSON.parse(options.orderParams);
    this.setData({
      type: orderPrams.type
    })
    this.getData(orderPrams);
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
    let data = this.data;
    let params = {
      ...data.searchParams, 
      ...orderParams,
    }
    this.setParams(params);
    request(
      {
        url: "user.userListNew",
        data: params,
        page: {
          "pageIndex": data.pageIndex,
          "pageSize": data.pageSize
        },
        success: (res) => {
          let body = res && res.body || [];
          let userData = [];
          if (data.pageIndex == 0) {
            userData = body;
          } else {
            userData = this.data.userData.concat(body);
          }

          this.setData({ userData: body });
          this.setData({ pageData: res.page || {} });
          callback && callback();
        }
      }
    )
    
  },
  setParams(params) {
    this.setData({ searchParams: params });
  },


  onRefresh() {
    this.setData({ pageIndex: 0 });
    this.getData({}, function () {
      $stopWuxRefresher();
    });
  },
  bindscrolltolower() {
    let data = this.data;
    let pageIndex = data.pageIndex;
    let pageCount = data.pageData.pageCount;
    if (pageIndex < pageCount) {
      pageIndex++;
      this.setData({ pageIndex: pageIndex });
      this.getData();
    }
  },

  showDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../order/userOrderDetail?item=' + JSON.stringify(item),
    })
  }

})
