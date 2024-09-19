import request from '@/utils/request13'
// 获取列表
export function getList(data) {
    return request({
      url: '/knowledgeserver/knowledge/listPage?'+data,
      // url: '/knowledgeserver/knowledge/listPage?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
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
        url: '/knowledgeserver/knowledgeFile/add',
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
        url: '/knowledgeserver/knowledgeFile/edit',
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
        url: '/knowledgeserver/knowledgeFile/del',
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
      url: '/knowledgeserver/knowledgeType/add',
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
      url: '/knowledgeserver/knowledgeType/edit',
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
      url: '/knowledgeserver/knowledgeType/del',
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
// 获取所有列表
export function getAllSchoolList(data) {
  return request({
    url: '/knowledgeserver/knowledgeSchool/getAll?'+data,
    method: 'get',
  })
}
// 新增学校
export function addSchool(data) {
  return request({
      url: '/knowledgeserver/knowledgeSchool/add',
      headers: {
      isToken: true
      },
      method: 'post',
      data:data
  })
}
// 修改学校
export function editSchool(data) {
  return request({
      url: '/knowledgeserver/knowledgeSchool/edit',
      headers: {
      isToken: true
      },
      method: 'post',
      data:data
  })
}
// 删除学校
export function delSchool(data) {
  return request({
      url: '/knowledgeserver/knowledgeSchool/del',
      headers: {
      isToken: true
      },
      method: 'post',
      data:data
  })
}
// 订单列表
export function pagelist2(data) {
  return request({
      url: '/orderBasic/pagelist',
      headers: {
      isToken: true
      },
      method: 'get',
  })
}
// 获取基地列表
export function getBaseList(data) {
  return request({
    url: '/knowledgeserver/knowledgeBase/listPage?'+data,
    method: 'get',
  })
}
// 获取基地列表
export function getAllBaseList(data) {
  return request({
    url: '/knowledgeserver/knowledgeBase/getAll?'+data,
    method: 'get',
  })
}
// 新增基地
export function addBase(data) {
  return request({
      url: '/knowledgeserver/knowledgeBase/add',
      headers: {
      isToken: true
      },
      method: 'post',
      data:data
  })
}
// 修改基地
export function editBase(data) {
  return request({
      url: '/knowledgeserver/knowledgeBase/edit',
      headers: {
      isToken: true
      },
      method: 'post',
      data:data
  })
}
// 删除基地
export function delBase(data) {
  return request({
      url: '/knowledgeserver/knowledgeBase/del',
      headers: {
      isToken: true
      },
      method: 'post',
      data:data
  })
}
// 获得所有列表
export function getAll(data) {
  return request({
      url: '/knowledgeserver/knowledge/getAll?'+data,
      headers: {
      isToken: true
      },
      method: 'get',
  })
}

// 科普统计
export function knowledgeCount(data) {
  return request({
      url: '/knowledgeserver/knowledgeFile/countdata',
      headers: {
        isToken: true
      },
      method: 'post',
      data:data
  })
}

