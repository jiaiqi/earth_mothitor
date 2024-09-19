import request from '@/utils/request2'

// 获取最新地震列表
export function getList(data) {
  return request({
    url: '/infoserver/sb/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获取列表
export function getEarthList(data) {
  return request({
      url: '/infoserver/sp/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
      headers: {
      isToken: true
      },
      method: 'get',
  })
}
// 获权最新动态列表
export function getConfList(id) {
  return request({
    url: '/infoserver/sp/conf/getList',
    headers: {
      isToken: true
    },
    method: 'get',
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