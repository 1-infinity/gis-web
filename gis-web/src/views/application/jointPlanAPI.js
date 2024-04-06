import axios from 'axios'
import ajax from "../simulator/ajax";
import serverInfo from "../simulator/serverInfo";

// 指定taskId, 获取flood_record记录
// GET 8000/simulation/getFloodRecord
// 请求参数:{taskId}
// 返回taskId对应的25条flood_record的数据
export async function getFloodRecord(taskid) {
  let requestUrl = `simulation/getFloodRecord`
  let data = {taskid}
  return ajax(requestUrl, data)
}

// 指定taskId，获取规划决策建议
// 8000/simulation/FloodSimulationSQ
// 请求参数: {taskId}
export async function getAdvice(taskid, timestep) {
  let requestUrl = `simulation/FloodSimulationSQ`
  let data = {taskid, timestep}
  return ajax(requestUrl, data)
}
