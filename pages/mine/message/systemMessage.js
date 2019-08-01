// pages/mine/message/systemMessage.js
import request from "../../../utils/http.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    pageSize: 10,
    messageData : null,
    pageData : null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessageData();
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
  onRefresh(e) {
    const instance = e.detail.instance
    this.setData({ pageIndex: 1, orderList: [] });
    this.getMessageData({
      callback: () => {
        instance.finishPullToRefresh();
      }
    });
  },
  onLoadMore(e) {
    const instance = e.detail.instance
    let data = this.data;
    let pageIndex = data.pageIndex;
    let pageCount = data.pageData.pageCount;
    if (pageIndex < pageCount) {
      pageIndex++;
      this.setData({ pageIndex: pageIndex });
      this.getMessageData({
        callback: () => {
          instance.finishLoadmore();
        }
      });
    } else {
      instance.finishLoadmore();
    }
  },
  getMessageData(paramsData = {}){
    var self = this;

    //消息类型, 0:订单消息 1:系统消息
    let params = { "type": 1 };
    request({
      url: "msg.queryMessageNew",
      data: params,
      page: {
        "pageIndex": this.data.pageIndex,
        "pageSize": this.data.pageSize,
      },
      success: (res) => {
        var arr = []
        if (this.data.pageIndex === 0) {
          arr = res && res.body || {}
        } else {
          arr = this.data.messageData.concat(res.body)
        }
        this.setData({
          messageData: arr
        });
        this.setData({
          pageData: res.page || {}
        });
        paramsData.callback && paramsData.callback()
      },
      complete: (res) => {
        // const instance = e.detail.instance
        // instance.finishLoadmore();
      },
    });
  },
})