// pages/mine/staffUserManage.js
import {
  newPost
} from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    badge: null,
    // scrollOffset: 0,
    keyWord: '',
    showList: [],
    showUploadList: [],
    page: {
      pageIndex: 1,
      pageSize: 10
    },
    currentIndex: 1,
    verifyStatus: 2,
    canUser: false,
    hasMore: true    // 是否有更多数据, 下来加载更多时使用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const currentIndex = options.currentIndex
    if(currentIndex) {
      this.setData({
        currentIndex
      }, () => {
        this.getData()
      })
    } else {
      this.getData()
    }
    
    this.getNum()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // let that = this
    // let query = wx.createSelectorQuery().in(this)
    // console.log(this.createSelectorQuery()._component)
    // query.select('#title').boundingClientRect(res => {
    //   const scrollOffset = res.height
    //   that.setData({ scrollOffset: scrollOffset })
    // }).exec()
  },

  getNum(){
    const that = this
    const user = wx.getStorageSync('crmUser')
    newPost({
      url: 'dealer/goods/auditNum',
      data: {
        registerSalesmanId: user.salesmanId,
      },
      success: function(data) {
        that.setData({
          badge: data.body
        })
      }
    })
  },

  getUnupload() {
    const that = this
    const user = wx.getStorageSync('crmUser')
    newPost({
      url: 'carsmall/dealer/user/getShouldSubmitDataMerchant',
      data: {
        employeeId: user.salesmanId,
      },
      success: function(data) {
        that.setData({
          showUploadList: data.body
        })
      }
    })
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

  onSegmentChange(e) {
    const index = e.currentTarget.dataset.id - 0;
    let _m = 0
    if(index == 1) {
      _m = 2
    } else if(index == 2) {
      _m = 1
    } else {
      _m = index
    }
    this.setData({
      currentIndex: index,
      verifyStatus: _m,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      keyWord: '',
      showList: []
    }, () => {
      if(index == 99) {
        this.getUnupload()
      } else {
        this.getData()
      }
    });
  },

  onRefresh(e) {
    const instance = e.detail.instance
    // 刷新不清空搜索关键字
    this.setData({
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
      keyWord: e.detail.value,
      showList: [],
      pageIndex: 1,
      canUser: false,
      hasMore: true    // 是否有更多数据, 下来加载更多时使用
    }, () => {
      this.getData()
    })

  },
  /**
   * 上传商户信息
   */
  uploadInfo(e) {
    console.log(e)
    const user = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `./merchantData?user=${JSON.stringify(user)}`,
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
    }else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
        mask: true,
      })

      instance.finishLoadmore()
    }
  }
})