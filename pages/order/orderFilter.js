// pages/order/orderFilter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyName:"",
    brandId:"",//单选品牌id
    brandName:"不限",
    categoryCodes:"",//分类
    categoryCodesName: "不限",
    areaCode:"",//地区编码用,分隔
    areaCodeName:"不限",
    belongType:"",//1,2,3,4业务员、团队、经销商、服务商
    belongIds:"",
    belongIdsName:"",
    categoryStatus:false,//分类筛选

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
    this.clearGlobalTypeInfo();
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
   * 清空选中得业务员或经销商
   */
  clearGlobalTypeInfo(){
    let app =getApp();
    delete app.globalData.typeCheckArr;
    delete app.globalData.typeIndex;
  },
  /**
   * 跳转
   */
  goTag(e){
    let tag = e.currentTarget.dataset.tag;
    let data = this.data;
    switch(tag){
      case '1':wx.navigateTo({
        url: './brand?brandId='+data.brandId+'&brandName='+data.brandName,
      });
      break;
      case '2':{
        this.setData({categoryStatus:true});
      }
        break;
      case '3': wx.navigateTo({
        url: './areaFilter',
      });
        break;
      case '4': wx.navigateTo({
        url: './belongType',
      });
        break;
    }
  },
  /**
   * 关闭分类选择框
   */
  closeCatogory(){
    this.setData({ categoryStatus:false});
  },
  /**
   * 修改分类code的值
   */
  changeCategoryCodes(data){
    this.setData({ categoryCodes: data.detail.code, categoryCodesName:data.detail.name})
  },
  changeName(e){
    this.setData({ companyName:e.detail.value});
  },
  /**
   * 清空
   */
  clearFilter(){
    this.setData({
      companyName: "",
      brandId: "",
      categoryCodes: "",
      areaCode: "",
      belongType: "",
      belongIds: "",
      brandName: "不限",
      categoryCodesName: "不限",
      areaCodeName: "不限",
      belongIdsName: "",
    })
  },
  /**
   * 查询
   */
  searchFilter(){
    let pages = getCurrentPages();
    let prePage = pages[pages.length-2];
    let data =this.data;
    prePage.setData( {
      ['searchParams.companyName']: data.companyName,
      ['searchParams.brandId']: data.brandId,
      ['searchParams.categoryCodes']: data.categoryCodes,//分类
      ['searchParams.areaCode']: data.areaCode,
      ['searchParams.belongType']: data.belongType,//1,2,3,4
      ['searchParams.belongIds']: data.belongIds
    });
    wx.navigateBack({
      delta: 1
    })
  },
  clearName(){
    this.setData({ companyName:""})
  }
})