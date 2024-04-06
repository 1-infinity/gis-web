import WKT from 'ol/format/WKT.js' //用于读写WellKnownText（WKT）格式的数据
import serverInfo from '@/views/simulator/serverInfo'
import axios from 'axios'
import { Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { fromLonLat } from 'ol/proj'
import { Circle } from 'ol/geom'
import Feature from 'ol/Feature'
import {calculateMeasureSimulator,calculateMeasureNoSimulator} from '@/views/application/cityServicePerformanceAPI'


//定义的全局变量
var layerDangerousAreaRadius= {
    'Hospital': 6000,
    'School': 4000,
    'Shopping': 1000,
    'Aid': 10000,
    'Shelter': 2500,
    'Supply': 2500,
    'Break': 5000,
    'Work': 1000
  }
var layerDangerousAreaThreshold= {
    'Hospital': 2,
    'School': 2,
    'Shopping': 2,
    'Aid': 10,
    'Shelter': 10,
    'Supply': 10,
    'Break': 10,
    'Work': 2
  }

//和application.vue当中的continuousRequest函数一样，为了给课题四提供长期规划接口，在此处进行重新实现
const continuousRequestForTeam4=async(request, city, count, ...args)=> {
  const res = await request(...args)

  console.log('res continue Team4', res)
  if (res.code === 1) {
    // console.log(res.value)
    return Promise.resolve(res.value)
  }
  if (res.code === -1 || count > 3600) {
    // console.log(`continuousRequestError`, `${request}`)
    return Promise.reject()
  }
  console.log(`${request}`, '10s之后再来一次')
  console.log("continueRequetForTeam4",request, city, count, ...args)
  await new Promise((resolve) => setTimeout(() => resolve(), 10000))
  return continuousRequestForTeam4(request, city, count + 1, ...args)
}

//根据传入的时间参数time和居民区类型参数type构建相应的API请求URL(课题四专用)
const requestAPIForResidentialAreasForTeam4 = async (city,taskId, time, type) => {
  console.log('requestAPIForResidentialAreasForTeam4', city,taskId, time, type)
  let url
  if (time !== 0) {
    url = serverInfo.baseURL + '/measure/getMeasureMapResultSimulation?city=' + city + '&mapname=' + "now" + '&planid=' +"0"+ '&id=' + taskId + '&type=flood' + '&time=' + time + '&scheme=' + type
  } else {
    url = serverInfo.baseURL + '/measure/getMeasureMapResultNoSimulation?city=' + city + '&mapname=' + "now" + '&planid=' + "0" + '&scheme=' + type
  }
  console.log('url', url)
  return (await axios.get(url)).data
}

//处理对应的居民区数据，获取到危险区域和危险小区
const processResidentialAreasForTeam4=async (city,data, type, disjointList)=> {
  console.log("进入了processResidentialAreasForTeam4")
  let totalArea = 0
  let polygonFeatures = []

  let maxscore = 0 // 初始化最大的score值为0
  let minscore = 100 // 初始化最小的score值为0
  let criticalscore = 0 // 初始化score的临界值，低于此值则表示需要新的规划选址

  // 遍历数据数组，构建maxscore and minscore
  for (let i = 0; i < data.length; i++) {
    const obj = data[i]
    if (obj.result > maxscore) {
      maxscore = obj.result
    }
    if (obj.result < minscore) {
      minscore = obj.result
    }

  }


  //设置criticalscore的值是一条40%线
  criticalscore = (maxscore - minscore) * 0.4 + minscore

  for (const item of data) {

    const index = data.indexOf(item)//获取到该点的索引值,便于之后在选中之后的样式中恢复其之前的颜色
    let indexColor = parseInt(((item.result - minscore) / maxscore) * 10)//计算当前点对应的颜色索引值

    try{
      /*获取到该点的wkt范围信息*/
      const url = serverInfo.baseURL + '/information/getCommunityById?city=' + city + '&mapname=now&comid=' + item.comid
      const resWkt = (await axios.get(url)).data

      // console.log("response wkt",resWkt)

      const format = new WKT()
      const feature = format.readFeature(resWkt.geom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326'
      })
      feature.name = 'ResidentialArea'

      // styleNoSelect = new Style({
      //   stroke: new Stroke({
      //     color: '#ffffff',
      //     width: 0
      //   }),
      //   fill: new Fill({
      //     color: arrayColor[indexColor]
      //   })
      // })

      // feature.setStyle(styleNoSelect)
      polygonFeatures.push(feature)
      //设置信息
      let geometry = feature.getGeometry()
      let area = geometry.getArea() * 1000000
      let coord = geometry.getFirstCoordinate()
      totalArea += area
      feature.info = {
        id: index,
        coord: coord,
        area: area,
        colorIndex: indexColor,
        score: item.result,
        comid: item.comid,
        pop: resWkt.pop
      }
      if (feature.info.score < criticalscore) {
        let pop_needed = parseInt(feature.info.pop - feature.info.pop * ((item.result - minscore) / (maxscore - minscore)))
        checkTargetInCircleOrCreateCircle(feature.info.coord, feature.info.comid, pop_needed, layerDangerousAreaRadius[type], disjointList)
      }
    }
    catch{ }

  }

  const layer = new VectorLayer({
    source: new VectorSource({
      features: polygonFeatures
    })
  })
  console.log("processResidentialAreasForTeam4执行完毕")
  return {
    layer: layer,
    count: polygonFeatures.length,
    area: totalArea
  }
}


