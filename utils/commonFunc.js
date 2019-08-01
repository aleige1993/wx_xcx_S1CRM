export const getStorageSync =(key)=>{
  if(key && typeof key === 'string'){
    return wx.getStorageSync(key);
  }
 
}
export const setStorageSync=(key,data)=>{
  if(key && typeof key === 'string' && data){
    return wx.setStorageSync(key, data);
  }
 
}
export const removeStorageSync=(key)=>{
  if(key && typeof key === 'string'){
    wx.removeStorageSync(key);
  }
}
export const showToast =(title)=>{
  wx.showToast({
    title: title,
    icon:'none'
  });
}