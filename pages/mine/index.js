// pages/mine/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    hasOrderManage: false,
    isSaleman: false,
    hasUserManage: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUsername();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  
  setUsername(){
    const that = this
    // 在组件实例进入页面节点树时执行
    wx.getStorage({
      key: 'crmUser',
      success: function (res) {
        if (res.data) {
          const data = res.data
          const role = res.data.userPrivilege.split(',')
          that.setData({ username: data.name });
          if (data.orgType == 0) {
            that.setData({
              hasOrderManage: false,
              isSaleman: false,
              hasUserManage: false
            })
          }
          else if ((data.orgType == 1 || data.orgType == 4)) {
            that.setData({
              hasOrderManage: false,  // TODO: 20190422 暂时修改
              isSaleman: false,
              hasUserManage: false
            })
          }
          else if ((data.orgType == 2 || data.orgType == 5)) {  // 订单管理
            that.setData({
              hasUserManage: true
            })
            if (role.includes('327')) {
              that.setData({
                hasOrderManage: true,
              })
            } else {
              that.setData({
                isSaleman: true
              })
            }
          }
        }
      },
    })
  },
  goMessagePage(){
    wx.navigateTo({
      url: './message/notificationCenter',
    })
  },
  goPage(e){
    let type =e.currentTarget.dataset.type;
    switch(type){
      case '0':wx.navigateTo({
        url: './myCode',
      });break;
      case '1':wx.navigateTo({
        url: './staffList',
      });break;
      case '2':wx.navigateTo({
        url: './userManage',
      });break;
      case '3':wx.navigateTo({
        url: './safetySetting/safetySettings',
      });break;
      case '4':wx.navigateTo({
        url: './systemSetting/systemSettings',
      });break;
      case '5': wx.navigateTo({
        url: './order/orderList',
      }); break;
      case '6': wx.navigateTo({
        url: './staffUserManage',
      }); break;
      }
  },
  goShanfutongPage: function () {
    wx.navigateTo({
      url: "./shanfutong",
    })
  }
})