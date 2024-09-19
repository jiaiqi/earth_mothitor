import request from '@/utils/request9'
import Qs from 'qs'
// 删除台站信息
export function delStation(data) {
    return request({
      url: '/precursorserver/upderFluid/station/delStation',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
    })
  }
// 获取台站信息
export function getStationList(data) {
    return request({
      url: '/precursorserver/upderFluid/station/list',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
    })
  }
// 新增台站信息
export function addStation(data) {
    return request({
      url: '/precursorserver/upderFluid/station/addStation',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
    })
  }
// 编辑台站信息
export function editStation(data) {
    return request({
      url: '/precursorserver/upderFluid/station/editStation',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
    })
  }

// 地震地质解析文件
export function expandExcel(data) {
  return request({
    url: '/precursorserver/geological/station/expandExcel',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 地震地质查看解析结果
export function findByFileId(data) {
  return request({
    url: '/precursorserver/geological/station/findByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 地震地质查看解析结果
export function delByFileId(data) {
  return request({
    url: '/precursorserver/geological/station/delByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 地下流体解析文件
export function upderFluidExpandExcel(data) {
  return request({
    url: '/precursorserver/upderFluid/station/expandExcel',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 地下流体查看解析结果
export function upderFluidFindByFileId(data) {
  return request({
    url: '/precursorserver/upderFluid/station/findByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 地下流体查看解析结果
export function upderFluidDelByFileId(data) {
  return request({
    url: '/precursorserver/upderFluid/station/delByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 前兆统计
export function preGetDataNumber() {
  return request({
    url: '/precursorserver/predata/getDataNumber',
    headers: {
      isToken: true
    },
    method: 'post'
  })
}


// 前兆统计
export function precataCount(data) {
  return request({
    url: '/precursorserver/predata/count',
    headers: {
      isToken: true,
      Accept: 'text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //
    },
    method: 'post',
    data: Qs.stringify({
      uploader: data.uploader,
      getDays: data.getDays,
    })
  })
}

// 地球物理同步内容
export function predataList(data) {
  return request({
    url: '/precursorserver/predata/getList',
    headers: {
      isToken: true,
    },
    method: 'post',
    data: data
  })
}

