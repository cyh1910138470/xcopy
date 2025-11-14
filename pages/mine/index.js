import request from "../../utils/request/index";
import md5 from 'blueimp-md5';
const router = require('../../utils/routerinterceptor/index');

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
   * 关键：页面生命周期关联（只有这个 show 有效！）
   * 当组件所在的页面显示时触发
   */
  pageLifetimes: {
    show() {
      this.calcStatusBarHeight();
      console.log('pageLifetimes-show：组件所在页面显示了'); // 现在会打印
      this.getuserInfo();
    },
    hide() {
      console.log('pageLifetimes-hide：组件所在页面隐藏了');
    }
  },

  /**
   * 组件自身生命周期（删掉无效的 show 钩子）
   */
  lifetimes: {
    attached() {
      this.calcStatusBarHeight();
      this.getuserInfo();
      console.log('组件挂载完成（attached）');
    },
    ready() {
      console.log('组件渲染完成（ready）');
    },
    // 删掉！lifetimes 里的 show 是无效钩子，写了也不执行
    // show() { ... }, 
    detached() {
      console.log('组件销毁（detached）');
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    calcStatusBarHeight() {
      try {
        const systemInfo = wx.getSystemInfoSync();
        const statusBarHeightPx = systemInfo.statusBarHeight;
        const statusBarHeightRpx = statusBarHeightPx * 2;
        this.setData({
          statusBarHeight: statusBarHeightRpx + 8,
          titleTop: statusBarHeightRpx - 30
        });
        console.log('状态栏高度（rpx）：', statusBarHeightRpx);
      } catch (err) {
        console.error('获取状态栏高度失败：', err);
        this.setData({ statusBarHeight: 40 });
      }
    },
    getuserInfo() {
      this.setData({
        username: wx.getStorageSync('user') || ''
      });
    },
    onUserInput(e) {
      this.setData({ user: e.detail });
    },
    mousedown(e) {
      console.log('mousedown：', e.currentTarget.dataset.val);
      this.setData({ isactive: e.currentTarget.dataset.val });
    },
    mouseup(e) {
      console.log('mouseup');
      this.setData({ isactive: '' });
      if (e.currentTarget.dataset.val == 1) {
        return wx.showToast({
          title: '页面还没写',
          icon: 'error',
          duration: 2000,
          mask: true
        });
      }
      router.navigateTo({
        url: '/pages/funtions/styctl/index',
        success(res) {
          const eventChannel = res.eventChannel;
          eventChannel.emit('sendData', { 
            title: e.currentTarget.dataset.val == 1 ? '报表接收开关' : '系统管理' 
          });
        }
      });
    },
    onPassInput(e) {
      console.log('密码输入：', e);
      this.setData({ pass: e.detail });
    },
    handleClick() {
      console.log('handleClick');
      this.setData({ show: !this.data.show });
    },
    async handleConfirm() {
      const res = await request.post('/login', {
        user: this.data.user,
        pass: md5(this.data.pass)
      }, { loading: true });
      console.log('登录结果：', res);
      this.setData({ show: !this.data.show });
      wx.setStorageSync('user', this.data.user);
      this.getuserInfo();
      wx.showToast({
        title: '登录成功！',
        icon: 'success',
        duration: 2000,
        mask: true
      });
    },
    // 注意：组件里的 onPullDownRefresh/onReachBottom 无效！
    // 这些是页面（Page）的钩子，组件要通过 pageLifetimes 监听页面的
    // 如需保留，需移到组件所在的页面 JS 中
    onPullDownRefresh() {
      console.log('下拉刷新（组件中无效，需移到页面）');
    },
    onReachBottom() {
      console.log('上拉触底（组件中无效，需移到页面）');
    },
    onShareAppMessage() {
      return { title: '分享', path: '/pages/index/index' };
    }
  }
});