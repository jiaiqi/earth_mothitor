import request from '@/utils/request1'

// 获取大地形变
export function getCompany(data) {
  return request({
    url: '/levelserver/levelline/getyear',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 根据年份获取水准线
export function getYList(data) {
  return request({
    url: '/levelserver/level/lp/yearList',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获取水准上报单位
export function getUnit(data) {
  return request({
    url: '/levelserver/level/unit/allList',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取水准电
export function getStand(data) {
  return request({
    url: '/level/point/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取水准联系单位
export function getCUnit(data) {
  return request({
    url: '/levelserver/levelline/list',
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
