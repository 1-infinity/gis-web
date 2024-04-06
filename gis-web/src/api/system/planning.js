import request from '@/utils/request'

// 查询公告列表
export function listPlanning(query) {
  return request({
    url: '/system/planning/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getPlanning(noticeId) {
  return request({
    url: '/system/planning/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addPlanning(data) {
  return request({
    url: '/system/planning',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updatePlanning(data) {
  return request({
    url: '/system/planning',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delPlanning(noticeId) {
  return request({
    url: '/system/planning/' + noticeId,
    method: 'delete'
  })
}
