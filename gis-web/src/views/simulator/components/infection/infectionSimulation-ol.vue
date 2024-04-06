<template>
    <div>
        <div v-show="infectionModel == 'seir'">
            <el-card class="imgContainer">
                <div slot="header" class="cardHeader">
                    <span>疫情模拟结果</span>
                </div>
                <img class="simulationResult" :src="imgData" />
            </el-card>
            <el-card class="resultContainer">
                <strong>模拟计算时间：</strong>
                <span>{{ computeTime }}秒</span>
            </el-card>
        </div>
        <div v-show="infectionModel == 'gamma'">
            <div class="main-wrapper" flex flex-box="1">
                <div flex-box="1" flex="dir:col">
                    <div class="border-box" flex-box="1" flex="dir:col">
                        <div class="show-board">
                            <div>
                                <!-- <span class="color-block" style="background: #14a72c"></span
            >原始路网 -->
                                <span>
                                    <span class="color-block" style="background: #ff0000"></span>感染人群
                                </span>
                            </div>
                            <div class="time-step-controler">
                                <el-steps align-center :active="active" finish-status="success" style="width: 70%">
                                    <el-step title="时刻:0"></el-step>
                                    <el-step title="时刻:12"></el-step>
                                    <el-step title="时刻:24"></el-step>
                                    <el-step title="时刻:36"></el-step>
                                    <el-step title="时刻:48"></el-step>
                                    <el-step title="时刻:60"></el-step>
                                    <el-step title="时刻:72"></el-step>
                                </el-steps>
                                <el-button style="margin-left: 16px" @click="previous" :disabled="eleDisabled || active < 1"
                                    type="primary">上一时刻
                                </el-button>
                                <el-button style="margin-left: 16px" @click="next" :disabled="eleDisabled || active > 5"
                                    type="primary">下一时刻
                                </el-button>
                            </div>
                            <div id="resultCanvas" class="resultCanvas" v-loading="showLoading" v-show="showResult">
                                <div id="panel" class="panel">
                                    <div class="panel-info">
                                        <div class="card">
                                            <div class="line">
                                                <p class="label">
                                                    <i class="el-icon-date"></i>
                                                    日期：
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
                                                    感染人群数量：
                                                </p>
                                                <p>{{ infectionCount }}</p>
                                            </div>
                                            <div class="line">
                                                <p class="label">
                                                    <i class="el-icon-time"></i>
                                                    模拟计算时间：
                                                </p>
                                                <p>{{ computeTime }}</p>
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
                                            <!-- <div class="line">
                                                <p class="label">
                                                    卫星图显示：
                                                </p>
                                                <el-switch v-model="showSatellite" @change="onSatelliteChange"
                                                    active-color="#5177d2">
                                                </el-switch>
                                            </div> -->
                                            <div class="line">
                                                <p class="label">
                                                    感染人群显示：
                                                </p>
                                                <el-switch v-model="showInfection" @change="onDisplayChange"
                                                    active-color="#5177d2">
                                                </el-switch>
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
                                <div class="containerCard">
                                    <div :id="'aMapInfectionGama' + idSuffix" class="aMap"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="infectionModel == 'before'">
            <div class="resultCanvas" style="padding:20px;">
                <div class="panel">
                    <div class="panel-info">
                        <div class="card">
                            <div class="line">
                                <p class="label">
                                    <i class="el-icon-position"></i>
                                    位置：
                                </p>
                                <p>{{ parseCity(status.city) }}</p>
                            </div>
                            <div class="line">
                                <p class="label">
                                    <i class="el-icon-time"></i>
                                    已完成的模拟时长：
                                </p>
                                <p>{{ infection_num_result }}</p>
                            </div>
                            <div class="line">
                                <p class="label">
                                    <i class="el-icon-alarm-clock"></i>
                                    要完成的模拟总时长：
                                </p>
                                <p>{{ taskParams.simulation_days * 24 }}</p>
                            </div>

                        </div>
                        <div class="card">
                            <div class="line">
                                <p class="label">
                                    <i class="el-icon-s-custom"></i>
                                    基本再生数：
                                </p>
                                <p>{{ taskParams.R0 }}</p>
                            </div>
                            <div class="line">
                                <p class="label">
                                    <i class="el-icon-office-building"></i>
                                    感染者住院率：
                                </p>
                                <p>{{ taskParams.I_H_para }}</p>
                            </div>
                            <div class="line">
                                <p class="label">
                                    <i class="el-icon-house"></i>
                                    感染者自愈率：
                                </p>
                                <p>{{ taskParams.I_R_para }}</p>
                            </div>
                            <div class="line">
                                <p class="label">
                                    <i class="el-icon-s-home"></i>
                                    住院者治愈率：
                                </p>
                                <p>{{ taskParams.H_R_para }}</p>
                            </div>
                            <div class="line">
                                <p class="label">
                                    <i class="el-icon-s-home"></i>
                                    管控措施类型：
                                </p>
                                <p>{{ lockTypeNames[lockType] }}</p>
                            </div>
                            <div class="line" v-if="lockType === 1">
                                <p class="label">
                                    <i class="el-icon-s-home"></i>
                                    封锁时长：
                                </p>
                                <p>{{ taskParams.lock_day }}</p>
                            </div>
                            <div class="line">
                                <p class="label">
                                    显示初始感染点：
                                </p>
                                <el-switch v-model="showLayers.initInfection" :active-color="layerColors['initInfection']"
                                    :disabled="!initInfectionLayer" @change="onDisplayChange">
                                </el-switch>
                            </div>
                            <div class="line" v-if="lockType === 1">
                                <p class="label">
                                    显示封锁区域：
                                </p>
                                <el-switch v-model="showLayers.lock" :active-color="layerColors['lock']"
                                    :disabled="!lockLayer" @change="onDisplayChange">
                                </el-switch>
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
                                    显示感染总人数曲线：
                                </p>
                                <button class="controlButton" @click="onShowPopulationChart">
                                    <i class="el-icon-view controlIcon"></i>
                                </button>
                            </div>
                            <div class="line">
                                <p class="label">
                                    返回地图：
                                </p>
                                <button class="controlButton" @click="showIndex = 0">
                                    <i class="el-icon-back controlIcon"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card">
                            <div class="line">
                                <p class="label">
                                    显示传染病网格分布：
                                </p>
                                <el-switch v-model="showLayers.grid" :active-color="layerColors['grid']"
                                    :disabled="!currentInfectionGridLayer" @change="onDisplayChange">
                                </el-switch>
                            </div>
                            <div class="line">
                                <p class="label">
                                    显示类型：
                                </p>
                                <el-select v-model="currentInfectionShowType" style="width:150px;"
                                    @change="onInfectionShowChange" :disabled="!currentInfectionGridLayer">
                                    <el-option v-for="item in infectionShowTypes" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="line">
                                <p class="label">
                                    显示时间(天)：
                                </p>
                                <el-input-number v-model="currentInfectionDay" @change="onInfectionShowChange"
                                    :disabled="!currentInfectionGridLayer" style="width:100px;" :min="1"
                                    :max="maxInfectionDay" :precision="0" :step="1" size="small"></el-input-number>
                            </div>
                            <div class="line">
                                <p class="label">
                                    显示时间(时)：
                                </p>
                                <el-input-number v-model="currentInfectionHour" @change="onInfectionShowChange"
                                    :disabled="!currentInfectionGridLayer" style="width:100px;" :min="1" :max="24"
                                    :precision="0" :step="1" size="small"></el-input-number>
                            </div>
                            <div class="line">
                                <p class="label">
                                    导出结果：
                                </p>
                                <el-button type="primary" :disabled="!currentInfectionGridLayer"
                                    @click="downloadResultBefore" size="small" plain>下载</el-button>
                            </div>
                        </div>
                        <div class="card">
                            <div class="line">
                                <p class="label">
                                    显示感染高风险区域：
                                </p>
                                <el-switch v-model="showLayers.risk" :active-color="layerColors['risk']"
                                    :disabled="!currentInfectionGridLayer" @change="onDisplayChange">
                                </el-switch>
                            </div>
                            <div class="line">
                                <p class="label">
                                    感染人数阈值：
                                </p>
                                <el-input-number v-model="thresholdInfected" :disabled="!currentInfectionGridLayer"
                                    style="width:100px;" :min="1" :precision="0" :step="1" size="small"></el-input-number>
                            </div>
                            <div class="line">
                                <p class="label">
                                    更新感染高风险区域：
                                </p>
                                <el-button type="primary" size="small" @click="updateRiskPoint"
                                    :disabled="!currentInfectionGridLayer" plain>更新</el-button>
                            </div>
                            <div class="line" v-show="lockType !== 1">
                                <p class="label">
                                    显示人口流动控制决策：
                                </p>
                                <el-switch v-model="showLayers.policy" :active-color="layerColors['policy']"
                                    :disabled="!currentInfectionPolicyLayer || !hasPolicy" @change="onDisplayChange">
                                </el-switch>
                            </div>
                            <div class="line" v-show="lockType !== 1">
                                <p class="label">
                                    人口流动控制决策状态：
                                </p>
                                <el-tag type="warning" v-show="!hasPolicy">{{ "未完成" }}</el-tag>
                                <el-tag type="success" v-show="hasPolicy">{{ "已完成" }}</el-tag>
                            </div>
                            <div class="line" v-show="lockType === 0">
                                <p class="label">
                                    生成强化学习决策模拟：
                                </p>
                                <el-button type="primary" size="small" :disabled="!hasPolicy" @click="onUpdateMADDPG"
                                    plain>生成</el-button>
                            </div>
                            <div class="line" v-show="lockType !== 0">
                                <p class="label">
                                    查看决策时间对比：
                                </p>
                                <el-button type="primary" size="small" @click="onShowComparisionList" plain>查看</el-button>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="containerCard">
                    <div :id="'aMapInfectionBefore' + idSuffix" class="aMap" v-loading="showLoading"
                        v-show="showIndex === 0"></div>
                    <div class="chart-container" v-show="showIndex === 1">
                        <div id="chartBefore" class="chart"></div>
                    </div>
                    <div v-show="showIndex === 2">
                        <el-card class="imgContainer">
                            <div slot="header" class="cardHeader">
                                <span>选择对比任务</span>
                            </div>
                            <div class="table-container">
                                <!-- 决策时间对比任务列表 -->
                                <el-table :data="comparisonTaskList" max-height="200" size="mini"
                                    :header-cell-style="{ 'text-align': 'center' }"
                                    :cell-style="{ 'text-align': 'center' }">
                                    <el-table-column property="id" label="序号" width="50"></el-table-column>
                                    <el-table-column property="city" label="城市" width="60">
                                        <template slot-scope="scope">
                                            <span>{{ parseCity(scope.row.city) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column property="city" label="管控措施类型" width="150">
                                        <template slot-scope="scope">
                                            <span>{{ lockTypeNames[scope.row.lockType] }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="模拟总时长" align="center" :show-overflow-tooltip="true" width="100">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.para_json.simulation_days * 24 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="基本繁殖数" align="center" :show-overflow-tooltip="true" width="100">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.para_json.R0 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column property="status" label="状态" width="50">
                                        <template slot-scope="scope">
                                            <i class="el-icon-loading" v-if="scope.row.status === 'processing'"></i>
                                            <i class="el-icon-success" v-if="scope.row.status === 'finish'"
                                                style="color: green"></i>
                                            <i class="el-icon-error" v-if="scope.row.status === 'failed'"
                                                style="color: crimson"></i>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="任务提交时间">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.simulationType === 'flood'">{{
                                                scope.row.simulationDate }}</span>
                                            <span v-if="scope.row.simulationType === 'infection'">{{
                                                scope.row.simulationTime }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="100">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="text" icon="el-icon-plus"
                                                :disabled="scope.row.status !== 'finish'"
                                                @click="onShowTimeComparison(scope.row)">
                                                对比
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-card>
                        <el-card class="imgContainer" v-show="showDecisionTime">
                            <div slot="header" class="cardHeader">
                                <span>对比结果</span>
                            </div>
                            <!-- 决策时间对比结果 -->
                            <div class="chart-container-decision">
                                <div id="chartDecisionTime" class="chart"></div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPopover">
                    <div id="popup" slot="reference"></div>
                    <div style="text-align: center;">
                        <span style="color:#000;font-weight:bold;">{{ popInfo.id }}号网格</span>
                        <p style="color:#000"><strong>坐标：</strong>{{
                            `(${popInfo.coords[0][0].toFixed(3)},${popInfo.coords[0][1].toFixed(3)})`
                        }}
                        </p>
                        <p v-show="!showLayers.policy" style="color:#000"><strong>人数：</strong>{{
                            popInfo.value.toFixed(0)
                        }}
                        </p>
                        <p v-show="showLayers.policy" style="color:#000"><strong>人口流动性：</strong>{{
                            popInfo.value.toFixed(0)
                        }}
                        </p>
                        <span>
                            <el-button @click="$refs.mapInfoPopover.showPopper = false">关闭</el-button>
                        </span>
                    </div>
                </el-popover>
            </div>
        </div>
        <div v-show="infectionModel == 'maddpg'">
            <el-card class="imgContainer">
                <div slot="header" class="cardHeader">
                    <span>模拟结果</span>
                </div>
                <div class="line">
                    <img class="simulationResultSmall" :src="imgData1" />
                    <img class="simulationResultSmall" :src="imgData2" />
                </div>
                <div class="line">
                    <img class="simulationResultSmall" :src="imgData3" />
                </div>
            </el-card>
            <el-card v-loading="controlLoading" class="imgContainer">
                <div slot="header" class="cardHeader">
                    <span>查询控制策略</span>
                </div>
                <div class="line">
                    <strong class="label">查询时间(天)：</strong>
                    <el-slider v-model="searchDay" :min="1" :max="30" show-input />
                </div>
                <div class="line">
                    <strong class="label">行政区域划分数据:</strong>
                    <span class="blank"></span>
                    <el-upload name="regionShp" :auto-upload="false" :on-change="uploadRegionShpFile" action="">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__tip" slot="tip">
                            请上传shp文件
                        </div>
                    </el-upload>
                    <span class="blank"></span>
                    <el-upload name="regionShx" :auto-upload="false" :on-change="uploadRegionShxFile" action="">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__tip" slot="tip">
                            请上传shx文件
                        </div>
                    </el-upload>
                </div>
                <div class="line">
                    <el-button @click="searchControl" type="primary">查询</el-button>
                </div>
                <img class="simulationResult" :src="searchDayImg" />
            </el-card>
            <el-card class="imgContainer">
                <div slot="header" class="cardHeader">
                    <span>模型运算效率</span>
                </div>
                <div class="line">
                    <strong>每秒计算量：</strong>
                    <span>{{ efficiency.toFixed(2) }}天</span>
                    <span class="blank"></span>
                    <strong>计算总时间：</strong>
                    <span>{{ totalTime.toFixed(2) }}秒</span>
                </div>
                <div class="line">
                    <img class="simulationResultSmall" :src="comparisonResult.img1" />
                    <img class="simulationResultSmall" :src="comparisonResult.img2" />
                </div>
                <div class="line">
                    <img class="simulationResultSmall" :src="comparisonResult.img3" />
                </div>
                <div class="line">
                    <img class="simulationResultSmall" :src="comparisonResult.img_time_1" />
                    <img class="simulationResultSmall" :src="comparisonResult.img_time_2" />
                </div>
            </el-card>
        </div>
        <div v-show="infectionModel == 'after'">
            <el-card class="imgContainer">
                <div slot="header" class="cardHeader">
                    <span>传染病灾后模拟与预测结果</span>
                </div>
                <div class="chart-container">
                    <div id="chartAfter" class="chart"></div>
                </div>
            </el-card>
        </div>
        <div v-show="infectionModel == 'performance'">
            <el-card class="imgContainer">
                <div slot="header" class="cardHeader">
                    <span>模拟效率对比</span>
                </div>
                <div class="chart-container chart-container-small">
                    <div id="chartRunTime" class="chart"></div>
                </div>
            </el-card>
            <el-card class="imgContainer">
                <div slot="header" class="cardHeader">
                    <span>模拟结果对比</span>
                </div>
                <div class="chart-container">
                    <div id="chartPerformance" class="chart"></div>
                </div>
            </el-card>
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
import ajax from "@/views/simulator/ajax";
import axios from "axios";
import serverInfo from '@/views/simulator/serverInfo';
import ajaxBlob from "@/views/simulator/ajaxBlob";
import ajaxInfection from "@/views/simulator/ajaxInfection";

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import mapData from '@/views/simulator/components/mapData';
import projzh from '@/views/simulator/components/proj';

// Echarts图表相关函数
import * as echarts from 'echarts';
import echartTheme from '@/assets/echartTheme.json';

// ol
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import * as olProj from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import XYZ from 'ol/source/XYZ';
import { Vector as VectorSource } from 'ol/source.js';
import WKT from 'ol/format/WKT.js';
import Overlay from 'ol/Overlay.js';
import { Fill, Stroke, Style } from 'ol/style.js';
import CircleStyle from "ol/style/Circle";

import * as mapUtils from '@/views/application/mapUtils';
import * as requestUtils from '@/views/application/requestUtils';



// 坐标系转换
const initOL = (bindThis) => {
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
const initOLMap = (bindThis, id) => {
    const that = bindThis;
    let city = that.city;
    // 获取地图容器
    let mapDom = document.getElementById(id);
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

const buildMap = async (bindThis, id) => {
    const that = bindThis;

    try {
        that.showLoading = true;
        that.eleDisabled = true;
        initOLMap(that, id);

        that.showLoading = false;
        that.eleDisabled = false;
        that.showResult = true;
    } catch (e) {
        console.error(e, 888);
        that.$message.error(`发生了错误:${JSON.stringify(e)}`);
    }
};

function processPoints(pointData) {
    let count = pointData.length;
    let pointFeatures = [];
    pointData.forEach((item, index) => {
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
                color: '#ff0000',
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
        count: count
    };

}

// 处理地图事件
function addMapEventListener(bindThis) {
    const that = bindThis;

    const selectStyle = new Style({
        stroke: new Stroke({
            color: '#eee',
            width: 0,
        }),
        fill: new Fill({
            color: '#eee',
        }),
    });
    let style = null;

    let selected = null;
    // 鼠标移动事件
    that.map.on('pointermove', function (event) {
        if (selected !== null) {
            selected.setStyle(style);
            selected = null;
        }
        that.map.forEachFeatureAtPixel(event.pixel, function (f) {
            if (f.name === "infection") {
                selected = f;
                style = f.getStyle();
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
            if (f.name === "infection") {
                const coordinate = event.coordinate;
                popup.setPosition(coordinate);
                that.$refs.mapInfoPopover.showPopper = false;
                that.popInfo = f.info;
                that.popInfo.feature = f;
                click = f;
                setTimeout(() => {
                    that.$refs.mapInfoPopover.showPopper = true;
                }, 100);
            }

            return true;
        });
        if (!click) {
            that.$refs.mapInfoPopover.showPopper = false;
        }
    });

}


// 绘制折线图
// data: 折线图中展示的数据
// chartID: 渲染为折线图的<div>标签的id
// grid: 其中设置了 图表与外部容器的 外边距
// theme: 图表使用的主题，设置这个参数的目的是 如果要显示两张同样格式的表，可以配置不同的配色丰富视觉上的效果
const buildChartLineAfter = (data, chartID, grid, theme) => {
    let chart = null;
    chart = echarts.init(document.getElementById(chartID), theme);
    let series = [{
        name: "真实值",
        type: 'line',
        data: data.HistoryData,
        smooth: true,
        symbol: 'emptyCircle',
        symbolSize: 6,
        markArea: {
            label: {
                color: 'black',
                fontSize: 14,
            },
            itemStyle: {
                color: 'rgba(255, 173, 177, 0.4)'
            },
            data: [
                [
                    {
                        name: '模拟',
                        xAxis: data.Date[0]
                    },
                    {
                        xAxis: data.Date[data.Date.length - 8]
                    }
                ],
            ]
        }
    },
    {
        name: "模拟值",
        type: 'line',
        data: data.DSIHRData,
        smooth: true,
        symbol: 'emptyCircle',
        symbolSize: 6,
        markArea: {
            label: {
                color: 'black',
                fontSize: 14,
            },
            itemStyle: {
                color: 'rgba(177, 173, 255, 0.4)'
            },
            data: [
                [
                    {
                        name: '预测',
                        xAxis: data.Date[data.Date.length - 7]
                    },
                    {
                        xAxis: data.Date[data.Date.length - 1]
                    }
                ]
            ]
        }
    }
    ];

    let option = {
        grid: grid,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ["真实值", "模拟值"],
            orient: 'vertical',
            right: '1%',
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                start: 0,
                end: 100
            }
        ],
        xAxis: {
            type: 'category',
            data: data.Date,
            name: data.xName,
            boundaryGap: false,
            nameLocation: 'center',
            nameTextStyle: {
                color: 'black',
                fontSize: 14,
                fontWeight: 500,
            },
            axisLabel: {
                show: true,
                interval: 0,
                rotate: '45'
            },
            nameGap: 80,
        },
        yAxis: {
            type: 'value',
            name: data.yName,
            nameLocation: 'center',
            nameTextStyle: {
                color: 'black',
                fontSize: 14,
                fontWeight: 500,
            },
            nameGap: 50,
        },
        series: series,
    };
    // 绘制图表
    chart.setOption(option);

    return chart;
};

// 绘制折线图
// data: 折线图中展示的数据
// chartID: 渲染为折线图的<div>标签的id
// grid: 其中设置了 图表与外部容器的 外边距
// theme: 图表使用的主题，设置这个参数的目的是 如果要显示两张同样格式的表，可以配置不同的配色丰富视觉上的效果
const buildChartLineBefore = (data, chartID, grid, theme) => {
    let chart = null;
    chart = echarts.init(document.getElementById(chartID), theme);
    let series = [{
        type: 'line',
        data: data.yData,
        smooth: true,
        symbol: 'emptyCircle',
        symbolSize: 6,
    }];

    let option = {
        grid: grid,
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                start: 0,
                end: 100
            }
        ],
        xAxis: {
            type: 'category',
            data: data.xData,
            name: data.xName,
            boundaryGap: false,
            nameLocation: 'center',
            nameTextStyle: {
                color: 'black',
                fontSize: 14,
                fontWeight: 500,
            },
            axisLabel: {
                rotate: '45'
            },
            nameGap: 50,
        },
        yAxis: {
            type: 'value',
            name: data.yName,
            nameLocation: 'center',
            nameTextStyle: {
                color: 'black',
                fontSize: 14,
                fontWeight: 500,
            },
            nameGap: 50,
        },
        series: series,
    };
    // 绘制图表
    chart.setOption(option);

    return chart;
};

// 绘制折线图
// data: 折线图中展示的数据
// chartID: 渲染为折线图的<div>标签的id
// grid: 其中设置了 图表与外部容器的 外边距
// theme: 图表使用的主题，设置这个参数的目的是 如果要显示两张同样格式的表，可以配置不同的配色丰富视觉上的效果
const buildChartLinePerformance = (data, chartID, grid, theme) => {
    let chart = null;
    chart = echarts.init(document.getElementById(chartID), theme);
    let series = [{
        name: "基线模型",
        type: 'line',
        data: data.BaselineData,
        smooth: true,
        symbol: 'emptyCircle',
        symbolSize: 6,
    },
    {
        name: "强化学习模型",
        type: 'line',
        data: data.ModelData,
        smooth: true,
        symbol: 'emptyCircle',
        symbolSize: 6,
    }
    ];

    let option = {
        grid: grid,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ["基线模型", "强化学习模型"],
            orient: 'vertical',
            right: '1%',
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                start: 0,
                end: 100
            }
        ],
        xAxis: {
            type: 'category',
            data: data.Date,
            name: data.xName,
            boundaryGap: false,
            nameLocation: 'center',
            nameTextStyle: {
                color: 'black',
                fontSize: 14,
                fontWeight: 500,
            },
            axisLabel: {
                show: true,
                // interval: ,
                rotate: '45'
            },
            nameGap: 80,
        },
        yAxis: {
            type: 'value',
            name: data.yName,
            nameLocation: 'center',
            nameTextStyle: {
                color: 'black',
                fontSize: 14,
                fontWeight: 500,
            },
            nameGap: 50,
        },
        series: series,
    };
    // 绘制图表
    chart.setOption(option);

    return chart;
};


