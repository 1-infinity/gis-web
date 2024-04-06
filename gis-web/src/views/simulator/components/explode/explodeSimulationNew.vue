<template>
    <div class="main-wrapper" flex flex-box="1">
        <div flex-box="1" flex="dir:col">
            <div class="border-box" flex-box="1" flex="dir:col">
                <div id="canvasName" class="canvasName"> <strong>当前视图：</strong> {{ canvasNames[canvasIndex] }} </div>
                <div id="resultCanvas" class="resultCanvas" v-loading="showLoading">
                    <div id="panel" class="panel">
                        <div class="panel-info">
                            <div class="card">
                                <div class="line">
                                    <p class="label">
                                        <i class="el-icon-date"></i>
                                        时间：
                                    </p>
                                    <p>{{ status.submitTime }}</p>
                                </div>
                                <div class="line">
                                    <p class="label">
                                        <i class="el-icon-position"></i>
                                        位置：
                                    </p>
                                    <p>{{ getCityName(status.city) }}</p>
                                </div>
                                <div class="line">
                                    <p class="label">
                                        <i class="el-icon-position"></i>
                                        爆炸范围半径：
                                    </p>
                                    <p>{{ status.radius }}</p>
                                </div>
                                <div class="line">
                                    <p class="label">
                                        <i class="el-icon-position"></i>
                                        爆炸幅度：
                                    </p>
                                    <p>{{ status.amplitude }}</p>
                                </div>
                                <div class="line">
                                    <p class="label">
                                        <i class="el-icon-position"></i>
                                        高斯方差：
                                    </p>
                                    <p>{{ status.sigma }}</p>
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
                                        返回地图：
                                    </p>
                                    <button class="controlButton" @click="canvasIndex = 0">
                                        <i class="el-icon-back controlIcon"></i>
                                    </button>
                                </div>
                                <div class="line">
                                    <p class="label">
                                        查看爆炸范围：
                                    </p>
                                    <button class="controlButton" @click="canvasIndex = 1">
                                        <i class="el-icon-view controlIcon"></i>
                                    </button>
                                </div>
                                <div class="line">
                                    <p class="label">
                                        危险路网显示：
                                    </p>
                                    <el-switch v-model="showDangerousroads" @change="onDisplayChange"
                                        active-color="#5177d2">
                                    </el-switch>
                                </div>
                                <div class="line">
                                    <p class="label">
                                        可用路网显示：
                                    </p>
                                    <el-switch v-model="showAvailableroads" @change="onDisplayChange"
                                        active-color="#5177d2">
                                    </el-switch>
                                </div>
                                <div class="line">
                                    <p class="label">
                                        加油站显示：
                                    </p>
                                    <el-switch v-model="showStations" @change="onDisplayChange" active-color="#5177d2">
                                    </el-switch>
                                </div>
                                <div class="line">
                                    <p class="label">
                                        爆炸范围显示：
                                    </p>
                                    <el-switch v-model="showExplode" @change="onDisplayChange" active-color="#5177d2">
                                    </el-switch>
                                </div>
                            </div>
                            <div class="card">
                                <div class="line">
                                    <p class="label">
                                        导出结果：
                                    </p>
                                    <button class="controlButton" @click="download">
                                        <i class="el-icon-download controlIcon"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="containerCard" class="containerCard">
                        <div>
                            <span>
                                <span class="color-block" style="background: #ff0000"></span>危险路网
                            </span>
                            <span>
                                <span class="color-block" style="background: #008000"></span>可用路网
                            </span>
                        </div>
                        <div v-show="canvasIndex == 0" id="aMapExplode" class="aMap"></div>
                        <baidu-map  v-if="type==='explode'" v-show="canvasIndex == 1" class="aMap" :center="center" :zoom="zoomLevel"
                            :scroll-wheel-zoom="true">
                            <bm-scale anchor="BMAP_ANCHOR_TOP_LEFT"></bm-scale>
                            <bm-marker v-if="showStations" v-for="item of gas_stations" :key="item.id"
                                :position="{ lng: item.longtitude, lat: item.latitude }"
                                @click="onClickStation(item)">
                            </bm-marker>
                            <bm-info-window :position="popInfoStation.pos" :show="showInfoWindow">
                                <div style="text-align: center;">
                                    <span style="color:#000;font-weight:bold;">{{ popInfoStation.id }}号加油站</span>
                                    <p style="color:#000"><strong>名字：</strong>{{ popInfoStation.name }}</p>
                                    <p style="color:#000"><strong>地址：</strong>{{ popInfoStation.address }}</p>
                                    <p style="color:#000"><strong>坐标：</strong>
                                        {{ `(${popInfoStation.longtitude.toFixed(3)},${popInfoStation.latitude.toFixed(3)})`
                                        }}
                                    </p>
                                    <span>
                                        <el-button type="primary" @click="displayHeat(popInfoStation)">显示爆炸范围</el-button>
                                    </span>
                                </div>
                            </bm-info-window>
                            <bml-heatmap :data="heatdata" :max="100" :radius="10">
                            </bml-heatmap>
                        </baidu-map>
                        <!-- 弹窗 -->
                        <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPopover">
                            <div id="popup" slot="reference"></div>
                            <div style="text-align: center;">
                                <span style="color:#000;font-weight:bold;">{{ popInfo.id }}号道路</span>
                                <p style="color:#000"><strong>热力值：</strong>{{ popInfo.value }}</p>
                            </div>
                        </el-popover>
                        <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPopoverStation">
                            <div id="popup" slot="reference"></div>
                            <div style="text-align: center;">
                                <span style="color:#000;font-weight:bold;">{{ popInfoStation.id }}号加油站</span>
                                <p style="color:#000"><strong>名字：</strong>{{ popInfoStation.name }}</p>
                                <p style="color:#000"><strong>地址：</strong>{{ popInfoStation.address }}</p>
                                <p style="color:#000"><strong>坐标：</strong>
                                    {{ `(${popInfoStation.longtitude.toFixed(3)},${popInfoStation.latitude.toFixed(3)})` }}
                                </p>
                            </div>
                        </el-popover>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 数据
