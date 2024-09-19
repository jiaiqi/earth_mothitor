import request from '@/utils/request10'

// 查询服务列表
export function proSerlist(data) {
  return request({
    url: '/prodSer/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查询单个服务的富文本
export function getHtml(data) {
  return request({
    url: '/prodSer/getHtml',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 分页查询
export function listPage(data) {
  let str = '/prodSer/listPage?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize
  if(data.sort){
    str += '&sort='+data.sort
  }
  if(data.unit){
    str += '&unit='+data.unit
  }
  if(data.name){
    str += '&name='+data.name
  }
  if(data.taskId){
    str += '&taskId='+data.taskId
  }
  if(data.type || data.type == 0){
    str += '&type='+data.type
  }
  return request({
    url: str,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 删除数据项
export function serDel(data) {
  return request({
    url: '/prodSer/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 添加服务
export function addServe(data) {
  return request({
    url: '/prodSer/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 添加服务
export function editServe(data) {
  return request({
    url: '/prodSer/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 产品成果首目录
export function getlist(data) {
  let classStr = data.classification ? '&classification='+data.classification : ''
  let nameStr = data.name ? '&name='+data.name : ''
  let unitStr = data.institution ? '&unit='+data.institution : ''
  let taskId = data.taskId ? '&taskId='+data.taskId : ''
  return request({
    url: '/prodSer/proListPage?pageNum='+data.pageNum+'&pageSize='+data.pageSize + classStr + nameStr + unitStr + taskId,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 添加服务
export function proAdd(data) {
  return request({
    url: '/prodSer/proAdd',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 编辑服务
export function proEdit(data) {
  return request({
    url: '/prodSer/proEdit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除服务
export function proDel(data) {
  return request({
    url: '/prodSer/proDel',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 上传文件
export function uploadFile(data) {
  return request({
    url: '/prodSer/uploadFile',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 上传文件
export function linkFile(data) {
  return request({
    url: '/prodSer/linkFile',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//产品文件列表
export function getLinkFileImg(data) {
  return request({
    url: '/prodSer/getLinkFile?id='+data.id,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
//产品分类列表
export function getClassification() {
  return request({
    url: '/prodSer/classification',
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

//产品附件列表
export function getFileList(data) {
  return request({
    url: '/prodSer/fileInAdd/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//产品附件新增
export function addFileList(data) {
  return request({
    url: '/prodSer/fileInAdd/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//产品附件删除
export function delFileList(data) {
  return request({
    url: '/prodSer/fileInAdd/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//地下流体列表
export function ufList(data) {
  return request({
    url: '/prodSer/uf/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//地下流体列表新增
export function ufAdd(data) {
  return request({
    url: '/prodSer/uf/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//地下流体列表上传
export function ufUpload(data) {
  return request({
    url: '/prodSer/uf/upload',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//地下流体修改审核状态
export function ufEditAuditState(data) {
  return request({
    url: '/prodSer/uf/editAuditState',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//地下流体删除
export function ufDel(data) {
  return request({
    url: '/prodSer/uf/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//地下流体修改
export function ufEdit(data) {
  return request({
    url: '/prodSer/uf/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//产品类型字典表列表
export function dictionaryList(data) {
  return request({
    url: '/prodSer/dictionary/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//产品审核日志
export function auditLogAdd(data) {
  return request({
    url: '/prodSer/auditLog/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//产品审核日志列表
export function auditLogList(data) {
  return request({
    url: '/prodSer/auditLog/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//GNSS列表
export function gnssList(data) {
  return request({
    url: '/prodSer/pgnss/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//GNSS列表新增
export function gnssAdd(data) {
  return request({
    url: '/prodSer/pgnss/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//GNSS列表上传
export function gnssUpload(data) {
  return request({
    url: '/prodSer/pgnss/upload',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//GNSS修改审核状态
export function gnssEditAuditState(data) {
  return request({
    url: '/prodSer/pgnss/editAuditState',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//GNSS删除
export function gnssDel(data) {
  return request({
    url: '/prodSer/pgnss/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//GNSS修改
export function gnssEdit(data) {
  return request({
    url: '/prodSer/pgnss/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//跨断层水准列表
export function levelList(data) {
  return request({
    url: '/prodSer/level/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//跨断层水准列表新增
export function levelAdd(data) {
  return request({
    url: '/prodSer/level/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//跨断层水准列表上传
export function levelUpload(data) {
  return request({
    url: '/prodSer/level/upload',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//跨断层水准修改审核状态
export function levelEditAuditState(data) {
  return request({
    url: '/prodSer/level/editAuditState',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//跨断层水准删除
export function levelDel(data) {
  return request({
    url: '/prodSer/level/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//跨断层水准修改
export function levelEdit(data) {
  return request({
    url: '/prodSer/level/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}


//跨断层水准列表
export function precursorCatalogList(data) {
  return request({
    url: '/prodSer/precursorCatalog/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//跨断层水准列表新增
export function precursorCatalogAdd(data) {
  return request({
    url: '/prodSer/precursorCatalog/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//跨断层水准列表上传
export function precursorCatalogUpload(data) {
  return request({
    url: '/prodSer/precursorCatalog/upload',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//跨断层水准修改审核状态
export function precursorCatalogEditAuditState(data) {
  return request({
    url: '/prodSer/precursorCatalog/editAuditState',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//跨断层水准删除
export function precursorCatalogDel(data) {
  return request({
    url: '/prodSer/precursorCatalog/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//跨断层水准修改
export function precursorCatalogEdit(data) {
  return request({
    url: '/prodSer/precursorCatalog/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//地下流体产品统计
export function ufProdCount(data) {
  return request({
    url: '/prodSer/uf/countDataBySendUnit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//GNSS产品统计
export function gnssProdCount(data) {
  return request({
    url: '/prodSer/pgnss/countDataBySendUnit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//地磁地电定点形变统计
export function catalogProdCount(data) {
  return request({
    url: '/prodSer/precursorCatalog/countDataByDistributionUnit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//技术服务统计
export function prodServeCount(data) {
  return request({
    url: '/prodSer/countDataBySType',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//技术服务统计
export function prodServeSum() {
  return request({
    url: '/prodSer/countData',
    headers: {
      isToken: true
    },
    method: 'post',
  })
}

// 产品地下流体
export function ufCountData(data) {
  return request({
    url: '/prodSer/uf/countData',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 产品水准
export function levelCountData(data) {
  return request({
    url: '/prodSer/level/countData',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 产品GNSS
export function gnssCountData(data) {
  return request({
    url: '/prodSer/pgnss/countData',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 产品其他
export function catalogCountData(data) {
  return request({
    url: '/prodSer/precursorCatalog/countData',
    headers: {
      isToken: false
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
