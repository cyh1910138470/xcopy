// components/title/index.js
Component({
  /**
   * 组件的属性列表（用于接收父组件传递的数据）
   */
  properties: {
    // 示例：接收标题文本（可根据需要添加/修改）
    title: {
      type: String,
      value: '默认标题' // 默认值
    },
    // 示例：接收标题颜色
    titleColor: {
      type: String,
      value: '#333'
    }
  },

  /**
   * 组件的初始数据（内部私有数据）
   */
  data: {
    // 组件内部需要用到的数据，如状态标识等
    isActive: false
  },

  /**
   * 组件的方法列表（内部方法/事件处理）
   */
  methods: {
    // 示例：自定义方法（可根据需要添加）
    handleClick() {
      wx.navigateBack();
    }
  },

  /**
   * 组件的生命周期函数
   */
  lifetimes: {
    // 组件初始化时执行（类似页面的onLoad）
    attached() {
      console.log('组件初始化完成');
    },

    // 组件初次渲染完成时执行（类似页面的onReady）
    ready() {
      console.log('组件渲染完成');
    },

    // 组件显示时执行（类似页面的onShow）
    show() {
      console.log('组件显示');
    },

    // 组件隐藏时执行（类似页面的onHide）
    hide() {
      console.log('组件隐藏');
    },

    // 组件被销毁时执行（类似页面的onUnload）
    detached() {
      console.log('组件销毁');
    }
  }
})