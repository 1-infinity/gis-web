<template>
    <div>
        <div v-show="infectionModel == 'seir'">
            <el-card class="imgContainer">
                <div slot="header" class="cardHeader">
                    <span>疫情模拟结果</span>
                </div>
                <img class="simulationResult" :src="imgData" />
            </el-card>
            <el-card class="imgContainer">
                <div slot="header" class="cardHeader">
                    <span>疫情预测结果</span>
                </div>
                <img class="simulationResult" :src="imgData_predict" />
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
                            <div id="resultCanvas" v-loading="showLoading" v-show="showResult">
                                <div id="panel">
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
                                            <div class="line">
                                                <p class="label">
                                                    卫星图显示：
                                                </p>
                                                <el-switch v-model="showSatellite" @change="onSatelliteChange"
                                                    active-color="#5177d2">
                                                </el-switch>
                                            </div>
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
                                <div id="containerCard">
                                    <div :id="'aMapInfection' + idSuffix" class="aMap"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            <el-card class="imgContainer">
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

import WKT from 'terraformer-wkt-parser';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const buildAMap = async (bindThis) => {
    const that = bindThis;

    try {
        that.map = new AMap.Map('aMapInfection' + that.idSuffix, {
            mapStyle: 'amap://styles/macaron', // 设置地图的显示样式
        });
        setTimeout(function () {
            that.map.setCity(that.cityName, function () {
                that.map.setZoom(that.zoomLevel);
            });
        }, 500);
        that.satelliteLayer = new AMap.TileLayer.Satellite();

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
    let points = [];
    pointData.forEach((item, index) => {
        let geojson = WKT.parse(item.geom);
        points.push(new AMap.Circle({
            center: new AMap.LngLat(geojson.coordinates[0], geojson.coordinates[1]),
            radius: 100,
            fillColor: 'red',
            strokeWeight: 0,
        }));
    });

    let polygonGroup = new AMap.OverlayGroup(points);

    return {
        group: polygonGroup,
        count: count
    };
}

export default {
    name: "infection",
    data() {
        return {
            showLoading: false,
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
            currentPointsGroup: null,

            cityName: "广州",
            zoomLevel: 10,

            imgData: "",
            imgData_predict: "",
            computeTime: 0,

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
    },
    watch: {
        status() {
            if (this.type == "infection") {
                this.onStatusChange();
            }
        },
    },
    mounted() {
        if (this.type == "infection") {
            this.onStatusChange();
        }
    },
    methods: {
        async onStatusChange() {
            if (this.infectionModel == "gamma") {
                buildAMap(this);
                this.showInfection = true;
                this.currentSimulationResult = {
                    "infectcells": {},
                };
                try {
                    const res = await this.getSimulationResult("infectcells", '0');
                    const processResult = processPoints(res);
                    this.map.add(processResult.group);
                    this.infectionCount = processResult.count;
                    this.currentPointsGroup = processResult.group;
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
                this.map.remove(this.currentPointsGroup);
                if (this.showInfection)
                    this.map.add(processResult.group);
                this.infectionCount = processResult.count;
                this.currentPointsGroup = processResult.group;
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
                this.map.remove(this.currentPointsGroup);
                if (this.showInfection)
                    this.map.add(processResult.group);
                this.infectionCount = processResult.count;
                this.currentPointsGroup = processResult.group;
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
        resetView() {
            this.map.setCity(this.cityName, function () {
                map.setZoom(this.zoomLevel);
            });
        },
        onSatelliteChange(value) {
            if (value) {
                this.map.add(this.satelliteLayer);
            } else {
                this.map.remove(this.satelliteLayer);
            }
        },
        onDisplayChange() {
            if (this.showInfection) {
                this.map.add(this.currentPointsGroup);
            }
            else {
                this.map.remove(this.currentPointsGroup);
            }
        },
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
        getModelRunTime() {
            // {
            //     this.totalTime = 5;
            //     this.efficiency = 10;
            //     this.$message({
            //         message: "获取模型运算效率成功",
            //         type: "success",
            //     });
            //     this.comparisonResult.img1 = "http://124.223.72.207:8888/static/Infection/comparison/img1.jpg";
            //     this.comparisonResult.img2 = "http://124.223.72.207:8888/static/Infection/comparison/img2.jpg";
            //     this.comparisonResult.img3 = "http://124.223.72.207:8888/static/Infection/comparison/img3.jpg";
            //     this.comparisonResult.img_time_1 = "http://124.223.72.207:8888/static/Infection/comparison/img_time_1.jpg";
            //     this.comparisonResult.img_time_2 = "http://124.223.72.207:8888/static/Infection/comparison/img_time_2.jpg";
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
            // {
            //     this.searchDayImg = "http://124.223.72.207:8888/static/Infection/MADDPG/searchDayImg.jpg";
            //     this.$message({
            //         message: "查询控制策略成功",
            //         type: "success",
            //     });
            //     return;
            // }
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
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                    this.$message({
                        message: "查询控制策略失败",
                        type: "error",
                    });
                });
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
                        let data = await ajax(file.url);
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
        }
    },
};

</script>


<style lang="scss" scoped>
.imgContainer {
    margin: 1% 5%;

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


#resultCanvas {
    height: calc(100% - 96px);
    height: 100%;
    display: flex;
    flex-direction: row;
    overflow: hidden;
}

#panel {
    width: 250px;
    height: 100%;
    padding-left: 5px;
    display: flex;
    flex-direction: column;
}

#panel .line {
    display: flex;
    flex-direction: row;
    align-items: center;
}

#panel .label {
    font-weight: bold;
}

#panel p {
    font-size: 16px;
    color: #333;
    margin: 5px 0;
}

.panel-info {
    border-radius: 10px;
    transition: 0.3s;
    flex-grow: 1;

}

#panel .card {
    border-radius: 10px;
    padding: 15px;
    margin: 10px 0;
    box-shadow: 5px 4px 4px 1px rgba(39, 56, 98, 0.2);
    /* background: rgb(102,197,222);
  background: linear-gradient(135deg, rgba(102,197,222,1) 0%, rgba(81,119,210,1) 100%); */
    background-color: #fff;
    transition: 0.3s;
}

#panel .card:hover {
    box-shadow: 5px 4px 4px 3px rgba(39, 56, 98, 0.5);
}

#containerCard {
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

#chart {
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
</style>