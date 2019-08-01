// pages/user/systemTag.js
import request from '../../utils/http.js';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:"",//1系统0自定义
    checkValue:[],
    isChooseAll:false,
    listData:[],
    chosedArry :[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({tag:options.tag});
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
 
  getCheckValue(e){
    //获取checkbox值

    this.setData({ checkValue:e.detail.value});
  },
  chooseAll() {
  
    this.setData({isChooseAll:!this.data.isChooseAll});
    this.checkAll();
  },
  //重置listData的checked
  resetListData(){
    let listData = this.data.listData;
    listData.forEach(function(item,index){
      if(item.checked){
        listData.splice(index,1,{labelId:item.labelId,labelName:item.labelName});
      }
    });
    this.setData({listData:listData});
  },
  // 全选或取消全选
  checkAll(){
    //全选设置checkValue的值
    if(this.data.isChooseAll){
      //全选
      let checkValue = [];
      let listData = this.data.listData;
      listData.forEach(function (item) {
        let labelId = item.labelId;
        checkValue.push(labelId);
      })
      this.setData({ checkValue: checkValue, chosedArry: listData});
    }else{
      //取消全选
      this.setData({ checkValue: [], chosedArry:[]});

    }
    
  },
  getData(){
    let type = this.data.tag;
   request({
     data:{type:type},
     url:"user.labelList",
     success:(res)=>{
            let listData = res.body||{};
            this.setData({listData:listData});
            this.setCheckData();
        }
     
   })
  },
  /**
   * 初始化选中列表
   */
setCheckData(){
  let listData = this.data.listData;
  let tag = this.data.tag;
  let checkData=[];
  if (tag == '1') {
    checkData = app.globalData.systemCheckArr||[];
  } else if (tag == '0') {
   checkData = app.globalData.userCheckArr ||[];
  }

  let chosedValue = [];
  let data=[];
  listData.forEach(function (item, index) {
    if (checkData.length == chosedValue.length) {
      return;
    }
    let labelId = item.labelId;
    checkData.forEach(function (checkedItem) {
      if (labelId == checkedItem.labelId) {
        let itemData = {
          labelId:item.labelId,
          labelName:item.labelName,
          checked:true
        }
        listData.splice(index,1,itemData);
        chosedValue.push(labelId);
      }
    })
    
  });
  this.setData({listData:listData});
  this.setCheckValue(chosedValue);
},
// 给checkbox赋值
  setCheckValue(chosedValue){
    this.setData({ checkValue: chosedValue});
},
  sureSearch(){
    let chosedInfo = this.getChecked();
    let pages = getCurrentPages();//当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    let tag = this.data.tag;
    let params = {};
    if(tag == '1'){
      //系统
      params.systemLabelIds = this.data.checkValue.join(',');
      params.systemLabelNames = chosedInfo.checkedName.join(',');

    }else if(tag == '0'){
      params.userLabelIds = this.data.checkValue.join(',');
      params.userLabelNames = chosedInfo.checkedName.join(',');
    }
    prevPage.setData(params);
    this.setGlobelCheck(chosedInfo.chosedArr);
    wx.navigateBack({
      delta:1
    })
  },
  setGlobelCheck(chosedArr){
    let tag = this.data.tag;
    if(tag == '1'){
      app.globalData.systemCheckArr = chosedArr;
    }else if(tag == '0'){
      app.globalData.userCheckArr = chosedArr;
    }
  
  },
  //获得选中的对象用于获取name
  getChecked(){
    let checkedValue = this.data.checkValue;
    let listData  = this.data.listData;
    let chosedArr = [];
    let checkedName = [];
    listData.forEach(function(item,index){
      if (chosedArr.length == checkedValue.length){
        return;
      }
      let labelId = item.labelId;
      checkedValue.forEach(function(checkedId){
        if(labelId == checkedId){
          chosedArr.push(item);
          checkedName.push(item.labelName);
        }
      })
    });
    return {chosedArr:chosedArr,checkedName:checkedName};
  }
})