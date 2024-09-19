import request from '@/utils/request2'

// 获取台网
export function getPrecursorList(data) {
  return request({
    url: '/precursorserver/prenetwork/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取台站
export function getPrestationList(data) {
  return request({
    url: '/precursorserver/prestation/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取全国台站
export function getWordList(data) {
  return request({
    url: '/precursorserver/upderFluid/station/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取菜单
export function getPreitem(data) {
  return request({
    url: '/precursorserver/preitem/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取前兆台站具体数据
export function getpredataList(data) {
  return request({
    url: '/precursorserver/predata/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

export function getData(data) {
  return request({
    url: '/precursorserver/upderFluid/data/getData',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取地质台站数据
export function geoStationList(data) {
  return request({
    url: '/precursorserver/geological/station/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取地质台站具体数据
export function geoGetData(data) {
  return request({
    url: '/precursorserver/geological/data/getData',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
