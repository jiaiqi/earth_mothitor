import axios from 'axios'
import { getToken } from '@/utils/auth'

const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_UPDA_API,
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    if (getToken() && !isToken) {
      config.headers.Authorization = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 行业链接
export function industry(data) {
  return service({
    url: '/infoserver/indus/list',
    method: 'post',
    data: data
  })
}
