// pages/mine/order/orderDetail.js
import { newPost } from '../../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const order = JSON.parse(options.order)
    const user = wx.getStorageSync('crmUser')
    if(order) {
      this.setData({
        order,
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

  onButtonClick(e) {
    const data = this.data.order
    newPost({
      url: 'dealer/order/confirmSettlement',
      data: {
        totalPrice: data.totalPrice,
        orderNo: data.orderNo,
        fee: data.fee,
        settlementAmount: data.settledMoney
      },
      success: function(data) {
        wx.redirectTo({
          url: './success',
        })
      }
    })
  }
})