// pages/user/tradeUserSearch.js
let tools = require("../../utils/Tools.js");
import request from '../../utils/http.js';
let app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    end:"",
    company:"",
    linkName:"",
    phone:"",
    salesmanName:"",
    systemLabelIds:"",
    userLabelIds:"",
    registerBeginTime:"",
    registerEndTime:"",
    tradeNumBegin:0,
    tradeNumEnd:0,
    isTrade:1,//默认,
    tradeBeginTime:"",
    tradeEndTime:"",
    systemLabelNames:"",
    userLabelNames: "",



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initEndTime();
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
    this.clearGlobelCheck();
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
  clearGlobelCheck() {
    app.globalData.systemCheckArr = [];
    app.globalData.userCheckArr = [];
  },
  initEndTime(){
    let newDate = new Date();
    let timeStamp = newDate.getTime();
    let date = tools.timestampToDate(timeStamp);
    this.setData({end:date});
  },
  bindStartDateChange(e) {
    let endDate = this.data.registerEndTime;
    if (endDate != "") {
      //判断选择的开始时间不能大于结束时间
      let result = tools.compareDate(e.detail.value, endDate);
      if (!result) {
        wx.showToast({
          title: '开始时间不能大于结束时间',
          icon: 'none'
        })
        return;
      }
    }
    this.setData({ registerBeginTime: e.detail.value});
  },
  bindEndDateChange(e) {
    let startDate = this.data.registerBeginTime;
    if (startDate != "") {
      //判断选择的开始时间不能大于结束时间
      let result = tools.compareDate(startDate, e.detail.value);
      if (!result) {
        wx.showToast({
          title: '结束时间不能小于开始时间',
          icon: 'none'
        })
        return;
      }
    }
    this.setData({ registerEndTime: e.detail.value});
  },
  changeName(e){
    this.setData({company:e.detail.value});
  },
  changeLinkName(e) {
    this.setData({ linkName: e.detail.value });
  },
  changePhone(e) {
    this.setData({ phone: e.detail.value });
  },
  changeSalesman(e) {
    this.setData({ salesmanName: e.detail.value });
  },
  changeTradeBeginNum(e) {
    this.setData({ tradeNumBegin: e.detail.value });
  },
  changeTradeEndNum(e) {
    this.setData({ tradeNumEnd: e.detail.value });
  },
  goTag(e){
    //跳转标签
    let tag = e.currentTarget.dataset.tag;
    wx.navigateTo({
      url: './tagSearch?tag='+tag,
    })
  },
  search(){
    let rule = this.checkTradeNum();
    if(!rule ){
      return;
    }
    let pages = getCurrentPages();//当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    let data = this.data;
    prevPage.setData({
      ['searchParams.company']:data.company,
      ['searchParams.linkName']: data.linkName,
      ['searchParams.phone']:data.phone,
      ['searchParams.salesmanName']: data.salesmanName,
      ['searchParams.systemLabelIds']: data.systemLabelIds,
      ['searchParams.userLabelIds']: data.userLabelIds,
      ['searchParams.registerBeginTime']: data.registerBeginTime,
      ['searchParams.registerEndTime']: data.registerEndTime,
      ['searchParams.tradeNumBegin']: data.tradeNumBegin,
      ['searchParams.tradeNumEnd']: data.tradeNumEnd,
    })
   wx.navigateBack({
     delta:1
   })
   
  },
  checkTradeNum(){
    let data = this.data;
    let beginNum = data.tradeNumBegin;
    let endNum = data.tradeNumEnd;
    if(beginNum>endNum){
      wx.showToast({
        title: '交易起始次数不能大于结束次数',
        icon:'none'
      });
      return false;
    }
    return true;
  }
})