import request from '@/utils/request'

// 获取基础数据
export function getBasic(data) {
  return request({
    url: '/geophyserver/basic/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取基础数据
export function getGeophydata(data) {
  return request({
    url: '/geophyserver/geophydata/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获取基础数据
export function getDRlist(data) {
  return request({
    url: '/geophyserver/dr/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//钻孔联合剖面列表
export function manpowerList(data) {
  return request({
    url: '/geophyserver/manpower/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//钻孔联合剖面点列表
export function manpowerPointList(data) {
  return request({
    url: '/geophyserver/manpower/point/pageList?line_id='+data.line_id+'&pageNum=1&pageSize=999',
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

//人工地震勘探列表
export function drillList(data) {
  return request({
    url: '/geophyserver/drill/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取点基础数据
export function getPointDrillList(data) {
  return request({
    url: '/geophyserver/drill/point/pageList?pageNum=1&pageSize=999&line_id='+data.line_id,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}