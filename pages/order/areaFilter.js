// pages/order/areaFilter.js
import {newPost} from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr:[],
    city:[],
    areaCode: 0,
    showCity:false,
    showDistrict: false,
    cityName: '',
    provinceName:"",
    district: []    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData('province');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 获取省市区数据
   */
  getData(cat, callback){
    const that = this
    newPost({
      url:"carsmall/dealer/area/querychildren",
      data:{
        parentId: that.data.areaCode
      },
      success:(res)=>{
        if(cat == 'province') {
          that.setData({ dataArr: JSON.parse(res.body) || [] });
        } else if(cat == 'city') {
          that.setData({ city: JSON.parse(res.body) || [] });
        } else if (cat == 'district') {
          that.setData({ district: JSON.parse(res.body) || [] });
        }

        callback && callback()
      }

    })
  },
  /**
   * 点击省
   */
  clickProvince(e){
    let id = e.currentTarget.dataset.id;
    let provinceName = e.currentTarget.dataset.provincename;
    this.setData({
      areaCode: id,
      provinceName: provinceName
    }, () => {
      this.getData('city', () => {
        this.showCity()
      })
    })
    
  },
  /**
   * 设置district数据
   */
  setDistrictData(e){
    let dataset = e.currentTarget.dataset;
    let district = dataset.district;
    let provinceName = dataset.provincename;
    let cityName = dataset.cityname;
    this.setData({ district: district, provinceName:provinceName,cityName:cityName});
    this.showDistrict();
  },
  /**
   * 设置传递给city组件得数据
   */
  setCityComponentData(city,provinceName){
    this.setData({
      city:city,
      provinceName:provinceName
    })
  },
  /**
   * 显示city
   */
  showCity(){
    this.setData({showCity:true});
  },
  hideCity(){
    this.setData({ showCity:false});
  },
  /**
   * 获得回传得区，并且关闭区选择返回上一页
   */
  getChosedDistrict(data){
    console.log(data)
    this.hideCity();
    this.backPrePage(data.detail);
  },

  clickCity(e, detail, options) {
    const cityName = e.detail.cityName;
    const id = e.detail.id
    this.setData({
      areaCode: id,
      cityName
    }, () => {
      this.getData('district', () => {
        this.showDistrict();
      })
    })
  },

  showDistrict() {
    this.setData({ showDistrict: true });
  },
  hideDistrict() {
    this.setData({ showDistrict: false });
  },
  /**
   * 返回上一页
   */
  backPrePage(data){
    let pages = getCurrentPages();
    let prePage = pages[pages.length-2];
    prePage.setData({
      areaCode: data.chosedDistrict,
      areaCodeName: data.chosedDistrictName
    })
    wx.navigateBack({
      belta:1
    })
  }
})