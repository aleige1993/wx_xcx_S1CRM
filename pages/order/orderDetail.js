// pages/order/orderDetail.js 
import { oldPost } from '../../utils/http.js'
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    order: null,
    detail: null,
    good: null,
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    const order = JSON.parse(options.order)
    if (order) {
      this.setData({
        order
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

  /** 
   * 生命周期函数--监听页面显示 
   */
  onShow: function () {

  },

  getData() {
    const that = this
    const order = this.data.order
    oldPost({
      url: 'orderinfo.getOrderDetail',
      data: {
        orderNo: order.orderNo,
        orderId: order.id
      },
      success: (res) => {
        const data = res.body
        this.setData({
          detail: data,
          good: data.orderGoods
        })
      }
    })
  }
})