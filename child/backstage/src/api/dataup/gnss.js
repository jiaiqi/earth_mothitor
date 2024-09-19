import request from '@/utils/request6.js'

// 获取连续站上报单位
export function getContinuous(data) {
  return request({
    url: '/gnss/unit/continuous/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取连续站台网
export function getContinuousNet(data) {
  return request({
    url: '/gnss/network/continuous/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取连续站台站
export function getContinuousList(data) {
  return request({
    url: '/gnss/continuous/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取连续站台站数据
export function getContinuousDataList(data) {
  return request({
    url: '/gnss/continuous/data/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取流动站上报单位
export function getFlow(data) {
  return request({
    url: '/gnss/unit/flow/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取流动站台网
export function getFlowNet(data) {
  return request({
    url: '/gnss/network/flow/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取流动站台站
export function getFlowGnss(data) {
  return request({
    url: '/gnss/flow/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取流动站台站数据
export function getFlowGnssList(data) {
  return request({
    url: '/gnss/flow/data/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// GNSS解析
export function expandExcel(data) {
  return request({
    url: '/gnss/station/expandExcel',
    headers: {
      isToken: true,
    },
    method: 'post',
    data: data
  })
}

// GNSS查看解析结果
export function findByFileId(data) {
  return request({
    url: '/gnss/station/findByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// GNSS删除解析文件
export function delByFileId(data) {
  return request({
    url: '/gnss/station/delByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// GNSS分发
export function gnssPushData(data) {
  return request({
    url: '/gnss/data/pushData',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//GNSS分发撤销接口
export function revokePushData(data) {
  return request({
    url: '/gnss/data/revokePushData',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// GNSS删除分发文件
export function gnssDelRealData(data) {
  return request({
    url: '/gnss/data/delRealData',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// GNSS统计
export function gnssGetDataNumber() {
  return request({
    url: '/gnss/continuous/data/getDataNumber',
    headers: {
      isToken: true
    },
    method: 'post'
  })
}

// GNSS台站
export function gnssStationList(data) {
  return request({
    url: '/gnss/station/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// GNSS台站修改
export function gnssStationEdit(data) {
  return request({
    url: '/gnss/station/editStation',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// GNSS台站删除
export function gnssStationDel(data) {
  return request({
    url: '/gnss/station/delStation',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// GNSS台站新增
export function gnssStationAdd(data) {
  return request({
    url: '/gnss/station/addStation',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}