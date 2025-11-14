// 登录状态检查函数
function checkLogin() {
  console.log('路由拦截路由拦截路由拦截路由拦截路由拦截');
  const token = wx.getStorageSync('user');
  return !!token;
}

// 封装 navigateTo 方法
function myNavigateTo(options) {
  if (checkLogin()) {
    wx.navigateTo(options);
    console.log('已登录，执行原跳转');
  } else {
    console.log('未登录，拦截并提示');
    wx.showToast({
      title: '请先登录！',
      icon: 'error',
      duration: 2000,
      mask: true
    });
  }
}

// 同理封装其他路由方法（如 redirectTo、switchTab 等）
// function myRedirectTo(options) {
//   if (checkLogin()) {
//     wx.redirectTo(options);
//   } else {
//     wx.showToast({ title: '请先登录！', icon: 'error' });
//   }
// }

// 导出所有封装方法
module.exports = {
  navigateTo: myNavigateTo,
  // redirectTo: myRedirectTo,
  // 可继续添加 switchTab、reLaunch 等方法的封装
};