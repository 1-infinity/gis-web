// OpenLayers地图相关函数
// three
import { Color } from 'three'
// ol
import 'ol/ol.css' //加载OpenLayers的样式
import Map from 'ol/Map' //Map用于创建一个OpenLayers地图
import View from 'ol/View' //View是Map的成员，设置地图中视窗的 坐标系，缩放，中心点等属性
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer' //Layer也是Map的成员，设置地图中用于展示的数据(图层)
import * as olProj from 'ol/proj' //Projection是View、Layer的成员, 声明它们使用的坐标系。OpenLayers会自动将所有Layers的坐标通过 坐标变换，得到和View一致的坐标系下的坐标，用于展示
import { fromLonLat, transform } from 'ol/proj'
import XYZ from 'ol/source/XYZ' //XYZ是用于加载 "瓦片地图" 数据源的一个类
import { Vector as VectorSource } from 'ol/source.js' //Vector是用于加载 "矢量数据"（在本项目中主要是GeoJson） 数据源的一个类
import Feature from 'ol/Feature' //Feature用于生成一个矢量对象，展示在地图中。可以用setStyle来设置 样式
import { Circle, MultiLineString, Point } from 'ol/geom' // geom是Feature的一个属性，用于声明feature的几何特征
import { Fill, Icon, Stroke, Style } from 'ol/style.js' //style用于生成一个样式, 样式 是一个图形化展示
import CircleStyle from 'ol/style/Circle'
import WKT from 'ol/format/WKT.js' //用于读写WellKnownText（WKT）格式的数据
import Overlay from 'ol/Overlay.js' //用于生成一个有固定坐标的地图上的悬浮标
import { getCenter } from 'ol/extent'
import Draw, { createRegularPolygon } from 'ol/interaction/Draw.js'

import { getArea } from 'ol/sphere.js'

// custom
import projzh from '../simulator/components/proj' //projzh中提供三个坐标系 "EPSG:4326", "EPSG:3857", "GCJ-02" 之间相互转换的坐标变换公式
import mapData from '../simulator/components/mapData' //mapData提供了各个城市在 "EPSG:4326" 坐标系下的一些坐标参数
import serverInfo from '../simulator/serverInfo'

// 图标
import IconInfection from '@/views/application/assets/infection.png'

// 后端请求相关函数
import axios from 'axios'
import ajax from '../simulator/ajax'
import { updatePieChart } from '@/views/application/chartUtils'
import { getLongInvokingStatus } from '@/api/city/optimization'
import ol from 'ol'

// 热力图分段颜色
const heatmapColors = ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027']

// 坐标系转换
export const initOL = (bindThis) => {
  const that = bindThis
  const gcj02Extent = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244]
  const gcjMecator = new olProj.Projection({
    code: 'GCJ-02',
    extent: gcj02Extent,
    units: 'm'
  })
  olProj.addProjection(gcjMecator)
  olProj.addCoordinateTransforms('EPSG:4326', gcjMecator, projzh.ll2gmerc, projzh.gmerc2ll)
  olProj.addCoordinateTransforms('EPSG:3857', gcjMecator, projzh.smerc2gmerc, projzh.gmerc2smerc)
  that.gcjMecator = gcjMecator
}

// 初始化OpenLayer地图
export const initOLMap = (bindThis) => {
  const that = bindThis
  // 获取地图容器
  let mapDom = document.getElementById('Map')
  // 初始化地图配置
  that.map = new Map({
    target: mapDom, // 地图容器
    view: new View({
      //设置你的地图初始中心点
      center: mapData[that.city].center, // 地图中心点
      zoom: that.zoomLevel, // 缩放
      maxZoom: 17,//最大缩放层级
      minZoom: 10,//最小缩放层级
      extent: mapData[that.city].extent, //显示范围
      projection: 'EPSG:4326' // 坐标系
    })
  })
  // 添加一个使用离线瓦片地图的层
  const offlineMapLayer = new TileLayer({
    source: new XYZ({
      projection: that.gcjMecator,
      url: serverInfo.baseURL_three + `/static/mapData/${that.city}/{z}/{x}/{y}.png`  // 设置本地离线瓦片所在路径
    })
  })
  // 将图层添加到地图
  that.map.addLayer(offlineMapLayer)

}

export const deleteMapPlanPoint = (bindThis) => {
  const that = bindThis
  // 判断 删除的数据源是否存在
  if (that.pointLayerSource) {
    // 遍历删除
    that.mapPointList.map(item => {
      that.pointLayerSource.removeFeature(item)
    })

    // 删除图层 重置数据
    that.map.removeLayer(that.pointLayer)
    that.pointLayerSource = null
    that.pointLayer = null
    that.mapPointList = []
    that.nowPlanPointList = []
  }
}

//处理通信基站，将通信基站显示到地图上
export const buildBaseStation = async (bindThis) => {
  const that = bindThis

  try {
    const url = serverInfo.baseURL + '/information/facility'
    const res = await axios.get(url, {
      params: {
        city: '021'
      }
    })
    const processResult = processBaseStation(that, res)
    const polygonLayer = processResult.layer
    polygonLayer.set('layerName', 'CommunicationBaseStation')
    that.map.removeLayer(that.currentCommunicationBaseStationLayer)
    if (that.showLayers.CommunicationBaseStation) {
      that.map.addLayer(polygonLayer)
    }
    that.currentCommunicationBaseStationLayer = polygonLayer
  } catch {
    that.$message({
      message: `获取通信基站服务范围失败`,
      type: 'warning'
    })
  }

}

/*获取个性规划点，并展示到地图上*/
export const buildMapPlanPoint = async (bindThis, requestUrl, flag = 0) => {
  const that = bindThis
  deleteMapPlanPoint(that)
  that.existPlanPoint = []//重置当前的已存在点
  // const url = serverInfo.baseURL + `/measure/selectPlanPoint?planid=` + that.nowPlanId + '&city=' + that.city + '&mapname=' + that.bottomMap
  axios.get(requestUrl)
    .then(response => {
      const pointData = response.data.map(item => {
        // 创建点
        const point = new Feature({
          geometry: new Point([item.positionX, item.positionY])
          // data: item
        })
        point.name = 'PlanPoint'

        //应急医疗点的样式
        const iconStyleEmergencyMedical = new Style({
          image: new Icon({
            color: '#ffffff',
            crossOrigin: 'anonymous',
            src: that.iconEmergencyMedical
          })
        })

        //避难场所点的样式
        const iconStyleShelter = new Style({
          image: new Icon({
            color: '#ffffff',
            crossOrigin: 'anonymous',
            src: that.iconShelter
          })
        })

        //救援物资点的样式
        const iconStyleReliefMaterial = new Style({
          image: new Icon({
            color: '#ffffff',
            crossOrigin: 'anonymous',
            src: that.iconReliefMaterial
          })
        })

        //消防站点的样式
        const iconStyleFirehouse = new Style({
          image: new Icon({
            color: '#ffffff',
            crossOrigin: 'anonymous',
            src: that.iconFirehouse
          })
        })

        // 医院点的样式
        const iconStyleHospital = new Style({
          image: new Icon({
            color: '#ffffff',
            crossOrigin: 'anonymous',
            src: that.iconHospital
          })
        })

        // 学校点的样式
        const iconStyleEducation = new Style({
          image: new Icon({
            color: '#ffffff',
            crossOrigin: 'anonymous',
            src: that.iconEducation
          })
        })

        // 就业点的样式
        const iconStyleEmployment = new Style({
          image: new Icon({
            color: '#ffffff',
            crossOrigin: 'anonymous',
            src: that.iconEmployment
          })
        })

        // 商业点的样式
        const iconStyleCommercialRetail = new Style({
          image: new Icon({
            color: '#ffffff',
            crossOrigin: 'anonymous',
            src: that.iconCommercialRetail
          })
        })

        if (item.type === 'Aid') {
          point.setStyle(iconStyleEmergencyMedical)
        } else if (item.type === 'Shelter') {
          point.setStyle(iconStyleShelter)
        } else if (item.type === 'Supply') {
          point.setStyle(iconStyleReliefMaterial)
        } else if (item.type === 'Break') {
          point.setStyle(iconStyleFirehouse)
        } else if (item.type === 'Hospital') {
          point.setStyle(iconStyleHospital)
        } else if (item.type === 'School') {
          point.setStyle(iconStyleEducation)
        } else if (item.type === 'Work') {
          point.setStyle(iconStyleEmployment)
        } else if (item.type === 'Shopping') {
          point.setStyle(iconStyleCommercialRetail)
        }

        // 保存到数据  方便删除
        that.mapPointList.push(point)

        console.log("that.mapPointList", that.mapPointList)

        //处理鼠标滚轮事件，使得图标随着地图缩放而缩放
        that.map.getView().on('change:resolution', function () {
          var index = that.map.getView().getZoom()
          var length = that.mapPointList.length
          for (var i = 0; i < length; i++) {
            var style = that.mapPointList[i].getStyle()
            style.getImage().setScale(this.getZoom() * index / 200)
            that.mapPointList[i].setStyle(style)
          }
        })

        //给后端返回的数据人为加上Position字段，便于在迭代规划时和新增加点的经纬度信息数据格式相同
        item.position = [item.positionX, item.positionY]


        that.selectionList.push(item)
        let coord = {}
        coord.x = item.positionX
        coord.y = item.positionY
        coord.pop = item.capacity
        that.existPlanPoint.push(coord)
        // that.nowPlanPointList.push(item)
      })

      // //测试数据
      // console.log("JSON POINTLIST",JSON.stringify(that.existPlanPoint))
      // 创建geojson据源
      that.pointLayerSource = new VectorSource({ features: that.mapPointList })
      // 创建图层 并加载数据
      that.pointLayer = new VectorLayer({ source: that.pointLayerSource })
      // 将图层添加地图上
      that.map.addLayer(that.pointLayer)
    }).catch(error => {
      console.error(error)
    })
}

