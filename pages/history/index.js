// pages/history/index.js
import navigate from '../../template/dataTemp.js';
import request from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: "按时间段搜索",
    showSearchBool: false,
    type: 1,
    beginTime: "", //为20190211格式
    endTime: "",
    todayData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData();
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
    this.hideSearch();
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
    // this.getData();
    wx.stopPullDownRefresh()
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
  navigatePage(e) {
    //模板点击跳转页面
    let data = this.data;
    let params = {
      type: data.type,
      beginTime: data.beginTime,
      endTime: data.endTime
    }
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
  getData() {
    //获取数据
    let user = wx.getStorageSync('crmUser') || {};
    let data = this.data;
    let params = {};
    if (data.type != 10) {
      params = {
        type: data.type,
        salesmanId: user.salesmanId
      };
    } else {
      params = {
        type: data.type,
        beginTime: data.beginTime,
        endTime: data.endTime,
        salesmanId: user.salesmanId
      };
    }
    request({
      url: "data.queryDataStatisticsNew",
      data: params,
      success: (res) => {
        let body = res.body;
        let total = body.orderMoneyCount;
        // this.getTotalArry(total);
        this.setData({
          todayData: body
        });
      }
    })
  },
  changeStatus(e) {
    let data = e.detail;
    let oldType = this.data.type;
    let newType = data.type;
    this.hideSearch();
    if (newType) {
      if (newType.toString() == '10') {
        let oldBeginTime = this.data.beginTime;
        let oldEndTime = this.data.endTime;
        this.setTimeDate(data.time);
        let newBeginTime = this.data.beginTime;
        let newEndTime = this.data.endTime;
        if (oldBeginTime == newBeginTime && oldEndTime == newEndTime) {
          return;
        } else {
          this.setTitle(data.time);
        }
      } else {
        this.clearSearchText();
        this.clearTime();
        if (newType == oldType) {
          return;
        }
      }
      this.setData({
        type: data.type
      });
      this.getData();
    }

  },
  setTimeDate(time) {
    let startStamp = time.startDate.replace(/-/g, '');
    let endStamp = time.endDate.replace(/-/g, '');
    this.setData({
      beginTime: startStamp,
      endTime: endStamp
    });
  },
  clearTime() {
    this.setData({
      beginTime: "",
      endTime: ""
    });
  },
  clearSearchText() {
    this.setData({
      searchText: '按时间段搜索'
    });
  },
  setTitle(time) {
    let title = time.startDate + '-' + time.endDate;
    this.setData({
      searchText: title
    });
  },
  hideSearch() {
    this.setData({
      showSearchBool: false
    })
  },
  showSearch() {
    let status = this.data.showSearchBool;
    if (status) {
      this.setData({
        showSearchBool: false
      });
    } else {
      this.setData({
        showSearchBool: true
      });
    }
  }
})