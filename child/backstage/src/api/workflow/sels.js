import request from '@/utils/request12'

// 获取上报单位
export function getCompany(data) {
  return request({
    url: '/seisserver/uploaadunit/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取台网信息
export function getCompanyList(data) {
  return request({
    url: '/network/getnetwork',
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查询台站信息
export function getStation(data) {
  return request({
    url: '/seisserver/station/list',
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
    url: '/seisserver/station/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 删除台站信息
export function delStation(data) {
  return request({
    url: '/seisserver/station/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 修改台站信息
export function updataStation(data) {
  return request({
    url: '/seisserver/station/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查询服务列表
export function proSerlist(data) {
  return request({
    url: '/prodSer/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查询单个服务的富文本
export function getHtml(data) {
  return request({
    url: '/prodSer/getHtml',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 分页查询
export function listPage(data) {
  return request({
    url: '/prodSer/listPage?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize,
    headers: {
      isToken: true
    },
    method: 'post',
  })
}

// 删除数据项
export function serDel(data) {
  return request({
    url: '/prodSer/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取台网信息
export function getCompanyList2(data) {
  return request({
    url: '/seisserver/network/list', // getnetwork
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// // 上传文件
// export function upStation(data) {
//   return request({
//     url: '/station/importstationdata',
//     headers: {
//       isToken: true
//     },
//     method: 'post',
//     data: data
//   })
// }
