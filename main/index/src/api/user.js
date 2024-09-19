import request from '@/utils/request'

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/userserver/user/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'get'
  })
}
// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/userserver/user/authRole/' + userId,
    method: 'get'
  })
}