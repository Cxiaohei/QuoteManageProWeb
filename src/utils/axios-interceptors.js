import Cookie from 'js-cookie'
const xsrfHeaderName = 'Authorization'
// 400拦截
const resp400 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const { message } = options
    if (response.code === 401) {
      message.error('无此权限')
    }
    return response
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { message } = options
    let msg = ''
    if(error.response && error.response.data && error.response.data.error_description){
      msg = error.response.data.error_description
    }
    else if (error.response && error.response.data ) {
      msg = error.response.data.message
      if(error.response.data.errors)
      {
        msg+=':'+error.response.data.errors[0].errorMessage

      }
    } else {
      msg = error.message
    }
    message.error(msg)
    return Promise.reject(error)
  }
}

// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const { message } = options
    if (response.code === 401) {
      message.error('无此权限')
    }
    return response
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    // return
    // 去掉登录验证
    const { router, message } = options
    if (error.response && error.response.status == 401) {
      message.error('认证 token 已过期，请重新登录')
      // Cookie.remove(xsrfHeaderName)
      // router.push('/login');
      return Promise.reject(error)
    }
    let msg = ''
    if(error.response && error.response.data && error.response.data.error_description){
      msg = error.response.data.error_description
    }
    else if (error.response && error.response.data && error.response.data.error) {
      msg = error.response.data.error.message
    } else {
      msg = error.message
    }
    message.error(msg)
    return Promise.reject(error)
  }
}  


const resp403 = {
  onFulfilled(response, options) {
    const { message } = options
    if (response.code === 403) {
      message.error('请求被拒绝')
    }
    return response.data
  },
  // onRejected(error, options) {
  //   const {message} = options
  //   const {response} = error
  //   if (response.status === 403) {
  //     message.error('请求被拒绝')
  //   }
  //   return Promise.reject(error)
  // }
}
const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const { message } = options
    const { url, xsrfCookieName, headers } = config
    // 去掉登录验证
    // if (url.indexOf('login') === -1 && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
    //   message.warning('认证 token 已过期，请重新登录')
    // }
    // if (headers.Authorization && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
    //   message.warning('认证 token 已过期，请重新登录')
    // }
    config.headers['Authorization'] = Cookie.get(xsrfHeaderName)
    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { message } = options
    let msg = ''
    if (error.response && error.response.data) {
      msg = error.response.data.error
    } else {
      msg = error.message
    }
    message.error(msg)
    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403,resp400] // 响应拦截
}
