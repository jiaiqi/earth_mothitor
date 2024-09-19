import request from '@/utils/request2'
// import qs from 'qs'
// 查询服务列表
export function proSerlist(data) {
  return request({
    url: '/prodSer/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 科普预览
export function preView(data) {
  return request({
    url: '/prodSer/downloadImage/?filename=' + data,
    headers: {
      isToken: true
    },
    method: 'get',
    responseType: 'blob'
  })
}