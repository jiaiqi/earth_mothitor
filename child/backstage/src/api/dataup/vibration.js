import request from '@/utils/request8'

// 获取年份
export function getyear() {
  return request({
    url: '/strongserver/shockevent/getyear',
    headers: {
      isToken: true
    },
    method: 'post'
  })
}

// 获取事件
export function getVibration(data) {
  return request({
    url: '/strongserver/shockevent/getyearsdata',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 删除事件
export function delEffect(data) {
  return request({
    url: '/strongserver/shockevent/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}


// 获取台站
export function getVibrationList(data) {
  return request({
    url: '/strongserver/shockstation/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取数据
export function getEventList(data) {
  return request({
    url: '/strongserver/shockcatalogdata/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获取台站数据
export function getpStationList(data) {
  return request({
    url: '/strongserver/pStation/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 新增台站数据
export function addStation(data) {
  return request({
    url: '/strongserver/pStation/addStation',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 修改台站数据
export function editStation(data) {
  return request({
    url: '/strongserver/pStation/editStation',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除台站数据
export function delStation(data) {
  return request({
    url: '/strongserver/pStation/delStation',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除强震动台站数据
export function delByStaId(data) {
  return request({
    url: '/strongserver/data/delByStaId?'+data,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'get',
  })
}

// 强震解析
export function expandExcel(data) {
  return request({
    url: '/strongserver/pStation/expandExcel',
    headers: {
      isToken: true,
    },
    method: 'post',
    data: data
  })
}

// 强震查看解析结果
export function findByFileId(data) {
  return request({
    url: '/strongserver/pStation/findByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 强震删除解析文件
export function delByFileId(data) {
  return request({
    url: '/strongserver/pStation/delByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 统计
export function strGetDataNumber() {
  return request({
    url: '/strongserver/shockcatalogdata/getDataNumber',
    headers: {
      isToken: true
    },
    method: 'post',
  })
}
