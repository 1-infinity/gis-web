// echarts
import * as echarts from 'echarts';
import echartTheme from '@/assets/echartTheme.json';
// three
import { Color } from 'three';
// ol
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import * as olProj from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import XYZ from 'ol/source/XYZ';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import WKT from 'ol/format/WKT.js';
import { Fill, Stroke, Style } from 'ol/style.js';
import CircleStyle from "ol/style/Circle";
import Overlay from 'ol/Overlay.js';
import Feature from "ol/Feature";
import { Point } from "ol/geom";

import { getArea } from 'ol/sphere.js';

// custom
import projzh from './proj';
import mapData from './mapData';
import serverInfo from '../serverInfo';

// 坐标系转换
export const initOL = (bindThis) => {
  const that = bindThis;
  const gcj02Extent = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];
  const gcjMecator = new olProj.Projection({
    code: "GCJ-02",
    extent: gcj02Extent,
    units: "m"
  });
  olProj.addProjection(gcjMecator);
  olProj.addCoordinateTransforms("EPSG:4326", gcjMecator, projzh.ll2gmerc, projzh.gmerc2ll);
  olProj.addCoordinateTransforms("EPSG:3857", gcjMecator, projzh.smerc2gmerc, projzh.gmerc2smerc);
  that.gcjMecator = gcjMecator;
}

// 初始化OpenLayer地图
export const initOLMap = (bindThis, city) => {
  console.log(city);
  const that = bindThis;
  // 获取地图容器
  let mapDom = document.getElementById('aMap' + that.idSuffix);
  // 初始化地图配置
  that.map = new Map({
    target: mapDom, // 地图容器
    view: new View({
      //设置你的地图初始中心点
      center: mapData[city].center, // 地图中心点
      zoom: that.zoomLevel, // 缩放
      maxZoom: 17,//最大缩放层级
      minZoom: 10,//最小缩放层级
      extent: mapData[city].extent, //显示范围
      projection: 'EPSG:4326' // 坐标系
    })
  });
  // 添加一个使用离线瓦片地图的层
  const offlineMapLayer = new TileLayer({
    source: new XYZ({
      projection: that.gcjMecator,
      url: serverInfo.baseURL_three + `/static/mapData/${city}/{z}/{x}/{y}.png`  // 设置本地离线瓦片所在路径
    })
  });
  // 将图层添加到地图
  that.map.addLayer(offlineMapLayer);

}

