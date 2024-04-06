import axios from 'axios'
import ajax from "../simulator/ajax";
import serverInfo from "../simulator/serverInfo";
import * as mapUtils from "./mapUtils";

// POST 8006/searchPlans
// 请求参数:{city}
// city: 城市名，英文小写
// simulationTime: 模拟的时间
// setMeasureData: 一个函数，用于修改存储不同规划方案的城市韧性的对象
// requiredSchemes, 需要生成的设施列表
// sendMessage: 一个函数，用于发送全局提示
export async function getPlansInfo(city, simulationTime, setMeasureData, requiredSchemes, sendMessage) {
  let emergencyPlansAtTime = {}  //结构化存储所有的应急方案

  let times = [4, 8, 12, 16, 20, 24]
  let plansName = ["综合方案", "侧重覆盖人数", "侧重疏散时间", "侧重成本"]
  const schemes = { "Shelter": '避难场所', "Supply": '应急物资供应', "Aid": '急救站', 'mobileCabinHospital': '方舱医院' }
  const allowedType = { "alternative_point": '候选点', "risk": '风险点', "result": '风险点至候选点路线' }
  const levelNames = {
    1: "小雨",
    2: "中雨",
    3: "大雨",
    4: "暴雨",
    5: "大暴雨",
    6: "特大暴雨"
  };

  const planNameMapping = [12, 24] //这是一个为了展示, 临时设置的常量

  let url = serverInfo.baseURL_file + "/searchPlans"
  let formData = new FormData()
  formData.append("city", city)
  let headers = {
    "Content-Type": "multipart/form-data",
  }
  let files = {}
  await axios.post(url, formData, { headers })
    .then((res) => {
      if (res.data.status === true) {
        // //假设有res.data.plansName这个属性, 作为一个列表返回了所有方案的名称
        // if(res.data['plansName']) plansName = res.data['plansName']
        // else res.data['plansName'] = plansName
        plansName = res.data['plansName']

        //此处根据后端返回的 方案数 构建 emergencyPlansAtTime的外层结构
        for (let time of times) {
          emergencyPlansAtTime[time] = []
          for (let i = 0; i < plansName.length; ++i) {  //目录的第一级为 方案号
            emergencyPlansAtTime[time].push({
              label: `方案${i+1}-`+ plansName[i],
              children: [],
              disabled: true,
            })
            for (let key of requiredSchemes) {  //目录的第二级为 方案类型
              emergencyPlansAtTime[time][i].children.push({
                label: schemes[key],
                children: [],
              })
            }
          }
        }
        console.log("emergencyPlansAtTime:",emergencyPlansAtTime)
        //只保留指定的"scheme"和"type"的信息
        files = res.data.files.filter((item) => {
          // return requiredSchemes.indexOf(item.sheme) > -1 && Object.keys(allowedType).indexOf(item.type) > -1 && planNameMapping.indexOf(item.time) > -1 && item.level > 4  //这是一句使用的临时代码
          return requiredSchemes.indexOf(item.sheme) > -1 && Object.keys(allowedType).indexOf(item.type) > -1
        })

        //根据保留下来的信息，构建 前端展示数据emergencyPlansAtTime
        files.forEach((item) => {
          //假设有res.data.files.planNumber 这个属性
          // if(!item.planNumber) {
          //   item["planNumber"] = planNameMapping.indexOf(item.time) //这是一句使用的临时代码
          //   if (item.level == 6) item.planNumber += 2  //临时使用的代码
          // }

          // item["label"] = `${plansName[item.planNumber]}-${schemes[item.sheme]}-${allowedType[item.type]}`
          item["label"] = `${plansName[item.planNumber-1]}-${schemes[item.sheme]}-${levelNames[item.level]}-${allowedType[item.type]}`
          item["layerName"] = `${item.planNumber}-${item.sheme}-${item.level}-${item.time}-${item.type}`
          // for (let time of times)
          // emergencyPlansAtTime[time][item.planNumber - 1].children[requiredSchemes.indexOf(item.sheme)].children.push(item)
          emergencyPlansAtTime[item.time][item.planNumber - 1].children[requiredSchemes.indexOf(item.sheme)].children.push(item)
        })
      }
    })
    .catch((err) => sendMessage("获取应急选址结果信息失败" + err, "error"))

  // 将城市现状加入到柱状图显示中
  plansName = ["城市现状", ...plansName]
  // 此处对展示在 柱状图中的数据格式 进行设置
  setMeasureData('yData', plansName)
  // let xData = {}
  // for(let key of requiredSchemes){
  //   xData[schemes[key]] = []
  //   for(let i=0 ; i < plansName.length; ++i){
  //     xData[schemes[key]].push(0.5)
  //   }
  // }
  // //此处对展示在 柱状图中的数据内容 进行填充
  // let promiseList = []
  // for(let item of files){
  //   promiseList.push(calculateMeasureData(city, item.sheme, item.level, item.planNumber))
  // }
  // await Promise.all([promiseList])
  // for(let item of files){
  //   await getMeasureData(city, item.sheme, item.level, item.planNumber).then((index) =>{
  //     xData[schemes[item.sheme]][item.planNumber] = parseFloat(index)
  //   })
  // }
  setMeasureData('xData', mockMeasureXData['4'])
  return emergencyPlansAtTime
}

