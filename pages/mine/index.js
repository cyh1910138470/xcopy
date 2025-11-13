import request from "../../utils/request/index";
import md5 from 'blueimp-md5';

Component({
  /**
   * 组件的属性列表（可从父组件接收参数）
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 0,
    titleTop: 0,
    show: false,
    user: '',
    pass: '',
    username: '',
    isactive: ''
  },

  /**
   * 组件的生命周期函数
   */
  lifetimes: {
    // 组件初始化时执行（类似页面的 onLoad）
    attached() {
      this.calcStatusBarHeight();
      this.getuserInfo();
    },

    // 组件初次渲染完成时执行（类似页面的 onReady）
    ready() {
      this.calcStatusBarHeight();
    },

    // 组件显示时执行（类似页面的 onShow）
    show() {
      this.calcStatusBarHeight();
    },

    // 组件隐藏时执行（类似页面的 onHide）
    hide() {
      console.log('mark: hide');
    },

    // 组件被销毁时执行（类似页面的 onUnload）
    detached() {
      console.log('mark: detached');
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 计算状态栏高度（与原逻辑一致）
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
          statusBarHeight: statusBarHeightRpx + 8,
          titleTop: statusBarHeightRpx - 30
        });

        console.log('导航栏顶部到屏幕顶部距离（rpx）：', statusBarHeightRpx);
      } catch (err) {
        console.error('获取状态栏高度失败：', err);
        // 失败时使用默认值（多数手机为 20px = 40rpx）
        this.setData({
          statusBarHeight: 40,
        });
      }
    },
    getuserInfo() {
      this.setData({
        username: wx.getStorageSync('user') ? wx.getStorageSync('user') : ''
      })
    },
    onUserInput(e) {
      this.setData({
        user: e.detail  // 将输入框的值同步到 data.user
      });
    },
    mousedown(e) {
      console.log('tes', e.currentTarget.dataset.val);
      this.setData({
        isactive: e.currentTarget.dataset.val
      })
    },
    mouseup() {
      console.log('mouseup');
      this.setData({
        isactive: ''
      })
    },
    // 同步密码输入
    onPassInput(e) {
      console.log('同步密码输入', e);
      this.setData({
        pass: e.detail  // 将输入框的值同步到 data.pass
      });
    },
    handleClick() {
      console.log('handleClickhandleClickhandleClick');
      this.setData({
        show: !this.data.show
      })
    },
    async handleConfirm() {
     const res = await request.post('/login', 
      {
        user: this.data.user,
        pass: md5(this.data.pass)
      }, {
        loading: true
      });
      console.log('res', res);
      this.setData({
        show: !this.data.show
      });
      wx.setStorageSync('user', this.data.user)
      this.getuserInfo();
      wx.showToast({
        title: '登录成功！',
        icon: 'success', // 原生成功图标（也可用 'none' 只显示文字）
        duration: 2000, // 弹窗显示时间（ms）
        mask: true // 是否显示遮罩，防止点击穿透
      });
    },

    // 页面原有的事件处理函数（如需保留，移至 methods 中）
    onPullDownRefresh() {
      console.log('下拉刷新');
    },

    onReachBottom() {
      console.log('上拉触底');
    },

    onShareAppMessage() {
      return {
        title: '分享',
        path: '/pages/index/index'
      };
    }
  }
});