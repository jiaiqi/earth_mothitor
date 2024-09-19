import request from '@/utils/request14'

// 获取
export function getList(data) {
  return request({
    url: '/collectserver/collectUser/listPage?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 获取浏览量
export function getPVStat(data) {
  return request({
    url: '/collectserver/viewNumber/getPVStatisticData?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 获取访客量
export function getUVStat(data) {
  return request({
    url: '/collectserver/viewNumber/getUVStatisticData?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 获取总访客量
export function AllViewNumber(data) {
  return request({
    url: '/collectserver/viewNumber/getAllViewNumber?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 获取用户在线人数
export function getOnlineNum(data) {
  return request({
    url: '/collectserver/collectUser/collectOnlineNum?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 前台新闻列表
export function getNewsAll(data) {
  return request({
    url: '/collectserver/news/getAll?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 前台新闻列表新增
export function getNewsAdd(data) {
  return request({
    url: '/collectserver/news/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 前台新闻列表修改
export function getNewsEdit(data) {
  return request({
    url: '/collectserver/news/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 前台新闻列表删除
export function getNewsDel(data) {
  return request({
    url: '/collectserver/news/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 学科分类列表
export function getSubAll(data) {
  return request({
    url: '/collectserver/subjectMsg/getAll?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 学科新增
export function addSub(data) {
  return request({
    url: '/collectserver/subjectMsg/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 学科编辑
export function editSub(data) {
  return request({
    url: '/collectserver/subjectMsg/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 学科删除
export function delSub(data) {
  return request({
    url: '/collectserver/subjectMsg/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 学科类型列表
export function getTypeDic(data) {
  return request({
    url: '/collectserver/typeDic/listPage?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 学科分类列表
export function getListPage(data) {
  return request({
    url: '/collectserver/subjectMsg/listPage?'+data,
    headers: {
      isToken: false
    },
    method: 'get',
  })
}
// 学科类型新增
export function addTypeDic(data) {
  return request({
    url: '/collectserver/typeDic/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 学科类型编辑
export function editTypeDic(data) {
  return request({
    url: '/collectserver/typeDic/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 学科类型删除
export function delTypeDic(data) {
  return request({
    url: '/collectserver/typeDic/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 热点数据列表
export function getFlagList(data) {
  return request({
    url: '/collectserver/hotSpot/listPage?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}
// 热点推荐新增
export function hotAdd(data) {
  return request({
    url: '/collectserver/hotSpot/hotAdd',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 热点数据新增
export function hotDataAdd(data) {
  return request({
    url: '/collectserver/hotSpot/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 热点数据修改
export function hotEdit(data) {
  return request({
    url: '/collectserver/hotSpot/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 热点数据删除
export function hotDel(data) {
  return request({
    url: '/collectserver/hotSpot/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 学科提供单位统计
export function getCountByQuarter(data) {
  return request({
    url: '/collectserver/subjectDateCount/getCountByQuarter?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

//所有单位统计
export function getCount(data) {
  return request({
    url: '/collectserver/subjectDateCount/getCount?'+data,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}


// 统计数据模块


// 统计测震
export function getDataNumber(data) {
  return request({
    url: '/seisserver/catalogdata/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 统计GNSS
export function getGNSSDataNumber(data) {
  return request({
    url: '/gnss/continuous/data/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 强震数据
export function getStrongNumber(data) {
  return request({
    url: '/strongserver/shockcatalogdata/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 地下流体数据
export function getUpderFluidNumber(data) {
  return request({
    url: '/precursorserver/upderFluid/data/getNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 地球物理
export function getPreDataNumber(data) {
  return request({
    url: '/precursorserver/predata/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 科学台阵
export function getCataDataNumber(data) {
  return request({
    url: '/arrayserver/arraycatalogdata/getDataNumber',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 水准
export function getLevelDataNumber(data) {
  return request({
    url: '/levelserver/levelline/countdata',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}