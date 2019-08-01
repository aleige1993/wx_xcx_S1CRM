// pages/modifyPrice/history/index.js
import { newPost } from '../../../utils/http.js'
import { $stopWuxRefresher } from '../../../ui-plugins/wux/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    page: {
      pageIndex: 1,
      pageSize: 10
    },
    showList: [],
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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

  onRefresh(){
    this.setData({
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      showList: [],
      hasMore: true    // 是否有更多数据, 下来加载更多时使用
    }, () => {
      this.getData(() => {
        $stopWuxRefresher();
      })
    })
  },

  getData(succ) {
    const user = wx.getStorageSync('crmUser')
    const that = this
    newPost({
      data: {
        ...that.data.page,
        loginUser: user.salesmanId,
        status: that.data.current,
      },
      url: 'dealer/goods/getIndividualPriceList',
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

        succ && succ()
      }
    })
  },

  onTabsChange(e) {
    const {
      key
    } = e.detail
    this.setData({
      current: key,
      page: {
        pageIndex: 1,
        pageSize: 10
      }
    }, () => {
      this.getData()
    })
  },

  rowTap(e) {
    const id = e.currentTarget.dataset.item.userId
    const that = this
    wx.navigateTo({
      url: `../historyInfo/index?id=${id}&type=${that.data.current}`,
    })
  },

  bindscrolltolower(e) {
    console.log(e)
    if (e.detail.direction === 'bottom' && this.data.hasMore) {
      // wx.showLoading({
      //   title: '加载下一页',
      //   mask: true
      // })
      const pageIndex = ++this.data.page.pageIndex
      this.setData({
        page: {
          pageIndex,
          pageSize: 10
        }
      }, () => {
        this.getData()
      })
    }
  }
})