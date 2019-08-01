// components/district.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    districtData:{
      type:Array,
      value:[]
    },
    provinceName:{
      type:String,
      value:""
    },
    cityName:{
      type:String,
      value:""
    },
    canAll: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isChooseAll:false,
    chosedDistrict:[],
    chosedDistrictName:[],
    radioCheck: null,
    radioCheckName: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 全选
     */
    chooseAll(){
      let status = this.data.isChooseAll;
      if(status){
        this.cancelChoseAllDistrict();
      }else{
        this.getChooseAllDistrict();
      }
      this.setData({isChooseAll:!status});
    },
    /**
     * 确定选择
     */
    sureChooseDistrict(){
      if(this.data.canAll) {
        let status = this.data.isChooseAll;
        if (!status) {
          this.getDistrictInfo();
        }
        this.returnBackChosedDistrict();
      } else {
        const data = this.data
        let name = ''
        data.districtData.forEach(function (item) {
          if(item.id == data.radioCheck) {
            name = data.provinceName + data.cityName + item.areaName;
          }
        });

        this.triggerEvent("getChosedDistrict", { chosedDistrictName: name, chosedDistrict: data.radioCheck });
      }
      
    },
    /**
     * 获取选中得区
     */
    getDistrictInfo(){
      let data = this.data;
      let chosedValue = data.chosedDistrict;
      let district = data.districtData;
      let districtName=[];
      district.forEach(function(districtItem,index){
        if(districtName.length == chosedValue.length){
          return ;
        }
        chosedValue.forEach(function(chooseItem,index){
          if(chooseItem == districtItem.id){
            let name = data.provinceName + data.cityName + districtItem.areaName;
            districtName.push(name);
          }
        })
      });
      this.setData({ chosedDistrictName:districtName});
    },
    /**
     * 回传选择得区
     */
    returnBackChosedDistrict(){
      let value = this.data.chosedDistrict;
      let name = this.data.chosedDistrictName;
      this.triggerEvent("getChosedDistrict", { chosedDistrictName: name, chosedDistrict:value});
    },
    /**
     * 获得全选id
     */
    getChooseAllDistrict(){
      let data = this.data;
      let district = data.districtData;
      let value = [];
      let name = [];
      district.forEach(function(item){
        let nameStr = data.provinceName + data.cityName + item.areaName;
        value.push(item.id);
        name.push(nameStr);
      });
      this.setData({chosedDistrict:value,chosedDistrictName:name});
    },
    cancelChoseAllDistrict(){
      this.setData({chosedDistrict:[],chosedDistrictName:[]});
    },
    /**
     * 选择checkbox
     */
    chooseCheckbox(e){
      let value = e.detail.value;
      this.setData({ chosedDistrict:value});
    },

    chooseRadio(e) {
      const value = e.detail.value
      
      this.setData({
        radioCheck: value
      })
    }
  }
})