// export async function getPlansInfoByTime(city, simulationTime, setMeasureData, requiredSchemes, sendMessage){
//   let emergencyPlans = []  //结构化存储所有的应急方案
//   const schemes = {"Shelter": '避难场所', "Supply": '应急物资供应', "Aid": '急救站', 'mobileCabinHospital': '方舱医院'}
//   const allowedType = {"alternative_point": '候选点', "risk": '风险点', "result": '风险点至候选点路线'}
//   let plansName = ["城市现状", "综合方案", "侧重覆盖人数", "侧重疏散时间", "侧重成本"]
//
//   const planNameMapping = [12, 24] //这是一个为了展示, 临时设置的常量
//
//   let formData = new FormData()
//   formData.append("city", city)
//   let url = serverInfo.baseURL_file + "/searchPlan"
//   let headers = {
//     "Content-Type": "multipart/form-data",
//   }
//   let files = {}
//   await axios.post(url, formData, {headers})
//     .then((res)=>{
//       if(res.data.status === true) {
//         //假设有res.data.plansName这个属性, 作为一个列表返回了所有方案的名称
//         if(res.data['plansName']){
//           plansName = ["城市现状", ...res.data['plansName']]
//         } else{
//           res.data['plansName'] = plansName
//         }
//         //此处根据后端返回的 方案数 构建 前端展示数据的目录
//         for(let i = 0; i < plansName.length; ++i) {  //目录的第一级为 方案号
//           emergencyPlans.push({
//             label: plansName[i],
//             children:[],
//             disabled: true,
//           })
//           for(let key of requiredSchemes){  //目录的第二级为 方案类型
//             emergencyPlans[i].children.push({
//               label: schemes[key],
//               children: [],
//             })
//           }
//         }
//
//         //只保留指定的"scheme"和"type"的信息
//         files = res.data.files.filter((item)=>{
//           return requiredSchemes.indexOf(item.sheme) > -1 && Object.keys(allowedType).indexOf(item.type) > -1 && planNameMapping.indexOf(item.time) > -1 && item.level > 4  //这是一句使用的临时代码
//         })
//         console.log(files.length)
//         //根据保留下来的信息，构建 前端展示数据emergencyPlans
//         files.forEach((item) => {
//           //假设有res.data.files.planNumber 这个属性
//           if(!item.planNumber) {
//             item["planNumber"] = planNameMapping.indexOf(item.time) //这是一句使用的临时代码
//             if (item.level == 6) item.planNumber += 2  //临时使用的代码
//           }
//
//           item["label"] = `${ plansName[item.planNumber] }-${ schemes[item.sheme] }-${ allowedType[item.type] }`
//           emergencyPlans[item.planNumber].children[requiredSchemes.indexOf(item.sheme)].children.push(item)
//         })
//       }
//     })
//     .catch((err) => sendMessage("获取应急选址结果信息失败" + err, "error"))
//
//   //此处对展示在 柱状图中的数据格式 进行设置
//   setMeasureData('yData', plansName)
//   let xData = {}
//   for(let key of requiredSchemes){
//     xData[schemes[key]] = []
//     for(let i=0 ; i < plansName.length; ++i){
//       xData[schemes[key]].push(0.5)
//     }
//   }
//   // let promiseList = []
//   //此处对展示在 柱状图中的数据内容 进行填充
//   let promiseList = []
//   for(let item of files){
//     promiseList.push(calculateMeasureData(city, item.sheme, item.level, item.planNumber))
//   }
//   await Promise.all([promiseList])
//   for(let item of files){
//     await getMeasureData(city, item.sheme, item.level, item.planNumber).then((index) =>{
//       xData[schemes[item.sheme]][item.planNumber] = parseFloat(index)
//     })
//   }
//   // console.log(xData)
//   setMeasureData('xData', xData)
//   // for await (let p of promiseList){
//   //   p.then((res) => {
//   //     measureReturnList.push(getMeasureData(city, item.sheme, item.level))
//   //   })
//   // }
//   // await Promise.all(measureReturnList)
//   // .then((index)=>{
//   //   xData[schemes[item.sheme]][item.planNumber] = parseFloat(index)
//   // }))
//
//
//
//   // for await (let item of files){
//   //   //这个外层的判断条件是为了展示，临时加上去的
//   //   if(item.level == 3){
//   //     if(item.type == "result"){
//   //       calculateMeasureData(city, item.sheme, item.level).then(res => {
//   //         console.log("calculateAPIres:", res)
//   //         await getMeasureData(city, item.sheme, item.level).then((index)=>{
//   //           xData[schemes[item.sheme]][item.planNumber] = parseFloat(index)
//   //           updatexData()
//   //         }).catch(err=>{
//   //           updatexData()
//   //           sendMessage("韧性指标数据获取失败: " + err, "error")
//   //         })
//   //       }).catch((err)=>{
//   //         updatexData()
//   //         sendMessage("韧性指标数据计算失败: " + err, "error")
//   //       })
//   //     }
//   //   }
//   // }
//   // setMeasureData('xData', xData)
//   return emergencyPlans
// }