function toRadians(degrees) {
  return degrees * Math.PI / 180
}

// 计算两个坐标（经纬度点）之间点距离（m）
function getDistance(coord1, coord2) {
  // 将经纬度拆包
  let lon1 = coord1[0]
  let lat1 = coord1[1]
  let lon2 = coord2[0]
  let lat2 = coord2[1]

  const earthRadiusKm = 6371 // 地球半径（单位：千米）
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = earthRadiusKm * c
  return distance * 1000
}

// 检查一个危险点是否是已有的圆区域内，如果不在，则新建一个圆区域
// coord: 危险点的坐标
// radius: 圆区域的半径
// comid: shp文件当中的comid
// population: 当前coord对应的人口数据
// disjointList: 圆区域的列表
function checkTargetInCircleOrCreateCircle(coord, comid, population, radius, disjointList) {
  for (let circle of disjointList) {
    //此时在某一个已有圆内
    if (getDistance(coord, circle.coord) < radius) {
      let cover = {}
      cover.coord = coord
      cover.comid = comid
      cover.pop = population
      circle['cover'].push(cover)
      return
    }
  }
  //新建一个circle={coord=[lon, lat], cover=[coord1, coord2, ...]}
  let new_circle = {}
  let cover = {}
  cover.coord = coord
  cover.comid = comid
  cover.pop = population
  new_circle.coord = coord//圆第一个点的坐标
  new_circle.cover = [cover]//圆包含的社区的内容
  new_circle.radius = radius//圆所对应的半径
  disjointList.push(new_circle)
}

// 遍历disjointList, 对其中的circle, 如果circle.cover.length >= 10, 就将这个circle画出来
function buildCityDangerousAlarmArea(type, disjointList) {
  let features = []
  let newDisjointList = []//危险区域
  for (let circle of disjointList) {
    // console.log("circle",circle)
    if (circle.cover.length >= layerDangerousAreaThreshold[type]) {
      newDisjointList.push(circle)
      let lonSum = 0
      let latSum = 0
      circle.cover.forEach(coord => {
        // console.log("circle.cover.coord",coord)
        lonSum += coord.coord[0]
        latSum += coord.coord[1]
      })
      let meanCoord = [lonSum / circle.cover.length, latSum / circle.cover.length]
      const coordMerc = fromLonLat(meanCoord)



      const circleMerc = new Circle(coordMerc,layerDangerousAreaRadius[type])
      const dangerousArea = circleMerc.transform('EPSG:3857', 'EPSG:4326')
      console.log('dangerousArea', dangerousArea)
      let Features = new Feature(dangerousArea)
      features.push(Features)
    }
  }
  const layer = new VectorLayer({
    source: new VectorSource({
      features: features
    })
  })
  layer.set('layerName', type + 'DangerousArea')
  layer.setOpacity(0.3)
  // return  layer
  return {
    layer: layer,
    newDisjointList: newDisjointList
  }
}