/*点击个性规划点的处理函数*/
export const signleClickPlanPoint = (bindThis, data) => {
  const that = bindThis
  //如果是手动规划模块，则直接隐藏该函数，该函数只用于手动规划之后的展示
  that.map.on('singleclick', (e) => {
    if ("creationMode" in that && that.creationMode.includes('manualPlan')) {

    } else {
      // 判断是否点击在点上
      let feature = that.map.forEachFeatureAtPixel(
        e.pixel,
        (feature) => feature
      )
      if (feature) {
        // 点击到个性规划点
        if (feature.name === 'PlanPoint') {
          // console.log(that.$data.showDetail)
          // console.log(that.$data.selectionList)
          that.$refs.mapInfoPlanPoint.showPopper = true
          let coordinates = feature.getGeometry().getCoordinates()
          //找出当前点击的点是哪个，获取当前点的信息显示在弹窗中
          that.$data.selectionList.forEach((item, index) => {
            if (Math.abs(item.positionX - coordinates[0]) <= 0.001 && Math.abs(item.positionY - coordinates[1]) <= 0.001) {
              var name = ''
              that.$data.nowSelectCapacity = item.capacity

              if (item.scale === 'small') {
                name = name + '小型'
              } else if (item.scale === 'middle') {
                name = name + '中型'
              } else if (item.scale === 'large') {
                name = name + '大型'
              }

              if (item.type === 'Aid') {
                name = name + '应急医疗场所'
              } else if (item.type === 'Shelter') {
                name = name + '避难场所'
              } else if (item.type === 'Supply') {
                name = name + '救灾物资储备中心'
              } else if (item.type === 'Break') {
                name = name + '消防站'
              } else if (item.type === 'Hospital') {
                name = name + '医院'
              } else if (item.type === 'School') {
                name = name + '学校'
              } else if (item.type === 'Work') {
                name = name + '就业指导中心'
              } else if (item.type === 'Shopping') {
                name = name + '商业零售中心'
              }

              that.$data.nowSelectType = name
            }
          })
          that.$data.currentPositionPlanPoint = coordinates
          that.$data.showPlanPointUp = true
          // 设置弹窗位置
          that.popUpPlanPoint.setPosition(coordinates)
        }
        // 点击传染病网格
        else if (feature.name === 'infection') {
          that.popUpInfection.setPosition(e.coordinate)
          that.$refs.mapInfoPopoverInfection.showPopper = false
          that.popInfoInfection = feature.info
          that.popInfoInfection.feature = feature
          that.$refs.mapInfoPopoverInfection.showPopper = true
        }
      } else {
        that.$refs.mapInfoPlanPoint.showPopper = false
        if("mapInfoPopoverInfection" in that.$refs)
          that.$refs.mapInfoPopoverInfection.showPopper = false
      }
    }
  })
}

/*个性选址当中的鼠标移动函数*/
export const pointermove = (bindThis) => {
  const that = bindThis
  that.map.on('pointermove', (e) => {
    if (that.map.hasFeatureAtPixel(e.pixel)) {
      that.map.getViewport().style.cursor = 'pointer'
    } else {
      that.map.getViewport().style.cursor = 'inherit'
    }
  })
}

//根据不同的手动规划点，将展示的容纳量数据进行不同的初始化
function handlePlanPointCapacity(bindThis) {
  const that = bindThis
  if (that.selectionMode === 'Aid') {
    that.ValuePlanPointCapacity = 2000
  } else if (that.selectionMode === 'Shelter') {
    that.ValuePlanPointCapacity = 2000
  } else if (that.selectionMode === 'Supply') {
    that.ValuePlanPointCapacity = 2000
  } else if (that.selectionMode === 'Break') {
    that.ValuePlanPointCapacity = 2400
  } else if (that.selectionMode === 'Hospital') {
    that.ValuePlanPointCapacity = 4000
  } else if (that.selectionMode === 'School') {
    that.ValuePlanPointCapacity = 20000
  } else if (that.selectionMode === 'Work') {
    that.ValuePlanPointCapacity = 2000
  } else if (that.selectionMode === 'Shopping') {
    that.ValuePlanPointCapacity = 2000
  }
}

/*添加地图内文本框的弹窗图层*/
export const addOverlay = (bindThis) => {
  // console.log('overlay added')
  const that = bindThis
  // 创建Overlay
  let elPopup = that.$refs.popupPlanPoint
  that.popUpPlanPoint = new Overlay({
    element: elPopup,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -20]
  })
  that.map.addOverlay(that.popUpPlanPoint)

  // 传染病
  if("popupInfection" in that.$refs){
    that.popUpInfection = new Overlay({
      element: that.$refs.popupInfection
    })
  }

}

// 开始手动规划选址
export const addPlanSelection = (bindThis) => {
  const that = bindThis

  for (let type in that.planSelectionColors) {
    let layer = createDrawLayer(that.planSelectionColors[type])
    that.planSelectionLayers[type] = layer
    that.map.addLayer(layer.vector)
    layer.draw.on('drawend', (event) => {
      let feature = event.feature
      let geom = feature.getGeometry()
      let center = getCenter(geom.getExtent())

      let area = getArea(geom, { projection: 'EPSG:4326' })

      that.nowSelectPlanPoint = {
        'type': type,
        'position': center,
        'area': area,
        'feature': feature,
        'scale': 'small',//初始化默认为小型场所，用户可以在点击选点之后进行修改
        'capacity': 100
      }
      addOverlay(that)
      that.$refs.mapInfoPlanPoint.showPopper = true
      let coordinates = center
      // console.log('新增选址的坐标：', coordinates)
      handlePlanPointCapacity(that)
      that.popUpPlanPoint.setPosition(coordinates)
      that.showMannualPlanPopUp = true
    })
  }

  // 添加绘制形状图层
  that.map.addInteraction(that.planSelectionLayers[that.selectionMode].draw)
}

// 改变手动规划选址类型
export const changeSelectionMode = (bindThis) => {
  const that = bindThis

  // 删除绘制形状图层
  for (let type in that.planSelectionColors) {
    let layer = that.planSelectionLayers[type]
    that.map.removeInteraction(layer.draw)
  }

  // 添加绘制形状图层
  that.map.addInteraction(that.planSelectionLayers[that.selectionMode].draw)
}

// 取消手动规划选址，清空已有选址
export const removePlanSelection = (bindThis) => {
  const that = bindThis
  for (let type in that.planSelectionColors) {
    let layer = that.planSelectionLayers[type]
    that.map.removeLayer(layer.vector)
    that.map.removeInteraction(layer.draw)
  }

  that.planSelection = {}
}

// 暂停手动规划选址，不清空已有选址
export const pausePlanSelection = (bindThis) => {
  const that = bindThis
  for (let type in that.planSelectionColors) {
    let layer = that.planSelectionLayers[type]
    that.map.removeInteraction(layer.draw)
  }

}

// 开始修改模拟区域
export const addModifyArea = (bindThis) => {
  const that = bindThis

  let layer = createDrawLayer(['rgba(255,255,255,0.8)', 'rgba(255,0,0,0.1)'])

  // 绘制事件
  layer.draw.on('drawend', (event) => {
    let feature = event.feature

    // 删除上一个feature
    if (that.currentAreaFeature) {
      layer.source.removeFeature(that.currentAreaFeature)
    }
    that.currentAreaFeature = feature

    // 获取坐标信息
    let coords = feature.getGeometry().getCoordinates()[0]
    let area = []
    coords.forEach((item) => {
      area.push(`[${item[0].toFixed(2)},${item[1].toFixed(2)}]`)
    })
    that.currentArea = `[ ${area.join(', ')} ]`

    // 退出修改模式
    that.map.removeInteraction(layer.draw)
    that.areaModifying = false

  })

  // 添加绘制形状图层
  that.map.addInteraction(layer.draw)
  that.map.addLayer(layer.vector)

  that.modifyAreaLayer = layer
}

// 取消修改模拟区域
export const removeModifyArea = (bindThis) => {
  const that = bindThis

  let layer = that.modifyAreaLayer
  that.map.removeInteraction(layer.draw)
  that.map.removeLayer(layer.vector)

  that.modifyAreaLayer = null
}

// 开始添加初始感染点
export const addInfectionAdding = (bindThis) => {
  const that = bindThis

  let layer = createDrawLayer(['rgba(255,156,0,0.5)', 'rgba(255,156,0,0.9)'], 'Point')

  // 绘制事件
  layer.draw.on('drawend', (event) => {
    let feature = event.feature

    // 获取坐标信息
    let coords = feature.getGeometry().getCoordinates()
    let id = 1
    if (that.initInfectionList.length > 0) {
      id = that.initInfectionList[that.initInfectionList.length - 1].id + 1
    }
    that.initInfectionList.push({
      'id': id,
      'position': coords,
      'feature': feature,
      'population': that.initInfectionPopulation
    })
  })

  // 添加绘制形状图层
  that.map.addInteraction(layer.draw)
  that.map.addLayer(layer.vector)

  that.initInfectionLayer = layer
}

// 开始添加封锁区域
export const addInfectionLock = (bindThis) => {
  const that = bindThis

  let layer = createDrawLayer(['rgba(132,112,255,0.5)', 'rgba(132,112,255,0.9)'], 'Point')

  // 绘制事件
  layer.draw.on('drawend', (event) => {
    let feature = event.feature

    // 获取坐标信息
    let coords = feature.getGeometry().getCoordinates()
    let id = 1
    if (that.lockInfectionList.length > 0) {
      id = that.lockInfectionList[that.lockInfectionList.length - 1].id + 1
    }
    that.lockInfectionList.push({
      'id': id,
      'position': coords,
      'feature': feature
    })
  })

  // 添加绘制形状图层
  that.map.addInteraction(layer.draw)
  that.map.addLayer(layer.vector)

  that.lockInfectionLayer = layer
}

// 创建绘制形状图层
function createDrawLayer(color, drawType = 'Circle') {
  const source = new VectorSource({ wrapX: false })
  let colorDone = new Color(color)

  //设置颜色
  let fillColorDraw = '#fff', fillColorDone = '#fff'
  if (typeof (color) === 'string') {
    fillColorDraw = `rgba(${Math.floor(colorDone.r * 255)}, ${Math.floor(colorDone.g * 255)}, ${Math.floor(colorDone.b * 255)}, 0.5)`
    fillColorDone = colorDone.getStyle()
  } else if (typeof (color) === 'object') {
    fillColorDraw = color[0]
    fillColorDone = color[1]
  }

  //绘制时的样式
  const styleDraw = {
    'stroke-color': '#000',
    'fill-color': fillColorDraw,
    'stroke-width': 1,
    'circle-radius': 10,
    'circle-fill-color': fillColorDraw
  }

  //完成的样式
  const styleDone = {
    'stroke-color': '#000',
    'fill-color': fillColorDone,
    'stroke-width': 1,
    'circle-radius': 10,
    'circle-fill-color': fillColorDone
  }

  //创建一个VectorLayer
  const vector = new VectorLayer({
    source: source,
    style: styleDone
  })

  //创建四边形
  const geometryFunction = createRegularPolygon(4)
  let draw
  //根据drawType的值来创建Draw对象draw
  if (drawType === 'Point') {
    draw = new Draw({
      source: source,
      type: drawType,
      style: styleDraw
    })
  } else {
    draw = new Draw({
      source: source,
      type: drawType,
      style: styleDraw,
      geometryFunction: geometryFunction
    })
  }
  return {
    'source': source,
    'vector': vector,
    'draw': draw
  }
}

