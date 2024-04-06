<template>
    <div class="panel">
        <el-card class="list-card">
            <span class="list-title">输入数据预览：</span>
            <el-checkbox class="readOnly" v-model="dataCheck.city">城市</el-checkbox>
            <el-checkbox class="readOnly" v-model="dataCheck.simuData">情景模拟数据</el-checkbox>
            <el-checkbox class="readOnly" v-model="dataCheck.simuParam">灾害模拟数据</el-checkbox>
        </el-card>
        <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
                <template slot="title">
                    <i class="collapse-icon el-icon-s-order"></i><span class="collapse-title">当前推演任务</span>
                </template>
                <div class="task-info">
                    <div>
                        <div class="info-header">
                            <ul>
                                <li>
                                    <p>推演任务信息：</p>
                                </li>
                            </ul>
                        </div>
                        <div class="info-content">
                            <el-row>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            城市：
                                        </li>
                                    </ul>
                                    <p>{{ parseCity(taskData.city[1]) }}</p>
                                </el-col>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            灾害类型：
                                        </li>
                                    </ul>
                                    <p>{{ typeNames[taskData.type] }}</p>
                                </el-col>
                                <el-col :span="8" class="line" v-show="taskData.type == 'infection'">
                                    <ul type="circle" class="label">
                                        <li>
                                            模拟方式：
                                        </li>
                                    </ul>
                                    <p>{{ infectionModelNames[taskData.infectionModel] }}</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            序号：
                                        </li>
                                    </ul>
                                    <p>{{ currentTask.id }}</p>
                                </el-col>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            提交时间：
                                        </li>
                                    </ul>
                                    <p>{{ currentTask.simulationDate }}</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            状态：
                                        </li>
                                    </ul>
                                    <p>{{ stateNames[currentTask.simulationState] }}</p>
                                </el-col>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            模拟计算时间：
                                        </li>
                                    </ul>
                                    <p>{{ currentTask.simulationTime }}</p>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div>
                        <div class="info-header">
                            <ul>
                                <li>
                                    <p>推演任务参数：</p>
                                </li>
                            </ul>
                        </div>
                        <div class="info-content" v-show="taskData.type == 'flood'">
                            <el-row>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            初始降雨中心点X坐标：
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['InitX'] }}</p>
                                </el-col>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            初始降雨中心点Y坐标：
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['InitY'] }}</p>
                                </el-col>

                            </el-row>
                            <el-row>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            降雨半径：
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['Radius'] }}</p>
                                </el-col>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            移动方向：
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['Movement direction'] }}</p>
                                </el-col>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            移动速度：
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['Movement speed'] }}</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            每小时降雨量：
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['Rainfall per hour'] }}</p>
                                </el-col>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            水流扩散速率：
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['Diffusion rate'] }}</p>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="info-content" v-show="taskData.type == 'infection'">
                            <el-row>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            人口总数:
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['Population'] }}</p>
                                </el-col>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            初始感染人数:
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['Initial Infection'] }}</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            人群移速:
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['Population'] }}</p>
                                </el-col>
                                <el-col :span="8" class="line">
                                    <ul type="circle" class="label">
                                        <li>
                                            可感染范围:
                                        </li>
                                    </ul>
                                    <p>{{ taskData.params['Infectious Range'] }}</p>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="task-control">
                        <el-button size="small" @click="showResult" round>查看结果</el-button>
                        <el-button size="small" @click="updateTask" round>
                            更新状态
                        </el-button>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    <i class="collapse-icon el-icon-s-order"></i><span class="collapse-title">历史推演任务列表</span>
                </template>
                <el-table :data="tableData">
                    <el-table-column label="序号" prop="id" :show-overflow-tooltip="true" width="80" />
                    <el-table-column label="位置" prop="simulationArea" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ parseCity(scope.row.simulationArea) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" prop="simulationType" :show-overflow-tooltip="true" width="80">
                        <template slot-scope="scope">
                            <span>{{ typeNames[scope.row.simulationType] }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="时间" align="center" width="200" prop="simulationDate">
                        <template slot-scope="scope">
                            <span>{{ scope.row.simulationDate }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="状态" align="center" width="200" prop="simulationDate">
                        <template slot-scope="scope">
                            <i class="el-icon-loading" v-if="scope.row.simulationState === 'processing'"></i>
                            <i class="el-icon-success" v-if="scope.row.simulationState === 'finish'"
                                style="color: green"></i>
                        </template>
                    </el-table-column>

                    <el-table-column label="模拟计算时间" align="center" width="180" prop="simulationDate">
                        <template slot-scope="scope">
                            <span>{{ scope.row.simulationTime }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-set-up"
                                :disabled="scope.row.simulationState !== 'finish'" @click="clickTask(scope.row)">查看
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>


        <el-drawer :title="drawType == 'flood' ? '暴雨灾害模拟结果' : '疫情模拟结果'" :visible.sync="drawer" :modal="false" size="78%">
            <flodsimulation :type="drawType" :status="status" :metric="metric" :idSuffix="'-deduce'"
                v-show="drawType == 'flood'" />
            <infectionSimulation :type="drawType" :infectionModel="infectionModel" :status="status" :idSuffix="'-deduce'"
                v-show="drawType == 'infection'" />
        </el-drawer>
    </div>
</template>
<script>
import 'intro.js/introjs.css';
import introJs from 'intro.js';

import ajax from "@/views/simulator/ajax";
import flodsimulation from "@/views/simulator/components/flood/disasterSimulator-ol.vue";
import infectionSimulation from "@/views/simulator/components/infection/infectionSimulation-ol.vue";

export default {
    name: "panelSix",
    components: { flodsimulation, infectionSimulation },
    data() {
        return {
            activeNames: ['1'],

            type: "flood",
            drawType: "flood",
            infectionModel: "gamma",
            typeNames: {
                'flood': '暴雨',
                'infection': '疫情',
            },
            infectionModelNames: {
                'seir': 'SEIR模拟',
                'gamma': '传染病空间模拟',
            },
            stateNames: {
                'processing': '模拟中',
                'finish': '已完成',
            },
            tableData: [],
            currentTask: {},
            status: {},
            metric: {},
            drawer: false,

            dataCheck: {
                city: false,
                simuData: false,
                simuParam: false,
            },
        };
    },
    props: {
        taskData: {
            type: Object,
        },
    },
    created() { },
    mounted() {
        this.checkData();
        this.getTaskList();
        this.introduction();
    },
    methods: {
        checkData() {
            console.log(this.taskData);
            this.dataCheck.city = "city" in this.taskData;
            this.dataCheck.simuData = "type" in this.taskData;
            this.dataCheck.simuParam = "params" in this.taskData;
        },
        introduction() {
            introJs().setOptions({
                nextLabel: '下一步',
                prevLabel: '上一步',
                doneLabel: '完成',
                dontShowAgainLabel: '下次不再显示',
                steps: [{
                    intro: '欢迎来到<strong>方案推演</strong>界面！'
                },
                {
                    intro: '查看<strong>当前模拟任务</strong>信息',
                    element: document.querySelector('.dialog7 .task-info'),
                },
                {
                    intro: '查看<strong>模拟结果</strong>',
                    element: document.querySelector('.dialog7 .task-control button:nth-of-type(1)'),
                },
                {
                    intro: '完成<strong>方案推演</strong>',
                    element: document.querySelector('.dialog7 .dialog-footer button:nth-of-type(2)'),
                },
                ]
            }).start();
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
        getTaskList() {
            ajax("/simulation/processes")
                .then((res) => {
                    this.tableData = res.map((r) => {
                        let simulationTime;
                        if (r.simulationState === 'processing') {
                            simulationTime = "计算中";
                        }
                        else {
                            simulationTime = (parseInt(r.simulationTime) / 1000).toString() + " 秒";
                        }
                        return {
                            ...r,
                            simulationDate: new Date(r.simulationDate).toLocaleString(),
                            simulationTime: simulationTime,
                        };
                    });
                    this.tableData.sort((a, b) => { return a.id - b.id });
                    let tableDataFilter = [];
                    this.tableData.forEach((item) => {
                        if (item.isNewSimulation === "true") {
                            tableDataFilter.push(item);
                        }
                    });
                    this.tableData = tableDataFilter;
                    this.$message({
                        message: "获取任务列表成功",
                        type: "success",
                    });
                    this.getCurrentTask();
                })
                .catch((err) => {
                    console.log(err, 11);
                    if (err.message.indexOf("timeout") !== -1) {
                        this.$message({
                            message: "获取任务列表失败",
                            type: "error",
                        });
                    }
                });
        },
        getCurrentTask() {
            for (let i = this.tableData.length - 1; i >= 0; i--) {
                if (this.tableData[i]["simulationType"] == this.taskData.type) {
                    this.currentTask = this.tableData[i];
                    break;
                }
            }
        },
        async clickTask(task) {

            this.drawType = task.simulationType;

            const loading = this.$loading({
                lock: true,
                text: "获取模拟任务数据中",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            console.log("SimulationType:", task.simulationType);
            console.log("Task:", task);

            if (task.simulationType === "flood") {

                const resultTypes = ["submergedcells", "availableroads", "dangerousroads"];
                const times = ["4", "8", "12", "16", "20", "24"];
                let resCount = 0, resultLens = {};
                resultTypes.forEach((resultType) => {
                    resultLens[resultType] = {};
                    times.forEach(async (time) => {
                        try {
                            let len = await ajax(`information/simulation/length/${task.id}/${resultType}/${time}`);
                            resultLens[resultType][`${time}`] = len;
                            console.log(`获取模拟数据 ${resultType}:${time} 成功！`);
                        }
                        catch {
                            console.log(`获取模拟数据 ${resultType}:${time} 失败！`);
                        }
                        finally {
                            resCount++;
                            //所有请求结束
                            if (resCount >= resultTypes.length * times.length) {
                                this.status = {
                                    resultLens: resultLens,
                                    date: task.simulationDate,
                                    area: task.simulationArea,
                                    id: task.id,
                                    computeTime: task.simulationTime,
                                };
                                this.$message({
                                    message: "获取模拟任务数据完成",
                                    type: "success",
                                });
                                loading.close();
                                this.drawer = true;
                            }
                        }
                    });
                });


            }
            else {
                this.infectionModel = "gamma";
                const times = ["0", "12", "24", "36", "48", "60", "72"];
                let resCount = 0, resultLens = {};
                times.forEach(async (time) => {
                    try {
                        let len = await ajax(`/information/simulation/length/${task.id}/infectcells/${time}`);
                        resultLens[`${time}`] = len;
                        console.log(`获取模拟数据 infectcells:${time} 成功！`);
                    }
                    catch {
                        console.log(`获取模拟数据 infectcells:${time} 失败！`);
                    }
                    finally {
                        resCount++;
                        //所有请求结束
                        if (resCount >= times.length) {
                            this.status = {
                                resultLens: {
                                    "infectcells": resultLens,
                                },
                                date: task.simulationDate,
                                area: task.simulationArea,
                                id: task.id,
                                computeTime: task.simulationTime,
                            };
                            this.$message({
                                message: "获取模拟任务数据完成",
                                type: "success",
                            });
                            loading.close();
                            this.drawer = true;
                        }
                    }
                });

            }


        },
        updateTask() {
            this.getTaskList();
            this.$message({
                message: "更新任务状态成功",
                type: "success",
            });
        },
        showResult() {
            if (this.currentTask.simulationState == "processing") {
                this.$message({
                    message: "当前任务还在模拟中！",
                    type: "warning",
                });
            }
            else {
                this.clickTask(this.currentTask);
            }
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

.task-info {
    .info-header {
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }

    .info-content {
        margin: 0 50px;
        padding: 10px 20px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }

    .line {
        display: flex;
        flex-direction: row;
        align-items: center;

        p {
            font-size: 14px;
            color: #333;
            margin: 5px 0;
        }

        .label {
            margin: 0;
            padding: 0;
            padding-left: 20px;
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }
    }

    .task-control {
        margin-top: 20px;
        text-align: center;
    }
}
</style>