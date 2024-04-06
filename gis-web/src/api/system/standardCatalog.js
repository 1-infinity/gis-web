import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/system/standardCatalog/list',
    method: 'get',
    params: query
  })
}

// 查询树
export function TreeData(query) {
  return request({
    url: '/system/standardCatalog/tree',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getTreeData(dictCode) {
  return request({
    url: '/system/standardCatalog/' + dictCode,
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
export function addData(data) {
  return request({
    url: '/system/standardCatalog',
    method: 'post',
    data: data
  })
}

// 修改数据
export function updateData(data) {
  return request({
    url: '/system/standardCatalog',
    method: 'put',
    data: data
  })
}

// 删除数据
export function delData(ids) {
  return request({
    url: '/system/standardCatalog/remove',
    method: 'post',
    data: {
      ids: ids
    }
  })
}
