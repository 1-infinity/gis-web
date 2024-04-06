<!-- 韧性测度业务流程-步骤三 -->
<template>
  <div>
    <div class="title">暴雨洪涝灾害模拟推演</div>
    <div class="layout-main">
      <el-row class="layout-row" :gutter="32" type="flex" justify="center">
        <!-- 参数设置面板 -->
        <el-col :span="9">
          <el-card>
            <div slot="header" style="font-weight: bold;">
              <i class="el-icon-setting"></i>
              灾害模拟参数设置
            </div>
            <el-form ref="form">
              <!-- 设置洪水数据 -->
              <div style="margin-bottom: 20px;">
                <el-collapse v-model="floodActiveNames">
                  <el-collapse-item title="暴雨洪涝模拟数据" name="1">
                    <template slot="title">
                      <p style="font-size: 14px; font-weight: bold;">暴雨洪涝模拟数据</p>
                    </template>
                    <el-form-item label="是否使用上传数据:">
                      <el-popover placement="right" width="400" trigger="hover">
                        <p>是则使用该页面上传的数据文件进行模拟，否则使用数据管理中已有的数据进行模拟</p>
                        <i class="el-icon-question" slot="reference"></i>
                      </el-popover>
                      <el-switch v-model="useUploadFile" active-text="是" inactive-text="否" style="margin-left: 10px;">
                      </el-switch>
                    </el-form-item>
                    <div v-show="useUploadFile">
                      <el-form-item label="水文数据(必须):">
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
                      <el-form-item label="路网数据(必须):">
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
                      <el-form-item label="建筑物数据(必须):">
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
                      <el-form-item label="高程数据(必须):">
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
                      <el-form-item label="降水文件(可选):">
                        <el-popover placement="right" width="800" trigger="hover">
                          <p class="helpTitle">数据要求</p>
                          <p>当前降⽔⽂件记录了地区的年降⽔数据，⽤于在降⽔模拟过程中作为基础降⽔的参考。</p>
                          <i class="el-icon-question" slot="reference"></i>
                        </el-popover>
                        <el-upload name="rain" :auto-upload="false" :on-change="uploadRainFiles" multiple action=""
                          :file-list="rainFiles">
                          <i class="el-icon-upload"></i>
                          <div class="el-upload__tip" slot="tip">
                            请上传rain.ovr文件、rain.tfw文件、rain.tif文件、rain.xml文件
                          </div>
                        </el-upload>
                      </el-form-item>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="暴雨洪涝模拟参数" name="2">
                    <template slot="title">
                      <p style="font-size: 14px; font-weight: bold;">暴雨洪涝模拟参数</p>
                    </template>
                    <!--模拟任务的名称-->
                    <el-form-item label="任务名称:">
                      <el-input style="width:auto;" v-model="taskName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <!--系统提供的一些参数配置-->
                    <el-form-item label="配置:">
                      <el-select v-model="floodParamConfig" @change="onFloodConfigChange">
                        <el-option v-for="(name, config) in floodConfigOptions" :label="name" :key="config"
                          :value="config" />
                      </el-select>
                    </el-form-item>
                    <!--设置降水等级，如果是自定义，才允许用户手动输入每小时降雨量-->
                    <el-form-item label="24小时降雨的等级:">
                      <el-popover placement="right" trigger="hover">
                        <p class="helpTitle">参数说明</p>
                        <p>小雨: 0～10 mm/24h</p>
                        <p>中雨: 10～25 mm/24h</p>
                        <p>大雨: 25～50 mm/24h</p>
                        <p>暴雨: 50～100 mm/24h</p>
                        <p>大暴雨: 100～250 mm/24h</p>
                        <p>特大暴雨: 250～400 mm/24h</p>
                        <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                      </el-popover>
                      <el-select v-model="floodParam['Rain level']" :disabled="floodParamConfig != 'custom'">
                        <el-option v-for="(name, index) in rainLevelOptions" :label="name" :key="index" :value="index" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="每小时降雨量(Rainfall per hour):" v-show="floodParam['Rain level'] === '0'">
                      <el-popover placement="right" title="参数说明" content="表示降⾬量的⼤⼩，单位是m/h" trigger="hover">
                        <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                      </el-popover>
                      <!-- <el-input type="number" v-model="floodParam['Rainfall per hour']" placeholder="请输入内容"></el-input> -->
                      <el-input-number v-model="floodParam['Rainfall per hour']" :min="0"
                        :controls="false"></el-input-number>
                    </el-form-item>
                    <el-form-item label="初始降雨中心点X坐标(InitX, 0～1):">
                      <el-popover placement="right" width="300" title="参数说明" content="降⽔中⼼点的X坐标（0～1，其中0表示最左端，1表示最右端）"
                        trigger="hover">
                        <i class="el-icon-question" slot="reference"></i>
                      </el-popover>
                      <!-- <el-input v-model="floodParam.InitX" placeholder="请输入内容"></el-input> -->
                      <el-input-number v-model="floodParam.InitX" :min="0" :max="1" :controls="false"></el-input-number>
                    </el-form-item>
                    <el-form-item label="初始降雨中心点Y坐标(InitY, 0～1):">
                      <el-popover placement="right" width="300" title="参数说明" content="降⽔中⼼点的Y坐标（0～1，其中0表示最上端，1表示最下端）"
                        trigger="hover">
                        <i class="el-icon-question" slot="reference"></i>
                      </el-popover>
                      <!-- <el-input v-model="floodParam.InitY" placeholder="请输入内容"></el-input> -->
                      <el-input-number v-model="floodParam.InitY" :min="0" :max="1" :controls="false"></el-input-number>
                    </el-form-item>
                    <el-form-item label="降雨半径(Radius, 0～1):">
                      <el-popover placement="right" title="参数说明" content="降⽔区域半径（半径 = 城市宽度 × 此处输入）" trigger="hover">
                        <i class="el-icon-question" slot="reference"></i>
                      </el-popover>
                      <!-- <el-input v-model="floodParam.Radius" placeholder="请输入内容"></el-input> -->
                      <el-input-number v-model="floodParam.Radius" :min="0" :max="1" :controls="false"></el-input-number>
                    </el-form-item>
                    <el-form-item label="移动方向(Movement direction, 0～360):">
                      <el-popover placement="right" title="参数说明" content="降⾬中⼼移动⽅向（0表示正东⽅向，逆时针递增）" trigger="hover">
                        <i class="el-icon-question" slot="reference"></i>
                      </el-popover>
                      <!-- <el-input v-model="floodParam['Movement direction']" placeholder="请输入内容"></el-input> -->
                      <el-input-number v-model="floodParam['Movement direction']" :min="0" :max="360"
                        :controls="false"></el-input-number>
                    </el-form-item>
                    <el-form-item label="移动速度(Movement speed, 0～1):">
                      <el-popover placement="right" width="400" trigger="hover">
                        <p class="helpTitle">参数说明</p>
                        <p>降⾬中⼼移动速度（时速 = 城市宽度 × 此处输入）</p>
                        <p>对模拟场景以左上⻆为原点，横向为X⽅向，纵向为Y⽅向，建⽴直⻆坐标系。对于右下⻆，其坐标值为(1,1)。</p>
                        <p>以东（右）向为起点为0度，逆时针旋转共360度。</p>
                        <p>降⾬区域为⼀个移动的圆形区域，InitX，InitY表示降⾬中⼼的位置，Radius表示区域半径，MD表示移动的⽅向，MS表示在模拟中每1步移动的距离。</p>
                        <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                      </el-popover>
                      <!-- <el-input v-model="floodParam['Movement speed']" placeholder="请输入内容"></el-input> -->
                      <el-input-number v-model="floodParam['Movement speed']" :min="0" :max="1"
                        :controls="false"></el-input-number>
                    </el-form-item>
                    <el-form-item label="水流扩散速率(Diffusion rate, 0～1):">
                      <el-popover placement="right" title="参数说明" content="⽤于控制降⾬在地表的移动程度" trigger="hover">
                        <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                      </el-popover>
                      <!-- <el-input v-model="floodParam['Diffusion rate']" placeholder="请输入内容"></el-input> -->
                      <el-input-number v-model="floodParam['Diffusion rate']" :min="0" :max="1"
                        :controls="false"></el-input-number>
                    </el-form-item>
                  </el-collapse-item>
                </el-collapse>
              </div>

              <!-- 操作 -->
              <el-form-item>
                <el-button @click="submitTask" type="primary">提交任务</el-button>
              </el-form-item>


            </el-form>
          </el-card>
        </el-col>
        <!-- 模拟任务列表 -->
        <el-col :span="15">
          <el-card>
            <div slot="header" style="font-weight: bold;">
              <i class="el-icon-heavy-rain"></i>
              暴雨洪涝灾害模拟推演任务
            </div>
            <el-table :data="tableData" style="height: 50vh; overflow: auto;">
              <el-table-column label="序号" prop="id" :show-overflow-tooltip="true" width="80" />
              <el-table-column property="name" label="任务名称" align="center"
                :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="位置" prop="simulationArea" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ parseCity(scope.row.simulationArea) }}</span>
                </template>
              </el-table-column>

              <el-table-column label="任务类型" prop="isNewSimulation" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ taskTypeNames[scope.row.isNewSimulation] }}</span>
                </template>
              </el-table-column>

              <el-table-column label="任务提交时间" align="center" prop="simulationDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span>{{ scope.row.simulationDate }}</span>
                </template>
              </el-table-column>

              <el-table-column label="状态" align="center" width="60" prop="simulationDate">
                <template slot-scope="scope">
                  <i class="el-icon-loading" v-if="scope.row.simulationState === 'processing'"></i>
                  <i class="el-icon-success" v-if="scope.row.simulationState === 'finish'" style="color: green"></i>
                  <i class="el-icon-error" v-if="scope.row.simulationState === 'failed'" style="color: crimson"></i>
                </template>
              </el-table-column>

              <el-table-column label="模拟计算时间" align="center" width="120" prop="simulationDate">
                <template slot-scope="scope">
                  <span>{{ scope.row.simulationTime }}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-radio v-model="taskIdSelected" :label="scope.row.id"
                    :disabled="scope.row.simulationState !== 'finish'" size="mini" border
                    @input="clickTask(scope.row)">选择</el-radio>
                  <!-- <el-button size="mini" type="text" icon="el-icon-set-up"
                    :disabled="scope.row.simulationState !== 'finish'" @click="clickTask(scope.row)">选择</el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
