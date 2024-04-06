<template>
    <div class="app-container">
        <div class="canvas">
            <div class="left">
                <!-- <el-button type="primary" size="small" @click.native="$emit('goBackHome')"><i class="el-icon-back">返回首页</i>
                </el-button> -->
                <el-button size="small" @click.native="introduction"><i class="el-icon-question">帮助</i>
                </el-button>
            </div>
            <!-- 流程图 -->
            <div class="flow-container">
                <a name="row1"></a>
                <el-row class="row" type="flex" justify="center">
                    <el-col :span="6">
                        <el-card :class="{ 'carousel-card': true, 'card-focus': cardFocus.one }">
                            <div class="clearfix">
                                <p>基础资料输入</p>
                            </div>
                            <el-divider></el-divider>
                            <img class="card-img" src="@/assets/home/integration2.jpg" alt="" />
                            <div class="control">
                                <el-button type="primary" size="small" @click="onStepOne" round>开始输入</el-button>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <a name="row2"></a>

                <el-row class="row" type="flex" justify="center">
                    <el-col :span="2">
                        <div class="imgCol">
                            <img class="arrowSlant" src="@/assets/icons/arrowLeftDown.png" />
                        </div>
                    </el-col>
                    <el-col :span="4">
                    </el-col>
                    <el-col :span="2">
                        <div class="imgCol">
                            <img class="arrowSlant" src="@/assets/icons/arrowRightDown.png" />
                        </div>
                    </el-col>
                </el-row>

                <el-row class="row" type="flex" justify="center">
                    <el-col :span="6">
                        <el-card :class="{ 'carousel-card': true, 'card-focus': cardFocus.two }">
                            <div class="clearfix">
                                <p>现状评分</p>
                            </div>
                            <el-divider></el-divider>
                            <img class="card-img" src="@/assets/home/integration3.jpg" alt="" />
                            <div class="control">
                                <el-button type="primary" size="small" @click="onStepTwo" :disabled="!stepDisplay.two"
                                    round>查看评分</el-button>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                    </el-col>
                    <el-col :span="6">
                        <el-card :class="{ 'carousel-card': true, 'card-focus': cardFocus.three }">
                            <div class="clearfix">
                                <p>基于情景模拟的风险预测</p>
                            </div>
                            <el-divider></el-divider>
                            <img class="card-img" src="@/assets/home/integration4.jpg" alt="" />
                            <div class="control">
                                <el-button type="primary" size="small" @click="onStepThree" :disabled="!stepDisplay.three"
                                    round>查看结果</el-button>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <a name="row3"></a>

                <el-row class="row" type="flex" justify="center">
                    <el-col :span="6">
                    </el-col>
                    <el-col :span="2">
                        <div class="imgCol">
                            <img class="arrowVertical" src="@/assets/icons/arrowUpDown.png" />
                        </div>
                    </el-col>
                    <el-col :span="3">
                    </el-col>
                    <el-col :span="2">
                        <div class="imgCol">
                            <img class="arrowSlant" src="@/assets/icons/arrowLeftDown.png" />
                        </div>
                    </el-col>
                    <el-col :span="11">
                    </el-col>
                </el-row>

                <el-row class="row" type="flex" justify="center">
                    <el-col :span="6">
                        <el-card :class="{ 'carousel-card': true, 'card-focus': cardFocus.four }">
                            <div class="clearfix">
                                <p>模拟评分</p>
                            </div>
                            <el-divider></el-divider>
                            <img class="card-img" src="@/assets/home/integration3.jpg" alt="" />
                            <div class="control">
                                <el-button type="primary" size="small" @click="onStepFour" :disabled="!stepDisplay.four"
                                    round>查看评分</el-button>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <Transition name="fade">
                            <div class="imgCol">
                                <img class="arrow" src="@/assets/icons/arrowRight.png" />
                            </div>
                        </Transition>
                    </el-col>
                    <el-col :span="6">
                        <el-card :class="{ 'carousel-card': true, 'card-focus': cardFocus.five }">
                            <div class="clearfix">
                                <p>辅助规划决策</p>
                            </div>
                            <el-divider></el-divider>
                            <img class="card-img" src="@/assets/home/integration5.jpg" alt="" />
                            <div class="control">
                                <el-button type="primary" size="small" @click="onStepFive" :disabled="!stepDisplay.five"
                                    round>查看决策</el-button>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <a name="row4"></a>

                <el-row class="row" type="flex" justify="center">
                    <el-col :span="2">
                        <div class="imgCol">
                            <img class="arrowSlant" src="@/assets/icons/arrowLeftUp.png" />
                        </div>
                    </el-col>
                    <el-col :span="4">
                    </el-col>
                    <el-col :span="2">
                        <div class="imgCol">
                            <img class="arrowSlant" src="@/assets/icons/arrowLeftDown.png" />
                        </div>
                    </el-col>
                </el-row>

                <el-row class="row" type="flex" justify="center">
                    <el-col :span="6">
                        <el-card :class="{ 'carousel-card': true, 'card-focus': cardFocus.six }">
                            <div class="clearfix">
                                <p>基于情景模拟的方案推演</p>
                            </div>
                            <el-divider></el-divider>
                            <img class="card-img" src="@/assets/home/integration4.jpg" alt="" />
                            <div class="control">
                                <el-button type="primary" size="small" @click="onStepSix" :disabled="!stepDisplay.six"
                                    round>查看结果</el-button>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>

            <div id="dialogs">
                <el-dialog class="dialog1" :visible.sync="dialogVisible.zero" width="90%" center>
                    <span slot="title" class="dialog-title">韧性城市智能规划流程</span>
                    <img src="@/assets/home/integration1.jpg" alt="" style="width:90%;margin:0 5%;" />
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible.zero = false">取消</el-button>
                    </span>
                </el-dialog>
                <el-dialog class="dialog2" title="基础资料输入" :visible.sync="dialogVisible.one" width="90%" center>
                    <span slot="title" class="dialog-title">基础资料输入 <el-link><i class="el-icon-question"
                                @click="onHelpClick(1)"></i> </el-link></span>
                    <panelOne ref="panelOne" @changeData="changeSimulationData" @changeHospitalData="changeHospitalData" />
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible.one = false">取消</el-button>
                        <el-button type="primary" @click="onDataSumbit">提交</el-button>
                    </span>
                </el-dialog>
                <el-dialog class="dialog3" title="现状评分" :visible.sync="dialogVisible.two" width="90%" center>
                    <span slot="title" class="dialog-title">现状评分<el-link><i class="el-icon-question"
                                @click="onHelpClick(2)"></i> </el-link></span>
                    <panelTwo ref="panelTwo" :taskData="simulationData" :hasHospital="hasHospital" />
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible.two = false">取消</el-button>
                        <el-button type="primary" @click="onCurrEvaluateFinish">完成</el-button>
                    </span>
                </el-dialog>
                <el-dialog class="dialog4" title="基于情景模拟的风险预测" :visible.sync="dialogVisible.three" width="90%" center>
                    <span slot="title" class="dialog-title">基于情景模拟的风险预测<el-link><i class="el-icon-question"
                                @click="onHelpClick(3)"></i> </el-link></span>
                    <panelThree ref="panelThree" @changeCurrentTask="changeCurrentTask" :taskData="simulationData" />
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible.three = false">取消</el-button>
                        <el-button type="primary" @click="onRiskFinish">完成</el-button>
                    </span>
                </el-dialog>
                <el-dialog class="dialog5" title="模拟评分" :visible.sync="dialogVisible.four" width="90%" center>
                    <span slot="title" class="dialog-title">模拟评分<el-link><i class="el-icon-question"
                                @click="onHelpClick(4)"></i> </el-link></span>
                    <panelFour ref="panelFour" :taskData="simulationData" :currentTask="currentTask" />
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible.four = false">取消</el-button>
                        <el-button type="primary" @click="onSimuEvaluateFinish">完成</el-button>
                    </span>
                </el-dialog>
                <el-dialog class="dialog6" title="辅助规划决策" :visible.sync="dialogVisible.five" width="90%" center>
                    <span slot="title" class="dialog-title">辅助规划决策<el-link><i class="el-icon-question"
                                @click="onHelpClick(5)"></i> </el-link></span>
                    <panelFive ref="panelFive" :taskData="simulationData" />
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible.five = false">取消</el-button>
                        <el-button class="button-finish-plan" type="primary" @click="onPlanFinish">完成</el-button>
                    </span>
                </el-dialog>
                <el-dialog class="dialog7" title="基于情景模拟预测的推演" :visible.sync="dialogVisible.six" width="90%" center>
                    <span slot="title" class="dialog-title">基于情景模拟的方案推演<el-link><i class="el-icon-question"
                                @click="onHelpClick(6)"></i> </el-link></span>
                    <panelSix ref="panelSix" :taskData="simulationData" />
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible.six = false">取消</el-button>
                        <el-button type="primary" @click="onSimulationFinish">完成</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import 'intro.js/introjs.css';
