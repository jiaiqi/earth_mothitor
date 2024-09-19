import request from '@/utils/request5'

// 获取水准上报单位
export function getUnit(data) {
  return request({
    // url: '/level/unit/list',
    url: '/levelserver/level/unit/allList',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取大地形变
export function getCompany(data) {
  return request({
    url: '/levelserver/level/lp/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取大地形变
export function delCompany(data) {
  return request({
    url: '/levelserver/levelline/del',

    method: 'post',
    data: data
  })
}
