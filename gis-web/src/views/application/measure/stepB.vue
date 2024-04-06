<!-- 韧性测度业务流程-步骤二 -->
<template>
  <div>
    <div class="title">常态下的城市韧性测度水平</div>
    <div class="layout-main">
      <!-- 中间 -->
      <div class="panel-middle">
        <!-- 基础图层开关 -->
        <div class="layer-switch-container">
          <span class="label">基础图层：</span>
          <div class="layer-switch" v-for="(name, layer) in layerNames_basic">
            <el-switch v-model="showLayers[layer]" :active-color="layerColors[layer]" @change="onDisplayChange"
              :disabled="!hasLayers_basic[layer]">
            </el-switch>
            <span class="layer-name">{{ name }}</span>
          </div>
        </div>
        <!-- 韧性图层开关 -->
        <div class="layer-switch-container">
          <span class="label">居民区韧性图层：</span>
          <div class="layer-switch" v-for="(name, layer) in layerNames_residential">
            <el-switch v-model="showLayers[layer]" :active-color="layerColors[layer]"
              :disabled="IsReadyResidentialAreas[layer]" @change="onDisplayChange(layer)">
            </el-switch>
            <span class="layer-name">{{ name }}</span>
          </div>
        </div>
        <!-- 风险区域开关 -->
        <div class="layer-switch-container">
          <span class="label">居民区风险区域：</span>
          <div class="layer-switch" v-for="(name, layer) in layerNames_residential_dangerous">
            <el-switch v-model="showLayers[layer]" :active-color="layerColors[layer]"
              :disabled="IsReadyResidentialAreas[layer]" @change="onDisplayChange(layer)">
            </el-switch>
            <span class="layer-name">{{ name }}</span>
          </div>
        </div>
        <!-- 地图 -->
        <div id="Map" class="aMap"></div>
      </div>
      <!-- 右侧 -->
      <div class="panel-right">
        <el-card>
          <div slot="header">
            <span class="card-title">人均可获得应急服务水平</span>
          </div>
          <div class="chart-container">
            <div id="chartEmergency" class="chart"></div>
          </div>
        </el-card>
        <el-card>
          <div slot="header">
            <span class="card-title">人均可获得日常服务水平</span>
          </div>
          <div class="chart-container">
            <div id="chartDaily" class="chart"></div>
          </div>
        </el-card>
        <el-card v-show="false">
          <div slot="header">
            <span class="card-title">人均可获得基础服务水平</span>
          </div>
          <div class="chart-container">
            <div id="chartBasic" class="chart"></div>
          </div>
        </el-card>
      </div>
      <!-- 弹窗 -->
      <div ref="popupPlanPoint">
        <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPlanPoint">
          <!--            保证个性规划选点时不会无限选点-->
          <div id="popupPlanPoint" slot="reference"></div>
          <div style="text-align: center;" v-if="showResidentialAreas">
            <p style="color:#000"><strong>坐标：</strong>{{
              `(${currentResidentialAreaInfo['position'][0].toFixed(3)},${currentResidentialAreaInfo['position'][1].toFixed(3)})`
            }}
            </p>
            <p style="color:#000"><strong>得分：</strong>{{
              `${currentResidentialAreaInfo['score'].toFixed(4)}`
            }}
            </p>
            <span>
              <el-button type="primary"
                @click="$refs.mapInfoPlanPoint.showPopper = false; $data.showResidentialAreas = false">取消</el-button>
            </span>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>
  
<script>
import *  as Layers from '../common/layers'; // 导入图层相关常变量
import *  as Charts from '../common/charts'; // 导入图表相关常变量
import *  as Data from '../common/data'; // 导入数据相关常变量

// 图表相关函数
import *  as chartUtils from '../chartUtils'

// 地图相关函数
import *  as mapUtils from '../mapUtils'
import IconHospital from '../assets/hospital.png'
import IconEmergencyMedical from '../assets/emergencymedical.png'
import IconShelter from '../assets/shelter.png'
import IconFirehouse from '../assets/firehouse.png'
import IconEducation from '../assets/education.png'
import IconCommercialRetail from '../assets/commercialretail.png'
import IconGoods from '../assets/goods.png'
import IconEmployment from '../assets/employment.png'
import IconCommunicationBaseStation from '../assets/communicationbasestation.png'

