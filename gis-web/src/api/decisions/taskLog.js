import request from "@/utils/request";

// 查询角色列表
export function getTaskLogPage(data) {
  return request({
    url: "/taskLog/list",
    method: "get",
    params: data,
  });
}
export function deleteLog(data) {
  return request({
    url: "/taskLog/delete",
    method: "post",
    data: data,
  });
}
