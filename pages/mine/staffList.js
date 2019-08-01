// pages/staffList.js
import { newPost} from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: {
      pageIndex: 1,
      pageSize: 10,
    },
    pageData: {},
    userData: [],
    hasMore: true
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

  getData(callback) {
    //获取数据
    let data = this.data;
    let user = wx.getStorageSync('crmUser')
    let params = {
      dealerId: user.orgId,
      ...data.page
    }
    newPost(
      {
        url: "dealer/goods/searchUserEmployee",
        data: params,
        success: (res) => {
          let body = res && res.body || [];
          if(data.page.pageIndex ==1){
            this.setData({ userData: body });
          }else{
            this.setData({ userData: data.userData.concat(body)});
          }
          
          this.setData({ 
            pageData: res.page || {},
            hasMore: body.length > 9 ? true : false 
          });
          
        },
        complete: () => {
          callback && callback();
        }
      }
    )
  },
  onRefresh(e) {
    const instance = e.detail.instance
    this.setData({ 
      page: {
        pageIndex: 1,
        pageSize: 10
    } });
    this.getData(function () {
      instance.finishPullToRefresh()
    });
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