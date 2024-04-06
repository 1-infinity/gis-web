<template>
  <div class="main-wrapper" flex flex-box="1">
    <div flex-box="1" flex="dir:col">
      <div class="border-box" flex-box="1" flex="dir:col">
        <div class="show-board">
          <div>
            <span>
              <span class="color-block" style="background: #00ffff"></span>淹没路网
            </span>
            <span>
              <span class="color-block" style="background: #ff0000"></span>危险路网
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
                    <p>{{ waterArea }}</p>
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
                      危险路网显示：
                    </p>
                    <el-switch v-model="showDangerousroads" @change="onDisplayChange" active-color="#5177d2">
                    </el-switch>
                  </div>
                  <div class="line">
                    <p class="label">
                      淹没路网显示：
                    </p>
                    <el-switch v-model="showSubmergedroads" @change="onDisplayChange" active-color="#5177d2">
                    </el-switch>
                  </div>
                  <div class="line">
                    <p class="label">
                      可用路网显示：
                    </p>
                    <el-switch v-model="showAvailableroads" @change="onDisplayChange" active-color="#5177d2">
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

                </div>
                <div class="card">
                  <div class="line">
                    <p class="label">
                      显示城市空间稳健度：
                    </p>
                    <button class="controlButton" @click="onDisplayBuildingResilience">
                      <i class="el-icon-office-building controlIcon"></i>
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
                      显示道路连通子图：
                    </p>
                    <button class="controlButton" @click="onDisplaySubgraph" v-show="!subgraphLoading">
                      <i class="el-icon-s-grid controlIcon"></i>
                    </button>
                    <button class="controlButton controlButtonDis" disabled v-show="subgraphLoading">
                      <i class="el-icon-loading"></i>
                    </button>
                  </div>
                  <!-- <div class="line">
                    <p class="label">
                      显示道路网络连通效率：
                    </p>
                    <button class="controlButton" @click="onDisplayConnectivity">
                      <i class="el-icon-s-grid controlIcon"></i>
                    </button>
                  </div>
                  <div class="line">
                    <p class="label">
                      显示医疗服务测度：
                    </p>
                    <button class="controlButton" @click="onDisplayHospital">
                      <i class="el-icon-school controlIcon"></i>
                    </button>
                  </div>
                  <div class="line">
                    <p class="label">
                      显示医疗服务灾害测度：
                    </p>
                    <button class="controlButton" @click="onDisplayMedicalChange">
                      <i class="el-icon-school controlIcon"></i>
                    </button>
                  </div> -->
                  <!-- <div class="line">
                    <p class="label">
                      显示危化品爆炸范围：
                    </p>
                    <button class="controlButton" @click="onDisplayExplode">
                      <i class="el-icon-sunrise controlIcon"></i>
                    </button>
                  </div> -->
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
              <div :id="'aMapSubgraph' + idSuffix" class="aMap" v-show="(canvasIndex == 5)"></div>
              <div v-show="(canvasIndex == 6)">
                <div :id="'aMapBuilding' + idSuffix" class="aMap"></div>
                <div class="line-building">
                  <div>
                    <div class="line">
                      <span>稳健度阈值：</span>
                      <div>
                        <el-slider v-model="buildingThrehold" :min="0" :max="1" :step="0.01" show-input>
                        </el-slider>
                      </div>
                    </div>
                    <div class="line line-button">
                      <div>
                        <el-button size="small" type="primary" @click="updateBuildingResilience">更新显示</el-button>
                      </div>
                      <div>
                        <el-button size="small" type="primary" @click="downloadBuildingResilience">导出</el-button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="legend">
                      <span>建筑稳健度：</span>
                      <span class="legend-item" style="background: #ff0000"></span><span>0-0.2</span>
                      <span class="legend-item" style="background: #ff9900"></span><span>0.2-0.4</span>
                      <span class="legend-item" style="background: #ffff00"></span><span>0.4-0.6</span>
                    </div>
                    <div class="legend">
                      <span class="legend-item" style="background: #00ffff"></span><span>0.6-0.8</span>
                      <span class="legend-item" style="background: #0000ff"></span><span>0.8-1.0</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <explodeSimulation v-show="canvasIndex == 7" :city="city" /> -->
              <div v-show="(canvasIndex == 8)">
                <div :id="'aMapMedical' + idSuffix" class="aMap"></div>
                <div class="line-building">
                  <div>
                    <span>显示时刻：</span>
                    <el-select v-model="medicalTime" placeholder="时刻" @change="displayMedicalAtTime">
                      <el-option v-for="item in medicalOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="legend-medical">
                    <span>医疗服务测度值：</span>
                    <span class="legend-item"
                      style="background: linear-gradient(90deg,yellow,red);"></span><span>0-1.0</span>
                  </div>
                </div>
              </div>
              <div v-show="(canvasIndex == 9)">
                <div class="tableContainer">
                  <el-table :data="connectivityData">
                    <el-table-column label="重现期" prop="type" align="center" :show-overflow-tooltip="true" />
                    <el-table-column label='失效"边"比例"' prop="edgeRatio" align="center" :show-overflow-tooltip="true" />
                    <el-table-column label="网络全局效率" prop="globalConnectivity" align="center"
                      :show-overflow-tooltip="true" />
                    <el-table-column label="与常态效率的比值" prop="constRatio" align="center" :show-overflow-tooltip="true" />
                  </el-table>
                </div>
                <div id="chartConnection" class="chart-connect"></div>
              </div>
              <!-- 弹窗 -->
              <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPopover">
                <div id="popup" slot="reference"></div>
                <div style="text-align: center;">
                  <span style="color:#000;font-weight:bold;">{{ popInfo.id }}号淹没区域</span>
                  <p style="color:#000"><strong>坐标：</strong>{{
                    `(${popInfo.coord[0].toFixed(3)},${popInfo.coord[1].toFixed(3)})` }}</p>
                  <p style="color:#000"><strong>面积：</strong>{{ popInfo.area.toFixed(4) }} 平方米</p>
                  <span>
                    <el-button @click="closePopover">取消</el-button>
                    <el-button type="primary" @click="displayThree">进入</el-button>
                  </span>
                </div>
              </el-popover>
              <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPopoverHostipal">
                <div id="popupHostipal" slot="reference"></div>
                <div style="text-align: center;">
                  <span style="color:#000;font-weight:bold;">{{ popInfoHostipal.id }}号医疗服务测度点</span>
                  <p style="color:#000"><strong>名称：</strong>{{ popInfoHostipal.name }}</p>
                  <p style="color:#000"><strong>地址：</strong>{{ popInfoHostipal.address }}</p>
                  <p style="color:#000"><strong>医疗服务测度值：</strong>{{ popInfoHostipal.value.toFixed(4) }}</p>
                  <span>
                    <el-button @click="closePopoverHostipal">关闭</el-button>
                  </span>
                </div>
              </el-popover>
              <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPopoverBuilding">
                <div id="popupBuilding" slot="reference"></div>
                <div style="text-align: center;">
                  <span style="color:#000;font-weight:bold;">{{ popInfoBuilding.id }}号建筑物</span>
                  <p style="color:#000"><strong>面积：</strong>{{ popInfoBuilding.area.toFixed(4) }} 平方米</p>
                  <p style="color:#000"><strong>建筑肌理韧性值：</strong>{{ popInfoBuilding.value.toFixed(4) }}</p>
                  <span>
                    <el-button @click="closePopoverBuilding">关闭</el-button>
                  </span>
                </div>
              </el-popover>
              <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPopoverMedical">
                <div id="popupMedical" slot="reference"></div>
                <div style="text-align: center;">
                  <span style="color:#000;font-weight:bold;">{{ popInfoMedical.id }}号医疗服务灾害测度点</span>
                  <p style="color:#000"><strong>名称：</strong>{{ popInfoMedical.communityName }}</p>
                  <p style="color:#000"><strong>地址：</strong>{{ popInfoMedical.communityAddress }}</p>
                  <p style="color:#000"><strong>灾害模拟时刻：</strong>{{ popInfoMedical.simulationTime }}时</p>
                  <p style="color:#000"><strong>医疗服务灾害测度值：</strong>{{ popInfoMedical.result.toFixed(4) }}</p>
                  <span>
                    <el-button @click="closePopoverMedical">关闭</el-button>
                  </span>
                </div>
              </el-popover>
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
// 后端请求
import axios from "axios";
import serverInfo from '@/views/simulator/serverInfo';
import ajax from "@/views/simulator/ajax";
import ajaxBlob from "@/views/simulator/ajaxBlob";
import ajaxResilience from "@/views/simulator/ajaxResilience";
import ajaxBlobResilience from "@/views/simulator/ajaxBlobResilience";