// 绘制柱状图
// data: 折线图中展示的数据
// chartID: 渲染为折线图的<div>标签的id
// grid: 其中设置了 图表与外部容器的 外边距
// theme: 图表使用的主题，设置这个参数的目的是 如果要显示两张同样格式的表，可以配置不同的配色丰富视觉上的效果
const buildChartBarRunTime = (data, chartID, grid, theme) => {
    let chart = null;
    chart = echarts.init(document.getElementById(chartID), theme);
    let series = [{
        data: [data.baseRunTime, data.modelRunTime],
        type: 'bar',
        label: {
            show: true,
        },
    }];

    let option = {
        grid: grid,
        tooltip: {
            trigger: 'axis'
        },

        xAxis: {
            type: 'category',
            data: ["基线模型", "强化学习模型"],
            name: data.xName,
            nameLocation: 'center',
            nameTextStyle: {
                color: 'black',
                fontSize: 14,
                fontWeight: 500,
            },
            nameGap: 50,
        },
        yAxis: {
            type: 'value',
            name: data.yName,
            nameLocation: 'center',
            nameTextStyle: {
                color: 'black',
                fontSize: 14,
                fontWeight: 500,
            },
            nameGap: 50,
        },
        series: series,
    };
    // 绘制图表
    chart.setOption(option);

    return chart;
};


