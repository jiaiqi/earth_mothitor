import request from '@/utils/request9'

// 获取基础数据
export function getBasic(data) {
  return request({
    url: '/geophyserver/basic/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取基础数据
export function getGeophydata(data) {
  return request({
    url: '/geophyserver/geophydata/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取基础数据列表
export function getPageList(data) {
  return request({
    url: '/geophyserver/dr/pageList?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 获取基础数据
export function getList(data) {
  return request({
    url: '/geophyserver/dr/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 修改基础数据
export function editGeo(data) {
  return request({
    url: '/geophyserver/dr/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除基础数据
export function delGeo(data) {
  return request({
    url: '/geophyserver/dr/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获取点基础数据
export function getPointPageList(data) {
  return request({
    url: '/geophyserver/dr/point/pageList?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 修改点基础数据
export function editPoint(data) {
  return request({
    url: '/geophyserver/dr/point/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除点基础数据
export function delPoint(data) {
  return request({
    url: '/geophyserver/dr/point/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 人工地震勘测
export function drillList(data) {
  return request({
    url: '/geophyserver/drill/pageList?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 获取点基础数据
export function getPointDrillList(data) {
  return request({
    url: '/geophyserver/drill/point/pageList?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 删除基础数据
export function delDrill(data) {
  return request({
    url: '/geophyserver/drill/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 修改基础数据
export function editDrill(data) {
  return request({
    url: '/geophyserver/drill/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 修改点基础数据
export function editDrillPoint(data) {
  return request({
    url: '/geophyserver/drill/point/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除点基础数据
export function delDrillPoint(data) {
  return request({
    url: '/geophyserver/drill/point/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 人工地震勘测解析
export function drillAnaly(data) {
  return request({
    url: '/geophyserver/drill/analysis',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//人工地震勘提交审核
export function drillGetTaskId(data) {
  return request({
    url: '/geophyserver/drill/getTaskId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//人工地震勘删除临时文件
export function drillDelByFileId(data) {
  return request({
    url: '/geophyserver/drill/delByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//人工地震勘查看临时文件
export function drillFindByFileId(data) {
  return request({
    url: '/geophyserver/drill/findByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}


// 钻孔联合剖面解析
export function drAnaly(data) {
  return request({
    url: '/geophyserver/manpower/analysis',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//钻孔联合剖面提交审核
export function drGetTaskId(data) {
  return request({
    url: '/geophyserver/manpower/getTaskId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//钻孔联合剖面删除临时文件
export function drDelByFileId(data) {
  return request({
    url: '/geophyserver/manpower/delByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//钻孔联合剖面查看解析结果
export function mpfindByFileId(data) {
  return request({
    url: '/geophyserver/manpower/findByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//深反射临时文件
export function drFindByFileId(data) {
  return request({
    url: '/geophyserver/dr/findByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//深反射解析
export function drAnalysis(data) {
  return request({
    url: '/geophyserver/dr/analysis',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//深反射清除数据
export function DRdelByFileId(data) {
  return request({
    url: '/geophyserver/dr/delByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 删除点基础数据
// export function delPoint(data) {
//   return request({
//     url: '/geophyserver/dr/point/del',
//     headers: {
//       isToken: true
//     },
//     method: 'post',
//     data: data
//   })
// }