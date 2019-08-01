// pages/mine/order/detail/index.js
import {newPost} from '../../../../utils/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    showList: [],
    order: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const orderNo = options.orderNo
    if(orderNo) {
      this.setData({
        orderNo
      }, () => {
        this.getData()
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getData() {
    const that = this
    newPost({
      url: 'dealer/order/orderDetail',
      data: {
        orderNo: that.data.orderNo
      },
      success: function(data) {
        const _data = data.body
        that.setData({
          order: _data,
          showList: _data.torderGoodsVOSList
        })
      }
    })
  }
})