/*获取居民区韧性数据*/
export const buildResidentialAreasAtTime = async (bindThis, time) => {
  console.log('进入了buildResidentialAreasAtTime,此时的时间为', time)
  const that = bindThis
  //禁用所有居民区相关按钮
  that.disableAllResidentialAreasBottom()
  for (let type in that.layerNames_residential) {
    try {
      //先让按钮无法点击，等计算结果得到之后才能点击
      that.IsReadyResidentialAreas[type] = true
      that.IsReadyResidentialAreas[type + 'DangerousArea'] = true

      /** res 的结构是:
       // [{
       // "comid":
       // "latitude":
       // "longitude":
       // "result":
       // }]
       **/
      that.continuousRequest(requestAPIForResidentialAreas, that.city, 1, that, time, type).then(res => {
        let disjointList = []

        processResidentialAreas(that, res, type, disjointList).then(async residentialareasResult => {
          console.log("热力图加载完成")
          let resBuildCityDangerousAlarmArea = buildCityDangerousAlarmArea(that, type, disjointList)
          console.log("危险区域加载完成")
          let dangerousAreaLayer = resBuildCityDangerousAlarmArea.layer
          console.log('dangerouslayer', dangerousAreaLayer)
          // let dangerousAreaLayer=buildCityDangerousAlarmArea(that, type, disjointList)
          let newDisjointList = resBuildCityDangerousAlarmArea.newDisjointList
          saveRiskArea(that, newDisjointList, type, that.taskId, time)
          console.log("危险区域保存完成")
          saveExistPoint(that, type)
          console.log("已存在点保存完成")
          // saveRiskArea(that,disjointList,type,that.taskId,time)
          that.layers_residential[type] = residentialareasResult.layer
          that.layers_residential[type].set('layerName', type)
          that.layers_residential_dangerous[type + 'DangerousArea'] = dangerousAreaLayer
          try{
            let resultSaveCsv = await saveCsvResults(that, type)
            if(resultSaveCsv==="OK")
            {
              console.log("保存csv信息到数据库成功")
            }
            else
            {
              console.log("保存csv信息到数据库失败")
            }
          }
          catch{
            console.warn("保存csv信息到数据库失败")
          }
          console.warn(`居民区${time}时刻的${that.layerNames_residential[type]}韧性数据加载完成`);
          that.$message({
            message: `居民区${time}时刻的${that.layerNames_residential[type]}韧性数据加载完成`,
            type: 'success'
          })
          //设置信息
          that.disjointListResidential[type] = disjointList
          that.IsReadyResidentialAreas[type] = false
          that.IsReadyResidentialAreas[type + 'DangerousArea'] = false
          that.disableAutoPlanButton = false //打开自动规划按钮
          // console.log('that.disjointListResidential', that.disjointListResidential)
        }).catch(error => {
          that.$message({
            message: `获取第${time}时刻居民区${that.layerNames_residential[type]}韧性数据失败`,
            type: 'warning'
          })
        })
      }).catch(error => {
        that.$message({
          message: `获取第${time}时刻居民区${that.layerNames_residential[type]}韧性数据失败`,
          type: 'warning'
        })
      })
    } catch {
      that.$message({
        message: `获取第${time}时刻居民区${that.layerNames_residential[type]}韧性数据失败`,
        type: 'warning'
      })
    }
  }
}

//将计算得到的危险区域发送至后端生成csv，供其他课题组使用
function saveRiskArea(that, disjointList, type, taskId, time) {

  let dataToBackEndCircle = {}
  dataToBackEndCircle.planid = that.nowPlanId
  dataToBackEndCircle.type = type
  dataToBackEndCircle.taskid = taskId
  dataToBackEndCircle.time = time
  dataToBackEndCircle.map = that.bottomMap
  dataToBackEndCircle.city = that.city
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
        that.$message({
          message: `保存第${time}时刻居民区${type}危险区域csv数据失败`,
          type: 'error'
        })
      } else {
        that.CanAutoPlan.isFileCircleReady = true
      }
    })
  } catch (e) {
    that.$message({
      message: `保存第${time}时刻居民区${type}危险区域csv数据失败`,
      type: 'error'
    })
  }

  let dataToBackEndCommunity = {}
  dataToBackEndCommunity.planid = that.nowPlanId
  dataToBackEndCommunity.type = type
  dataToBackEndCommunity.taskid = taskId
  dataToBackEndCommunity.time = time
  dataToBackEndCommunity.map = that.bottomMap
  dataToBackEndCommunity.city = that.city
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
        that.$message({
          message: `保存第${time}时刻${type}类型下的危险居民区点csv数据失败`,
          type: 'error'
        })
      } else {
        that.CanAutoPlan.isFilePointReady = true
      }
    })
  } catch (e) {
    that.$message({
      message: `保存第${time}时刻${type}类型下的危险居民区点csv数据失败`,
      type: 'error'
    })
  }
}

function saveExistPoint(bindThis, type) {
  const that = bindThis
  // console.log("exist PlanPoint", that.existPlanPoint)
  const url = serverInfo.baseURL + '/information/setUserCircle'
  try {
    // console.log("exist PlanPoint",that.existPlanPoint)
    let dataExistPoint = {}
    dataExistPoint['planid'] = that.nowPlanId
    dataExistPoint['taskid'] = that.taskId
    dataExistPoint['map'] = that.bottomMap
    dataExistPoint['time'] = that.stepTimeMap[that.activeTimeIndex]
    dataExistPoint['service'] = type
    dataExistPoint['city'] = that.city
    dataExistPoint['data'] = that.existPlanPoint
    // console.log("JSON ExistPoint", JSON.stringify(dataExistPoint))
    axios.post(url, dataExistPoint).then(response => {
      // console.log('saveriskarea result', response.data)
      if (response.data === false) {
        this.$message({
          message: `保存当前地图上已选择点csv数据失败`,
          type: 'error'
        })
      } else {
        that.CanAutoPlan.isFileExistPointReady = true
      }
    })
  } catch (e) {
    this.$message({
      message: `保存当前地图上已选择点csv数据失败`,
      type: 'error'
    })
  }
}

export const saveCsvResults=async (bindThis, type)=> {
  const that = bindThis
  const url = serverInfo.baseURL + '/information/addLongTermComplete'
  const data = {
    planid: that.nowPlanId,
    taskid: that.taskId,
    mapname: that.bottomMap,
    city: that.city,
    time: that.stepTimeMap[that.activeTimeIndex],
    service: type
  }
  let res=await axios.post(url, data)
  return res.data
}

/*获取通信基站的韧性数据*/
export const buildCommunicationBaseStationAtTime = async (bindThis, time) => {
  const that = bindThis
  console.log('进入了buildCommunicationBaseStationAtTime,此时的时间为', time)
  try {
    that.hasLayers_basic['CommunicationBaseStation'] = false
    const availableCommunicationBaseStation = await processBaseStation(that, time)

    //移除当前的通信基站图层
    that.map.removeLayer(that.currentCommunicationBaseStationLayer)

    that.currentCommunicationBaseStationLayer = availableCommunicationBaseStation.layer
    that.currentCommunicationBaseStationLayer.set('layerName', 'CommunicationBaseStation')
    that.hasLayers_basic['CommunicationBaseStation'] = true
    that.currentCommunicationBaseStationServiceCapacity = (that.currentAvailableCommunicationBaseStationServiceArea / (that.currentAvailableCommunicationBaseStationServiceArea + that.currentNotAvailableCommunicationBaseStationServiceArea)).toFixed(2)
    that.chartBasicValues[time][0] = Number(that.currentCommunicationBaseStationServiceCapacity)
    console.log('通信基站的韧性数据', that.currentCommunicationBaseStationServiceCapacity, '此时的时刻为', time)
    updatePieChart(that.chartBasic, that.chartBasicNames, that.maxchartBasicValues, that.normalchartBasicValues, that.chartBasicValues[that.stepTimeMap[that.activeTimeIndex]], 'macarons')
    that.$message({
      message: `第${time}时刻可用通信基站数据加载完成`,
      type: 'success'
    })
  } catch {
    that.$message({
      message: `获取第${time}时刻可用通信基站数据失败`,
      type: 'warning'
    })
  }
}

//根据传入的时间参数time和居民区类型参数type构建相应的API请求URL
export const requestAPIForResidentialAreas = async (bindThis, time, type) => {
  const that = bindThis
  console.log('进入了requestAPIForResidentialAreas,此时的时间为', time)
  let url
  if (time !== 0) {
    url = serverInfo.baseURL + '/measure/getMeasureMapResultSimulation?city=' + that.city + '&mapname=' + that.bottomMap + '&planid=' + that.nowPlanId + '&id=' + that.taskId + '&type=flood' + '&time=' + that.stepTimeMap[that.activeTimeIndex] + '&scheme=' + type
  } else {
    url = serverInfo.baseURL + '/measure/getMeasureMapResultNoSimulation?city=' + that.city + '&mapname=' + that.bottomMap + '&planid=' + that.nowPlanId + '&scheme=' + type
  }
  console.log('url', url)
  return (await axios.get(url)).data
}


// 监测自动规划是否完成
export const requestAPIForlongInvoking = async (longInvokingId) => {
  const queryParams = {
    id: longInvokingId
  }
  // console.log("longInvokingId",queryParams)
  let data = await getLongInvokingStatus(queryParams)
  console.log("datalongInvoking",data)
  let res = {}
  try {
    res.code = parseInt(data.data.status)
    res.beginTime = data.data.createTime
  }
  catch (e) {
    res.code=2
    res.beginTime=null
  }
  return res
}


// 获取并显示对应时刻的洪涝模拟数据
export const requestAPIForCommunicationBaseStation = async (bindThis, time) => {
  const that = bindThis
  console.log('进入了requestAPIForCommunicationBaseStation,此时的时间为', time)
  const url = ''
  return (await axios.get(url)).data
}

