import request from '@/utils/request'

// 查询字典数据列表
export function listData(data) {
  return request({
    url: '/userserver/dict/data/list',
    method: 'post',
    data: data
  })
}
// 查询API数据列表
export function apiListData(data) {
  return request({
    url: '/userserver/dictroleapi/list',
    method: 'post',
    data: data
  })
}
// 查询URL数据列表
export function urlListData(data) {
  return request({
    url: '/userserver/dictroleurl/list',
    method: 'post',
    data: data
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/userserver/dict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/userserver/dict/data/type/' + dictType,
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/userserver/dict/data/add',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/userserver/dict/data/edit',
    method: 'post',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/userserver/dict/data/' + dictCode,
    method: 'post'
  })
}
