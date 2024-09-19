import request from '@/utils/request7'

// 获取台阵上报单位
export function getarrayunit(data) {
  return request({
    url: '/arrayserver/arrayunit/list',
    // headers: {
    //   isToken: true
    // },
    method: 'post',
    data: data
  })
}

// 获取台阵台网
export function getarraynetwork(data) {
  return request({
    url: '/arrayserver/arraynetwork/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取台站
export function getArraystation(data) {
  return request({
    url: '/arrayserver/arraystation/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 删除
export function delArraystation(data) {
  return request({
    url: '/arrayserver/arraystation/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 统计
export function asGetDataNumber() {
  return request({
    url: '/arrayserver/arraycatalogdata/getDataNumber',
    headers: {
      isToken: true
    },
    method: 'post',
  })
}
