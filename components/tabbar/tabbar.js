Component({
  properties: {
    currentPath: {  // 接收当前页面路径（用于高亮选中项）
      type: String,
      value: ''
    }
  },
  methods: {
    // 切换页面
    switchTab(e) {
      const path = e.currentTarget.dataset.path; // 如 "/pages/work/index"
      // 通过事件将路径传递给父组件（即 container 页面）
      this.triggerEvent('tabChange', { path }); 
    }
  }
});