// 获取并显示对应时刻的洪涝模拟数据
export const buildMapAtTime = async (bindThis, time) => {
  const that = bindThis

  if (that.currentSimulationType === 'flood' && time > 0) {
    //淹没区域
    try {
      const res = await that.getSimulationResult('submergedcells', `${time}`)

      const processResult = processArea(that, res)
      const polygonLayer = processResult.layer
      polygonLayer.set('layerName', 'submergedcells#' + `${time}`)
      that.map.removeLayer(that.currentSubmergedcellsLayer)
      if (that.showLayers.submergedCells) {
        that.map.addLayer(polygonLayer)
      }
      that.currentSubmergedcellsLayer = polygonLayer
      that.infoFlood.waterCount = that.infoTask.resultLens['submergedcells'][`${time}`]
      // that.infoFlood.waterArea = processResult.area;
      if (processResult.area > 10000) {
        that.infoFlood.waterArea = Math.round((processResult.area / 1000000) * 100) / 100 + 'km²'
      } else {
        that.infoFlood.waterArea = Math.round(processResult.area * 100) / 100 + ' ' + 'm²'
      }
    } catch {
      that.$message({
        message: `获取第${time}时刻淹没区域数据失败`,
        type: 'error'
      })
    }

    // 淹没路网
    try {
      const res = await that.getSimulationResult('submergedroads', `${time}`)
      const submergedroadsResult = processRoads(that, res, that.layerColors.submergedRoads)
      that.map.removeLayer(that.currentSubmergedroadsLayer)
      if (that.showLayers.submergedRoads) {
        that.map.addLayer(submergedroadsResult.layer)
      }
      that.currentSubmergedroadsLayer = submergedroadsResult.layer
      that.currentSubmergedroadsLayer.set('layerName', 'submergedroads#' + `${time}`)
    } catch {
      that.$message({
        message: `获取第${time}时刻淹没路网数据失败`,
        type: 'error'
      })
    }

    // 危险路网
    try {
      const res = await that.getSimulationResult('dangerousroads', `${time}`)
      const dangerousroadsResult = processRoads(that, res, that.layerColors.dangerousRoads)
      that.map.removeLayer(that.currentDangerousroadsLayer)
      if (that.showLayers.dangerousRoads) {
        that.map.addLayer(dangerousroadsResult.layer)
      }
      that.currentDangerousroadsLayer = dangerousroadsResult.layer
      that.currentDangerousroadsLayer.set('layerName', 'dangerousroads#' + `${time}`)
    } catch {
      that.$message({
        message: `获取第${time}时刻危险路网数据失败`,
        type: 'error'
      })
    }

    // 可用路网
    try {
      const res = await that.getSimulationResult('availableroads', `${time}`)
      const availableroadsResult = processRoadsWithLevel(that, res, that.layerColors.availableRoads)
      that.map.removeLayer(that.currentAvailableroadsLayer)
      if (that.showLayers.availableRoads) {
        that.map.addLayer(availableroadsResult.layer)
      }
      that.currentAvailableroadsLayer = availableroadsResult.layer
      that.currentAvailableroadsLayer.set('layerName', 'availableroads#' + `${time}`)
    } catch {
      that.$message({
        message: `获取第${time}时刻可用路网数据失败`,
        type: 'error'
      })
    }
  }

  //居民区韧性
  // buildResidentialAreasAtTime(that, time)

  //可用通信基站
  // buildCommunicationBaseStationAtTime(that, time)
}

// 获取并显示对应时刻的洪涝风险区域和风险点数据
export const buildRiskLayer = async (bindThis, task) => {
  const that = bindThis
  try {
    //获取数据
    let riskCellsLen = await ajax(`information/simulation/length/${task.id}/riskcells/4`)
    const res = await that.getRiskResult('riskcells', '4', riskCellsLen)
    const riskcellsResult = processRiskCells(that, res)
    if (that.showLayers.riskCells) {
      that.map.addLayer(riskcellsResult.layer)
    }
    that.riskCellsLayer = riskcellsResult.layer
    that.riskCellsLayer.set('layerName', 'riskcells')
  } catch {
    that.$message({
      message: '获取模拟风险区域数据失败',
      type: 'error'
    })
  }

  try {
    let riskPointsLen = await ajax(`information/simulation/length/${task.id}/riskpoints/4`)
    const res = await that.getRiskResult('riskpoints', '4', riskPointsLen)
    const riskPointsResult = processRiskPoints(that, res)

    if (that.showLayers.riskPoints) {
      that.map.addLayer(riskPointsResult.layer)
    }
    that.riskPointsLayer = riskPointsResult.layer
    that.riskPointsLayer.set('layerName', 'riskpoints')
  } catch {
    that.$message({
      message: '获取模拟风险点数据失败',
      type: 'error'
    })
  }

}

//测量交通压力并在地图上显示
export async function buildMapPressure(bindThis) {
  const that = bindThis
  //交通压力测度
  // try {
  const res = await that.getTrafficPressure()
  const trafficPressureResult = processPressureRoads(that, res)
  that.map.removeLayer(that.currentTrafficPressureLayer)
  if (that.showLayers.pressure) {
    that.map.addLayer(trafficPressureResult.layer)
  }
  that.currentTrafficPressureLayer = trafficPressureResult.layer
  that.currentTrafficPressureLayer.set('layerName', 'trafficpressure')
  // } catch {
  //   that.$message({
  //     message: `获取交通压力测度数据失败`,
  //     type: 'error'
  //   })
  // }
}

//处理交通压力测度 flow不同粗细 voc不同颜色
function processPressureRoads(bindThis, data) {
  const that = bindThis
  let lineFeatures = []
  let flowMax = 0, flowMin = 1
  data.forEach((item, index) => {
    let flow1 = item.abflow > item.baflow ? item.abflow : item.baflow
    let flow2 = item.abflow < item.baflow ? item.abflow : item.baflow
    flowMax = (parseFloat(flow1) > flowMax) ? parseFloat(flow1) : flowMax
    flowMin = (parseFloat(flow2) < flowMin) ? parseFloat(flow2) : flowMin
  })
  let vocMax = 0, vocMin = 1
  data.forEach((item, index) => {
    let voc1 = item.abvoc > item.bavoc ? item.abvoc : item.bavoc
    let voc2 = item.abvoc < item.bavoc ? item.abvoc : item.bavoc
    vocMax = (parseFloat(voc1) > vocMax) ? parseFloat(voc1) : vocMax
    vocMin = (parseFloat(voc2) < vocMin) ? parseFloat(voc2) : vocMin
  })
  data.forEach((item, index) => {
    const format = new WKT()
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })
    let abvoc = 1
    let bavoc = 1
    if (item.abvoc < 1) {
      abvoc = item.abvoc
    }
    if (item.bavoc < 1) {
      bavoc = item.bavoc
    }
    let abflow = parseFloat(item.abflow)
    let baflow = parseFloat(item.baflow)
    let c1 = 'black'
    let c2 = 'black'
    if (abvoc < 0.4) {
      c1 = 'rgb(' + 0 + ',' + 176 + ',' + 80 + ')'
    } else if (abvoc > 0.4 && abvoc < 0.6) {
      c1 = 'rgb(' + 83 + ',' + 130 + ',' + 83 + ')'
    } else if (abvoc > 0.6 && abvoc < 0.75) {
      c1 = 'rgb(' + 146 + ',' + 208 + ',' + 80 + ')'
    }
    else if (abvoc > 0.75 && abvoc < 0.85) {
      c1 = 'rgb(' + 255 + ',' + 255 + ',' + 0 + ')'
    }
    else if (abvoc > 0.85 && abvoc < 0.95) {
      c1 = 'rgb(' + 255 + ',' + 192 + ',' + 0 + ')'
    } else {
      c1 = 'rgb(' + 255 + ',' + 0 + ',' + 0 + ')'
    }
    if (bavoc < 0.4) {
      c2 = 'rgb(' + 0 + ',' + 176 + ',' + 80 + ')'
    } else if (bavoc > 0.4 && bavoc < 0.6) {
      c2 = 'rgb(' + 83 + ',' + 130 + ',' + 83 + ')'
    } else if (bavoc > 0.6 && bavoc < 0.75) {
      c2 = 'rgb(' + 146 + ',' + 208 + ',' + 80 + ')'
    }
    else if (bavoc > 0.75 & bavoc < 0.85) {
      c2 = 'rgb(' + 255 + ',' + 255 + ',' + 0 + ')'
    }
    else if (bavoc > 0.85 && bavoc < 0.95) {
      c2 = 'rgb(' + 255 + ',' + 192 + ',' + 0 + ')'
    } else {
      c2 = 'rgb(' + 255 + ',' + 0 + ',' + 0 + ')'
    }

    // let c1 = new Color().lerpColors(new Color(0x228B22), new Color(0xffff00), vocNorm1)
    let w1 = (abflow - flowMin) / (flowMax - flowMin) * 20
    // let c2 = new Color().lerpColors(new Color(0x228B22), new Color(0xffff00), vocNorm2)
    let w2 = (baflow - flowMin) / (flowMax - flowMin) * 20
    feature.info = {
      flow1: abflow,
      flow2: baflow,
      voc1: abvoc,
      voc2: bavoc
    }

    //样式
    const style1 = new Style({
      stroke: new Stroke({
        color: c1,
        width: w1
      })
    })
    const style2 = new Style({
      stroke: new Stroke({
        color: c2,
        width: w2
      })
    })
    feature.setStyle(style1)
    //计算反向偏移点的坐标 生成反向的feature
    var multistringPoints = feature.getGeometry().getCoordinates()[0]
    var coords = []
    for (var i = 1; i < multistringPoints.length; i++) {
      var from = multistringPoints[i - 1]
      var to = multistringPoints[i]
      var angle = Math.atan2(to[1] - from[1], to[0] - from[0])
      var dist = 0.0005 * (abflow - flowMin) / (flowMax - flowMin)
      if (i == 1) {
        var newFrom = [
          Math.sin(angle) * dist + from[0],
          -Math.cos(angle) * dist + from[1]
        ]
        var newTo = [
          Math.sin(angle) * dist + to[0],
          -Math.cos(angle) * dist + to[1]
        ]
        coords.push(newFrom)
        coords.push(newTo)
      } else {
        var newOffsetPoint = [Math.sin(angle) * dist + to[0],
        -Math.cos(angle) * dist + to[1]]
        coords.push(newOffsetPoint)

      }
    }

    var newMultiLine = []
    newMultiLine.push(coords)
    var reverseFeature = new Feature({
      geometry: new MultiLineString(newMultiLine)
    })

    reverseFeature.setStyle(style2)
    lineFeatures.push(feature)
    lineFeatures.push(reverseFeature)

  })
  const trafficRoad = new Overlay({
    element: document.getElementById('trafficRoad')
  })
  that.map.addOverlay(trafficRoad)

  that.map.on('singleclick', (e) => {
    // 判断是否点击在点上
    let feature = that.map.forEachFeatureAtPixel(
      e.pixel,
      (feature) => feature
    )

    if (feature) {
      that.$refs.mapInfoPlanPoint.showPopper = false
      // 设置弹窗位置
      that.trafficInfoData = feature.info
      let coordinates = e.coordinate
      trafficRoad.setPosition(coordinates)
      that.$refs.trafficInfo.showPopper = true
    } else {
      that.$refs.mapInfoPlanPoint.showPopper = false
    }
  })

  const layer = new VectorLayer({
    source: new VectorSource({
      features: lineFeatures
    })
  })
  return {
    layer: layer,
    count: lineFeatures.length
  }
}