// GET 8000/information/gisdata/{city}/{scheme}/{rainLevel}/{time}/{type}
// 获取应急选址结果
// bindThis: vue实例的this, 用于创建
// city: 城市名，英文小写
// data: 在getPlansInfo中获取，经过处理的planInfo对象
export async function getPlanView(city, data) {
  try {
    // let url = `information/gisdata/${city}/${data.sheme}/${data.level}/${data.time}/${data.type}`;
    let url = `information/gisdata/${city}/${data.planNumber}/${data.sheme}/${data.level}/${data.time}/${data.type}`;
    return ajax(url);
    console.log(`获取应急选址结果数据 ${data.label} 成功！`);
  }
  catch {
    console.log(`获取应急选址结果数据 ${data.label} 失败！`);
  }

}

//  GET 8000/information/gisMeasureData/{city}/{scheme}/{rainLevel}
//  city: 城市名 英文小写
//  scheme: ['Aid', 'Break', 'Supply', 'Shelter']
//  rainLevel: [1, 2, 3, 4, 5, 6]
//  planNumber: [0, 1, 2, 3]
export async function getMeasureData(city, scheme, rainLevel, planNumber) {

  // let requestUrl = `information/gisMeasureData/${city}/${scheme}/${rainLevel}`
  let requestUrl = `information/gisMeasureData/${city}/${planNumber}/${scheme}/${rainLevel}`
  let index
  await ajax(requestUrl).then((res) => {
    //这里还要改
    if (planNumber % 2 == 1)
      index = res[0].value
    else index = res[1].value
  })
  .catch((err) => {
    console.log("应急规划方案的韧性指标 get报错: " + err)
  })
  return index
}