// 新建地图，显示初始时刻的模拟结果
export const buildMap = async (bindThis) => {
  const that = bindThis;
  try {
    that.showLoading = true;
    that.eleDisabled = true;
    initOLMap(that, that.status.area);


    // 淹没区域
    try {
      const res = await that.getSimulationResult("submergedcells", '4');
      const processResult = processArea(that, res);
      const polygonLayer = processResult.layer;
      polygonLayer.set("layerName", "submergedcells#4");
      if (that.showSubmergedcells) {
        that.map.addLayer(polygonLayer);
        setTimeout(function () {
          that.map.removeLayer(polygonLayer);
          that.map.addLayer(polygonLayer);
        }, 2000);
      }
      that.currentSubmergedcellsLayer = polygonLayer;
      that.waterCount = that.status.resultLens["submergedcells"]['4'];
      // that.waterArea = processResult.area;
      if (processResult.area > 10000) {
        that.waterArea = Math.round((processResult.area / 1000000) * 100) / 100 + 'km²';
      } else {
        that.waterArea = Math.round(processResult.area * 100) / 100 + ' ' + 'm²';
      }
    }
    catch {
      that.$message({
        message: `获取第4时刻淹没区域数据失败`,
        type: "error",
      });
    }

    // 危险路网
    try {
      const res = await that.getSimulationResult("dangerousroads", '4');
      const dangerousroadsResult = processRoads(that, res, '#ff0000');
      if (that.showDangerousroads)
        that.map.addLayer(dangerousroadsResult.layer);
      that.currentDangerousroadsLayer = dangerousroadsResult.layer;
      that.currentDangerousroadsLayer.set("layerName", "dangerousroads#4");
    }
    catch {
      that.$message({
        message: `获取第4时刻危险路网数据失败`,
        type: "error",
      });
    }

    // 淹没路网
    try {
      const res = await that.getSimulationResult("submergedroads", '4');
      const submergedroadsResult = processRoads(that, res, '#00ffff');
      if (that.showSubmergedroads)
        that.map.addLayer(submergedroadsResult.layer);
      that.currentSubmergedroadsLayer = submergedroadsResult.layer;
      that.currentSubmergedroadsLayer.set("layerName", "submergedroads#4");
    }
    catch {
      that.$message({
        message: `获取第4时刻淹没路网数据失败`,
        type: "error",
      });
    }

    // 可用路网
    try {
      const res = await that.getSimulationResult("availableroads", '4');
      const availableroadsResult = processRoads(that, res, '#008000');
      if (that.showAvailableroads)
        that.map.addLayer(availableroadsResult.layer);
      that.currentAvailableroadsLayer = availableroadsResult.layer;
      that.currentAvailableroadsLayer.set("layerName", "availableroads#4");
    }
    catch {
      that.$message({
        message: `获取第4时刻可用路网数据失败`,
        type: "error",
      });
    }

    that.showLoading = false;
    that.eleDisabled = false;
    that.showResult = true;

  }
  catch (e) {
    console.error("BuildMap:", e);
    that.$message.error(`发生了错误:${JSON.stringify(e)}`);
  }
}

// 获取并显示对应时刻的模拟数据
export const buildMapAtTime = async (bindThis, time) => {
  const that = bindThis;
  try {
    that.showLoading = true;
    that.eleDisabled = true;

    // 淹没区域
    try {
      const res = await that.getSimulationResult("submergedcells", `${time}`);
      const processResult = processArea(that, res);
      const polygonLayer = processResult.layer;
      polygonLayer.set("layerName", "submergedcells#" + `${time}`);
      that.map.removeLayer(that.currentSubmergedcellsLayer);
      if (that.showSubmergedcells)
        that.map.addLayer(polygonLayer);
      that.currentSubmergedcellsLayer = polygonLayer;
      that.waterCount = that.status.resultLens["submergedcells"][`${time}`];
      // that.waterArea = processResult.area;
      if (processResult.area > 10000) {
        that.waterArea = Math.round((processResult.area / 1000000) * 100) / 100 + 'km²';
      } else {
        that.waterArea = Math.round(processResult.area * 100) / 100 + ' ' + 'm²';
      }
    }
    catch {
      that.$message({
        message: `获取第${time}时刻淹没区域数据失败`,
        type: "error",
      });
    }

    // 危险路网
    try {
      const res = await that.getSimulationResult("dangerousroads", `${time}`);
      const dangerousroadsResult = processRoads(that, res, '#ff0000');
      that.map.removeLayer(that.currentDangerousroadsLayer);
      if (that.showDangerousroads)
        that.map.addLayer(dangerousroadsResult.layer);
      that.currentDangerousroadsLayer = dangerousroadsResult.layer;
      that.currentDangerousroadsLayer.set("layerName", "dangerousroads#" + `${time}`);
    }
    catch {
      that.$message({
        message: `获取第${time}时刻危险路网数据失败`,
        type: "error",
      });
    }

    // 淹没路网
    try {
      const res = await that.getSimulationResult("submergedroads", `${time}`);
      const submergedroadsResult = processRoads(that, res, '#00ffff');
      if (that.showSubmergedroads)
        that.map.addLayer(submergedroadsResult.layer);
      that.currentSubmergedroadsLayer = submergedroadsResult.layer;
      that.currentSubmergedroadsLayer.set("layerName", "submergedroads#" + `${time}`);
    }
    catch {
      that.$message({
        message: `获取第${time}时刻淹没路网数据失败`,
        type: "error",
      });
    }


    // 可用路网
    try {
      const res = await that.getSimulationResult("availableroads", `${time}`);
      const availableroadsResult = processRoads(that, res, '#008000');
      that.map.removeLayer(that.currentAvailableroadsLayer);
      if (that.showAvailableroads)
        that.map.addLayer(availableroadsResult.layer);
      that.currentAvailableroadsLayer = availableroadsResult.layer;
      that.currentAvailableroadsLayer.set("layerName", "availableroads#" + `${time}`);
    }
    catch {
      that.$message({
        message: `获取第${time}时刻可用路网数据失败`,
        type: "error",
      });
    }


    that.showLoading = false;
    that.eleDisabled = false;
  } catch (e) {
    that.$message.error(`获取模拟数据失败:${JSON.stringify(e)}`);
    console.error(e);
  }
};


