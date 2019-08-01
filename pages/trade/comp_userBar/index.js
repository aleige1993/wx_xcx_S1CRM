// pages/trade/userBar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeKey: {
      type: "String",
      value: 'basic'
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
    changeTabbar(e) {
      console.log('changeBar', e)
      let index = e.detail.key;
      switch (index) {
        case 'basic':
          wx.redirectTo({
            url: '../basicInfo/index',
          });
          break;
        case 'bill':
          wx.redirectTo({
            url: '../billRecord/index',
          });
          break;
        case 'credit':
          {
            wx.redirectTo({
              url: '../creditRecord/index',
            });
          }
          break;
        case 'order':
          wx.redirectTo({
            url: '../orderRecord/index',
          });
          break;
      }
    }
  }
})