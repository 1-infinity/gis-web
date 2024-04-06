<template>
    <div class="panel">
        <!-- <div class="description">
            <p><span style="color:red;">*</span>为必填项</p>
        </div> -->
        <el-row :gutter="20" type="flex" justify="center">
            <el-col :span="8">
                <el-card class="data-card">
                    <div slot="header" class="card-header">
                        <span>城市数据</span>
                    </div>
                    <el-form ref="form">
                        <el-form-item label="城市:" class="city" required>
                            <el-cascader :options="cityOptions" placeholder="城市" :show-all-levels="false" v-model="city">
                                <template slot-scope="{ node, data }">
                                    <span>{{ data.label }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                                </template>
                            </el-cascader>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card class="data-card">
                    <div slot="header" class="card-header">
                        <span>现状评分功能数据</span>
                    </div>
                    <el-form ref="form">
                        <el-form-item label="地区总面积（万公顷）:" required>
                            <el-input v-model="CityArea" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="地区总人口（万人）:" required>
                            <el-input v-model="CityPeople" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="地区总污水量、固废量（万吨）:" required>
                            <el-input v-model="AreaDirtyThing" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="城市基础数据">
                            <el-link type="primary" style="position:relative; float: right;" @click="downloadModule"
                                disabled>点击下载模板数据</el-link>
                            <el-upload name="foundation" :auto-upload="false" :on-change="uploadFoudationDataFiles" multiple
                                action="" accept=".xlsx, .xls">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__tip" slot="tip">
                                    请上传xls、xlsx文件(格式为系统A-G+指标0-n，如A3.xlsx是生命线系统第四个指标所需数据)
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card class="data-card">
                    <div slot="header" class="card-header">
                        <span>测度功能数据</span>
                    </div>
                    <el-form ref="form">
                        <el-form-item label="交通出行量(OD)数据:">
                            <el-popover placement="right" width="800" trigger="hover">
                                <p class="helpTitle">数据要求</p>
                                <el-image :src="helpImgs['od']"></el-image>
                                <i class="el-icon-question" slot="reference"></i>
                            </el-popover>
                            <el-upload name="od" :on-change="uploadODFile" :auto-upload="false" multiple action=""
                                :file-list="odFiles">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__tip" slot="tip">
                                    请上传od.csv文件
                                </div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="医疗服务数据:">
                            <el-popover placement="right" width="800" trigger="hover">
                                <p class="helpTitle">数据要求</p>
                                <el-image :src="helpImgs['hospital']"></el-image>
                                <i class="el-icon-question" slot="reference"></i>
                            </el-popover>
                            <el-upload name="od" :on-change="uploadHospitalFile" :auto-upload="false" multiple action=""
                                accept=".csv">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__tip" slot="tip">
                                    请上传hospital.csv文件
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="data-card">
                    <div slot="header" class="card-header">
                        <span>情景模拟功能、规划决策功能数据</span>
                    </div>
                    <el-form ref="form">
                        <el-form-item label="路网数据:" required>
                            <el-popover placement="right" width="800" trigger="hover">
                                <p class="helpTitle">数据要求</p>
                                <el-image :src="helpImgs['road']"></el-image>
                                <i class="el-icon-question" slot="reference"></i>
                            </el-popover>
                            <el-upload name="roads" :auto-upload="false" :on-change="uploadRoadFiles" multiple action=""
                                :file-list="roadFiles">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__tip" slot="tip">
                                    请上传roads.cpg文件、roads.dbf文件、roads.prj文件、roads.qix文件、roads.sbn文件、roads.sbx文件、roads.shp文件、roads.shp文件(xml)、roads.shx文件
                                </div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="建筑物数据:" required>
                            <el-popover placement="right" width="800" trigger="hover">
                                <p class="helpTitle">数据要求</p>
                                <el-image :src="helpImgs['building']"></el-image>
                                <i class="el-icon-question" slot="reference"></i>
                            </el-popover>
                            <el-upload name="buildings" :auto-upload="false" :on-change="uploadBuildingFiles" multiple
                                action="" :file-list="buildingFiles">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__tip" slot="tip">
                                    请上传buildings.cpg文件、buildings.dbf文件、buildings.prj文件、buildings.qix文件、buildings.sbn文件、buildings.sbx文件、buildings.shp文件、buildings.shp文件(xml)、buildings.shx文件
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card class="data-card">
                    <div slot="header" class="card-header">
                        <span>情景模拟功能数据</span>
                    </div>
                    <el-form ref="form">
                        <el-form-item label="灾害类型:" class="type" required>
                            <el-radio v-model="type" label="flood">洪水</el-radio>
                            <el-radio v-model="type" label="infection">疫情</el-radio>
                        </el-form-item>
                        <el-form-item label="高程数据:" required>
                            <el-popover placement="right" width="800" trigger="hover">
                                <p class="helpTitle">数据要求</p>
                                <el-image :src="helpImgs['dem']"></el-image>
                                <p style="text-align:center; font-size: large; margin: 0;">栅格总数 &lt; 650万</p>
                                <i class="el-icon-question" slot="reference"></i>
                            </el-popover>
                            <el-upload name="dem" :auto-upload="false" :on-change="uploadDemFiles" multiple action=""
                                :file-list="demFiles">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__tip" slot="tip">
                                    请上传dem.ovr文件、dem.tfw文件、dem.tif文件、dem.xml文件
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card class="data-card">
                    <div slot="header" class="card-header">
                        <span>规划决策功能数据</span>
                    </div>
                    <el-form ref="form">
                        <el-form-item label="人口分布数据:">
                            <el-popover placement="right" width="800" trigger="hover">
                                <p class="helpTitle">数据要求</p>
                                <el-image :src="helpImgs['peopleDistribution']"></el-image>
                                <i class="el-icon-question" slot="reference"></i>
                            </el-popover>
                            <el-upload name="dem" :auto-upload="false" :on-change="uploadPeopleDistributionFile" multiple
                                action="" accept=".cpg, .dbf, .prj, .qix, .sbn, .sbx, .shp, .xml, .shx">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__tip" slot="tip">
                                    请上传cpg文件、dbf文件、prj文件、qix文件、sbn文件、sbx文件、shp文件、shp文件(xml)、shx文件
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="8" v-show="type == 'flood'">
                <el-card class="data-card">
                    <div slot="header" class="card-header">
                        <span>洪水模拟功能数据</span>
                    </div>
                    <el-form ref="form">
                        <el-form-item label="水文数据:" required>
                            <el-popover placement="right" width="800" trigger="hover">
                                <p class="helpTitle">数据要求</p>
                                <el-image :src="helpImgs['water']"></el-image>
                                <i class="el-icon-question" slot="reference"></i>
                            </el-popover>
                            <el-upload name="waters" :on-change="uploadWaterFiles" :auto-upload="false" multiple action=""
                                :file-list="waterFiles">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__tip" slot="tip">
                                    请上传waters.cpg文件、waters.dbf文件、waters.prj文件、waters.qix文件、waters.sbn文件、waters.sbx文件、waters.shp文件、waters.shp文件(xml)、waters.shx文件
                                </div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="初始降雨中心点X坐标(InitX, 0～1):">
                            <el-input v-model="floodParam.InitX" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="初始降雨中心点Y坐标(InitY, 0～1):">
                            <el-input v-model="floodParam.InitY" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="降雨半径(Radius, 0～1):">
                            <el-input v-model="floodParam.Radius" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="移动方向(Movement direction, 0～360):">
                            <el-input v-model="floodParam['Movement direction']" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="移动速度(Movement speed, 0～1):">
                            <el-input v-model="floodParam['Movement speed']" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="每小时降雨量(Rainfall per hour, 0～1):">
                            <el-input v-model="floodParam['Rainfall per hour']" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="水流扩散速率(Diffusion rate, 0～1):">
                            <el-input v-model="floodParam['Diffusion rate']" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="8" v-show="type == 'infection'">
                <el-card class="data-card">
                    <div slot="header" class="card-header">
                        <span>疫情模拟功能数据</span>
                    </div>
                    <el-form ref="form">
                        <!-- 设置Gamma数据 -->
                        <div v-show="infectionModel == 'gamma'">
                            <el-form-item label="人口总数(Population):">
                                <el-input v-model="infectionParamGamma.Population" placeholder="请输入内容"></el-input>
                            </el-form-item>
                            <el-form-item label="初始感染人数(Initial Infection):">
                                <el-input v-model="infectionParamGamma['Initial Infection']" placeholder="请输入内容">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="人群移速(Crowd Speed, 千米/小时):">
                                <el-input v-model="infectionParamGamma['Crowd Speed']" placeholder="请输入内容"></el-input>
                            </el-form-item>
                            <el-form-item label="可感染范围(Infectious Range, 米):">
                                <el-input v-model="infectionParamGamma['Infectious Range']" placeholder="请输入内容">
                                </el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import axios from "axios";
import ajax1 from "../evaluate/ajax1";
import 'intro.js/introjs.css';
import introJs from 'intro.js';

import { options } from "./CityOptions";

import serverInfo from '@/views/simulator/serverInfo';


export default {
    name: "panelOne",
    data() {
        return {
            helpImgs: {
                "water": require("@/assets/images/dataRequirement/waterFiles.jpg"),
                "road": require("@/assets/images/dataRequirement/roadFiles.jpg"),
                "building": require("@/assets/images/dataRequirement/buildingFiles.jpg"),
                "dem": require("@/assets/images/dataRequirement/demFiles.jpg"),
                "od": require("@/assets/images/dataRequirement/odFiles.jpg"),
                "hospital": require("@/assets/images/dataRequirement/hospitalFiles.jpg"),
                "peopleDistribution": require("@/assets/images/dataRequirement/peopleDistributionFiles.jpg"),
            },
            cityOptions: options,

            // 城市数据
            city: [],
            CityPeople: 2489,
            CityArea: 63.4,
            AreaDirtyThing: 340965.2,
            files: [],
            foundationDataFiles: [],
            roadFiles: [],
            buildingFiles: [],
            demFiles: [],
            odFiles: [],
            drainageFile: [],
            hospitalFiles: [],
            type: "flood",


            // 洪水数据
            waterFiles: [],
            floodParam: {
                InitX: "0.5",
                InitY: "0.2",
                Radius: "0.5",
                "Movement direction": "0.0",
                "Movement speed": "0.03",
                "Rainfall per hour": "0.02",
                "Diffusion rate": "0.6",
                type: "flood",
                "Whether drainage facilities are used": "false",
            },
            drainageAutoImport: true,

            // 疫情数据
            infectionModel: "gamma",
            infectionParamGamma: {
                type: "infection",
                Population: "1000",
                "Initial Infection": "3",
                "Crowd Speed": "0.01",
                "Infectious Range": "0.01",
            },

        };
    },
    created() { },
    mounted() {
        this.introduction();
    },
    methods: {
        introduction() {
            introJs().setOptions({
                nextLabel: '下一步',
                prevLabel: '上一步',
                doneLabel: '完成',
                dontShowAgainLabel: '下次不再显示',
                steps: [{
                    intro: '欢迎来到<strong>基础资料输入</strong>界面！'
                },
                {
                    intro: '选择城市',
                    element: document.querySelector('.city input'),
                },
                {
                    intro: '输入<strong>现状评分功能数据</strong>',
                    element: document.querySelector('.el-col:nth-of-type(1)>div:nth-of-type(2)'),
                },

                {
                    intro: '输入<strong>情景模拟功能数据</strong>',
                    element: document.querySelector('.el-col:nth-of-type(2)>div:nth-of-type(2)'),
                },
                {
                    intro: '输入<strong>灾害模拟功能数据</strong>',
                    element: document.querySelector('.el-col:nth-of-type(3)>div:nth-of-type(1)'),
                },
                {
                    intro: '输入<strong>测度功能数据</strong>',
                    element: document.querySelector('.el-col:nth-of-type(1)>div:nth-of-type(3)'),
                },
                {
                    intro: '输入<strong>规划决策功能数据</strong>',
                    element: document.querySelector('.el-col:nth-of-type(2)>div:nth-of-type(3)'),
                },
                {
                    intro: '提交数据',
                    element: document.querySelector('.dialog-footer button:nth-of-type(2)'),
                },
                ]
            }).start();
        },
        async downloadModule() {
            let filename = "城市基础数据模板.zip";
            let f = await ajax1(`/information/simulation/download/${filename}`);
            let eleLink = document.createElement('a');
            eleLink.download = filename;
            eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            let blob = new Blob([f]);
            eleLink.href = URL.createObjectURL(blob);
            // 自动触发点击 
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除 
            document.body.removeChild(eleLink);
        },
        uploadFoudationDataFiles(file) {
            this.foundationDataFiles.push(file);
        },
        uploadWaterFiles(file) {
            let fileName = file.name;
            if (fileName.split(".")[0] != "waters") {
                setTimeout(() => {
                    this.$message.error(`请将上传文件命名为waters.${fileName.split(".")[1]}`);
                }, 100);
                this.waterFiles = this.waterFiles.slice(0, -1);
                return;
            }
            else {
                this.waterFiles.push(file);
                this.files.push(file);
            }
        },
        uploadRoadFiles(file) {
            let fileName = file.name;
            if (fileName.split(".")[0] != "roads") {
                setTimeout(() => {
                    this.$message.error(`请将上传文件命名为roads.${fileName.split(".")[1]}`);
                }, 100);
                this.roadFiles = this.roadFiles.slice(0, -1);
                return;
            }
            else {
                this.roadFiles.push(file);
                this.files.push(file);
            }
        },
        uploadBuildingFiles(file) {
            let fileName = file.name;
            if (fileName.split(".")[0] != "buildings") {
                setTimeout(() => {
                    this.$message.error(`请将上传文件命名为buildings.${fileName.split(".")[1]}`);
                }, 100);
                this.buildingFiles = this.buildingFiles.slice(0, -1);
                return;
            }
            else {
                this.buildingFiles.push(file);
                this.files.push(file);
            }
        },
        uploadDemFiles(file) {
            let fileName = file.name;
            if (fileName.split(".")[0] != "dem") {
                setTimeout(() => {
                    this.$message.error(`请将上传文件命名为dem.${fileName.split(".")[1]}`);
                }, 100);
                this.demFiles = this.demFiles.slice(0, -1);
                return;
            }
            else {
                this.demFiles.push(file);
                this.files.push(file);
            }
        },
        uploadODFile(file) {
            let fileName = file.name;
            if (fileName.split(".")[0] != "od") {
                this.$message.error(`请将上传文件命名为od.${fileName.split(".")[1]}`);
                this.odFiles = this.odFiles.slice(0, -1);
                return;
            }
            else {
                this.odFiles.push(odFiles);
                this.files.push(file);
            }
        },
        uploadHospitalFile(file) {
            this.hospitalFiles.push(file);
        },
        uploadDrainageFile(file) {
            this.drainageFile.push(file);
            this.files.push(file);
        },
        uploadPeopleDistributionFile(file) {

        },
        submitTask(onSuccess) {
            console.log(this.type, this.infectionModel);

            if (this.city.length === 0)
                return this.$message.error("请选择城市");
            /* if (this.foundationDataFiles.length === 0)
                return this.$message.error("请上传城市基础数据"); */
            let totalSize = 0;

            if (this.type === "flood" || (this.type === "infection" && this.infectionModel == "gamma")) {
                if (this.roadFiles.length === 0)
                    return this.$message.error("请上传路网数据");
                if (this.buildingFiles.length === 0)
                    return this.$message.error("请上传建筑物数据");
                if (this.demFiles.length === 0)
                    return this.$message.error("请上传高程数据");
                this.roadFiles.forEach((file) => {
                    totalSize += file.size;
                });
                this.buildingFiles.forEach((file) => {
                    totalSize += file.size;
                });
                this.demFiles.forEach((file) => {
                    totalSize += file.size;
                });
            }

            if (this.type === "flood") {
                if (this.waterFiles.length === 0)
                    return this.$message.error("请上传水文数据");
                this.waterFiles.forEach((file) => {
                    totalSize += file.size;
                });

                if (totalSize >= 1073741824) {
                    this.$message.error("上传文件总大小不能超过1GB");
                    return;
                }
                if (
                    Number(this.floodParam["Movement direction"]) > 360 ||
                    Number(this.floodParam["Movement direction"]) < 0
                ) {
                    return this.$message.error("移动方向必须在0-360之间");
                }
                if (
                    Number(this.floodParam["Diffusion rate"]) > 1 ||
                    Number(this.floodParam["Diffusion rate"]) < 0
                ) {
                    return this.$message.error("扩散速率必须在0-1之间");
                }
                if (Number(this.floodParam["InitX"]) < 0) {
                    return this.$message.error("初始降雨中心点X坐标必须大于0");
                }
                if (Number(this.floodParam["InitY"]) < 0) {
                    return this.$message.error("初始降雨中心点Y坐标必须大于0");
                }
                if (Number(this.floodParam["Radius"]) < 0) {
                    return this.$message.error("降雨半径必须大于0");
                }
                if (Number(this.floodParam["Movement speed"]) < 0) {
                    return this.$message.error("移动速度必须大于0");
                }
                if (Number(this.floodParam["Rainfall per hour"]) < 0) {
                    return this.$message.error("每小时降雨量必须大于0");
                }

                this.$emit("changeData", {
                    type: this.type,
                    infectionModel: this.infectionModel,
                    city: this.city,
                    CityPeople: Number(this.CityPeople),
                    CityArea: Number(this.CityArea),
                    AreaDirtyThing: Number(this.AreaDirtyThing),
                    params: this.floodParam,
                    foundationDataFiles: this.foundationDataFiles,
                    hasOD: this.odFiles.length > 0,
                });

                const loading = this.$loading({
                    lock: true,
                    text: "数据上传中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });

                let formData = new FormData();
                // formData重复的往一个值添加数据并不会被覆盖掉，可以全部接收到，可以通过formData.getAll('files')来查看所有插入的数据
                for (let i = 0; i < this.files.length; i++) {
                    formData.append("files", this.files[i].raw);
                }
                formData.append("type", this.type);
                formData.append("area", this.city[1]);
                formData.append(
                    "disturbance",
                    JSON.stringify(
                        this.floodParam
                    )
                );
                let url = serverInfo.baseURL + "/simulation/simulator";
                let headers = {
                    "Content-Type": "multipart/form-data",
                };
                axios
                    .post(url, formData, { headers: headers })
                    .then((res) => {
                        loading.close();
                        this.$message({
                            message: "数据上传成功",
                            type: "success",
                        });
                        this.submitMeasure(onSuccess);
                        this.uploadResilence();
                    })
                    .catch((err) => {
                        console.log(err);
                        loading.close();
                        this.$message({
                            message: "数据上传失败",
                            type: "error",
                        });
                    });


            } else {
                if (totalSize >= 1073741824) {
                    this.$message.error("上传文件总大小不能超过1GB");
                    return;
                }
                if (Number(this.infectionParamGamma["Population"]) < 0) {
                    return this.$message.error("人口总数必须大于0");
                }
                if (Number(this.infectionParamGamma["Initial Infection"]) < 0) {
                    return this.$message.error("初始感染人数必须大于0");
                }
                if (Number(this.infectionParamGamma["Crowd Speed"]) < 0) {
                    return this.$message.error("人群移速必须大于0");
                }
                if (Number(this.infectionParamGamma["Infectious Range"]) < 0) {
                    return this.$message.error("可感染范围必须大于0");
                }

                this.$emit("changeData", {
                    type: this.type,
                    infectionModel: this.infectionModel,
                    city: this.city,
                    CityPeople: Number(this.CityPeople),
                    CityArea: Number(this.CityArea),
                    AreaDirtyThing: Number(this.AreaDirtyThing),
                    params: this.infectionParamGamma,
                    foundationDataFiles: this.foundationDataFiles,
                    hasOD: this.odFiles.length > 0,
                });

                const loading = this.$loading({
                    lock: true,
                    text: "数据上传中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });

                let formData = new FormData();
                // formData重复的往一个值添加数据并不会被覆盖掉，可以全部接收到，可以通过formData.getAll('files')来查看所有插入的数据
                for (let i = 0; i < this.files.length; i++) {
                    formData.append("files", this.files[i].raw);
                }
                formData.append("type", this.type);
                formData.append("area", this.city[1]);
                formData.append(
                    "disturbance",
                    JSON.stringify(
                        this.infectionParamGamma
                    )
                );
                let url = serverInfo.baseURL + "/simulation/simulator";
                let headers = {
                    "Content-Type": "multipart/form-data",
                };
                axios
                    .post(url, formData, { headers: headers })
                    .then((res) => {
                        loading.close();
                        this.$message({
                            message: "数据上传成功",
                            type: "success",
                        });
                        this.submitMeasure(onSuccess);
                    })
                    .catch((err) => {
                        console.log(err);
                        loading.close();
                        this.$message({
                            message: "数据上传失败",
                            type: "error",
                        });
                    });

            }
        },
        submitMeasure(onSuccess) {
            if (this.hospitalFiles.length > 0) {
                this.$emit("changeHospitalData", true);
                const loading = this.$loading({
                    lock: true,
                    text: "测度功能数据上传中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                let formData = new FormData();
                console.log("RoadFiles:", this.roadFiles.length);
                console.log("HospitalFiles:", this.hospitalFiles.length);
                for (let i = 0; i < this.roadFiles.length; i++) {
                    formData.append("files", this.roadFiles[i].raw);
                }
                for (let i = 0; i < this.hospitalFiles.length; i++) {
                    formData.append("files", this.hospitalFiles[i].raw);
                }
                formData.append("city", this.city[1]);

                let url = serverInfo.baseURL + "/measure/uploadFile";
                let headers = {
                    "Content-Type": "multipart/form-data",
                };
                axios
                    .post(url, formData, { headers: headers })
                    .then((res) => {
                        loading.close();
                        this.$message({
                            message: "测度功能数据上传成功",
                            type: "success",
                        });
                        onSuccess();
                    })
                    .catch((err) => {
                        console.log(err);
                        loading.close();
                        this.$message({
                            message: "测度功能数据上传失败",
                            type: "error",
                        });
                    });

            }
            else {
                onSuccess();
            }
        },
        uploadResilence() {
            let formData = new FormData();
            formData.append("cityname", this.city[1]);
            for (let i = 0; i < this.buildingFiles.length; i++) {
                formData.append("files", this.buildingFiles[i].raw);
            }

            let url = serverInfo.baseURL_resilience + "/upload";
            let headers = {
                "Content-Type": "multipart/form-data",
            };
            axios
                .post(url, formData, { headers: headers })
                .then((res) => {
                    if (res.data.status) {
                        this.$message({
                            message: res.data.msg,
                            type: "success",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$message({
                        message: "生成城市肌理韧性计算任务失败",
                        type: "error",
                    });
                });
        },
    }
};
</script>
<style lang="scss" scoped>
.panel {
    .description {
        text-align: center;

        p {
            margin: 0;
            margin-left: 10px;
        }
    }

    .data-card {

        .card-header {
            text-align: center;
            font-weight: bold;
            font-size: large;
            color: #333;
        }
    }
}

.helpTitle {
    text-align: center;
    font-weight: bold;
    font-size: large;
    margin: 5px 0;
}

.el-icon-question:hover {
    cursor: pointer;
}
</style>