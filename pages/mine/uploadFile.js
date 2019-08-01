// pages/mine/uploadFile.js
import {
  postFile,
  newPost
} from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "idcardPath": "", //身份证图片路径
    "storePath": "", //门店图片路径
    "licencePath": "", //营业执照路径
    idcardPathTemp: '',
    licencePathTemp:'',
    storePathTemp: '',
    idcardReason: '',
    "storeInfo": {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let info = JSON.parse(options.storeInfo);
    console.log(info)
    this.setData({
      storeInfo: info,
      idcardPathTemp: info.idcardPath,
      licencePathTemp: info.licencePath,
      storePathTemp: info.storePath,
      idcardReason: info.idcardReason,
      licenceReason: info.licenceReason,
      storeReason: info.storeReason
    });
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
  uploadFile(e) {
    let type = e.currentTarget.dataset.type;
    this.getImgTempPath(type);
  },
  /**
   * 获取临时地址
   */
  getImgTempPath(type) {
    let me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths[0];
        // const tempFile = res.tempFiles[0]
        // me.getImgPath(tempFilePaths, type)
        postFile({
          data: {
            filePath: tempFilePaths,
            formData: {
              pathName: type
            },
            success: function(data) {
              me.setPath(tempFilePaths, data.path, type);
            }
          }
        })

      },
    })
  },
  /**
   * 获取本地地址
   */
  // getImgPath(tempPath, type) {
  //   let me = this;
  //   wx.getImageInfo({
  //     src: tempPath,
  //     success: function(res) {
  //       let path = res.path;
  //       me.setPath(tempPath, path, type);
  //     },
  //   })
  // },
  setPath(tempPath, path, type) {
    switch (type) {
      case 'idCard':
        {
          this.setData({
            idcardPath: path,
            idcardPathTemp: tempPath,
            idcardReason: ''
          })
        };
        break;
      case 'licence':
        {
          this.setData({
            licencePath: path,
            licencePathTemp: tempPath,
            licenceReason: ''
          })
        };
        break;
      case 'store':
        {
          this.setData({
            storePath: path,
            storePathTemp: tempPath,
            storeReason: ''
          })
        };
        break;
    }
  },
  submitCheck() {
    // wx.navigateTo({
    //   url: './uploadComplete',
    // })

    let data = this.data;
    if(data.idcardReason || data.licenceReason || data.storeReason) {
      wx.showToast({
        title: '含有未合规的图片',
        icon: 'none',
        mask: true
      })
      return
    }

    if (!data.idcardPath) {
      wx.showToast({
        title: '请上传身份证照片',
        icon: 'none',
        mask: true
      })
      return
    }
    if (!data.licencePath) {
      wx.showToast({
        title: '请上传营业执照照片',
        icon: 'none',
        mask: true
      })
      return
    }
    if (!data.storePath) {
      wx.showToast({
        title: '请上传门店照片',
        icon: 'none',
        mask: true
      })
      return
    }
    const params = {
      userId: data.storeInfo.id,
      company: data.storeInfo.company,
      linkName: data.storeInfo.linkName,
      idcardPath: data.idcardPath,
      storePath: data.licencePath,
      licencePath: data.storePath,
      areaCode: data.storeInfo.areaCode,
      address: data.storeInfo.address
    }

    console.log(params)
    newPost({
      url: 'carsmall/dealer/user/merchantDataSubmit',
      data: params,
      success: function(data) {
        wx.redirectTo({
          url: './success/index',
        })
      }
    })
  }
})