//  POST 8000/simulation/scoreSimulator/${city}/${scheme}/${rainLevel}
//  city: 城市名 英文小写
//  scheme: ['Aid', 'Break', 'Supply', 'Shelter']
//  rainLevel: [1, 2, 3, 4, 5, 6]
//  planNumber: [0, 1, 2, 3]
export async function calculateMeasureData(city, scheme, rainLevel, planNumber) {
  // let requestUrl = serverInfo.baseURL + `/simulation/scoreSimulator/${city}/${scheme}/${rainLevel}`
  let requestUrl = serverInfo.baseURL + `/simulation/scoreSimulator/${city}/${planNumber}/${scheme}/${rainLevel}`
  let headers = {
    "Content-Type": "multipart/form-data",
  }
  let formData = new FormData()
  return axios.post(requestUrl, formData, { headers }).
  then((res) => {
    // console.log(res)
  }).catch((err) => {
    console.log("应急规划方案的韧性指标 calculate报错: ", err)
  })
}

// 用于 请求计算 常态下 8个 日常/应急 城市服务指标
// POST 8000/simulation/measureNoSimulator
// city: 城市名 英文小写
// mapName: 使用的规划方案底图的名称
// planId: 使用的规划方案的Id
// scheme: 需要计算的城市服务类型 ['Aid', 'Break', 'Supply', 'Shelter', 'Shopping', 'Hospital', 'Work', 'School']
export async function calculateMeasureNoSimulator(city, mapName, planId, scheme){
  // console.log("entered calculateMeasureNoSimulator")
  let requestUrl = serverInfo.baseURL + `/simulation/measureNoSimulator`
  let headers = {
    "Content-Type": "multipart/form-data",
  }
  let formData = new FormData()
  formData.append("city", city)
  formData.append("mapName", mapName)
  formData.append("planId", planId + '')
  formData.append("scheme", scheme)
  return axios.post(requestUrl, formData, {headers})
    // .then(res => {
    //   // console.log(res)
    // })
    // .catch(err => {
    //   console.log("measureNoSimulator calculate报错: ", err)
    // })
}

//用于 获取 常态下 8个 日常/应急 城市服务指标
// GET 8000/simulation/getMeasureNoSimulator
// city: 城市名 英文小写
// mapName: 使用的规划方案底图的名称
// planId: 使用的规划方案的Id
// scheme: 需要计算的城市服务类型 ['Aid', 'Break', 'Supply', 'Shelter', 'Shopping', 'Hospital', 'Work', 'School']
export async function getMeasureNoSimulator(city, mapName, planId, scheme){
  // console.log("emitted getMeasureNoSimulator Request", scheme)
  let requestUrl = `simulation/getMeasureNoSimulator`
  let data = {
    city, mapName, planId, scheme
  }
  return ajax(requestUrl, data)
    // .then((data) => {
    //   // console.log(res)
    //   return data
    // })
    // .catch((err) => {
    //   console.log("measureNoSimulator get报错: ", err)
    // })
}


// 用于 请求计算 有模拟场景下 8个 日常/应急 城市服务指标
// POST 8000/simulation/measureSimulator
// city: 城市名 英文小写
// mapName: 使用的规划方案底图的名称
// planId: 使用的规划方案的Id
// taskId: 模拟任务的Id
// type: 灾害模拟类型 ["flood", "infection"]
// time: 模拟经过的时刻 ["4", "8", "12", "16", "20", "24"]
// scheme: 需要计算的城市服务类型 ['Aid', 'Break', 'Supply', 'Shelter', 'Shopping', 'Hospital', 'Work', 'School']
export async function calculateMeasureSimulator(city, mapName, planId, taskId, type, time, scheme){
  let requestUrl = serverInfo.baseURL + `/simulation/measureSimulator`
  let headers = {
    "Content-Type": "multipart/form-data",
  }
  let formData = new FormData()
  formData.append("city", city)
  formData.append("mapName", mapName)
  formData.append("planId", planId + '')
  formData.append("taskId", taskId)
  formData.append("type", type)
  formData.append("time", time)
  formData.append("scheme", scheme)
  return axios.post(requestUrl, formData, {headers})
    // .then(res => {
    //
    // })
    // .catch(err => {
    //   console.log("measureSimulator calculate报错: ", err)
    // })
}

