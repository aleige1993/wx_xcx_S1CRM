// components/typeRule.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData: {
      type: Array,
      value: []
    },
    typeIndex: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isChooseAll: false,
    checkValue: [],
    chosedArry: [],//选中得对象，回选得时候会用到
    checkedName: "",//选中值name
  },

  /**
   * 组件的方法列表
   */
  attached(){
    this.setCheckData();
  },
  methods: {
    /**
 * 初始化选中列表
 */
    setCheckData() {
      let listData = this.data.listData;
      let currentIndex = this.data.typeIndex;
      let chosedIndex = app.globalData.typeIndex;
      let  checkData = app.globalData.typeCheckArr || [];
    if(chosedIndex && checkData.length>0){
      if(chosedIndex == currentIndex){
        //缓存中得type值等于当前选中得type值才会有回传值选中
        let chosedValue = [];
        let data = [];
        listData.forEach(function (item, index) {
          if (checkData.length == chosedValue.length) {
            return;
          }
          let labelId = item.id;
          checkData.forEach(function (checkedItem) {
            if (labelId == checkedItem.id) {
              let itemData = {
                id: item.id,
                name: item.name,
                companyName: item.companyName,
                checked: true
              }
              listData.splice(index, 1, itemData);
              chosedValue.push(labelId);
            }
          })

        });
        this.setData({ listData: listData });
        this.setCheckValue(chosedValue);
      }
    }

     
    },
    // 给checkbox赋值
    setCheckValue(chosedValue) {
      this.setData({ checkValue: chosedValue });
    },
    getCheckValue(e) {
      //获取checkbox值
      this.setData({ checkValue: e.detail.value });
    },
    chooseAll() {

      this.setData({ isChooseAll: !this.data.isChooseAll });
      this.checkAll();
    },
    // 全选或取消全选
    checkAll() {
      //全选设置checkValue的值
      if (this.data.isChooseAll) {
        //全选
        let checkValue = [];
        let listData = this.data.listData;
        listData.forEach(function (item) {
          let labelId = item.id;
          checkValue.push(labelId);
        })
        this.setData({ checkValue: checkValue, chosedArry: listData });
      } else {
        //取消全选
        this.setData({ checkValue: [], chosedArry: [] });

      }

    },
    sureSearch() {
      let chosedInfo = this.getChecked();
      this.triggerEvent('getChosedData', { belongIds: this.data.checkValue.join(','), belongIdsName: chosedInfo.checkedName.join(','), belongType: this.data.typeIndex })
      this.setGlobelCheck(chosedInfo.chosedArr);
    },
    setGlobelCheck(chosedArr) {

      app.globalData.typeCheckArr = chosedArr;
      app.globalData.typeIndex = this.data.typeIndex;

    },
    //获得选中的对象用于获取name
    getChecked() {
      let checkedValue = this.data.checkValue;
      let listData = this.data.listData;
      let chosedArr = [];
      let checkedName = [];
      listData.forEach(function (item, index) {
        if (chosedArr.length == checkedValue.length) {
          return;
        }
        let labelId = item.id;
        checkedValue.forEach(function (checkedId) {
          if (labelId == checkedId) {
            chosedArr.push(item);
            checkedName.push(item.name);
          }
        })
      });
      return { chosedArr: chosedArr, checkedName: checkedName };
    }
  }
})
