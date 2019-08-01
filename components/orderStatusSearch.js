// components/orderStatusSearch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showSearchBool:{
      type:Boolean,
      value:false
    },
    statusStr: {
      type: String,
      value: '',
      observer: function(str){
        console.log('1111', str)
        let arr = this.data.array
        const array = arr.map((item) => {
          if(str.indexOf(item.status) > -1) {
            item.isChoose = true
          }else {
            item.isChoose = false
          }
          return item
        })
        this.setData({
          array,
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    array:[
      {
        status:1,
        text:'已支付',
        isChoose:true
      },
      {
        status: 2,
        text: '已发货',
        isChoose: true
      },
      {
        status: 3,
        text: '已完成',
        isChoose: true
      },
      {
        status: 6,
        text: '退款成功',
        isChoose: true
      },
    ],
    chooseStatus:[1,2,3,6]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideSearch(status) {
      // this.triggerEvent('changeStatus', { status: false,statusCode:status });
      this.setData({
        showSearchBool: false
      })
    },
    chooseItem(e){
      let data = e.currentTarget.dataset;
      let index = data.index;
      let isChoose = data.item.isChoose;
      let item = 'array['+index+'].isChoose';
        this.setData({[item]:!isChoose});
    },
    searchOrder(){
      //订单搜索
      let data = this.data.array;
      let choose = [];
      data.forEach((item,index)=>{
        if(item.isChoose){
          choose.push(item.status);
        }
      });
      console.log(choose.join(','));
      this.triggerEvent('changeStatus', { status: false, statusCode: choose.join(',') });
    }
  }
})
