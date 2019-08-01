// pages/mine/safetySettings.js
//安全设置
import request from '../../../utils/http.js'
let MD5 = require("../../../utils/md5.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword:"",
    newPassword:"",
    confirmPassword:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  setOldPasswordValue : function (e){
    let oldPsdStr = e.detail.value;
    this.setData({
      oldPassword: oldPsdStr
    });
  },
  setNewPasswordValue : function (e){
    let newPsdStr = e.detail.value;
    this.setData({
      newPassword :newPsdStr
    });
  },
  setConfirmPassword : function (e){
    let confirmPsdStr = e.detail.value;
    this.setData({
      confirmPassword : confirmPsdStr
    });
  },

  savePassword : function () {
    if (this.checkPassword() == true){
      var oldPsd = MD5(this.data.oldPassword);
      var newPsd = MD5(this.data.newPassword);

      var params = { "old": oldPsd, "newPwd": newPsd};

      wx.showLoading({
        title: "保存中",
      })
      request({
        url: 'center.updatePassword',
        data: params,
        success: function(body,header) {
          wx.hideLoading()
          wx.showToast({
            title: '修改密码成功！',
            icon: 'success',
            duration: 3000,
            mask: true,
            success: function() {
              wx.navigateBack({
                delta: -1
              });
            }
          })
        }
      })
     
    }
  },

  checkPassword : function() {
    if (this.data.oldPassword == "") {
      wx.showToast({
        title: '请输入原密码',
        icon:'none',
      })
      return false;
    }

    if (this.data.newPassword == "") {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
      })
      return false;
    }
    var pwdRegExp = /^[A-Za-z0-9_]{6,32}$/;
    var isValidPassword = pwdRegExp.test(this.data.newPassword);
    console.log(isValidPassword);
    if (!isValidPassword) {
      wx.showToast({
        title: "密码6到32位，只允许字母、数字、下划线",
        icon: 'none',
      })
      return false;
    }

    if (this.data.confirmPassword == "") {
      wx.showToast({
        title: '请输入确认密码',
        icon: 'none',
      })
      return false;
    }

    if (this.data.newPassword !== this.data.confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
      })
      return false;
    }

    return true;
  }
})