
// pages/order/order.js
import request from '../../utils/http.js';
import { $stopWuxRefresher } from '../../ui-plugins/wux/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    pageSize: 10,
    orderData: {},
    orderList:[],
    searchParams: {
      orderType: '1',
      type: '0',
      beginTime: '',
      endTime: '',
      companyName: '',
      brandId: '',//品牌id可多个
      categoryCodes: '',//分类
      areaCode: '',
      belongType: '',//1,2,3,4
      belongIds: ''
    },
    pageData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderPrams = JSON.parse(options.orderParams);
  this.setPrepageParams(orderPrams);
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
    this.setData({ pageIndex: 0, orderList:[] });
    this.getData();
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
  /**
   * 设置从今日或历史传递进来的参数
   */
  setPrepageParams(orderParams = {}){
    let data = this.data;
    let params = Object.assign({}, data.searchParams, orderParams);
    this.setData({ searchParams: params });

  },
  getData(callback) {
    //获取数据
   let data = this.data;
  let params = data.searchParams;
    request(
      {
        url: "data.queryOrderStatistics",
        data: params,
        page: {
          "pageIndex": data.pageIndex,
          "pageSize": data.pageSize
        },
        success:  (res)=> {
          let body = res && res.body||{};
          let orderList =[];
          if(data.pageIndex == 0){
            orderList = body.orderGoodsStatisticsList;
            this.setData({ orderData: body});
          }else{
             orderList = this.data.orderList.concat(body.orderGoodsStatisticsList);
          }
         
          this.setData({ orderList:orderList});
            this.setData({ pageData: res.page || {} });
            callback && callback();
        }
      }
    )
     },
    searchOrderStatus(e){
      const status = e.currentTarget.dataset.status
      let params = {
        ...this.data.searchParams,
        status
      };
      wx.navigateTo({
        url: './orderSearch?orderParams=' + JSON.stringify(params),
      })
    },

  onRefresh(){
      this.setData({ pageIndex: 0 });
      this.getData(function(){
        $stopWuxRefresher();
      });
    },
    bindscrolltolower(){
      let data = this.data;
      let pageIndex = data.pageIndex;
      let pageCount = data.pageData.pageCount;
      if (pageIndex < pageCount) {
        pageIndex++;
        this.setData({ pageIndex: pageIndex });
        this.getData();
      }
    },
    /**
     * 筛选
     */
  filterOrder(){
    wx.navigateTo({
      url: './orderFilter',
    })
  }
  })