// 绘制柱状图
// data: 折线图中展示的数据
// chartID: 渲染为折线图的<div>标签的id
// grid: 其中设置了 图表与外部容器的 外边距
// theme: 图表使用的主题，设置这个参数的目的是 如果要显示两张同样格式的表，可以配置不同的配色丰富视觉上的效果
const buildChartBarDesicionTime = (data, chartID, grid, theme) => {
    let chart = null;
    chart = echarts.init(document.getElementById(chartID), theme);
    let series = [
        {
            name: "决策时间",
            data: [data.lock_setting_time, data.maddpg_policy_time],
            type: 'bar',
            stack: 'Ad',
            label: {
                show: true,
            },
        },
        {
            name: "模拟时间",
            data: [data.lock_simulation_time, data.maddpg_simulation_time],
            type: 'bar',
            stack: 'Ad',
            label: {
                show: true,
            },
        },
    ];

    let option = {
        grid: grid,
        tooltip: {
            trigger: 'axis'
        },

        xAxis: {
            type: 'category',
            data: ["人为管控措施", "自动管控措施"],
            name: data.xName,
            nameLocation: 'center',
            nameTextStyle: {
                color: 'black',
                fontSize: 14,
                fontWeight: 500,
            },
            nameGap: 50,
        },
        yAxis: {
            type: 'value',
            name: data.yName,
            nameLocation: 'center',
            nameTextStyle: {
                color: 'black',
                fontSize: 14,
                fontWeight: 500,
            },
            nameGap: 50,
        },
        series: series,
    };
    // 绘制图表
    chart.setOption(option);

    return chart;
};

