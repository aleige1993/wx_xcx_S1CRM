// pages/trade/user/data/index.js
import { oldPost } from '../../../../utils/http.js'
import {
  $wuxCalendar,
  $wuxSelect
} from '../../../../ui-plugins/wux/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      isTrade: [],
      registerEndTime: '',
      salesmanName: '',
      phone: '',
      company: '',
      tradeNumBegin: '',
      registerBeginTime: '',
      linkName: '',
      tradeNumEnd: '',
      type: 10,
      systemLabelIds: '',
      userLabelIds: '',
    },
    time: '',
    customerList: [],     // TODO 自定义标签, 没数据, 暂时不做
    labelSelectedList: [],
    systemLabelStr: ''
  },

  tradeNumBegin: 0,
  tradeNumEnd: 0,
  isTrade: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.form) {
      const form = JSON.parse(options.form)
      this.setData({
        form: {
          ...this.data.form,
          ...form
        },
        time: '',
        labelSelectedList: [],  // 清空, 传值跳转不选中, 否则标签更新无法映射   form.userLabelIds.split(',')
      })
    }
  },

  onChange(e) {
    const {value} = e.detail
    const {field} = e.currentTarget.dataset
    this.setData({
      form: {
        ...this.data.form,
        [field]: value
      }
    })
  },

  openCalendar(e) {
    $wuxCalendar().open({
      value: this.data.time,
      multiple: 2,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)
        this.setData({
          time: displayValues,
        })
      }
    })
  },

  getLabelData(succ) {
    const that = this
    oldPost({
      url: 'user.labelList',
      data: {
        type: 1     // TODO 抓取的固定值, 不知道其他枚举的含义
      },
      success: function(data) {
        const arr = data.body
        const res = []
        for(let item of arr) {
          res.push({
            value: item.labelId+'',
            title: item.labelName
          })
        }
        succ && succ(res)
      }
    })
  },

  /**
   * 是否交易多选
   */
  onCheckboxChange(e) {
    const {
      value
    } = e.detail

    const data = this.data.form.isTrade
    const index = data.indexOf(value)
    const current = index === -1 ? [...data, value] : data.filter((n) => n !== value)
    const form = this.data.form

    this.setData({
      form: {
        ...form,
        isTrade: current
      }
    })
  },

  /**
   * 系统标签的点击事件
   */
  onLabelClick(e){
    const that = this
    // TODO 不严谨, 如果在第一次查询后标签数据发生变动
    // 已选中的标签被删除数据, 那么将导致查询无结果
    this.getLabelData((res) => {
      $wuxSelect('#wux-select').open({
        value: that.data.labelSelectedList,
        titles: that.data.systemLabelStr,
        multiple: true,
        toolbar: {
          title: '请选择',
          confirmText: '确定',
          allText: '全选'
        },
        options: res,
        onConfirm: (value, index, options, titles) => {
          console.log('onConfirm', value, index, options, titles)
          that.setData({
            labelSelectedList: value,
            systemLabelStr: titles
          })
        }
      })
    })
  },

  onNumChange(e){
    console.log(e)
    const {value} = e.detail
    const {str} = e.currentTarget.dataset
    this[str] = value
  },

  /**
   * 筛选按钮点击
   */
  getConditionClick(e) {
    const timeArr = this.data.time
    if(this.tradeNumBegin > this.tradeNumEnd){
      wx.showToast({
        title: '交易开始次数不能大于结束次数',
        icon: 'none',
      })
      return
    }
    let obj = this.data.form

    if (obj.phone && !(/^1[34578]\d{9}$/.test(obj.phone))) {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon: 'none'
      })

      return
    }

    // 处理注册时间
    if (timeArr.length > 0) {
      if (timeArr.length < 2) {
        wx.showToast({
          title: '必须是有效的时间范围',
          icon: 'none'
        })
        return
      }
      const begin = new Date(timeArr[0])
      const end = new Date(timeArr[1])

      if(begin > end) {
        wx.showToast({
          title: '注册开始时间不能大于结束时间',
          icon: 'none'
        })
        return
      }

      obj.registerBeginTime = timeArr[0]
      obj.registerEndTime = timeArr[1]
    }
    


    // 是否交易的数据处理
    if(obj.isTrade) {
      if (obj.isTrade.length == 2 || obj.isTrade.length == 0) {
        delete obj.isTrade  // 全选或全不选, 则无此字段
      } else {
        obj.isTrade = obj.isTrade[0]  // 单选为单选值
      }
    }

    // 处理交易次数 非0
    obj.tradeNumBegin = this.tradeNumBegin ? this.tradeNumBegin : ''
    obj.tradeNumEnd = this.tradeNumEnd ? this.tradeNumEnd : ''

    obj.systemLabelIds = this.data.labelSelectedList.join(',')
    console.log(obj)
    wx.redirectTo({
      url: `../index?form=${JSON.stringify(obj)}`,
    })
  }
})