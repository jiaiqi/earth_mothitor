import request from '@/utils/request5'
// 热点推荐新增
export function hotAdd(data) {
    return request({
      url: '/collectserver/hotSpot/hotAdd',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
    })
  }
  // 热点数据新增
  export function hotDataAdd(data) {
    return request({
      url: '/collectserver/hotSpot/add',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
    })
  }
  // 热点数据列表
export function getFlagList(data) {
  return request({
    url: '/collectserver/hotSpot/listPage?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}