// 用于 获取 有模拟场景下 8个 日常/应急 城市服务指标
// POST 8000/simulation/getMeasureSimulator
// city: 城市名 英文小写
// mapName: 使用的规划方案底图的名称
// planId: 使用的规划方案的Id
// taskId: 模拟任务的Id
// type: 灾害模拟类型 ["flood", "infection"]
// time: 模拟经过的时刻 ["4", "8", "12", "16", "20", "24"]
// scheme: 需要计算的城市服务类型 ['Aid', 'Break', 'Supply', 'Shelter', 'Shopping', 'Hospital', 'Work', 'School']
export async function getMeasureSimulator(city, mapName, planId, taskId, type, time, scheme){
  let requestUrl = `simulation/getMeasureSimulator`
  let data = {
    city, mapName, planId, taskId, type, time, scheme
  }
  return ajax(requestUrl, data)
    // .then((data) => {
    //   return data
    // })
    // .catch((err) => {
    //   console.log("measureSimulator get报错: ", err)
    // })
}


// 用于 请求计算 传染病模拟场景下 8个 日常/应急 城市服务指标
// POST 8000/simulation/infectionMeasureSimulator
// city: 城市名 英文小写
// mapName: 使用的规划方案底图的名称
// scheme: 需要计算的城市服务类型 ['Aid', 'Break', 'Supply', 'Shelter', 'Shopping', 'Hospital', 'Work', 'School']
// date: 模拟的天数
// time: 模拟经过的时刻 1-24  
// date和time都为0时表示手动控制区域流动性，否则表示强化学习动态控制区域流动性
export async function calculateInfectionMeasureSimulator(city, mapName, date, time, scheme, filename){
  let requestUrl = serverInfo.baseURL + `/simulation/infectionMeasureSimulator`
  let headers = {
    "Content-Type": "multipart/form-data",
  }
  let formData = new FormData()
  formData.append("city", city)
  formData.append("mapName", mapName)
  formData.append("date", date)
  formData.append("time", time)
  formData.append("scheme", scheme)
  formData.append("filename", filename)
  return axios.post(requestUrl, formData, {headers})

}

// 用于 获取 传染病模拟场景下 8个 日常/应急 城市服务指标
// POST 8000/simulation/getInfectionMeasureSimulator
// city: 城市名 英文小写
// mapName: 使用的规划方案底图的名称
// scheme: 需要计算的城市服务类型 ['Aid', 'Break', 'Supply', 'Shelter', 'Shopping', 'Hospital', 'Work', 'School']
// date: 模拟的天数
// time: 模拟经过的时刻 1-24  
// date和time都为0时表示手动控制区域流动性，否则表示强化学习动态控制区域流动性
export async function getInfectionMeasureSimulator(city, mapName, date, time, scheme, filename){
  let requestUrl = `simulation/getInfectionMeasureSimulator`
  let data = {
    city, mapName, date, time, scheme, filename
  }
  return ajax(requestUrl, data)

}

//指定城市，城市底图，降雨量，请求进行 指定洪涝严重程度 的模拟
// 8000/simulation/magnitude
// city: 城市名，英文小写
// mapName: 使用的规划方案底图的名称
// disturbance: 一个对象，其中定义了降雨量参数
// magnitude: 洪涝灾害的严重程度
export async function calculateMagnitude(city, mapName, disturbance, magnitude){
  let requestUrl = serverInfo.baseURL + `/simulation/magnitude`
  let headers = {
    "Content-Type": "multipart/form-data",
  }
  let formData = new FormData()
  formData.append("city", city)
  formData.append("mapName", mapName)
  // formData.append("disturbance", disturbance)
  formData.append("disturbance", JSON.stringify(disturbance))
  formData.append("magnitude", magnitude)
  return axios.post(requestUrl, formData, {headers})
}

//获知指定 城市，城市底图，降雨量 的模拟是否完成
// 8000/simulation/getMagnitude
// city: 城市名，英文小写
// mapName: 使用的规划方案底图的名称
// magnitude: 洪涝灾害的严重程度
export async function getMagnitude(city, mapName, magnitude){
  let requestUrl = `simulation/getMagnitude`
  let data = {
    city, mapName, magnitude
  }
  return ajax(requestUrl, data)
    // .then((res) => {
    //   return res
    // })
    // .catch((err) => {
    //   console.log("指定 洪涝严重程度 的模拟任务 get失败", err)
    // })
}


