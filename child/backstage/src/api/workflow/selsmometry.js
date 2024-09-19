import request from '@/utils/request1'
import Qs from 'qs'

// 获取上报单位
export function getCompany(data) {
  return request({
    url: '/seisserver/uploaadunit/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取台网信息
export function getCompanyList(data) {
  return request({
    url: '/seisserver/network/getnetwork',
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取台网分页
export function getNetPageList(data) {
  return request({
    url: '/seisserver/network/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'get',
  })
}
// 获取台站分页
export function getStationPageList(data) {
  return request({
    url: '/seisserver/station/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&netId='+data.netId,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'get',
  })
}
// 查询台站信息
export function getStation(data) {
  return request({
    url: '/seisserver/station/pStation/list',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 新增台站信息
export function addStation(data) {
  return request({
    url: '/seisserver/station/pStation/addStation',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 删除台站信息
export function delStation(data) {
  return request({
    url: '/seisserver/station/pStation/delStation',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 修改台站信息
export function updataStation(data) {
  return request({
    url: '/seisserver/station/pStation/editStation',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 新增台网信息
export function addNetWork(data) {
  return request({
    url: '/seisserver/network/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 修改台网信息
export function updataNetWork(data) {
  return request({
    url: '/seisserver/network/edit',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 删除台网信息
export function delNetWork(data) {
  return request({
    url: '/seisserver/network/del',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

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
  return request({
    url: '/prodSer/listPage?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize,
    headers: {
      isToken: true
    },
    method: 'post',
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

// 获取台网信息
export function getCompanyList2(data) {
  return request({
    url: '/seisserver/network/list', // getnetwork
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取台站数据信息
export function getStationData(data) {
  return request({
    url: '/seisserver/catalogdata/getlist', // getnetwork
    headers: {
      isToken: true,
      // Accept: 'text/plain, */*',
      // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //
    },
    method: 'post',
    data: data
  })
}

// 获取测震统计数目
export function getCount(data) {
  return request({
    url: '/seisserver/catalogdata/getCount?'+data,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'get',
  })
}

// 删除测震台站数据
export function delByStaId(data) {
  return request({
    url: '/seisserver/data/delByStaId?'+data,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      isToken: true
    },
    method: 'get',
  })
}

// 测震解析
export function seiAnaly(data) {
  return request({
    url: '/seisserver/station/pStation/analysis',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//测震提交审核
export function seiGetTaskId(data) {
  return request({
    url: '/seisserver/station/pStation/getTaskId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
//测震查看临时文件
export function seiFindByFileId(data) {
  return request({
    url: '/seisserver/station/pStation/findByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//测震删除临时文件
export function seiDelByFileId(data) {
  return request({
    url: '/seisserver/station/pStation/delByFileId',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

//测震统计
export function seiGetDataNumber() {
  return request({
    url: '/seisserver/catalogdata/getDataNumber',
    headers: {
      isToken: true
    },
    method: 'post',
  })
}

//测震台站导入
export function staImportExcel() {
  return request({
    url: '/seisserver/station/pStation/importExcel',
    headers: {
      isToken: true
    },
    method: 'post',
  })
}

//测震接口统计
export function seisserverApicount(data) {
  return request({
    url: '/seisserver/catalogdata/count',
    headers: {
      isToken: true,
      Accept: 'text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //
    },
    method: 'post',
    data: Qs.stringify({
      uploader: data.uploader,
      getDays: data.getDays,
    })
  })
}
//速报
export function seisserverOR(data) {
  return request({
    url: '/seisserver/OR/countdata',
    headers: {
      isToken: true,
      Accept: 'text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //
    },
    method: 'post',
    data: Qs.stringify({
      uploader: data.uploader,
      getDays: data.getDays,
    })
  })
}
//震源
export function seisserverSMS(data) {
  return request({
    url: '/seisserver/SMS/countdata',
    headers: {
      isToken: true,
      Accept: 'text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //
    },
    method: 'post',
    data: Qs.stringify({
      uploader: data.uploader,
      getDays: data.getDays
    })
  })
}

//震源-西瓜皮
export function seisserverXGP(data) {
  return request({
    url: '/seisserver/XGP/countdata',
    headers: {
      isToken: true,
      Accept: 'text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //
    },
    method: 'post',
    data: Qs.stringify({
      uploader: data.uploader,
      getDays: data.getDays
    })
  })
}

//速报
export function seisserverORList(data) {
  return request({
    url: '/seisserver/OR/list',
    headers: {
      isToken: true,
      Accept: 'text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //
    },
    method: 'post',
    data: Qs.stringify({
      pageNum: data.pageNum,
      pageSize: data.pageSize
    })
  })
}
//震源
export function seisserverSMSList(data) {
  return request({
    url: '/seisserver/SMS/list',
    headers: {
      isToken: true,
      Accept: 'text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //
    },
    method: 'post',
    data: Qs.stringify({
      pageNum: data.pageNum,
      pageSize: data.pageSize
    })
  })
}

//震源-西瓜皮
export function seisserverXGPList(data) {
  return request({
    url: '/seisserver/XGP/list',
    headers: {
      isToken: true,
      Accept: 'text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //
    },
    method: 'post',
    data: Qs.stringify({
      pageNum: data.pageNum,
      pageSize: data.pageSize
    })
  })
}