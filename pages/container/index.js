Page({
  data: {
    currentPath: '/pages/manage/index'  // 默认显示管理页
  },
  onTabChange(e) {
    // 接收 TabBar 传递的路径
    const path = e.detail.path;
    // 更新 currentPath，触发子组件切换
    this.setData({
      currentPath: path,
      // navBarHeight: 0, // 右上角导航区总高度（rpx）
      // statusBarHeight: 0 // 状态栏高度（rpx，备用）
    });
    // this.calcNavBarHeight();
  },
  onLoad() {
    // 动态计算导航区高度
  },
  onShow() {
  },
});