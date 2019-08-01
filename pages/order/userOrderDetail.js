// pages/order/userOrderDetail.js
import {oldPost} from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSearchBool: false,
    page: {
      pageIndex: 0,
      pageSize: 100,
    },
    orderData: [],
    pageData: {},
    offset: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item) {
      const { tradeTime, userId } = JSON.parse(options.item)
      this.getData({ tradeTime, userId });
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
    // const that = this
    // wx.getSystemInfo({
    //   success: function (res) {
    //     const windowHeight = res.windowHeight   // 除去微信头部的可显示区域高度
    //     that.setData({
    //       offset: windowHeight
    //     })
    //     // const query = that.createSelectorQuery()
    //     // query.select('#search').boundingClientRect((rect) => {
    //     //   that.setData({
    //     //     offset: windowHeight - rect.height
    //     //   })
    //     // }).exec()
    //   },
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },

  // orderDetail(e) {
  //   console.log(e)
  //   const item = e.currentTarget.dataset.item
  //   //订单详情
  //   wx.navigateTo({
  //     url: `./orderDetail?order=${JSON.stringify(item)}`,
  //   })
  // },
  getData(orderParams = {}, callback) {
    //获取数据
    let data = this.data;
    let params = Object.assign({}, orderParams);
    oldPost({
      url: "orderinfo.queryUserFirstTradeOrder",
      data: params,
      page: data.page,
      success: (res) => {
        let body = res && res.body || [];
        let orderData = [];
        orderData = body;

        this.setData({
          orderData
        });

      },
      complete: () => {
        callback && callback();
      }
    })
  },

  // onRefresh(e) {
  //   const instance = e.detail.instance
  //   this.setData({
  //     page: {
  //       pageIndex: 0,
  //       pageSize: 10
  //     }
  //   });
  //   this.getData({}, function () {
  //     instance.finishPullToRefresh()
  //   });
  // },

  // loadMore(e) {
  //   const instance = e.detail.instance
  //   if (this.data.page.pageIndex < this.data.pageData.pageCount) {
  //     const pageIndex = ++this.data.page.pageIndex
  //     this.setData({
  //       page: {
  //         pageIndex,
  //         pageSize: 10
  //       }
  //     }, () => {
  //       this.getData({}, () => {
  //         instance.finishLoadmore()
  //       })
  //     })
  //   } else {
  //     wx.showToast({
  //       title: '没有更多数据',
  //       icon: 'none',
  //       mask: true,
  //     })

  //     instance.finishLoadmore()
  //   }
  // }
})