import request from '@/utils/request1'

// 上传数据
export function upData(data) {
  return request({
    url: '/auditdata/add',
    method: 'post',
    data: data
  })
}
