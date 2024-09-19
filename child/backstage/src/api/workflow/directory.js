import request from '@/utils/request11'

// 添加服务
export function socialList(data) {
  return request({
    url: '/sforcesserver/sForces/dList',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 字典
export function getField(data) {
  return request({
    url: '/sforcesserver/sForces/field', // getnetwork
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'get',
  })
}
// 字典
export function getClassification(data) {
  return request({
    url: '/sforcesserver/sForces/classification', // getnetwork
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'get',
  })
}

// 添加
export function socialAdd(data) {
  return request({
    url: '/sforcesserver/sForces/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 修改
export function socialEdit(data) {
  return request({
    url: '/sforcesserver/sForces/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除
export function socialDel(data) {
  return request({
    url: '/sforcesserver/sForces/del',
    headers: {
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
