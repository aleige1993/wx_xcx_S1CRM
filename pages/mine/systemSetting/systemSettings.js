// pages/mine/systemSettings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  switchChange(e){
   
  },
  checkVersion: function(){
    if (wx.canIUse("getUpdateManager")){
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if(res.hasUpdate){
          updateManager.onUpdateReady(function(){
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success:function(res){
                if(res.confirm){
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            });
          });

          updateManager.onUpdateFailed(function(res){
            //// 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
            })
          });
        }
      })
      wx.showToast({
        title: '已是最新版本',
        icon: 'success'
      })
    }else{
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      });
    }
  },
  signOut: function () {
    wx.showLoading({
      title: "退出中...",
      complete: () => {
        wx.clearStorage({
          complete: () => {
            wx.navigateTo({
              url: "../../login/index"
            })
          }
        })
      }
    })
  }
})