import ajax from "@/views/simulator/ajax";
import mapData from '@/views/simulator/components/mapData';
import serverInfo from '@/views/simulator/serverInfo';

export default {
  name: "stepC",
  props: {
    city: {
      type: String,
      default: "",
    },
    cityName: {
      type: String,
      default: "",
    },
  },
  components: {
  },
  data() {
    return {
      helpImgs: {
        "water": require("@/assets/images/dataRequirement/waterFiles.jpg"),
        "road": require("@/assets/images/dataRequirement/roadFiles.jpg"),
        "building": require("@/assets/images/dataRequirement/buildingFiles.jpg"),
        "dem": require("@/assets/images/dataRequirement/demFiles.jpg"),
        "od": require("@/assets/images/dataRequirement/odFiles.jpg"),
        "hospital": require("@/assets/images/dataRequirement/hospitalFiles.jpg"),
        "community": require("@/assets/images/dataRequirement/communityFiles.jpg"),
        "gasstation": require("@/assets/images/dataRequirement/gasstationFiles.jpg")
      },
      taskIdSelected: -1, //选择的任务ID
      // 任务类型
      type: "flood",
      typeNames: {
        'flood': '暴雨洪涝',
        'infection': '传染病',
        'explode': '危化品爆炸',
      },
      taskTypeNames: {
        'false': '模拟',
        'true': '推演',
      },
      // 洪涝模拟是否上传数据
      useUploadFile: false,
      //折叠面板
      floodActiveNames: ["2"],
      // 参数
      floodParam: {
        InitX: "0.5",
        InitY: "0.2",
        Radius: "0.5",
        "Movement direction": "0.0",
        "Movement speed": "0.03",
        'Rain level': '0',
        "Rainfall per hour": "0.02",
        "Diffusion rate": "0.6",
        type: "flood",
        "Whether drainage facilities are used": "false",
        "Whether rain file is used": "false",
      },
      taskName: "任务",
      floodParamConfig: 'custom',               //洪涝模拟配置
      floodConfigOptions: {                      //洪涝模拟配置选项
        'config1': '五年一遇',
        'config2': '十年一遇',
        'config3': '五十年一遇',
        'config4': '一百年一遇',
        'custom': '自定义'
      },
      rainLevelOptions: {
        '0': '自定义',
        '1': '小雨',
        '2': '中雨',
        '3': '大雨',
        '4': '暴雨',
        '5': '大暴雨',
        '6': '特大暴雨',
      },
      // 文件列表
      waterFiles: [],
      roadFiles: [],
      buildingFiles: [],
      demFiles: [],
      rainFiles: [],
      files: [],
      tableData: [], // 模拟任务列表
    };
  },
  created() { },
  mounted() {
    this.getTaskList(()=>{
      if(this.tableData.length > 0){
        this.floodActiveNames = [];
      }
    });
  },
  methods: {
    // 根据拼音获取城市名
    parseCity(city) {
      if (city in mapData) {
        return mapData[city].cityName
      } else {
        return city
      }
    },
    // 改变暴雨洪涝模拟的参数配置
    onFloodConfigChange(option) {
      const rainfalls = {
        'config1': "0.011468",    //5年一遇
        'config2': "0.014316",    //10年一遇
        'config3': "0.020928",    //50年一遇
        'config4': "0.023775",    //100年一遇
      }
      this.floodParam['Rain level'] = '0'
      this.floodParam['Rainfall per hour'] = rainfalls[option]
      this.floodParam['Rain band intensity'] = '0'
    },
    // 获取模拟任务列表
    getTaskList(callback) {
      ajax("/simulation/processes")
        .then((res) => {
          this.tableData = [];
          res.forEach((r) => {
            if (r.simulationArea != this.city) return;
            r["simulationDate"] = new Date(r.simulationDate).toLocaleString();
            if (r.simulationState === 'processing') {
              r.simulationTime = "计算中";
            }
            else {
              r.simulationTime = (parseInt(r.simulationTime) / 1000).toString() + " 秒";
            }
            r["city"] = r.simulationArea;
            this.tableData.push(r);
          });
          this.tableData.sort((a, b) => { return a.id - b.id });
          this.$message({
            message: "获取洪涝模拟任务列表成功",
            type: "success",
          });
          if (callback) {
            callback();
          }
        })
        .catch((err) => {
          console.log(err, 11);
          if (err.message.indexOf("timeout") !== -1) {
            this.$message({
              message: "获取洪涝模拟任务列表失败",
              type: "error",
            });
          }
        });
    },
    // 上传文件
    uploadWaterFiles(file) {
      let fileName = file.name;
      let parts = fileName.split('.')
      let ext = parts[parts.length - 1];
      let extensions = ["shp", "cpg", "dbf", "prj", "qix", "sbn", "sbx", "shx", "xml"];
      if (!extensions.includes(ext)) {
        this.$message.error(`无法上传格式为${ext}的文件！`);
        this.waterFiles = this.waterFiles.slice(0, -1);
        return;
      }
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
      let parts = fileName.split('.')
      let ext = parts[parts.length - 1];
      let extensions = ["shp", "cpg", "dbf", "prj", "qix", "sbn", "sbx", "shx", "xml"];
      if (!extensions.includes(ext)) {
        this.$message.error(`无法上传格式为${ext}的文件！`);
        this.roadFiles = this.roadFiles.slice(0, -1);
        return;
      }
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
      let parts = fileName.split('.')
      let ext = parts[parts.length - 1];
      let extensions = ["shp", "cpg", "dbf", "prj", "qix", "sbn", "sbx", "shx", "xml"];
      if (!extensions.includes(ext)) {
        this.$message.error(`无法上传格式为${ext}的文件！`);
        this.buildingFiles = this.buildingFiles.slice(0, -1);
        return;
      }
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
      let parts = fileName.split('.')
      let ext = parts[parts.length - 1];
      let extensions = ["tif", "ovr", "tfw", "xml"];
      if (!extensions.includes(ext)) {
        this.$message.error(`无法上传格式为${ext}的文件！`);
        this.demFiles = this.demFiles.slice(0, -1);
        return;
      }
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
    uploadRainFiles(file) {
      let fileName = file.name;
      let parts = fileName.split('.')
      let ext = parts[parts.length - 1];
      let extensions = ["tif", "ovr", "tfw", "xml"];
      if (!extensions.includes(ext)) {
        this.$message.error(`无法上传格式为${ext}的文件！`);
        this.rainFiles = this.rainFiles.slice(0, -1);
        return;
      }
      if (fileName.split(".")[0] != "rain") {
        setTimeout(() => {
          this.$message.error(`请将上传文件命名为rain.${fileName.split(".")[1]}`);
        }, 100);
        this.rainFiles = this.rainFiles.slice(0, -1);
        return;
      }
      else {
        this.rainFiles.push(file);
        this.files.push(file);
      }
    },
    // 提交任务
    submitTask() {
      if (this.useUploadFile) {
        if (this.waterFiles.length === 0)
          return this.$message.error("请上传水文数据");
        if (this.roadFiles.length === 0)
          return this.$message.error("请上传路网数据");
        if (this.buildingFiles.length === 0)
          return this.$message.error("请上传建筑物数据");
        if (this.demFiles.length === 0)
          return this.$message.error("请上传高程数据");

        let totalSize = 0;
        this.waterFiles.forEach((file) => {
          totalSize += file.size;
        });
        this.roadFiles.forEach((file) => {
          totalSize += file.size;
        });
        this.buildingFiles.forEach((file) => {
          totalSize += file.size;
        });
        this.demFiles.forEach((file) => {
          totalSize += file.size;
        });
        this.rainFiles.forEach((file) => {
          totalSize += file.size;
        });
        if (totalSize >= 1073741824) {
          this.$message.error("上传文件总大小不能超过1GB");
          return;
        }
        if (this.rainFiles.length > 0)
          this.floodParam["Whether rain file is used"] = "true";
      }
      let checkValues = true;
      if (Number(this.floodParam["Rainfall per hour"]) < 0) {
        setTimeout(() => {
          this.$message.error("每小时降雨量必须大于0");
        }, 100);
        checkValues = false;
      }
      if (
        Number(this.floodParam["InitX"]) > 1 ||
        Number(this.floodParam["InitX"]) < 0
      ) {
        setTimeout(() => {
          this.$message.error("初始降雨中心点X坐标必须在0-1之间");
        }, 110);
        checkValues = false;
      }
      if (
        Number(this.floodParam["InitY"]) > 1 ||
        Number(this.floodParam["InitY"]) < 0
      ) {
        setTimeout(() => {
          this.$message.error("初始降雨中心点Y坐标必须在0-1之间");
        }, 120);
        checkValues = false;
      }
      if (
        Number(this.floodParam["Radius"]) > 1 ||
        Number(this.floodParam["Radius"]) < 0
      ) {
        setTimeout(() => {
          this.$message.error("降雨半径必须在0-1之间");
        }, 130);
        checkValues = false;
      }
      if (
        Number(this.floodParam["Movement direction"]) > 360 ||
        Number(this.floodParam["Movement direction"]) < 0
      ) {
        setTimeout(() => {
          this.$message.error("移动方向必须在0-360之间");
        }, 140);
        checkValues = false;
      }
      if (
        Number(this.floodParam["Movement speed"]) > 1 ||
        Number(this.floodParam["Movement speed"]) < 0
      ) {
        setTimeout(() => {
          this.$message.error("移动速度必须在0-1之间");
        }, 150);
        checkValues = false;
      }
      if (
        Number(this.floodParam["Diffusion rate"]) > 1 ||
        Number(this.floodParam["Diffusion rate"]) < 0
      ) {
        setTimeout(() => {
          this.$message.error("扩散速率必须在0-1之间");
        }, 160);
        checkValues = false;
      }

      if (!checkValues)
        return;


      const loading = this.$loading({
        lock: true,
        text: "仿真环境上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let formData = new FormData();
      let floodParam = {};
      for (let key in this.floodParam) {
        floodParam[key] = `${this.floodParam[key]}`;
      }

      formData.append("type", this.type);
      formData.append("area", this.city);
      formData.append("name", this.taskName);
      formData.append(
        "disturbance",
        JSON.stringify(
          floodParam
        )
      );
      if (this.useUploadFile) {
        for (let i = 0; i < this.files.length; i++) {
          formData.append("files", this.files[i].raw);
        }
      }
      let url;
      if (this.useUploadFile)
        url = serverInfo.baseURL + "/simulation/simulator";
      else
        url = serverInfo.baseURL + "/simulation/gisSimulator";
      let headers = {
        "Content-Type": "multipart/form-data",
      };
      axios
        .post(url, formData, { headers: headers })
        .then((res) => {
          loading.close();
          this.$message({
            message: "仿真环境上传成功",
            type: "success",
          });
          this.getTaskList();
        })
        .catch((err) => {
          console.log(err);
          loading.close();
          this.$message({
            message: "仿真环境上传失败",
            type: "error",
          });
        });
    },
    // 点击任务
    clickTask(task) {
      this.$emit("onChangeTask",task);
    }
  },
};
</script>
<style lang="scss" scoped>
// 标题
.title {
  text-align: center;
  font-size: 48px;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
  font-weight: bold;
  color: #1f4e79;
}

// 页面主体布局
.layout-main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin: 10px auto;
  padding: 20px 10px;

  border-radius: 10px;
  box-shadow: 1px 1px 4px 2px rgba(39, 56, 98, 0.2);

  .layout-row {
    width: 100%;
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

.line {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
</style>
  