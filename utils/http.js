// 把所有 import 放在顶部
import Base64 from './base64.js';

/**
 * 先定义常量
 *  */
const MD5 = require("./md5.js");

// 开发环境
// const oldHttpUrl = "http://sit.crm.songchejr.com/";
// // const newHttpUrl = "http://192.168.200.247:11000/"
// const newHttpUrl = "http://192.168.201.90:11000/" // 杨松
// const uploadUrl = oldHttpUrl
// const qrcodeUrl = 'http://s1_appport_pre.songcw.com/'
// const oldUrlFlag = 'appRequest/dispatch'
// const oldHttpUrl = "http://192.168.200.129:8090/";

// 测试环境
// const oldHttpUrl = "http://sit.crm.songchejr.com/";
// const newHttpUrl = 'http://sit.carsmall.songchejr.com/'
// const uploadUrl = oldHttpUrl
// const qrcodeUrl = 'http://sit.appport.songchejr.com/'
// const oldUrlFlag = 'appRequest/dispatch'

// 预发布环境
// const oldHttpUrl = "http://s1_crmalter_pre.songcw.com/";
// const newHttpUrl = "http://pre.carsmallapi.songcw.com/"
// const uploadUrl = oldHttpUrl
// const qrcodeUrl = 'http://s1_appport_pre.songcw.com/'
// const oldUrlFlag = 'appRequest/dispatch'

// 线上环境
const oldHttpUrl = "https://crmalter.s1one.com/";
const newHttpUrl = "https://carsmallapi.s1one.com/"
const uploadUrl = oldHttpUrl
const qrcodeUrl = 'https://appport.s1one.com/'
const oldUrlFlag = 'appRequest/dispatch'

const appkey = '102';
const newUrlFlag = 'dealer/'

/**
 * 再定义变量
 * 
 */
/**
 * 当前正在执行的请求总数
 * 发请求时增加
 * 结束后减少
 * 避免重复调用 显示/隐藏 loading
 */
let requestTotal = 0;

const getSign = (data) => {
  let API_SECURITY_KEY = "EaJb23gH";
  let str = JSON.stringify(data) + API_SECURITY_KEY;
  let sign = MD5(str);
  let signStr = Base64.encode(sign);
  return signStr;
}
const getParamsObj = (obj) => {
  let token = wx.getStorageSync('crmToken') || '';
  let params = {};
  if (token) {
    params = {
      "body": obj.data,
      "header": {
        "appkey": appkey,
        "method": obj.url,
        token: token
      }
    };
    if (obj.page) {
      params.page = obj.page;
    }

  } else {
    //未登录的时候不用传token
    params = {
      "body": obj.data,
      "header": {
        "appkey": appkey,
        "method": obj.url
      }
    };
  }
  return params;
}

/**
 * 构造url字符串
 */
const prepareUrl = (url, params) => {
  // if(url.startsWith('http://')) {
  //   return url
  // }
  // 当前都是老接口, 还未有可区分的字段
  const isNewUrl = url.startsWith(newUrlFlag)
  const signUrl = getSign(params);
  let address = oldUrlFlag
  if (isNewUrl) {
    return `${newHttpUrl}${url}?sign=${signUrl}`
  }
  return `${oldHttpUrl}${address}?sign=${signUrl}`
}

/**
 * 传递参数格式
   obj: {
      data:{},
      url:'路径'
    }
 */
 const request = function(obj = {}) {

  if (obj.constructor != Object) {
    console.log('requestError', '非法的请求参数')
  }
  const {
    url
  } = obj;
  if (!url || typeof url != "string") {
    console.log('urlError', '非法的请求地址')
    return;
  }

  //const func = function (resolve, reject) {
  const params = getParamsObj(obj);

  if (requestTotal === 0) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  requestTotal++;

  wx.request({
    url: prepareUrl(url, params),
    data: params || {},
    method: obj.method || "post",
    dataType: obj.dataType || "json",
    responseType: obj.responseType || "text",
    success: function(res) {
      requestTotal--;
      if (requestTotal === 0) {
        wx.hideLoading()
      }
      let header = res && res.data && res.data.header||{};
      if (res.statusCode === 200) {
        if (header.code === 100) {
          // 通常成功回调只使用 body中的数据, 需要的时候在接收第二个参数
          obj.success && obj.success(res.data);
        }else if(header.code == 106){
          //token失效
          wx.removeStorageSync('crmToken');
          wx.removeStorageSync('crmUser');
         
          }else{
          wx.hideLoading()
          wx.showToast({
            title: header.msg||'网络错误,请检查网络',
            icon: 'none',
            duration: 3000
          })
        }
      }
      // TODO 错误的状态码处理
    },
    fail: function(res) {

      // wx.showToast({
      //   title: res.data,
      //   icon: 'none',
      //   duration: 2000
      // })
      requestTotal--;
      if (requestTotal === 0) {
        wx.hideLoading()
      }
      console.log(`${url} fail`, res)
      if (obj.fail) {
        obj.fail && obj.fail(res.msg);
        return
      }
      

      console.log(res)

    },
    complete: function(res) {
      
      obj.complete && obj.complete()
    }

  })
  //}
  // return new Promise(func
  // )
}

