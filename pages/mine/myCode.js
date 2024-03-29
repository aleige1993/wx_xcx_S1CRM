// pages/mine/my.js
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
import { qrcodeUrl } from '../../utils/http.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const that = this
    wx.getStorage({
      key: 'crmUser',
      success: function (res) {
        const user = res.data ? res.data : null
        that.setData({
          user
        }, () => {
          that.getCode();
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getCode() {
    const url = `${qrcodeUrl}register/index.html?employeeId=${this.data.user.salesmanId}&employeePhone=${this.data.user.phone}`
    var qrcode = new drawQrcode({
      canvasId: "canvas",
      text: url,
      width: 300,
      height: 300,
      colorDark: '#000000',
      colorLight: '#ffffff',
    });
  }
})