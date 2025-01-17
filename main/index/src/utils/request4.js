import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken, removeRefreshToken, removeExpiresIn, removeUser } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import cache from '@/plugins/cache'
import Cookies from 'js-cookie'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: process.env.VUE_APP_SERV_API,
  baseURL: location.hostname == 'localhost' || location.hostname == '192.168.0.127' ? process.env.VUE_APP_CART_API : '',
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    // if (getToken() && !isToken) {
      if (getToken()) {
      config.headers.Authorization = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?'
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName]
        let part = encodeURIComponent(propName) + '='
        if (value !== null && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              if (value[key] !== null && typeof value[key] !== 'undefined') {
                let params = propName + '[' + key + ']'
                let subPart = encodeURIComponent(params) + '='
                url += subPart + encodeURIComponent(value[key]) + '&'
              }
            }
          } else {
            url += part + encodeURIComponent(value) + '&'
          }
        }
      }
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    if (
      !isRepeatSubmit &&
      (config.method === 'post' || config.method === 'put')
    ) {
      const requestObj = {
        url: config.url,
        data:
          typeof config.data === 'object'
            ? JSON.stringify(config.data)
            : config.data,
        time: new Date().getTime()
      }
      const sessionObj = cache.session.getJSON('sessionObj')
      if (
        sessionObj === undefined ||
        sessionObj === null ||
        sessionObj === ''
      ) {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url // 请求地址
        const s_data = sessionObj.data // 请求数据
        const s_time = sessionObj.time // 请求时间
        const interval = 1000 // 间隔时间(ms)，小于此时间视为重复提交
        if (
          s_data === requestObj.data &&
          requestObj.time - s_time < interval &&
          s_url === requestObj.url
        ) {
          const message = '数据正在处理，请勿重复提交'
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode.default
    // 二进制数据则直接返回
    if (
      res.request.responseType === 'blob' ||
      res.request.responseType === 'arraybuffer'
    ) {
      return res.data
    }
    if (code === 401) {
      // MessageBox.confirm(
      //   '登录状态已过期，您可以继续留在该页面，或者重新登录',
      //   '系统提示',
      //   {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }
      // )
      //   .then(() => {
      //     store.dispatch('LogOut').then(() => {
      //       this.$store.commit('showLogin', true)
      //     })
      //   })
      //   .catch(() => {
        removeToken()
        removeRefreshToken()
        removeExpiresIn()
        removeUser()
        Cookies.set('ExpiresTime','')
        // })
      return res.data
    } else if (code === 500) {
      // removeToken()
      // removeRefreshToken()
      // removeExpiresIn()
      // removeUser()
      //避免重复提示
      if(Cookies.get('loginError') != 1){
        // Notification.error({
        //   title: '服务器内部错误，请联系管理员。'
        // })
        // Cookies.set('ExpiresTime','')
        let expires = new Date(new Date() * 1 + 10000)
        Cookies.set('loginError', 1, { expires: expires })
      }
      return res.data
    } else if (code !== 200) {
      //避免重复提示
      if(Cookies.get('loginError') != 1){
        // Notification.error({
        //   title: msg
        // })
        let expires = new Date(new Date() * 1 + 10000)
        Cookies.set('loginError', 1, { expires: expires })
      }
      return Promise.reject(new Error('error'))
    } else {
      return res.data
    }
  },
  (error) => {
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    // Message({
    //   message: message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
