import request from '@/utils/request1'

// 获取最新动态
export function getNewsList(data) {
  return request({
    url: '/collectserver/news/listPage?'+data,
    headers: {
        isToken: false
      },
      method: 'get',
    })
}