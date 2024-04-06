<template>
    <div class="panel">
        <el-card class="list-card">
            <span class="list-title">输入数据预览：</span>
            <el-checkbox class="readOnly" v-model="dataCheck.city">城市</el-checkbox>
            <el-checkbox class="readOnly" v-model="dataCheck.foundData">城市基础数据</el-checkbox>
            <el-checkbox class="readOnly" v-model="dataCheck.simuData">情景模拟数据</el-checkbox>
            <el-checkbox class="readOnly" v-model="dataCheck.hospitalData">医疗服务数据</el-checkbox>
        </el-card>
        <el-collapse @change="onCollapseChange">
            <!-- <el-collapse-item>
                <template slot="title">
                    <span class="collapse-allView">
                        <i class="collapse-icon el-icon-s-help"></i><span class="collapse-title">韧性评价指标总览</span>
                    </span>
                </template>
                <allView />
            </el-collapse-item> -->
            <el-collapse-item>
                <template slot="title">
                    <span class="collapse-currentValue">
                        <i class="collapse-icon el-icon-office-building"></i><span class="collapse-title">城市现状评分</span>
                    </span>
                </template>
                <currentValue ref="currentValue" :selectedCity="taskData.city"
                    :cityfoundDataFiles="taskData.foundationDataFiles" :people="taskData.CityPeople"
                    :area="taskData.CityArea" :dirtything="taskData.AreaDirtyThing" />
            </el-collapse-item>
            <el-collapse-item name="hospitalMeasure">
                <template slot="title">
                    <span class="collapse-hospital">
                        <i class="collapse-icon el-icon-document"></i><span class="collapse-title">医疗服务测度</span>
                    </span>
                </template>
                <div id="aMapHospital" class="aMap" v-loading="mapLoading"></div>
                <!-- 弹窗 -->
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
            </el-collapse-item>
            <el-collapse-item name="buildingResilience">
                <template slot="title">
                    <span class="collapse-building">
                        <i class="collapse-icon el-icon-document"></i><span class="collapse-title">城市建筑肌理韧性</span>
                    </span>
                </template>
                <div id="aMapBuilding" class="aMap" v-loading="mapBuildingLoading"></div>
                <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPopoverBuilding">
                    <div id="popupBuilding" slot="reference"></div>
                    <div style="text-align: center;">
                        <span style="color:#000;font-weight:bold;">{{ popInfoBuilding.id }}号建筑物</span>
                        <p style="color:#000"><strong>面积：</strong>{{ popInfoBuilding.area.toFixed(10) }} 平方米</p>
                        <p style="color:#000"><strong>建筑肌理韧性值：</strong>{{ popInfoBuilding.value.toFixed(4) }}</p>
                        <span>
                            <el-button @click="closePopoverBuilding">关闭</el-button>
                        </span>
                    </div>
                </el-popover>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import axios from "axios";
import serverInfo from '@/views/simulator/serverInfo';

import 'intro.js/introjs.css';
import introJs from 'intro.js';

import allView from '@/views/evaluate/allView.vue';
import currentValue from '@/views/evaluate/currentValue.vue';

import { Color } from 'three';


import mapData from '@/views/simulator/components/mapData';
import projzh from '@/views/simulator/components/proj';

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

