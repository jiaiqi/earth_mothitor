import request from '@/utils/request1'

// 用户登录统计
export function addCollectUser(data) {
  return request({
    url: '/collectserver/collectUser/add',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 用户登出统计
export function setOutTime(data) {
    return request({
      url: '/collectserver/collectUser/setOutTime?userName='+data,
      headers: {
        isToken: true
      },
      method: 'get',
    })
  }
// 访问量增加
export function viewNumAdd(data) {
  return request({
    url: '/collectserver/viewNumber/viewNumAdd?'+data,
    headers: {
      isToken: false
    },
    method: 'get',
  })
}
  // 学科分类列表
export function getListPage(data) {
  return request({
    url: '/collectserver/subjectMsg/listPage?'+data,
    headers: {
      isToken: false
    },
    method: 'get',
  })
}
// 学科类型列表
export function getTypeDic(data) {
  return request({
    url: '/collectserver/typeDic/listPage?'+data,
    headers: {
      isToken: false
    },
    method: 'get',
  })
}
// 热点数据列表
export function getFlagList(data) {
  return request({
    url: '/collectserver/hotSpot/getFlagData?'+data,
    headers: {
      isToken: false
    },
    method: 'get',
  })
}

// 热点数据列表
export function getHotSpotListPage(data) {
  return request({
    url: '/collectserver/hotSpot/listPage?'+data,
    headers: {
      isToken: false
    },
    method: 'get',
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