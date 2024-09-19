import request from '@/utils/request2'

// 获取模板
export function getAuditmodel(data) {
  return request({
    url: '/auditmodel/getlist',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取模板类型
export function getAuditmodelType(data) {
  return request({
    url: '/auditservice/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 新增模板
export function addAuditmodel(data) {
  return request({
    url: '/auditmodel/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 删除模板
export function delAuditmodel(data) {
  return request({
    url: '/auditmodel/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 修改模板
export function editAuditmodel(data) {
  return request({
    url: '/auditmodel/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取节点信息
export function getAuditnode(data) {
  return request({
    url: '/auditnode/getlist',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 新增节点信息
export function addAuditnode(data) {
  return request({
    url: '/auditnode/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 删除节点
export function delAuditnode(data) {
  return request({
    url: '/auditnode/delone',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