//计算不同洪涝严重程度下的城市服务平均指标
// POST: 8000/simulation/calculateEvenMeasure
// city: 城市名，英文小写
// mapName: 使用的规划方案底图的名称
// planId: 规划方案的id
export async function calculateEvenMeasure(city, mapName, planId) {
  let requestUrl = serverInfo.baseURL + `/simulation/calculateEvenMeasure`
  let headers = {
    "Content-Type": "multipart/form-data",
  }
  let formData = new FormData()
  formData.append("city", city)
  formData.append("mapName", mapName)
  formData.append("planId", planId)
  return axios.post(requestUrl, formData, {headers})
    // .then(res => {
    // })
    // .catch(err => {
    //   console.log("不同洪涝严重程度下的城市服务平均指标 calculate失败", err)
    // })
}


//获取不同洪涝严重程度下的城市服务平均指标
// GET: 8000:simulation/getEvenMeasure
// city: 城市名，英文小写
// mapName: 使用的规划方案底图的名称
// planId: 规划方案的id
export async function getEvenMeasure(city, mapName, planId) {
  let requestUrl = `simulation/getEvenMeasure`
  let data = {
    city, mapName, planId
  }
  return ajax(requestUrl, data)
    // .then((res) => {
    //   return res
    // })
    // .catch((err) => {
    //   console.log("不同洪涝严重程度下的城市服务平均指标 get失败", err)
    // })
}



export const mockMeasureXData = {
  '4': {
    '避难场所': [19.32, 24.83, 23.88, 24.2, 21.85],
    "应急物资供应": [3.03, 3.61, 3.75, 3.61, 3.46],
    "急救站": [37.58, 39.66, 39.76, 41.2, 38.27],
  },
  '8': {
    '避难场所': [17.56, 21.15, 20.13, 20.31, 19.32],
    "应急物资供应": [2.31, 3.54, 3.38, 3.36, 2.72],
    "急救站": [32.97, 37.53, 37.38, 37.2, 36.96],
  },
  '12': {
    '避难场所': [16.99, 18.24, 17.88, 18.88, 17.21],
    "应急物资供应": [1.31, 2.88, 2.53, 2.54, 2.33],
    "急救站": [29.83, 33.99, 34.86, 33.58, 32.9],
  },
  '16': {
    '避难场所': [15.2, 17.34, 17.24, 17.21, 15.31],
    "应急物资供应": [0.86, 1.9, 1.66, 1.92, 1.58],
    "急救站": [24.86, 32.86, 32.87, 32.42, 31.39],
  },
  '20': {
    '避难场所': [13.44, 16.24, 16.33, 16.22, 14.35],
    "应急物资供应": [0.57, 1.17, 0.95, 0.94, 0.87],
    "急救站": [23.13, 30.1, 29.71, 28.59, 28.52],
  },
  '24': {
    '避难场所': [13.01, 15.19, 15.29, 14.22, 14.32],
    "应急物资供应": [0.11, 0.7, 0.53, 0.87, 0.25],
    "急救站": [20.21, 25.82, 24.33, 25.13, 22.5],
  },
}

export const mockEmergencyNames = ['避难空间', '救灾物资', '应急医疗', '消防救援']
export const mockEmergencyData = {
  '4': [19.32, 3.03, 37.58, 12.5],
  '8': [17.56, 2.31, 32.97, 10.22],
  '12': [16.99, 1.31, 29.83, 9.74],
  '16': [15.2, 0.86, 24.86, 8.5],
  '20': [13.44, 0.57, 23.13, 7.65],
  '24': [13.01, 0.11, 20.21, 6.43],
}

export const mockDailyNames = ['医疗', '教育', '通勤', '购物']
export const mockDailyData = {
  '4': [49.61, 31.44, 49.97, 39.15],
  '8': [46.41, 28.57, 46.98, 34.84],
  '12': [41.62, 24.06, 42.00, 32.96],
  '16': [38.22, 17.45, 39.78, 24.88],
  '20': [34.67, 13.21, 36.05, 21.35],
  '24': [30.35, 12.41, 32.05, 20.30],
}
