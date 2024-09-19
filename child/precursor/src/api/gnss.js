import request from '@/utils/request3'

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

// 获取GNSS台站数据
export function getGnssList(data) {
  return request({
    url: '/gnss/station/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取GNSS台站具体数据
export function getGnssData(data) {
  return request({
    url: '/gnss/data/getData',
    headers: {
      isToken: true
    },
    method: 'post',
    data:data
  })
}

// 获取GNSS台站具体数据
export function gnssHeadSearch(data) {
  return request({
    url: '/gnss/data/headSearch',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