// 新建查看风险地图
export const buildMapRisk = async (bindThis) => {
  const that = bindThis;
  try {

    // 获取地图容器
    let mapDom = document.getElementById('aMapRisk' + that.idSuffix);
    // 初始化地图配置
    that.mapRisk = new Map({
      target: mapDom, // 地图容器
      view: new View({
        //设置你的地图初始中心点
        center: mapData[that.status.area].center, // 地图中心点
        zoom: that.zoomLevel, // 缩放
        maxZoom: 17,//最大缩放层级
        minZoom: 10,//最小缩放层级
        extent: mapData[that.status.area].extent, //显示范围
        projection: 'EPSG:4326' // 坐标系
      })
    });
    // 添加一个使用离线瓦片地图的层
    const offlineMapLayer = new TileLayer({
      source: new XYZ({
        projection: that.gcjMecator,
        url: serverInfo.baseURL_three + `/static/mapData/${that.status.area}/{z}/{x}/{y}.png`  // 设置本地离线瓦片所在路径
      })
    });
    // 将图层添加到地图
    that.mapRisk.addLayer(offlineMapLayer);

  } catch (e) {
    console.error(e, 888);
    that.$message.error(`查看风险地图失败:${JSON.stringify(e)}`);
  }

};

// 新建查看医疗测度地图
export const buildMapHospital = async (bindThis) => {
  const that = bindThis;
  try {

    // 获取地图容器
    let mapDom = document.getElementById('aMapHospital' + that.idSuffix);
    // 初始化地图配置
    that.mapHospital = new Map({
      target: mapDom, // 地图容器
      view: new View({
        //设置你的地图初始中心点
        center: mapData[that.status.area].center, // 地图中心点
        zoom: that.zoomLevel, // 缩放
        maxZoom: 17,//最大缩放层级
        minZoom: 10,//最小缩放层级
        extent: mapData[that.status.area].extent, //显示范围
        projection: 'EPSG:4326' // 坐标系
      })
    });
    // 添加一个使用离线瓦片地图的层
    const offlineMapLayer = new TileLayer({
      source: new XYZ({
        projection: that.gcjMecator,
        url: serverInfo.baseURL_three + `/static/mapData/${that.status.area}/{z}/{x}/{y}.png`  // 设置本地离线瓦片所在路径
      })
    });
    // 将图层添加到地图
    that.mapHospital.addLayer(offlineMapLayer);

  } catch (e) {
    console.error(e, 888);
    that.$message.error(`发生了错误:${JSON.stringify(e)}`);
  }

};

