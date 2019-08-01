// components/page.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageIndex:{
      type:Number,
      value:1
    },
    pageCount:{
      type:Number,
      value:0
    },
    pageSize:{
      type:Number,
      value:10
    },
    dataList:{
      type:Array,
      value:[]
    },
    total:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
