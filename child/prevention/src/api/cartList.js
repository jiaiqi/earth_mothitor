import request from '@/utils/request1'

// 添加购物车
export function addCartApi(data) {
  return request({
    url: '/orderserver/shoppingTrolley/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 读取购物车
export function getList(data) {
    return request({
      url: '/orderserver/shoppingTrolley/list?returnName='+data.userName,
      headers: {
        isToken: true
      },
      method: 'get'
    })
  }
  // 删除购物车内容
export function delCart(data) {
  return request({
    url: '/orderserver/shoppingTrolley/del?'+data,
    headers: {
      isToken: true
    },
    method: 'post',
  })
}