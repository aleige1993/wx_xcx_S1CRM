// pages/modifyPrice/index.js
import {
  newPost
} from '../../utils/http.js'
import { $stopWuxRefresher } from '../../ui-plugins/wux/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord: '',
    checkedObj: {}, // 已选中的商户
    checkedList: [],
    showList: [],
    pageIndex: 1,
    canUser: false,
    hasMore: true    // 是否有更多数据, 下来加载更多时使用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  onReachBottom: function(e) {
    // console.log('onReachBottom', e)
    // const pageIndex = this.data.pageIndex++
    // this.setData({
    //   pageIndex: pageIndex
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onClear(e) {
    this.setData({
      keyWord: '',
    })
  },

  onLabelTap(e) {
    console.log('onLabelTap', e)
    const arr = []
    let _obj = this.data.checkedObj
    const {
      obj
    } = e.currentTarget.dataset
    if (_obj[obj.id]) {
      delete _obj[obj.id]
    } else {
      _obj = {}  // 单选  清空数据, 多选注释此行
      _obj[obj.id] = obj
    }

    for (let k in _obj){
      arr.push(k)
    }
    this.setData({
      checkedObj: {
        ..._obj
      },
      checkedList: arr
    })
  },

  getData(succ) {
    const that = this
    const user = wx.getStorageSync('crmUser')
    newPost({
      url: 'dealer/goods/searchUser',
      data: {
        registerSalesmanId: user.salesmanId,    // TODO 测试数据  312 user.salesmanId
        searchKey: that.data.keyWord,
        phone: user.phone,
        pageSize: 10,
        pageIndex: that.data.pageIndex
      },
      success: function(data) {
        console.log(data)
        const obj = {}
        let arr = []
        if (that.data.pageIndex === 1) {
          arr = data.body
        } else {
          arr = that.data.showList.concat(data.body)
        }
        console.log(arr)
        that.setData({
          showList: arr,
          hasMore: arr.length > 9 ? true : false
        })

        succ && succ()
      }
    })
  },

  /**
   * 不用这个事件, 
   * 当checkbox 被wx:if 刷掉后无法触发此事件
   * 用tap事件处理逻辑
   */
  onCheckboxChange(e) {
    // const that = this
    // const {
    //   value
    // } = e.detail
    // console.log(e)
    // console.log('onCheckboxChange', value)
    // const obj = {}
    // value.map((item) => {
    //   obj[item] = that.data.showListObj[item]
    // })
    // console.log('onCheckboxChange get obj', obj)
    // that.setData({
    //   checkedObj: obj,
    //   checkedList: value
    // })
  },

  onRefresh(e) {
    console.log('onRefresh', e)
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
        $stopWuxRefresher();
      })
    })
  },

  searchComfirmEvent(e) {
    this.setData({
      keyWord: e.detail.value,
      checkedObj: {}, // 已选中的商户
      checkedList: [],
      showList: [],
      pageIndex: 1,
      canUser: false,
      hasMore: true    // 是否有更多数据, 下来加载更多时使用
    }, () => {
      this.getData()
    })
    
  },

  /**
   * 去选择商品
   */
  onButtonClick(e) {
    const list = this.data.checkedList  // 兼容多选, 此时为长度1的数组
    const obj = this.data.checkedObj[list[0]]
    wx.setStorage({
      key: 'currentShops',
      data: {
        list: list,  
        obj: obj
      },
      success: function(){
        wx.navigateTo({
          url: './product/index',
        })
      }
    })
  },

  /**
   * scroll-view 滚动到底触发
   */
  bindscrolltolower(e) {
    console.log(e)
    if(e.detail.direction === 'bottom' && this.data.hasMore) {
      // wx.showLoading({
      //   title: '加载下一页',
      //   mask: true
      // })
      const pageIndex = ++this.data.pageIndex
      this.setData({
        pageIndex: pageIndex
      }, () => {
        this.getData()
      })
    }
  },

  goHistory() {
    wx.navigateTo({
      url: './history/index',
    })
  }
})