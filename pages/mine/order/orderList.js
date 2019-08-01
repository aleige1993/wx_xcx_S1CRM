// pages/mine/order/orderList.js
import {
  newPost
} from '../../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: {
      pageIndex: 1,
      pageSize: 10,
    },
    currentIndex: -1,
    showList: [],
    scrollOffset: 0,
    hasStatus: false,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.currentIndex > -1) {
      this.setData({
        currentIndex: options.currentIndex
      }, () => {
        this.getData();
      })
    } else {
      this.getData();
    }

    const that = this
    // 在组件实例进入页面节点树时执行
    wx.getStorage({
      key: 'crmUser',
      success: function (res) {
        if (res.data) {
          const data = res.data
          const role = res.data.userPrivilege.split(',')
          if (role.includes('327') && (data.orgType == 2 || data.orgType == 5)) {  // 订单管理
            that.setData({
              hasStatus: true
            })
          }
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // let that = this

    // let query = wx.createSelectorQuery().in(this)
    // console.log(this.createSelectorQuery()._component)
    // query.select('#tabs').boundingClientRect(res => {
    //   console.log(res)
    //   const scrollOffset = res.height
    //   that.setData({ scrollOffset: scrollOffset })
    // }).exec()
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
  getData(callback) {
    //获取数据
    let data = this.data;
    const that = this
    let user = wx.getStorageSync('crmUser');
    let params = {
      operatorId: user.salesmanId,
      orgId: user.orgId,
      "pageIndex": data.page.pageIndex,
      "pageSize": data.page.pageSize
    }
    if (data.currentIndex != -1) {
      params = {
        ...params,
        accountSettled: data.currentIndex,
      }
    }
    newPost({
      url: "dealer/order/getOrderList",
      data: params,
      success: (res) => {
        let arr = []
        if (that.data.page.pageIndex === 1) {
          arr = res.body
        } else {
          arr = that.data.showList.concat(res.body)
        }
        that.setData({
          showList: arr,
          hasMore: res.body.length == that.data.page.pageSize ? true : false
        })
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  /**
   * tab切换
   */
  switchTab(e) {
    let index = Number(e.detail.key);
    this.setData({
      currentIndex: index,
      page: {
        pageIndex: 1,
        pageSize: 10
      }
    }, () => {
      this.getData()
    });
  },
  onRefresh(e) {
    const instance = e.detail.instance
    this.setData({
      pageIndex: 1
    });
    this.getData(() => {
      // $stopWuxRefresher('#refresher');
      instance.finishPullToRefresh()
    });
  },

  loadMore(e) {
    const instance = e.detail.instance
    if (this.data.hasMore) {
      const pageIndex = ++this.data.page.pageIndex
      const pageSize = this.data.page.pageSize
      this.setData({
        page: {
          pageIndex,
          pageSize
        }
      }, () => {
        this.getData(() => {
          instance.finishLoadmore()
        })
      })
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
      })
      instance.finishLoadmore()
    }
  },
  // bindscrolltolower() {
  //   if (e.detail.direction === 'bottom' && this.data.hasMore) {
  //     const pageIndex = ++this.data.page.pageIndex
  //     const pageSize = this.data.page.pageSize
  //     this.setData({
  //       page: {
  //         pageIndex,
  //         pageSize
  //       }
  //     }, () => {
  //       this.getData()
  //     })
  //   }
  // },

  onBindTap(e) {
    console.log(e)
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `./orderDetail?order=${JSON.stringify(item)}`,
    })
  },

  showDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `./detail/index?orderNo=${item.orderNo}`,
    })
  }
})