// 新建查看道路连通子图地图
export const buildMapSubgraph = async (bindThis) => {
  const that = bindThis;
  try {

    // 获取地图容器
    let mapDom = document.getElementById('aMapSubgraph' + that.idSuffix);
    // 初始化地图配置
    that.mapSubgraph = new Map({
      target: mapDom, // 地图容器
      view: new View({
        //设置你的地图初始中心点
        center: mapData[that.status.area].center, // 地图中心点
        zoom: that.zoomLevel, // 缩放
        maxZoom: 17,//最大缩放层级
        minZoom: 10,//最小缩放层级
        extent: mapData[that.status.area].extent, //显示范围
        projection: 'EPSG:4326' // 坐标系
      })
    });
    // 添加一个使用离线瓦片地图的层
    const offlineMapLayer = new TileLayer({
      source: new XYZ({
        projection: that.gcjMecator,
        url: serverInfo.baseURL_three + `/static/mapData/${that.status.area}/{z}/{x}/{y}.png`  // 设置本地离线瓦片所在路径
      })
    });
    // 将图层添加到地图
    that.mapSubgraph.addLayer(offlineMapLayer);

  } catch (e) {
    console.error(e, 888);
    that.$message.error(`发生了错误:${JSON.stringify(e)}`);
  }

};


// 新建查看建筑肌理韧性地图
export const buildMapBuilding = async (bindThis) => {
  const that = bindThis;
  try {

    // 获取地图容器
    let mapDom = document.getElementById('aMapBuilding' + that.idSuffix);
    // 初始化地图配置
    that.mapBuilding = new Map({
      target: mapDom, // 地图容器
      view: new View({
        //设置你的地图初始中心点
        center: mapData[that.status.area].center, // 地图中心点
        zoom: that.zoomLevel, // 缩放
        maxZoom: 17,//最大缩放层级
        minZoom: 10,//最小缩放层级
        extent: mapData[that.status.area].extent, //显示范围
        projection: 'EPSG:4326' // 坐标系
      })
    });
    // 添加一个使用离线瓦片地图的层
    const offlineMapLayer = new TileLayer({
      source: new XYZ({
        projection: that.gcjMecator,
        url: serverInfo.baseURL_three + `/static/mapData/${that.status.area}/{z}/{x}/{y}.png`  // 设置本地离线瓦片所在路径
      })
    });
    // 将图层添加到地图
    that.mapBuilding.addLayer(offlineMapLayer);

  } catch (e) {
    console.error(e, 888);
    that.$message.error(`发生了错误:${JSON.stringify(e)}`);
  }

};


// 新建查看医疗测度地图
export const buildMapMedical = async (bindThis) => {
  const that = bindThis;
  try {

    // 获取地图容器
    let mapDom = document.getElementById('aMapMedical' + that.idSuffix);
    // 初始化地图配置
    that.mapMedical = new Map({
      target: mapDom, // 地图容器
      view: new View({
        //设置你的地图初始中心点
        center: mapData[that.status.area].center, // 地图中心点
        zoom: that.zoomLevel, // 缩放
        maxZoom: 17,//最大缩放层级
        minZoom: 10,//最小缩放层级
        extent: mapData[that.status.area].extent, //显示范围
        projection: 'EPSG:4326' // 坐标系
      })
    });
    // 添加一个使用离线瓦片地图的层
    const offlineMapLayer = new TileLayer({
      source: new XYZ({
        projection: that.gcjMecator,
        url: serverInfo.baseURL_three + `/static/mapData/${that.status.area}/{z}/{x}/{y}.png`  // 设置本地离线瓦片所在路径
      })
    });
    // 将图层添加到地图
    that.mapMedical.addLayer(offlineMapLayer);

  } catch (e) {
    console.error(e, 888);
    that.$message.error(`发生了错误:${JSON.stringify(e)}`);
  }

};

// 绘制交通韧性折线图
export const buildChart = async (bindThis) => {
  const that = bindThis;

  echarts.registerTheme('customed', echartTheme);
  that.myChart = echarts.init(document.getElementById('chart' + that.idSuffix), 'customed');
  var option = {
    xAxis: {
      type: 'category',
      data: ['4时', '8时', '12时', '16时', '20时', '24时'],
      name: '时刻',
      nameLocation: 'center',
      nameTextStyle: {
        color: 'black',
        fontSize: 16,
      },
      nameGap: 40,
    },
    yAxis: {
      type: 'value',
      name: '交通韧性值',
      nameLocation: 'center',
      nameTextStyle: {
        color: 'black',
        fontSize: 16,
      },
      nameGap: 40,
    },
    series: [
      {
        data: that.resilenceData,
        type: 'line'
      }
    ]
  };
  // 绘制图表
  that.myChart.setOption(option);

};