// --- 处理淹没区域数据，转化为多边形覆盖物 ---
export function processArea(bindThis, data) {
  const that = bindThis
  let totalArea = 0
  let polygonFeatures = []
  data.forEach((item, index) => {
    const format = new WKT()
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })
    feature.name = 'area'
    polygonFeatures.push(feature)
    let geometry = feature.getGeometry()
    // let area = geometry.getArea() * 1000000;
    let area = getArea(geometry, { projection: 'EPSG:4326' })
    let coord = geometry.getFirstCoordinate()
    totalArea += area
    feature.info = {
      id: index,
      coord: coord,
      area: area
    }

  })
  //设置样式
  const style = new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 255, 0.6)',
      width: 0
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.75)'
    })
  })

  //创建layer
  const layer = new VectorLayer({
    source: new VectorSource({
      features: polygonFeatures
    }),
    style: style
  })

  return {
    layer: layer,
    count: polygonFeatures.length,
    area: totalArea
  }

}

// --- 处理风险点数据，转化为点覆盖物 ---
export function processRiskPoints(bindThis, data) {
  const that = bindThis
  let pointFeatures = []
  //获取wkt格式数据
  data.forEach((item, index) => {
    const format = new WKT()
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })
    pointFeatures.push(feature)

  })
  //设置样式
  const style = new Style({
    image: new CircleStyle({
      fill: new Fill({
        color: '#ef9308'
      }),
      radius: 5
    })
  })
  //创建layer
  const layer = new VectorLayer({
    source: new VectorSource({
      features: pointFeatures
    }),
    style: style
  })
  return {
    layer: layer,
    count: pointFeatures.length
  }
}

// --- 处理风险区域数据，转化为多边形覆盖物 ---
export function processRiskCells(bindThis, data) {
  const that = bindThis
  let totalArea = 0
  let polygonFeatures = []
  //获取wkt格式数据
  data.forEach((item, index) => {
    const format = new WKT()
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })
    polygonFeatures.push(feature)
    let geometry = feature.getGeometry()
    // let area = geometry.getArea() * 1000000;
    let area = getArea(geometry, { projection: 'EPSG:4326' })
    totalArea += area

  })
  const style = new Style({
    stroke: new Stroke({
      color: 'rgba(255, 0, 0, 0.6)',
      width: 0
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.8)'
    })
  })
  const layer = new VectorLayer({
    source: new VectorSource({
      features: polygonFeatures
    }),
    style: style
  })

  return {
    layer: layer,
    count: polygonFeatures.length,
    area: totalArea
  }

}

/*rgb颜色转换为十六进制颜色*/
function rgbToHex(r, g, b) {
  var hex = ((r << 16) | (g << 8) | b).toString(16)
  return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex
}

/*十六进制颜色转换为rgb颜色*/
function hexToRgb(hex) {
  var rgb = []
  for (var i = 1; i < 7; i += 2) {
    rgb.push(parseInt('0x' + hex.slice(i, i + 2)))
  }
  return rgb
}

/*计算两个颜色之间的渐变颜色，step为渐变颜色的数量*/
function gradient(startColor, endColor, step) {
  //将hex转换为rgb
  var sColor = hexToRgb(startColor),
    eColor = hexToRgb(endColor)

  //计算R\G\B每一步的差值
  var rStep = (eColor[0] - sColor[0]) / step
  var gStep = (eColor[1] - sColor[1]) / step
  var bStep = (eColor[2] - sColor[2]) / step

  var gradientColorArr = []
  for (var i = 0; i < step; i++) {
    //计算每一步的hex值
    gradientColorArr.push(rgbToHex(parseInt(rStep * i + sColor[0]), parseInt(gStep * i + sColor[1]), parseInt(bStep * i + sColor[2])))
  }
  return gradientColorArr
}

/*处理通信基站的函数*/
async function processBaseStation(bindThis, time) {
  console.log('进入了processBaseStation,此时的时间为', time)
  const that = bindThis
  let totalArea = 0
  let polygonFeatures = []

  //可用的通信基站的面数据的样式
  const styleAvailable = new Style({
    stroke: new Stroke({
      color: 'rgba(255,0,0,0.6)',
      width: 0
    }),
    fill: new Fill({
      color: 'rgb(7,206,53)'
    })
  })

  //不可用的通信基站的面数据的样式
  const styleNotAvailable = new Style({
    stroke: new Stroke({
      color: 'rgba(255,0,0,0.6)',
      width: 0
    }),
    fill: new Fill({
      color: 'rgb(255,0,0)'
    })

  })

  //未损毁的通信基站的样式
  const iconStyleWorkingStation = new Style({
    image: new Icon({
      color: '#ffffff',
      crossOrigin: 'anonymous',
      src: that.iconCommunicationBaseStation,
      scale: 1
    })
  })

  let res
  if (time === 0) {
    //获取通信基站的网格数据
    let urlArea = serverInfo.baseURL + '/information/facility/' + that.city + '/stationarea/stationarea'
    res = await axios.get(urlArea)
    res.data.forEach((item, index) => {
      const format = new WKT()
      const feature = format.readFeature(item.geom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326'
      })
      feature.name = 'AvailableCommunicationBaseStation'
      feature.setStyle(styleAvailable)
      polygonFeatures.push(feature)
      //添加信息
      let geometry = feature.getGeometry()
      let area = geometry.getArea() * 1000000
      let coord = geometry.getFirstCoordinate()
      totalArea += area
      feature.info = {
        id: index,
        coord: coord,
        area: area
      }
    })

    // //获取通信基站的点数据
    // let urlPoint = serverInfo.baseURL + '/information/facility/' + that.city + '/stationpoint/stationpoint'
    // axios.get(urlPoint)
    //   .then(response => {
    //     const pointData = response.data.map(item => {
    //       // 创建点
    //       const point = new Feature({
    //         geometry: item.geom,
    //         data: item
    //       })
    //       point.name = 'AvailableCommunicationBaseStationPoint'
    //
    //       point.setStyle(iconStyleWorkingStation)
    //       polygonFeatures.push(point)
    //     })
    //   })
  } else {

    console.log('进入了else,此时的时间为', time)
    //获取不可用通信基站的网格数据
    let urlArea = serverInfo.baseURL + '/information/getSimulationFacility/' + that.taskId + '/' + time + '/station/' + '/unavailable_station_area'
    console.log('准备发送数据请求', urlArea)
    try {
      res = await axios.get(urlArea)
      console.log('获取到的数据', res)
      res.data.forEach((item, index) => {
        console.log('item', item)
        const format = new WKT()
        const feature = format.readFeature(item.geom, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326'
        })
        feature.name = 'UnavailableCommunicationBaseStation'
        feature.setStyle(styleNotAvailable)
        polygonFeatures.push(feature)
        let geometry = feature.getGeometry()
        let area = geometry.getArea() * 1000000
        let coord = geometry.getFirstCoordinate()
        totalArea += area
        that.currentNotAvailableCommunicationBaseStationServiceArea += area
        feature.info = {
          id: index,
          coord: coord,
          area: area
        }
      })
    } catch (e) {
      console.log('获取不可用基站面数据失败', e)
    }

    console.log('不可用基站面数据处理完成')

    //获取可用通信基站的网格数据
    urlArea = serverInfo.baseURL + '/information/getSimulationFacility/' + that.taskId + '/' + time + '/station/' + '/available_station_area'
    try {
      res = await axios.get(urlArea)
      res.data.forEach((item, index) => {
        const format = new WKT()
        const feature = format.readFeature(item.geom, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326'
        })
        feature.name = 'AvailableCommunicationBaseStation'
        feature.setStyle(styleAvailable)
        polygonFeatures.push(feature)
        let geometry = feature.getGeometry()
        let area = geometry.getArea() * 1000000
        let coord = geometry.getFirstCoordinate()
        totalArea += area
        that.currentAvailableCommunicationBaseStationServiceArea += area
        feature.info = {
          id: index,
          coord: coord,
          area: area
        }
      })

      console.log('可用基站面数据处理完成')
    } catch (e) {
      console.log('获取可用基站面数据失败', e)
    }

    // //获取可用通信基站的点数据
    // let urlPoint = serverInfo.baseURL + '/information/getSimulationFacility/' + that.taskId + '/' + time + '/station/' + '/available_station'
    // axios.get(urlPoint)
    //   .then(response => {
    //     const pointData = response.data.map(item => {
    //       // 创建点
    //       const point = new Feature({
    //         geometry: item.geom,
    //         data: item
    //       })
    //       point.name = 'AvailableCommunicationBaseStationPoint'
    //
    //       point.setStyle(iconStyleWorkingStation)
    //       polygonFeatures.push(point)
    //     })
    //   })
    //
    //
    // console.log('可用基站点数据处理完成')
    //
    // //获取不可用通信基站的点数据
    // urlPoint = serverInfo.baseURL + '/information/getSimulationFacility/' + that.taskId + '/' + time + '/station/' + '/unavailable_station'
    // axios.get(urlPoint)
    //   .then(response => {
    //     const pointData = response.data.map(item => {
    //       // 创建点
    //       const point = new Feature({
    //         geometry: item.geom,
    //         data: item
    //       })
    //       point.name = 'UnavailableCommunicationBaseStationPoint'
    //
    //       point.setStyle(iconStyleWorkingStation)
    //       polygonFeatures.push(point)
    //     })
    //   })
    //
    // console.log('不可用基站点数据处理完成')
  }

  const selectStyle = new Style({
    stroke: new Stroke({
      color: '#ffffff',
      width: 0
    }),
    fill: new Fill({
      color: '#7beeee'
    })
  })
  console.log('锚点一')

  // // 创建geojson据源
  // that.pointLayerSource = new VectorSource({ features: that.mapPointList })
  // // 创建图层 并加载数据
  // that.pointLayer = new VectorLayer({ source: that.pointLayerSource })
  // // 将图层添加地图上
  // that.map.addLayer(that.pointLayer)

  const layer = new VectorLayer({
    source: new VectorSource({
      features: polygonFeatures
    })
  })
  layer.setOpacity(0.5)

  // let selected = null
  // // 鼠标移动事件
  // that.map.on('pointermove', function(event) {
  //   if (selected !== null) {
  //     if(selected.name==='AvailableCommunicationBaseStation') {
  //       selected.setStyle(styleAvailable)
  //     }
  //     else if(selected.name==='UnavailableCommunicationBaseStation') {
  //       selected.setStyle(styleNotAvailable)
  //     }
  //     selected = null
  //   }
  //   that.map.forEachFeatureAtPixel(event.pixel, function(f) {
  //     // 移动到多边形上改变颜色
  //     if (f.name === 'AvailableCommunicationBaseStation'||f.name==='UnavailableCommunicationBaseStation') {
  //       selected = f
  //       f.setStyle(selectStyle)
  //     }
  //     return true
  //   })
  //   if (selected) {
  //     that.map.getTargetElement().style.cursor = 'pointer'
  //   } else {
  //     that.map.getTargetElement().style.cursor = 'auto'
  //   }
  // })
  //
  // console.log('锚点四')
  //
  // that.map.on('click', function(event) {
  //   let click = null
  //   that.map.forEachFeatureAtPixel(event.pixel, function(f) {
  //     if (f.name === 'AvailableCommunicationBaseStation'||f.name === 'UnavailableCommunicationBaseStation') {
  //       const coordinate = event.coordinate
  //
  //       that.popInfo = f.info
  //       click = f
  //       setTimeout(() => {
  //         that.popUpPlanPoint.setPosition(coordinate)
  //         that.showMannualPlanPopUp = true
  //         that.$refs.mapInfoPlanPoint.showPopper = true
  //       }, 100)
  //     }
  //     return true
  //   })
  //   if (!click) {
  //     that.$refs.mapInfoPlanPoint.showPopper = false
  //   }
  // })
  return {
    layer: layer,
    count: polygonFeatures.length,
    area: totalArea
  }
}

