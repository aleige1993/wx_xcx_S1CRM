// pages/mine/merchantData.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaCode: "0",//地区编码用,分隔
    areaCodeName: "",
    company:"",
    linkName:"",
    address:"",
    areaProvince: "110000", 
    areaCity: "110100", 
    areaCounty: "110101",      //20190313 只传递 areaCode
    phone: '',
    user: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = JSON.parse(options.user)
    console.log(user.linkName)
    if(user) {
      this.setData({
        user,
        company: user.company,
        linkName: user.linkName,
        phone: user.phone,
        areaCodeName: `${user.areaProvince || ''}${user.areaCity || ''}${user.areaCounty || ''}`,
        areaCode: user.areaCode,
        address: user.address,
      })
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
   * 输入框数据绑定
   */
  changeCompany(e){
    let input = e.detail.value;
    this.setData({company:input});
  },
  changeName(e){
    let input = e.detail.value;
    this.setData({ linkName: input });
  },
  // changePhone(e){
  //   let input = e.detail.value;
  //   this.setData({ phone: input });
  // },
  changeStreet(e){
    let input = e.detail.value;
    this.setData({ address: input });
  },
  goNext(){
    let data = this.data;

    if (!data.company) {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none',
        mask: true
      })
      return
    }

    if (!data.linkName) {
      wx.showToast({
        title: '请输入联系人姓名',
        icon: 'none',
        mask: true
      })
      return
    }

    // if (!data.phone) {
    //   wx.showToast({
    //     title: '请输入手机号码',
    //     icon: 'none',
    //     mask: true
    //   })
    //   return
    // }

    if (!data.areaCodeName) {
      wx.showToast({
        title: '请选择所在城市',
        icon: 'none',
        mask: true
      })
      return
    }

    if (!data.address) {
      wx.showToast({
        title: '请输入城市街道',
        icon: 'none',
        mask: true
      })
      return
    }

    let params = {
      ...data.user,
      // userId:data.userId,
      company: data.company,
      linkName: data.linkName,
      areaCode: data.areaCode,
      address: data.address,
      // areaProvince: data.areaProvince,
      // areaCity: data.areaCity,
      // areaCounty: data.areaCounty
    }
    console.log(params)
    wx.navigateTo({
      url: `./uploadFile?storeInfo=${JSON.stringify(params)}`,
    })
  },
  /**
   * 选择城市
   */
  chooseCity(){
    wx.navigateTo({
      url: '/pages/order/areaFilter',
    })
  }
})