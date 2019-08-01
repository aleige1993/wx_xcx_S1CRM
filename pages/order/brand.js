// pages/order/brand.js
import request from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandArr:[],
    brandName:"不限",
    brandId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initBrand(options);
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
   * 初始化选中的brand
   */
  initBrand(options){
    let brandId= options.brandId;
    let brandName= options.brandName;
    this.setData({brandId:brandId,brandName:brandName});
  },
  getData(){
    request({
      data:{},
      url:"data.queryBrand",
      success:(res)=>{
        this.setBrandData(res);
      }
    })
  },
  /**
   * 设置品牌数据
   */
  setBrandData(res){
    this.setData({brandArr:res.body||[]});
  },
  /**
   * 选择品牌
   */
  chooseBrand(e){
    let dataset = e.currentTarget.dataset;
    let brandId = dataset.brandid;
    let brandName = dataset.brandname;
    this.setPrePageBrand(brandId, brandName);
  },
  /**
   * 设置上一页的品牌值
   */
  setPrePageBrand(brandId, brandName){
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];

    prePage.setData({
    
      brandId: brandId,
    brandName:brandName
    });
    wx.navigateBack({
      delta: 1
    })
  }
})