/*处理居民区韧性的数据，将其转化成一个个的地图上显示的区域*/
async function processResidentialAreas(bindThis, data, type, disjointList) {
  const that = bindThis

  let totalArea = 0
  let polygonFeatures = []
  // let arrayColor = gradient('FF0000FF', '37FF00BF', 15)//只需要10个颜色，但一些颜色会算超，所以计算的时候按15个颜色计算
  let arrayColor = gradient('FF0000', '37FF00', 11)//只需要10个颜色，但一些颜色会算超，所以计算的时候按15个颜色计算
  let styleNoSelect

  const styleSelect = new Style({
    stroke: new Stroke({
      color: '#ff0000',
      width: 0
    }),
    fill: new Fill({
      color: '#7beeee'
    })
  })

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
  minscore = 0;

  // // 遍历数据数组，比较每个对象的gid值并更新最小值
  // for (let i = 0; i < data.length; i++) {
  //   const obj = data[i]
  //
  // }
  //设置criticalscore的值是一条40%线
  criticalscore = (maxscore - minscore) * 0.4 + minscore

  for (const item of data) {
    // console.log("居民区韧性数值:",item.result)
    // console.log('test data',item)
    const index = data.indexOf(item)//获取到该点的索引值,便于之后在选中之后的样式中恢复其之前的颜色
    let indexColor = parseInt(((item.result - minscore) / maxscore) * 10)//计算当前点对应的颜色索引值
    // let indexColor = parseInt(Math.pow(((item.result - minscore) / maxscore),0.8) * 10)//计算当前点对应的颜色索引值
    if(indexColor>10) indexColor = 10;

    // console.log('indexColor', indexColor)
    try {
      /*获取到该点的wkt范围信息*/
      const url = serverInfo.baseURL + '/information/getCommunityById?city=' + that.city + '&mapname=now&comid=' + item.comid
      let resWkt={}
      let feature
      try {
        resWkt = (await axios.get(url)).data
        const format = new WKT()
        feature = format.readFeature(resWkt.geom, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326'
        })
      }
      catch (e) {
        const coordMerc = fromLonLat([item.lontitude, item.latitude])
        const circleMerc = new Circle(coordMerc, 100)
        let circleWKT = circleMerc.transform('EPSG:3857', 'EPSG:4326')
        feature=new Feature(circleWKT)
        console.log(e)
      }
      // console.log("response wkt",resWkt)


      feature.name = 'ResidentialArea'

      styleNoSelect = new Style({
        stroke: new Stroke({
          color: '#ffffff',
          width: 0
        }),
        fill: new Fill({
          color: arrayColor[indexColor]
        })
      })

      feature.setStyle(styleNoSelect)
      polygonFeatures.push(feature)
      //设置信息
      // console.log("锚点1")
      let geometry = feature.getGeometry()
      var geometryType = geometry.getType();
      let coord
      let area
      // console.log("锚点2")
      if(geometryType==="Circle"){
        // console.log("锚点3")
        coord= geometry.getCenter()
        area=geometry.getRadius() * geometry.getRadius() * Math.PI * 1000000
      }
      else {
        coord= geometry.getFirstCoordinate()
        area=geometry.getArea() * 1000000
      }
      // console.log("锚点4")
      // console.log('coord', coord)
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
        checkTargetInCircleOrCreateCircle(feature.info.coord, feature.info.comid, pop_needed, that.layerDangerousAreaRadius[type], disjointList)
      }

    }
    catch{
      console.warn("processResidentialAreas:韧性区域处理失败!");
    }

  }
  console.warn("processResidentialAreas:完成韧性区域处理",polygonFeatures);
  const layer = new VectorLayer({
    source: new VectorSource({
      features: polygonFeatures
    })
  })

  let selected = null
  // 鼠标移动事件
  that.map.on('pointermove', function (event) {

    if (selected !== null) {
      //读取当前色块原始的颜色，在移除选中之后将色块颜色变回来
      let newStyle = new Style({
        stroke: new Stroke({
          color: '#ffffff',
          width: 0
        }),
        fill: new Fill({
          color: arrayColor[selected.info.colorIndex]
        })
      })
      selected.setStyle(newStyle)
      selected = null

    }
    that.map.forEachFeatureAtPixel(event.pixel, function (f) {
      // 移动到多边形上改变颜色
      if (f.name === 'ResidentialArea') {
        selected = f
        f.setStyle(styleSelect)
      }
      return true
    })
    if (selected) {
      that.map.getTargetElement().style.cursor = 'pointer'
    } else {
      that.map.getTargetElement().style.cursor = 'auto'
    }
  })
  // // 鼠标点击事件
  // const popup = new Overlay({
  //   element: document.getElementById('popup')
  // })
  // that.map.addOverlay(popup)

  that.map.on('click', function (event) {
    let click = null
    that.map.forEachFeatureAtPixel(event.pixel, async function (f) {
      if (f.name === 'ResidentialArea') {
        console.log('点击到了ResidentialArea，其内容为', f)

        // 清空要展示的变量，防止显示异常数据
        that.popInfo = null
        that.currentResidentialAreaInfo = {}

        const coordinate = event.coordinate

        /*将对应的数据存储到变量当中，便于点击之后的显示*/
        that.popInfo = f.info
        that.currentResidentialAreaInfo['position'] = f.info.coord
        that.currentResidentialAreaInfo['score'] = f.info.score

        console.log('info', that.currentResidentialAreaInfo)
        setTimeout(() => {
          that.popUpPlanPoint.setPosition(coordinate)
          that.$refs.mapInfoPlanPoint.showPopper = true
          that.$data.showResidentialAreas = true
        }, 100)
      }
      return true
    })
  })

  return {
    layer: layer,
    count: polygonFeatures.length,
    area: totalArea
  }
}

// 将角度转换为弧度
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
function buildCityDangerousAlarmArea(bindThis, type, disjointList) {
  let that = bindThis
  let features = []
  let newDisjointList = []//危险区域
  for (let circle of disjointList) {
    // console.log("circle",circle)
    if (circle.cover.length >= that.layerDangerousAreaThreshold[type]) {
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

      const style = new Style({
        stroke: new Stroke({
          color: '#ff0000',
          width: 0
        }),
        fill: new Fill({
          color: '#ff0000'
        })
      })

      const circleMerc = new Circle(coordMerc, that.layerDangerousAreaRadius[type])
      const dangerousArea = circleMerc.transform('EPSG:3857', 'EPSG:4326')
      console.log('dangerousArea', dangerousArea)
      let Features = new Feature(dangerousArea)
      Features.setStyle(style)
      features.push(Features)
      // features.push(new Feature(dangerousArea))
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

// --- 处理路网数据，转化为折线覆盖物 ---
function processRoads(bindThis, data, color) {
  const that = bindThis
  let lineFeatures = []

  //遍历数组，处理wkt数据
  data.forEach((item, index) => {
    const format = new WKT()
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })
    lineFeatures.push(feature)

  })
  const style = new Style({
    stroke: new Stroke({
      color: color,
      width: 2
    })
  })
  const layer = new VectorLayer({
    source: new VectorSource({
      features: lineFeatures
    }),
    // style: style,
    style: function (feature, resolution) {
      return getLineStyle(that, color)
    }
  })
  return {
    layer: layer,
    count: lineFeatures.length
  }

}

// --- 处理数据，转化为点覆盖物 ---
function processPoints(bindThis, data, color) {
  const that = bindThis
  let pointFeatures = []

  //遍历数组，处理wkt数据
  data.forEach((item, index) => {
    const format = new WKT()
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })

    //样式
    feature.setStyle(
      new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: color
          }),
          radius: 4
        })
      })
    )
    pointFeatures.push(feature)
  })

  //创建layer
  const layer = new VectorLayer({
    source: new VectorSource({
      features: pointFeatures
      // style: function(feature, resolution){
      //   return getPointStyle(that, color)
      // }
    })
  })
  return {
    layer: layer,
    count: pointFeatures.length
  }

}

// --- 处理数据，转化为多边形覆盖物 ---
export function processPolygon(bindThis, data, color, name = null) {
  const that = bindThis
  let polygonFeatures = []
  //遍历处理wkt数据，将结果放入polygonFeatures中
  data.forEach((item, index) => {
    const format = new WKT()
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })
    //设置属性
    if ('gid' in item) {
      feature.setId(item.gid)
    }
    if (name) {
      feature.name = name
    }
    polygonFeatures.push(feature)

  })
  //样式
  const style = new Style({
    stroke: new Stroke({
      // color: color,
      color: '#333',
      width: 0
    }),
    fill: new Fill({
      color: color
    })
  })
  //使用生成的数组做source
  let source = new VectorSource({
    features: polygonFeatures
  })
  const layer = new VectorLayer({
    source: source,
    style: style
  })

  return {
    layer: layer,
    count: polygonFeatures.length,
    source: source
  }

}

// --- 处理路网数据，转化为折线覆盖物，添加道路灾害等级模拟 ---
function processRoadsWithLevel(bindThis, data, color) {
  const that = bindThis
  let lineFeatures = []

  //遍历处理wkt数据，将结果放入lineFeatures中
  data.forEach((item, index) => {
    const format = new WKT()
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })
    feature.name = 'road'

    //设置属性
    let geometry = feature.getGeometry()
    let coord = geometry.getFirstCoordinate()
    feature.info = {
      id: index,
      coord: coord,
      originalLevel: 1,
      newLevel: 1
    }

    lineFeatures.push(feature)

  })
  const style = new Style({
    stroke: new Stroke({
      color: color,
      width: 2
    })
  })

  const layer = new VectorLayer({
    source: new VectorSource({
      features: lineFeatures
    }),
    // style: style,
    style: function (feature, resolution) {
      return getLineStyle(that, color)
    }
  })

  return {
    layer: layer,
    count: lineFeatures.length
  }
}

