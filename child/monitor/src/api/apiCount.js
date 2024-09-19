import request from '@/utils/request3'
import Qs from 'qs'

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

  // 前兆统计
export function precataCount(data) {
    return request({
      url: '/precursorserver/predata/count',
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