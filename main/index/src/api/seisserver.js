import request from '@/utils/request1'

// 统计测震
export function getDataNumber(data) {
  return request({
    url: '/seisserver/catalogdata/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 统计GNSS
export function getGNSSDataNumber(data) {
  return request({
    url: '/gnss/continuous/data/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 强震数据
export function getStrongNumber(data) {
  return request({
    url: '/strongserver/shockcatalogdata/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 地下流体数据
export function getUpderFluidNumber(data) {
  return request({
    url: '/precursorserver/upderFluid/data/getNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 地球物理
export function getPreDataNumber(data) {
  return request({
    url: '/precursorserver/predata/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 科学台阵
export function getCataDataNumber(data) {
  return request({
    url: '/arrayserver/arraycatalogdata/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 水准
export function getLevelDataNumber(data) {
  return request({
    url: '/levelserver/level/line/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}