// 组件
import rainstormSimulationThree from "./rainstormSimulationThree.vue";
import explodeSimulation from "../explode/explodeSimulation.vue";

// 数据
import mapData from '../mapData';

// 库
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// 地图相关函数
import *  as mapUtils from "../mapUtils";

export default {
  name: "components_1_4",
  data() {
    return {
      // 一些状态变量
      showLoading: false,
      active: 0,
      eleDisabled: true,
      metricDisabled: true,
      dialogVisible: false,
      isShowRisked: false,

      showResult: true,
      canvasIndex: 0,

      subgraphLoading: false,

      // 地图
      gcjMecator: null,
      map: null,
      mapRisk: null,
      mapHospital: null,
      mapSubgraph: null,
      mapBuilding: null,

      // 模拟结果数据图层
      currentSubmergedcellsLayer: null,
      currentDangerousroadsLayer: null,
      currentSubmergedroadsLayer: null,
      currentAvailableroadsLayer: null,
      riskPointsLayer: null,
      riskCellsLayer: null,

      currentSubgraphLayer: null,

      currentBuildingLayer: null,

      currentMedicalLayer: null,

      // 数据显示状态变量
      showSubmergedcells: true,
      showDangerousroads: false,
      showSubmergedroads: false,
      showAvailableroads: false,
      showRisk: false,
      showRiskCells: true,
      showRiskPoints: true,
      showSatellite: false,

      // 当前任务信息
      waterCount: 0,
      waterArea: 0,
      computeTime: 0,

      // 图层
      satelliteLayer: null,
      myChart: null,
      myChartConnection: null,

      riskCreated: false,

      resilenceData: [],

      canvasNames: {
        0: "模拟结果(每个时刻)",
        1: "人群疏散",
        2: "交通韧性",
        3: "风险区域和风险点(24小时内)",
        4: "医疗服务测度",
        5: "道路连通子图",
        6: "建筑肌理韧性",
        7: "危化品爆炸",
        8: "医疗服务灾害测度",
        9: "道路网络连通效率",
      },

      currentSimulationResult: null,
      cityName: "广州",
      city: "guangzhou",
      zoomLevel: 10,
      resultMaxLen: 10000,
      subgraphMaxLen: 100,

      resultFiles: [],
      resultSelection: [],
      resultPacking: false,
      // 弹窗信息
      popInfo: {
        id: 0,
        coord: [0, 0],
        area: 0,
      },
      popInfoHostipal: {
        id: 0,
        name: "",
        address: "",
        value: 0,
      },
      popInfoBuilding: {
        id: 0,
        coord: [0, 0],
        area: 0,
        value: 0,
      },
      popInfoMedical: {
        id: 0,
        communityName: "",
        communityAddress: "",
        result: 0,
        simulationTime: 0,
      },

      //稳健度阈值
      buildingThrehold: 1.0,

      //医疗服务灾害测度
      medicalOptions: {
      },
      medicalTime: "",
      medicalData: null,

      // 道路网络连通效率
      connectivityData: [

      ],
    };
  },
  components: {
    rainstormSimulationThree,
    explodeSimulation,
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
      if (this.myChart)
        this.myChart.resize({ width: document.getElementById("containerCard").offsetWidth });
      if (this.myChartConnection)
        this.myChartConnection.resize({ width: document.getElementById("containerCard").offsetWidth });
    };
    if (this.type == "flood") {
      this.onStatusChange();
    }
  },
  methods: {
    // 传入的status数据改变，即切换显示的任务
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

      this.subgraphLoading = false;

      this.computeTime = this.status.computeTime;
      this.currentSimulationResult = {
        "submergedcells": {},
        "availableroads": {},
        "submergedroads": {},
        "dangerousroads": {},
        "riskcells": {},
        "riskpoints": {},
      };

      if (this.map) {
        this.map.setTarget(null);
        this.map = null;
      }
      if (this.mapRisk) {
        this.mapRisk.setTarget(null);
        this.mapRisk = null;
      }
      if (this.mapHospital) {
        this.mapHospital.setTarget(null);
        this.mapHospital = null;
      }
      if (this.mapMedical) {
        this.mapMedical.setTarget(null);
        this.mapMedical = null;
      }

      this.cityName = this.parseCity(this.status.area);

      mapUtils.initOL(this);
      mapUtils.buildMap(this);

      this.resultFiles = [];
      this.resultSelection = [];
      this.resultPacking = false;
    },
    // 显示风险区域和风险点
    async onShowRisks() {
      try {
        let riskCellsLen = await ajax(`information/simulation/length/${this.status.id}/riskcells/4`);
        const res = await this.getRiskResult("riskcells", '4', riskCellsLen);
        const riskcellsResult = mapUtils.processRiskCells(this, res);
        if (this.showRiskCells)
          this.mapRisk.addLayer(riskcellsResult.layer);
        this.riskCellsLayer = riskcellsResult.layer;
        this.riskCellsLayer.set("layerName", "riskcells");
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
        const riskPointsResult = mapUtils.processRiskPoints(this, res);
        if (this.showRiskPoints)
          this.mapRisk.addLayer(riskPointsResult.layer);
        this.riskPointsLayer = riskPointsResult.layer;
        this.riskPointsLayer.set("layerName", "riskpoints");
      }
      catch {
        this.$message({
          message: "获取模拟风险点数据失败" + (err.message || ""),
          type: "error",
        });
      }

      this.showRisk = true;
    },
    // 上一时刻
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

      mapUtils.buildMapAtTime(this, stepTimeMap[this.active]);
      if (this.canvasIndex == 5) //道路连通子图
      {
        this.displaySubgraphAtTime(stepTimeMap[this.active]);
      }
    },
    // 下一时刻
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

      mapUtils.buildMapAtTime(this, stepTimeMap[this.active]);
      if (this.canvasIndex == 5) //道路连通子图
      {
        this.displaySubgraphAtTime(stepTimeMap[this.active]);
      }
    },
    // 重置视图
    resetView() {
      if (this.canvasIndex == 0) {
        this.map.getView().setCenter(mapData[this.status.area].center);
        this.map.getView().setZoom(this.zoomLevel);

      }
      else if (this.canvasIndex == 3) {

        this.mapRisk.getView().setCenter(mapData[this.status.area].center);
        this.mapRisk.getView().setZoom(this.zoomLevel);
      }
      else if (this.canvasIndex == 6) {

        this.mapBuilding.getView().setCenter(mapData[this.status.area].center);
        this.mapBuilding.getView().setZoom(this.zoomLevel);
      }

    },
    // 为地图添加图层
    onMapAddLayer(layer) {
      const layers = this.map.getLayers();
      const layerName = layer.get("layerName");
      let hasLayer = false;
      layers.forEach((item) => {
        if (item.get("layerName") === layerName)
          hasLayer = true;
      });
      if (!hasLayer)
        this.map.addLayer(layer);
    },
    // 为风险地图添加图层
    onMapRiskAddLayer(layer) {
      const layers = this.mapRisk.getLayers();
      const layerName = layer.get("layerName");
      let hasLayer = false;
      layers.forEach((item) => {
        if (item.get("layerName") === layerName)
          hasLayer = true;
      });
      if (!hasLayer)
        this.mapRisk.addLayer(layer);
    },
    // 切换显示的数据
    onDisplayChange() {
      if (this.showSubmergedcells) {
        this.onMapAddLayer(this.currentSubmergedcellsLayer);
      } else {
        this.map.removeLayer(this.currentSubmergedcellsLayer);
      }

      if (this.showDangerousroads) {
        this.onMapAddLayer(this.currentDangerousroadsLayer);
      } else {
        this.map.removeLayer(this.currentDangerousroadsLayer);
      }

      if (this.showSubmergedroads) {
        this.onMapAddLayer(this.currentSubmergedroadsLayer);
      } else {
        this.map.removeLayer(this.currentSubmergedroadsLayer);
      }

      if (this.showAvailableroads) {
        this.onMapAddLayer(this.currentAvailableroadsLayer);
      } else {
        this.map.removeLayer(this.currentAvailableroadsLayer);
      }
      if (this.showRisk && this.mapRisk) {
        if (this.showRiskPoints) {
          this.onMapRiskAddLayer(this.riskPointsLayer);
        }
        else {
          this.mapRisk.removeLayer(this.riskPointsLayer);
        }
        if (this.showRiskCells) {
          this.onMapRiskAddLayer(this.riskCellsLayer);
        }
        else {
          this.mapRisk.removeLayer(this.riskCellsLayer);
        }
      }

    },
    // 切换到三维场景
    displayThree() {
      this.canvasIndex = 1;
      this.$refs.childThree.start();
      this.closePopover();
    },
    // 切换到原始二维地图
    goBackToMap() {
      this.canvasIndex = 0;
      this.$refs.childThree.stop();
      if (this.mapRisk) {
        this.mapRisk.setTarget(null);
        this.mapRisk = null;
      }
      if (this.mapHospital) {
        this.mapHospital.setTarget(null);
        this.mapHospital = null;
      }
      if (this.mapSubgraph) {
        this.mapSubgraph.setTarget(null);
        this.mapSubgraph = null;
      }
      if (this.mapBuilding) {
        this.mapBuilding.setTarget(null);
        this.mapBuilding = null;
      }
      if (this.mapMedical) {
        this.mapMedical.setTarget(null);
        this.mapMedical = null;
      }
    },
    // 显示建筑肌理韧性
    onDisplayBuildingResilience() {
      mapUtils.buildMapBuilding(this);

      let formData = new FormData();
      formData.append("cityname", this.status.area);

      let url = serverInfo.baseURL_resilience + "/resilience";
      let headers = {
        "Content-Type": "multipart/form-data",
      };
      axios
        .post(url, formData, { headers: headers })
        .then((res) => {
          if (res.data.status) {
            this.$message({
              message: "获取城市肌理韧性数据成功",
              type: "success",
            });
            const result = mapUtils.processBuilding(this, res.data.data, res.data.range);
            this.mapBuilding.addLayer(result.layer);
            this.currentBuildingLayer = result.layer;
            this.canvasIndex = 6;

          }
          else {
            this.$message({
              message: res.data.msg,
              type: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "获取城市肌理韧性数据失败",
            type: "error",
          });
        });
    },
    // 解析交通韧性测度数据
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
    // 根据输入的阈值更新建筑肌理韧性
    updateBuildingResilience() {
      let formData = new FormData();
      formData.append("cityname", this.status.area);
      formData.append("threshold", this.buildingThrehold);

      let url = serverInfo.baseURL_resilience + "/resilienceThreshold";
      let headers = {
        "Content-Type": "multipart/form-data",
      };
      axios
        .post(url, formData, { headers: headers })
        .then((res) => {
          if (res.data.status) {
            this.$message({
              message: "获取城市肌理韧性数据成功",
              type: "success",
            });
            const result = mapUtils.processBuilding(this, res.data.data, res.data.range);
            this.mapBuilding.removeLayer(this.currentBuildingLayer);
            this.mapBuilding.addLayer(result.layer);
            this.currentBuildingLayer = result.layer;

          }
          else {
            this.$message({
              message: res.data.msg,
              type: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "获取城市肌理韧性数据失败",
            type: "error",
          });
        });
    },
    async downloadBuildingResilience() {
      let url = `downloadThreshold?cityname=${this.status.area}&threshold=${this.buildingThrehold}`;
      let file = await ajaxBlobResilience(url);
      saveAs(file, `${this.status.area}_resilience_threshold_${this.buildingThrehold}.zip`);
    },
    // 显示交通韧性测度曲线
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
              mapUtils.buildChart(this);
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
    // 切换到风险区域和风险点视图
    onDisplayRisk() {
      this.canvasIndex = 3;
      mapUtils.buildMapRisk(this);
      setTimeout(() => {
        this.onShowRisks();
      }, 1000);

    },
    // 显示医疗测度服务
    onDisplayHospital() {
      mapUtils.buildMapHospital(this);
      let url = serverInfo.baseURL_measure + "/measure/measureResult?city=" + this.status.area;
      axios
        .post(url)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            const hospitalResult = mapUtils.processHospitalPoints(this, res.data.data);
            this.mapHospital.addLayer(hospitalResult.layer);
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
    // 显示对应时刻的医疗变化测度
    displayMedicalAtTime() {
      console.log(this.medicalTime);
      let time = this.medicalTime;
      const result = mapUtils.processMedicalPoints(this, this.medicalData[time]);
      if (this.currentMedicalLayer)
        this.mapMedical.removeLayer(this.currentMedicalLayer);
      this.currentMedicalLayer = result.layer;
      this.mapMedical.addLayer(this.currentMedicalLayer);
    },
    // 显示医疗变化测度
    onDisplayMedicalChange() {
      mapUtils.buildMapMedical(this);
      // let data_url = "http://221.239.215.104:8010/tj-httpd/static/temp/medicalServiceChange.json";
      let url = serverInfo.baseURL_measure + "/measure/medicalServiceChange?" + `city=${this.status.area}&id=${this.status.id}`;
      axios
        .post(url)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            if (res.data.data.status === "RUNNING") {
              this.$message({
                message: "生成医疗变化测度任务成功",
                type: "success",
              });
            }
            else {
              this.$message({
                message: "获取医疗变化测度数据成功",
                type: "success",
              });
              this.medicalData = res.data.data;
              let options = [];
              for (let time in res.data.data) {
                options.push({
                  value: time,
                  label: `${time}时`
                });
              }
              this.medicalOptions = options;
              this.medicalTime = this.medicalOptions[0].value;
              this.displayMedicalAtTime();
              this.canvasIndex = 8;

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
            message: "获取医疗变化测度失败",
            type: "error",
          });
        });
    },
    // 显示道路连通子图
    async onDisplaySubgraph() {
      mapUtils.buildMapSubgraph(this);
      let url = serverInfo.baseURL_measure + "/measure/subgraphsublist?" +
        `city=${this.status.area}&id=${this.status.id}&time=${4}&start=${0}&end=${this.subgraphMaxLen}`;
      this.$message({
        message: "获取第4时刻道路连通子图数据中",
        type: "warning",
      });
      this.subgraphLoading = true;
      axios
        .post(url, { timeout: 16000000 })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.$message({
              message: "获取第4时刻道路连通子图数据成功",
              type: "success",
            });
            const result = mapUtils.processSubgraph(this, res.data.data, "#0000ff");
            this.mapSubgraph.addLayer(result.layer);
            this.currentSubgraphLayer = result.layer;
            this.currentSubgraphLayer.set("layerName", "subgraph#0");


            this.canvasIndex = 5;
            this.subgraphLoading = false;
          }
          else {
            this.$message({
              message: "获取第4时刻道路连通子图数据失败：" + res.data.errorMsg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "获取第4时刻道路连通子图数据失败",
            type: "error",
          });
        });
    },
    // 显示对应时刻道路连通子图
    async displaySubgraphAtTime(time) {

      let url = serverInfo.baseURL_measure + "/measure/subgraphsublist?" +
        `city=${this.status.area}&id=${this.status.id}&time=${time}&start=${0}&end=${this.subgraphMaxLen}`;
      this.$message({
        message: `获取第${time}时刻道路连通子图数据中`,
        type: "warning",
      });
      this.subgraphLoading = true;

      axios
        .post(url)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.$message({
              message: `获取第${time}时刻道路连通子图数据成功`,
              type: "success",
            });
            this.mapSubgraph.removeLayer(this.currentSubgraphLayer);
            this.currentSubgraphLayer = null;
            const result = mapUtils.processSubgraph(this, res.data.data, "#0000ff");
            this.mapSubgraph.addLayer(result.layer);
            this.currentSubgraphLayer = result.layer;
            this.currentSubgraphLayer.set("layerName", "subgraph#" + `${time}`);

            this.subgraphLoading = false;
          }
          else {
            this.$message({
              message: `获取第${time}时刻道路连通子图数据失败：` + res.data.errorMsg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: `获取第${time}时刻道路连通子图数据失败`,
            type: "error",
          });
        });

    },
    onDisplayExplode() {
      this.canvasIndex = 7;
      this.city = this.status.area;
    },
    onDisplayConnectivity() {
      this.canvasIndex = 9;
      this.connectivityData = [
        {
          type: "常态",
          edgeRatio: "/",
          globalConnectivity: "0.0370",
          constRatio: "/"
        },
        {
          type: "10年一遇",
          edgeRatio: "2.00%",
          globalConnectivity: "0.0353",
          constRatio: "94.45%"
        },
        {
          type: "20年一遇",
          edgeRatio: "10.11%",
          globalConnectivity: "0.0298",
          constRatio: "80.68%"
        },
        {
          type: "50年一遇",
          edgeRatio: "11.32%",
          globalConnectivity: "0.0290",
          constRatio: "78.49%"
        },
        {
          type: "100年一遇",
          edgeRatio: "17.97%",
          globalConnectivity: "0.0234",
          constRatio: "63.32%"
        },
        {
          type: "500年一遇",
          edgeRatio: "35.48%",
          globalConnectivity: "0.0132",
          constRatio: "35.67%"
        },
      ];
      mapUtils.buildChartConnection(this);
      this.myChartConnection.resize({
        width: document.getElementById("containerCard").offsetWidth
      });
    },
    // 根据拼音获取城市名
    parseCity(city) {
      if (city in mapData)
        return mapData[city].cityName;
      else
        return city;
    },
    // 获取模拟结果
    async getSimulationResult(resultType, time) {
      let res;
      if (time in this.currentSimulationResult[resultType]) {
        res = this.currentSimulationResult[resultType][time];
      }
      else {
        let len = this.status.resultLens[resultType][time];
        if (len > this.resultMaxLen) len = this.resultMaxLen;
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
        if (len > this.resultMaxLen) len = this.resultMaxLen;
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

      const resultTypes = ["submergedcells", "availableroads", "dangerousroads", "submergedroads"];
      const resultPaths = {
        "submergedcells": "submerged_cells",
        "availableroads": "roads/available_roads",
        "dangerousroads": "roads/dangerous_roads",
        "submergedroads": "roads/submerged_roads",
      };
      const fileNames = {
        "submergedcells": "submerged_cells",
        "availableroads": "available_roads",
        "dangerousroads": "dangerous_roads",
        "submergedroads": "submerged_roads",
      };
      const resultNames = {
        "submergedcells": "淹没区域",
        "availableroads": "可用路网",
        "dangerousroads": "危险路网",
        "submergedroads": "淹没路网",
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

      //建筑肌理韧性文件
      try {
        let checkResult = await ajaxResilience(`checkResult?cityname=${this.status.area}`);
        if (checkResult.status) {
          const fileTypes = ["shp", "shx", "prj", "cpg", "dbf"];
          let resultItems = [];
          fileTypes.forEach((fileType) => {
            resultItems.push({
              name: `buildingResilience.${fileType}`,
              url: `download?cityname=${this.status.area}&filename=resilience.${fileType}`,
              backend: "resilience",
            });
          });
          this.resultFiles.push({
            type: "建筑肌理韧性",
            time: "-",
            name: `buildingResilience.*`,
            files: resultItems,
            number: resultItems.length,
          });
        }
      }
      catch { }


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
            let data;
            if (file.backend === "resilience")
              data = await ajaxBlobResilience(file.url);
            else
              data = await ajaxBlob(file.url);
            if (file.name === "performance.txt")
              zipFile.file(file.name, data, { binary: false });
            else
              zipFile.file(file.name, data, { binary: true });
          }
          catch {
            console.log(file);
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
    },
    // 关闭地图内弹窗
    closePopover() {
      this.$refs.mapInfoPopover.showPopper = false;
    },
    closePopoverHostipal() {
      this.$refs.mapInfoPopoverHostipal.showPopper = false;
    },
    closePopoverBuilding() {
      this.$refs.mapInfoPopoverBuilding.showPopper = false;
    },
    closePopoverMedical() {
      this.$refs.mapInfoPopoverMedical.showPopper = false;
    },
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

.legend {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-end;
  margin: 10px 20px;
}

.legend-item {
  display: inline-block;
  width: 50px;
  height: 20px;
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
  height: 80vh;
  font-family: "微软雅黑";
  overflow: hidden;
  border-radius: 10px;
  transition: 0.3s;
}

.chart {
  width: 100%;
  height: 80vh;
  overflow: hidden;
  border-radius: 10px;
  transition: 0.3s;
}

.chart-connect {
  width: 100%;
  height: 50vh;
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

.controlButtonDis:hover {
  cursor: default;

}


.line-building {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;

  .el-slider {
    width: 30vw;
  }

  .line {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .line-button {
    justify-content: center;
  }

  .el-button {
    margin: 0 10px;
  }

}

.legend-medical {
  margin: 20px 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  .legend-item {
    width: 150px;
  }
}

.tableContainer {
  margin: 20px;
}
</style>
