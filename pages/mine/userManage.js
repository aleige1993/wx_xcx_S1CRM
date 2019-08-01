// pages/userManage.js
import { newPost } from '../../utils/http.js';
import { $stopWuxRefresher } from '../../ui-plugins/wux/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: '',
    showList: [],
    page: {
      pageIndex: 1,
      pageSize: 10
    },
    hasMore: true    // 是否有更多数据, 下来加载更多时使用
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
  getData(succ) {
    const that = this
    const user = wx.getStorageSync('crmUser')
    newPost({
      url: 'dealer/goods/userInfoList',
      data: {
        registerSalesmanId: user.salesmanId,
        searchKey: that.data.keyWord,
        verifyStatus: that.data.verifyStatus,
        pageSize: that.data.page.pageSize,
        pageIndex: that.data.page.pageIndex
      },
      success: function (data) {
        const obj = {}
        let arr = []
        if (that.data.page.pageIndex === 1) {
          arr = data.body
        } else {
          arr = that.data.showList.concat(data.body)
        }
        that.setData({
          showList: arr,
          hasMore: arr.length > 9 ? true : false
        })
      },
      complete: () => {
        succ && succ()
      }
    })
  },

  getData(succ) {
    //获取数据
    const that = this
    let user = wx.getStorageSync('crmUser');
    let params = {
      dealerId: user.orgId,
      searchKey: this.data.searchKey,
      ...this.data.page
    }
    newPost(
      {
        url: "dealer/goods/searchUserDealer",
        data: params,
        success: function (data) {
          const obj = {}
          let arr = []
          if (that.data.page.pageIndex === 1) {
            arr = data.body
          } else {
            arr = that.data.showList.concat(data.body)
          }
          that.setData({
            showList: arr,
            hasMore: arr.length > 9 ? true : false
          })
        },
        complete: () => {
          succ && succ()
        }
      }
    )
  },
  onRefresh(e) {
    const instance = e.detail.instance
    // 刷新不清空搜索关键字
    this.setData({
      checkedObj: {}, // 已选中的商户
      checkedList: [],
      showList: [],
      pageIndex: 1,
      canUser: false,
      hasMore: true    // 是否有更多数据, 下来加载更多时使用
    }, () => {
      this.getData(() => {
        instance.finishPullToRefresh()
      })
    })
  },

  searchComfirmEvent(e) {
    this.setData({
      searchKey: e.detail.value,
      showList: [],
      pageIndex: 1,
      hasMore: true    // 是否有更多数据, 下来加载更多时使用
    }, () => {
      this.getData()
    })

  },
  loadMore(e) {
    const instance = e.detail.instance
    if (this.data.hasMore) {
      const pageIndex = ++this.data.page.pageIndex
      this.setData({
        page: {
          pageIndex,
          pageSize: 10
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
        mask: true,
      })

      instance.finishLoadmore()
    }
  }
})