// 绘制网络连通效率折线图
export const buildChartConnection = async (bindThis) => {
  const that = bindThis;
  let xData = [], yData = [];
  that.connectivityData.forEach((item) => {
    xData.push(item.type);
    yData.push(item.globalConnectivity);
  });

  echarts.registerTheme('customed', echartTheme);
  that.myChartConnection = echarts.init(document.getElementById('chartConnection'), 'customed');
  var option = {
    xAxis: {
      type: 'category',
      data: xData,
      name: '重现期',
      nameLocation: 'center',
      nameTextStyle: {
        color: 'black',
        fontSize: 16,
      },
      nameGap: 40,
    },
    yAxis: {
      type: 'value',
      name: '网络全局效率',
      nameLocation: 'center',
      nameTextStyle: {
        color: 'black',
        fontSize: 16,
      },
      nameGap: 40,
    },
    series: [
      {
        data: yData,
        type: 'line'
      }
    ]
  };
  // 绘制图表
  that.myChartConnection.setOption(option);

};


// --- 处理淹没区域数据，转化为多边形覆盖物 ---
export function processArea(bindThis, data) {
  const that = bindThis;
  let totalArea = 0;
  let polygonFeatures = [];
  data.forEach((item, index) => {
    const format = new WKT();
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
    });
    feature.name = "area";
    polygonFeatures.push(feature);
    let geometry = feature.getGeometry();
    // let area = geometry.getArea() * 1000000;
    let area = getArea(geometry, { projection: 'EPSG:4326' });
    let coord = geometry.getFirstCoordinate();
    totalArea += area;
    feature.info = {
      id: index,
      coord: coord,
      area: area,
    };

  });
  const style = new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 255, 0.6)',
      width: 0,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.75)',
    }),
  });
  const selectStyle = new Style({
    stroke: new Stroke({
      color: '#7beeee',
      width: 0,
    }),
    fill: new Fill({
      color: '#7beeee',
    }),
  });

  const layer = new VectorLayer({
    source: new VectorSource({
      features: polygonFeatures,
    }),
    style: style,
  });

  let selected = null;
  // 鼠标移动事件
  that.map.on('pointermove', function (event) {
    if (selected !== null) {
      selected.setStyle(style);
      selected = null;
    }
    that.map.forEachFeatureAtPixel(event.pixel, function (f) {
      // 移动到多边形上改变颜色
      if (f.name === "area") {
        selected = f;
        f.setStyle(selectStyle);
      }
      return true;
    });
    if (selected) {
      that.map.getTargetElement().style.cursor = "pointer";
    }
    else {
      that.map.getTargetElement().style.cursor = "auto";
    }
  });
  // 鼠标点击事件
  const popup = new Overlay({
    element: document.getElementById('popup'),
  });
  that.map.addOverlay(popup);

  that.map.on('click', function (event) {
    let click = null;
    that.map.forEachFeatureAtPixel(event.pixel, function (f) {
      if (f.name === "area") {
        const coordinate = event.coordinate;
        that.$refs.mapInfoPopover.showPopper = false;
        that.popInfo = f.info;
        click = f;
        setTimeout(() => {
          popup.setPosition(coordinate);
          that.$refs.mapInfoPopover.showPopper = true;
        }, 100);
      }
      return true;
    });
    if (!click) {
      that.$refs.mapInfoPopover.showPopper = false;
    }
  });

  return {
    layer: layer,
    count: polygonFeatures.length,
    area: totalArea,
  };

}