//这个函数用于返回一个Style, 其中的Stroke的width会根据zoom等级自动变化
function getLineStyle(bindThis, color) {
  let that = bindThis
  let zoom = that.map.getView().getZoom()
  let zoomStops = [11, 12, 13, 14, 15, 16, 17, 18]
  for (let i of zoomStops) {
    if (zoom < i) {
      return new Style({
        stroke: new Stroke({
          color: color,
          width: (i - 9) * 0.5
        })
      })
    }
  }
  return new Style({
    stroke: new Stroke({
      color: color,
      width: 3.5
    })
  })
}

//这个函数用于返回一个Style,根据zoom的值来设置绘制地图上的点的样式
function getPointStyle(bindThis, color) {
  let that = bindThis
  let zoom = that.map.getView().getZoom()
  let zoomStops = [11, 12, 13, 14, 15, 16, 17, 18]
  for (let i of zoomStops) {
    if (zoom < i) {
      return new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: color
          }),
          radius: (i - 9) * 0.5
        })
      })
    }
    return new Style({
      image: new CircleStyle({
        fill: new Fill({
          color: color
        }),
        radius: 3.5
      })
    })
  }
}

// 根据数据更新传染病网格图层
// useNorm: 是否对数据进行归一化
export function updateInfectionLayer(source, data, colorMap = 0) {
  let features = source.getFeatures()
  // useNorm = false;    // 不使用归一化

  // 找到数据最大值和最小值
  let v_min = Number.MAX_VALUE, v_max = 0
  data.forEach((v) => {
    v = Math.round(v)
    v_min = (v < v_min) ? v : v_min
    v_max = (v > v_max) ? v : v_max
  })
  let all_zero = false
  // 判断数据是否全为0
  if (v_min === v_max) {
    all_zero = true
  }

  // 设置值离散区间
  let intervals = []
  if (colorMap === 0) {
    let step = (v_max - v_min) / (heatmapColors.length - 1)
    intervals.push(v_min)
    for (let i = 1; i < heatmapColors.length - 1; ++i) {
      intervals.push(v_min + step)
    }
    intervals.push(v_max)
  } else if (colorMap === 1) {
    let step = 10
    for (let i = 0; i < heatmapColors.length; ++i) {
      intervals.push(step * i)
    }
  } else {
    let step = 250
    for (let i = 0; i < heatmapColors.length; ++i) {
      intervals.push(step * i)
    }
  }

  // 对网格设置颜色
  features.forEach((feature) => {
    const index = feature.getId()
    let item = data[index]
    let style
    const opacity = 0.75   //不透明度

    let color
    if (all_zero)     // 数据是否全为0，一个颜色
    {
      color = new Color(heatmapColors[0])
    } else {          //  数据不全为零，根据值在两个颜色之间进行插值
      if (item >= intervals[intervals.length - 1]) {
        color = new Color(heatmapColors[intervals.length - 1])
      } else {
        let ii   //interval_index
        for (ii = 1; ii < intervals.length; ++ii) {
          if (item <= intervals[ii]) break
        }
        if (ii >= intervals.length) ii = intervals.length - 1
        let v_norm = (item - intervals[ii - 1]) / (intervals[ii] - intervals[ii - 1])

        color = new Color().lerpColors(
          new Color(heatmapColors[ii - 1]),
          new Color(heatmapColors[ii]),
          v_norm
        )
      }

    }
    color = `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, ${opacity})`
    style = new Style({
      stroke: new Stroke({
        // color: color,
        color: '#333',
        width: 0
      }),
      fill: new Fill({
        color: color
      })
    })
    feature.setStyle(style)
    let coords = feature.getGeometry().getCoordinates()[0]
    feature.info = {
      id: index,
      coords: coords,
      value: item
    }

  })

}

// 根据数据更新传染病风险点图层
export function updateRiskLayer(bindThis, data) {
  const that = bindThis

  //检查当前感染病风险数据源是否存在
  if (!that.currentInfectionGridSource) return

  //设置网格与点的样式
  const gridStyle = new Style({
    stroke: new Stroke({
      color: '#333',
      width: 0
    }),
    fill: new Fill({
      color: '#f00'
    })
  })
  const pointStyle = new Style({
    image: new Icon({
      color: '#ff1a60',
      crossOrigin: 'anonymous',
      src: IconInfection,
      scale: 0.5
    })
  })
  // const pointStyle = new Style({
  //   image: new CircleStyle({
  //     fill: new Fill({
  //       color: '#3aedf2',
  //     }),
  //     radius: 15,
  //   }),
  // })

  let features = []
  //遍历数据
  data.forEach((item) => {
    //获取gid与population
    let gid = item[0]
    let population = item[1]

    let feature = that.currentInfectionGridSource.getFeatureById(gid)
    console.log("updateRiskLayer:",gid,feature);
    if(!feature)  return;
    //创建feature副本feature_new
    let feature_new = feature.clone()
    feature_new.setStyle(gridStyle)
    feature_new.name = 'infection'

    let geom = feature.getGeometry()
    let center = getCenter(geom.getExtent())
    let coords = geom.getCoordinates()[0]
    feature_new.info = {
      id: gid,
      coords: coords,
      value: population,
      center: center,
    }
    //将克隆的feature_new加入features数组中
    // features.push(feature_new)

    //创建点并将点加入features数组中
    let feature_point = new Feature(
      new Point(center)
    )
    feature_point.setStyle(pointStyle)
    feature_point.info ={
      id: gid,
      coords: coords,
      value: population,
      center: center,
    }
    features.push(feature_point)
  })

  let source = new VectorSource({
    features: features
  })
  that.currentRiskSource = source;
  const layer = new VectorLayer({
    source: source
  })
  layer.setOpacity(0.9)
  layer.set('layerName', 'infection-risk')
  //如果先前已存在的传染病风险图层,则从地图中移除该图层。
  if (that.currentRiskLayer) {
    that.map.removeLayer(that.currentRiskLayer)
  }
  //新创建的图层添加到地图中,并将该图层赋值给that.currentRiskLayer，以便后续使用
  that.map.addLayer(layer)
  that.currentRiskLayer = layer

}

// 根据数据构建初始感染点图层
export function buildInitInfectionLayer(bindThis, params) {
  const that = bindThis

  let regions = params.region_list
  let populations = params.I_input
  let keys = Object.keys(regions)
  let features = []
  for (let i = 0; i < keys.length; ++i) {
    let region = regions[keys[i]]
    // let population = populations[keys[i]];
    let feature = new Feature(
      new Point(region)
    )
    features.push(feature)
  }

  const style = {
    'stroke-width': 1,
    'circle-radius': 10,
    'circle-fill-color': 'rgba(255,156,0,0.9)'
  }

  const source = new VectorSource({ features: features })
  const layer = new VectorLayer({
    source: source,
    style: style
  })
  that.initInfectionLayer = layer
  layer.set('layerName', 'initInfection')
  if (that.showLayers.initInfection) {
    that.map.addLayer(layer)
  }

}

// 根据数据构建封锁区域图层
export function buildLockLayer(bindThis, params) {
  const that = bindThis

  let areas = params.lock_area
  let keys = Object.keys(areas)
  let features = []
  for (let i = 0; i < keys.length; ++i) {
    let area = areas[keys[i]]
    let feature = new Feature(
      new Point(area)
    )
    features.push(feature)
  }

  const style = {
    'stroke-width': 1,
    'circle-radius': 10,
    'circle-fill-color': 'rgba(132,112,255,0.9)'
  }

  const source = new VectorSource({ features: features })
  const layer = new VectorLayer({
    source: source,
    style: style
  })
  that.lockLayer = layer
  layer.set('layerName', 'lock')
  if (that.showLayers.lock) {
    that.map.addLayer(layer)
  }

}

// 处理地图事件
export function addMapEventListener(bindThis) {
  const that = bindThis

  const selectStyle = new Style({
    stroke: new Stroke({
      color: '#eee',
      width: 0
    }),
    fill: new Fill({
      color: '#eee'
    })
  })
  let style = null

  let selected = null
  // 鼠标移动事件
  that.map.on('pointermove', function (event) {
    if (selected !== null) {
      selected.setStyle(style)
      selected = null
    }
    that.map.forEachFeatureAtPixel(event.pixel, function (f) {
      // 道路防灾等级模拟
      if (that.creationMode[1] === 'manualPlan' && that.manualPlanMode === 'roadLevel') {
        if (f.name === 'road') {
          selected = f
          style = f.getStyle()
          f.setStyle(selectStyle)
        }
      }
      // 传染病网格
      else if (f.name === 'infection') {
        selected = f
        style = f.getStyle()
        f.setStyle(selectStyle)
      }
      return true
    })
    if (selected) {
      that.map.getTargetElement().style.cursor = 'pointer'
    } else {
      that.map.getTargetElement().style.cursor = 'auto'
    }
  })
  // 鼠标点击事件
  const popupRoad = new Overlay({
    element: document.getElementById('popupRoad')
  })
  const popupInfection = new Overlay({
    element: document.getElementById('popupInfection')
  })
  that.map.addOverlay(popupRoad)
  that.map.addOverlay(popupInfection)

  that.map.on('click', function (event) {
    let click = null
    that.map.forEachFeatureAtPixel(event.pixel, function (f) {
      // 道路防灾等级模拟
      if (that.creationMode[1] === 'manualPlan' && that.manualPlanMode === 'roadLevel') {
        if (f.name === 'road') {
          const coordinate = event.coordinate
          that.$refs.mapInfoPopoverRoad.showPopper = false
          that.popInfoRoad = f.info
          that.popInfoRoad.feature = f
          click = f
          setTimeout(() => {
            popupRoad.setPosition(coordinate)
            that.$refs.mapInfoPopoverRoad.showPopper = true
          }, 100)
        }

      }
      // 传染病网格
      else if (f.name === 'infection') {
        const coordinate = event.coordinate
        popupInfection.setPosition(coordinate)
        that.$refs.mapInfoPopoverInfection.showPopper = false
        that.popInfoInfection = f.info
        that.popInfoInfection.feature = f
        click = f
        setTimeout(() => {
          that.$refs.mapInfoPopoverInfection.showPopper = true
        }, 100)
      }

      return true
    })
    if (!click) {
      that.$refs.mapInfoPopoverRoad.showPopper = false
      that.$refs.mapInfoPopoverInfection.showPopper = false
    }
  })

}

//构建应急计划图层并在地图上显示
export const buildPlanLayer = (bindThis, plan, result) => {
  const that = bindThis

  const color = that.emergencyPlanColors[plan.type]

  let processResult = null

  if (plan.type == 'alternative_point')     // 点
  {
    processResult = processPoints(that, result, color)
  } else if (plan.type == 'risk')   // 多边形
  {
    processResult = processPolygon(that, result, color)
  } else      // 线
  {
    processResult = processRoads(that, result, color)
  }

  if (processResult) {
    processResult.layer.set('layerName', plan['layerName'])
    that.map.addLayer(processResult.layer)
    plan.layer = processResult.layer
    that.emergencyLayers[processResult.layer.layerName] = processResult.layer
  }

}