// 新建查看医疗测度地图
const buildAMapHospital = async (bindThis) => {
    const that = bindThis;
    const cityName = that.cityName;
    try {
        that.mapHospital = new AMap.Map('aMapHospital', {
            mapStyle: 'amap://styles/macaron', // 设置地图的显示样式
        });
        setTimeout(function () {
            that.mapHospital.setCity(cityName, function () {
                that.mapmapHospital.setZoom(that.zoomLevel);
            });
        }, 500);


        // 绘制边界
        const districtSearch = new AMap.DistrictSearch({
            level: 'district', // 关键字对应的行政区级别，district表示区/县
            subdistrict: 0, //  显示下级行政区级数，0表示不需要返回下级行政区
            extensions: 'all', // 返回行政区边界坐标组等具体信息
        });
        districtSearch.search(cityName, function (status, result) {
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

// 新建查看建筑肌理韧性地图
const buildMapBuilding = async (bindThis) => {
    const that = bindThis;
    try {
        let city = that.taskData.city[1];
        // 获取地图容器
        let mapDom = document.getElementById('aMapBuilding');
        // 初始化地图配置
        that.mapBuilding = new Map({
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
        that.mapBuilding.addLayer(offlineMapLayer);

    } catch (e) {
        console.error(e, 888);
        that.$message.error(`发生了错误:${JSON.stringify(e)}`);
    }

};

// --- 处理建筑肌理韧性数据，转化为多边形覆盖物 ---
function processBuilding(bindThis, data) {
    const that = bindThis;
    let polygonFeatures = [];
    data.forEach((item, index) => {
        const format = new WKT();
        const feature = format.readFeature(item[1], {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:4326',
        });
        feature.name = "building";
        polygonFeatures.push(feature);
        let geometry = feature.getGeometry();
        let area = geometry.getArea() * 1000000;
        let coord = geometry.getFirstCoordinate();
        feature.info = {
            id: index,
            coord: coord,
            area: area,
            value: item[0],
        };

    });
    const style = new Style({
        stroke: new Stroke({
            color: 'rgba(59, 76, 93, 0.6)',
            width: 0,
        }),
        fill: new Fill({
            color: 'rgba(59, 76, 93, 0.75)',
        }),
    });
    const selectStyle = new Style({
        stroke: new Stroke({
            color: 'rgb(159, 176, 193)',
            width: 0,
        }),
        fill: new Fill({
            color: 'rgb(159, 176, 193)',
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
    that.mapBuilding.on('pointermove', function (event) {
        if (selected !== null) {
            selected.setStyle(style);
            selected = null;
        }
        that.mapBuilding.forEachFeatureAtPixel(event.pixel, function (f) {
            // 移动到多边形上改变颜色
            if (f.name === "building") {
                selected = f;
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


export default {
    name: "panelTwo",
    components: {
        allView, currentValue
    },
    data() {
        return {
            dataCheck: {
                city: false,
                foundData: false,
                simuData: false,
                hospitalData: false,
            },

            mapHospital: null,
            mapBuilding: null,
            zoomLevel: 10,

            cityName: "",
            mapLoading: true,
            mapBuildingLoading: true,

            // 弹窗信息
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
        };
    },
    props: {
        taskData: {
            type: Object,
        },
        hasHospital: {
            type: Boolean,
        },
    },
    created() { },
    mounted() {
        this.checkData();
        this.introduction();
        initOL(this);
    },
    methods: {
        assert_len() {
            return this.$refs.currentValue.assert_len();
        },

        saveResults() {
            this.$refs.currentValue.saveResult();
        },

        onCollapseChange(activeNames) {
            if (activeNames.includes("hospitalMeasure")) {
                this.onDisplayHospital();
            }
            if (activeNames.includes("buildingResilience")) {
                this.onDisplayBuilding();
            }
        },
        checkData() {
            // console.log(this.taskData);
            this.dataCheck.city = "city" in this.taskData;
            this.dataCheck.foundData = "foundationDataFiles" in this.taskData
                && this.taskData.foundationDataFiles.length > 0;
            this.dataCheck.simuData = "type" in this.taskData;
            this.dataCheck.hospitalData = this.hasHospital;
        },
        introduction() {
            introJs().setOptions({
                nextLabel: '下一步',
                prevLabel: '上一步',
                doneLabel: '完成',
                dontShowAgainLabel: '下次不再显示',
                steps: [{
                    intro: '欢迎来到<strong>现状评分</strong>界面！'
                },
                {
                    intro: '查看<strong>城市现状评分</strong>',
                    element: document.querySelector('.collapse-currentValue'),
                },
                {
                    intro: '完成<strong>现状评分</strong>',
                    element: document.querySelector('.dialog3 .dialog-footer button:nth-of-type(2)'),
                },
                ]
            }).start();
        },
        onDisplayHospital() {
            this.mapLoading = true;
            if (!this.hasHospital) {
                this.$message({
                    message: "缺少医疗服务数据！",
                    type: "warning",
                });
                return;
            }
            this.cityName = this.parseCity(this.taskData.city[1]);
            let url = serverInfo.baseURL_measure + "/measure/measureResult?city=" + this.taskData.city[1];
            axios
                .post(url)
                .then((res) => {
                    console.log(res);
                    if (res.data.success) {
                        buildAMapHospital(this);
                        const hospitalResult = processHospitalPoints(this, res.data.data);
                        this.mapHospital.add(hospitalResult.group);
                        setTimeout(() => {
                            this.mapHospital.remove(hospitalResult.group);
                            this.mapHospital.add(hospitalResult.group);
                        }, 2000);
                        this.mapLoading = false;
                    }
                    else {
                        this.$message({
                            message: res.data.errorMsg,
                            type: "warning",
                        });
                        this.mapLoading = true;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$message({
                        message: "获取医疗服务测度失败",
                        type: "error",
                    });
                    this.mapLoading = true;
                });

        },
        // 显示建筑肌理韧性
        onDisplayBuilding() {
            this.mapBuildingLoading = true;
            console.log("onDisplayBuilding");
            let formData = new FormData();
            formData.append("cityname", this.taskData.city[1]);

            let url = serverInfo.baseURL_resilience + "/resilience";
            let headers = {
                "Content-Type": "multipart/form-data",
            };
            axios
                .post(url, formData, { headers: headers })
                .then((res) => {
                    if (res.data.status) {
                        buildMapBuilding(this);
                        this.$message({
                            message: "获取城市肌理韧性数据成功",
                            type: "success",
                        });
                        const result = processBuilding(this, res.data.data);
                        this.mapBuilding.addLayer(result.layer);
                        this.mapBuildingLoading = false;

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
                    this.mapBuildingLoading = true;
                });
        },
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
        // 关闭地图内弹窗
        closePopoverHostipal() {
            this.$refs.mapInfoPopoverHostipal.showPopper = false;
        },
        closePopoverBuilding() {
            this.$refs.mapInfoPopoverBuilding.showPopper = false;
        },
    }
};
</script>
<style lang="scss" scoped>
.readOnly {
    pointer-events: none;
}

.list-card {
    margin: 0;

    .list-title {
        font-size: 16px;
        font-weight: bold;
        color: #000;
    }
}

.collapse-title {
    font-size: 16px;
    font-weight: bold;
}

.collapse-icon {
    width: 16px;
    scale: 120%;
}

.aMap {
    width: 100%;
    height: 60vh;
    font-family: "微软雅黑";
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s;
}
</style>