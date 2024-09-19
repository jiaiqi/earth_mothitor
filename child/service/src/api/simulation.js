import request from '@/utils/request5'

// 获取年份区间
export function getYear(data) {
  return request({
    url: '/fileservice/imitatedata/list',
    method: 'post',
    data: data
  })
}

// 获取年份下的数据
export function getYearList(data) {
  return request({
    url: '/fileservice/imitatedata/querystaionbyyears',
    method: 'post',
    data: data
  })
}

export function getImg(data, bloor) {
  return request({
    url: `/fileservice/fileservice/ecdownloadbyfilename?filename=${data}&isquality=${bloor}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 获取年份区间
export function getNet(data) {
  return request({
    url: '/fileservice/imitateStation/net/list',
    method: 'post',
    data: data
  })
}

// 获取台站
export function getStation(data) {
  return request({
    url: '/fileservice/imitateStation/station/list',
    method: 'post',
    data: data
  })
}

