/**
 * 小程序网络请求封装
 * 支持拦截器、加载提示、错误统一处理、请求取消等功能
 */
class Request {
  constructor() {
    // 基础配置
    this.baseUrl = ''; // 接口基础地址（可在app.js中初始化时设置）
    this.timeout = 10000; // 超时时间
    this.loading = false; // 是否显示加载提示
    this.loadingText = '加载中...'; // 加载提示文字
    this.requestCount = 0; // 当前请求数量（用于控制加载提示）
    
    // 拦截器
    this.interceptors = {
      request: (config) => config, // 请求拦截器
      response: (res) => res, // 响应拦截器
      error: (err) => err // 错误拦截器
    };

    // 请求队列（用于取消请求）
    this.requestQueue = new Map();
  }

  /**
   * 设置基础配置
   * @param {Object} options 配置项（baseUrl, timeout等）
   */
  setConfig(options = {}) {
    Object.assign(this, options);
  }

  /**
   * 请求拦截器
   * @param {Function} handler 拦截处理函数
   */
  interceptorsRequest(handler) {
    if (typeof handler === 'function') {
      this.interceptors.request = handler;
    }
  }

  /**
   * 响应拦截器
   * @param {Function} handler 拦截处理函数
   */
  interceptorsResponse(handler) {
    if (typeof handler === 'function') {
      this.interceptors.response = handler;
    }
  }

  /**
   * 错误拦截器
   * @param {Function} handler 拦截处理函数
   */
  interceptorsError(handler) {
    if (typeof handler === 'function') {
      this.interceptors.error = handler;
    }
  }

  /**
   * 显示加载提示
   */
  showLoading() {
    if (this.loading && this.requestCount === 0) {
      wx.showLoading({
        title: this.loadingText,
        mask: true
      });
    }
    this.requestCount++;
  }

  /**
   * 隐藏加载提示
   */
  hideLoading() {
    this.requestCount--;
    if (this.loading && this.requestCount === 0) {
      wx.hideLoading();
    }
  }

  /**
   * 生成请求唯一标识
   * @param {Object} config 请求配置
   */
  generateRequestKey(config) {
    return `${config.method}-${config.url}-${JSON.stringify(config.data)}`;
  }

  /**
   * 取消请求
   * @param {String} key 请求标识（可选，不传则取消所有请求）
   */
  abortRequest(key) {
    if (key) {
      const task = this.requestQueue.get(key);
      if (task) {
        task.abort();
        this.requestQueue.delete(key);
      }
    } else {
      this.requestQueue.forEach((task, k) => {
        task.abort();
        this.requestQueue.delete(k);
      });
    }
  }

  /**
   * 核心请求方法
   * @param {Object} options 请求配置
   * @returns {Promise}
   */
  request(options = {}) {
    // 基础配置合并
    const config = {
      url: '',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
        // 可添加默认header，如token
        // 'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      loading: this.loading, // 是否显示加载提示（可单独设置）
      ...options,
      url: options.url.startsWith('http') ? options.url : this.baseUrl + options.url
    };

    // 请求拦截器处理
    const processedConfig = this.interceptors.request(config);
    if (!processedConfig) {
      return Promise.reject(new Error('请求被拦截器终止'));
    }

    // 显示加载提示
    if (processedConfig.loading) {
      this.showLoading();
    }

    // 生成请求标识
    const requestKey = this.generateRequestKey(processedConfig);

    return new Promise((resolve, reject) => {
      // 创建请求任务
      const task = wx.request({
        ...processedConfig,
        timeout: this.timeout,
        success: (res) => {
          // 响应拦截器处理
          const processedRes = this.interceptors.response(res);
          resolve(processedRes);
        },
        fail: (err) => {
          // 错误拦截器处理
          const processedErr = this.interceptors.error(err);
          reject(processedErr);
        },
        complete: () => {
          // 移除请求队列
          this.requestQueue.delete(requestKey);
          // 隐藏加载提示
          if (processedConfig.loading) {
            this.hideLoading();
          }
        }
      });

      // 添加到请求队列
      this.requestQueue.set(requestKey, task);
    });
  }

  // 快捷请求方法
  get(url, data = {}, options = {}) {
    return this.request({ ...options, url, data, method: 'GET' });
  }

  post(url, data = {}, options = {}) {
    return this.request({ 
      ...options, 
      url, 
      data, 
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        ...options.header
      }
    });
  }

  put(url, data = {}, options = {}) {
    return this.request({ ...options, url, data, method: 'PUT' });
  }

  delete(url, data = {}, options = {}) {
    return this.request({ ...options, url, data, method: 'DELETE' });
  }
}

// 实例化并导出
const request = new Request();
export default request;