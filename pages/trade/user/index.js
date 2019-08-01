// pages/trade/user/index.js
import {oldPost} from '../../../utils/http.js'
import { $stopWuxRefresher } from '../../../ui-plugins/wux/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchWord: '',
    userList: [],
    form: {
      type: 10,   // TODO 抓取值, 和Tabs的选项无关 暂时不知道代表的含义
    },
    page: {
      pageIndex: 0,
      pageSize: 20
    },
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.form) {
      const form = JSON.parse(options.form)
      this.setData({
        form: form
      }, () => {
        this.getData()
      })
    } else {
      this.getData()
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

  onRefresh(e) {
    console.log('onRefresh', e)
    this.setData({
      
    }, () => {
      this.getData(() => {
        $stopWuxRefresher();
      })
    })
  },

  getData(succ) {
    const that = this

    oldPost({
      url: 'user.userList',
      data: that.data.form,
      page: that.data.page,
      success: function(data){
        let arr = []
        if (that.data.page.pageIndex === 0) {
          arr = data.body
        } else {
          arr = that.data.userList.concat(data.body)
        }
        that.setData({
          userList: arr,
          hasMore: data.body.length == that.data.page.pageSize ? true : false
        })

        succ && succ()
      }
    })
  },

  onSearchFocus(){
    const form = this.data.form
    wx.navigateTo({
      url: `./data/index?form=${JSON.stringify(form)}`,
    })
  },

  rowTapEvent(e){
    console.log(e.currentTarget.dataset.item)
    const query = e.currentTarget.dataset.item
    wx.setStorage({
      key: 'searchUser',
      data: query,
      success: () => {
        wx.navigateTo({
          url: `../basicInfo/index?userId=${query.userId}`
        })
      }
    });
    
  },

  /**
     * scroll-view 滚动到底触发
     */
  bindscrolltolower(e) {
    if (e.detail.direction === 'bottom' && this.data.hasMore) {
      // wx.showLoading({
      //   title: '加载下一页',
      //   mask: true
      // })
      const pageIndex = ++this.data.page.pageIndex
      this.setData({
        page: {
          pageIndex,
          pageSize: 20
        }
      }, () => {
        this.getData()
      })
    }
  }
})