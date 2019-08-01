// components/commonTabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeKey:{
      type:"String",
      value:'today'
    }
  },

  lifetimes: {
    attached() {
      const that = this
      // 在组件实例进入页面节点树时执行
      wx.getStorage({
        key: 'crmUser',
        success: function(res) {
          if(res.data) {
            const role = res.data.userPrivilege.split(',')
            if (role.includes('157')) {
              that.setData({
                hasPrice: true
              })
            }
          }
        },
      })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    hasPrice: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeTabbar(e){
      let index = e.detail.key;
      switch(index){
        case 'today':wx.redirectTo({
          url: '../today/index',
        });
        break;
        case 'history': wx.redirectTo({
          url: '../history/index',
        });
          break;
        case 'modifyMoney':{
         
          wx.redirectTo({

            url: '../modifyPrice/index',
          });
        } 
          break;
        case 'trade': wx.redirectTo({
          url: '../trade/index',
        });
          break;
        case 'mine': wx.redirectTo({
          url: '../mine/index',
        });
          break;
      }
    }
  }
})
