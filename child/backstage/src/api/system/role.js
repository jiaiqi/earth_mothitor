import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/userserver/role/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/userserver/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/userserver/role/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/userserver/role/edit',
    method: 'post',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/userserver/role/dataScope',
    method: 'post',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/userserver/role/changeStatus',
    method: 'post',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/userserver/role/' + roleId,
    method: 'post'
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/userserver/role/authUser/allocatedList',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: '/userserver/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/userserver/role/authUser/cancel',
    method: 'post',
    data: data
  })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request({
    url: '/userserver/role/authUser/cancelAll',
    method: 'post',
    params: data
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/userserver/role/authUser/selectAll',
    method: 'post',
    params: data
  })
}

// 查询角色已拥有审核权限
export function roleauditList(data) {
  return request({
    url: '/roleaudit/list',
    method: 'post',
    data: data
  })
}

// 角色新增审核权限
export function addRoleaudit(data) {
  return request({
    url: '/roleaudit/addlist',
    method: 'post',
    data: data
  })
}

// 修改角色审核权限
export function editRoleaudit(data) {
  return request({
    url: '/roleaudit/del',
    method: 'post',
    data: data
  })
}
