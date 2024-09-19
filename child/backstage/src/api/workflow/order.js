import request from '@/utils/request15'
//子站查询
export function childSpotList(data) {
  return request({
    url: '/replyserver/substation/pageList',
    headers: {
      isToken: true,
    },
    data: data,
    method: 'post',
  })
}
//子站增加
export function childSpotAdd(data) {
  return request({
    url: '/replyserver/substation/add',
    headers: {
      isToken: true
    },
    data: data,
    method: 'post',
  })
}

//子站修改
export function childSpotEdit(data) {
  return request({
    url: '/replyserver/substation/update',
    headers: {
      isToken: true
    },
    data: data,
    method: 'post',
  })
}

//子站删除
export function childSpotDel(data) {
  return request({
    url: '/replyserver/substation/remove',
    headers: {
      isToken: true
    },
    data: data,
    method: 'post',
  })
}
// 获取
export function getList(data) {
  return request({
    url: '/orderserver/orderBasic/pageList',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除
export function delList(data) {
    return request({
      url: '/orderserver/orderBasic/del?returnNum='+data.returnNum,
      headers: {
        isToken: true
      },
      method: 'post'
    })
  }
// 更新
export function updateList(data) {
    return request({
      url: '/orderserver/orderBasic/update',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
    })
}
  
// 获取处理记录
export function getRecList(data) {
  return request({
    url: '/orderserver/orderStatus/pageList?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 新增记录
export function addRecList(data) {
  return request({
    url: '/orderserver/orderStatus/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 未完成订单数量
export function statusNum(data) {
  return request({
    url: '/orderserver/orderBasic/statusNum?'+data,
    headers: {
      isToken: true
    },
    method: 'post',
  })
}
//根据订单状态数量统计
export function groupByStatus(data) {
  return request({
    url: '/orderserver/orderBasic/groupByStatus',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}