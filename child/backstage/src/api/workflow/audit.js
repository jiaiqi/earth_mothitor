import request from '@/utils/request11'

// 任务列表
export function getAuditList(data) {
  return request({
    url: '/auditserver/auditTask/pageList?'+data,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}
// 修改任务状态
export function editStatus(data) {
  return request({
    url: '/auditserver/auditTask/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获取审核记录
export function listById(data) {
  return request({
    url: '/auditserver/auditRecord/listById?taskId='+data.taskId,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 增添审核信息
export function quickAdd(data) {
  return request({
    url: '/auditserver/auditTask/quickAdd?title='+data.title+'&disciplineKey='+data.disciplineKey+'&creator='+data.creator+'&unitName='+data.unitName,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 审核通过
export function passTask(data) {
  return request({
    url: '/auditserver/auditTask/pass?taskId='+data.taskId+'&status='+data.status+'&disciplineKey='+data.disciplineKey,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

// 增添审核信息
export function addAuditRecord(data) {
  return request({
    url: '/auditserver/auditRecord/add',
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
// 上传文件
export function upStation(data) {
  return request({
    url: '/auditserver/seismometry/upload',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获取测震审核信息
export function getWithTask(data) {
  return request({
    url: '/auditserver/seismometry/getWithTask?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&taskId='+data.taskId, // getnetwork
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'get'
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

//审核权限配置
export function getIdList(data) {
  return request({
    url: '/auditserver/auditRole/getRoleAudit?roleId='+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 修改审核权限
export function setRoleAudit(data) {
  return request({
    url: '/auditserver/auditRole/setRoleAudit?parma='+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// GNSS
export function getListWithTask(data) {
  return request({
    url: '/auditserver/gnss/getListWithTask?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 地下流体
export function getListWithTaskFluid(data) {
  return request({
    url: '/auditserver/under_fluid/getListWithTask?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

//地震测深
export function getListWithTaskDeep(data) {
  return request({
    url: '/auditserver/dr/getListWithTask?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

//强震动
export function getListWithTaskStrong(data) {
  return request({
    url: '/auditserver/strongShock/getListWithTask?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

//活动断层
export function getListWithTaskActiveFault(data) {
  return request({
    url: '/auditserver/activeFault/getListWithTask?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

//地震地质
export function getListWithTaskGeological(data) {
  return request({
    url: '/auditserver/geologicalSection/getListWithTask?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

//得到角色对应单位的权限
export function getRoleAndDepPower(data) {
  return request({
    url: '/auditserver/auditRole/getRoleAndDepPower',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//设置角色对应单位的权限
export function setRoleAndDepPower(data) {
  return request({
    url: '/auditserver/auditRole/setRoleAndDepPower',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//获得角色对应单位
export function linkRoleDept(data) {
  return request({
    url: '/auditserver/auditRole/linkRoleDept',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//删除学科下的单位
export function auditDepDel(data) {
  return request({
    url: '/auditserver/auditDep/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
