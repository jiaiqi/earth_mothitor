import request from '@/utils/request4'
//下单
export function addOrder(data) {
    return request({
      url: '/orderserver/orderBasic/add',
      method: 'post',
      data: data
    })
  }
//订单新增
export function addDisplay(data) {
  return request({
    url: '/orderserver/orderDisplay/add',
    method: 'post',
    data: data
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
// 新增产品订单
export function productOrderAdd(data) {
  return request({
    url: '/orderserver/orderBasic/productOrderAdd',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
