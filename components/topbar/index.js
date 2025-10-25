// components/topbar/index.js
Component({
  /**
   * 组件的初始数据
   */
  data: {
    options: [
      { text: '测试网吧1', value: '1' },
      { text: '测试网吧2', value: '2' },
      { text: '测试网吧3', value: '3' },
      { text: '测试网吧4', value: '4' },
      { text: '测试网吧5', value: '5' },
      { text: '测试网吧6', value: '6' },
      { text: '测试网吧7', value: '7' },
    ],
    value: "",
    statusBarHeight: 0, // 状态栏高度（rpx）= 导航栏顶部到屏幕顶部的距离
    statusBarHeightPx: 0 // 状态栏高度（px，备用）
  },
  properties: {
    // 示例：是否只允许相机扫码（默认 true）
    onlyCamera: {
      type: Boolean,
      value: true
    }
  },
  /**
   * 组件的生命周期函数
   */
  lifetimes: {
    // 组件实例进入页面节点树时执行（类似页面的 onLoad）
    attached() {
      // 可在这里做初始化准备工作
      this.calcStatusBarHeight();
    },

    // 组件布局完成后执行（类似页面的 onReady）
    ready() {
      this.setData({
        value: this.data.options[0].value
      });
      console.log('ready++++++++++++'); // 组件渲染完成后打印
      this.calcStatusBarHeight();
    },

    // 组件实例被从页面节点树移除时执行（类似页面的 onUnload）
    detached() {
      // 可在这里做清理工作
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onDropdownChange(e) {
      const { value } = e.detail; // 获取选中的值
      this.setData({ value: value }); // 更新选中状态
    },
    handleScan() {
      const { onlyCamera } = this.data;
  
      // 调用微信扫码 API
      wx.scanCode({
        onlyFromCamera: onlyCamera, // 是否只允许相机扫码（从 properties 接收）
        scanType: ['qrCode', 'barCode'], // 支持二维码、条形码
        showFlash: true, // 显示闪光灯按钮
        success: (res) => {
          // 扫码成功：获取结果并传递给父组件
          this.triggerEvent('scanSuccess', { 
            result: res.result, 
            type: res.scanType 
          });
          
          // 组件内部提示
          wx.showToast({
            title: '扫码成功',
            icon: 'success'
          });
        },
        fail: (err) => {
          // 扫码失败/取消：传递错误信息给父组件
          this.triggerEvent('scanFail', err);
          
          // 提示用户（排除用户主动取消的情况）
          if (err.errMsg !== 'scanCode:fail cancel') {
            wx.showToast({
              title: '扫码失败，请重试',
              icon: 'none'
            });
          }
        }
      });
    },
    calcStatusBarHeight() {
      try {
        // 获取系统信息
        const systemInfo = wx.getSystemInfoSync();
        // 状态栏高度（px）= 导航栏顶部到屏幕顶部的距离
        const statusBarHeightPx = systemInfo.statusBarHeight;
        
        // 转换为 rpx（1px ≈ 2rpx，适配 750rpx 设计稿）
        const statusBarHeightRpx = statusBarHeightPx * 2;

        // 更新数据
        this.setData({
          statusBarHeight: statusBarHeightRpx + 6,
        });

        console.log('导航栏顶部到屏幕顶部距离（rpx）：', statusBarHeightRpx);
      } catch (err) {
        console.error('获取状态栏高度失败：', err);
        // 失败时使用默认值（多数手机为 20px = 40rpx）
        this.setData({
          statusBarHeight: 40,
        });
      }
    }
  },
  
});