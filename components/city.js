// components/city.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    provinceName:{
      type:String,
      value:""
    },
    cityData:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    district: [],
    showDistrict: false,
    cityName: ""

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickCity(e){
      console.log(e)
      const cityName = e.currentTarget.dataset.cityname
      const id = e.currentTarget.dataset.id
      this.triggerEvent('clickCity', { cityName, id }, {})
    },
    showDistrict(){
      this.setData({showDistrict:true});
    },
    hideDistrict(){
      this.setData({showDistrict:false});
    },
    /**
     * 设置区组件参数
     */
    setDistrictComponetData(cityName,district){
      this.setData({
        district:district,
        cityName:cityName
      })
    },
    /**
 * 获得回传得区，并且关闭区选择返回上一页
 */
    getChosedDistrict(data) {
      this.hideDistrict();
      this.triggerEvent("getChosedDistrict",data.detail);
    },

  }
})
