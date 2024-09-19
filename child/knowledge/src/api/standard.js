import request from '@/utils/request'
// import qs from 'qs'

// 获取法规列表
export function getStandard(data) {
  return request({
    url: '/fileservice/standard/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 模糊搜索
export function searchMouh(data) {
  return request({
    url: '/fileservice/standard/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 下载标准
export function downStandard(data) {
  return request({
    url: '/fileservice/fileservice/ecdownload?fileid=' + data,
    headers: {
      isToken: true
    },
    method: 'get',
    responseType: 'blob'
    // data: qs.stringify(data)
  })
}
// 获取法规列表
export function getLawList(data) {
  return request({
    url: '/fileservice/law/listPage?'+data,
    headers: {
      isToken: false
    },
    method: 'get',
  })
}