// 后端请求相关函数
import *  as requestUtils from '../requestUtils'
// 城市服务性能(评估在给定 城市、规划方案、洪涝参数 的条件下，城市某服务(应急服务，日常服务)的指标 )相关的后端请求
import * as cityServicePerformanceAPI from '../cityServicePerformanceAPI'

export default {
  name: "stepB",
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
      /****  时刻 ****/
      activeTimeIndex: 0,             //当前时刻
      maxTimeIndex: 6,                //最大时刻
      timeControlDisabled: true,      //是否可以切换时刻
      stepTimeMap: {                  //index映射到真实时刻，用在时间条中
        0: 0,
        1: 4,
        2: 8,
        3: 12,
        4: 16,
        5: 20,
        6: 24
      },
      /****  灾害信息 ****/
      taskId: 0,

      /****  规划方案 ****/
      bottomMap: 'now',
      nowPlanId: '0',

      /****  地图 ****/
      map: null,                           //openlayers地图
      offlineMapLayer: null,               //离线地图图层
      zoomLevel: 10,                       //地图缩放级别

      /*地图当中的贴图*/

      iconEmergencyMedical: IconEmergencyMedical,  //应急医疗对应的贴图
      iconShelter: IconShelter,  //应急避难场所对应的贴图
      iconReliefMaterial: IconGoods,      //救灾物资对应的贴图
      iconFirehouse: IconFirehouse,       //消防站对应的贴图
      iconHospital: IconHospital,          //医院对应的贴图
      iconEducation: IconEducation,              //学校对应的贴图
      iconEmployment: IconEmployment,       //就业对应的贴图
      iconCommercialRetail: IconCommercialRetail,       //商业零售对应的贴图
      iconCommunicationBaseStation: IconCommunicationBaseStation,       //通信基站对应的贴图

      // 弹窗
      popUpPlanPoint: null,                 //弹窗需要的内容
      currentPositionPlanPoint: [0, 0],          //当前点击点的坐标
      currentResidentialAreaInfo: {},          //当前热力图显示的居民区区域的信息
      showResidentialAreas: false,            //显示居民区热力图的弹窗

      // 文件
      dataFileList: Data.dataFileList,

      /****  图层 ****/
      layerNames_basic: Layers.layerNames_basic,//基础图层名称
      layerNames_residential: Layers.layerNames_residential,//居民区韧性图层
      layerNames_residential_dangerous: Layers.layerNames_residential_dangerous,//居民区韧性图层
      layerColors: Layers.layerColors,//图层颜色
      hasLayers_basic: //是否有基础图层数据
      {
        'road': false,
        'building': false,
        'reserveLands': false,
        'municipalFacilities': false,
        'hospitals': false,
        'CommunicationBaseStation': false
      },
      showLayers: //图层显示状态
      {
        'road': false,
        'building': false,
        'reserveLands': true,
        'municipalFacilities': true,
        'hospitals': true,
        'CommunicationBaseStation': false,
        'Aid': false,
        'Shelter': false,
        'Supply': false,
        'Break': false,
        'Hospital': false,//这个Hospital是在居民区韧性图层中的医疗设施，上面的hospital是在基础图层中的医院
        'School': false,
        'Work': false,
        'Shopping': false,
        'gridDangerousArea': false,
        'AidDangerousArea': false,
        'ShelterDangerousArea': false,
        'SupplyDangerousArea': false,
        'BreakDangerousArea': false,
        'HospitalDangerousArea': false,//这个Hospital是在居民区韧性图层中的医疗设施，上面的hospital是在基础图层中的医院
        'SchoolDangerousArea': false,
        'WorkDangerousArea': false,
        'ShoppingDangerousArea': false,
      },
      IsReadyResidentialAreas: //居民区韧性图层是否准备好，准备好之后才打开该开关
      {
        'Aid': true,
        'Shelter': true,
        'Supply': true,
        'Break': true,
        'Hospital': true,
        'School': true,
        'Work': true,
        'Shopping': true,
        'AidDangerousArea': true,
        'ShelterDangerousArea': true,
        'SupplyDangerousArea': true,
        'BreakDangerousArea': true,
        'HospitalDangerousArea': true,
        'SchoolDangerousArea': true,
        'WorkDangerousArea': true,
        'ShoppingDangerousArea': true
      },
      //城市风险预警区域 的 半径
      layerDangerousAreaRadius: {
        'Hospital': 6000,
        'School': 4000,
        'Shopping': 1000,
        'Aid': 10000,
        'Shelter': 2500,
        'Supply': 2500,
        'Break': 5000,
        'Work': 1000
      },
      layerDangerousAreaThreshold: {
        'Hospital': 2,
        'School': 2,
        'Shopping': 2,
        'Aid': 10,
        'Shelter': 10,
        'Supply': 10,
        'Break': 10,
        'Work': 2
      },
      layers_basic: {},                  //基础图层
      layers_residential: {},            //居民区韧性图层
      layers_residential_dangerous: {},       //居民区风险预警图层
      disjointListResidential: {},       //居民区韧性图层中的薄弱区域
      currentCommunicationBaseStationLayer: null, //通信基站图层

      resultMaxLen: 15000,                // 图层形状最大显示数量

      /*通信基站服务能力数据*/
      currentAvailableCommunicationBaseStationServiceArea: 1, //当前可用的通信基站覆盖范围
      currentNotAvailableCommunicationBaseStationServiceArea: 0, //当前不可用的通信基站覆盖范围
      currentCommunicationBaseStationServiceCapacity: 1.0, //当前通信基站的服务能力,为百分数

      /****  图表 ****/
      maxchartBasicValues: [1, 1, 1, 1],
      normalchartBasicValues: [1, 1, 1, 1],
      chartBasicNames: ['通讯基站', '垃圾处理厂', '变电站', '污水处理厂'],
      chartBasicCodes: ['BaseStation', 'RefuseProcessingPlant', 'TransformerSubstation', 'WaterSupplyPlant'],
      chartBasicValues: {
        '0': [1, 1, 1, 1],
        '4': [0, 0, 0, 0],
        '8': [0, 0, 0, 0],
        '12': [0, 0, 0, 0],
        '16': [0, 0, 0, 0],
        '20': [0, 0, 0, 0],
        '24': [0, 0, 0, 0]
      },


      maxEmergencyValues: Charts.maxEmergencyValues,
      emergencyNames: Charts.emergencyNames,
      emergencyCodes: Charts.emergencyCodes,
      normalEmergencyValues: [0, 0, 0, 0],
      emergencyValues: {
        '0': [0, 0, 0, 0],
        '4': [0, 0, 0, 0],
        '8': [0, 0, 0, 0],
        '12': [0, 0, 0, 0],
        '16': [0, 0, 0, 0],
        '20': [0, 0, 0, 0],
        '24': [0, 0, 0, 0]
      },

      maxDailyValues: Charts.maxDailyValues,
      dailyNames: Charts.dailyNames,
      dailyCodes: Charts.dailyCodes,
      normalDailyValues: [0, 0, 0, 0],
      dailyValues: {
        '0': [0, 0, 0, 0],
        '4': [0, 0, 0, 0],
        '8': [0, 0, 0, 0],
        '12': [0, 0, 0, 0],
        '16': [0, 0, 0, 0],
        '20': [0, 0, 0, 0],
        '24': [0, 0, 0, 0]
      },

      //应急服务图表-右侧
      chartEmergency: null,
      //日常服务图表-右侧
      chartDaily: null,
      //基础设施韧性图表-右侧
      chartBasic: null,

      // 自动规划
      CanAutoPlan: {
        isTimeReady: false,//时间是否达到自动规划所需要的时间
        isFileCircleReady: false,//危险范围的数据csv是否正确生成
        isFilePointReady: false,//危险社区点的数据csv是否正确生成
        isFileExistPointReady: false//当前已存在点数据是否正确生成
      },

      disableAutoPlanButton: true,//禁用自动规划按钮
      disableSaveAutoPlanButton: true,//禁用保存自动规划数据按钮
      existPlanPoint: [], //当前已有的规划点数据
      
      // 是否停止轮询，离开页面时停止
      stopContinuousRequest: false,
    };
  },
  mounted() {
    this.init()
    window.onresize = () => {
      if (this.chartMeasure) {
        chartUtils.resizeChartCol(this.chartEmergency, 'chartEmergency')
        chartUtils.resizeChartCol(this.chartDaily, 'chartDaily')
        chartUtils.resizeChartCol(this.chartBasic, 'chartBasic')
      }
    }
  },
  beforeDestroy() {
    // 离开页面时停止所有轮询
    this.stopContinuousRequest = true;
  },
  methods: {
    // 切换显示图层
    onDisplayChange(layer) {

      //使得居民区韧性图层当中只有一个按钮可以被点亮
      if (layer in this.layerNames_residential) {
        for (const key in this.layerNames_residential) {
          if (key !== layer) {
            this.showLayers[key] = false
          }
        }
      }

      //使得居民区风险区域图层当中只有一个按钮可以被点亮
      if (layer in this.layerNames_residential_dangerous) {
        for (const key in this.layerNames_residential_dangerous) {
          if (key !== layer) {
            this.showLayers[key] = false
          }
        }
      }
      // 基础图层
      for (let type in this.hasLayers_basic) {
        if (this.hasLayers_basic[type]) {
          if (this.showLayers[type]) {
            if (this.layers_basic[type]) {
              this.onMapAddLayer(this.layers_basic[type])
            }
          } else {
            if (this.layers_basic[type]) {
              this.map.removeLayer(this.layers_basic[type])
            }
          }
        }
      }
      //居民韧性测度图层
      for (let type in this.layerNames_residential) {
        if (this.showLayers[type]) {
          if (this.layers_residential[type]) {
            this.onMapAddLayer(this.layers_residential[type])
          }
        } else {
          if (this.layers_residential[type]) {
            this.map.removeLayer(this.layers_residential[type])
          }
        }
      }

      //居民区风险区域图层
      for (let type in this.layerNames_residential_dangerous) {
        if (this.showLayers[type]) {
          if (this.layers_residential_dangerous[type]) {
            this.onMapAddLayer(this.layers_residential_dangerous[type])
          }
        } else {
          if (this.layers_residential_dangerous[type]) {
            this.map.removeLayer(this.layers_residential_dangerous[type])
          }
        }
      }

      // 通信基站图层
      if (this.showLayers.CommunicationBaseStation) {
        if (this.currentCommunicationBaseStationLayer) {
          this.onMapAddLayer(this.currentCommunicationBaseStationLayer)
        }
      } else {
        if (this.currentCommunicationBaseStationLayer) {
          this.map.removeLayer(this.currentCommunicationBaseStationLayer)
        }
      }

    },
    // 为地图添加图层，防止重复添加
    onMapAddLayer(layer) {
      const layers = this.map.getLayers()
      const layerName = layer.get('layerName')
      let hasLayer = false
      layers.forEach((item) => {
        if (item.get('layerName') === layerName) {
          hasLayer = true
        }
      })
      if (!hasLayer) {
        this.map.addLayer(layer)
      }
    },
    //初始化
    async init() {
      // 初始化地图
      mapUtils.initOL(this)
      mapUtils.initOLMap(this)

      // 获取数据信息和基础图层
      requestUtils.getDataInfo(this)

      // 初始化四个图表
      // 人均可获得 应急/日常服务图 用饼图展示
      this.chartEmergency = chartUtils.buildPieChart(this.emergencyNames, this.maxEmergencyValues, this.normalEmergencyValues, this.emergencyValues[this.stepTimeMap[this.activeTimeIndex]], 'chartEmergency', 'customed')
      chartUtils.resizeChartCol(this.chartEmergency, 'chartEmergency')
      this.chartDaily = chartUtils.buildPieChart(this.dailyNames, this.maxDailyValues, this.normalDailyValues, this.dailyValues[this.stepTimeMap[this.activeTimeIndex]], 'chartDaily', 'westeros')
      chartUtils.resizeChartCol(this.chartDaily, 'chartDaily')
      this.chartBasic = chartUtils.buildPieChart(this.chartBasicNames, this.maxchartBasicValues, this.normalchartBasicValues, this.chartBasicValues[this.stepTimeMap[this.activeTimeIndex]], 'chartBasic', 'macarons')
      chartUtils.resizeChartBottom(this.chartBasic, 'chartBasic')

      // 添加事件处理
      mapUtils.buildResidentialAreasAtTime(this, 0)//处理居民区热力图的函数
      mapUtils.buildCommunicationBaseStationAtTime(this, 0)//处理通信基站的函数
      mapUtils.addOverlay(this)//添加点击后弹窗的overlay
      mapUtils.signleClickPlanPoint(this, this) //点击个性规划点之后的处理函数，该函数只处理个性规划点
      mapUtils.pointermove(this)//点击个性规划点之后的处理函数，该函数只处理个性规划点

      // 更新右侧的饼图
      this.handle8ServiceOnPlanSelected(this.city, this.bottomMap, this.nowPlanId)
    },
    //这个函数是一个综合的轮询器
    async continuousRequest(request, city, count, ...args) {
      if(this.stopContinuousRequest){
        return Promise.reject()
      }
      const res = await request(...args)
      console.log('res continue', res)
      if (res.code === 1) {
        // console.log(res.value)
        return Promise.resolve(res.value)
      }
      if (res.code === -1 || count > 3600 || this.city !== city) {
        // console.log(`continuousRequestError`, `${request}`)
        if (this.city !== city) {
          return Promise.reject('switchCity')
        }
        return Promise.reject()
      }
      console.log(`${request}`, '10s之后再来一次')
      await new Promise((resolve) => setTimeout(() => resolve(), 10000))
      return this.continuousRequest(request, city, count + 1, ...args)
    },
    //这个函数用于在选定了城市和规划方案之后，计算并显示右侧两张饼图的数据
    // city: this.city
    // mapName: this.bottomMap
    // planId: this.nowPlanId
    handle8ServiceOnPlanSelected(city, mapName, planId) {
      this.handleEmergencyServiceOnPlanSelected(city, mapName, planId)
      this.handleDailyServiceOnPlanSelected(city, mapName, planId)
      this.handleResidentialAreaOnPlanSelected()
    },
    async handleEmergencyServiceOnPlanSelected(city, mapName, planId) {
      // 将应急服务的饼图清空
      chartUtils.updatePieChart(this.chartEmergency, this.emergencyNames, this.maxEmergencyValues, [0, 0, 0, 0], [0, 0, 0, 0], 'customed')
      this.chartEmergency.showLoading()
      let terminate = false
      let emergencyPromiseList = []
      //请求 4个应急服务 的计算
      for (let scheme of this.emergencyCodes) {
        emergencyPromiseList.push(cityServicePerformanceAPI.calculateMeasureNoSimulator(city, mapName, planId, scheme))
      }
      await Promise.all(emergencyPromiseList).catch((err) => {
        console.log('请求计算应急服务失败，请检查网络环境')
        this.sendMessage('请求计算应急服务失败，请检查网络环境', 'warning')
        this.chartEmergency.hideLoading()
        terminate = true
      })

      if (terminate) {
        return
      }

      //轮询请求 4个应急服务 计算的结果
      for (let index in this.emergencyCodes) {
        this.continuousRequest(cityServicePerformanceAPI.getMeasureNoSimulator, city, 1, city, mapName, planId, this.emergencyCodes[index])
          // this.continuousGetMeasureNoSimulator(city, mapName, planId, this.emergencyCodes[index])
          .then(res => {
            this.normalEmergencyValues[index] = res
            //"救灾物资"、"消防救援" 应急服务的推荐值为常态值
            if (this.emergencyCodes[index] === "Supply" || this.emergencyCodes[index] === "Break") {
              this.maxEmergencyValues[index] = res
            }
            chartUtils.updatePieChart(this.chartEmergency, this.emergencyNames, this.maxEmergencyValues, this.normalEmergencyValues, this.normalEmergencyValues, 'customed')
          })
          .catch(err => {
            if (err === 'switchCity') return
            console.log(`请求获取 应急服务${this.emergencyCodes[index]} 数据失败，请检查是否上传了相关的数据`)
            this.sendMessage(`请求获取 应急服务${this.emergencyCodes[index]} 数据失败，请检查是否上传了对应的文件`, 'warning')
            this.chartEmergency.hideLoading()
          })
      }
    },
    async handleDailyServiceOnPlanSelected(city, mapName, planId) {
      chartUtils.updatePieChart(this.chartDaily, this.dailyNames, this.maxDailyValues, [0, 0, 0, 0], [0, 0, 0, 0], 'westeros')
      this.chartDaily.showLoading()
      let terminate = false
      let dailyPromiseList = []
      //请求 4个日常服务 的计算
      for (let scheme of this.dailyCodes) {
        dailyPromiseList.push(cityServicePerformanceAPI.calculateMeasureNoSimulator(city, mapName, planId, scheme))
      }
      await Promise.all(dailyPromiseList).catch((err) => {
        console.log('请求计算日常服务失败，请检查网络环境')
        this.sendMessage('请求计算日常服务失败，请检查网络环境', 'warning')
        this.chartDaily.hideLoading()
        terminate = true
      })

      if (terminate) {
        return
      }

      //轮询请求 4个日常服务 计算的结果
      for (let index in this.dailyCodes) {
        this.continuousRequest(cityServicePerformanceAPI.getMeasureNoSimulator, city, 1, city, mapName, planId, this.dailyCodes[index])
          .then(res => {
            this.normalDailyValues[index] = res
            //"通勤" 日常服务 的推荐值为常态值
            if (this.dailyCodes[index] === 'Work') {
              this.maxDailyValues[index] = res
            }
            chartUtils.updatePieChart(this.chartDaily, this.dailyNames, this.maxDailyValues, this.normalDailyValues, this.normalDailyValues, 'westeros')
          })
          .catch(err => {
            if (err === 'switchCity') return
            console.log(`请求获取 日常服务${this.dailyCodes[index]} 数据失败，请检查是否上传了对应的文件`)
            this.sendMessage(`请求获取 日常服务${this.dailyCodes[index]} 数据失败，请检查是否上传了对应的文件`, 'warning')
            this.chartDaily.hideLoading()
          })
      }
    },
    async handleResidentialAreaOnPlanSelected() {
      mapUtils.buildResidentialAreasAtTime(this, this.stepTimeMap[this.activeTimeIndex]);
      mapUtils.buildCommunicationBaseStationAtTime(this, this.stepTimeMap[this.activeTimeIndex]);
    },
    //重新获取居民区韧性时，重置居民区韧性按钮和图层的状态
    disableAllResidentialAreasBottom() {
      //将居民区韧性按钮全部设置为关闭状态
      this.showLayers['Aid'] = false
      this.showLayers['Shelter'] = false
      this.showLayers['Supply'] = false
      this.showLayers['Break'] = false
      this.showLayers['Hospital'] = false
      this.showLayers['School'] = false
      this.showLayers['Work'] = false
      this.showLayers['Shopping'] = false

      //将居民区韧性图层全部移除
      for (let type in this.layerNames_residential) {
        if (this.layers_residential[type]) {
          this.map.removeLayer(this.layers_residential[type])
        }
      }

      //将居民区韧性按钮全部设置为不可用状态
      this.IsReadyResidentialAreas.Aid = true
      this.IsReadyResidentialAreas.Shelter = true
      this.IsReadyResidentialAreas.Supply = true
      this.IsReadyResidentialAreas.Break = true
      this.IsReadyResidentialAreas.Hospital = true
      this.IsReadyResidentialAreas.School = true
      this.IsReadyResidentialAreas.Work = true
      this.IsReadyResidentialAreas.Shopping = true


    },
    //发送全局提示
    sendMessage(message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
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
  justify-content: flex-start;
  width: 100%;
  margin: 10px 0;
  padding: 20px 10px;

  border-radius: 10px;
  box-shadow: 1px 1px 4px 2px rgba(39, 56, 98, 0.2);
}

// 中间面板
.panel-middle {
  width: auto;
  font-family: "微软雅黑";
  padding-top: 5px;
  margin-left: 10px;
  margin-right: 20px;
  flex-grow: 1;
  flex-shrink: 1;

  // 图层开关
  .layer-switch-container {
    margin: 12px 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-flow: wrap;

    .label {
      font-weight: bold;
      font-size: 16px;
    }

    .layer-switch {
      width: 125px;
    }

    .layer-switch-wider {
      width: 150px;
    }

    .layer-name {
      font-size: 14px;
      margin-left: 5px;
    }
  }

  // 地图
  .aMap {
    width: 100%;
    height: 65vh;
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s;
    box-shadow: 5px 4px 4px 1px rgba(39, 56, 98, 0.2);
    background-color: #eee;
  }

  .aMap:hover {
    box-shadow: 5px 4px 4px 3px rgba(39, 56, 98, 0.5);
  }
}

// 右侧面板
.panel-right {
  width: 30vw;
  min-width: 200px;
  height: 100%;

  .el-card {
    border-radius: 10px;
    transition: 0.3s;
    text-align: center;
    margin-bottom: 5px;

    .card-title {
      text-align: center;
      font-size: 16px;
      color: #000;
      font-weight: bold;
      margin: 0;
    }

  }

  // 图表容器
  .chart-container {
    width: 100%;
    height: 35vh;
  }

  // 图表
  .chart {
    height: 100%;
    transition: 0.3s;
  }
}
</style>
  