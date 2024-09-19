import request from '@/utils/request1'

// 新增对话
export function addSession(data) {
  return request({
    url: '/replyserver/history/add',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除对话
export function delSession(data) {
    return request({
      url: '/replyserver/history/del',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
    })
  }
// 对话列表
export function getSessionList(data) {
  let url = ''
  if(data == ''){
    url = '/replyserver/history/list'
  }else{
    url = '/replyserver/history/list?'+data
  }
    return request({
      url: url,
      headers: {
        isToken: true
      },
      method: 'get',
    })
  }

// 对话信息列表
export function getReplyList(data) {
    return request({
      url: '/replyserver/reply/list?'+data,
      headers: {
        isToken: true
      },
      method: 'get',
    })
  }
// 新增对话
export function addReply(data) {
    return request({
      url: '/replyserver/reply/add',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
    })
  }
  // 获取未读数量
export function deleteReply(data) {
    return request({
      url: '/replyserver/reply/delete',
      headers: {
        isToken: true
      },
      method: 'post',
      data: data
    })
  }
// 获取未读数量
export function unreadNum(data) {
    return request({
      url: '/replyserver/reply/unreadNum?'+data,
      headers: {
        isToken: true
      },
      method: 'post',
    })
  }

  //子站查询
export function childSpotList(data) {
  return request({
    url: '/replyserver/substation/pageList',
    headers: {
      isToken: true
    },
    data: data,
    method: 'post',
  })
}