// pages/trade/index.js
import {oldPost} from '../../utils/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '1',
    trade: {
      "dealUserCount": 0,
      "registerUserCount": 0,
      "orderMoneyCount": 0,
      "orderCount": 0,
      "tradeRate": "0.00%",
      "loansReceivable": 0,
      "outputValue": 0,
      "singleOutput": 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getData()
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

  getData() {
    // const user = wx.getStorageSync('crmUser')
    // TODO: 当前登录成功后返回的crmUser.type 都是0
    const _type = this.data.current // user.type
    const that = this
    oldPost({
      data: {
        type: _type
      },
      url: 'mybusiness.queryMyBusinessStatistics',
      success: function(res) {
        const {body} = res
        that.setData({
          trade: body
        })
      }
    })
  },

  onTabsChange(e) {
    const {
      key
    } = e.detail
    this.setData({
      current: key,
    }, () => {
      this.getData()
    })
  },
  /**
   * 用户信息的点击事件
   */
  userInfoTapEvent(e) {
    wx.navigateTo({
      url: './user/index',
    })
  },

  /**
   * 应收账款点击事件
   */
  shouldGetMoneyTapEvent(e) {
    const that = this
    wx.navigateTo({
      url: `./money/index?curType=${that.data.current}&money=${that.data.trade.loansReceivable}`,
    })
  }
})