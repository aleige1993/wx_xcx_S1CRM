// pages/mine/message/notificationCenter.js
import request from "../../../utils/http.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderMsg: null,
    systemMsg: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNewMessageData();
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
  //获取最新消息数据
  getNewMessageData(paramsData = {}) {
    var self = this;
    //消息类型, 0:订单消息 1:系统消息
    let params = { "token": wx.getStorageSync('crmToken') };
    request({
      url: "msg.queryMessageOutline",
      data: params,
      success: (res) => {
        console.log(res);
        const data = res.body
        const obj = {}
        for(let item in data) {
          if(data[item].type == 0) {
            this.setData({
              orderMsg: data[item]
            })
          } else if(data[item].type == 1) {
            this.setData({
              systemMsg: data[item]
            })
          }
        }
      }
    });
  },
  goOrderMessagePage : function(){
    wx.navigateTo({
      url: './orderMessage',
    })
  },
  goSystemMessagePage: function () {
    wx.navigateTo({
      url: './systemMessage',
    })
  },
})