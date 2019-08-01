
let showToast = (title, icon = 'none') => {
  wx.showToast({
    title: title,
    icon: icon,
    duration: 2000
  })
}

let timestampToTime = (timestamp) => {
  let date = new Date(timestamp);
  let Y = date.getFullYear();
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
}
let timestampToDate=(timestamp)=>{
  let date = new Date(timestamp);
  let Y = date.getFullYear();
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return Y + '-' + M + '-' + D ;
}
let getObjectFirstArg = (object) => {
  let string = JSON.stringify(object);
  string = string.substring(1, string.length - 1);
  let argName = string.split(':')[0];
  return argName.substring(1, argName.length - 1);
}
let dateToTimeStamp=(date)=>{
  date = date.replace(/-/g, '/');
  let timeStamp = new Date(date).getTime();
  return timeStamp;
}
let compareDate=(start,end)=>{
  let startDate = start.replace(/-/g,'/');
  let endDate = end.replace(/-/g,'/');
  let startStamp = new Date(startDate).getTime();
  let endStamp = new Date(endDate).getTime();
  if(startStamp-endStamp>0){
    return false;
  }
  return true;
}
module.exports = {
  showToast: showToast,
  timestampToTime: timestampToTime,
  getObjectFirstArg: getObjectFirstArg,
  timestampToDate: timestampToDate,
  dateToTimeStamp: dateToTimeStamp,
  compareDate: compareDate
}