import request from '@/utils/request3'
// 获取速报列表
export function getEveList(data) {
    return request({
      url: '/infoserver/sb/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&m='+data.m,
      headers: {
        isToken: true
      },
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
// 权威发布新增
export function addQW(data) {
  return request({
    url: '/infoserver/sp/qw/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
  // 权威发布修改
export function editQW(data) {
  return request({
      url: '/infoserver/sp/qw/edit',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
  })
}
// 权威发布删除
export function delQW(data) {
  return request({
      url: '/infoserver/sp/qw/del',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
  })
}


// 专家产品
export function getCatalogList(id) {
  return request({
    url: '/infoserver/sp/catalog/getList?spid='+id,
    headers: {
      isToken: true
    },
    method: 'get', 
  })
}
// 专家产品新增
export function addCatalog(data) {
return request({
  url: '/infoserver/sp/catalog/add',
  headers: {
    isToken: true
  },
  method: 'post',
  data: data
})
}
// 专家产品修改
export function editCatalog(data) {
return request({
    url: '/infoserver/sp/catalog/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
})
}
// 专家产品删除
export function delCatalog(data) {
return request({
    url: '/infoserver/sp/catalog/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
})
}


  // 获取列表
export function getEarthList(data) {
    return request({
        url: '/infoserver/sp/pageList?'+data,
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
// 获权最新动态列表
export function getConfList(id) {
  return request({
    url: '/infoserver/sp/conf/getList',
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 新增最新动态
export function addConfList(data) {
  return request({
    url: '/infoserver/sp/conf/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除最新动态
export function delConfList(data) {
  return request({
    url: '/infoserver/sp/conf/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
export function editConfList(data) {
  return request({
    url: '/infoserver/sp/conf/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获权专家研讨
export function getZJList(data) {
  return request({
    url: '/infoserver/sp/zj/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&spid='+data.spid,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 新增专家研讨
export function addZJ(data) {
  return request({
    url: '/infoserver/sp/zj/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 修改专家研讨
export function editZJ(data) {
  return request({
    url: '/infoserver/sp/zj/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除专家研讨
export function delZJ(data) {
  return request({
    url: '/infoserver/sp/zj/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获权最新动态
export function getNewList(data) {
  return request({
    url: '/infoserver/sp/dt/getList?spid='+data.spid,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 新增最新动态
export function addNew(data) {
  return request({
    url: '/infoserver/sp/dt/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 修改最新动态
export function editNew(data) {
  return request({
    url: '/infoserver/sp/dt/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除专家研讨
export function delNew(data) {
  return request({
    url: '/infoserver/sp/dt/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
