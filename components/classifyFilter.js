// components/classifyFilter.js
import request from '../utils/http.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    brandId:{
      type:String,
      value:""
    },
    categoryCodes:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    classifyData:[],
    

  },
  created:function(){
    this.getData();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getData(){
      request({
        url:"data.queryCategory",
        data:{
          brandId:this.data.brandId
        },
        success:(res)=>{
          this.setData({classifyData:res.body||[]});
        }

      })
    },
    /**
     * 选择
     */
    radioChange(e){
      let code = e.detail.value;
      let name = e.currentTarget.dataset.name;
      this.triggerEvent('changeCategoryCodes', {code:code,name:name});
      this.closeCatogory();

     

    },
    /**
     * 关闭分类
     */
    closeCatogory(){
      this.triggerEvent('closeCatogory');
    }
  }
})