function saveRiskArea(disjointList, type, taskId, time,city) {

  let dataToBackEndCircle = {}
  dataToBackEndCircle.planid = 0
  dataToBackEndCircle.type = type
  dataToBackEndCircle.taskid = taskId
  dataToBackEndCircle.time = time
  dataToBackEndCircle.map = "now"
  dataToBackEndCircle.city=city
  // dataToBackEndCircle.planid=that.planid
  dataToBackEndCircle.data = []

  let data = []
  // console.log('new disjointList:', disjointList)
  for (let i = 0; i < disjointList.length; i++) {
    let tmp = {}
    tmp.x = disjointList[i].coord[0]
    tmp.y = disjointList[i].coord[1]
    tmp.radius = disjointList[i].radius
    dataToBackEndCircle.data.push(tmp)
  }
  // console.log("circleData",dataToBackEndCircle)
  // console.log("JSON CIRCLE",JSON.stringify(dataToBackEndCircle))

  try {
    const url = serverInfo.baseURL + '/information/setRiskCircle'
    axios.post(url, dataToBackEndCircle).then(response => {
      // console.log('saveriskarea result', response.data)
      if (response.data === false) {
      } else {
      }
    })
  } catch (e) {
  }

  let dataToBackEndCommunity = {}
  dataToBackEndCommunity.planid = 0
  dataToBackEndCommunity.type = type
  dataToBackEndCommunity.taskid = taskId
  dataToBackEndCommunity.time = time
  dataToBackEndCommunity.map = "now"
  dataToBackEndCommunity.city=city
  // dataToBackEndCommunity.planid=that.planid
  dataToBackEndCommunity.data = []


  for (let i = 0; i < disjointList.length; i++) {
    for (let j = 0; j < disjointList[i].cover.length; j++) {
      let tmp = {}
      tmp.comid = disjointList[i].cover[j].comid
      tmp.pop = disjointList[i].cover[j].pop
      tmp.lon = disjointList[i].cover[j].coord[0]
      tmp.lat = disjointList[i].cover[j].coord[1]
      dataToBackEndCommunity.data.push(tmp)
    }
  }

  // console.log("JSON COMMUNITY",JSON.stringify(dataToBackEndCommunity))

  try {
    const url = serverInfo.baseURL + '/information/setRiskCommunity'
    axios.post(url, dataToBackEndCommunity).then(response => {
      // console.log('saveriskcommunity result', response.data)
      if (response.data === false) {
      } else {
      }
    })
  } catch (e) {
  }
}

async function saveCsvResultForTeam4(city, taskId, time, type) {
  const url = serverInfo.baseURL + '/information/addLongTermComplete'
  const data = {
    planid: 0,
    taskid: taskId,
    mapname: "now",
    city: city,
    time: time,
    service: type
  }
  let res = await axios.post(url, data)
  return res.data
}


//提供给课题四的3个csv文件生成接口
export const getNecessaryFilesForAutoPlan=async (city,taskId,time,type)=> {

  try {

    if(time===0)
    {
      await calculateMeasureNoSimulator(city,"now","0",taskId,"flood",time,type)
    }
    else
    {
      await calculateMeasureSimulator(city,"now","0",taskId,"flood",time,type)
    }

    console.log("进入了getNecessaryFilesForAutoPlan")
    console.log("准备发送requestAPI请求")
    let res = await continuousRequestForTeam4(requestAPIForResidentialAreasForTeam4, city, 1, city, taskId, time, type)
    console.log("requestAPI请求完成")
    let disjointList = []
    console.log("准备进行课题四居民区数据处理")
    await processResidentialAreasForTeam4(city, res, type, disjointList, layerDangerousAreaRadius[type])
    console.log("课题四居民区数据处理加载完成")
    let resBuildCityDangerousAlarmArea = buildCityDangerousAlarmArea(type, disjointList)
    console.log("课题四危险区域加载完成")
    let dangerousAreaLayer = resBuildCityDangerousAlarmArea.layer
    console.log('dangerouslayer', dangerousAreaLayer)
    let newDisjointList = resBuildCityDangerousAlarmArea.newDisjointList
    saveRiskArea(newDisjointList, type, taskId, time, city)
    console.log("课题四危险区域保存完成")
    saveCsvResultForTeam4(city,taskId,time,type)
    return 1
  }
    catch{
    return 0
    }
}
