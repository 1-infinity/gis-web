<template>
    <div class="container">
        <div :id="'aMap' + idSuffix" class="aMap"></div>
        <el-card class="table-container">
            <el-table :data="initInfectionList" height="500" size="mini" :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }">
                <el-table-column property="id" label="序号" width="50"></el-table-column>
                <el-table-column property="population" label="感染人数" width="120">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.population" style="width:100px;" :min="1" :max="20"
                            :precision="0" :step="1" size="mini"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column property="position" label="位置">
                    <template slot-scope="scope">
                        <span>{{
                            `[${scope.row.position[0].toFixed(3)},${scope.row.position[1].toFixed(3)}]`
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="50">
                    <template slot-scope="scope">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeInfection(scope.row)"
                            circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="line" style="margin-top:10px;">
                <span class="label">初始感染人数:</span>
                <el-input-number v-model="initInfectionPopulation" style="width:100px;" :min="1" :max="20" :precision="0" :step="1"
                    size="small"></el-input-number>
            </div>
            <div class="line" style="margin-top:10px;">
                <span class="label">修改初始感染点:</span>
                <el-button v-show="!infectionAdding" type="primary" size="small" @click="onAddInfection"
                    plain>添加</el-button>
                <el-button v-show="infectionAdding" type="warning" size="small" @click="onAddInfection" plain>完成</el-button>
                <el-button type="danger" size="small" @click="onClearInfection" plain>清空</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import * as mapUtils from "@/views/simulator/components/mapUtils";
import * as mapUtils2 from "@/views/application/mapUtils";


export default ({
    name: "infectionInput",
    props: {
        area: {
            type: Array,
        },
    },
    watch: {
        area() {
            this.onAreaChange();
        },
    },
    data() {
        return {
            idSuffix: "infectionInput",
            map: null,
            zoomLevel: 10,
            initInfectionList: [],              //初始感染点列表
            initInfectionPopulation: 10,                // 当前输入的初始感染人数
            infectionAdding: false,             //是否在添加初始感染点

            initInfectionLayer: null,        // 初始感染点图层
        }
    },
    mounted() {
        this.onAreaChange();
    },
    methods: {
        // 更新地图城市
        onAreaChange() {
            if (this.map) {
                this.map.setTarget(null);
                this.map = null;
            }
            mapUtils.initOL(this);
            let city = "guangzhou";
            if (this.area.length >= 2)
                city = this.area[1];
            mapUtils.initOLMap(this, city);

            this.initInfectionList = [];
            this.initInfectionLayer = null;
            this.infectionAdding = false;
            this.finishInitInfection();
        },
        // 删除初始感染点
        removeInfection(infection) {
            this.initInfectionLayer.source.removeFeature(infection.feature)
            this.initInfectionList.forEach(function (item, index, arr) {
                if (item.id == infection.id) {
                    arr.splice(index, 1)
                }
            })
        },
        // 添加初始感染点
        onAddInfection() {
            if (this.infectionAdding) {
                if (this.initInfectionLayer)           //删除绘制图层
                {
                    this.map.removeInteraction(this.initInfectionLayer.draw)
                }
            }
            else {
                if (!this.initInfectionLayer) {
                    mapUtils2.addInfectionAdding(this)
                }//添加绘制图层和形状图层
                else {
                    this.map.addInteraction(this.initInfectionLayer.draw)
                }  //添加绘制图层
            }
            this.infectionAdding = !this.infectionAdding;
        },
        // 清空初始感染点
        onClearInfection() {
            if (this.initInfectionLayer)           //删除绘制图层
            {
                this.map.removeInteraction(this.initInfectionLayer.draw);
                this.map.removeLayer(this.initInfectionLayer.vector);
            }
            this.initInfectionList = [];
            this.initInfectionLayer = null;
            this.infectionAdding = false;
            this.finishInitInfection();
        },
        finishInitInfection() {
            this.$emit("updateInitInfectionList", this.initInfectionList);
        },
    },
});
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.aMap {
    width: 100%;
    height: 70vh;
    font-family: "微软雅黑";
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s;
    background-color: black;
}

.table-container {
    margin-left: 10px;
    width: 550px;

    // 行
    .line {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .label {
        font-weight: bold;
        margin-right: 10px;
    }
}
</style>