import introJs from 'intro.js';

import panelOne from './panelOne.vue';
import panelTwo from './panelTwo.vue';
import panelThree from './panelThree.vue';
import panelFour from './panelFour.vue';
import panelFive from './panelFive.vue';
import panelSix from './panelSix.vue';


export default {
    name: "integrationCanvas",
    props: [""],
    components: {
        panelOne, panelTwo, panelThree, panelFour, panelFive, panelSix,
    },
    data() {
        return {
            stepDisplay: {
                one: true,
                two: false,
                three: false,
                four: false,
                five: false,
                five: false,
                six: false,
            },
            dialogVisible: {
                zero: false,
                one: false,
                two: false,
                three: false,
                four: false,
                five: false,
                six: false,
            },
            cardFocus: {
                one: true,
                two: false,
                three: false,
                four: false,
                five: false,
                five: false,
                six: false,
            },
            simulationData: null,
            currentTask: null,
            hasHospital: false,
        };
    },
    created() { },
    mounted() {
    },
    methods: {
        goIn() {
            this.introduction();
        },
        introduction() {
            introJs().setOptions({
                nextLabel: '下一步',
                prevLabel: '上一步',
                doneLabel: '完成',
                dontShowAgainLabel: '下次不再显示',
                steps: [{
                    intro: '欢迎来到韧性城市智能规划平台！'
                },
                {
                    intro: '点击查看<strong>韧性城市智能规划</strong>流程',
                    element: document.querySelector('.control .el-button'),
                },
                {
                    intro: '点击输入<strong>基础资料</strong>数据',
                    element: document.querySelector('.el-carousel__item:nth-of-type(2) .control .el-button'),
                },
                ]
            }).start();
        },
        onStepZero() {
            this.dialogVisible.zero = true;
        },
        onStepOne() {
            this.dialogVisible.one = true;
        },
        onStepTwo() {
            if (!this.stepDisplay.two) {
                this.$message({
                    message: "请先完成基础资料输入！",
                    type: "error",
                });
                return;
            }
            this.dialogVisible.two = true;
            if (this.$refs.panelTwo) {
                this.$refs.panelTwo.checkData();
            }
        },
        onStepThree() {
            if (!this.stepDisplay.three) {
                this.$message({
                    message: "请先完成基础资料输入！",
                    type: "error",
                });
                return;
            }
            this.dialogVisible.three = true;
            if (this.$refs.panelThree) {
                this.$refs.panelThree.checkData();
            }
        },
        onStepFour() {
            if (!this.stepDisplay.four) {
                this.$message({
                    message: "请先完成风险预测！",
                    type: "error",
                });
                return;
            }
            this.dialogVisible.four = true;
            if (this.$refs.panelFour) {
                this.$refs.panelFour.checkData();
            }
        },
        onStepFive() {
            if (!this.stepDisplay.five) {
                this.$message({
                    message: "请先完成风险发现！",
                    type: "error",
                });
                return;
            }
            this.dialogVisible.five = true;
            if (this.$refs.panelFive) {
                this.$refs.panelFive.checkData();
            }
        },
        onStepSix() {
            if (!this.stepDisplay.six) {
                this.$message({
                    message: "请先完成规划决策！",
                    type: "error",
                });
                return;
            }
            this.dialogVisible.six = true;
            if (this.$refs.panelSix) {
                this.$refs.panelSix.checkData();
            }
        },

        // 提交数据
        onDataSumbit() {
            this.$refs.panelOne.submitTask(() => {
                this.stepDisplay.two = true;
                this.stepDisplay.three = true;
                this.dialogVisible.one = false;
                this.cardFocus.one = false;
                this.cardFocus.two = true;
                this.cardFocus.three = true;
            });
            // this.stepDisplay.two = true;
            // this.stepDisplay.three = true;
            // this.dialogVisible.one = false;
            // this.cardFocus.one = false;
            // this.cardFocus.two = true;
            // this.cardFocus.three = true;
            // this.changeSimulationData({
            //     type: "flood",
            //     infectionModel: "gamma",
            //     city: ["省会城市", "shanghai"],
            //     params: {
            //         InitX: "3000",
            //         InitY: "5000",
            //         Radius: "4000",
            //         "Movement direction": "0.0",
            //         "Movement speed": "200",
            //         "Rainfall per hour": "0.08",
            //         "Diffusion rate": "0.6",
            //         type: "flood",
            //         "Whether drainage facilities are used": "false",
            //     },
            //     foundationDataFiles: [ ],
            // });
            // this.$message({
            //     message: "仿真环境上传成功",
            //     type: "success",
            // });
        },
        // 完成现状评分
        onCurrEvaluateFinish() {
            let flag = this.$refs.panelTwo.assert_len();
            if (flag > 0) {
                this.$message({
                    message: '还有指标未评分',
                    type: 'warning'
                });
            }
            else {
                this.$refs.panelTwo.saveResults();
                this.$message({
                    message: "现状评分完成",
                    type: "success",
                });
                this.dialogVisible.two = false;
                this.cardFocus.two = false;
            }
        },
        // 完成风险预测
        onRiskFinish() {
            this.$message({
                message: "风险预测完成",
                type: "success",
            });
            // 提交推演任务
            if (!this.stepDisplay.six)
                this.$refs.panelThree.submitNewTask();
            this.stepDisplay.four = true;
            this.dialogVisible.three = false;
            if (this.cardFocus.three) {
                this.cardFocus.three = false;
                this.cardFocus.four = true;
            }
        },
        // 完成模拟评分
        onSimuEvaluateFinish() {
            this.$message({
                message: "模拟评分完成",
                type: "success",
            });
            this.stepDisplay.five = true;
            this.dialogVisible.four = false;
            if (this.cardFocus.four) {
                this.cardFocus.four = false;
                this.cardFocus.five = true;
            }
        },
        // 完成规划决策
        onPlanFinish() {
            this.$message({
                message: "规划决策完成",
                type: "success",
            });
            this.stepDisplay.six = true;
            this.dialogVisible.five = false;
            if (this.cardFocus.five) {
                this.cardFocus.five = false;
                this.cardFocus.six = true;
            }
        },
        // 完成模拟推演
        onSimulationFinish() {
            this.$message({
                message: "模拟推演完成",
                type: "success",
            });
            this.dialogVisible.six = false;
            this.cardFocus.six = false;
        },

        changeSimulationData(data) {
            this.simulationData = data;
        },
        changeCurrentTask(data) {
            this.currentTask = data;
        },
        changeHospitalData(data) {
            this.hasHospital = data;
        },

        onHelpClick(value) {
            switch (value) {
                case 1:
                    this.$refs.panelOne.introduction();
                    break;
                case 2:
                    this.$refs.panelTwo.introduction();
                    break;
                case 3:
                    this.$refs.panelThree.introduction();
                    break;
                case 4:
                    this.$refs.panelFour.introduction();
                    break;
                case 5:
                    this.$refs.panelFive.introduction();
                    break;
                case 6:
                    this.$refs.panelSix.introduction();
                    break;
            }
        },
    }
};
</script>
<style lang="scss" scoped>
.canvas {
    width: 100%;
    padding: 18px;

    .title {
        text-align: center;
        padding-top: 25px;
        font-size: 36px;
        font-family: Source Han Sans CN-Bold, Source Han Sans CN;
        font-weight: bold;
        color: #1f4e79;
    }

    .carousel-card {
        margin-top: 0;
        transition: .5s;
        text-align: center;

        .clearfix {
            text-align: center;
            font-size: large;
            font-family: Source Han Sans CN-Bold, Source Han Sans CN;
            font-weight: bold;
            color: #1f4e79;
            margin-top: 20px;

            p {
                margin: 0;
            }
        }

        .card-img {
            // width: 90%;
            height: 65%;
            max-width: 95%;
            box-shadow: 0 2px 10px 4px rgb(0 0 0 / 10%);
        }

        .control {
            margin-top: 20px;
        }
    }

    // .cards 
    .row {
        display: flex;
        align-items: center;


        .box-card {
            width: 20vw;
            height: auto;
            border-radius: 10px;
            transition: .5s;
            margin: auto;


            .clearfix {
                text-align: center;
                font-size: large;
                font-family: Source Han Sans CN-Bold, Source Han Sans CN;
                font-weight: bold;
                color: #1f4e79;

                p {
                    margin: 0;
                }
            }

            .cardContent {
                font-family: Source Han Sans CN-Bold, Source Han Sans CN;

                .control {
                    margin-top: 20px;
                    text-align: center;
                }

            }

        }

        .box-card:hover {
            box-shadow: 0 2px 12px 5px rgb(0 0 0 / 10%);
        }

        .box-card-big {
            width: 25vw;
        }

        .imgCol {
            text-align: center;
        }

        .arrow {
            width: 80px;
        }

        .arrowSlant {
            width: 60px;
            height: 50px;
            vertical-align: middle;
            margin-top: 10px;
        }

        .arrowVertical {
            width: 20px;
            height: 50px;
            margin-top: 10px;
        }
    }


}

.dialog-title {
    font-size: x-large;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #1f4e79;
}

.carousel-container {
    display: flex;
    flex-direction: row;
    align-items: center;

    .divider-vertical {
        height: 70vh;
        width: 1px;
        margin: 0 10px;
        // background-color: #333;
        border-right: 2px dashed #777;
    }

    .el-carousel {
        padding: 10px 0;
        width: 45vw;

        .el-carousel__container {
            .el-carousel__item {
                background-color: #fff;
                box-shadow: 0 2px 12px 5px rgb(0 0 0 / 10%);
            }
        }



    }
}

.card-focus {
    animation: bg 1.25s linear infinite;
    border: 2px solid rgb(1, 149, 208);
}

@keyframes bg {
    0% {
        border: 2px solid rgba(1, 149, 208, 1.0);
    }

    50% {
        border: 2px solid rgba(1, 149, 208, 0);
    }

    100% {
        border: 2px solid rgba(1, 149, 208, 1.0);
    }
}
</style>