import mapData from '../mapData';

// 地图相关函数
import *  as mapUtils from "../mapUtils";

// 后端请求
import serverInfo from '../../serverInfo';
import ajaxExplode from './ajaxExplode';
import ajaxExplodeBlob from './ajaxExplodeBlob';

// ol
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import WKT from 'ol/format/WKT.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Stroke, Style, Icon } from 'ol/style.js';
import Overlay from 'ol/Overlay.js';

// bMap
import { BmlHeatmap } from 'vue-baidu-map';

import IconStation from './gasstation.png';

// 初始化OpenLayer地图
const initOLMap = (bindThis, city) => {
    const that = bindThis;
    // 获取地图容器
    let mapDom = document.getElementById('aMapExplode');
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

const buildMap = async (bindThis) => {
    const that = bindThis;
    try {
        that.showLoading = true;
        // 危险路网
        try {
            const res = await that.getSimulationResult("dangerousroads");
            const dangerousroadsResult = processRoads(that, res, '#ff0000');
            if (that.showDangerousroads)
                that.map.addLayer(dangerousroadsResult.layer);
            that.currentDangerousroadsLayer = dangerousroadsResult.layer;
            that.currentDangerousroadsLayer.set("layerName", "dangerousroads");
        }
        catch {
            that.$message({
                message: `获取危险路网数据失败`,
                type: "error",
            });
        }
        // 可用路网
        try {
            const res = await that.getSimulationResult("availableroads");
            const availableroadsResult = processRoads(that, res, '#008000');
            if (that.showAvailableroads)
                that.map.addLayer(availableroadsResult.layer);
            that.currentAvailableroadsLayer = availableroadsResult.layer;
            that.currentAvailableroadsLayer.set("layerName", "availableroads");
        }
        catch {
            that.$message({
                message: `获取可用路网数据失败`,
                type: "error",
            });
        }
        that.showLoading = false;

    }
    catch (e) {
        console.error("BuildMap:", e);
        that.$message.error(`发生了错误:${JSON.stringify(e)}`);
    }
}

// --- 处理路网数据，转化为折线覆盖物 ---
function processRoads(bindThis, data, color) {
    const that = bindThis;
    let lineFeatures = [];

    data.forEach((item, index) => {
        const format = new WKT();
        const feature = format.readFeature(item.geometry, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:4326',
        });
        feature.name = "road";
        feature.info = {
            id: index,
            value: item.heat_value
        };
        lineFeatures.push(feature);

    });
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

// 添加加油站
function addStations(bindThis, data) {
    const that = bindThis;
    let pointFeatures = [];
    const iconStyleStation = new Style({
        image: new Icon({
            color: '#ffffff',
            crossOrigin: 'anonymous',
            src: that.iconStation,
            scale: 0.3,
        })
    })
    data.forEach((item) => {
        // 创建点
        const point = new Feature({
            geometry: new Point([item.longtitude, item.latitude]),
        })
        point.name = 'station';
        point.info = item;
        point.setStyle(iconStyleStation);
        pointFeatures.push(point);
    })
    // 创建geojson据源
    let pointLayerSource = new VectorSource({ features: pointFeatures })
    // 创建图层 并加载数据
    that.stationLayer = new VectorLayer({ source: pointLayerSource })
    that.stationLayer.set("layerName", "station");
    // 将图层添加地图上
    if (that.showStations)
        that.map.addLayer(that.stationLayer)
}

// 添加地图事件响应
function addEventListener(bindThis) {
    const that = bindThis;
    let selected = null;
    let style = null;
    // 鼠标移动事件
    const selectStyle = new Style({
        stroke: new Stroke({
            color: '#7beeee',
            width: 0,
        })
    });
    that.map.on('pointermove', function (event) {
        if (selected !== null) {
            selected.setStyle(style);
            selected = null;
        }
        that.map.forEachFeatureAtPixel(event.pixel, function (f) {
            // 移动到线段上改变颜色
            if (f.name === "road" || f.name === "station") {
                selected = f;
                style = f.getStyle();
                if (f.name === "road")
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
    const popupStation = new Overlay({
        element: document.getElementById('popupStation'),
    });
    that.map.addOverlay(popup);
    that.map.addOverlay(popupStation);

    that.map.on('click', function (event) {
        let click = null;
        that.map.forEachFeatureAtPixel(event.pixel, function (f) {
            if (f.name === "road") {
                const coordinate = event.coordinate;
                popup.setPosition(coordinate);
                that.$refs.mapInfoPopover.showPopper = false;
                that.popInfo = f.info;
                click = f;
                setTimeout(() => {
                    that.$refs.mapInfoPopover.showPopper = true;
                }, 100);
            }
            else if (f.name === "station") {
                const coordinate = event.coordinate;
                popup.setPosition(coordinate);
                that.$refs.mapInfoPopoverStation.showPopper = false;
                that.popInfoStation = f.info;
                click = f;
                setTimeout(() => {
                    that.$refs.mapInfoPopoverStation.showPopper = true;
                }, 100);
            }
            return true;
        });
        if (!click) {
            that.$refs.mapInfoPopover.showPopper = false;
            that.$refs.mapInfoPopoverStation.showPopper = false;
        }
    });
}


export default ({
    name: "explodeSimulation",
    components: {
        BmlHeatmap
    },
    data() {
        return {
            showLoading: false,

            showDangerousroads: false,
            showAvailableroads: false,
            showStations: true,
            showExplode: false,

            canvasIndex: 0,

            map: null,
            center: {
                lng: 0,
                lat: 0
            },
            zoomLevel: 10,
            resultMaxLen: 20000,

            currentSimulationResult: null,

            currentDangerousroadsLayer: null,
            currentAvailableroadsLayer: null,

            stationLayer: null,

            gas_stations: [],

            // 弹窗信息
            popInfo: {
                id: 0,
                coord: [0, 0],
                value: 0,
            },
            popInfoStation: {
                id: 0,
                name: "",
                address: "",
                latitude: 0,
                longtitude: 0,
            },
            showInfoWindow: false,

            iconStation: IconStation,
            heatdata: [],

            canvasNames: {
                0: "路网视图",
                1: "爆炸范围视图"
            }

        }
    },
    props: {
        type: {
            type: String,
        },
        status: {
            type: Object,
        },
    },
    watch: {
        status() {
            if (this.type === "explode") {
                this.onStatusChange();
            }
        },
    },
    mounted() {
        if (this.type === "explode") {
            this.onStatusChange();
        }
    },
    methods: {
        // 传入的status数据改变，切换显示的任务
        async onStatusChange() {
            console.log("Status:", this.status);


            this.showDangerousroads = false;
            this.showAvailableroads = false;
            this.showStations = true;

            this.currentSimulationResult = {
                "availableroads": {},
                "dangerousroads": {},
            };

            if (this.map) {
                this.map.setTarget(null);
                this.map = null;
            }

            mapUtils.initOL(this);
            initOLMap(this, this.status.city);
            buildMap(this);
            addEventListener(this);

            await this.getStations();
            addStations(this, this.gas_stations);

            // 百度地图
            let center = mapData[this.status.city].center;
            this.center = { lng: center[0], lat: center[1] };

        },
        // 根据拼音获取城市名
        getCityName(city) {
            if (city in mapData)
                return mapData[city].cityName;
            else
                return city;
        },
        // 重置视图
        resetView() {
            this.map.getView().setCenter(mapData[this.status.city].center);
            this.map.getView().setZoom(this.zoomLevel);

            let center = mapData[this.status.city].center;
            this.center = { lng: center[0], lat: center[1] };
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
        // 切换图层显示
        onDisplayChange() {
            if (this.showDangerousroads) {
                this.onMapAddLayer(this.currentDangerousroadsLayer);
            } else {
                this.map.removeLayer(this.currentDangerousroadsLayer);
            }
            if (this.showAvailableroads) {
                this.onMapAddLayer(this.currentAvailableroadsLayer);
            } else {
                this.map.removeLayer(this.currentAvailableroadsLayer);
            }
            if (this.showStations) {
                this.onMapAddLayer(this.stationLayer);
            } else {
                this.map.removeLayer(this.stationLayer);
            }

            if (!this.showExplode) {
                this.heatdata = [];
            }
        },
        // 获取模拟结果
        async getSimulationResult(resultType) {
            let len = this.resultMaxLen;
            let res = await ajaxExplode(`taskResult/subresult/${this.status.id}_${this.status.city}/${resultType}/0/${len}`);
            if (res.status === true)
                return res.result;
            else
                return null;
        },
        // 获取加油站信息
        async getStations() {
            let res = await ajaxExplode(`getStations/${this.status.id}_${this.status.city}`);
            if (res.status === true) {
                this.gas_stations = res.result;
            }
            else {
                that.$message({
                    message: res.msg,
                    type: "warning",
                });
            }
        },
        // 高斯爆炸函数
        gaussian(x, y, x0, y0, sigma) {
            return Math.exp(-((x - x0) ** 2 + (y - y0) ** 2) / (2 * sigma ** 2));
        },
        // 计算热力图
        calculate(centerLng, centerLat) {
            const radius = this.status.radius;
            const sigma = this.status.sigma;
            const amplitude = this.status.amplitude;
            const step = 0.001;
            let heatmapData = [];
            for (let i = centerLng - radius; i < centerLng + radius; i += step) {
                for (let j = centerLat - radius; j < centerLat + radius; j += step) {
                    let heat_value = amplitude * this.gaussian(i, j, centerLng, centerLat, sigma);
                    heatmapData.push({
                        lng: i,
                        lat: j,
                        count: heat_value,
                    });
                }
            }
            return heatmapData

        },
        // 显示热力图
        displayHeat(station) {
            this.heatdata = this.calculate(station.longtitude, station.latitude);
            this.showExplode = true;
            this.showInfoWindow = false;
        },
        // 点击加油站
        onClickStation(station) {
            this.popInfoStation = station;
            this.popInfoStation.pos = {
                lng: station.longtitude,
                lat: station.latitude
            };
            this.showInfoWindow = true;
        },
        // 导出结果
        async download(){
            let data = await ajaxExplodeBlob(`downloadAll?path=${this.status.id}_${this.status.city}`)

            let blob = new Blob([data]);
            saveAs(blob, `explode_${this.status.id}_${this.status.city}.zip`);
        },
    }
})
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
    width: 280px;
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
</style>
