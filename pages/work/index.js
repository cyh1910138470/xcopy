const router = require('../../utils/routerinterceptor/index');
Component({
  /**
   * 组件的属性列表（可从父组件接收参数）
   */
  properties: {
    // 若需要从父组件接收参数，可在此定义
    // 示例：
    // title: {
    //   type: String,
    //   value: '默认标题'
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    arr: []
  },

  /**
   * 组件的生命周期函数（替代页面的 onLoad、onReady 等）
   */

  lifetimes: {
    // 组件挂载到页面时执行（类似页面的 onLoad）
    attached() {
      let temp = [];
      for (let i = 1; i < 30; i++) {
        temp.push({
          name: '测试菜单' + i,
          url: '../../assets/pics/hexiao.png' // 确保图片路径正确
        });
      }
      this.computenums(temp);
      this.setData({
        arr: temp
      });
      console.log('组件 attached：测试菜单数据初始化完成', temp);
    },

    // 组件初次渲染完成时执行（类似页面的 onReady）
    ready() {

      
      console.log('组件 ready：渲染完成');
    },

    // 组件被销毁时执行（类似页面的 onUnload）
    detached() {
      console.log('组件 detached：已销毁');
    }
  },

  /**
   * 监听组件所在页面的生命周期（如页面显示/隐藏）
   */
  pageLifetimes: {
    // 所在页面显示时执行（类似页面的 onShow）
    show() {
      console.log('组件所在页面显示');
    },

    // 所在页面隐藏时执行（类似页面的 onHide）
    hide() {
      console.log('组件所在页面隐藏');
    }
  },

  /**
   * 组件的方法列表（所有自定义方法放在这里）
   */
  methods: {
    // 若需要下拉刷新/上拉触底等功能，需通过父页面传递事件触发
    // 示例：下拉刷新方法（由父页面调用）
    handlePullDownRefresh() {
      console.log('组件触发下拉刷新');
      // 刷新逻辑...
    },

    // 上拉触底方法
    handleReachBottom() {
      console.log('组件触发上拉触底');
      // 加载更多逻辑...
    },
    handleClick(e) {
      const dataset = e.currentTarget.dataset;
      router.navigateTo({
        url: '/pages/funtions/ceshi/index',
        success(res) {
          const eventChannel = res.eventChannel;
          eventChannel.emit('sendData', { 
            title: e.currentTarget.dataset.name
          });
        }
      });
    },
    computenums(arr) {
      if ((arr.length % 4) > 0) {
        const num = 4 - arr.length % 4
        for (let i = 0; i < num; i++) {
          console.log('添加空数据');
          arr.push({
            name: '',
            url: ''
          })
        }
      }
    },
  }
});