const oldPost = function(obj = {}) {

  if (obj.constructor != Object) {
    console.log('requestError', '非法的请求参数')
  }
  const {
    url
  } = obj;
  if (!url || typeof url != "string") {
    console.log('urlError', '非法的请求地址')
    return;
  }

  const params = getParamsObj(obj);
  const signUrl = getSign(params);

  if (requestTotal === 0) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  requestTotal++;

  console.log(`:airplane: old ${url}`, params)

  wx.request({
    url: `${oldHttpUrl}${oldUrlFlag}?sign=${signUrl}`,
    data: params || {},
    method: obj.method || "post",
    dataType: obj.dataType || "json",
    responseType: obj.responseType || "text",
    success: function(res) {
      requestTotal--;
      if (requestTotal === 0) {
        wx.hideLoading()
      }
      console.log(`${url} success`, res)
      let header = res && res.data && res.data.header || {};
      if (res.statusCode === 200) {
        if (header.code === 100) {
          // 通常成功回调只使用 body中的数据, 需要的时候在接收第二个参数
          obj.success && obj.success(res.data);
        } else if (header.code == 106) {
          //token失效
          wx.removeStorageSync('crmToken');
          wx.removeStorageSync('crmUser');

        } else {
          wx.showToast({
            title: header.msg || '网络错误,请检查网络',
            icon: 'none',
            duration: 2000
          })
        }
      }
      // TODO 错误的状态码处理
    },
    fail: function(res) {

      // wx.showToast({
      //   title: res.data,
      //   icon: 'none',
      //   duration: 2000
      // })
      requestTotal--;
      if (requestTotal === 0) {
        wx.hideLoading()
      }
      console.log(`${url} fail`, res)
      if (obj.fail) {
        obj.fail && obj.fail(res.msg);
        return
      }

      console.log(res)

    },
    complete: function(res) {
      obj.complete && obj.complete()
    }

  })
  //}
  // return new Promise(func
  // )
}

const newPost = function(obj = {}) {

  if (obj.constructor != Object) {
    console.log('requestError', '非法的请求参数')
  }
  const {
    url
  } = obj;
  if (!url || typeof url != "string") {
    console.log('urlError', '非法的请求地址')
    return;
  }

  const params = getParamsObj(obj);
  const signUrl = getSign(params);

  if (requestTotal === 0) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  requestTotal++;
  console.log(`:airplane: new ${url}`, params)
  wx.request({
    url: `${newHttpUrl}${url}?sign=${signUrl}`,
    data: params || {},
    method: obj.method || "post",
    dataType: obj.dataType || "json",
    responseType: obj.responseType || "text",
    success: function(res) {
      requestTotal--;
      if (requestTotal === 0) {
        wx.hideLoading()
      }
      console.log(`${url} success`, res)
      let header = res && res.data && res.data.header || {};
      if (res.statusCode === 200) {
        if (header.code === 100) {
          // 通常成功回调只使用 body中的数据, 需要的时候在接收第二个参数
          obj.success && obj.success(res.data);
        } else if (header.code == 106) {
          //token失效
          wx.removeStorageSync('crmToken');
          wx.removeStorageSync('crmUser');

        } else {
          wx.showToast({
            title: header.msg || '网络错误,请检查网络',
            icon: 'none',
            duration: 2000
          }, 1000)
         
        }
      }
      // TODO 错误的状态码处理
    },
    fail: function(res) {

      // wx.showToast({
      //   title: res.data,
      //   icon: 'none',
      //   duration: 2000
      // })
      requestTotal--;
      if (requestTotal === 0) {
        wx.hideLoading()
      }
      console.log(`${url} fail`, res)
      if (obj.fail) {
        obj.fail && obj.fail(res.msg);
        return
      }

      console.log(res)

    },
    complete: function(res) {
      obj.complete && obj.complete()
    }

  })
}

const postFile = function(obj = {}) {
  wx.showLoading({
    title: '正在上传...',
    mask: true
  })

  const dataObj = obj.data
  wx.uploadFile({
    url: `${uploadUrl}upload`,
    name: 'file',
    ...dataObj,
    success: function (data) {
      console.log(data)
      const res = JSON.parse(data.data)
      if (res.header.code == 100) {
        dataObj.success && dataObj.success(res.body)
      }
    },
    complete: function () {
      wx.hideLoading()
    }
  })
}
export default request;
export {
  qrcodeUrl,
  newHttpUrl,
  oldPost,
  newPost,
  postFile
}