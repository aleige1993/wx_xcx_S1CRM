var navigate = {
  navigatePage: function (e, params, extra) {
    var type = e.currentTarget.dataset.type;
    switch (type) {
      case 'order': wx.navigateTo({
        url: '../order/order?orderParams=' + JSON.stringify(params),
      });
        break;
      case 'user': wx.navigateTo({
        url: `../user/registerUser?orderParams=${JSON.stringify(params)}&extra=${JSON.stringify(extra)}`,
      });
        break;
      // 时间字段为tradeBeginTime,TradeEndTime
      // case 'tradeUser': {
      //   let paramsObj={
      //     type:params.type,
      //     tradeBeginTime:params.beginTime,
      //     tradeEndTime:params.endTime
      //   }
      //   wx.navigateTo({
      //     url: '../user/tradeUser?orderParams=' + JSON.stringify(paramsObj),
      //   })
      // }; break;
      case 'addTradeUser': {
        let paramsObj = {
          type: params.type,
          tradeBeginTime: params.beginTime,
          tradeEndTime: params.endTime
        }
        wx.navigateTo({
          url: '../user/addTradeUser?orderParams=' + JSON.stringify(paramsObj),
        });
      } break;
      case 'orderSearch': {
        var status = e.currentTarget.dataset.status
        let paramsObj = {
          ...params,
          status,
        }
        wx.navigateTo({
          url: '../order/orderSearch?orderParams=' + JSON.stringify(paramsObj),
        })
      }
      break
    }
  }
}
export default navigate;