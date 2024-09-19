import request from '@/utils/request1'

// 产品成果
export function getlist(data) {
  let url = ''
  url = '/infoserver/sp/major/pageList?pageNum='+data.pageNum+'&pageSize='+data.pageSize+'&type='
    +data.type+'&year='+data.year+'&betyear='+data.betyear+'&m='+data.m+'&betm='+data.betm
    +'&dm='+data.dm+'&betDM='+data.betDM+'&slon='+data.slon+'&elon='+data.elon
    +'&slat='+data.slat+'&elat='+data.elat
  if(data.localname){
    url += '&localname='+data.localname
  }
  return request({
    url: url,
    headers: {
      isToken: true
    },
    method: 'get',
  })
}

// 产品成果(非分页)
export function getlist2(data) {
  return request({
    url: '/infoserver/sp/major/getList',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
