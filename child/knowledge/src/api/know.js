import request from '@/utils/request3'
// 获取列表
export function getList(data) {
  let str = '' 
  if(data.typeId){
    str = '/knowledgeserver/knowledge/listPage?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&fileName='+data.fileName+'&typeId='+data.typeId+'&taskState='+data.taskState
  }else {
    str = '/knowledgeserver/knowledge/listPage?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&fileName='+data.fileName+'&taskState='+data.taskState
  }
  return request({
      url: str,
      method: 'get',
    })
  }
// 获取类型列表
export function getTypeList(data) {
  return request({
    url: '/knowledgeserver/knowledgeType/listPage?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'get',
  })
}

// 获权威发布列表
export function getQWList(id) {
    return request({
      url: '/infoserver/sp/qw/getList?spid='+id,
      headers: {
        isToken: true
      },
      method: 'get',
    })
  }
  // 获取列表
export function getEarthList(data) {
    return request({
        url: '/infoserver/sp/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
        headers: {
        isToken: true
        },
        method: 'get',
    })
}
  // 大震新增
  export function earthAdd(data) {
    return request({
        url: '/infoserver/sp/add',
        headers: {
        isToken: true
        },
        method: 'post',
        data:data
    })
}
  // 大震编辑
  export function earthEdit(data) {
    return request({
        url: '/infoserver/sp/edit',
        headers: {
        isToken: true
        },
        method: 'post',
        data:data
    })
}
  // 获取列表
  export function earthDel(data) {
    return request({
        url: '/infoserver/sp/del',
        headers: {
        isToken: true
        },
        method: 'post',
        data:data
    })
}
  // 新增
  export function addKnowleg(data) {
    return request({
        url: '/knowledgeFile/add',
        headers: {
        isToken: true
        },
        method: 'post',
        data:data
    })
}
  // 修改
  export function editKnowleg(data) {
    return request({
        url: '/knowledgeFile/edit',
        headers: {
        isToken: true
        },
        method: 'post',
        data:data
    })
}
  // 删除
  export function deleteKnowleg(data) {
    return request({
        url: '/knowledgeFile/del',
        headers: {
        isToken: true
        },
        method: 'post',
        data:data
    })
}
// 新增类型
export function addType(data) {
  return request({
      url: '/knowledgeType/add',
      headers: {
      isToken: true
      },
      method: 'post',
      data:data
  })
}
// 修改类型
export function editType(data) {
  return request({
      url: '/knowledgeType/edit',
      headers: {
      isToken: true
      },
      method: 'post',
      data:data
  })
}
// 删除类型
export function delType(data) {
  return request({
      url: '/knowledgeType/del',
      headers: {
      isToken: true
      },
      method: 'post',
      data:data
  })
}
// 获取列表
export function getSchoolList(data) {
  return request({
    url: '/knowledgeserver/knowledgeSchool/listPage?'+data,
    method: 'get',
  })
}
// 获取列表
export function getBaseList(data) {
  return request({
    url: '/knowledgeserver/knowledgeBase/listPage?'+data,
    method: 'get',
  })
}
// 获取热点前十列表
export function viewNumberSort() {
  return request({
    url: '/knowledgeserver/knowledge/viewNumberSort',
    headers: {
      isToken: false
    },
    method: 'post',
  })
}
// 观看数加
export function viewNumberAdd(data) {
  return request({
    url: '/knowledgeserver/knowledge/viewNumberAdd',
    method: 'post',
    headers: {
      isToken: false
    },
    data:data
  })
}
