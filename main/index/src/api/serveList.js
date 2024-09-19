import request from '@/utils/request3'

// 产品推荐
export function getRf(data) {
  return request({
    url: '/prodSer/getrf?type=' + data,
    headers: {
      isToken: false
    },
    method: 'get',
  })
}
// 查询产品列表分页
export function getPageList(data) {
  return request({
    url: '/prodSer/listPage?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize + '&name=' + data.name + '&type=' + data.sType,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}