import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/userserver/post/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/userserver/post/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/userserver/post/add',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/userserver/post/edit',
    method: 'post',
    data: data
  })
}

// 删除岗位
export function delPost(postId) {
  return request({
    url: '/userserver/post/' + postId,
    method: 'post'
  })
}
