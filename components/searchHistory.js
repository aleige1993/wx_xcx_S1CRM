// components/searchHistory.js
let tools = require('../utils/Tools.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showSearchBool:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    arry:[
      {type:2,text:'本周'},
      { type: 4, text: '本月' },
      { type: 6, text: '本季度' },
      { type: 8, text: '本年' },
      { type: 1, text: '昨日' },
      { type: 3, text: '上周' },
      { type: 5, text: '上月' },
      { type: 7, text: '上季度' },
      { type: 9, text: '去年' },
    ],
    type:1,
    end: "",
    startDate: "",
    endDate: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initEndTime() {
      let newDate = new Date();
      let timeStamp = newDate.getTime();
      let date = tools.timestampToDate(timeStamp);
      this.setData({ end: date });
    },
    bindStartDateChange(e) {
      let endDate = this.data.endDate;
      if(endDate!=""){
        //判断选择的开始时间不能大于结束时间
        let result = tools.compareDate(e.detail.value,endDate);
       if(!result){
         wx.showToast({
           title: '开始时间不能大于结束时间',
           icon:'none'
         })
         return ;
       }
      }
      this.setData({ startDate: e.detail.value ,type:""});
    },
    bindEndDateChange(e) {
      let startDate = this.data.startDate;
      if (startDate != "") {
        //判断选择的开始时间不能大于结束时间
        let result = tools.compareDate(startDate, e.detail.value);
        if (!result) {
          wx.showToast({
            title: '结束时间不能小于开始时间',
            icon: 'none'
          })
          return;
        }
      }
      this.setData({ endDate: e.detail.value,type:"" });
    },
    chooseItem(event){
      let type = event.currentTarget.dataset.type;
      let text = event.currentTarget.dataset.text;
      this.setData({ type: type, startDate:"",endDate:""});
      this.triggerEvent('changeStatus', { status: false, type: this.data.type});
      wx.setNavigationBarTitle({
        title: "历史-"+text,
      })
      
    },
    hideSearch(){
      //点击阴影隐藏
      this.triggerEvent('changeStatus', { status: false});
    },
    searchTime() {
      //按时间搜索
      let data = this.data;
      if (data.startDate == "") {
        wx.showToast({
          title: '请选择开始时间',
          icon: "none"
        })
      }
      if (data.endDate == "") {
        wx.showToast({
          title: '请选择结束时间',
          icon: "none"
        })
      }
      this.triggerEvent('changeStatus', { status: false, type: 10, time:{ startDate: data.startDate, endDate: data.endDate } });
      wx.setNavigationBarTitle({
        title: "历史数据",
      })
    }
  }
})
