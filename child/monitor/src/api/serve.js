import request from '@/utils/request10'

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

// 查询产品列表
export function getProdList(data) {
  return request({
    url: '/prodSer/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 查询产品列表分页
export function getPageList(data) {
  let str = '/prodSer/listPage?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize + '&like=' + data.sClassification + '&type=' + data.sType + '&name=' + data.sName + '&unit=' + data.cUnit+'&status=1'
  if(data.sort){
    str += '&sort='+data.sort
  }
  return request({
    url: str,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 子站简单查询产品
export function getPageListChild(data) {
  let str = '/prodSer/listPage?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize +'&unit=' + data.cUnit+'&status=1'
  return request({
    url: str,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 增加浏览量
export function addRemod(data) {
  return request({
    url: '/prodSer/addRemod',
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
  return request({
    url: '/prodSer/proListPage?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&status=1' + classStr + nameStr + unitStr,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
export function getClassification(data) {
  return request({
    url: '/prodSer/classification',
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
//产品图片
export function getLinkFileImg(data) {
  return request({
    url: '/prodSer/getLinkFile?id='+data.id,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

//产品服务全列表搜索
export function queryContent(data) {
  return request({
    url: '/prodSer/prodSearch',
    method: 'post',
    data: data
  })
}

//技术服务全列表搜索
export function skillSearch(data) {
  return request({
    url: '/prodSer/skillSearch',
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

//产品震害防御列表
export function ConditionsList(data) {
  return request({
    url: '/prodSer/pgnss/ConditionsList',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
