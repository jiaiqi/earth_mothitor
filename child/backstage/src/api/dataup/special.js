import request from '@/utils/request3'

// 上传数据
export function upSpeList(data) {
  return request({
    url: '/infoserver/spe/list',
    method: 'post',
    data: data
  })
}

// 行业链接
export function industry(data) {
  return request({
    url: '/infoserver/indust/list',
    method: 'post',
    data: data
  })
}

// 新增行业链接
export function industryAdd(data) {
  return request({
    url: '/infoserver/indust/add',
    method: 'post',
    data: data
  })
}

// 修改行业链接
export function industryEdit(data) {
  return request({
    url: '/infoserver/indust/edit',
    method: 'post',
    data: data
  })
}

// 删除
export function industryDel(data) {
  return request({
    url: '/infoserver/indust/del',
    method: 'post',
    data: data
  })
}

// 统计
export function inGetDataNumber() {
  return request({
    url: '/infoserver/historybm/getDataNumber',
    method: 'post',
  })
}

