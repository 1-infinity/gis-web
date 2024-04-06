<template>
  <div class="main-wrapper" flex flex-box="1">
    <div flex-box="1" flex="dir:col">
      <div class="border-box" flex-box="1" flex="dir:col">
        <div class="show-board">
          <div>
            <!-- <span class="color-block" style="background: #555350"></span>原始建筑物
            <span>
              <span class="color-block" style="background: #00ffff"></span>淹没建筑物
            </span> -->
            <span>
              <span class="color-block" style="background: #00ffff"></span>淹没路网
            </span>
            <span>
              <span class="color-block" style="background: #008000"></span>可用路网
            </span>
            <span>
              <span class="color-block" style="background: #0000ff"></span>淹没区域
            </span>
            <span>
              <span class="color-block" style="background: #ff0000"></span>危险区域
            </span>
            <span>
              <span class="color-block" style="background: #ef9308"></span>危险点
            </span>
          </div>
          <div class="time-step-controler">
            <el-steps align-center :active="active" style="width: 70%">
              <el-step title="时刻:4"></el-step>
              <el-step title="时刻:8"></el-step>
              <el-step title="时刻:12"></el-step>
              <el-step title="时刻:16"></el-step>
              <el-step title="时刻:20"></el-step>
              <el-step title="时刻:24"></el-step>
            </el-steps>
            <el-button style="margin-left: 16px" @click="previous" :disabled="eleDisabled || active < 1" type="primary">
              上一时刻
            </el-button>
            <el-button style="margin-left: 16px" @click="next" :disabled="eleDisabled || active > 4" type="primary">下一时刻
            </el-button>
          </div>
          <div id="canvasName" class="canvasName"> <strong>当前视图：</strong> {{ canvasNames[canvasIndex] }} </div>
          <div id="resultCanvas" class="resultCanvas" v-loading="showLoading" v-show="showResult">
            <div id="panel" class="panel">
              <div class="panel-info">
                <div class="card">
                  <div class="line">
                    <p class="label">
                      <i class="el-icon-date"></i>
                      时间：
                    </p>
                    <p>{{ status.date }}</p>
                  </div>
                  <div class="line">
                    <p class="label">
                      <i class="el-icon-position"></i>
                      位置：
                    </p>
                    <p>{{ parseCity(status.area) }}</p>
                  </div>
                  <div class="line">
                    <p class="label">
                      <i class="el-icon-heavy-rain"></i>
                      淹没区域数量：
                    </p>
                    <p>{{ waterCount }}</p>
                  </div>
                  <div class="line">
                    <p class="label">
                      <i class="el-icon-s-grid"></i>
                      淹没总面积：
                    </p>
                    <p>{{ waterArea }} m²</p>
                  </div>
                  <div class="line">
                    <p class="label">
                      <i class="el-icon-time"></i>
                      模拟计算时间：
                    </p>
                    <p>{{ computeTime }}</p>
                  </div>
                  <div class="line">
                    <p class="label">
                      <i class="el-icon-view"></i>
                      当前视图：
                    </p>
                    <p>{{ canvasNames[canvasIndex] }}</p>
                  </div>
                </div>
                <div class="card">
                  <div class="line">
                    <p class="label">
                      重置视图：
                    </p>
                    <button class="controlButton" @click="resetView">
                      <i class="el-icon-location-information controlIcon"></i>
                    </button>
                  </div>
                  <div class="line">
                    <p class="label">
                      淹没区域显示：
                    </p>
                    <el-switch v-model="showSubmergedcells" @change="onDisplayChange" active-color="#5177d2">
                    </el-switch>
                  </div>
                  <div class="line">
                    <p class="label">
                      淹没路网显示：
                    </p>
                    <el-switch v-model="showDangerousroads" @change="onDisplayChange" active-color="#5177d2">
                    </el-switch>
                  </div>
                  <div class="line">
                    <p class="label">
                      可用路网显示：
                    </p>
                    <el-switch v-model="showAvailableroads" @change="onDisplayChange" active-color="#5177d2">
                    </el-switch>
                  </div>
                  <div class="line">
                    <p class="label">
                      卫星图显示：
                    </p>
                    <el-switch v-model="showSatellite" @change="onSatelliteChange" active-color="#5177d2">
                    </el-switch>
                  </div>
                  <div class="line" v-show="showRisk">
                    <p class="label">
                      危险点显示：
                    </p>
                    <el-switch v-model="showRiskPoints" @change="onDisplayChange" active-color="#5177d2">
                    </el-switch>
                  </div>
                  <div class="line" v-show="showRisk">
                    <p class="label">
                      危险区域显示：
                    </p>
                    <el-switch v-model="showRiskCells" @change="onDisplayChange" active-color="#5177d2">
                    </el-switch>
                  </div>
                </div>
                <div class="card">
                  <div class="line">
                    <p class="label">
                      返回地图：
                    </p>
                    <button class="controlButton" @click="goBackToMap">
                      <i class="el-icon-back controlIcon"></i>
                    </button>
                  </div>
                  <div class="line">
                    <p class="label">
                      显示风险区域和风险点：
                    </p>
                    <button class="controlButton" @click="onDisplayRisk">
                      <i class="el-icon-warning-outline controlIcon"></i>
                    </button>
                  </div>
                  <div class="line">
                    <p class="label">
                      显示交通韧性：
                    </p>
                    <button class="controlButton" @click="onDisplayChart">
                      <i class="el-icon-pie-chart controlIcon"></i>
                    </button>
                  </div>
                  <div class="line">
                    <p class="label">
                      显示医疗服务测度：
                    </p>
                    <button class="controlButton" @click="onDisplayHospital">
                      <i class="el-icon-office-building controlIcon"></i>
                    </button>
                  </div>

                </div>
                <div class="card">
                  <div class="line">
                    <p class="label">
                      导出结果：
                    </p>
                    <button class="controlButton" @click="showResultDialog">
                      <i class="el-icon-download controlIcon"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div id="containerCard" class="containerCard">
              <div :id="'aMap' + idSuffix" class="aMap" v-show="canvasIndex == 0"></div>
              <rainstormSimulationThree v-show="canvasIndex == 1" ref="childThree" />
              <div :id="'chart' + idSuffix" class="chart" v-show="canvasIndex == 2"></div>
              <div :id="'aMapRisk' + idSuffix" class="aMap" v-show="canvasIndex == 3"></div>
              <div :id="'aMapHospital' + idSuffix" class="aMap" v-show="(canvasIndex == 4)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="导出模拟结果" :visible.sync="dialogVisible" :modal-append-to-body="false" width="600px" :modal="false"
      :center="true">
      <div v-loading="resultPacking">
        <el-table ref="multipleTable" :data="resultFiles" tooltip-effect="dark" style="width: 100%"
          @selection-change="resultSelectionChange">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="type" label="类型" width="120" align="center">
          </el-table-column>
          <el-table-column prop="time" label="时刻" width="120" align="center">
          </el-table-column>
          <el-table-column prop="name" label="文件名" align="center">
          </el-table-column>
          <el-table-column prop="number" label="文件数量" width="100" align="center">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="downloadResult">下载</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import serverInfo from '@/views/simulator/serverInfo';
