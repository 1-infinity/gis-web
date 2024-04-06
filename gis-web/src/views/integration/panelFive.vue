<template>
    <div class="panel">
        <el-card class="list-card">
            <span class="list-title">输入数据预览：</span>
            <el-checkbox class="readOnly" v-model="dataCheck.city">城市</el-checkbox>
            <el-checkbox class="readOnly" v-model="dataCheck.decision">规划决策数据</el-checkbox>
        </el-card>
        <el-collapse @change="onCollapseChange">
            <el-collapse-item>
                <template slot="title">
                    <span class="collapse-coverage">
                        <i class="collapse-icon el-icon-s-opportunity"></i><span class="collapse-title">规划决策方案</span>
                    </span>
                </template>
                <coverage />
            </el-collapse-item>
            <el-collapse-item>
                <template slot="title">
                    <span class="collapse-decisions">
                        <i class="collapse-icon el-icon-data-analysis"></i><span class="collapse-title">规划决策分析</span>
                    </span>
                </template>
                <decisions />
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import 'intro.js/introjs.css';
import introJs from 'intro.js';

import upload from '@/views/gis/upload.vue';
import coverage from '@/views/gis/coverage.vue';
import decisions from '@/views/decisions/index.vue';

export default {
    name: "panelFive",
    components: {
        upload, coverage, decisions
    },
    data() {
        return {
            dataCheck: {
                city: false,
                decision: false,
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
        this.introduction();
    },
    methods: {
        checkData() {
            this.dataCheck.city = "city" in this.taskData;
        },
        introduction() {
            introJs().setOptions({
                nextLabel: '下一步',
                prevLabel: '上一步',
                doneLabel: '完成',
                dontShowAgainLabel: '下次不再显示',
                steps: [{
                    intro: '欢迎来到<strong>辅助规划决策</strong>界面！'
                },
                {
                    intro: '查看<strong>规划决策优化</strong>',
                    element: document.querySelector('.collapse-coverage'),
                },
                {
                    intro: '查看<strong>规划决策分析</strong>',
                    element: document.querySelector('.collapse-decisions'),
                },
                {
                    intro: '完成<strong>辅助规划决策</strong>',
                    element: document.querySelector('.button-finish-plan'),
                },
                ]
            }).start();
        },
        onCollapseChange(activeNames) {
            var ev = new Event("resize");
            window.dispatchEvent(ev);
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
</style>
