// pages/mine/message/orderMessage.js
import request, {oldPost} from "../../../utils/http.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    pageSize: 10,
    messageData: null,
    pageData: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessageData();
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
  
  //下拉刷新
  onRefresh(e) {
    const instance = e.detail.instance
    this.getMessageData({
      callback: () => {
        instance.finishPullToRefresh();
      }
    });
  },

  //上拉加载更多
  onLoadMore(e) {
    const instance = e.detail.instance;
    let data = this.data;
    let pageIndex = data.pageIndex;
    let pageCount = data.pageData.pageCount;
    if (pageIndex < pageCount) {
      pageIndex++;
      this.setData({ pageIndex: pageIndex });
      this.getMessageData({
        callback: () => {
          instance.finishLoadmore();
        }
      });
    }else{
      instance.finishLoadmore();
    }
  },
  
  //获取消息数据
  getMessageData(paramsData = {}) {
    var self = this;
    wx.showLoading({
      title: "加载中...",
    })
    //消息类型, 0:订单消息 1:系统消息
    let params = { "type": 0 };
    request({
      url: "msg.queryMessageNew",
      data: params,
      page: {
        "pageIndex": this.data.pageIndex,
        "pageSize": this.data.pageSize,
      },
      complete:()=>{

      },
      success: (res) => {
        var arr = []
        if (this.data.pageIndex === 0) {
          arr = res && res.body || {}
        } else {
          arr = this.data.messageData.concat(res.body)
        }
        this.setData({
          messageData: arr
        });
        this.setData({
          pageData: res.page || {}
        });
        wx.hideLoading();

        paramsData.callback && paramsData.callback()
      }
    });
  },
  goOrderDetail(e) {
    let orderId = e.currentTarget.dataset.id;
    this.getDetailData(orderId);
  },
  getDetailData(orderId) {
    // wx.showLoading({
    //   title: "加载中...",
    // })

    let params = { "orderId": orderId };
    oldPost({
      url: "orderinfo.getOrderDetail",
      data: params,
      success: (res) => {
        wx.navigateTo({
          url: "/pages/mine/order/detail/index?orderNo=" + res.body.orderNo,
        })
        // wx.hideLoading();
      },
      fail: () => {
        wx.showToast({
          title: '此订单已不存在',
        })
      }
    });
  },
})