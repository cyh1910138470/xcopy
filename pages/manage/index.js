// pages/manage/index.js
import request from "../../utils/request/index";
import md5 from 'blueimp-md5';
Component({
  data: {
    containerHeight: 'auto'
  },
  methods: {
    async submitData() {
      console.log('submitData');
      wx.removeStorageSync('user')
    }
  },
  lifetimes: {
    ready() {
      console.log('组件 ready 执行');
      // 1. 获取页面实例（关键：从页面根节点开始查找）
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1]; // 当前页面（container 页面）
      
      // 2. 在页面实例的上下文查找 #parent-container
      const query = wx.createSelectorQuery().in(currentPage);
      query.select('#parent-container').boundingClientRect(rect => {
        if (rect) {
          console.log('父容器高度：', rect.height);
          this.setData({
            containerHeight: rect.height + 'px'
          });
        } else {
          console.log('未找到 #parent-container');
        }
      }).exec();
    }
  }
});