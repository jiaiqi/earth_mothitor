import request from '@/utils/request'
// import Qs from 'qs'
const client_id = 'web'
const client_secret = '123456'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/auth/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 刷新token方法
export function refreshToken(refresh_token) {
  const grant_type = 'refresh_token'
  // const data = {
  //   client_id:client_id,
  //   client_secret:client_secret,
  //   grant_type:grant_type,
  //   refresh_token:refresh_token
  // }
  let datas = 'client_id='+client_id+'&client_secret='+client_secret+'&grant_type='+grant_type+'&refresh_token='+refresh_token
  if(!refresh_token){
    return false
  }
  return request({
    url: '/oauth/token',
    method: 'post',
    data: datas,
    headers: {
      isToken: false,
      Accept: 'text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //
    }
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/userserver/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}