<template>
    <div class="container">
        <div :id="'aMap' + idSuffix" class="aMap"></div>
        <el-card class="table-container">
            <el-table :data="lockInfectionList" height="500" size="mini" :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }">
                <el-table-column property="id" label="序号" width="50"></el-table-column>
                <el-table-column property="gid" label="网格序号" width="80"></el-table-column>
                <el-table-column label="封锁时长(天)" width="100">
                    <template slot-scope="scope">
                        <span>{{ lockDay }}</span>
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
                <span class="label">数据状态:</span>
                <el-tag type="warning" v-show="dataStatus === 'processing'">{{ "获取网格数据中..." }}</el-tag>
                <el-tag type="success" v-show="dataStatus === 'success'">{{ "获取网格数据成功" }}</el-tag>
                <el-tag type="danger" v-show="dataStatus === 'failed'">{{ "当前城市缺少网格数据，该功能无法使用" }}</el-tag>
            </div>
            <div class="line" style="margin-top:10px;">
                <span class="label">封锁时长:</span>
                <el-input-number v-model="lockDay" style="width:100px;" :min="1" :max="100" :precision="0" :step="1" size="small"
                    :disabled="dataStatus !== 'success'"></el-input-number>
            </div>
            <div class="line" style="margin-top:10px;">
                <span class="label">修改封锁区域:</span>
                <el-button v-show="!infectionAdding" type="primary" size="small" @click="infectionAdding = !infectionAdding"
                    :disabled="dataStatus !== 'success'" plain>添加</el-button>
                <el-button v-show="infectionAdding" type="warning" size="small" @click="infectionAdding = !infectionAdding"
                    :disabled="dataStatus !== 'success'" plain>完成</el-button>
                <el-button type="danger" size="small" @click="onClearInfection" :disabled="dataStatus !== 'success'"
                    plain>清空</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import * as mapUtils from "@/views/simulator/components/mapUtils";
import * as mapUtils2 from "@/views/application/mapUtils";

// 后端请求相关函数
import axios from "axios";
import ajax from "@/views/simulator/ajax";
import serverInfo from '@/views/simulator/serverInfo';

// openlayers
import { Fill, Stroke, Style } from 'ol/style.js';
import { getCenter } from 'ol/extent';

// 处理地图事件
function addMapEventListener(bindThis) {
    const that = bindThis;

    const selectStyle = new Style({
        stroke: new Stroke({
            color: '#333',
            width: 0,
        }),
        fill: new Fill({
            color: 'red',
        }),
    });


    let selected = null;
    // 鼠标移动事件
    that.map.on('pointermove', function (event) {
        selected = null;
        that.map.forEachFeatureAtPixel(event.pixel, function (f) {
            if (f.name === "infection") {
                selected = f;
            }
        });
        if (that.infectionAdding && selected) {
            that.map.getTargetElement().style.cursor = "pointer";
        }
        else {
            that.map.getTargetElement().style.cursor = "auto";
        }
    });
    // 鼠标点击事件

    that.map.on('click', function (event) {
        that.map.forEachFeatureAtPixel(event.pixel, function (f) {
            if (f.name === "infection" && that.infectionAdding) {
                f.setStyle(selectStyle);
                that.addFeatureToList(f);
            }
            return true;
        });

    });

}

// 获取传染病网格
function getInfectionGrid(bindThis, callback) {
    const that = bindThis;

    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();
    formData.append("city", that.city)

    service
        .post('/get_grid_shp', formData, { headers: headers })
        .then((res) => {
            if (res.data.msg === "缺少网格人口文件") {
                that.$message({
                    message: "当前城市缺少网格数据，该功能无法使用",
                    type: "warning",
                });
                that.dataStatus = "failed";
            }
            else if (res.data.data) {
                let remove_grids = [2, 4, 5, 6, 8, 9, 10,12, 18, 53, 54, 55, 57, 58, 56, 59, 60, 
                    65, 68, 69, 81, 84,103,104,108,111, 112, 113, 114, 118, 119, 120];
                let grid_data = [];
                if(that.city === "chongqing"){
                    res.data.data.forEach((item)=>{
                        if(!remove_grids.includes(item.gid))    grid_data.push(item);
                    });
                }
                else{
                    grid_data = res.data.data;
                }
                let processResult = mapUtils2.processPolygon(that, grid_data, "rgba(26,152,80,0.6)", "infection");
                processResult.layer.set("layerName", "infection-grid");
                that.currentInfectionGridLayer = processResult.layer;
                that.currentInfectionGridSource = processResult.source;
                that.map.addLayer(processResult.layer);
                that.dataStatus = "success";
                if (callback) callback();
            }
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "获取城市网格数据失败",
                type: "error",
            });
        });


}

export default ({
    name: "infectionLock",
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
            idSuffix: "infectionLock",
            map: null,
            zoomLevel: 10,
            city: "guangzhou",
            dataStatus: "processing",           //数据状态
            lockInfectionList: [],              //封锁区域列表
            lockDay: 1,                // 当前输入的封锁时长
            infectionAdding: false,             //是否在添加封锁区域

            currentInfectionGridLayer: null,        //网格图层
            currentInfectionGridSource: null,       //网格数据源
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
            if (this.area.length >= 2)
                this.city = this.area[1];
            mapUtils.initOLMap(this, this.city);

            this.lockInfectionList = [];
            this.infectionAdding = false;
            this.finishLockInfection();

            this.dataStatus = "processing";
            getInfectionGrid(this);
            addMapEventListener(this);
        },
        // 向列表添加Feature
        addFeatureToList(feature) {
            let gid = feature.getId();
            let isIn = false;
            this.lockInfectionList.forEach((item) => {
                if (item.gid === gid) isIn = true;
            });
            if (!isIn) {
                let geom = feature.getGeometry();
                let center = getCenter(geom.getExtent());
                let id = 1;
                if (this.lockInfectionList.length > 0)
                    id = this.lockInfectionList[this.lockInfectionList.length - 1].id + 1;
                this.lockInfectionList.push({
                    'id': id,
                    'gid': gid,
                    'position': center,
                    'feature': feature,
                })
            }

        },
        // 删除封锁区域
        removeInfection(infection) {
            const styleOrigin = new Style({
                stroke: new Stroke({
                    color: '#333',
                    width: 0,
                }),
                fill: new Fill({
                    color: 'rgba(26,152,80,0.6)',
                }),
            });
            infection.feature.setStyle(styleOrigin);
            this.lockInfectionList.forEach(function (item, index, arr) {
                if (item.id == infection.id) {
                    arr.splice(index, 1)
                }
            })
        },
        // 清空初始感染点
        onClearInfection() {
            const styleOrigin = new Style({
                stroke: new Stroke({
                    color: '#333',
                    width: 0,
                }),
                fill: new Fill({
                    color: 'rgba(26,152,80,0.6)',
                }),
            });
            this.lockInfectionList.forEach((item)=>{
                item.feature.setStyle(styleOrigin);
            });
            this.lockInfectionList = [];
            this.infectionAdding = false;
            this.finishLockInfection();
        },

        finishLockInfection() {
            this.$emit("updateLockInfectionList", this.lockInfectionList);
            this.$emit("updateInfectionLockDay", this.lockDay);
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
    width: 620px;

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