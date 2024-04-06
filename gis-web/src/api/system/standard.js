import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/system/standard/list',
    method: 'get',
    params: query
  })
}

//查询标准
export function listStandard(params) {
  return request({
    url: '/system/standard/list',
    method: 'get',
    params
  })
}

// 查询详细
export function getData(dictCode) {
  return request({
    url: '/system/standard/' + dictCode,
    method: 'get'
  })
}

// 查询数据字典
export function getDictData(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

// 新增数据
export function addStandardData(data) {
  return request({
    url: '/system/standard',
    method: 'post',
    data: data
  })
}

// 修改数据
export function updateStandardData(data) {
  return request({
    url: '/system/standard',
    method: 'put',
    data: data
  })
}

// 删除数据
export function delStandardData(ids) {
  return request({
    url: '/system/standard/remove',
    method: 'post',
    data: {
      ids: ids
    }
  })
}