// --- 处理路网数据，转化为折线覆盖物 ---
export function processRoads(bindThis, data, color) {
  const that = bindThis;
  let lineFeatures = [];

  data.forEach((item, index) => {
    const format = new WKT();
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
    });
    lineFeatures.push(feature);

  });
  const style = new Style({
    stroke: new Stroke({
      color: color,
      width: 3,
    }),
  });
  const layer = new VectorLayer({
    source: new VectorSource({
      features: lineFeatures,
    }),
    style: style,
  });
  return {
    layer: layer,
    count: lineFeatures.length,
  }

}

// --- 处理风险点数据，转化为点覆盖物 ---
export function processRiskPoints(bindThis, data) {
  const that = bindThis;
  let pointFeatures = [];
  data.forEach((item, index) => {
    const format = new WKT();
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
    });
    pointFeatures.push(feature);

  });
  const style = new Style({
    image: new CircleStyle({
      fill: new Fill({
        color: '#ef9308',
      }),
      radius: 5,
    })
  });
  const layer = new VectorLayer({
    source: new VectorSource({
      features: pointFeatures,
    }),
    style: style,
  });
  return {
    layer: layer,
    count: pointFeatures.length
  };
}

// --- 处理风险区域数据，转化为多边形覆盖物 ---
export function processRiskCells(bindThis, data) {
  const that = bindThis;
  let totalArea = 0;
  let polygonFeatures = [];
  data.forEach((item, index) => {
    const format = new WKT();
    const feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
    });
    polygonFeatures.push(feature);
    let geometry = feature.getGeometry();
    // let area = geometry.getArea() * 1000000;
    let area = getArea(geometry, { projection: 'EPSG:4326' });
    totalArea += area;


  });
  const style = new Style({
    stroke: new Stroke({
      color: 'rgba(255, 0, 0, 0.6)',
      width: 0,
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.8)',
    }),
  });
  const layer = new VectorLayer({
    source: new VectorSource({
      features: polygonFeatures,
    }),
    style: style,
  });

  return {
    layer: layer,
    count: polygonFeatures.length,
    area: totalArea
  };

}

// --- 处理医疗服务数据，转化为点覆盖物 ---
export function processHospitalPoints(bindThis, data) {
  const that = bindThis;
  let points = [];
  let pointFeatures = [];

  let valueMax = 0, valueMin = 1;
  data.forEach((item, index) => {
    valueMax = (item.result > valueMax) ? item.result : valueMax;
    valueMin = (item.result < valueMin) ? item.result : valueMin;
  });

  data.forEach((item, index) => {
    let valueNorm = (item.result - valueMin) / (valueMax - valueMin);
    let color = new Color().lerpColors(
      new Color(0xffff00),
      new Color(0xff0000),
      valueNorm
    );

    const feature = new Feature({
      geometry: new Point([item.longtitude, item.latitude])
    });
    feature.name = "point";
    feature.setStyle(
      new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: '#' + color.getHexString(),
          }),
          radius: 7,
        })
      })
    )
    feature.info = {
      id: index,
      name: item.name,
      address: item.address,
      value: item.result
    };
    pointFeatures.push(feature);

  });

  let selected = null;
  let style = null;
  let selectStyle = new Style({
    image: new CircleStyle({
      fill: new Fill({
        color: '#aa0000',
      }),
      radius: 7,
    })
  });
  // 鼠标移动事件
  that.mapHospital.on('pointermove', function (event) {
    if (selected !== null) {
      selected.setStyle(style);
      selected = null;
    }
    that.mapHospital.forEachFeatureAtPixel(event.pixel, function (f) {
      // 移动到多边形上改变颜色
      if (f.name === "point") {
        selected = f;
        style = f.getStyle();
        f.setStyle(selectStyle);
      }
      return true;
    });
    if (selected) {
      that.mapHospital.getTargetElement().style.cursor = "pointer";
    }
    else {
      that.mapHospital.getTargetElement().style.cursor = "auto";
    }
  });
  // 鼠标点击事件
  const popup = new Overlay({
    element: document.getElementById('popupHostipal'),
  });
  that.mapHospital.addOverlay(popup);

  that.mapHospital.on('click', function (event) {
    let click = null;
    that.mapHospital.forEachFeatureAtPixel(event.pixel, function (f) {
      if (f.name === "point") {
        const coordinate = event.coordinate;
        that.$refs.mapInfoPopoverHostipal.showPopper = false;
        that.popInfoHostipal = f.info;
        click = f;
        setTimeout(() => {
          popup.setPosition(coordinate);
          that.$refs.mapInfoPopoverHostipal.showPopper = true;
        }, 100);
      }
      return true;
    });
    if (!click) {
      that.$refs.mapInfoPopoverHostipal.showPopper = false;
    }
  });

  const layer = new VectorLayer({
    source: new VectorSource({
      features: pointFeatures,
    }),
  });
  return {
    layer: layer,
    count: pointFeatures.length
  };

}

