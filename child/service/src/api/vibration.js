import request from '@/utils/request4'

// 获取年份
export function getyear() {
  return request({
    url: '/strongserver/shockevent/getyear',
    headers: {
      isToken: true
    },
    method: 'post'
  })
}

// 获取事件
export function getVibration(data) {
  return request({
    url: '/strongserver/shockevent/getyearsdata',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取台站
export function getVibrationList(data) {
  return request({
    url: '/strongserver/shockstation/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取数据
export function getEventList(data) {
  return request({
    url: '/strongserver/shockcatalogdata/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}


// 获取数据
export function getStationList(data) {
  return request({
    url: '/station/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查询强震台站信息
export function getStationStrong(data) {
  return request({
    url: '/strongserver/pStation/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 强震动获取数据
export function getDataStrong(data) {
  return request({
    url: '/strongserver/data/getData',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
