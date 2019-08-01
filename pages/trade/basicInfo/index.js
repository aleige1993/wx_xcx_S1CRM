// pages/trade/basicInfo/index.js
import { oldPost } from '../../../utils/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.userId) {
      this.setData({
        userId: options.userId
      }, () => {
        this.getData()
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    wx.getStorage({
      key: 'searchUser',
      success: function (res) {
        console.log(res)
        that.setData({user: res.data})
      },
      fail: function () {
        wx.navigateBack()
      }
    })
  },

  getData() {
    const userId = this.data.userId
    const that = this
    oldPost({
      url: 'user.getRegisterDetail',
      data: {
        userId
      },
      success: function(data) {
        const res = data.body
        let idcardStatusStr = '', userTypeStr = ''
        if (res.idcardStatus == 0) {
          idcardStatusStr = '未审核'
        } else if (res.idcardStatus == 1) {
          idcardStatusStr = '待审核'
        } else if (res.idcardStatus == 2) {
          idcardStatusStr = '已审核'
        } else if (res.idcardStatus == 2) {
          idcardStatusStr = '审核失败'
        }

        if (res.userType == 1) {
          userTypeStr = '个体经营'
        } else if (res.userType == 2) {
          userTypeStr = '企业用户'
        }

        res.idcardStatusStr = idcardStatusStr
        res.userTypeStr = userTypeStr
        that.setData({
          user: res
        })
      }
    })
  }
})