// --- 处理道路连通子图数据，转化为折线覆盖物 ---
export function processSubgraph(bindThis, data, color) {
  const that = bindThis;
  let lineFeatures = [];
  let maxLen = 300;
  data.forEach((items) => {
    for (let i = 0; i < items.length && i < maxLen; ++i) {
      const format = new WKT();
      const feature = format.readFeature(items[i], {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326',
      });
      lineFeatures.push(feature);
    }

  })
  const style = new Style({
    stroke: new Stroke({
      color: color,
      width: 6,
    }),
  });
  const layer = new VectorLayer({
    source: new VectorSource({
      features: lineFeatures,
    }),
    style: style,
  });
  return {
    layer: layer,
    count: lineFeatures.length,
  }

}


// --- 处理建筑肌理韧性数据，转化为多边形覆盖物 ---
export function processBuilding(bindThis, data, range) {
  const that = bindThis;
  let polygonFeatures = [];

  let valueMin = range[0], valueMax = range[1];

  data.forEach((item, index) => {
    const format = new WKT();
    const feature = format.readFeature(item[1], {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
    });
    feature.name = "building";

    let valueNorm = (item[0] - valueMin) / (valueMax - valueMin);
    let color;
    if (valueNorm < 0.2) {
      color = "#ff0000";
    }
    else if (valueNorm < 0.4) {
      color = "#ff9900";
    }
    else if (valueNorm < 0.6) {
      color = "#ffff00";
    }
    else if (valueNorm < 0.8) {
      color = "#00ffff";
    }
    else {
      color = "#0000ff";
    }
    feature.setStyle(new Style({
      fill: new Fill({
        color: color
      }),
    }));

    polygonFeatures.push(feature);
    let geometry = feature.getGeometry();
    // let area = geometry.getArea() * 1000000;
    let area = getArea(geometry, { projection: 'EPSG:4326' });
    let coord = geometry.getFirstCoordinate();
    feature.info = {
      id: index,
      coord: coord,
      area: area,
      value: valueNorm,
    };

  });
  // const style = new Style({
  //   stroke: new Stroke({
  //     color: 'rgba(59, 76, 93, 0.6)',
  //     width: 0,
  //   }),
  //   fill: new Fill({
  //     color: 'rgba(59, 76, 93, 0.75)',
  //   }),
  // });
  const selectStyle = new Style({
    fill: new Fill({
      color: 'rgb(159, 176, 193)',
    }),
  });

  const layer = new VectorLayer({
    source: new VectorSource({
      features: polygonFeatures,
    }),
    // style: style,
  });
  let style;
  let selected = null;
  // 鼠标移动事件
  that.mapBuilding.on('pointermove', function (event) {
    if (selected !== null) {
      selected.setStyle(style);
      selected = null;
    }
    that.mapBuilding.forEachFeatureAtPixel(event.pixel, function (f) {
      // 移动到多边形上改变颜色
      if (f.name === "building") {
        selected = f;
        style = f.getStyle();
        f.setStyle(selectStyle);
      }
      return true;
    });
    if (selected) {
      that.mapBuilding.getTargetElement().style.cursor = "pointer";
    }
    else {
      that.mapBuilding.getTargetElement().style.cursor = "auto";
    }
  });
  // 鼠标点击事件
  const popup = new Overlay({
    element: document.getElementById('popupBuilding'),
  });
  that.mapBuilding.addOverlay(popup);

  that.mapBuilding.on('click', function (event) {
    let click = null;
    that.mapBuilding.forEachFeatureAtPixel(event.pixel, function (f) {
      if (f.name === "building") {
        const coordinate = event.coordinate;
        that.$refs.mapInfoPopoverBuilding.showPopper = false;
        that.popInfoBuilding = f.info;
        click = f;
        setTimeout(() => {
          popup.setPosition(coordinate);
          that.$refs.mapInfoPopoverBuilding.showPopper = true;
        }, 100);
      }
      return true;
    });
    if (!click) {
      that.$refs.mapInfoPopoverBuilding.showPopper = false;
    }
  });

  return {
    layer: layer,
    count: polygonFeatures.length,
  };

}

