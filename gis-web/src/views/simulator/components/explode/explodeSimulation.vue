<template>
    <div id="explode-canvas">
        <baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true">
            <bm-scale anchor="BMAP_ANCHOR_TOP_LEFT"></bm-scale>
            <bm-marker v-for="item of stationData" :key="item.id" :position="{ lng: item.lng, lat: item.lat }"
                :dragging="true" @click="lookDetail(item)">
            </bm-marker>
            <bm-info-window :position="infoWindow.info" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
                <div>
                    <p>{{ this.infoWindow.name }}</p>
                    <p>坐标：{{ this.infoWindow.info.lng }},{{ this.infoWindow.info.lat }}</p>
                </div>
            </bm-info-window>
            <bml-heatmap :data="heatdata" :max="100" :radius="20">
            </bml-heatmap>
        </baidu-map>
        <el-row :gutter="20" style="margin:10px">
            <el-col :span="7">
                <div class="line">
                    <p class="label">
                        加油站：
                    </p>
                    <el-select v-model="StationValue" placeholder="加油站名称" @change="handleChangeStation">
                        <el-option v-for="item in StationOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="line">
                    <p class="label">
                        模拟算法：
                    </p>
                    <el-select v-model="MathValue" placeholder="选择算法" @change="handleChangeMath">
                        <el-option v-for="item in MathOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="line">
                    <p class="label">
                        影响范围显示：
                    </p>
                    <el-switch v-model="showExplode" @change="onDisplayChange" active-color="#5177d2">
                    </el-switch>
                </div>
            </el-col>
        </el-row>
        <el-drawer title="影响范围" :visible.sync="showTable" :modal="false" direction="rtl" size="30%">
            <el-table :data="gridData">
                <el-table-column property="type" label="类型" width="150"></el-table-column>
                <el-table-column property="level" label="危害等级" width="200"></el-table-column>
                <el-table-column property="name" label="名称"></el-table-column>
            </el-table>
        </el-drawer>
    </div>
</template>

<script>
import { BmlHeatmap } from 'vue-baidu-map';
import { explodeData, stationData } from './explodeData';
import mapData from '../mapData';

export default ({
    name: "explodeSimulation",
    components: {
        BmlHeatmap
    },
    props: {
        city: {
            type: String,
            default: "shanghai",
        },
    },
    watch: {
        city() {
            this.handleChange();
        },
    },
    data() {
        return {
            showTable: false,
            showExplode: false,
            markerPoint: { lng: 121.810307, lat: 31.164832 },
            infoWindow: {
                show: false,
                name: "",
                info: {
                    lng: "",
                    lat: "",
                },
                data: [],
                gridData: []
            },
            stationData: [],
            MathOptions: [{
                value: 'gaussian',
                label: '高斯公式'
            }, {
                value: 'tnt',
                label: 'TNT当量法'
            }],
            MathValue: 'gaussian',
            StationOptions: [],
            StationValue: '',
            heatdata: [
            ],
            center: {
                lng: 121.573535, lat: 31.250408
            },
            zoom: 13,
            gridData: [{
                type: '建筑',
                level: '5',
                name: '上海浦东国际机场'
            }],
            mapStyle: {
                styleJson: [{
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#f30505ff"
                    }
                }]
            }
        }
    },
    mounted() {
        this.stationData = stationData;
    },
    methods: {
        lookDetail(item) {
            this.StationValue = item.lng.toString()
            this.infoWindow.info.lng = item.lng;
            this.infoWindow.info.lat = item.lat;
            this.infoWindow.show = true;
            this.infoWindow.name = item.name;
            this.infoWindow.data = item.data;
            this.infoWindow.gridData = item.gridData;
            this.center = this.infoWindow.info;
            this.heatdata = this.calculate(item.lng, item.lat);
            console.log(this.heatdata);
            this.showTable = true;
            this.showExplode = true;
            this.zoom = 16;
            this.gridData = this.infoWindow.gridData;
            console.log("lookDetail", this.heatdata);
        },
        handleChangeStation() {
            for (let i = 0; i < stationData.length; i++) {
                if (stationData[i].lng === parseFloat(this.StationValue)) {
                    this.lookDetail(stationData[i]);
                }
            }
        },

        handleChange() {
            this.StationValue = '';
            let center = mapData[this.city].center;
            this.center = { lng: center[0], lat: center[1] }
            this.zoom = 13;
            this.StationOptions = explodeData[this.city].StationOptions;
        },

        onDisplayChange(){
            if(!this.showExplode){
                this.heatdata = [];
            }
        },

        gaussian(x, y, x0, y0, A, sigma) {
            return A * Math.exp(-((x - x0) ** 2 + (y - y0) ** 2) / (2 * sigma ** 2));
        },
        tnt(x, y, x0, y0) {
            const constantA = 1;
            const constantB = 2;
            const tntEquivalent = 0.55;
            var dx = x - x0;
            var dy = y - y0;
            var distance = Math.sqrt(dx * dx + dy * dy);
            return constantA * tntEquivalent / (Math.pow(distance, constantB) * 2000)
        },
        calculate(centerLng, centerLat) {
            const radius = 0.01;
            const sigma = 9.82;
            var min = 4000;
            var max = 0;
            let heatmapData = [];
            let heatmapDataTNT = [];
            for (let i = centerLng - radius; i < centerLng + radius; i += 0.0001) {
                for (let j = centerLat - radius; j < centerLat + radius; j += 0.0001) {
                    heatmapData.push({
                        lng: i,
                        lat: j,
                        count: 1000000000 * (this.gaussian(i, j, centerLng, centerLat, 1, sigma) - 0.9999999),
                    });
                    heatmapDataTNT.push({
                        lng: i,
                        lat: j,
                        count: this.tnt(i, j, centerLng, centerLat),
                    });
                }
            }
            console.log(this.MathValue)
            if (this.MathValue == 'gaussian') {
                return heatmapData
            }
            else {
                return heatmapDataTNT
            }
        },
        handleChangeMath() {
            this.heatdata = this.calculate(this.infoWindow.info.lng, this.infoWindow.info.lat);
            this.showExplode = true;
        },
        infoWindowClose() {
            this.infoWindow.show = false
        },
        infoWindowOpen() {
            this.infoWindow.show = true;
        }
    },
});
</script>

<style lang="scss" scoped>
#explode-canvas {
    font-family: "微软雅黑";
}


.map {
    width: 100%;
    height: 80vh;
    font-family: "微软雅黑";
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s;
}

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
</style>