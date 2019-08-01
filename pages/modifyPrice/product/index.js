// pages/modifyPrice/product/index.js
// import { $wuxDialog } from '../../../ui-plugins/wux/index'
import {
  newPost
} from '../../../utils/http.js'
import { $stopWuxRefresher } from '../../../ui-plugins/wux/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord: '',
    checkedObj: {}, // 已选中的商户
    checkedList: [],
    showList: [],
    page: {
      pageIndex: 1,
      pageSize: 10
    },
    canUser: false,
    userId: 0,
    dialogData: {
      price: 0,
      unit: ''
    },
    dialogShow: false,
    inputValue: '',
    hasMore: true,    // 是否有更多数据, 下来加载更多时使用
    isSelf: false       // 判断业务员选择的商户是否是其本身, 通过登录用户的手机和商户手机确定
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const user = wx.getStorageSync('crmUser')
    const shop = wx.getStorageSync('currentShops').obj
    if (user) {
      this.setData({
        userId: user.salesmanId,
        isSelf: user.phone == shop.phone
      }, () => {
        this.getData()
      })
    }

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
  onReachBottom: function() {

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

  /**
   * 数据重置
   */
  dataReset() {
    this.setData({
      checkedObj: {}, // 已选中的商品
      checkedList: [],
      showList: [],
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      canUser: false,
      dialogData: {
        price: 0,
        unit: ''
      },
      dialogShow: false,
      hasMore: true    // 是否有更多数据, 下来加载更多时使用
    })
  },

  onLabelTap(e) {
    console.log('onLabelTap', e)
    const data = this.data
    const arr = []
    const {
      checkedObj
    } = data
    const {
      obj
    } = e.currentTarget.dataset
    if (obj.auditing) {
      return
    }
    if (checkedObj[obj.id]) {
      delete checkedObj[obj.id]
    } else {
      checkedObj[obj.id] = obj
    }

    for (let k in checkedObj) {
      arr.push(k)
    }
    this.setData({
      checkedObj: {
        ...checkedObj
      },
      checkedList: arr
    })
  },

  getData(succ) {
    const that = this
    const shop = wx.getStorageSync('currentShops').list

    const url = that.data.isSelf ? 'dealer/goods/searchGoodsShow' : 'dealer/goods/searchGoods'
    // console.log(url)

    newPost({
      url,
      data: {
        id: that.data.userId, 
        loginUser: that.data.userId, 
        goodName: that.data.keyWord,
        userIds: shop,
        pageSize: that.data.page.pageSize,
        pageIndex: that.data.page.pageIndex
      },
      success: function(data) {
        console.log(data)
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

  onRefresh(e) {
    this.setData({
      checkedObj: {}, // 已选中的商户
      checkedList: [],
      showList: [],
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      canUser: false,
      dialogData: {
        price: 0,
        unit: ''
      },
      dialogShow: false,
      inputValue: ''
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
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      canUser: false,
      userId: 0,
      dialogData: {
        price: 0,
        unit: ''
      },
      dialogShow: false,
      inputValue: ''
    }, () => {
      this.getData()
    })
  },

  onCommitCheckClick(e) {
    const shops = wx.getStorageSync('currentShops').list
    const user = wx.getStorageSync('crmUser')
    const that = this
    const arr = []
    for(let item in that.data.checkedObj) {
      const obj = that.data.checkedObj[item]
      if(obj.newPrice > 0)
      arr.push({
        goodsId: obj.id,
        price: obj.newPrice,
        // historyPrice: 0      // TODO: 后端未给出历史价格, 2019.03.04 后端自己处理, 前端无需传递
      })
    }
    // 验证有可提交数据
    if(arr.length < 1) {
      wx.showToast({
        title: '请选中商品并修改价格',
        icon: 'none',
        mask: true,
      })
      return;
    }

    newPost({
      url: 'dealer/goods/modifySucPrice',
      data: {
        ...that.data.page,
        userIds: shops,
        loginUser: user.salesmanId,
        phone: user.phone,
        individualExtendPricList: arr
      },
      success: function(data) {
        wx.showModal({
          title: '成功',
          content: '提交成功,请等待审核',
          showCancel: false,
          success: () => {
            wx.reLaunch({
              url: '../index',
            })
          }
        })
      }
    })
  },

  // onCommitUpdateClick1() {
  //   const shops = wx.getStorageSync('currentShops').list
  //   const user = wx.getStorageSync('crmUser')
  //   const that = this
  //   const arr = []
  //   for (let item in that.data.checkedObj) {
  //     const obj = that.data.checkedObj[item]
  //     if (obj.newPrice > 0)
  //       arr.push({
  //         goodsId: obj.id,
  //         price: obj.newPrice,
  //         // historyPrice: 0      // TODO: 后端未给出历史价格, 2019.03.04 后端自己处理, 前端无需传递
  //       })
  //   }
  //   // 验证有可提交数据
  //   if (arr.length < 1) {
  //     wx.showToast({
  //       title: '请选中商品并修改价格',
  //       icon: 'none',
  //       mask: true,
  //     })
  //     return;
  //   }

  //   newPost({
  //     url: 'dealer/goods/modifySucPrice',
  //     data: {
  //       ...that.data.page,
  //       userIds: shops,
  //       loginUser: user.salesmanId,
  //       phone: user.phone,
  //       individualExtendPricList: arr
  //     },
  //     success: function (data) {
  //       wx.showToast({
  //         title: '修改改展示价格成功',
  //         icon: 'none',
  //         mask: true,
  //         success: () => {
  //           wx.reLaunch({
  //             url: '../index',
  //           })
  //         }
  //       })
  //     }
  //   })
  // },

  onCommitUpdateClick() {
    const shops = wx.getStorageSync('currentShops').list
    const user = wx.getStorageSync('crmUser')
    const that = this
    const arr = []
    for (let item in that.data.checkedObj) {
      const obj = that.data.checkedObj[item]
      if (obj.newPrice > 0)
        arr.push({
          goodsId: obj.id,
          price: obj.newPrice,
        })
    }
    // 验证有可提交数据
    if (arr.length < 1) {
      wx.showToast({
        title: '请选中商品并修改价格',
        icon: 'none',
        mask: true,
      })
      return;
    }

    newPost({
      url: 'dealer/goods/modifySucPrice',
      data: {
        ...that.data.page,
        userIds: shops,
        loginUser: user.salesmanId,
        phone: user.phone,
        individualExtendPricList: arr
      },
      success: function (data) {
        wx.showModal({
          title: '成功',
          content: '修改展示价格成功',
          showCancel: false,
          success: () => {
            wx.reLaunch({
              url: '../index',
            })
          }
        })
        // wx.showToast({
        //   title: '修改展示价格成功',
        //   icon: 'none',
        //   mask: true,
        //   success: () => {
        //     wx.reLaunch({
        //       url: '../index',
        //     })
        //   }
        // })
      }
    })
  },

  /**
   * 点击弹窗的问号, 跳转到价格说明
   */
  onQuestionTap(e) {
    wx.navigateTo({
      url: '../priceInfo/index',
    })
  },

  /**
   * 点击每行的改价按钮
   */
  showPriceDialog(e) {
    const {item} = e.currentTarget.dataset
    this.setData({
      dialogData: item,
      dialogShow: true,
      inputValue: ''
    })
  },

  onCloseDialog(e) {
    console.log('onCloseDialog')
    this.setData({
      dialogShow: false,
    })
  },

  /**
   * 弹窗点击取消按钮
   */
  dialogCancle(e) {
    this.setData({
      dialogShow: false,
      inputValue: ''
    })
  },

  /**
   * 弹窗点击确定按钮
   */
  dialogYes(e) {
    const reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^[1-9]$)|(^\d\.[1-9]{1,2}$)|(^\d\.[0]{1}[1-9]{1}$|(^\d\.[1-9]{1}[0]{1}$)$)/;

    if (!reg.exec(this.testPrice - 0)) {
      wx.showToast({
        title: '请输入有效的金额',
        icon: 'none',
        mask: true,
      })
      return;
    }

    const data = this.data.dialogData
    const obj = {
      ...this.data.checkedObj,
    }

    obj[data.id] = {
      ...data,
      newPrice: this.testPrice
    }

    this.setData({
      checkedObj: obj,
      dialogShow: false,
      inputValue: '',
      dialogData: {
        price: 0,
        unit: ''
      },
    }, () => {
      this.testPrice = 0
      console.log(this.data.checkedObj)
    })
  },

  testPrice: 0,

  /**
   * 弹窗中的输入框输入
   */
  onDialogInput(e) {
    const value = e.detail.value
    this.testPrice = value - 0
    this.setData({
      inputValue: value
    })
  },

  /**
     * scroll-view 滚动到底触发
     */
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