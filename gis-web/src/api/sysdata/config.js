import request from '@/utils/request'

// 查询标准数据配置列表
export function listConfig(query) {
  return request({
    url: '/sysdata/config/list',
    method: 'get',
    params: query
  })
}

// 查询标准数据配置详情列表
export function detailListConfig(query) {
  return request({
    url: '/sysdata/detail/list',
    method: 'get',
    params: query
  })
}

// 查询标准数据配置详情
export function detailList(query) {
  return request({
    url: '/sysdata/detail/detailList',
    method: 'get',
    params: query
  })
}

// 查询标准数据配置详细
export function getConfig(id) {
  return request({
    url: '/sysdata/config/' + id,
    method: 'get'
  })
}

// 新增标准数据配置
export function addConfig(data) {
  return request({
    url: '/sysdata/config',
    method: 'post',
    data: data
  })
}

// 修改标准数据配置
export function updateConfig(data) {
  return request({
    url: '/sysdata/config',
    method: 'put',
    data: data
  })
}

// 删除标准数据配置
export function delConfig(id) {
  return request({
    url: '/sysdata/config/' + id,
    method: 'delete'
  })
}

// 爬取数据
export function fetchData(id) {
  return request({
    url: '/sysdata/config/fetchData/' + id,
    method: 'get'
  })
}

// 删除标准数据配置
export function fileZip(id) {
  return request({
    url: '/sysdata/config/exportData/' + id,
    method: 'get',
    responseType: 'blob',
    timeout: 600000
  })
}
