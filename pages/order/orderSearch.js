// pages/order/orderSearch.js
import request from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: "订单状态",
    showSearchBool: false,

    searchParams: {
      status: '1,2,3,6', //1已支付，2已发货，3已完成, 6已退款,
    },
    page: {
      pageIndex: 0,
      pageSize: 10,
    },
    orderData: [],
    pageData: {},
    offset: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let receiveParams = JSON.parse(options.orderParams) || {};
    this.getData(receiveParams);
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
    const that = this
    wx.getSystemInfo({
      success: function(res) {
        const windowHeight = res.windowHeight   // 除去微信头部的可显示区域高度
        that.setData({
          offset: windowHeight - 41 - 10
        })
        // const query = that.createSelectorQuery()
        // query.select('#search').boundingClientRect((rect) => {
        //   that.setData({
        //     offset: windowHeight - rect.height
        //   })
        // }).exec()
      },
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  changeStatus(e) {
    let status = 'searchParams.status';
    this.setData({
      showSearchBool: e.detail.status,
      [status]: e.detail.statusCode
    });
    this.getData();
  },
  hideSearch() {
    this.setData({
      showSearchBool: false,
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
  },
  orderDetail(e) {
    console.log(e)
    const item = e.currentTarget.dataset.item
    //订单详情
    wx.navigateTo({
      url: `./orderDetail?order=${JSON.stringify(item)}`,
    })
  },
  getData(orderParams = {}, callback) {
    //获取数据
    let data = this.data;
    let params = Object.assign({}, data.searchParams, orderParams);
    this.setParams(params);
    request({
      url: "orderinfo.queryOrdersByOperator",
      data: params,
      page: data.page,
      success: (res) => {
        let body = res && res.body || [];
        let orderData = [];
        if (data.page.pageIndex == 0) {
          orderData = body;
        } else {
          orderData = this.data.orderData.concat(body);
        }

        this.setData({
          orderData
        });
        this.setData({
          pageData: res.page || {}
        });
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  setParams(params) {
    this.setData({
      searchParams: params
    });
  },
  onRefresh(e) {
    const instance = e.detail.instance
    this.setData({
      page: {
        pageIndex: 0,
        pageSize: 10
      }
    });
    this.getData({}, function() {
      instance.finishPullToRefresh()
    });
  },

  loadMore(e) {
    const instance = e.detail.instance
    if (this.data.page.pageIndex < this.data.pageData.pageCount) {
      const pageIndex = ++this.data.page.pageIndex
      this.setData({
        page: {
          pageIndex,
          pageSize: 10
        }
      }, () => {
        this.getData({}, () => {
          instance.finishLoadmore()
        })
      })
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
        mask: true,
      })

      instance.finishLoadmore()
    }
  }
})