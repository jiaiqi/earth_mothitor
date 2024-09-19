import request from '@/utils/request'

// 查询api列表
export function listApi(data) {
  return request({
    url: '/userserver/roleapi/list',
    method: 'post',
    data: data
  })
}

// 查询url列表
export function listUrl(data) {
  return request({
    url: '/userserver/roleurl/list',
    method: 'post',
    data: data
  })
}

// 新增角色api权限
export function addApi(data) {
  return request({
    url: '/userserver/roleapi/addlist',
    method: 'post',
    data: data
  })
}

// 新增角色url权限
export function addUrl(data) {
  return request({
    url: '/userserver/roleurl/addlist',
    method: 'post',
    data: data
  })
}

// 删除角色api权限
export function removeApi(data) {
  return request({
    url: '/userserver/roleapi/del/list',
    method: 'post',
    data: data
  })
}

// 删除角色url权限
export function removeUrl(data) {
  return request({
    url: '/userserver/roleurl/del/list',
    method: 'post',
    data: data
  })
}
