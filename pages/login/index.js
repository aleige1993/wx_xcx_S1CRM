// pages/login/index.js
import request, {
  newHttpUrl
} from '../../utils/http.js'
let MD5 = require("../../utils/md5.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: function(res) {
        console.log('getSystemInfo', res)
        console.log('env address', newHttpUrl)
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  setUsernameValue: function(e) {
    let username = e.detail.value;
    this.setData({
      username: username
    });
  },
  setPasswordValue: function(e) {
    let password = e.detail.value;
    this.setData({
      password: password
    });
  },
  login() {
    let data = this.data;
    if (data.username == "" || data.password == "") {
      wx.showToast({
        title: '请输入用户名或密码',
        icon: 'none'
      })
      return;
    }
    let password = MD5(this.data.password);
    let params = {
      "password": password,
      "userName": this.data.username
    };
    console.log(`login request`, params)
    request({
      data: params,
      url: 'user.login',
      success: (res) => {
        console.log(`login`, res)
        let header = res.header;
        wx.setStorage({
          key: 'crmToken',
          data: header.token
        });
        wx.setStorage({
          key: 'crmUser',
          data: res && res.body
        });
        wx.reLaunch({
          url: '/pages/today/index',
        })
      }
    })

  }
})