// --- 处理医疗灾害测度数据，转化为点覆盖物 ---
export function processMedicalPoints(bindThis, data) {
  const that = bindThis;
  let points = [];
  let pointFeatures = [];

  let valueMax = 0, valueMin = 1;
  data.forEach((item, index) => {
    valueMax = (item.result > valueMax) ? item.result : valueMax;
    valueMin = (item.result < valueMin) ? item.result : valueMin;
  });

  data.forEach((item, index) => {
    let valueNorm = (item.result - valueMin) / (valueMax - valueMin);
    let color = new Color().lerpColors(
      new Color(0xffff00),
      new Color(0xff0000),
      item.result
    );
    const feature = new Feature({
      geometry: new Point([item.longitude, item.latitude])
    });
    feature.name = "point";
    feature.setStyle(
      new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: '#' + color.getHexString(),
          }),
          radius: 7,
        })
      })
    )
    feature.info = item;
    pointFeatures.push(feature);

  });

  let selected = null;
  let style = null;
  let selectStyle = new Style({
    image: new CircleStyle({
      fill: new Fill({
        color: '#aa0000',
      }),
      radius: 7,
    })
  });
  // 鼠标移动事件
  that.mapMedical.on('pointermove', function (event) {
    if (selected !== null) {
      selected.setStyle(style);
      selected = null;
    }
    that.mapMedical.forEachFeatureAtPixel(event.pixel, function (f) {
      // 移动到多边形上改变颜色
      if (f.name === "point") {
        selected = f;
        style = f.getStyle();
        f.setStyle(selectStyle);
      }
      return true;
    });
    if (selected) {
      that.mapMedical.getTargetElement().style.cursor = "pointer";
    }
    else {
      that.mapMedical.getTargetElement().style.cursor = "auto";
    }
  });
  // 鼠标点击事件
  const popup = new Overlay({
    element: document.getElementById('popupMedical'),
  });
  that.mapMedical.addOverlay(popup);

  that.mapMedical.on('click', function (event) {
    let click = null;
    that.mapMedical.forEachFeatureAtPixel(event.pixel, function (f) {
      if (f.name === "point") {
        const coordinate = event.coordinate;
        that.$refs.mapInfoPopoverMedical.showPopper = false;
        that.popInfoMedical = f.info;
        click = f;
        setTimeout(() => {
          popup.setPosition(coordinate);
          that.$refs.mapInfoPopoverMedical.showPopper = true;
        }, 100);
      }
      return true;
    });
    if (!click) {
      that.$refs.mapInfoPopoverMedical.showPopper = false;
    }
  });

  const layer = new VectorLayer({
    source: new VectorSource({
      features: pointFeatures,
    }),
  });
  return {
    layer: layer,
    count: pointFeatures.length
  };

}
