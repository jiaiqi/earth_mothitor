import request from '@/utils/request4'

// 获取法规列表
export function getStandard(data) {
  return request({
    url: '/fileservice/standard/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获取法规列表
export function geLawList(data) {
  return request({
    url: '/fileservice/law/listPage?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 上传标准
export function addStandard(data) {
  return request({
    url: '/fileservice/standard/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除标准
export function delStandard(data) {
  return request({
    url: '/fileservice/standard/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查看标准详情
export function seeStandard(data) {
  return request({
    url: '/fileservice/uploadfile/getfile',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 下载标准
export function downStandard(data) {
  return request({
    url: '/fileservice/fileservice/ecdownload?fileid=' + data,
    headers: {
      isToken: true
    },
    method: 'get',
    responseType: 'blob'
    // data: qs.stringify(data)
  })
}

// 上传法规
export function addLaw(data) {
  return request({
    url: '/fileservice/law/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 修改法规
export function editLaw(data) {
  return request({
    url: '/fileservice/law/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除法规
export function delLaw(data) {
  return request({
    url: '/fileservice/law/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查看数据目录上传的列表
export function excelfileList(data) {
  return request({
    url: '/fileservice/excelfile/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 创建文件列表
export function excelCreate(data) {
  return request({
    url: '/fileservice/excelfile/create',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 移除已上传的文件
export function excelRemove(data) {
  return request({
    url: '/fileservice/excelfile/remove',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 修改文件状态
export function excelUpdate(data) {
  return request({
    url: '/fileservice/excelfile/update',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 修改文件状态
export function setAuditState(data) {
  return request({
    url: '/fileservice/excelfile/setAuditState',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查看审核列表
export function getJobList(data) {
  return request({
    url: '/fileservice/excelfile/getJobList',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查看审批记录
export function getAuditLog(data) {
  return request({
    url: '/fileservice/auditLog/getByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 审批记录新增
export function addAuditLog(data) {
  return request({
    url: '/fileservice/auditLog/addAuditLog',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 统一分发接口
export function pushData(data) {
  return request({
    url: '/fileservice/expand/pushData',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 统一分发接口
export function revokePushData(data) {
  return request({
    url: '/fileservice/expand/revokePushData',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 审批过的历史记录
export function historyAudit(data) {
  return request({
    url: '/fileservice/excelfile/historyAudit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 下载省局统计文档
export function unitWordTable(data) {
  return request({
    url: '/fileservice/excelfile/unitWordTable',
    responseType: "blob",
    headers: {
      isToken: true,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    method: 'post',
  })
}

// 法规统计
export function lawCount(data) {
  return request({
    url: '/fileservice/law/getDataNumber?'+data,
    headers: {
      isToken: true
    },
    method: 'post',
  })
}

// 标准统计
export function standardCount(data) {
  return request({
    url: '/fileservice/standard/getDataNumber?'+data,
    headers: {
      isToken: true
    },
    method: 'post',
  })
}