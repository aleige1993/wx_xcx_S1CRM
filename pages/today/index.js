// pages/today/index.js
import navigate from '../../template/dataTemp.js';
import request from '../../utils/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayData:{},
    total:[],
    count: '00000000'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
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
    // this.getData();
    wx.stopPullDownRefresh()
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
  navigatePage(e){
    console.log(e)
    //模板点击跳转页面
    let params = {type:0,beginTime:"",endTime:""};
    const type = e.currentTarget.dataset.type;
    let extra = null

    switch (type) {
      case 'order': 
        break;
      case 'user': 
        extra = {
          registerUserNewCount: this.data.todayData.registerUserNewCount,
          registerUserCount: this.data.todayData.registerUserCount
        }
        break;
      // //时间字段为tradeBeginTime,TradeEndTime
      // case 'tradeUser': {
      //   params = {
      //     type: params.type,
      //     tradeBeginTime: params.beginTime,
      //     tradeEndTime: params.endTime
      //   }
      // }; break;
      // case 'addTradeUser': {
      //   params = {
      //     type: params.type,
      //     tradeBeginTime: params.beginTime,
      //     tradeEndTime: params.endTime
      //   }
      // } break;
    }
    navigate.navigatePage(e, params, extra);
  },
  getData(){
    let user = wx.getStorageSync('crmUser')||{};
    request(
      {
        url: "data.queryDataStatisticsNew",
        data:  { "type":0, "salesmanId": user.salesmanId }, 
        success:(res)=>{
          let body = res.body;
          let total = body.orderMoneyCount;
          // 向下取整, 否则小数点后要占据三位显示位
          let count = Math.floor(total) + ''
          const len = 8 - count.length

          if(len > 0) {
            for (let i = 0; i < len; i++) {
              count = '0' + count
            }
          }
          // this.getTotalArry(total);
          this.setData({ 
            todayData: body,
            count
          });
        }
      }
    )
  },
  getTotalArry(total){
    let arry = total.split('');
  }
})