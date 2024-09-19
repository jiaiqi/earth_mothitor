import request from '@/utils/request'

// 获取上报单位
export function getCompany(data) {
  return request({
    url: '/seisserver/uploaadunit/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取台网信息
export function getCompanyList(data) {
  return request({
    url: '/seisserver/network/list', // getnetwork
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查询台站信息
export function getStation(data) {
  return request({
    url: '/seisserver/station/pStation/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查询台站信息
export function getAllStation(data) {
  return request({
    url: '/seisserver/station/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查询台站数量
export function getStationBNum() {
  return request({
    url: '/seisserver/station/list/countdata',
    headers: {
      isToken: true
    },
    method: 'post'
    // data: data
  })
}

// 查询通道信息
export function getcata(data) {
  return request({
    url: '/seisserver/catalogdata/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 查询通道信息
export function getChannel(data) {
  return request({
    url: '/seisserver/channel/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 模糊查询
export function likeList(data) {
  return request({
    url: '/seisserver/station/likeList',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 数据
export function getData(data) {
  return request({
    url: '/seisserver/catalogdata/getData?'+data,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}
// 数据
export function headSearch(data) {
  return request({
    url: '/seisserver/catalogdata/headSearch',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