import ajax from "@/views/simulator/ajax";

import WKT from 'terraformer-wkt-parser';

import rainstormSimulationThree from "./rainstormSimulationThree.vue";

import * as echarts from 'echarts';
import echartTheme from '@/assets/echartTheme.json';

import { Color } from 'three';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// 新建地图，显示初始时刻的模拟结果
const buildAMap = async (bindThis) => {
  const that = bindThis;
  try {
    that.map = new AMap.Map('aMap' + that.idSuffix, {
      mapStyle: 'amap://styles/macaron', // 设置地图的显示样式
    });
    setTimeout(function () {
      that.map.setCity(that.cityName, function () {
        that.map.setZoom(that.zoomLevel);
      });
    }, 500);
    that.satelliteLayer = new AMap.TileLayer.Satellite();

    that.showLoading = true;
    that.eleDisabled = true;

    // 绘制边界
    const districtSearch = new AMap.DistrictSearch({
      level: 'district', // 关键字对应的行政区级别，district表示区/县
      subdistrict: 0, //  显示下级行政区级数，0表示不需要返回下级行政区
      extensions: 'all', // 返回行政区边界坐标组等具体信息
    });
    districtSearch.search(that.cityName, function (status, result) {
      if (result.info === "OK") {
        var bounds = result.districtList[0].boundaries;
        if (bounds) {
          // 生成行政区划polygon
          for (var i = 0; i < bounds.length; ++i) { // 构造MultiPolygon的path
            bounds[i] = [bounds[i]]
          }
          let polygon = new AMap.Polygon({
            strokeWeight: 2,
            path: bounds,
            fillOpacity: 0.0,
            strokeColor: '#57606f'
          });
          that.map.add(polygon)
          that.map.setFitView(polygon);// 视口自适应
        }
      }
    });

    // 淹没区域
    try {
      const res = await that.getSimulationResult("submergedcells", '4');
      const processResult = processArea(that, res);
      const polygonGroup = processResult.group;
      if (that.showSubmergedcells) {
        that.map.add(polygonGroup);
        setTimeout(function () {
          that.map.remove(polygonGroup);
          that.map.add(polygonGroup);
        }, 2000);
      }
      that.currentSubmergedcellsGroup = polygonGroup;
      that.waterCount = that.status.resultLens["submergedcells"][0];
      that.waterArea = processResult.area;
    }
    catch {
      that.$message({
        message: `获取第4时刻淹没区域数据失败`,
        type: "error",
      });
    }

    // 淹没路网
    try {
      const res = await that.getSimulationResult("dangerousroads", '4');
      const dangerousroadsResult = processRoads(that, res, '#00ffff');
      if (that.showDangerousroads)
        that.map.add(dangerousroadsResult.group);
      that.currentDangerousroadsGroup = dangerousroadsResult.group;
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
        that.map.add(availableroadsResult.group);
      that.currentAvailableroadsGroup = availableroadsResult.group;
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
  } catch (e) {
    console.error(e, 888);
    that.$message.error(`发生了错误:${JSON.stringify(e)}`);
  }
};

// 新建查看风险地图
const buildAMapRisk = async (bindThis) => {
  const that = bindThis;
  try {
    that.mapRisk = new AMap.Map('aMapRisk' + that.idSuffix, {
      mapStyle: 'amap://styles/macaron', // 设置地图的显示样式
    });
    setTimeout(function () {
      that.mapRisk.setCity(that.cityName, function () {
        that.mapmapRisk.setZoom(that.zoomLevel);
      });
    }, 500);


    // 绘制边界
    const districtSearch = new AMap.DistrictSearch({
      level: 'district', // 关键字对应的行政区级别，district表示区/县
      subdistrict: 0, //  显示下级行政区级数，0表示不需要返回下级行政区
      extensions: 'all', // 返回行政区边界坐标组等具体信息
    });
    districtSearch.search(that.cityName, function (status, result) {
      if (result.info === "OK") {
        var bounds = result.districtList[0].boundaries;
        if (bounds) {
          // 生成行政区划polygon
          for (var i = 0; i < bounds.length; ++i) { // 构造MultiPolygon的path
            bounds[i] = [bounds[i]]
          }
          let polygon = new AMap.Polygon({
            strokeWeight: 2,
            path: bounds,
            fillOpacity: 0.0,
            strokeColor: '#57606f'
          });
          that.mapRisk.add(polygon)
          that.mapRisk.setFitView(polygon);// 视口自适应
        }
      }
    });

  } catch (e) {
    console.error(e, 888);
    that.$message.error(`查看风险地图失败:${JSON.stringify(e)}`);
  }

};

// 新建查看医疗测度地图
const buildAMapHospital = async (bindThis) => {
  const that = bindThis;
  try {
    that.mapHospital = new AMap.Map('aMapHospital' + that.idSuffix, {
      mapStyle: 'amap://styles/macaron', // 设置地图的显示样式
    });
    setTimeout(function () {
      that.mapHospital.setCity(that.cityName, function () {
        that.mapmapHospital.setZoom(that.zoomLevel);
      });
    }, 500);


    // 绘制边界
    const districtSearch = new AMap.DistrictSearch({
      level: 'district', // 关键字对应的行政区级别，district表示区/县
      subdistrict: 0, //  显示下级行政区级数，0表示不需要返回下级行政区
      extensions: 'all', // 返回行政区边界坐标组等具体信息
    });
    districtSearch.search(that.cityName, function (status, result) {
      if (result.info === "OK") {
        var bounds = result.districtList[0].boundaries;
        if (bounds) {
          // 生成行政区划polygon
          for (var i = 0; i < bounds.length; ++i) { // 构造MultiPolygon的path
            bounds[i] = [bounds[i]]
          }
          let polygon = new AMap.Polygon({
            strokeWeight: 2,
            path: bounds,
            fillOpacity: 0.0,
            strokeColor: '#57606f'
          });
          that.mapHospital.add(polygon)
          that.mapHospital.setFitView(polygon);// 视口自适应
        }
      }
    });

  } catch (e) {
    console.error(e, 888);
    that.$message.error(`发生了错误:${JSON.stringify(e)}`);
  }

};

// 获取并显示对应时刻的模拟数据
const buildAMapAtTime = async (bindThis, time) => {
  const that = bindThis;
  try {
    that.showLoading = true;
    that.eleDisabled = true;

    // 淹没区域
    try {
      const res = await that.getSimulationResult("submergedcells", `${time}`);
      const processResult = processArea(that, res);
      const polygonGroup = processResult.group;
      that.map.remove(that.currentSubmergedcellsGroup);
      if (that.showSubmergedcells)
        that.map.add(polygonGroup);
      that.currentSubmergedcellsGroup = polygonGroup;
      that.waterCount = that.status.resultLens["submergedcells"][0];
      that.waterArea = processResult.area;
    }
    catch {
      that.$message({
        message: `获取第${time}时刻淹没区域数据失败`,
        type: "error",
      });
    }

    // 淹没路网
    try {
      const res = await that.getSimulationResult("dangerousroads", `${time}`);
      const dangerousroadsResult = processRoads(that, res, '#00ffff');
      that.map.remove(that.currentDangerousroadsGroup);
      if (that.showDangerousroads)
        that.map.add(dangerousroadsResult.group);
      that.currentDangerousroadsGroup = dangerousroadsResult.group;
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
      that.map.remove(that.currentAvailableroadsGroup);
      if (that.showAvailableroads)
        that.map.add(availableroadsResult.group);
      that.currentAvailableroadsGroup = availableroadsResult.group;
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

// --- 处理淹没区域数据，转化为多边形覆盖物 ---
function processArea(bindThis, data) {
  const that = bindThis;
  let polygonArray = [];
  let totalArea = 0;
  data.forEach((item, index) => {
    let points = [];
    let geojson = WKT.parse(item.geom);
    let coords = geojson.coordinates[0][0];
    for (let i = 0; i < 4; ++i) {
      points.push(new AMap.LngLat(coords[i][0], coords[i][1]));
    }

    // 计算区域面积
    let area = Math.round(AMap.GeometryUtil.ringArea(points));
    totalArea += area;
    let polygon = new AMap.Polygon(
      {
        strokeWeight: 0,
        path: points,
        fillOpacity: 0.8,
        fillColor: '#0000ff',
      }

    );
    polygon.on('mouseover', () => {
      polygon.setOptions({
        fillOpacity: 0.8,
        fillColor: '#7beeee'
      });
    });
    polygon.on('mouseout', () => {
      polygon.setOptions({
        fillOpacity: 0.8,
        fillColor: '#0000ff'

      });
    });
    polygon.on('click', () => {
      let link = `./city_rainstorm.html?areaIndex=${index}`;
      var content = [
        `<center><span style="color:#000">${index}号淹没区域</span></center>`,
        `<span style="color:#000">坐标：(${coords[4][0].toFixed(3)},${coords[4][1].toFixed(3)})</span>`,
        `<span style="color:#000">面积：${area} 平方米</span>`,
        `<center><a style="color:#1059a1" onClick="window.displayThree()">进入</a></center>`,
      ];
      // 创建 infoWindow 实例
      var infoWindow = new AMap.InfoWindow({
        content: content.join("<br>") // 传入 dom 对象，或者 html 字符串
      });
      // 打开信息窗体
      infoWindow.open(that.map, coords[4]);
    });

    polygonArray.push(polygon);

  });
  let polygonGroup = new AMap.OverlayGroup(polygonArray);

  return {
    group: polygonGroup,
    count: polygonGroup.getOverlays().length,
    area: totalArea
  };

}

// --- 处理路网数据，转化为折线覆盖物 ---
function processRoads(bindThis, data, color) {
  const that = bindThis;
  let polylineArray = [];

  data.forEach((item, index) => {
    let geojson = WKT.parse(item.geom);
    let path = geojson.coordinates[0];
    let polyline = new AMap.Polyline({
      path: path,
      isOutline: false,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 6,
      strokeStyle: "solid",
      lineJoin: 'round',
      lineCap: 'round',
    });
    polylineArray.push(polyline);

  });
  let polylineGroup = new AMap.OverlayGroup(polylineArray);

  return {
    group: polylineGroup,
    count: polylineGroup.getOverlays().length,
  };

}

// --- 处理风险点数据，转化为点覆盖物 ---
function processRiskPoints(bindThis, data) {
  const that = bindThis;
  let points = [];
  data.forEach((item, index) => {
    let geojson = WKT.parse(item.geom);
    points.push(new AMap.Circle({
      center: new AMap.LngLat(geojson.coordinates[0], geojson.coordinates[1]),
      radius: 30,
      fillColor: '#ef9308',
      strokeWeight: 0,
    }));

  });
  let pointsGroup = new AMap.OverlayGroup(points);

  return {
    group: pointsGroup,
    count: pointsGroup.getOverlays().length,
  };

}

// --- 处理风险区域数据，转化为多边形覆盖物 ---
function processRiskCells(bindThis, data) {
  const that = bindThis;
  let polygonArray = [];
  let totalArea = 0;
  data.forEach((item, index) => {
    let points = [];
    let geojson = WKT.parse(item.geom);
    let coords = geojson.coordinates[0][0];
    for (let i = 0; i < 4; ++i) {
      points.push(new AMap.LngLat(coords[i][0], coords[i][1]));
    }

    // 计算区域面积
    let area = Math.round(AMap.GeometryUtil.ringArea(points));
    totalArea += area;
    let polygon = new AMap.Polygon(
      {
        strokeWeight: 0,
        path: points,
        fillOpacity: 0.8,
        fillColor: '#ff0000',
      }

    );

    polygonArray.push(polygon);

  });
  let polygonGroup = new AMap.OverlayGroup(polygonArray);
  return {
    group: polygonGroup,
    count: polygonGroup.getOverlays().length,
    area: totalArea
  };

}

// --- 处理医疗服务数据，转化为点覆盖物 ---
function processHospitalPoints(bindThis, data) {
  const that = bindThis;
  let points = [];

  let valueMax = 0, valueMin = 1;
  data.forEach((item, index) => {
    valueMax = (item.result > valueMax) ? item.result : valueMax;
    valueMin = (item.result < valueMin) ? item.result : valueMin;
  });

  data.forEach((item, index) => {
    let valueNorm = (item.result - valueMin) / (valueMax - valueMin);
    let color = new Color().lerpColors(
      new Color(0x000000),
      new Color(0xff0000),
      valueNorm
    );

    let point = new AMap.Circle({
      center: new AMap.LngLat(item.longtitude, item.latitude),
      radius: 80,
      fillColor: '#' + color.getHexString(),
      fillOpacity: 0.9,
      strokeWeight: 0,
    });

    point.on('click', () => {
      console.log("Click");
      var content = [
        `<center><span style="color:#000">${index}号医疗服务测度点</span></center>`,
        `<span style="color:#000">名称：${item.name}</span>`,
        `<span style="color:#000">地址：${item.address}</span>`,
        `<span style="color:#000">医疗服务测度值：${item.result.toFixed(4)}</span>`,
      ];
      // 创建 infoWindow 实例
      var infoWindow = new AMap.InfoWindow({
        content: content.join("<br>") // 传入 dom 对象，或者 html 字符串
      });
      // 打开信息窗体
      infoWindow.open(that.mapHospital, [item.longtitude, item.latitude]);
    });
    point.on('mouseover', () => {
      point.setOptions({
        fillColor: '#ff8800'
      });
    });
    point.on('mouseout', () => {
      point.setOptions({
        fillColor: '#' + color.getHexString()
      });
    });

    points.push(point);



  });
  let pointsGroup = new AMap.OverlayGroup(points);

  return {
    group: pointsGroup,
    count: pointsGroup.getOverlays().length,
  };

}

// 绘制交通韧性折线图
const buildChart = async (bindThis) => {
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


export default {
  name: "components_1_4",
  data() {
    return {
      showLoading: false,
      active: 0,
      map: null,
      mapRisk: null,
      mapHospital: null,
      eleDisabled: true,
      metricDisabled: true,
      dialogVisible: false,
      isShowRisked: false,

      showResult: true,
      canvasIndex: 0,

      currentSubmergedcellsGroup: null,
      currentDangerousroadsGroup: null,
      currentAvailableroadsGroup: null,
      riskPointsGroup: null,
      riskCellsGroup: null,

      showSubmergedcells: true,
      showDangerousroads: false,
      showAvailableroads: false,

      showRisk: false,
      showRiskCells: true,
      showRiskPoints: true,

      showSatellite: false,

      satelliteLayer: null,
      waterCount: 0,
      waterArea: 0,
      computeTime: 0,
      myChart: null,

      riskCreated: false,

      resilenceData: [],

      canvasNames: {
        0: "模拟结果(每个时刻)",
        1: "人群疏散",
        2: "交通韧性",
        3: "风险区域和风险点(24小时内)",
        4: "医疗服务测度"
      },

      currentSimulationResult: null,
      cityName: "广州",
      zoomLevel: 10,

      resultFiles: [],
      resultSelection: [],
      resultPacking: false,
    };
  },
  components: {
    rainstormSimulationThree,
  },
  props: {
    type: {
      type: String,
    },
    status: {
      type: Object,
    },
    metric: {
      type: Object,
    },
    idSuffix: {
      type: String,
      default: "",
    },
  },
  watch: {
    type(newVal) {
      if (newVal) {
        this.active = 0;
        this.showLoading = false;
      }
    },
    status() {
      if (this.type == "flood") {
        this.onStatusChange();
      }
    },
    metric(newVal) {
      this.metricDisabled = false;
    },
  },
  mounted() {
    window.displayThree = this.displayThree;
    window.onresize = () => {
      this.myChart.resize();
    };
    if (this.type == "flood") {
      this.onStatusChange();
    }
  },
  methods: {
    onStatusChange() {
      this.eleDisabled = true;
      this.metricDisabled = true;
      this.dialogVisible = false;
      this.isShowRisked = false;

      this.showSubmergedcells = true;
      this.showDangerousroads = false;
      this.showAvailableroads = false;

      this.showRisk = true;
      this.showRiskCells = true;
      this.showRiskPoints = false;

      this.showSatellite = false;

      this.active = 0;
      this.canvasIndex = 0;

      this.riskCreated = false;

      this.computeTime = this.status.computeTime;
      this.currentSimulationResult = {
        "submergedcells": {},
        "availableroads": {},
        "dangerousroads": {},
        "riskcells": {},
        "riskpoints": {},
      };

      if (this.map) {
        this.map.destroy();
      }
      if (this.mapRisk) {
        this.mapRisk.destroy();
      }

      this.cityName = this.parseCity(this.status.area);

      buildAMap(this);

      this.resultFiles = [];
      this.resultSelection = [];
      this.resultPacking = false;
    },
    async onShowRisks() {
      try {
        let riskCellsLen = await ajax(`information/simulation/length/${this.status.id}/riskcells/4`);
        const res = await this.getRiskResult("riskcells", '4', riskCellsLen);
        const riskcellsResult = processRiskCells(this, res);
        if (this.showRiskCells)
          this.mapRisk.add(riskcellsResult.group);
        this.riskCellsGroup = riskcellsResult.group;
      }
      catch {
        this.$message({
          message: "获取模拟风险区域数据失败" + (err.message || ""),
          type: "error",
        });
      }

      try {
        let riskPointsLen = await ajax(`information/simulation/length/${this.status.id}/riskpoints/4`);
        const res = await this.getRiskResult("riskpoints", '4', riskPointsLen);
        const riskPointsResult = processRiskPoints(this, res);
        if (this.showRiskPoints)
          this.mapRisk.add(riskPointsResult.group);
        this.riskPointsGroup = riskPointsResult.group;
      }
      catch {
        this.$message({
          message: "获取模拟风险点数据失败" + (err.message || ""),
          type: "error",
        });
      }

      this.showRisk = true;
    },
    previous() {
      const stepTimeMap = {
        0: 4,
        1: 8,
        2: 12,
        3: 16,
        4: 20,
        5: 24,
      };
      this.active--;
      if (this.active < 0) {
        this.active = 0;
        return;
      }

      buildAMapAtTime(this, stepTimeMap[this.active]);
    },
    next() {
      const stepTimeMap = {
        0: 4,
        1: 8,
        2: 12,
        3: 16,
        4: 20,
        5: 24,
      };
      this.active++;
      if (this.active > 5) {
        this.active = 5;
        return;
      }

      buildAMapAtTime(this, stepTimeMap[this.active]);

    },
    resetView() {
      if (this.canvasIndex == 0) {
        this.map.setCity(this.cityName, function () {
          this.map.setZoom(this.zoomLevel);
        });
      }
      else if (this.canvasIndex == 3) {
        this.mapRisk.setCity(this.cityName, function () {
          this.mapRisk.setZoom(this.zoomLevel);
        });
      }

    },
    onSatelliteChange(value) {
      if (value) {
        this.map.add(this.satelliteLayer);
      } else {
        this.map.remove(this.satelliteLayer);
      }
    },
    onDisplayChange() {
      if (this.showSubmergedcells) {
        this.map.add(this.currentSubmergedcellsGroup);
      } else {
        this.map.remove(this.currentSubmergedcellsGroup);
      }

      if (this.showDangerousroads) {
        this.map.add(this.currentDangerousroadsGroup);
      } else {
        this.map.remove(this.currentDangerousroadsGroup);
      }

      if (this.showAvailableroads) {
        this.map.add(this.currentAvailableroadsGroup);
      } else {
        this.map.remove(this.currentAvailableroadsGroup);
      }

      if (this.showRisk && this.mapRisk) {
        if (this.showRiskPoints) {
          this.mapRisk.add(this.riskPointsGroup);
        }
        else {
          this.mapRisk.remove(this.riskPointsGroup);
        }
        if (this.showRiskCells) {
          this.mapRisk.add(this.riskCellsGroup);
        }
        else {
          this.mapRisk.remove(this.riskCellsGroup);
        }
      }

    },
    displayThree() {
      this.showThree = true;
      this.canvasIndex = 1;
      this.$refs.childThree.start();
    },
    goBackToMap() {
      this.showThree = false;
      this.canvasIndex = 0;
      this.$refs.childThree.stop();
      if (this.mapRisk) {
        this.mapRisk.destroy();
        this.mapRisk = null;
      }
    },
    parseMeasureData(data) {
      let items = data.slice(1, -1).split(',');
      let obj = {};
      items.forEach((item) => {
        let item_split = item.split('=');
        let key = Number(item_split[0]);
        let value = Number(item_split[1]);
        obj[key] = value;
      });
      return obj;
    },
    onDisplayChart() {
      let formData = new FormData();
      formData.append("id", this.status.id);
      formData.append("city", this.cityName);

      let url = serverInfo.baseURL_measure + "/measure/resilence";
      let headers = {
        "Content-Type": "multipart/form-data",
      };
      axios
        .post(url, formData, { headers: headers })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            if (res.data.data == "生成韧性测度计算任务成功") {
              this.$message({
                message: res.data.data,
                type: "success",
              });
            }
            else {
              let obj = this.parseMeasureData(res.data.data);
              this.resilenceData = Object.values(obj);
              buildChart(this);
              this.myChart.resize({
                width: document.getElementById("containerCard").offsetWidth
              });
              this.canvasIndex = 2;
            }

          }
          else {
            this.$message({
              message: res.data.errorMsg,
              type: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "获取交通韧性测度失败",
            type: "error",
          });
        });


    },
    onDisplayRisk() {
      this.canvasIndex = 3;
      buildAMapRisk(this);
      setTimeout(() => {
        this.onShowRisks();
      }, 1000);

    },
    onDisplayHospital() {
      buildAMapHospital(this);
      let url = serverInfo.baseURL_measure + "/measure/measureResult?city=" + this.status.area;
      axios
        .post(url)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            const hospitalResult = processHospitalPoints(this, res.data.data);
            this.mapHospital.add(hospitalResult.group);
            setTimeout(() => {
              this.mapHospital.remove(hospitalResult.group);
              this.mapHospital.add(hospitalResult.group);
            }, 2000);
            this.canvasIndex = 4;

          }
          else {
            this.$message({
              message: res.data.errorMsg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "获取医疗服务测度失败",
            type: "error",
          });
        });

    },
    // 城市拼音转中文
    parseCity(city) {
      const cityNames = {
        "shanghai": "上海",
        "chongqing": "重庆",
        "guangzhou": "广州",
        "wulumuqi": "乌鲁木齐",
        "ningbo": "宁波",
        "dongying": "东营",
        "weihai": "威海",
        "zibo": "淄博",
        "lianyungang": "连云港",
        "wuxi": "无锡",
        "ezhou": "鄂州",
        "sihui": "四会",
        "jiading": "嘉定",
      };
      if (city in cityNames) {
        return cityNames[city];
      }
      else {
        return city;
      }
    },
    // 获取模拟结果
    async getSimulationResult(resultType, time) {
      let res;
      if (time in this.currentSimulationResult[resultType]) {
        res = this.currentSimulationResult[resultType][time];
      }
      else {
        let len = this.status.resultLens[resultType][time];
        if (len > 4000) len = 4000;
        res = await ajax(`information/simulation/subresult/${this.status.id}/${resultType}/${time}/0/${len}`);
        this.currentSimulationResult[resultType][time] = res;
      }
      return res;
    },
    // 获取风险点或风险区域
    async getRiskResult(resultType, time, reslLen) {
      let res;
      if (time in this.currentSimulationResult[resultType]) {
        res = this.currentSimulationResult[resultType][time];
      }
      else {
        let len = reslLen;
        if (len > 4000) len = 4000;
        res = await ajax(`information/simulation/subresult/${this.status.id}/${resultType}/${time}/0/${len}`);
        this.currentSimulationResult[resultType][time] = res;
      }
      return res;
    },
    // 勾选结果文件
    resultSelectionChange(val) {
      this.resultSelection = val;
    },
    // 获取模拟结果文件列表
    async getResultFileList() {
      let getURL = (fileName) => {
        return `information/simulation/resultDownload/flood/${this.status.id}/${this.status.area}?path=${fileName}`;
      };

      const resultTypes = ["submergedcells", "availableroads", "dangerousroads"];
      const resultPaths = {
        "submergedcells": "submerged_cells",
        "availableroads": "roads/available_roads",
        "dangerousroads": "roads/dangerous_roads",
      };
      const fileNames = {
        "submergedcells": "submerged_cells",
        "availableroads": "available_roads",
        "dangerousroads": "dangerous_roads",
      };
      const resultNames = {
        "submergedcells": "淹没区域",
        "availableroads": "可用路网",
        "dangerousroads": "淹没路网",
      };
      const times = ["4", "8", "12", "16", "20", "24"];
      const fileTypes = ["shp", "shx", "prj", "fix", "dbf"];

      resultTypes.forEach((resultType) => {
        times.forEach((time) => {
          if (time in this.status.resultLens[resultType]) {
            let resultItems = [];
            fileTypes.forEach((fileType) => {
              resultItems.push({
                name: `${fileNames[resultType]}${time}.${fileType}`,
                url: getURL(`${resultPaths[resultType]}${time}.${fileType}`),
              });
            });
            this.resultFiles.push({
              type: `${resultNames[resultType]}`,
              time: `${time}时`,
              name: `${fileNames[resultType]}${time}.*`,
              files: resultItems,
              number: resultItems.length,
            });
          }
        });
      });

      try {
        let riskCellsLen = await ajax(`information/simulation/length/${this.status.id}/riskcells/4`);
        if (riskCellsLen) {
          let resultItems = [];
          fileTypes.forEach((fileType) => {
            resultItems.push({
              name: `risk_cells.${fileType}`,
              url: getURL(`risk_cells.${fileType}`),
            });
          });
          this.resultFiles.push({
            type: "风险区域",
            time: "4-24时",
            name: `risk_cells.*`,
            files: resultItems,
            number: resultItems.length,
          });
        }
      }
      catch { }
      this.resultFiles.push({
        type: "性能报告",
        time: "-",
        name: `performance.txt`,
        files: [{
          name: "performance.txt",
          url: getURL("performance.txt"),
        }],
        number: 1,
      });

    },
    // 显示导出模拟结果对话框
    async showResultDialog() {
      this.$message({
        message: "开始查询模拟结果文件",
        type: "success",
      });
      this.showLoading = true;
      await this.getResultFileList();
      this.$message({
        message: "查询模拟结果文件成功",
        type: "success",
      });
      this.showLoading = false;
      this.dialogVisible = true;
    },
    // 导出模拟结果
    async downloadResult() {
      console.log("resultSelection:", this.resultSelection);
      this.$message({
        message: "开始打包模拟结果文件",
        type: "success",
      });
      this.resultPacking = true;
      let zipFile = new JSZip();
      for (let i = 0; i < this.resultSelection.length; ++i) {
        let files = this.resultSelection[i].files;
        for (let j = 0; j < files.length; ++j) {
          try {
            let file = files[j];
            let data = await ajax(file.url);
            if (file.name === "performance.txt")
              zipFile.file(file.name, data, { binary: false });
            else
              zipFile.file(file.name, data, { binary: true });
          }
          catch {
            console.log(`下载文件 ${file.url} 失败`);
          }
        }
      }

      zipFile.generateAsync({ type: "blob" })
        .then((blob) => {
          saveAs(blob, `results_${this.status.area}_flood_${this.status.id}`);
          this.resultPacking = false;
        }, (e) => {
          this.$message({
            message: e,
            type: "error",
          });
          this.resultPacking = false;
        });
    }
  },
};
</script>

<style>
.el-step__title.is-process {
  color: #fff !important;
}
</style>
<style lang="scss" scoped>
.color-block {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 0 4px 0 8px;
}

.map-container {
  width: 100%;
  height: 100%;
  padding: 24px;
}

.wsmMap {
  width: 100%;
  height: calc(100% - 96px);
}

.time-step-controler {
  display: flex;
  align-items: center;
  height: 60px;
  margin: 8px 0;
}

.border-box {
  padding-left: 24px;
  padding-bottom: 0;
  padding-top: 0;
}

.show-board {
  padding-top: 50px;
  padding-bottom: 12px;
  height: 100%;
}


.resultCanvas {
  height: calc(100% - 96px);
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.canvasName {
  padding-left: 260px;
  ;
}

.panel {
  width: 250px;
  height: 100%;
  padding-left: 5px;
  display: flex;
  flex-direction: column;

  .line {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .label {
    font-weight: bold;
  }

  p {
    font-size: 16px;
    color: #333;
    margin: 5px 0;
  }


  .panel-info {
    border-radius: 10px;
    transition: 0.3s;
    flex-grow: 1;

  }

  .card {
    border-radius: 10px;
    padding: 15px;
    margin: 10px 0;
    box-shadow: 5px 4px 4px 1px rgba(39, 56, 98, 0.2);
    /* background: rgb(102,197,222);
  background: linear-gradient(135deg, rgba(102,197,222,1) 0%, rgba(81,119,210,1) 100%); */
    background-color: #fff;
    transition: 0.3s;
  }

  .card:hover {
    box-shadow: 5px 4px 4px 3px rgba(39, 56, 98, 0.5);
  }

}


.containerCard {
  flex-grow: 1;
  flex-shrink: 1;
  height: 100%;
  padding: 10px;
  overflow: hidden;
}

.aMap {
  width: 100%;
  height: 60vh;
  font-family: "微软雅黑";
  overflow: hidden;
  border-radius: 10px;
  transition: 0.3s;
}

.chart {
  width: 100%;
  height: 60vh;
  overflow: hidden;
  border-radius: 10px;
  transition: 0.3s;
}

.controlButton {
  outline: none;
  border: none;
  background-color: #fff;
  background: none;
  width: 30px;
  height: 30px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border: 1px solid #5177d2;
  border-radius: 100%;

  .controlIcon {
    color: #5177d2;
  }
}

.controlButton:hover {
  cursor: pointer;

  .controlIcon {
    color: #9097a5;
  }
}

.controlButton:active .controlIcon {
  color: #000;
}
</style>