export default {
    name: "infection",
    data() {
        return {
            city: "guangzhou",

            // gama模拟
            showLoading: false,
            controlLoading: false,
            active: 0,
            eleDisabled: true,
            map: null,
            metricDisabled: true,
            dialogVisible: false,
            isShowRisked: false,

            showResult: true,
            satelliteLayer: null,
            showSatellite: false,

            showInfection: true,
            infectionCount: 0,
            currentPointsLayer: null,

            cityName: "广州",
            zoomLevel: 10,
            resultMaxLen: 10000,

            // SEIR模拟
            imgData: "",
            imgData_predict: "",
            computeTime: 0,

            // MADDPG模拟
            imgData1: "",
            imgData2: "",
            imgData3: "",
            searchDay: 1,
            searchDayImg: "",
            totalTime: 0,
            efficiency: 0,
            comparisonResult: {
                img1: "",
                img2: "",
                img3: "",
                img_time_1: "",
                img_time_2: "",
            },

            regionShpFile: [],
            regionShxFile: [],

            resultFiles: [],
            resultSelection: [],
            resultPacking: false,

            // 传染病灾害模拟预测
            data_after: {
                "DSIHRData": [],
                "Date": [],
                "HistoryData": [],
            },
            chartAfter: null,

            // 传染病效率
            data_performance: {
                "BaselineData": [],
                "Date": [],
                "ModelData": [],
            },
            chartPerformance: null,
            chartRunTime: null,

            // 传染病灾前模拟
            taskParams: {},             // 任务参数
            infectionTaskInfo: null,    // 模拟任务结果
            maxInfectionDay: 1,
            currentInfectionDay: 1,             // 当前传染病模拟时间(天)
            currentInfectionHour: 1,            // 当前传染病模拟时间(小时)
            currentInfectionShowType: "total_num_data",              // 当前传染病网格显示类型
            thresholdInfected: 1,               //感染高风险人数阈值
            infectionResultData: {},                //传染病模拟结果数据
            totalPopulation: null,                //每小时感染总人数数据
            showPopulationChart: false,         // 显示每小时感染总人数图表
            showIndex: 0,           // 当前显示结果序号
            infection_num_result: 0,            // 已完成的模拟时长
            infectionShowTypes: [               // 传染病网格显示类型
                {
                    value: 'S_data',
                    label: '网格易感者人数'
                },
                {
                    value: 'I_data',
                    label: '网格感染者人数'
                },
                {
                    value: 'H_data',
                    label: '网格住院者人数'
                },
                {
                    value: 'R_data',
                    label: '网格康复者人数'
                },
                {
                    value: 'newInfected_data',
                    label: '网格一小时内新增感染者人数'
                },
                {
                    value: 'total_num_data',
                    label: '网格总人数'
                },
            ],
            currentInfectionGridLayer: null,      //传染病网格图层
            currentInfectionGridSource: null,     //传染病网格数据源
            currentInfectionPolicyLayer: null,      //传染病控制策略图层
            currentInfectionPolicySource: null,     //传染病控制策略数据源
            hasPolicy: false,                       //是否有控制策略结果
            currentRiskLayer: null,              // 当前风险点图层
            initInfectionLayer: null,            // 初始感染点图层
            lockLayer: null,            // 封锁区域图层
            layerColors: //图层颜色
            {
                'grid': '#1a9850',
                'risk': 'red',
                'initInfection': 'rgba(255,156,0,0.9)',
                'lock': 'rgba(132,112,255,0.9)',
                'policy': '#1a9850',
            },
            showLayers: //图层显示状态
            {
                'grid': true,
                'risk': false,
                'initInfection': false,
                'lock': false,
                'policy': false,
            },
            lockType: 0,                        // 封锁区域类型
            lockTypeNames:                      // 封锁区域类型名称
            {
                0: '无管控措施',
                1: '人为管控措施',
                2: '强化学习动态管控措施'
            },
            popInfo: { id: 0, coords: [[0, 0]], value: 0 },  // 地图弹窗信息

            chartDecisionTime: null,
            showDecisionTime: false,
            comparisonTaskList: [],

        }
    },
    props: {
        type: {
            type: String,
        },
        infectionModel: {
            default: "seir",
            type: String,
        },
        status: {
            type: Object,
        },
        idSuffix: {
            type: String,
            default: "",
        },
        taskList: {
            type: Array,
        },
    },
    watch: {
        status() {
            if (this.type == "infection") {
                this.onStatusChange();
            }
        },
    },
    mounted() {
        echarts.registerTheme('customed', echartTheme);
        if (this.type == "infection") {
            this.onStatusChange();
        }
    },
    methods: {
        async onStatusChange() {
            if (this.map) {
                this.map.setTarget(null);
                this.map = null;
            }
            if ("area" in this.status) {
                this.city = this.status.area;
            }
            else if ("city" in this.status) {
                this.city = this.status.city;
            }
            if (this.infectionModel == "gamma") {
                initOL(this);
                buildMap(this, "aMapInfectionGama" + this.idSuffix);
                this.showInfection = true;
                this.currentSimulationResult = {
                    "infectcells": {},
                };
                try {
                    const res = await this.getSimulationResult("infectcells", '0');
                    const processResult = processPoints(res);
                    this.map.addLayer(processResult.layer);
                    this.infectionCount = processResult.count;
                    this.currentPointsLayer = processResult.layer;
                    this.currentPointsLayer.set("layerName", "infectcells#0");
                }
                catch {
                    this.$message({
                        message: `获取第0时刻感染人群数据失败`,
                        type: "error",
                    });
                }

                this.showSatellite = false;
                this.computeTime = this.status.computeTime;
                this.cityName = this.parseCity(this.status.area);

                this.resultFiles = [];
                this.resultSelection = [];
                this.resultPacking = false;
            }
            else if (this.infectionModel == "seir") {
                this.imgData = this.status.imgData;
                this.imgData_predict = this.status.imgData_predict;
                this.computeTime = this.status.computeTime;
            }
            else if (this.infectionModel == "before") {
                this.showLoading = true;
                initOL(this);
                initOLMap(this, "aMapInfectionBefore" + this.idSuffix);

                // 获取任务信息
                this.infectionTaskInfo = this.status;
                this.taskParams = this.status.para_json;
                this.maxInfectionDay = this.taskParams.simulation_days;
                this.lockType = this.status.lockType;
                this.hasPolicy = false;

                // 变量重置
                this.currentInfectionDay = 1;
                this.currentInfectionHour = 1;
                this.currentInfectionShowType = "total_num_data";
                this.thresholdInfected = 1;
                this.infectionResultData = {};
                this.totalPopulation = null;
                this.showPopulationChart = false;
                this.showIndex = 0;
                this.showLayers = {
                    'grid': true,
                    'risk': false,
                    'initInfection': false,
                    'lock': false,
                };
                mapUtils.buildInitInfectionLayer(this, this.taskParams);
                if (this.lockType === 1)
                    mapUtils.buildLockLayer(this, this.taskParams);
                addMapEventListener(this);
                requestUtils.getInfectionGrid(this, true, () => {
                    // 获取模拟结果
                    requestUtils.getInfectionSimulationResult(this, this.currentInfectionDay, this.currentInfectionHour, this.status.simulation_time, this.lockType,
                        () => {
                            this.showLoading = false;
                            let colorMap = 1;
                            if (this.currentInfectionShowType === 'total_num_data' || this.currentInfectionShowType === 'S_data')
                                colorMap = 2;
                            mapUtils.updateInfectionLayer(this.currentInfectionGridSource,
                                this.infectionResultData[`${this.currentInfectionDay}_${this.currentInfectionHour}`][this.currentInfectionShowType],
                                colorMap);
                        });
                    // 获取控制策略结果
                    if (this.lockType === 1) return;  // 手动封控
                    let policyFileName;
                    if (this.lockType !== 2) policyFileName = this.status.simulation_time;
                    else policyFileName = this.status.para_json.simulation_time;
                    requestUtils.getGridControlPolicy(this, this.currentInfectionDay, this.currentInfectionHour, policyFileName, (data) => {
                        this.hasPolicy = true;
                        mapUtils.updateInfectionLayer(this.currentInfectionPolicySource, data, 0);
                    })
                });
                requestUtils.getInfectionTotalPopulation(this, this.lockType, this.status.simulation_time, true);

            }
            else if (this.infectionModel == "maddpg") {
                this.imgData1 = this.status.imgData1;
                this.imgData2 = this.status.imgData2;
                this.imgData3 = this.status.imgData3;
                this.searchDay = 1;
                this.searchDayImg = "";
                this.comparisonResult = {
                    img1: "",
                    img2: "",
                    img3: "",
                    img_time_1: "",
                    img_time_2: "",
                };
                this.getModelRunTime();
            }
            else if (this.infectionModel == "after") {
                this.data_after = this.status.data;
                // 添加后七天
                for (let i = 1; i <= 7; ++i) {
                    this.data_after.Date.push(`预测第${i}天`);
                }
                // 模拟数据取整
                this.data_after.DSIHRData.forEach((item, index, arr) => {
                    arr[index] = Math.floor(item);
                });
                let data = Object.assign({
                    xName: "日期",
                    yName: "感染人数",
                }, this.data_after);
                this.chartAfter = buildChartLineAfter(data, "chartAfter",
                    { top: '5%', bottom: '150', left: '80', right: '5%' },
                    'infographic');
            }
            else if (this.infectionModel == "performance") {
                {
                    this.data_performance.BaselineData = this.status.data.baseline_Isum;
                    this.data_performance.ModelData = this.status.data.our_model_Isum;
                    for (let i = 1; i <= this.data_performance.ModelData.length; ++i) {
                        this.data_performance.Date.push(`模拟第${i}时刻`);
                    }
                    let data = Object.assign({
                        xName: "日期",
                        yName: "感染人数",
                    }, this.data_performance);
                    this.chartPerformance = buildChartLinePerformance(data, "chartPerformance",
                        { top: '5%', bottom: '150', left: '80', right: '5%' },
                        'infographic');
                }
                {
                    let data = {
                        xName: "模型",
                        yName: "计算时间(秒)",
                        baseRunTime: Number(this.status.data.baseline_run_time).toFixed(2),
                        modelRunTime: Number(this.status.data.our_model_run_time).toFixed(2),
                    };
                    this.chartRunTime = buildChartBarRunTime(data, "chartRunTime",
                        { top: '5%', bottom: '20', left: '80', right: '5%' },
                        'infographic');
                }

            }
        },
        async next() {
            const stepTimeMap = {
                0: 0,
                1: 12,
                2: 24,
                3: 36,
                4: 48,
                5: 60,
                6: 72,
            };
            try {
                const res = await this.getSimulationResult("infectcells", `${stepTimeMap[this.active]}`);
                const processResult = processPoints(res);
                this.map.removeLayer(this.currentPointsLayer);
                if (this.showInfection)
                    this.map.addLayer(processResult.layer);
                this.infectionCount = processResult.count;
                this.currentPointsLayer = processResult.layer;
                this.currentPointsLayer.set("layerName", "infectcells#" + `${stepTimeMap[this.active]}`);
            }
            catch {
                this.$message({
                    message: `获取第${stepTimeMap[this.active]}时刻感染人群数据失败`,
                    type: "error",
                });
            }

            this.active++;
            if (this.active > 6) {
                this.active = 6;
                return;
            }
        },
        async previous() {
            const stepTimeMap = {
                0: 0,
                1: 12,
                2: 24,
                3: 36,
                4: 48,
                5: 60,
                6: 72,
            };
            this.active--;
            if (this.active < 0) {
                this.active = 0;
                return;
            }

            try {
                const res = await this.getSimulationResult("infectcells", `${stepTimeMap[this.active]}`);
                const processResult = processPoints(res);
                this.map.removeLayer(this.currentPointsLayer);
                if (this.showInfection)
                    this.map.addLayer(processResult.layer);
                this.infectionCount = processResult.count;
                this.currentPointsLayer = processResult.layer;
                this.currentPointsLayer.set("layerName", "infectcells#" + `${stepTimeMap[this.active]}`);
            }
            catch {
                this.$message({
                    message: `获取第${stepTimeMap[this.active]}时刻感染人群数据失败`,
                    type: "error",
                });
            }


        },
        uploadRegionShpFile(file) {
            this.regionShpFile.push(file);
        },
        uploadRegionShxFile(file) {
            this.regionShxFile.push(file);
        },
        // 根据拼音获取城市名
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
            else if (city in mapData) {
                return mapData[city].cityName
            }
            else {
                return city;
            }
        },
        resetView() {
            this.map.getView().setCenter(mapData[this.city].center);
            this.map.getView().setZoom(this.zoomLevel);
        },
        onSatelliteChange(value) {
            if (value) {
                this.map.add(this.satelliteLayer);
            } else {
                this.map.remove(this.satelliteLayer);
            }
        },
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
        onDisplayChange() {
            // if (this.showInfection) {
            //     this.onMapAddLayer(this.currentPointsLayer);
            // }
            // else {
            //     this.map.removeLayer(this.currentPointsLayer);
            // }

            // 传染病模拟图层
            if (this.showLayers.grid) {
                if (this.currentInfectionGridLayer)
                    this.onMapAddLayer(this.currentInfectionGridLayer);
            }
            else {
                if (this.currentInfectionGridLayer)
                    this.map.removeLayer(this.currentInfectionGridLayer);
            }

            // 初始感染点图层
            if (this.showLayers.initInfection) {
                if (this.initInfectionLayer)
                    this.onMapAddLayer(this.initInfectionLayer);
            }
            else {
                if (this.initInfectionLayer)
                    this.map.removeLayer(this.initInfectionLayer);
            }

            // 封锁区域图层
            if (this.showLayers.lock) {
                if (this.lockLayer)
                    this.onMapAddLayer(this.lockLayer);
            }
            else {
                if (this.lockLayer)
                    this.map.removeLayer(this.lockLayer);
            }

            // 传染病风险点图层
            if (this.showLayers.risk) {
                if (this.currentRiskLayer)
                    this.onMapAddLayer(this.currentRiskLayer);
            }
            else {
                if (this.currentRiskLayer)
                    this.map.removeLayer(this.currentRiskLayer);
            }

            // 人口流动控制决策图层
            if (this.showLayers.policy) {
                if (this.currentInfectionPolicyLayer)
                    this.onMapAddLayer(this.currentInfectionPolicyLayer);
            }
            else {
                if (this.currentInfectionPolicyLayer)
                    this.map.removeLayer(this.currentInfectionPolicyLayer);
            }
        },
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
        getModelRunTime() {
            // {
            //     this.totalTime = 5;
            //     this.efficiency = 10;
            //     this.$message({
            //         message: "获取模型运算效率成功",
            //         type: "success",
            //     });
            //     this.comparisonResult.img1 = `http://${serverInfo.baseIP}:8010/tj-httpd/static/Infection/comparison/img1.jpg`;
            //     this.comparisonResult.img2 = `http://${serverInfo.baseIP}:8010/tj-httpd/static/Infection/comparison/img2.jpg`;
            //     this.comparisonResult.img3 = `http://${serverInfo.baseIP}:8010/tj-httpd/static/Infection/comparison/img3.jpg`;
            //     this.comparisonResult.img_time_1 = `http://${serverInfo.baseIP}:8010/tj-httpd/static/Infection/comparison/img_time_1.jpg`;
            //     this.comparisonResult.img_time_2 = `http://${serverInfo.baseIP}:8010/tj-httpd/static/Infection/comparison/img_time_2.jpg`;
            //     return;
            // }
            let headers = {
                "Content-Type": "application/json",
            };
            const service = axios.create({
                baseURL: serverInfo.baseURL_infection,
                timeout: 16000000
            });
            service
                .get('/getModelRunTime', { headers: headers })
                .then((res) => {
                    if (res.data.msg === "success") {
                        this.$message({
                            message: "获取模型运算效率成功",
                            type: "success",
                        });
                        this.totalTime = res.data.total_time;
                        this.efficiency = res.data.efficiency;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                    this.$message({
                        message: "查询控制策略失败",
                        type: "error",
                    });
                });
            service
                .get('/comparison', { headers: headers })
                .then((res) => {
                    if (res.data.msg === "success") {
                        this.$message({
                            message: "获取模型结果和效率对比示意图成功",
                            type: "success",
                        });
                        this.comparisonResult.img1 = `data:image/jpg;base64,${res.data.img1}`;
                        this.comparisonResult.img2 = `data:image/jpg;base64,${res.data.img2}`;
                        this.comparisonResult.img3 = `data:image/jpg;base64,${res.data.img3}`;
                        this.comparisonResult.img_time_1 = `data:image/jpg;base64,${res.data.img_time_1}`;
                        this.comparisonResult.img_time_2 = `data:image/jpg;base64,${res.data.img_time_2}`;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                    this.$message({
                        message: "获取模型结果和效率对比示意图失败",
                        type: "error",
                    });
                });

        },
        searchControl() {
            // let port = "8010";
            // let port = "80";
            // {
            //     this.searchDayImg =  `http://${serverInfo.baseIP}:${port}/tj-httpd/static/Infection/MADDPG/searchDayImg.jpg`;
            //     this.$message({
            //         message: "查询控制策略成功",
            //         type: "success",
            //     });
            //     return;
            // }
            this.controlLoading = true;
            this.$message({
                message: "查询控制策略中",
                type: "success",
            });
            let headers = {
                "Content-Type": "application/json",
            };

            let formData = new FormData();
            formData.append("region_name", this.status.regionName);
            formData.append("start_time", this.searchDay);
            formData.append("filename1", this.regionShpFile[0].raw);
            formData.append("filename2", this.regionShxFile[0].raw);
            console.log(this.regionShpFile);
            console.log(this.regionShxFile);
            const service = axios.create({
                baseURL: serverInfo.baseURL_infection,
                timeout: 16000000
            });
            service
                .post('/getP', formData, { headers: headers })
                .then((res) => {
                    this.$message({
                        message: res.data.msg,
                        type: "success",
                    });
                    if (res.data.img)
                        this.searchDayImg = `data:image/jpg;base64,${res.data.img}`;
                    this.controlLoading = false;
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                    this.$message({
                        message: "查询控制策略失败",
                        type: "error",
                    });
                    this.controlLoading = false;
                });
        },
        // 生成强化学习模拟决策
        onUpdateMADDPG() {
            requestUtils.MADDPGSimultion(this, this.status.simulation_time);
        },
        // 切换传染病网格显示
        onInfectionShowChange() {
            if (this.currentInfectionGridLayer) {
                let key = `${this.currentInfectionDay}_${this.currentInfectionHour}`;
                let colorMap = 1;
                if (this.currentInfectionShowType === 'total_num_data' || this.currentInfectionShowType === 'S_data')
                    colorMap = 2;
                if (key in this.infectionResultData) {
                    mapUtils.updateInfectionLayer(this.currentInfectionGridSource,
                        this.infectionResultData[key][this.currentInfectionShowType], colorMap);
                }
                else {
                    requestUtils.getInfectionSimulationResult(this, this.currentInfectionDay, this.currentInfectionHour, this.status.simulation_time, this.lockType,
                        () => {
                            mapUtils.updateInfectionLayer(this.currentInfectionGridSource,
                                this.infectionResultData[key][this.currentInfectionShowType], colorMap);
                        });
                }
            }
            if (this.hasPolicy && this.currentInfectionPolicyLayer) {
                let policyFileName;
                if (this.lockType !== 2) policyFileName = this.status.simulation_time;
                else policyFileName = this.status.para_json.simulation_time;
                requestUtils.getGridControlPolicy(this, this.currentInfectionDay, this.currentInfectionHour, policyFileName, (data) => {
                    mapUtils.updateInfectionLayer(this.currentInfectionPolicySource, data, 0);
                })
            }
        },
        // 更新感染高风险区域
        updateRiskPoint() {
            requestUtils.getInfectionRiskPoint(this, this.currentInfectionDay, this.currentInfectionHour, this.status.simulation_time, this.thresholdInfected, this.lockType, () => {
                this.showLayers.grid = false;
                this.showLayers.risk = true;
                this.onDisplayChange();
            });

        },
        // 显示感染总人数曲线
        onShowPopulationChart() {
            if (!this.totalPopulation) {
                this.$message({
                    message: "感染总人数未获取完成，请稍后查看",
                    type: "warning",
                });
                return;
            }
            this.showPopulationChart = true;
            this.showIndex = 1;
            let times = [];
            for (let i = 1; i <= this.totalPopulation.length; ++i) {
                times.push(i);
            }
            let data = {
                xName: '模拟时刻(小时)',
                yName: '感染总人数(人)',
                yData: this.totalPopulation,
                xData: times,
            };
            let chart = buildChartLineBefore(data, "chartBefore",
                { top: '30', bottom: '120', left: '80', right: '30' },
                'infographic');
        },
        // 勾选结果文件
        resultSelectionChange(val) {
            this.resultSelection = val;
        },
        // 获取模拟结果文件列表
        async getResultFileList() {
            let getURL = (fileName) => {
                return `information/simulation/resultDownload/infection/${this.status.id}/${this.status.area}?path=${fileName}`;
            };

            const times = [0, 12, 24, 36, 48, 60, 72];
            const fileTypes = ["shp", "shx", "prj", "fix", "dbf"];

            times.forEach((time) => {
                if (time in this.status.resultLens["infectcells"]) {
                    let resultItems = [];
                    fileTypes.forEach((fileType) => {
                        resultItems.push({
                            name: `infect${time}.${fileType}`,
                            url: getURL(`infect${time}.${fileType}`),
                        });
                    });
                    this.resultFiles.push({
                        type: `感染人群`,
                        time: `${time}时`,
                        name: `infect${time}.*`,
                        files: resultItems,
                        number: resultItems.length,
                    });
                }
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
                        let data = await ajaxBlob(file.url);
                        zipFile.file(file.name, data, { binary: true });
                    }
                    catch {
                        console.log(`下载文件 ${file.url} 失败`);
                    }
                }
            }

            zipFile.generateAsync({ type: "blob" })
                .then((blob) => {
                    saveAs(blob, `results_${this.status.area}_infection_${this.status.id}`);
                    this.resultPacking = false;
                }, (e) => {
                    this.$message({
                        message: e,
                        type: "error",
                    });
                    this.resultPacking = false;
                });
        },
        // 导出灾前模拟结果
        async downloadResultBefore() {
            try {
                let simulation_types = ['none_type', 'lock_type', 'MADDPG_type'];
                let data = await ajaxInfection(`download_simulation_file?city=${this.city}` + `&simulation_day=${this.currentInfectionDay}` +
                    `&simulation_hour=${this.currentInfectionHour}` + `&simulation_type=${simulation_types[this.status.lockType]}` +
                    `&simulation_file_name=${this.status.simulation_time}`
                );
                let blob = new Blob([data], { type: "text/plain;charset=utf-8" });
                saveAs(blob, `infection_${this.city}_${this.status.simulation_time}_day${this.currentInfectionDay}_hour${this.currentInfectionHour}.csv`);
            }
            catch {
                this.$message({
                    message: "导出结果失败",
                    type: "error",
                });
            }
        },
        onShowComparisionList(){
            this.showIndex = 2;
            this.taskList.forEach((task)=>{
                if(task.city === this.city){
                    this.comparisonTaskList.push(task);
                }
            });
        },
        // 查看决策时间对比
        onShowTimeComparison(comparedTask) {
            if (this.lockType === 1) {
                if (comparedTask.lockType !== 2) {
                    this.$message({
                        message: "该任务无法对比，请选择强化学习动态管控措施任务！",
                        type: "error",
                    });
                    return;
                }
            }
            else if(this.lockType === 2){
                if (comparedTask.lockType !== 1) {
                    this.$message({
                        message: "该任务无法对比，请选择人为管控措施任务！",
                        type: "error",
                    });
                    return;
                }
            }
            let headers = {
                "Content-Type": "multipart/form-data",
            };
            let formData = new FormData();
            formData.append("simulation_city", this.city);
            if (this.lockType === 1) {
                formData.append("lock_simulation_time", this.infectionTaskInfo.simulationTime_str);
                formData.append("MADDPG_simulation_time", comparedTask.simulationTime_str);
            }
            else if(this.lockType === 2){
                formData.append("lock_simulation_time", comparedTask.simulationTime_str);
                formData.append("MADDPG_simulation_time", this.infectionTaskInfo.simulationTime_str);
            }
            const service = axios.create({
                baseURL: serverInfo.baseURL_infection,
                timeout: 16000000
            });
            service
                .post('/get_lock_and_maddpg_simulation_time', formData, { headers: headers })
                .then((res) => {
                    if (res.data.msg === "success") {
                        this.$message({
                            message: "获取决策对比时间成功！",
                            type: "success",
                        });
                        this.showDecisionTime = true;
                        let data = {
                            xName: "模型",
                            yName: "时间(秒)",
                            lock_setting_time: res.data.lock_setting_time,
                            maddpg_policy_time: res.data.maddpg_policy_time,
                            lock_simulation_time: res.data.lock_simulation_time,
                            maddpg_simulation_time: res.data.maddpg_simulation_time,
                        };
                        this.chartDecisionTime = buildChartBarDesicionTime(data, "chartDecisionTime",
                            { top: '5%', bottom: '30', left: '80', right: '5%' },
                            'customed');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$message({
                        message: "获取决策对比时间失败！",
                        type: "error",
                    });
                });

        },
    },
};

</script>


<style lang="scss" scoped>
.imgContainer {
    margin: 1% 2%;

    .cardHeader {
        text-align: center;
        font-weight: bold;
        font-size: large;
    }

    .simulationResult {
        width: 100%;
    }

    .simulationResultSmall {
        width: 50%;
    }

    .line {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .label {
            width: 150px;
        }

        .el-slider {
            width: 80%;
        }

        .el-button {
            margin-left: 10px;
        }

        .blank {
            width: 50px;
        }
    }

    // 图表容器
    .chart-container {
        width: 100%;
        height: 78vh;
        border-radius: 10px;
        transition: 0.3s;
    }

    .chart-container-small {
        height: 40vh;
    }

    // 图表
    .chart {
        height: 100%;
        transition: 0.3s;
    }
}

.resultContainer {
    margin: 1% 5%;
    text-align: center;
}


.el-step__title.is-process {
    color: #fff !important;
}

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

.panel {
    width: 300px;
    height: 100%;
    padding-left: 5px;
    display: flex;
    flex-direction: column;
}

.panel .line {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.panel .label {
    font-weight: bold;
}

.panel p {
    font-size: 16px;
    color: #333;
    margin: 5px 0;
}

.panel-info {
    border-radius: 10px;
    transition: 0.3s;
    flex-grow: 1;

}

.panel .card {
    border-radius: 10px;
    padding: 15px;
    margin: 10px 0;
    box-shadow: 5px 4px 4px 1px rgba(39, 56, 98, 0.2);
    /* background: rgb(102,197,222);
  background: linear-gradient(135deg, rgba(102,197,222,1) 0%, rgba(81,119,210,1) 100%); */
    background-color: #fff;
    transition: 0.3s;
}

.panel .card:hover {
    box-shadow: 5px 4px 4px 3px rgba(39, 56, 98, 0.5);
}

.containerCard {
    flex-grow: 1;
    flex-shrink: 1;
    height: 100%;
    padding: 10px;
    overflow: hidden;

    .chart {
        width: 60vw;
        height: 80vh;
        overflow: hidden;
        border-radius: 10px;
        transition: 0.3s;
    }
}

.aMap {
    width: 100%;
    height: 80vh;
    font-family: "微软雅黑";
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s;
    background-color: black;
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
}

.controlButton .controlIcon {
    color: #5177d2;
}

.controlButton:hover {
    cursor: pointer;

}

.controlButton:hover .controlIcon {
    color: #9097a5;
}

.controlButton:active .controlIcon {
    color: #000;
}

// 传染病灾前模拟面板
.panel-container {
    display: flex;
    flex-direction: row;
}

// 任务列表
.table-container {
    width: 100%;
    height: auto;
    border-radius: 10px;
    transition: 0.3s;
    padding: 0 10px;

    .el-table {
        margin: auto;
        width: 100%;
        height: 200px;
    }
}

.chart-container-decision {
    .chart {
        width: 58vw;
        height: 50vh;
        overflow: hidden;
        border-radius: 10px;
        transition: 0.3s;
    }
}
</style>