//构建静态图层，用于在地图上显示多边形或线段
export const buildStaticLayer = (bindThis, type, result) => {
  const that = bindThis

  const color = that.layerColors[type]

  let processResult = null

  if (type == 'building')   // 多边形
  {
    processResult = processPolygon(that, result, color)
  } else if (type == 'road')      // 线
  {
    processResult = processRoads(that, result, color)
  }

  if (processResult) {
    processResult.layer.set('layerName', 'static-' + type)
    that.layers_basic[type] = processResult.layer
    if (that.showLayers[type]) {
      that.map.addLayer(processResult.layer)
    }
  }

}

//返回一个ol/View对象:
export const getNewView = (center, extent, zoom) => {
  return new View({
    //设置你的地图初始中心点
    center: center, // 地图中心点
    zoom: zoom, // 缩放
    maxZoom: 17,//最大缩放层级
    minZoom: 10,//最小缩放层级
    extent: extent, //显示范围
    projection: 'EPSG:4326' // 坐标系
  })
}

//返回一个ol/layer/Tile对象
export const getNewTileLayer = (city) => {
  // 添加一个使用离线瓦片地图的层
  return new TileLayer({
    source: new XYZ({
      projection: 'GCJ-02',
      url: serverInfo.baseURL_three + `/static/mapData/${city}/{z}/{x}/{y}.png`  // 设置本地离线瓦片所在路径
    })
  })
}

export const drawDangerousPoint = (bindThis, pointList, features, layer, map) => {

  const that = bindThis;
  pointList.forEach((point) => {
    const feature = new Feature({
      title: point.display_name,
      geometry: new Point([point.lon, point.lat]),
    })
    feature.setStyle(
      new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: '#FC7C7C',
          }),
          radius: 7,
        }),
      })
    )
    features.push(feature)
  })


  //console.log("feactures",features)
  if (layer === null) {
    layer = new VectorLayer({
      source: new VectorSource({
        features: features,
        projection: 'EPSG:4326'
      })
    })
    map.addLayer(layer)
  }
  map.on('singleclick', (evt) => {
    const pixel = evt.pixel;
    const getFeatures = map.getFeaturesAtPixel(pixel, {
      layerFilter: (clickLayer) => clickLayer === layer,
    });

    if (getFeatures && getFeatures.length > 0) {
      const clickedFeature = getFeatures[0];
      // const geometry = clickedFeature.getGeometry();
      // const coordinates = geometry.getCoordinates();
      // const lon = coordinates[0];
      // const lat = coordinates[1];
      //console.log(`经度：${lon}, 纬度：${lat}`);
      addDangerousPositionPopup(that, pointList, clickedFeature);
    }
  });
  return layer
}

//先将点移除
export const removeNowPoint = (bindThis, index) => {
  const that = bindThis;
  that.floodDangerousPointLayer.getSource().removeFeature(that.floodDangerousPointFeatures[index]);
}

//在将点添加至
export const addPointAgain = (bindThis, index) => {
  const that = bindThis;
  const feature = new Feature({
    title: that.floodDangerousPointList[index].display_name,
    geometry: new Point([that.floodDangerousPointList[index].lon, that.floodDangerousPointList[index].lat]),
  });
  feature.setStyle(
    new Style({
      image: new CircleStyle({
        fill: new Fill({
          color: '#FC7C7C',
        }),
        radius: 10,
      }),
    })
  );
  that.floodDangerousPointFeatures[index] = feature;
  that.floodDangerousPointLayer.getSource().addFeature(that.floodDangerousPointFeatures[index])

}

export const dangerousPointChangeStyle = (bindThis, features, index, color) => {
  //console.log("feacures",features)
  const that = bindThis;
  let radius = 7;

  if (color === '#FF0000') {
    removeNowPoint(that, index);
    addPointAgain(that, index);
    radius = 8;
  }
  features[index].setStyle(
    new Style({
      image: new CircleStyle({
        fill: new Fill({
          color: color
        }),
        radius: radius
      })
    })
  )
}

//添加危险位置弹出框
export const addDangerousPositionPopup = (bindThis, pointList, index) => {
  const that = bindThis;
  var coordinate = [];
  var display_name;
  if (index instanceof Object) {
    const clickedFeature = index;
    const geometry = clickedFeature.getGeometry();
    const coordinates = geometry.getCoordinates();
    display_name = clickedFeature.get('title');
    coordinate = coordinates; // 获取坐标
    coordinate[0] = parseFloat(coordinate[0]).toFixed(3);
    coordinate[1] = parseFloat(coordinate[1]).toFixed(3);
  }
  else {
    coordinate = [parseFloat(pointList[index].lon).toFixed(3), parseFloat(pointList[index].lat).toFixed(3)]; // 获取坐标
    display_name = pointList[index].display_name;
  }
  display_name = display_name.split(',')[0];
  // 使用变量存储弹窗所需的 DOM 对象
  var container = document.getElementById("dangerousPositionPopup");

  var content = document.getElementById("dangerousPositionPopup-content");
  console.log("content", content);
  // 创建一个Overlay
  that.floodDangerousOverlay = new Overlay({
    position: coordinate,

    //autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
    autoPanAnimation: {
    },
    element: container,
  });

  // 设置弹出框的内容
  content.innerHTML = `<div>地点:${display_name} </div><div>经度:${coordinate[0]} </div><div>纬度: ${coordinate[1]}</div>`;

  that.map.addOverlay(that.floodDangerousOverlay);

}
export const buildAutomaticPlanPoint = async (bindThis, points) => {
  const that = bindThis
  deleteMapPlanPoint(that)

  let index = 0
  points.map(item => {
    let position_3857 = [item.positionX, item.positionY]
    let position_4326 = transform(position_3857, 'EPSG:3857', 'EPSG:4326')



    // 创建点
    const point = new Feature({
      projection: 'EPSG:4326',//坐标系类型
      geometry: new Point([position_4326[0], position_4326[1]]),
      data: item
    })


    console.log("point", point)
    point.name = 'PlanPoint'

    //应急医疗点的样式
    const iconStyleEmergencyMedical = new Style({
      image: new Icon({
        color: '#ffffff',
        crossOrigin: 'anonymous',
        src: that.iconEmergencyMedical
      })
    })

    //避难场所点的样式
    const iconStyleShelter = new Style({
      image: new Icon({
        color: '#ffffff',
        crossOrigin: 'anonymous',
        src: that.iconShelter
      })
    })

    //救援物资点的样式
    const iconStyleReliefMaterial = new Style({
      image: new Icon({
        color: '#ffffff',
        crossOrigin: 'anonymous',
        src: that.iconReliefMaterial
      })
    })

    //消防站点的样式
    const iconStyleFirehouse = new Style({
      image: new Icon({
        color: '#ffffff',
        crossOrigin: 'anonymous',
        src: that.iconFirehouse
      })
    })

    // 医院点的样式
    const iconStyleHospital = new Style({
      image: new Icon({
        color: '#ffffff',
        crossOrigin: 'anonymous',
        src: that.iconHospital
      })
    })

    // 学校点的样式
    const iconStyleEducation = new Style({
      image: new Icon({
        color: '#ffffff',
        crossOrigin: 'anonymous',
        src: that.iconEducation
      })
    })

    // 就业点的样式
    const iconStyleEmployment = new Style({
      image: new Icon({
        color: '#ffffff',
        crossOrigin: 'anonymous',
        src: that.iconEmployment
      })
    })

    // 商业点的样式
    const iconStyleCommercialRetail = new Style({
      image: new Icon({
        color: '#ffffff',
        crossOrigin: 'anonymous',
        src: that.iconCommercialRetail
      })
    })

    if (item.type === 'Aid') {
      point.setStyle(iconStyleEmergencyMedical)
    } else if (item.type === 'Shelter') {
      point.setStyle(iconStyleShelter)
    } else if (item.type === 'Supply') {
      point.setStyle(iconStyleReliefMaterial)
    } else if (item.type === 'Break') {
      point.setStyle(iconStyleFirehouse)
    } else if (item.type === 'Hospital') {
      point.setStyle(iconStyleHospital)
    } else if (item.type === 'School') {
      point.setStyle(iconStyleEducation)
    } else if (item.type === 'Work') {
      point.setStyle(iconStyleEmployment)
    } else if (item.type === 'Shopping') {
      point.setStyle(iconStyleCommercialRetail)
    }
    console.log("point", point)
    // 保存到数据  方便删除
    that.mapPointList.push(point)

    console.log("that.mapPointList", that.mapPointList)

    //处理鼠标滚轮事件，使得图标随着地图缩放而缩放
    that.map.getView().on('change:resolution', function () {
      var index = that.map.getView().getZoom()
      var length = that.mapPointList.length
      for (var i = 0; i < length; i++) {
        var style = that.mapPointList[i].getStyle()
        style.getImage().setScale(this.getZoom() * index / 200)
        that.mapPointList[i].setStyle(style)
      }
    })

    //添加展示当前点用的数据
    item.index = index
    index = index + 1
    item.positionX = position_4326[0] * 1
    item.positionY = position_4326[1] * 1
    item.feature = point
    item.position = position_4326


    that.selectionList.push(item)
  })

  // 创建geojson据源
  that.pointLayerSource = new VectorSource({ features: that.mapPointList })
  // 创建图层 并加载数据
  that.pointLayer = new VectorLayer({ source: that.pointLayerSource })
  // 将图层添加地图上
  that.map.addLayer(that.pointLayer)
}

//获取在后端保存好的自动规划数据
export const getAutoPlanList = async (bindThis) => {
  const that = bindThis
  const url = serverInfo.baseURL + '/information/getLongTermList/' + that.bottomMap + "/" + that.city + "/" + that.nowPlanId + "/" + that.taskId + "/" + that.stepTimeMap[that.activeTimeIndex]

  let AutoPlanList = (await axios.get(url)).data

  that.autoPlanList = [] //清空自动规划列表
  // console.log("AutoPlanList",AutoPlanList)
  for (let i = 0; i < AutoPlanList.length; i++) {
    // console.log("Autodata",AutoPlanList[i])
    let tmp_data = {}
    tmp_data.id = AutoPlanList[i].longinvokingid
    tmp_data.name = AutoPlanList[i].longinvokingname
    tmp_data.service = AutoPlanList[i].service

    let res = await requestAPIForlongInvoking(AutoPlanList[i].longinvokingid)
    let status = res.code
    console.log("status", status)
    if (status === 1)
      tmp_data.status = 'finish'
    else if (status === 0)
      tmp_data.status = 'processing'
    else if (status === 2)
      tmp_data.status = 'failed'

    tmp_data.time = res.beginTime
    console.log("tmp_data", tmp_data)
    that.autoPlanList.push(tmp_data)
  }
}

