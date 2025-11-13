import request from './utils/request/index.js';
// app.js
App({
  onLaunch() {
    request.setConfig({
      baseUrl: 'http://132.232.132.160',
      timeout: 15000,
      loading: true // 全局默认显示加载提示
    });
    request.interceptorsRequest((config) => {
      // const token = wx.getStorageSync('token');
      // if (token) {
      //   config.header.Authorization = `Bearer ${token}`;
      // }
      return config;
    });
    request.interceptorsResponse((res) => {
      console.log('request+++++++', res);
      const { statusCode, data } = res;
      // 处理HTTP错误状态码
      if (statusCode !== 200) {
        wx.showToast({
          title: `请求错误: ${statusCode}`,
          icon: 'none'
        });
        return Promise.reject(res);
      }
      // 处理业务错误码（假设后端统一返回 { code, data, msg }）
      if (data.status !== 0) {
        wx.showToast({
          title: data.msg || '操作失败',
          icon: 'none'
        });
        // 特殊错误处理（如登录失效）
        if (data.status === 401) {
          // 清除token并跳转登录页
          // wx.removeStorageSync('token');
          // wx.navigateTo({ url: '/pages/login/login' });
        }
        return Promise.reject(data);
      }
      return data.data; // 只返回业务数据
    });

    request.interceptorsError((err) => {
      wx.showToast({
        title: err.errMsg || '网络错误',
        icon: 'none'
      });
      return err;
    });

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    
  }
})
