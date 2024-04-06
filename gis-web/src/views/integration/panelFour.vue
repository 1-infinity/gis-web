<template>
    <div class="panel">
        <el-card class="list-card">
            <span class="list-title">输入数据预览：</span>
            <el-checkbox class="readOnly" v-model="dataCheck.city">城市</el-checkbox>
            <el-checkbox class="readOnly" v-model="dataCheck.foundData">城市基础数据</el-checkbox>
            <el-checkbox class="readOnly" v-model="dataCheck.simuData">情景模拟数据</el-checkbox>
            <el-checkbox class="readOnly" v-model="dataCheck.od">交通出行量数据</el-checkbox>
        </el-card>
        <el-collapse @change="onCollapseChange">
            <el-collapse-item>
                <template slot="title">
                    <span class="collapse-simulatorValue">
                        <i class="collapse-icon el-icon-document"></i><span class="collapse-title">城市模拟评分</span>
                    </span>
                </template>
                <simulatorValue :selectedCity="taskData.city" :cityfoundDataFiles="taskData.foundationDataFiles"
                :people="taskData.CityPeople" :area="taskData.CityArea" :dirtything="taskData.AreaDirtyThing" />
            </el-collapse-item>
            <el-collapse-item name="trafficMeasure">
                <template slot="title">
                    <span class="collapse-traffic">
                        <i class="collapse-icon el-icon-document"></i><span class="collapse-title">交通测度</span>
                    </span>
                </template>
                <div id="measureChart" class="chart" v-loading="chartLoading"></div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import axios from "axios";
import serverInfo from '@/views/simulator/serverInfo';

import 'intro.js/introjs.css';
import introJs from 'intro.js';

import simulatorValue from '@/views/evaluate/simulatorValue.vue';

import * as echarts from 'echarts';
import echartTheme from '@/assets/echartTheme.json';

// 绘制交通韧性折线图
const buildChart = async (bindThis) => {
    const that = bindThis;

    echarts.registerTheme('customed', echartTheme);
    that.myChart = echarts.init(document.getElementById('measureChart'), 'customed');
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
    name: "panelFour",
    components: {
        simulatorValue
    },
    data() {
        return {
            dataCheck: {
                city: false,
                foundData: false,
                simuData: false,
                od: false,
            },
            resilenceData: [],
            chartLoading: true,
        };
    },
    props: {
        taskData: {
            type: Object,
        },
        currentTask: {
            type: Object,
        },
    },
    created() { },
    mounted() {
        this.checkData();
        this.introduction();
    },
    methods: {
        onCollapseChange(activeNames) {
            if (activeNames.includes("trafficMeasure")) {
                this.onDisplayChart();
            }
        },
        checkData() {
            this.dataCheck.city = "city" in this.taskData;
            this.dataCheck.foundData = "foundationDataFiles" in this.taskData
                && this.taskData.foundationDataFiles.length > 0;
            this.dataCheck.simuData = "type" in this.taskData;
            this.dataCheck.od = this.taskData.hasOD;
        },
        introduction() {
            introJs().setOptions({
                nextLabel: '下一步',
                prevLabel: '上一步',
                doneLabel: '完成',
                dontShowAgainLabel: '下次不再显示',
                steps: [{
                    intro: '欢迎来到<strong>模拟评分</strong>界面！'
                },
                {
                    intro: '查看<strong>城市模拟评分</strong>',
                    element: document.querySelector('.collapse-simulatorValue'),
                },
                {
                    intro: '完成<strong>模拟评分</strong>',
                    element: document.querySelector('.dialog5 .dialog-footer button:nth-of-type(2)'),
                },
                ]
            }).start();
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
            formData.append("id", this.currentTask.id);
            formData.append("city", this.currentTask.simulationArea);

            let url = serverInfo.baseURL_measure + "/measure/resilence";
            let headers = {
                "Content-Type": "multipart/form-data",
            };
            axios
                .post(url, formData, { headers: headers })
                .then((res) => {
                    if (res.data.success) {
                        let obj = this.parseMeasureData(res.data.data);
                        this.resilenceData = Object.values(obj);
                        if (this.resilenceData.length < 6) {
                            this.$message({
                                message: "交通韧性测度还在计算中",
                                type: "warning",
                            });
                            this.chartLoading = true;
                        }
                        else {
                            buildChart(this);
                            this.chartLoading = false;
                        }

                    }
                    else {
                        this.$message({
                            message: res.data.errorMsg,
                            type: "warning",
                        });
                        this.chartLoading = true;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$message({
                        message: "获取交通韧性测度失败",
                        type: "error",
                    });
                    this.chartLoading = true;
                });


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

.chart {
    width: 85vw;
    height: 60vh;
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s;
}
</style>