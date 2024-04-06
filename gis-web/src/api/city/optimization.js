import request from "@/utils/request";

// 查询角色列表
export function listRole(data) {
  return request({
    url: "/city/list",
    method: "get",
    params: data,
  });
}

export function longInvoking(data) {
  return request({
    url: "/calculate/longInvoking",
    method: "post",
    data: data,
  });
}

export function getLongInvokingStatus(data) {
  return request({
    url: "/taskLog/get",
    method: "get",
    params: data,
  });
}

// 查询角色详细
export function getRole(data) {
  return request({
    url: "/city/get",
    method: "get",
    params: data,
  });
}

// 新增角色
export function addRole(data) {
  return request({
    url: "/city/add",
    method: "post",
    data: data,
  });
}

// 修改角色
export function updateRole(data) {
  return request({
    url: "/city/edit",
    method: "post",
    data: data,
  });
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: "/system/role/dataScope",
    method: "put",
    data: data,
  });
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status,
  };
  return request({
    url: "/system/role/changeStatus",
    method: "put",
    data: data,
  });
}

// 删除角色
export function delRole(data) {
  return request({
    url: "/city/delete",
    method: "post",
    data: data,
  });
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: "/system/role/authUser/allocatedList",
    method: "get",
    params: query,
  });
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: "/system/role/authUser/unallocatedList",
    method: "get",
    params: query,
  });
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: "/system/role/authUser/cancel",
    method: "put",
    data: data,
  });
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request({
    url: "/system/role/authUser/cancelAll",
    method: "put",
    params: data,
  });
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: "/system/role/authUser/selectAll",
    method: "put",
    params: data,
  });
}
