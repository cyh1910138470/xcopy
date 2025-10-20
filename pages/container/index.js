Page({
  data: {
    currentPath: '/pages/manage/index'  // 默认显示管理页
  },
  onTabChange(e) {
    // 接收 TabBar 传递的路径
    const path = e.detail.path;
    // 更新 currentPath，触发子组件切换
    this.setData({
      currentPath: path
    });
  }
});