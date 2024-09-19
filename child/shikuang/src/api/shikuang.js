import request from '@/utils/request'
// 获取速报列表
export function getList(data) {
  return request({
    url: '/infoserver/sb/pageList?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 获取速报列表
export function getList2(data) {
  return request({
    url: '/infoserver/sp/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&flag='+data.flag,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 获取速报列表分页
export function getPageList(data) {
  return request({
    url: '/infoserver/sb/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}
//历史地震
export function getHisList(pageNum, pageSize, month, day) {
  return request({
    url: '/infoserver/historybm/list?' + 'pageNum=' + pageNum +
      '&pageSize=' + pageSize + '&month=' + month +
      '&day=' + day,
    headers: {
      isToken: false
    },
    method: 'get',
  })
}
// 获权专家研讨
export function getZJList(data) {
  return request({
    url: '/infoserver/sp/zj/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&spid='+data.spid,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 获权最新动态
export function getNewList(data) {
  return request({
    url: '/infoserver/sp/dt/getList?spid='+data.spid,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 获权威发布列表
export function getQWList(id) {
  return request({
    url: '/infoserver/sp/qw/getList?spid='+id,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 专家产品
export function getCatalogList(id) {
  return request({
    url: '/infoserver/sp/catalog/getList?spid='+id,
    headers: {
      isToken: true
    },
    method: 'get', 
  })
}

export function getCatalogPage(data) {
  return request({
    url: '/infoserver/sp/catalog/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&spid='+data.spid+'&catalog='+data.catalog+'&title='+data.title,
    headers: {
      isToken: false
    },
    method: 'get', 
  })
}
