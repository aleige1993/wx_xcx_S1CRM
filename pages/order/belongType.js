// pages/order/belongType.js
import request from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    salesman: [],
    team: [],
    dealer: [],
    service: [],
    belongIds: "",
    belongIdsName: "",
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
   * tab切换
   */
  switchTab(e) {
    let index = Number(e.detail.key);
    let data = this.data;
    this.setData({ currentIndex: index });
    switch(index){
      case 0:{let salesman = data.salesman;if(salesman.length){return }};break;
      case 1: { let team = data.team; if (team.length) { return } }; break;
      case 2: { let dealer = data.dealer; if (dealer.length) { return } }; break;
      case 3: { let service = data.service; if (service.length) { return } }; break;
    }
    this.getData();
  },
  /**
   * 获取数据
   */
  getData() {
    let index = this.data.currentIndex;
    request({
      url: "data.queryBelongs",
      data: {
        type: Number(index) + 1
      },
      success: (res) => {
        this.setTypeData(res.body || []);
      }
    })
  },
  /**
   * 设置获取的数据
   */
  setTypeData(data) {
    let index = Number(this.data.currentIndex);
    switch (index) {
      case 0:
        { this.setData({ salesman: data }) }
        ; break;
      case 1: { this.setData({ team: data }) }; break;
      case 2: { this.setData({ dealer: data }) }; break;
      case 3: { this.setData({ service: data }) }; break;
    }
  },
  /**
   * 获取选中得值
   */
  getChosedData(e){
    let info = e.detail;
    let belongIds = info.belongIds;
      let belongIdsName= info.belongIdsName;
    let pages = getCurrentPages();//当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    let tag = this.data.tag;

    prevPage.setData({
      belongType: info.belongType,//1,2,3,4业务员、团队、经销商、服务商
      belongIds: belongIds,
      belongIdsName: belongIdsName,
    });
    wx.navigateBack({
      delta: 1
    })

  }

})