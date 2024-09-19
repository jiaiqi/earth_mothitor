import request from '@/utils/request2'

// 注册方法
export function getList(pageNum, pageSize, month, day) {
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
// 获取最新地震列表
export function getList2(data) {
  return request({
    url: '/infoserver/sb/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
