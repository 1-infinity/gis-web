<template>
    <div class="app-container">
        <el-row :gutter="10">
            <el-col :span="10">
                <el-card>
                    <div slot="header">
                        <span>韧性城市体检评估</span>
                        <div style="position: relative; float: right; bottom: 10px;">
                            <el-cascader :options="options" placeholder="城市" :show-all-levels="false"
                                v-model="cityValue" @change="recordCity" style="width: 200px">
                                <template slot-scope="{ node, data }">
                                    <span>{{ data.label }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                                </template>
                            </el-cascader>
                        </div>
                    </div>
                    <div>
                        <span>城市韧性敏感词</span>
                        <el-divider></el-divider>
                        <div id="roughnessWordCloud" ref="loginTimes" style="width: 540px; height: 360px;"></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="14">
                <el-card>
                    <div slot="header">
                        <span>城市区块韧性展示</span>
                    </div>
                    <div id="resilienceBlock" style="width: 100%; height: 430px;"></div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="10" style="position:relative; top:5px">
            <el-col :span="24" >
                <el-card>
                    <div slot="header">
                        <span>韧性城市AI评价报告</span>
                        <el-button type="primary" style="position: relative; float: right; bottom: 10px;" slot="extra" @click="exportChatResult">导出结果</el-button>
                    </div>
                    <div v-if="chatResult" v-html="chatResult">
                    </div>
                </el-card>

            </el-col>
        </el-row>
    </div>
</template>


<script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&&type=webgl&ak=Mn6TDlYNiINZcw5iiufdb7yfSxulbby5"></script>

<script>

import { BMPGL } from "./bmpgl.js"
import { DistrictData } from "./cityDistrictData.js"
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import 'echarts-extension-amap';
import ajax1 from './ajax1';
//import {
    //options,
//} from "./CityScoreData.js";
import {
    options,COMPRoptions,moniData
} from "./CityScoreData.js";
import { Configuration, OpenAIApi } from 'openai';
export default {
    name: "cityExamination",
    data() {
        return {
            options: options,
            cityValue: [],
            city: "",
            moniData: moniData,
            DistrictData: DistrictData,
            wordcloudData: [{
                name: "韧性城市敏感词",
                value: 0,
            }],
            wordcloud: Object,
            chatResult: null,
            ak: "Mn6TDlYNiINZcw5iiufdb7yfSxulbby5", // 百度的地图密钥
            myMap: null

        };
    },

    mounted() {
        
        this.initWordCloud();
        this.wordCloudResetOptions();
        this.initResilienceBlock();
       
        
        
    },

    methods: {
        /*async recordCity() {
            console.log("切换城市");
            this.city = this.cityValue[1];
            const cityData = await ajax1(`/evalution/getCityToughnessEvaluation/${this.city}`);
            if (cityData["data"] !== null) {
                this.initWordcloudData(cityData["data"]);
                this.wordCloudResetOptions();
            }
            else {
                alert("此城市尚未进行标准评分，请切换至上一栏菜单");
                this.city = "";
            }
        },*/
       
        async recordCity() {
            console.log("切换城市");
            this.city = this.cityValue[1];
        
            if(this.city === "shanghai"){      //离谱的数据转换
                this.city = "上海";
            }
            else if(this.city === "chongqing"){
                this.city = "重庆";
            }
            else if(this.city === "guangzhou"){
                this.city = "广州";
            }
            else if(this.city === "wuxi"){
                this.city = "无锡";
            }
            else if(this.city === "ningbo"){
                this.city = "宁波";
            }
            console.log(this.city);

            let cityData = null;
            for(let i = 0; i < moniData.length; i++) {
                if(moniData[i].city === this.city) {
                    cityData = moniData[i];
                    break;
                }
            }
            if (cityData !== null && cityData["details"] !== null) {
                this.initWordcloudData(cityData["details"]);
                this.wordCloudResetOptions();
                this.initMap();
                this.initGPT3(cityData["details"]);
            }
            else {
                alert("此城市尚未进行标准评分，请切换至上一栏菜单");
                this.city = "";
            }
        },

        async initGPT3(details) {
            const API_KEY = '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';  //输入API Key
            const configuration = new Configuration({
                apiKey: API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            let jsonString = JSON.stringify(details);
            var text = jsonString+"这是"+this.city+"的属性，请根据"+this.city+"的城市韧性写一个城市韧性报告。请你使用HTML标签来生成报告，要求使用通俗易懂的风格，不要出现具体评分。"
            console.log(text);
            try {
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: text }],            //输入语句
                    //max_tokens : 10 ,
                });

                if (completion.data.choices && completion.data.choices.length > 0) {
                    this.chatResult = completion.data.choices[0].message.content;
                    console.log(this.chatResult);
                }
            } catch (error) {
                console.error(error);
            }
        },
        exportChatResult() {
            const blob = new Blob([this.chatResult], {type: 'text/plain;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'export.html'; // 设置下载的文件名
            link.click(); 
            URL.revokeObjectURL(url); // 释放 URL 对象
        },
        colorSelect(ScoreAvg){
            let col ='#5592c7';

            if (ScoreAvg>=1 & ScoreAvg<=10) {
                col ='#6fec4f'
            }else if (ScoreAvg>10 & ScoreAvg<=12){
                col ='#5dc642'
            }else if (ScoreAvg>12 & ScoreAvg<=14){
                col ='#4ba035'
            }else if (ScoreAvg>14 & ScoreAvg<=16){
                col ='#397929'
            }else if (ScoreAvg>=16){
                col ='#27531c'
            }else{
                col ='#5592c7'
            }
            return col
        },
        initMap() {
      // 传入密钥获取地图回调。
            BMPGL(this.ak).then((BMapGL) => {
                // 创建地图实例
                let map = new BMapGL.Map("resilienceBlock");
                // 创建点坐标 axios => res 获取的初始化定位坐标
                var Position = '市';
                Position = this.city + Position;
                var district = [];
                district.push(Position);
                if(this.city === "珠三角城市群")
                {
                    Position = '广东省';
                }
                
                var bdary = new BMapGL.Boundary();

                bdary.get(Position, function (rs) {
                    // 绘制行政区区域掩膜
                    for (var i = 0; i < rs.boundaries.length; i++) {
                        var path = [];
                        var xyArr = rs.boundaries[i].split(';');
                        var ptArr = [];
                        for (var j = 0; j < xyArr.length; j++) {
                            var tmp = xyArr[j].split(',');
                            var pt = new BMapGL.Point(tmp[0], tmp[1]);
                            ptArr.push(pt);
                        }
                        var mapmask = new BMapGL.MapMask(ptArr, {
                            isBuildingMask: true,
                            isPoiMask: true,
                            isMapMask: true,
                            showRegion: 'inside',
                            topFillColor: '#5679ea',
                            topFillOpacity: 0.5,
                            sideFillColor: '#5679ea',
                            sideFillOpacity: 0.9
                        });
                        map.addOverlay(mapmask);
                        var border = new BMapGL.Polyline(ptArr, {
                            strokeColor: '#4ca7a2',
                            strokeWeight: 3,
                            strokeOpacity: 1
                        });
                        map.addOverlay(border);
                    }
                });
              

                map.centerAndZoom(Position, 12);
                //开启鼠标滚轮缩放
                map.enableScrollWheelZoom(true);
                map.setHeading(64.5);
                map.setTilt(73);
                
                var cityDist = [];
                for(let i = 0; i < DistrictData.length; i++) {
                    if(DistrictData[i].city === this.city) {
                        cityDist = DistrictData[i];
                        break;
                    }
                }
                console.log(cityDist);
                var existingTooltips = document.querySelectorAll('.map-tooltip');
                existingTooltips.forEach(function(tooltip) {
                    tooltip.remove();
                });
                cityDist["details"].forEach((item) => {    
                    let scores = item.Score;
                    let sum = scores.reduce((a, b) => a + b, 0);
                    let ScoreAvg = sum / scores.length;
                    let Dis = item.district;
                    let col = this.colorSelect(ScoreAvg);
                    var dist = null;  //显示界面
                    
                    dist = new BMapGL.DistrictLayer
                    ({
                        name: '(' + Position + Dis + ')',
                        kind: 0,
                        fillColor: col,
                        strokeColor: '#daeafa',
                        viewport: true
                    });

                    // 创建一个自定义的HTML元素用来显示分数
                    var tooltip = document.createElement('div');
                    tooltip.style.position = 'fixed'; // 使用 fixed 位置，使其相对于视口定位
                    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 设置背景颜色，这里使用了半透明的黑色
                    tooltip.style.color = 'white'; // 设置文本颜色为白色
                    tooltip.style.padding = '5px'; // 设置内边距
                    tooltip.style.borderRadius = '5px'; // 设置边框圆角
                    tooltip.style.display = 'none'; // 初始化时设置为隐藏
                    tooltip.classList.add('map-tooltip'); //添加类名
                    document.body.appendChild(tooltip); // 将提示框添加到文档中


                    dist.addEventListener('click', function (e) {
                        map.centerAndZoom(item.district, 10);
                         // 更新分数元素的位置和内容
                   
                    })
                    dist.addEventListener('mousemove', function (e) {

                          // 获取事件的经纬度，并转换为像素坐标
                        var point = new BMapGL.Point(e.latLng.lng, e.latLng.lat);  // 假设e.latLng包含了经纬度
                        var pixel = map.pointToPixel(point);

                        // 获取tooltip和map的尺寸
                        var tooltipRect = tooltip.getBoundingClientRect();
                        var mapRect = map.getContainer().getBoundingClientRect();

                        // 计算tooltip相对于map的位置
                        var left = pixel.x - mapRect.left - tooltipRect.width / 2;
                        var top = pixel.y - mapRect.top - tooltipRect.height / 2;
                        
                        var resilienceBlock = document.getElementById('resilienceBlock');
                        var blockRect = resilienceBlock.getBoundingClientRect();
                        var mousePosition =  2 * mapRect.left + left;
                        console.log(mousePosition,blockRect.left,blockRect.right);
                        if (mousePosition >  blockRect.left && mousePosition < blockRect.right ) {
                            // 鼠标在 "城市区块韧性展示" 的 div 内部
                            e.currentTarget.setFillColor('#9169db');
                            tooltip.textContent = '平均得分: ' + ScoreAvg;
                            // 更新提示框的位置，将其移动到鼠标的位置
                            
                            // 更新提示框的位置，将其移动到转换后的像素坐标
                            tooltip.style.left = mousePosition + 'px';
                            tooltip.style.top = 2 * mapRect.top+ top + 'px';
                            // 显示提示框
                            tooltip.style.display = 'block';
                        } else {
                            // 鼠标不在 "城市区块韧性展示" 的 div 内部
                            tooltip.style.display = 'none';
                        }
                      
                    })
                    dist.addEventListener('mouseout', function (e) {
                        e.currentTarget.setFillColor(e.currentTarget.style.fillColor);
                        tooltip.style.display = 'none';
                    });
                    console.log(dist);
                    map.addDistrictLayer(dist);
                    
                });
            
                
                //var dist = null;  //显示界面
               /* dist = new BMapGL.DistrictLayer
                ({
                    name: '(' + Position + ')',
                    kind: 2,
                    fillColor: '#87CEFA',
                    strokeColor: '#daeafa',
                    viewport: true
                });
                map.addDistrictLayer(dist);*/
                // 保存数据
                // this.myMap = map
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        
      


        /*initWordcloudData(data) {
            this.wordcloudData = [];
            for (let d of data) {
                console.log(d);
                if (d.val < 3) {
                    this.wordcloudData.push({
                        name: d.target,
                        value: (5 - d.val) * 8,
                    })
                }
            }
        },*/
        initWordcloudData(details) {
    // 新建一个空数组来存放词云数据
            let wordcloudData = [];

            // 遍历details数组
            for (let i = 0; i < details.length; i++) {
                // 对每个系统的子元素进行遍历
                for (let j = 0; j < details[i].children.length; j++) {
                    if(details[i].children[j].value < 3){
                        // 将子元素添加到词云数据中
                        wordcloudData.push({
                            name:details[i].children[j].name,
                            value:(5 - details[i].children[j].value) * 8,
                        });
                    }
                }
            }
            this.wordcloudData = wordcloudData;
        },


        initWordCloud() {
            // 获取到ref绑定为loginTimes的DOM节点，以canvas的形式展现在视图层
            this.wordcloud = echarts.init(document.getElementById('roughnessWordCloud'));
        },

        wordCloudResetOptions() {
            // echarts参数设置
            this.wordcloud.setOption({
                backgroundColor: '#fff', // canvas背景颜色
                // canvas标题配置项
                series: [{
                    type: 'wordCloud',
                    shape: 'circle',
                    left: '0%',                  // X轴偏移量
                    top: '0%',                   // Y轴偏移量
                    width: '100%',               // canvas宽度大小
                    height: '100%',              // canvas高度大小
                    sizeRange: [24, 32],         //  词典字体大小范围配置
                    rotationRange: [0, 0],    // 词典字体旋转角度配置，默认不旋转
                    gridSize: 25,                // 词典字体间距配置
                    drawOutOfBound: false,       // 允许词太大的时候，超出画布的范围
                    layoutAnimation: true,       // 为false词典过度会阻塞
                    textStyle: {                 // 词典样式配置
                        color: function () {
                            // Random color
                            return 'rgb(' + [
                                Math.round(Math.random() * 255),
                                Math.round(Math.random() * 255),
                                Math.round(Math.random() * 255)
                            ].join(',') + ')';
                        }
                    },
                    // 渲染词典数据
                    data: this.wordcloudData,
                }]
            });
        },

        initResilienceBlock() {
            
        },
    },
};

</script>
  
<style lang="scss" scoped>

</style>  