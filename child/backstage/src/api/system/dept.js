import request from '@/utils/request'

// 查询单位列表
export function listDept(query) {
  return request({
    url: '/userserver/dept/list',
    method: 'get',
    params: query
  })
}

// 查询单位列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/userserver/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询单位详细
export function getDept(deptId) {
  return request({
    url: '/userserver/dept/dept/get/' + deptId,
    method: 'get'
  })
}

// 查询单位下拉树结构
export function treeselect(deptId) {
  return request({
    url: '/userserver/dept/treeselect'+deptId,
    method: 'get'
  })
}

// 根据角色ID查询单位树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/userserver/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增单位
export function addDept(data) {
  return request({
    url: '/userserver/dept/dept/add',
    method: 'post',
    data: data
  })
}

// 修改单位
export function updateDept(data) {
  return request({
    url: '/userserver/dept/edit',
    method: 'post',
    data: data
  })
}

// 删除单位
export function delDept(deptId) {
  return request({
    url: '/userserver/dept/' + deptId,
    method: 'post'
  })
}
