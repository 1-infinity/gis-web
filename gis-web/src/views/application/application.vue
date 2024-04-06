<template>
  <div class="app-container">
    <div class="layout-main">
      <!-- 左侧 -->
      <div v-if="false" class="panel-info">
        <div class="card">
          <div class="line">
            <p class="label">
              <i class="el-icon-position"></i>
              城市：
            </p>
            <p>{{ cityName }}</p>
          </div>
          <div class="line">
            <p class="label">
              <i class="el-icon-warning-outline"></i>
              灾害类型：
            </p>
            <p>{{ typeNames[type] }}</p>
          </div>
        </div>
        <div class="card">
          <p class="card-title">
            风险点
          </p>
          <el-table :data="riskData" max-height="200" size="mini" :header-cell-style="{ 'text-align': 'center' }"
                    :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column property="name" label="名称"></el-table-column>
            <el-table-column property="value" label="风险值" width="80"></el-table-column>
          </el-table>
        </div>
        <div class="card">
          <!-- 模拟任务信息 -->
          <div class="line">
            <p class="label">
              <i class="el-icon-time"></i>
              模拟计算时间：
            </p>
            <p>{{ infoTask.computeTime }}</p>
          </div>
          <!-- 暴雨灾害模拟信息 -->
          <div v-show="type == 'flood'">
            <div class="line">
              <p class="label">
                <i class="el-icon-heavy-rain"></i>
                淹没区域数量：
              </p>
              <p>{{ infoFlood.waterCount }}</p>
            </div>
            <div class="line">
              <p class="label">
                <i class="el-icon-s-grid"></i>
                淹没总面积：
              </p>
              <p>{{ infoFlood.waterArea }}</p>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="line">
            <p class="label">
              重置视图：
            </p>
            <button class="controlButton" @click="resetView">
              <i class="el-icon-location-information controlIcon"></i>
            </button>
          </div>
        </div>
        <div class="card">
          <div class="line">
            <p class="label">
              显示城市空间稳健度：
            </p>
            <button class="controlButton">
              <i class="el-icon-office-building controlIcon"></i>
            </button>
          </div>
          <div class="line">
            <p class="label">
              显示交通韧性：
            </p>
            <button class="controlButton">
              <i class="el-icon-pie-chart controlIcon"></i>
            </button>
          </div>
          <div class="line">
            <p class="label">
              显示道路连通子图：
            </p>
            <button class="controlButton">
              <i class="el-icon-s-grid controlIcon"></i>
            </button>
          </div>
          <div class="line">
            <p class="label">
              显示道路网络连通效率：
            </p>
            <button class="controlButton">
              <i class="el-icon-s-grid controlIcon"></i>
            </button>
          </div>
          <div class="line">
            <p class="label">
              显示医疗服务测度：
            </p>
            <button class="controlButton">
              <i class="el-icon-school controlIcon"></i>
            </button>
          </div>
          <div class="line">
            <p class="label">
              显示医疗服务灾害测度：
            </p>
            <button class="controlButton">
              <i class="el-icon-school controlIcon"></i>
            </button>
          </div>
          <div class="line">
            <p class="label">
              显示危化品爆炸范围：
            </p>
            <button class="controlButton">
              <i class="el-icon-sunrise controlIcon"></i>
            </button>
          </div>
        </div>

        <div class="card">
          <div class="line">
            <p class="label">
              导出结果：
            </p>
            <button class="controlButton">
              <i class="el-icon-download controlIcon"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- 中间 -->
      <div class="panel-middle">
        <div class="layer-switch-container" v-show="currentSimulationType != ''">
          <span class="label">模拟任务序号：</span>
          <span style="margin-right: 100px;">{{ taskId }}</span>
          <span class="label">灾害类型：</span>
          <span style="margin-right: 100px;">{{ typeNames[currentSimulationType] }}</span>
          <span class="joint-plan-edit" style="margin-right: 50px;">

            <el-button type="primary" icon="el-icon-edit" round @click="handleJointPreventionPlanGenerate()">
              编辑联防联控预案
            </el-button>
          </span>
          <span v-if="jointPlanEditMode">
            <el-button type="info" icon="el-icon-circle-close" round @click="handleJointPreventionPlanExit()">
              退出编辑模式
            </el-button>
          </span>
          <span class="label" v-if="currentSimulationType === 'infection'">管控措施类型：</span>
          <span v-if="currentSimulationType === 'infection'">{{ infectionLockTypeNames[currentTask.lockType] }}</span>
        </div>
        <div class="time-step-controler" v-show="currentSimulationType === 'infection'">
          <span class="label" style="width:150px;">当前时间(天)：</span>
          <el-slider v-model="currentInfectionDay" :disabled="timeControlDisabled" @change="onInfectionDayChange"
                     style="width:100%;" :min="1" :max="maxInfectionDay" :step="1" show-input
          >
          </el-slider>
        </div>
        <div class="time-step-controler" v-show="currentSimulationType !== ''">
          <span class="label" style="width:150px;">当前时间(时)：</span>
          <el-steps align-center :active="activeTimeIndex" style="width: 80%">
            <el-step v-for="(step, index) in stepTimeMap" :key="index" :title="`时刻:${step}`"></el-step>
          </el-steps>
          <el-button style="margin-left: 16px" @click="previous" :disabled="timeControlDisabled || activeTimeIndex < 1"
                     type="primary"
          >
            上一时刻
          </el-button>
          <el-button style="margin-left: 16px" @click="next"
                     :disabled="timeControlDisabled || activeTimeIndex > maxTimeIndex - 1" type="primary"
          >下一时刻
          </el-button>
        </div>
        <div class="layer-switch-container">
          <span class="label">基础图层：</span>
          <div class="layer-switch" v-for="(name, layer) in layerNames_basic">
            <el-switch v-model="showLayers[layer]" :active-color="layerColors[layer]" @change="onDisplayChange"
                       :disabled="!hasLayers_basic[layer]"
            >
            </el-switch>
            <span class="layer-name">{{ name }}</span>
          </div>
        </div>
        <div class="layer-switch-container" v-show="city === 'shaoxing'">
          <span class="label">交通压力测度图层：</span>
          <div class="layer-switch-wider">
            <el-switch v-model="showLayers.trafficPressure" @change="onDisplayChange">
            </el-switch>
            <span class="layer-name">交通压力测度</span>
          </div>
        </div>
        <div class="layer-switch-container">
          <span class="label">居民区韧性图层：</span>
          <div class="layer-switch" v-for="(name, layer) in layerNames_residential">
            <el-switch v-model="showLayers[layer]" :active-color="layerColors[layer]"
                       :disabled="IsReadyResidentialAreas[layer]" @change="onDisplayChange(layer)"
            >
            </el-switch>
            <!--            <el-switch v-model="showLayers[layer]" :active-color="layerColors[layer]" :disabled=true @change="onDisplayChange(layer)">-->
            <!--            </el-switch>-->
            <span class="layer-name">{{ name }}</span>
          </div>

        </div>
        <div class="layer-switch-container">
          <span class="label">居民区风险区域：</span>
          <div class="layer-switch" v-for="(name, layer) in layerNames_residential_dangerous">
            <el-switch v-model="showLayers[layer]" :active-color="layerColors[layer]"
                       :disabled="IsReadyResidentialAreas[layer]" @change="onDisplayChange(layer)"
            >
            </el-switch>
            <!--            <el-switch v-model="showLayers[layer]" :active-color="layerColors[layer]" :disabled=true @change="onDisplayChange(layer)">-->
            <!--            </el-switch>-->
            <span class="layer-name">{{ name }}</span>
          </div>

        </div>
        <div class="layer-switch-container" v-if="currentSimulationType === 'flood'">
          <span class="label">模拟图层(暴雨洪涝)：</span>
          <div class="layer-switch" v-for="(name, layer) in layerNames_flood">
            <el-switch v-model="showLayers[layer]" :active-color="layerColors[layer]" @change="onDisplayChange">
            </el-switch>
            <span class="layer-name">{{ name }}</span>
          </div>
        </div>
        <div class="layer-switch-container" v-if="currentSimulationType === 'infection'">
          <span class="label">模拟图层(传染病)：</span>
          <div class="layer-switch-wider" v-for="(name, layer) in layerNames_infection">
            <el-switch v-model="showLayers[layer]" :active-color="layerColors[layer]"
                       :disabled="!currentInfectionGridLayer" @change="onDisplayChange"
            >
            </el-switch>
            <span class="layer-name">{{ name }}</span>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div>
            <span style="font-size:14px;">显示类型：</span>
            <el-select v-model="currentInfectionShowType" style="width:150px;" @change="onInfectionShowChange"
                       :disabled="!currentInfectionGridLayer"
            >
              <el-option v-for="item in infectionShowTypes" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="layer-switch-wider">
            <el-switch v-model="showLayers.riskInfection" :active-color="layerColors['riskInfection']"
                       :disabled="!currentInfectionGridLayer" @change="onDisplayChange"
            >
            </el-switch>
            <span class="layer-name">感染高风险区域</span>
          </div>
          <div>
            <span style="font-size:14px;">感染人数阈值：</span>
            <el-input-number v-model="thresholdInfected" :disabled="!currentInfectionGridLayer" style="width:100px;"
              :min="1" :precision="0" :step="1" size="small"></el-input-number>
            <el-button type="primary" size="small" @click="updateInfectionRisk"
              :disabled="updateRiskDisabled || !currentInfectionGridLayer" plain>更新</el-button>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div v-if="currentTask && currentTask.lockType === 0">
            <span style="font-size:14px;">生成强化学习决策模拟：</span>
            <el-button type="primary" size="small" :disabled="!hasPolicy" @click="onUpdateMADDPG" plain>生成</el-button>
          </div>

          <!-- <el-divider direction="vertical"></el-divider>
          <div>
            <span style="font-size:14px;">显示时间(天)：</span>
            <el-input-number v-model="currentInfectionDay" @change="onInfectionShowChange" style="width:100px;" :min="1"
              :disabled="!currentInfectionGridLayer" :max="maxInfectionDay" :precision="0" :step="1"
              size="small"></el-input-number>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div>
            <span style="font-size:14px;">显示时间(时)：</span>
            <el-input-number v-model="currentInfectionHour" @change="onInfectionShowChange" style="width:100px;" :min="1"
              :disabled="!currentInfectionGridLayer" :max="24" :precision="0" :step="1" size="small"></el-input-number>
          </div> -->
        </div>
        <div id="Map" class="aMap"></div>
        <div class="chart-layout-middle" v-show="currentSimulationType === 'infection'">
          <div class="chart-container chart-container-infection" style="position:relative;">
            <div id="chartInfection" class="chart"></div>
            <div style="position:absolute; top:3px;right:3px">
              <el-popover placement="bottom" trigger="hover">
                <el-table :data="infectionSimulationList" max-height="200" size="mini" style="width: 30vw;"
                          :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }"
                >
                  <el-table-column property="id" label="序号" width="50"></el-table-column>
                  <el-table-column property="city" label="城市" width="60">
                    <template slot-scope="scope">
                      <span>{{ getCityName(scope.row.city) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="任务提交时间">
                    <template slot-scope="scope">
                      <span v-if="scope.row.simulationType === 'flood'">{{ scope.row.simulationDate }}</span>
                      <span v-if="scope.row.simulationType === 'infection'">{{ scope.row.simulationTime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column property="city" label="管控措施类型" width="120">
                    <template slot-scope="scope">
                      <span>{{ infectionLockTypeNames[scope.row.lockType] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column property="status" label="状态" width="50">
                    <template slot-scope="scope">
                      <i class="el-icon-loading" v-if="scope.row.status === 'processing'"></i>
                      <i class="el-icon-success" v-if="scope.row.status === 'finish'" style="color: green"></i>
                      <i class="el-icon-error" v-if="scope.row.status === 'failed'" style="color: crimson"></i>
                    </template>
                  </el-table-column>
                  <el-table-column label="参数" width="50">
                    <template slot-scope="scope">
                      <el-popover placement="right" width="500" trigger="hover">
                        <div>
                          <div class="line">
                            <p class="label">
                              管控措施类型：
                            </p>
                            <p>{{ infectionLockTypeNames[scope.row.lockType] }}</p>
                          </div>
                          <div class="line">
                            <p class="label">
                              模拟总时长：
                            </p>
                            <p>{{ scope.row.para_json.simulation_days * 24 }}</p>
                          </div>
                          <div class="line">
                            <p class="label">
                              感染者住院率：
                            </p>
                            <p>{{ scope.row.para_json.I_H_para }}</p>
                          </div>
                          <div class="line">
                            <p class="label">
                              感染者自愈率：
                            </p>
                            <p>{{ scope.row.para_json.I_R_para }}</p>
                          </div>
                          <div class="line">
                            <p class="label">
                              住院者治愈率：
                            </p>
                            <p>{{ scope.row.para_json.H_R_para }}</p>
                          </div>
                          <div class="line">
                            <p class="label">
                              初始感染点：
                            </p>
                            <p>{{ scope.row.para_json.region_list }}</p>
                          </div>
                          <div class="line">
                            <p class="label">
                              初始感染人数：
                            </p>
                            <p>{{ scope.row.para_json.I_input }}</p>
                          </div>
                          <div class="line" v-if="scope.row.lockType === 1">
                            <p class="label">
                              封锁区域：
                            </p>
                            <p>{{ scope.row.para_json.lock_area }}</p>
                          </div>
                          <div class="line" v-if="scope.row.lockType === 1">
                            <p class="label">
                              封锁时长：
                            </p>
                            <p>{{ scope.row.para_json.lock_day }}</p>
                          </div>
                        </div>
                        <i class="el-icon-view" slot="reference" style="margin-right: 5px;"></i>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" icon="el-icon-plus" :disabled="scope.row.status !== 'finish'"
                                 @click="onAddInfectionChart(scope.row)"
                      >
                        添加
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button icon="el-icon-arrow-down" slot="reference" size="mini" style="padding:3px 8px;"
                           type="primary"
                           plain
                ></el-button>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="chart-layout-middle" v-show="currentSimulationType !== 'infection'">
          <div class="chart-container">
            <div id="chartService" class="chart"></div>
          </div>
        </div>
        <div v-show="false" class="chart-layout-bottom">
          <div class="chart-container">
            <div id="chartMeasure" class="chart"></div>
          </div>
        </div>
        <!--        <div class="chart-layout-bottom">-->
        <!--           <div class="chart-container">-->
        <!--            <div id="chartFlood" class="chart"></div>-->
        <!--           </div>-->
        <!--        </div>-->

        <!-- 弹窗 -->
        <div ref="popupPlanPoint">
          <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPlanPoint">
            <!--            保证个性规划选点时不会无限选点-->
            <div id="popupPlanPoint" slot="reference"></div>
            <div style="text-align: center;" v-if="showMannualPlanPopUp">
              <p style="color:#000"><strong>坐标：</strong>{{
                  `(${nowSelectPlanPoint.position[0].toFixed(3)},${nowSelectPlanPoint.position[1].toFixed(3)})`
                }}
              </p>
              <p style="color:#000"><strong>规模：</strong>
                <el-select v-model="ValuePlanPointScale" placeholder="请选择设施的规模" style="width: 150px"
                           @change="handleSelectScale"
                >
                  <el-option v-for="item in optionsPlanPointScale" :key="item.value" :label="item.label"
                             :value="item.value"
                  >
                  </el-option>
                </el-select>
              </p>
              <p style="color:#000"><strong>容量：</strong>
                <el-input v-model="ValuePlanPointCapacity" placeholder="请输入设施的设计容量" style="width: 150px"
                ></el-input>
                m²
              </p>
              <span>
                <el-button type="primary" @click="handleMannualPlan" style="margin-left: 30px">确定</el-button>
              </span>
            </div>

            <div style="text-align: center;" v-else-if="showPlanPointUp">
              <p style="color:#000"><strong>坐标：</strong>{{
                  `(${currentPositionPlanPoint[0].toFixed(3)},${currentPositionPlanPoint[1].toFixed(3)})`
                }}
              </p>
              <p style="color:#000"><strong>类型：</strong>
                {{ nowSelectType }}
              </p>
              <p style="color:#000"><strong>容纳量：</strong>
                {{ nowSelectCapacity }}
              </p>
              <span>
                <el-button type="primary"
                           @click="$refs.mapInfoPlanPoint.showPopper = false; $data.showPlanPointUp = false"
                >取消</el-button>
              </span>
            </div>

            <div style="text-align: center;" v-else-if="showResidentialAreas">
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
                           @click="$refs.mapInfoPlanPoint.showPopper = false; $data.showResidentialAreas = false"
                >取消</el-button>
              </span>
            </div>

            <!--            <div style="text-align: center;" v-else>-->
            <!--              <p style="color:#000"><strong>非法逻辑，请检查进入逻辑是否正确</strong>-->
            <!--              </p>-->
            <!--              <span>-->
            <!--                <el-button type="primary" @click="$refs.mapInfoPlanPoint.showPopper = false">确定</el-button>-->
            <!--              </span>-->
            <!--            </div>-->

          </el-popover>
        </div>
        <!-- 道路防灾等级弹窗 -->
        <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPopoverRoad">
          <div id="popupRoad" slot="reference"></div>
          <div style="text-align: center;">
            <span style="color:#000;font-weight:bold;">{{ popInfoRoad.id }}号道路</span>
            <p style="color:#000"><strong>坐标：</strong>{{
                `(${popInfoRoad.coord[0].toFixed(3)},${popInfoRoad.coord[1].toFixed(3)})`
              }}
            </p>
            <p style="color:#000"><strong>防灾等级：</strong>{{ popInfoRoad.newLevel }}</p>
            <span>
              <el-button @click="$refs.mapInfoPopoverRoad.showPopper = false">取消</el-button>
              <el-button type="primary" @click="modifyRoadLevel">修改防灾等级</el-button>
            </span>
          </div>
        </el-popover>
        <!-- 传染病网格弹窗 -->
        <div ref="popupInfection">
          <el-popover placement="right" width="300" trigger="manual" ref="mapInfoPopoverInfection">
            <div id="popupInfection" slot="reference"></div>
            <div style="text-align: center;">
              <span style="color:#000;font-weight:bold;">{{ popInfoInfection.id }}号网格</span>
              <p style="color:#000"><strong>坐标：</strong>{{
                  `(${popInfoInfection.coords[0][0].toFixed(3)},${popInfoInfection.coords[0][1].toFixed(3)})`
                }}
              </p>
              <p style="color:#000"><strong>人数：</strong>{{
                  popInfoInfection.value.toFixed(0)
                }}
              </p>
              <span>
                <el-button @click="$refs.mapInfoPopoverInfection.showPopper = false">关闭</el-button>
              </span>
            </div>
          </el-popover>
        </div>
        <!-- 交通压力弹窗 -->
        <el-popover placement="right" width="300" trigger="manual" ref="trafficInfo">
          <div id="trafficRoad" slot="reference"></div>
          <div style="text-align: center;">
            <p style="color:#000"><strong>ab_Flow：</strong>{{ trafficInfoData.flow1 }}</p>
            <p style="color:#000"><strong>ab_VOC：</strong>{{ trafficInfoData.voc1 }}</p>
            <p style="color:#000"><strong>ba_Flow：</strong>{{ trafficInfoData.flow2 }}</p>
            <p style="color:#000"><strong>ba_VOC：</strong>{{ trafficInfoData.voc2 }}</p>
            <span>
              <el-button @click="$refs.trafficInfo.showPopper = false">取消</el-button>
            </span>
          </div>
        </el-popover>
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
    </div>
    <div class="showdrawer-button">
      <el-button icon="el-icon-arrow-right" type="primary" @click="showSettingPanel = true"></el-button>
    </div>
    <!-- 设置面板 -->
    <el-drawer class="setting-panel" title="设置面板" :visible.sync="showSettingPanel" direction="ltr" :modal="false"
               :wrapperClosable="false" style="position: absolute;" width="30%" :before-close="handSettingPanelClose"
    >
      <p slot="title" class="setting-panel-title">设置面板</p>
      <div class="setting-container">
        <div class="line">
          <span class="label">模拟区域:</span>
          <el-cascader :options="areaOptions" placeholder="城市" :show-all-levels="false" v-model="area">
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </div>
        <div class="line">
          <span class="label">选择规划底图:</span>
          <el-select v-model="bottomMap">
            <el-option v-for="(name, type) in bottomMapOptions" :label="name" :key="type" :value="type"></el-option>
          </el-select>
        </div>
        <div class="line">
          <span class="label">选择规划方案:</span>
          <el-select v-model="nowPlanId" @change="handlePlanChange">
            <el-option v-for="(name, type) in planList" :label="name" :key="type" :value="type"></el-option>
          </el-select>
          <el-button type="danger" style="margin-left: 20px" :disabled="nowPlanId === '0'" @click="deletePlan">
            删除该方案
          </el-button>
        </div>
        <div class="line">
          <div class="button-container">
            <el-popover ref="popCreation" placement="bottom-start" trigger="manual" :value="showPopCreation">
              <el-button type="primary" slot="reference" size="medium" @click="stickPopCreation = !stickPopCreation"
                         @blur.native="stickPopCreation = false" @mouseover.native="popoverShow('popCreation')"
                         @mouseleave.native="isStick(stickPopCreation, 'popCreation')" plain
              >新建模拟
              </el-button>
              <el-cascader-panel :multiple="false" :options="simulationOptions" v-model="creationMode"
                                 @change="onCreationModeChange"
              />
            </el-popover>
          </div>
          <div class="button-container">
            <el-popover ref="popHistory" placement="bottom" trigger="manual" :value="showPopHistory">
              <el-button type="primary" slot="reference" size="medium" @click="stickPopHistory = !stickPopHistory"
                         @blur.native="stickPopHistory = false" @mouseover.native="popoverShow('popHistory')"
                         @mouseleave.native="isStick(stickPopHistory, 'popHistory')" plain
              >模拟记录
              </el-button>
              <!-- 暴雨洪涝模拟 + 传染病模拟 -->

              <el-table :data="simulationTaskList" max-height="400" size="mini"
                :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
                <el-table-column property="id" label="序号" width="50"></el-table-column>
                <!-- <el-table-column property="name" label="名称"></el-table-column> -->
                <el-table-column property="city" label="城市" width="60">
                  <template slot-scope="scope">
                    <span>{{ getCityName(scope.row.city) }}</span>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="任务名称" width="80">

                </el-table-column>
                <el-table-column property="taskType" label="任务类型" width="80"></el-table-column>
                <el-table-column property="simulationType" label="灾害类型" width="100">
                  <template slot-scope="scope">
                    <span>{{ typeNames[scope.row.simulationType] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="任务提交时间" width="80">
                  <template slot-scope="scope">
                    <span v-if="scope.row.simulationType === 'flood'">{{ scope.row.simulationDate }}</span>
                    <span v-if="scope.row.simulationType === 'infection'">{{ scope.row.simulationTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column property="status" label="状态" width="60">
                  <template slot-scope="scope">
                    <i class="el-icon-loading" v-if="scope.row.status === 'processing'"></i>
                    <i class="el-icon-success" v-if="scope.row.status === 'finish'" style="color: green"></i>
                    <i class="el-icon-error" v-if="scope.row.status === 'failed'" style="color: crimson"></i>
                  </template>
                </el-table-column>
                <el-table-column label="参数" width="50">
                  <template slot-scope="scope">
                    <el-popover placement="right" width="500" trigger="hover">
                      <div v-if="scope.row.simulationType === 'infection'">
                        <div class="line">
                          <p class="label">
                            管控措施类型：
                          </p>
                          <p>{{ infectionLockTypeNames[scope.row.lockType] }}</p>
                        </div>
                        <div class="line">
                          <p class="label">
                            模拟总时长：
                          </p>
                          <p>{{ scope.row.para_json.simulation_days * 24 }}</p>
                        </div>
                        <div class="line">
                          <p class="label">
                            感染者住院率：
                          </p>
                          <p>{{ scope.row.para_json.I_H_para }}</p>
                        </div>
                        <div class="line">
                          <p class="label">
                            感染者自愈率：
                          </p>
                          <p>{{ scope.row.para_json.I_R_para }}</p>
                        </div>
                        <div class="line">
                          <p class="label">
                            住院者治愈率：
                          </p>
                          <p>{{ scope.row.para_json.H_R_para }}</p>
                        </div>
                        <div class="line">
                          <p class="label">
                            初始感染点：
                          </p>
                          <p>{{ scope.row.para_json.region_list }}</p>
                        </div>
                        <div class="line">
                          <p class="label">
                            初始感染人数：
                          </p>
                          <p>{{ scope.row.para_json.I_input }}</p>
                        </div>
                        <div class="line" v-if="scope.row.lockType === 1">
                          <p class="label">
                            封锁区域：
                          </p>
                          <p>{{ scope.row.para_json.lock_area }}</p>
                        </div>
                        <div class="line" v-if="scope.row.lockType === 1">
                          <p class="label">
                            封锁时长：
                          </p>
                          <p>{{ scope.row.para_json.lock_day }}</p>
                        </div>
                      </div>
                      <div v-if="scope.row.simulationType === 'flood'">
                        <div class="line">
                          <p class="label">
                            任务类型：
                          </p>
                          <p>{{ scope.row.isNewSimulation ? '模拟' : '推演' }}</p>
                        </div>
                        <div class="line">
                          <p class="label">
                            任务提交时间：
                          </p>
                          <p>{{ scope.row.simulationDate }}</p>
                        </div>
                        <div class="line">
                          <p class="label">
                            模拟计算时间：
                          </p>
                          <p>{{ scope.row.simulationTime }}</p>
                        </div>
                      </div>
                      <i class="el-icon-view" slot="reference" style="margin-right: 5px;"></i>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="70">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-set-up" :disabled="scope.row.status !== 'finish'"
                               @click="clickTask(scope.row)"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
          </div>
          <div class="button-container" v-show="false">
            <el-popover ref="popArea" placement="bottom-start" trigger="manual" :value="showPopArea">
              <el-button type="primary" slot="reference" size="medium" @click="stickPopArea = !stickPopArea" plain
                         @blur.native="stickPopArea = false" @mouseover.native="popoverShow('popArea')"
                         @mouseleave.native="isStick(stickPopArea, 'popArea')"
              >模拟区域
              </el-button>
              <div style="min-width:15vw; text-align: center;">
                <p style="color:#000" v-show="!areaModifying"><strong>当前区域：</strong>{{ currentArea }}</p>
                <p style="color:#000" v-show="areaModifying"><strong>当前区域：</strong>修改中，请在地图上划定区域</p>
                <span>
                  <el-button size="small" @click="cancelModifyArea" type="info" plain>清除</el-button>
                  <el-button size="small" @click="onModifyArea" v-show="!areaModifying" type="primary"
                             plain
                  >修改</el-button>
                  <el-button size="small" @click="onModifyArea" v-show="areaModifying" type="warning" plain
                  >取消</el-button>
                  <el-button size="small" @click="updateArea" type="primary" plain>更新结果</el-button>
                </span>
              </div>
            </el-popover>
          </div>
        </div>
        <el-card class="card-data">
          <div slot="header">
            <span class="card-title">数据设置</span>
          </div>
          <el-table :data="dataFileList" max-height="200" size="mini" :header-cell-style="{ 'text-align': 'center' }"
                    :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column property="label" label="名称"/>
            <el-table-column property="status" label="状态" width="80">
              <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.status === false">未上传</el-tag>
                <el-tag type="success" v-if="scope.row.status === true">已上传</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="上传" width="80">
              <template slot-scope="scope">
                <!-- <el-upload name="waters" :on-change="(file, fileList) => {
                  uploadDataFiles(file, fileList, scope.row);
                }" :auto-upload="false" multiple action="" :file-list="scope.row.files"
                >
                  <i class="el-icon-upload"></i>
                </el-upload> -->
                <el-button icon="el-icon-upload" @click="() => { onClickDataUpload(scope.row); }" circle></el-button>
              </template>
            </el-table-column>
            <el-table-column label="查看" width="60">
              <template slot-scope="scope">
                <el-popover placement="right" width="400" trigger="hover" v-show="scope.row.status">
                  <p class="helpTitle">已上传文件</p>
                  <el-table :data="scope.row.filesInfo" max-height="200" size="mini"
                            :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }"
                  >
                    <el-table-column property="name" label="文件名称" width="100"></el-table-column>
                    <el-table-column property="mtime" label="上传时间"></el-table-column>
                    <el-table-column label="下载" width="50">
                      <template slot-scope="scope">
                        <el-button icon="el-icon-download" @click="() => { onClickDataDownload(scope.row); }"
                                   size="mini"
                                   circle
                        ></el-button>
                      </template>
                    </el-table-column>
                    <el-table-column label="删除" width="50">
                      <template slot-scope="scope">
                        <el-popover placement="bottom" width="200" trigger="hover">
                          <p>确定删除<strong>{{ scope.row.name }}</strong>吗？</p>
                          <div style="text-align: center;">
                            <el-button type="primary" size="mini" plain
                                       @click="() => { onClickDataDelete(scope.row); }"
                            >确定
                            </el-button>
                          </div>
                          <el-button icon="el-icon-delete" type="danger" size="mini" slot="reference" circle
                          ></el-button>
                        </el-popover>
                      </template>
                    </el-table-column>
                  </el-table>
                  <i class="el-icon-s-order" slot="reference"></i>
                </el-popover>
                <i class="el-icon-error" v-show="!scope.row.status"></i>
              </template>
            </el-table-column>
            <el-table-column label="要求" width="60">
              <template slot-scope="scope">
                <el-popover placement="right" width="800" trigger="hover">
                  <p class="helpTitle">数据要求</p>
                  <el-image :src="helpImgs[scope.row.type]"></el-image>
                  <i class="el-icon-question" slot="reference"></i>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card v-show="creationMode == 'currentSimulation'">
          <div slot="header">
            <span class="card-title">灾害模拟参数设置</span>
          </div>
          <div class="line">
            <span class="label">灾害类型:</span>
            <el-select v-model="type">
              <el-option v-for="(name, type) in typeNames" :label="name" :key="type" :value="type"></el-option>
            </el-select>
          </div>
          <div class="line">
            <span class="label">任务名称:</span>
            <el-input v-model="taskName" placeholder="请输入内容"></el-input>
          </div>
          <!-- 暴雨模拟参数 -->
          <div v-show="type == 'flood'">
            <!--系统提供的一些参数配置-->
            <div class="line">
              <span class="label">配置:</span>
              <el-select v-model="floodParamConfig" @change="onFloodConfigChange">
                <el-option v-for="(name, config) in floodConfigOptions" :label="name" :key="config" :value="config"/>
              </el-select>
            </div>
            <!--设置降水等级，如果是自定义，才允许用户手动输入每小时降雨量-->
            <div class="line">
              <span class="label">24小时降雨的等级:</span>
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
                <el-option v-for="(name, index) in rainLevelOptions" :label="name" :key="index" :value="index"/>
              </el-select>
            </div>
            <!--设置降水的每小时降雨量-->
            <div class="line" v-show="floodParam['Rain level'] === '0'">
              <span class="label">平均降雨量(单位m/h):</span>
              <el-popover placement="right" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>自定义的平均降⾬量的⼤⼩，单位是m/h</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Rainfall per hour']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>

            <!--以下配置只有在年降水文件没有上传的时候才显示-->
            <!--设置初始降水点的X坐标-->
            <div class="line" v-show="!isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">初始降雨中心点X坐标(0～1):</span>
              <el-popover placement="right" width="300" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降⽔中⼼点的X坐标（0～1，其中0表示最左端，1表示最右端）</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam.InitX" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>
            <!--设置初始降水点的Y坐标-->
            <div class="line" v-show="!isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">初始降雨中心点Y坐标(0～1):</span>
              <el-popover placement="right" width="300" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降⽔中⼼点的Y坐标（0～1，其中0表示最上端，1表示最下端）</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam.InitY" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>
            <!--设置初始降水区域的半径-->
            <div class="line" v-show="!isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">降雨半径(0～1):</span>
              <el-popover placement="right" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降⽔区域半径（半径 = 城市宽度 × 此处输入）</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam.Radius" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>
            <!--设置初始降水点的移动方向-->
            <div class="line" v-show="!isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">移动方向(0～360):</span>
              <el-popover placement="right" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降⾬中⼼移动⽅向（0表示正东⽅向，逆时针递增）</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Movement direction']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>
            <!--设置初始降水点的移动速度-->
            <div class="line" v-show="!isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">移动速度(0～1):</span>
              <el-popover placement="right" width="400" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降⾬中⼼移动速度（时速 = 城市宽度 × 此处输入）</p>
                <p>对模拟场景以左上⻆为原点，横向为X⽅向，纵向为Y⽅向，建⽴直⻆坐标系。对于右下⻆，其坐标值为(1,1)。</p>
                <p>以东（右）向为起点为0度，逆时针旋转共360度。</p>
                <p>
                  降⾬区域为⼀个移动的圆形区域，InitX，InitY表示降⾬中⼼的位置，Radius表示区域半径，MD表示移动的⽅向，MS表示在模拟中每1步移动的距离。</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Movement speed']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>

            <!--以下配置只有在年降水文件上传了之后才显示-->
            <!--设置降雨带中心的X坐标-->
            <div class="line" v-show="isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">降雨带中心点X坐标(0～1):</span>
              <el-popover placement="right" width="300" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降雨带中⼼点的X坐标（0～1，其中0表示最左端，1表示最右端）</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Rain band initX']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              />
            </div>
            <!--设置降雨带中心的Y坐标-->
            <div class="line" v-show="isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">降雨带中心点Y坐标(0～1):</span>
              <el-popover placement="right" width="300" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降雨带中⼼点的Y坐标（0～1，其中0表示最上端，1表示最下端）</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Rain band initY']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              />
            </div>
            <!--设置降雨带的斜率-->
            <div class="line" v-show="isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">降雨带的方向:</span>
              <el-popover placement="right" trigger="hover" width="300">
                <p class="helpTitle">参数说明</p>
                <el-image :src="helpImgs['windrose']"></el-image>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-select v-model="floodParam['Rain band slope']" :disabled="floodParamConfig != 'custom'">
                <el-option v-for="(name, slope) in rainBandSlopeOptions" :label="name" :key="slope"
                           :value="slope"
                ></el-option>
              </el-select>
            </div>
            <!--设置降雨带的宽度-->
            <div class="line" v-show="isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">降雨带宽度(0～1):</span>
              <el-popover placement="right" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降⽔带宽度（宽度 = 城市宽度 × 此处输入）</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Rain band width']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>
            <!--设置降雨带的长度-->
            <div class="line" v-show="isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">降雨带长度(0～1):</span>
              <el-popover placement="right" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降水带长度（长度 = 城市宽度 × 此处输入）</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Rain band length']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>
            <!--设置降雨带降雨的显著程度-->
            <div class="line" v-show="isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">降雨带中心区域降雨强度:</span>
              <el-popover placement="right" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降雨带中心平均降雨量 = (1 + 此处输入) × 平均降雨量</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Rain band intensity']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>
            <!--设置降雨带0h的移动方向-->
            <div class="line" v-show="isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">降雨带0h移动方向(0～360):</span>
              <el-popover placement="right" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降雨带移动⽅向（0表示正东⽅向，逆时针递增）</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Wind start']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>
            <!--设置降雨带24h的移动方向-->
            <div class="line" v-show="isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">降雨带24h移动方向(0～360):</span>
              <el-popover placement="right" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降雨带移动⽅向（0表示正东⽅向，逆时针递增）</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Wind end']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>
            <!--设置降雨带移动速度-->
            <div class="line" v-show="isPrecipitationFileUploaded(this.dataFileList)">
              <span class="label">降雨带移动速度(单位m/h):</span>
              <el-popover placement="right" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>降雨带的平均移动速度，单位是m/h</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="floodParam['Wind speed']" placeholder="请输入内容"
                        :disabled="floodParamConfig != 'custom'"
              ></el-input>
            </div>

            <!--设置水流扩散速率-->
            <!--            <div class="line">-->
            <!--              <span class="label">水流扩散速率(0～1):</span>-->
            <!--              <el-popover placement="right" trigger="hover">-->
            <!--                <p class="helpTitle">参数说明</p>-->
            <!--                <p>⽤于控制降⾬在地表的移动程度</p>-->
            <!--                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>-->
            <!--              </el-popover>-->
            <!--              <el-input v-model="floodParam['Diffusion rate']" placeholder="请输入内容"-->
            <!--                :disabled="floodParamConfig != 'custom'"></el-input>-->
            <!--            </div>-->
          </div>
          <!-- 疫情模拟参数 -->
          <div v-show="type == 'infection'">
            <div class="line">
              <span class="label">配置:</span>
              <el-select v-model="infectionParamConfig" @change="onInfectionConfigChange">
                <el-option v-for="(name, config) in infectionConfigOptions" :label="name" :key="config"
                           :value="config"
                ></el-option>
              </el-select>
            </div>
            <div class="line">
              <span class="label">传染病基本繁殖数:</span>
              <el-popover placement="right" width="300" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>
                  传染病基本繁殖数(R0)：在没有外力介入，所有人都没有免疫力的情况下，一个感染传染病的人，会传染给其他多少个人的平均数</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="infectionParam.R0" placeholder="请输入内容"
                        :disabled="infectionParamConfig != 'custom'"
              ></el-input>
            </div>
            <div class="line">
              <span class="label">感染后住院率:</span>
              <el-popover placement="right" width="300" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>单位时间内每个被感染的患者住院的概率(I_H_para)</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="infectionParam.I_H_para" placeholder="请输入内容"></el-input>
            </div>
            <div class="line">
              <span class="label">感染后自愈率:</span>
              <el-popover placement="right" width="300" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>单位时间内每个被感染的患者自愈的概率(I_R_para)</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="infectionParam.I_R_para" placeholder="请输入内容"></el-input>
            </div>
            <div class="line">
              <span class="label">住院后治愈率:</span>
              <el-popover placement="right" width="300" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>单位时间内每个住院的患者治愈的概率(H_R_para)</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="infectionParam.H_R_para" placeholder="请输入内容"></el-input>
            </div>
            <div class="line">
              <span class="label">模拟总天数:</span>
              <el-popover placement="right" width="300" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>该任务模拟传染病发生后的总天数</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-input v-model="infectionParam.simulation_days" placeholder="请输入内容"></el-input>
            </div>
            <div class="line">
              <span class="label" style="padding: 5px 0;">初始感染点列表:</span>
              <el-popover placement="right" width="400" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>初始情况下感染人群的位置和人数，请点击“修改”按钮后在地图上添加</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
            </div>
            <el-table :data="initInfectionList" max-height="200" size="mini"
                      :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column property="id" label="序号" width="60"></el-table-column>
              <el-table-column property="population" label="感染人数" width="140">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.population" style="width:120px;" :min="1" :max="20" :precision="0"
                                   :step="1" size="small"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column property="position" label="位置">
                <template slot-scope="scope">
                  <span>{{
                      `[${scope.row.position[0].toFixed(3)},${scope.row.position[1].toFixed(3)}]`
                    }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div style="width: 100%;display: flex;flex-direction: row;justify-content: end;">
              <el-button type="primary" size="small" style="margin: 10px;" @click="showInfectionInput = true" plain>修改
              </el-button>
            </div>
            <div class="line">
              <span class="label" style="padding: 5px 0;">是否封锁区域:</span>
              <el-popover placement="right" width="400" trigger="hover">
                <p class="helpTitle">参数说明</p>
                <p>对选定的区域封锁一段时间，进行传染病模拟</p>
                <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
              </el-popover>
              <el-switch v-model="useLockInfection" active-text="是" inactive-text="否" style="margin-left: 10px;">
              </el-switch>
            </div>
            <div v-if="useLockInfection">
              <div class="line">
                <span class="label" style="padding: 5px 0;">封锁区域列表：</span>
              </div>
              <el-table :data="lockInfectionList" max-height="200" size="mini"
                        :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }"
              >
                <el-table-column property="id" label="序号" width="100"></el-table-column>
                <el-table-column property="gid" label="网格序号" width="80"></el-table-column>
                <el-table-column label="封锁时长(天)" width="140">
                  <template slot-scope="scope">
                    <span>{{ infectionLockDay }}</span>
                  </template>
                </el-table-column>
                <el-table-column property="position" label="位置">
                  <template slot-scope="scope">
                    <span>{{
                        `[${scope.row.position[0].toFixed(3)},${scope.row.position[1].toFixed(3)}]`
                      }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="width: 100%;display: flex;flex-direction: row;justify-content: end;">
                <el-button type="primary" size="small" style="margin: 10px;" @click="showInfectionLock = true" plain>修改
                </el-button>
              </div>
            </div>
          </div>
          <!-- 危化品爆炸模拟参数 -->
          <div v-show="type == 'explode'">
            <h1>该模块待完成</h1>
          </div>
          <el-button @click="submitTask" type="primary" style="margin-top: 5px;">提交任务</el-button>
        </el-card>
        <el-card v-show="creationMode[1] == 'planImport'">
          <div slot="header">
            <span class="card-title">规划方案导入设置</span>
          </div>
          <div class="line">
            <span class="label">方案导入:</span>
            <el-upload name="waters" :auto-upload="false" multiple action="">
              <i class="el-icon-upload"></i>
            </el-upload>
          </div>
          <h1 style="text-align: center;">该模块待完成</h1>
          <el-button type="primary" style="margin-top: 5px;">完成</el-button>
        </el-card>
        <el-card v-show="creationMode[1] == 'manualPlan'">
          <div slot="header">
            <span class="card-title">手动规划</span>
          </div>
          <div class="line">
            <span class="label">规划名称:</span>
            <el-input v-model="newPlanName" placeholder="请输入此次规划方案的名称" style="width: 200px"></el-input>
          </div>
          <div class="line">
            <span class="label">模拟模式:</span>
            <el-radio-group v-model="manualPlanMode" size="small" @change="onManualPlanModeChange">
              <el-radio-button label="selection">选址模拟</el-radio-button>
              <el-radio-button label="roadLevel">道路防灾等级模拟</el-radio-button>
            </el-radio-group>
          </div>
          <div class="line" v-show="manualPlanMode == 'selection'">
            <span class="label">选址类型:</span>
            <el-radio-group v-model="selectionMode" size="small" @change="onSelectionModeChange">
              <el-radio v-for="(name, selection) in selectionOptions" :label="selection" :key="selection">
                <el-tag :color="planSelectionColors[selection]" effect="dark" :hit="false">{{
                    name
                  }}
                </el-tag>
              </el-radio>
            </el-radio-group>
          </div>
          <div class="line" v-show="manualPlanMode == 'roadLevel'">
            <span class="label">道路防灾等级:</span>
            <el-slider style="width: 80%; margin-left: 10px;" v-model="roadLevel" :min="1" :max="10" show-input>
            </el-slider>
          </div>
          <div class="line">
            <span class="label" style="padding: 5px 0;">已新增选址:</span>
          </div>
          <el-table :data="selectionList" max-height="200" size="mini" :header-cell-style="{ 'text-align': 'center' }"
                    :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column property="id" label="序号" width="50">
              <template slot-scope="scope">
                <span>{{ `${scope.$index + 1}` }}</span>
              </template>
            </el-table-column>
            <el-table-column property="type" label="类型" width="80">
              <template slot-scope="scope">
                <el-tag :color="planSelectionColors[scope.row.type]" effect="dark" :hit="false">{{
                    selectionOptions[scope.row.type]
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column property="area" label="面积">
              <template slot-scope="scope">
                <span>{{ `${(scope.row.area * 100000000).toFixed(2)}m²` }}</span>
              </template>
            </el-table-column>
            <el-table-column property="scale" label="规模">
              <template slot-scope="scope">
                <span>{{ `${scope.row.scale}` }}</span>
              </template>
            </el-table-column>
            <el-table-column property="capacity" label="容纳量">
              <template slot-scope="scope">
                <span>{{ `${scope.row.capacity}` }}</span>
              </template>
            </el-table-column>
            <el-table-column property="position" label="位置">
              <template slot-scope="scope">
                <span>{{
                    `[${scope.row.position[0].toFixed(3)},${scope.row.position[1].toFixed(3)}]`
                  }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="mini"
                           @click="removeSelection(scope.row, scope.$index)" circle
                ></el-button>

              </template>
            </el-table-column>
          </el-table>
          <div class="line">
            <span class="label" style="padding: 5px 0;">已修改道路:</span>
          </div>
          <el-table :data="roadLevelList" max-height="200" size="mini" :header-cell-style="{ 'text-align': 'center' }"
                    :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column property="id" label="序号" width="70"></el-table-column>
            <el-table-column property="originalLevel" label="原始等级" width="80"></el-table-column>
            <el-table-column property="newLevel" label="新等级" width="70"></el-table-column>
            <el-table-column property="position" label="位置">
              <template slot-scope="scope">
                <span>{{
                    `[${scope.row.position[0].toFixed(4)},${scope.row.position[1].toFixed(4)}]`
                  }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoadLevel(scope.row)"
                           circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="button-row-right">
            <el-button @click="clearManualPlan" size="small">取消</el-button>
            <el-button type="primary" @click="finishManualPlan" size="small">完成</el-button>
          </div>
        </el-card>
        <el-card v-show="creationMode[1] == 'automaticPlan'">
          <div slot="header">
            <span class="card-title">自动规划</span>
          </div>
          <div class="line">
            <span class="label">当前已存在规划:</span>
          </div>
          <div>
            <el-table :data="autoPlanList" max-height="200" size="mini" :header-cell-style="{ 'text-align': 'center' }"
                      :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column property="id" label="序号" width="50">
                <template slot-scope="scope">
                  <span>{{ `${scope.row.id}` }}</span>
                </template>
              </el-table-column>
              <el-table-column property="name" label="名称" width="80">
                <template slot-scope="scope">
                  <span>{{`${scope.row.name}`}}</span>
                </template>
              </el-table-column>
              <el-table-column property="time" label="提交时间">
                <template slot-scope="scope">
                  <span>{{ `${scope.row.time}` }}</span>
                </template>
              </el-table-column>
              <el-table-column property="type" label="规划设施类型">
                <template slot-scope="scope">
                  <span>{{ `${scope.row.service}` }}</span>
                </template>
              </el-table-column>
              <el-table-column property="status" label="状态" width="60">
                <template slot-scope="scope">
                  <i class="el-icon-loading" v-if="scope.row.status === 'processing'"></i>
                  <i class="el-icon-success" v-if="scope.row.status === 'finish'" style="color: green"></i>
                  <i class="el-icon-error" v-if="scope.row.status === 'failed'" style="color: crimson"></i>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" icon="el-icon-set-up" :disabled="scope.row.status !== 'finish'"
                             @click="clickAutoPlanTask(scope.row)"
                  >
                    查看
                  </el-button>
                </template>
              </el-table-column>

              <el-table-column label="删除" width="70">
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" size="mini"
                             @click="deleteAutoPlanTask(scope.row.id)" circle
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="showAutoPlanPoint===false">
          <div class="line">
            <span class="label">规划名称:</span>
            <el-input v-model="newAutoPlanName" placeholder="请输入此次规划方案的名称" style="width: 200px"></el-input>
          </div>
          <div class="line">
            <span class="label">选址类型:</span>
            <el-radio-group v-model="AutoselectionMode" size="small" @change="onSelectionModeChange">
              <el-radio v-for="(name, selection) in selectionOptions" :label="selection" :key="selection">
                <el-tag :color="planSelectionColors[selection]" effect="dark" :hit="false">{{
                  name
                }}
                </el-tag>
              </el-radio>
            </el-radio-group>
          </div>
          <el-button type="primary" style="margin-top: 5px; margin-left: 30%" @click="beginAutoPlan" :disabled="disableAutoPlanButton">
            开始自动选址
          </el-button>
          </div>
          <div v-if="showAutoPlanPoint">
            <el-table :data="selectionList" max-height="200" size="mini" :header-cell-style="{ 'text-align': 'center' }"
                      :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column property="id" label="序号" width="50">
                <template slot-scope="scope">
                  <span>{{ `${scope.row.index + 1}` }}</span>
                </template>
              </el-table-column>
              <el-table-column property="type" label="类型" width="80">
                <template slot-scope="scope">
                  <el-tag :color="planSelectionColors[scope.row.type]" effect="dark" :hit="false">{{
                      selectionOptions[scope.row.type]
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column property="capacity" label="容纳量">
                <template slot-scope="scope">
                  <span>{{ `${scope.row.capacity}` }}</span>
                </template>
              </el-table-column>
              <el-table-column property="position" label="位置">
                <template slot-scope="scope">
                <span>{{
                    `[${scope.row.positionY.toFixed(3)},${scope.row.positionX.toFixed(3)}]`
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" size="mini"
                             @click="deleteAutoPlanPoints(scope.row)" circle
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          <el-button type="primary" style="margin-top: 5px; margin-left: 30%" @click="saveAutoPlanResult">保存选址结果
          </el-button>
          </div>
        </el-card>
      </div>
    </el-drawer>
    <div class="showdrawer-button showdrawer-button-right">
      <el-button icon="el-icon-arrow-left" type="primary" @click="showPlanPanel = true"></el-button>
    </div>
    <!-- 应急规划方案面板 -->
    <el-drawer class="setting-panel" title="规划方案" :visible.sync="showPlanPanel" direction="rtl" :modal="false"
               :wrapperClosable="false" style="position: absolute;"
    >
      <!--右侧的抽屉，在联防联控预案编辑模式下，显示编辑相关的信息；不在编辑模式下，显示应急规划方案信息-->

      <!--非编辑模式，显示应急规划方案-->
      <p slot="title" class="setting-panel-title" v-if="!jointPlanEditMode">应急规划方案</p>
      <!--联防联控预案编辑模式，显示编辑相关的信息-->
      <p slot="title" class="setting-panel-title" v-if="jointPlanEditMode">联防联控预案信息支持</p>


      <div class="simu-result" v-show="jointPlanEditMode">
        <h4>仿真模拟结果</h4>
        <hr>
        <div class="chart-container" v-show="currentSimulationType === 'flood'">
          <div id="chartFlood" class="chart"></div>
        </div>
        <div class="chart-container" v-show="currentSimulationType === 'infection'">
          <div id="chartInfectionPlan" class="chart"></div>
        </div>
      </div>
      <div class="simu-result" v-show="jointPlanEditMode">
        <h4>防灾重点区域</h4>
        <hr>
        <el-table v-show="currentSimulationType === 'flood'" :data="floodDangerousPointList" max-height="300" border
          style="width: 100%" :row-class-name="addRowCount" @cell-mouse-enter="onMouseOverDangerousPositionTable"
          @cell-mouse-leave="onMouseOutDangerousPositionTable" @row-click="onClickOverDangerousPositionTable">
          <el-table-column prop="display_name" label="地点">
          </el-table-column>
          <el-table-column prop="lon" label="经度">
          </el-table-column>
          <el-table-column prop="lat" label="纬度">
          </el-table-column>
        </el-table>
<!--        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalItems" :page-size="pageSize" v-model="currentPage"></el-pagination>-->
        <!-- DangerousPosition的弹窗 -->
        <div id="dangerousPositionPopup" class="ol-dangerousPositionPopup" v-show="floodDangerousOverlay===null?false:true">
          <a href="#" @click="closeDangerousPositionPopup" class="ol-dangerousPositionPopup-closer"></a>
          <div id="dangerousPositionPopup-content" class="ol-dangerousPositionPopup-content"></div>
        </div>
        <div v-show="currentSimulationType === 'infection'">
          <span style="font-size:14px;">感染人数阈值：</span>
          <el-input-number v-model="thresholdInfected" :disabled="!currentInfectionGridLayer" style="width:100px;"
            :min="1" :precision="0" :step="1" size="small"></el-input-number>
          <el-button type="primary" size="small" @click="updateInfectionRisk"
            :disabled="updateRiskDisabled || !currentInfectionGridLayer" plain>更新</el-button>
          <br>
          <el-table v-loading="updateRiskDisabled" :data="infectionDangerousPointList" max-height="300" border
            style="width: 100%">
            <el-table-column prop="display_name" label="地点">
            </el-table-column>
            <el-table-column prop="lon" label="经度" width="80">
            </el-table-column>
            <el-table-column prop="lat" label="纬度" width="80">
            </el-table-column>
            <el-table-column prop="population" label="感染人数" width="80">
            </el-table-column>
          </el-table>
        </div>

      </div>
      <div contentEditable="true" class="simu-result" v-show="jointPlanEditMode && currentSimulationType === 'flood'">
        <h4 contenteditable="false">预案编制建议</h4>
        <hr>
        <p>
          根据模拟仿真预测，需要救援人员{{ flood_advice.peopleCount }}人，需要救援车{{ flood_advice.carCount }}辆, 需要救援船只{{ flood_advice.shipCount }}。
        </p>
        <p>
          需要注意的风险点包括：
        </p>
        <p v-for="(item, index) in flood_advice.riskPlace">
          {{ `${index + 1}. ${item}` }}
        </p>

      </div>
      <div class="simu-result" v-show="jointPlanEditMode && currentSimulationType === 'infection'">
        <h4>预案编制建议</h4>
        <hr>
        <!-- <p>
          根据模拟仿真预测，需要支援{{ adviceInfection.peopleCount }}人，需要支援{{ adviceInfection.carCount }}辆车。
        </p> -->
        <p>
          需要注意的风险点包括：
        </p>
        <p v-for="(item,index) in adviceInfection.riskList">
          {{ `${index+1}.${item.name}。${item.text}` }}
        </p>
      </div>
      <el-collapse style="margin-left: 10px;">
        <el-collapse-item>
          <template slot="title">
            <p style="font-size: 14px; font-weight: bold;">应急规划方案结果</p>
          </template>
          <div class="setting-container">
            <div v-if="false" class="line" v-for="plan in emergencyPlanData">
              <el-checkbox @change="(checked) => { onPlanCheckChange(checked, plan) }"></el-checkbox>
              <el-tag :color="emergencyPlanColors[plan.type]" effect="dark" style="margin-left: 5px; height:15px;" />
              <div style="margin-left: 20px;">{{ plan.name }}</div>
            </div>
            <el-tree :data="emergencyPlansAtTime[stepTimeMap[activeTimeIndex]]" show-checkbox :render-after-expand="false"
                     @check-change="handlePlansCheckChange">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <el-tag v-if="node.isLeaf" :color="emergencyPlanColors[data.type]" size="mini"
                        style="margin-left: 5px; height: 15px; width: 15px" />
                {{ data.label }}
              </span>
            </el-tree>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <p style="font-size: 14px; font-weight: bold;">新建应急规划方案</p>
          </template>
          <el-form>
            <el-form-item label="应急选址类型：">
              <el-select v-model="newEmergencyPlanType" placeholder="请选择选址类型">
                <el-option v-for="dict in emergencyPlanTypes" :key="dict.id" :label="dict.label"
                           :value="dict.id"></el-option>
              </el-select>
              <el-form-item label="模拟任务和时刻：">
                <el-cascader v-model="newEmergencyPlanRainTask" placeholder="请选择暴雨洪涝模拟任务"
                             :options="emergencyPlanRainTaskList" clearable></el-cascader>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" plain @click="submitEmergencyPlan">提交</el-button>
              </el-form-item>
              <el-popover ref="popHistoryPlan" placement="bottom" trigger="hover">
                <el-button slot="reference" plain style="margin-top:10px;">执行记录
                </el-button>
                <el-table :data="emergencyTaskLogList" max-height="500">
                  <el-table-column label="城市名称" prop="cityName" :show-overflow-tooltip="true" />

                  <el-table-column label="开始时间" align="center" width="200" prop="createTime">
                    <template slot-scope="scope">
                      <span>{{ scope.row.createTime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="执行状态" align="center" width="200" prop="createTime">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.status == 0">执行中</el-tag>
                      <el-tag type="success" v-if="scope.row.status == 1">执行完成</el-tag>
                      <el-tag type="danger" v-if="scope.row.status == 2">运行中断</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="结束时间" align="center" width="200" prop="endTime">
                    <template slot-scope="scope">
                      <span>{{ scope.row.endTime }}</span>
                    </template>
                  </el-table-column>

                </el-table>
              </el-popover>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>

    </el-drawer>
    <!-- 数据上传输入框 -->
    <el-dialog :visible.sync="showDataUpload" width="30%" center>
      <div slot="title" style="font-size: 18px; font-weight: bold;">上传数据</div>
      <div v-for="item in dataFileList" v-if="item.type === currentUploadType" style="text-align: center;">
        <div class="line">
          <p class="label">
            上传{{ item.label }}：
          </p>
          <el-upload :on-change="(file, fileList) => {
            uploadDataFiles(file, fileList, item);
          }" :auto-upload="false" multiple action="" :file-list="item.files">
            <i class="el-icon-upload"></i>
          </el-upload>
        </div>
        <el-button @click="submitUploadFiles(item)">上传</el-button>
      </div>


    </el-dialog>
    <!-- 传染病模拟输入对话框 -->
    <el-dialog title="传染病灾前模拟初始感染点设置" :visible.sync="showInfectionInput" width="80%" center>
      <div slot="title" style="font-size: 18px; font-weight: bold;">传染病灾前模拟初始感染点设置</div>
      <infectionInput ref="infectionInput" :area="area" @updateInitInfectionList="updateInitInfectionList"/>
      <div slot="footer">
        <el-button @click="showInfectionInput = false">取 消</el-button>
        <el-button type="primary" @click="finishInitInfection">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="传染病灾前模拟封锁区域设置" :visible.sync="showInfectionLock" width="80%" center>
      <div slot="title" style="font-size: 18px; font-weight: bold;">传染病灾前模拟封锁区域设置</div>
      <infectionLock ref="infectionLock" :area="area" @updateLockInfectionList="updateLockInfectionList"
                     @updateInfectionLockDay="updateInfectionLockDay"
      />
      <div slot="footer">
        <el-button @click="showInfectionLock = false">取 消</el-button>
        <el-button type="primary" @click="finishLockInfection">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="joint-plan" title="联防联控预案" :visible.sync="showJointPlan" center :modal="false"
      :close-on-click-modal="false" width="100%" top="0%" v-if="jointPlanEditMode">
      <Flood_shenzhen v-show="currentSimulationType === 'flood'" :city="city" :cityName="cityName"></Flood_shenzhen>
      <Infection_shanghai v-show="currentSimulationType === 'infection'" :city="city" :cityName="cityName"></Infection_shanghai>
    </el-dialog>
  </div>
</template>

<script>
// 后端请求
import axios from 'axios'
import ajax from '../simulator/ajax'
import serverInfo from '../simulator/serverInfo'
import {listRole,longInvoking,getLongInvokingStatus} from "@/api/city/optimization";
// 后端请求相关函数
import *  as requestUtils from './requestUtils'
import JSZip from 'jszip';
// 城市服务性能(评估在给定 城市、规划方案、洪涝参数 的条件下，城市某服务(应急服务，日常服务)的指标 )相关的后端请求
import * as cityServicePerformanceAPI from './cityServicePerformanceAPI'
import * as jointPlanAPI from './jointPlanAPI'

// 数据
import { options } from '../evaluate/CityScoreData.js'
import mapData from '../simulator/components/mapData'
import { cityList, invoking } from '@/api/decisions/decisions'
import { getTaskLogPage } from '@/api/decisions/taskLog'

// 公用常变量
import *  as Layers from './common/layers' // 导入图层相关常变量

// 地图相关函数
import *  as mapUtils from './mapUtils'

// 图表相关函数
import *  as chartUtils from './chartUtils'
import IconHospital from './assets/hospital.png'
import IconEmergencyMedical from './assets/emergencymedical.png'
import IconShelter from './assets/shelter.png'
import IconFirehouse from './assets/firehouse.png'
import IconEducation from './assets/education.png'
import IconCommercialRetail from './assets/commercialretail.png'
import IconGoods from './assets/goods.png'
import IconEmployment from './assets/employment.png'
import IconCommunicationBaseStation from './assets/communicationbasestation.png'
import { Tile as TileLayer } from 'ol/layer'
import XYZ from 'ol/source/XYZ'
import ol from 'ol'

// 传染病模拟组件
import infectionInput from '@/views/simulator/components/infection/infectionInput.vue'
import infectionLock from '@/views/simulator/components/infection/infectionLock.vue'

//联防联控预案组件
import Flood_shenzhen from '@/views/joint/plan/flood_shenzhen.vue'
import Infection_shanghai from '@/views/joint/plan/infection_shanghai.vue'
import { updateChartLine1 } from "./chartUtils";
import { requestAPIForResidentialAreas } from './mapUtils'
import { getNecessaryFilesForAutoPlan } from '@/views/application/APIForTeam4'

export default {
  name: 'application',
  props: [''],
  components: { infectionInput, infectionLock, Flood_shenzhen, Infection_shanghai },
  data() {
    return {

      /**** 城市 ****/
      area: ['直辖市', 'shanghai'],    //设置面板中的模拟区域输入
      // area: ['省会城市', 'guangzhou'],    //设置面板中的模拟区域输入
      areaOptions: options,               //设置面板中的模拟区域输入选项
      cityName: '上海',
      city: 'shanghai',
      // cityName:'广州',
      // city:'guangzhou',
      cityList: [],                   // 城市列表，包括城市代号

      /**** 灾害类型 ****/
      type: 'flood',
      typeNames: {
        'flood': '暴雨洪涝灾害',
        'infection': '传染病灾害'
        // 'explode': '危化品爆炸'
      },
      bottomMap: 'now',
      bottomMapOptions: {
        'now': '土地利用现状底图'
      },
      newPlanName: '',
      newAutoPlanName: '',
      nowPlanId: '0',
      planList: {
        '0': '城市现状'
      },
      /****  灾害信息 ****/
      taskId: 0,
      infoTask: {                         //当前任务信息
        computeTime: 0
      },
      infoFlood: {                        //当前任务洪涝相关信息
        waterCount: 0,
        waterArea: 0
      },
      infectionTaskInfo: null,
      maxInfectionDay: 1,

      /****  页面状态 ****/
      showSettingPanel: false,       //显示左侧设置面板
      showPlanPanel: false,           //显示右侧规划面板面板

      stickPopCreation: false,       //是否长期显示 新建模拟
      showPopCreation: false,        //显示新建模拟

      showJointPlan: false,         //显示联防联控预案生成面板
      jointPlanEditMode: false,     //联防联控预案编辑模式

      showDataUpload: false,        //是否显示数据上传对话框
      currentUploadType: 'road',    //当前数据上传类型

      stickPopHistory: false,         //是否长期显示 模拟历史
      showPopHistory: false,          //显示模拟历史

      stickPopArea: false,
      showPopArea: false,           //显示模拟区域
      creationMode: 'currentSimulation',     //新建模拟模式
      simulationOptions:              //新建模拟选项
        [
          {
            value: 'currentSimulation',
            label: '现状模拟'
          },
          {
            value: 'planSimulation',
            label: '规划模拟',
            children: [
              {
                value: 'planImport',
                label: '规划方案导入'
              },
              {
                value: 'manualPlan',
                label: '手动规划'
              },
              {
                value: 'automaticPlan',
                label: '自动规划'
              }
            ]
          }
        ],
      selectionOptions:           // 规划选址类型选项
        {
          'Aid': '应急医疗',
          'Shelter': '避难场所',
          'Supply': '救灾物资',
          'Break': '消防站',
          'Hospital': '医疗',
          'School': '教育',
          'Work': '就业',
          'Shopping': '商业零售'
        },
      manualPlanMode: 'selection',        // 手动规划模式
      selectionMode: 'Hospital',          // 规划选址类型
      AutoselectionMode: 'Hospital',       // 自动规划的选址类型
      roadLevel: 1,                       // 要设置的道路防灾等级
      currentArea: '未划定',                    // 当前模拟区域
      currentAreaFeature: null,           // 当前模拟区域对应的openlayer feature
      areaModifying: false,               //是否在修改模拟区域

      currentInfectionDay: 1,             // 当前传染病模拟时间(天)
      currentInfectionHour: 1,            // 当前传染病模拟时间(小时)
      currentInfectionShowType: 'I_data', // 当前传染病网格显示类型
      thresholdInfected: 1,               // 高风险感染人数阈值
      infectionShowTypes: [               // 传染病网格显示类型
        {
          value: 'S_data',
          label: '网格易感者人数'
        },
        {
          value: 'I_data',
          label: '网格感染者人数'
        },
        {
          value: 'H_data',
          label: '网格住院者人数'
        },
        {
          value: 'R_data',
          label: '网格康复者人数'
        },
        {
          value: 'newInfected_data',
          label: '网格一小时内新增感染者人数'
        },
        {
          value: 'total_num_data',
          label: '网格总人数'
        }
      ],

      // 任务
      currentSimulationType: '',          // 当前模拟任务类型
      currentTask: null,                  // 当前模拟任务
      currentSimulationResult: {           // 当前模拟任务结果
        'submergedcells': {},
        'availableroads': {},
        'submergedroads': {},
        'dangerousroads': {},
        'riskcells': {},
        'riskpoints': {}
      },
      resultMaxLen: 15000,                // 模拟任务结果形状最大显示数量

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

      mapPointList: [],                    //用户规划的新增基础设施点
      baseStationPointList: [],            //用户规划的新增基站点
      pointLayerSource: null,              //标记点的geojson数据源
      baseStationLayerSource: null,        //基站点的geojson数据源
      pointLayer: null,                    //标记点对应的图层
      baseStationLayer: null,               //基站点对应的图层
      popUpPlanPoint: null,                 //弹窗需要的内容
      popUpInfection: null,                 //传染病弹窗需要的内容
      showDetail: false,                    //是否展示弹窗信详细息
      currentPositionPlanPoint: [0, 0],          //当前点击点的坐标
      currentResidentialAreaInfo: {},          //当前热力图显示的居民区区域的信息

      /*点击弹窗信息*/
      showMannualPlanPopUp: false,           //是否显示手动规划时的弹窗
      showPlanPointUp: false,                 //显示手动规划之后的规划点的弹窗
      showResidentialAreas: false,            //显示居民区热力图的弹窗

      optionsPlanPointScale: [{             //场所的选择信息
        value: 'small',
        label: '小型场所'
      }, {
        value: 'middle',
        label: '中型场所'
      }, {
        value: 'large',
        label: '大型场所'
      }],
      ValuePlanPointScale: 'small',           //选择的场所大小
      ValuePlanPointCapacity: 4000,              //选择场所的容量
      nowSelectPlanPoint: {},                 //当前手动选择的点的信息
      responsePlanID: 0,                   //响应规划的ID

      /****  图层 ****/
      hasLayers_basic: //是否有基础图层数据
        {
          'road': false,
          'building': false,
          'reserveLands': false,
          'municipalFacilities': false,
          'hospitals': false,
          'CommunicationBaseStation': false
        },
      layerNames_basic: Layers.layerNames_basic,//基础图层名称
      layerNames_residential: Layers.layerNames_residential,//居民区韧性图层
      layerNames_residential_dangerous: Layers.layerNames_residential_dangerous,//居民区韧性图层
      layerColors: Layers.layerColors,//图层颜色
      showLayers: //图层显示状态
        {
          'road': false,
          'building': false,
          'submergedCells': false,
          'dangerousRoads': false,
          'availableRoads': false,
          'riskCells': false,
          'riskPoints': false,
          'reserveLands': true,
          'municipalFacilities': true,
          'hospitals': true,
          'CommunicationBaseStation': false,
          'grid': false,
          'riskInfection': false,
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
          'trafficPressure': false
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
      layerNames_flood: Layers.layerNames_flood, //洪涝模拟图层名称
      layerNames_infection: //传染病模拟图层名称
        {
          'grid': '传染病网格分布'
        },
      planSelectionColors: Layers.planSelectionColors,             // 手动规划选址图层颜色

      disjointListResidential: {},       //居民区韧性图层中的薄弱区域

      nowSelectResidential: '',          //当前选择的居民区模拟区域
      layers_basic: {},                  //基础图层
      layers_residential: {},            //居民区韧性图层
      /*
      * 以下是居民区风险预警图层,每添加一个图层，都要在这里添加一个，然后push到layers_residential_dangerous中
      * 有下面八个图层
      * Aid:应急医疗的风险位置图层
      * Shelter:避难场所的风险位置图层
      * Supply:救灾物资的风险位置图层
      * Break:消防站的风险位置图层
      * Hospital:医疗的风险位置图层
      * School:教育的风险位置图层
      * Work:就业的风险位置图层
      * Shopping:商业零售的风险位置图层
      * */
      layers_residential_dangerous: {},       //居民区风险预警图层
      planSelectionLayers: {},           // 手动规划选址绘制图层
      modifyAreaLayer: null,             //修改区域的图层

      // 模拟结果数据图层
      currentSubmergedcellsLayer: null,     //当前淹没区域图层
      currentSubmergedroadsLayer: null,     //当前淹没路网图层
      currentDangerousroadsLayer: null,     //当前危险路网图层
      currentAvailableroadsLayer: null,     //当前可用路网图层
      riskCellsLayer: null,                 //风险区域图层
      riskPointsLayer: null,                //风险点图层
      currentCommunicationBaseStationLayer: null, //通信基站图层
      currentInfectionGridLayer: null,      //传染病网格图层
      currentInfectionGridSource: null,     //传染病网格数据源
      currentRiskLayer: null,               //传染病感染高风险图层
      currentRiskSource: null,              //传染病感染高风险数据源
      updateRiskDisabled: false,            //更新感染高风险区域按钮是否可用

      /*通信基站服务能力数据*/
      currentAvailableCommunicationBaseStationServiceArea: 1, //当前可用的通信基站覆盖范围
      currentNotAvailableCommunicationBaseStationServiceArea: 0, //当前不可用的通信基站覆盖范围
      currentCommunicationBaseStationServiceCapacity: 1.0, //当前通信基站的服务能力,为百分数

      //应急规划方案图层
      emergencyLayers: {},                 //应急规划方案图层
      currentTrafficPressureLayer: null,

      /****  图表 ****/
      //全局城市服务医疗性能图表-中间的中间
      chartService: null,
      //不同 应急规划方案 的城市韧性指标-中间最下面
      chartMeasure: null,
      //应急服务图表-右侧
      chartEmergency: null,
      //日常服务图表-右侧
      chartDaily: null,
      //传染病感染总人数对比曲线-中间的中间
      chartInfection: null,
      //基础设施韧性图表-右侧
      chartBasic: null,
      //模拟洪涝灾害图表-右侧抽屉
      chartFlood: null,
      //传染病灾害图表-右侧抽屉
      chartInfectionPlan: null,

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

      /****  数据 ****/
      riskData:   // 风险点
        [
          {
            name: 'A路大道咖啡厅',
            value: '83'
          },
          {
            name: 'A路大道饭店',
            value: '70'
          },
          {
            name: 'B路大道咖啡厅',
            value: '45'
          },
          {
            name: 'B路大道饭店',
            value: '30'
          },
          {
            name: 'C路大道咖啡厅',
            value: '15'
          },
          {
            name: 'C路大道饭店',
            value: '20'
          }
        ],

      // 城市服务种类
      selectedServices: ['Shelter', 'Supply', 'Aid'],   //已选择的城市服务种类
      cityServices: {
        'Shelter': '避难场所',  //避难所韧性
        'Supply': '应急物资供应',  //赈灾韧性
        'Aid': '急救站',  //医疗韧性
        'mobileCabinHospital': '方舱医院',  //应急医疗韧性
        'Break': '消防站'  //消防韧性
      },

      //不同洪涝灾害严重程度下城市服务性能百分比
      floodMagnitudes: {
        '5': '0.011468',
        '10': '0.014316',
        '50': '0.020928',
        '100': '0.023775'
      },
      serviceData: {                              //测度图表数据-中间底下
        xName: '洪涝灾害严重程度',
        yName: '城市服务性能变化',
        xData: {
          // '土地利用现状': [1.0, 0.95, 0.78, 0.6, 0.12],
          // '土地利用规划方案1': [1.0, 0.8, 0.68, 0.5, 0.08],
          // '土地利用规划方案2': [1.0, 0.76, 0.56, 0.4, 0.05]
          // '无': [1.00, 0.00, 0.00, 0.00, 0.00],
        },
        yData: ['无洪涝', '5年一遇', '10年一遇', '50年一遇', '100年一遇']
      },

      floodDangerousPointList: [
      ],  //对应数据库返回的洪涝记录
      floodDangerousPointFeatures: [],  //危险点的要素列表
      floodDangerousPointLayer: null,  //危险点的图层
      floodDangerousOverlay:null,//显示危险点的信息
      flood_advice: {
        peopleCount: 0,
        carCount: 0,
        shipCount: 0,
        riskPlace: []
      },
      adviceInfection: {
        peopleCount: 0,
        carCount: 0,
        riskList: [],
      },
      floodData: {
        xName: '时刻',
        yName: '城市淹没比例',
        xData: {
          '淹没区域': [0, 0, 0.01, 0.09, 0.28, 0.52, 0.75, 0.86, 0.95, 1.04, 1.13, 1.20,
            1.25, 1.29, 1.32, 1.34, 1.36, 1.37, 1.36, 1.37, 1.38, 1.40, 1.40, 1.40, 1.40],
          '危险区域': [0, 0.01, 0.28, 0.75, 0.88, 0.92, 1.07, 1.26, 1.34, 1.34, 1.31, 1.24,
            1.19, 1.13, 1.10, 1.05, 1.02, 1.00, 0.98, 0.97, 0.95, 0.93, 0.93, 0.93, 0.90],
        },
        xMax: 1,  //模拟的总面积
        yData: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
      },

      //不同应急规划方案的城市韧性指标
      measureData: {
        xName: '规划方案',
        yName: '韧性指标',
        xData: {
          // '医疗韧性': [1.0, 1.95, 0.6, 0.4],
          // '避难所韧性': [1.0, 0.8, 0.5, 0.4],
          // '赈灾韧性': [1.0, 0.76, 0.4, 0.35],
          // '消防韧性': [30.9, 20.75, 20.4, 10.35]
        },
        yData: ['城市现状', '综合方案', '侧重覆盖人数', '侧重疏散时间', '侧重成本']
      },
      // emergencyData: {                             //应急服务图表数据-右侧
      //   xName: '时刻',
      //   yName: '城市服务性能百分比',
      //   xData: {
      //     '应急医疗': [1.0, 0.95, 0.6, 0.4, 0.3, 0.12],
      //     '避难空间': [1.0, 0.8, 0.5, 0.4, 0.3, 0.08],
      //     '救灾物资': [1.0, 0.76, 0.4, 0.35, 0.3, 0.05],
      //     '消防站': [0.9, 0.75, 0.4, 0.35, 0.3, 0.01]
      //   },
      //   yData: ['4时', '8时', '12时', '16时', '20时', '24时']
      // },

      //通信基站右侧图表数据
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

      maxEmergencyValues: [4.5, 1, 0.6, 1],
      normalEmergencyValues: [0, 0, 0, 0],
      emergencyNames: ['避难场所', '救灾物资', '应急医疗', '消防站'],
      emergencyCodes: ['Shelter', 'Supply', 'Aid', 'Break'],
      emergencyValues: {
        '0': [0, 0, 0, 0],
        '4': [0, 0, 0, 0],
        '8': [0, 0, 0, 0],
        '12': [0, 0, 0, 0],
        '16': [0, 0, 0, 0],
        '20': [0, 0, 0, 0],
        '24': [0, 0, 0, 0]
      },
      // dailyData: {                                //日常服务图表数据-右侧
      //   xName: '时刻',
      //   yName: '城市服务性能百分比',
      //   xData: {
      //     '医疗': [1.0, 0.95, 0.6, 0.4, 0.3, 0.12],
      //     '教育': [1.0, 0.8, 0.5, 0.4, 0.3, 0.08],
      //     '就业': [1.0, 0.76, 0.4, 0.35, 0.3, 0.05],
      //     '商业事物': [0.9, 0.75, 0.4, 0.35, 0.3, 0.01]
      //   },
      //   yData: ['4时', '8时', '12时', '16时', '20时', '24时']
      // },
      maxDailyValues: [0.07, 2.84, 1, 0.35],
      normalDailyValues: [0, 0, 0, 0],
      dailyNames: ['医疗', '教育', '就业', '商业服务'],
      dailyCodes: ['Hospital', 'School', 'Work', 'Shopping'],
      dailyValues: {
        '0': [0, 0, 0, 0],
        '4': [0, 0, 0, 0],
        '8': [0, 0, 0, 0],
        '12': [0, 0, 0, 0],
        '16': [0, 0, 0, 0],
        '20': [0, 0, 0, 0],
        '24': [0, 0, 0, 0]
      },
      simulationTaskList: [],   // 模拟任务记录
      floodSimulationList: [],    //洪涝模拟任务记录
      infectionSimulationList: [], // 传染病模拟任务记录
      emergencyPlanData: [],                     //应急规划方案数据-右侧弹窗
      emergencyPlansAtTime: {     //其中的元素显示在el-tree中应急规划方案-右侧弹窗
        0: [],
        4: [],
        8: [],
        12: [],
        16: [],
        20: [],
        24: []
      },
      emergencyPlanColors: {                     //应急规划方案图层颜色
        'alternative_point': '#67C23A',             //候选 避难/物资/急救 点
        'risk': '#F56C6C',                       //风险点
        'straight_line_res': '#909399',           //风险点 到 候选点 的直线
        'result': '#409EFF'                       //风险点 到 候选点 的路线
      },
      infectionResultData: {},                  // 传染病模拟结果数据
      infectionPopulationData:              // 传染病感染总人数数据
        {
          xName: '模拟时刻(小时)',
          yName: '感染总人数(人)',
          xData: {},
          yData: [],
          useZoom: true
        },
      infectionPopulationPlanData:              // 传染病感染总人数数据(联防联控)
      {
        xName: '模拟时刻(小时)',
        yName: '感染总人数(人)',
        xData: {
        },
        yData: [],
        useZoom: true,
      },
      infectionDangerousPointList: [            // 传染病防灾重点区域
      ],

      /****  参数  ****/
      taskName: '任务',                          //输入的任务名
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
        '6': '特大暴雨'
      },
      rainBandSlopeOptions: {
        '99.0': '北-南 方向',
        '-2.41': '北北东-南南西 方向',
        '-1.0': '北东-南西 方向',
        '-0.414': '东北东-西南西 方向',
        '0.0': '东-西 方向',
        '0.414': '东南东-西北西 方向',
        '1.0': '南东-北西 方向',
        '2.41': '南南东-北北西 方向'
      },
      floodParam: {                               //输入的洪涝模拟参数
        'type': 'flood',
        'Whether drainage facilities are used': 'false',
        'Whether rain file is used': 'false',
        'Whether validation file is used': 'false',
        //以下是如果没有上传年降水文件，则显示的数据输入
        'InitX': '0.5',
        'InitY': '0.5',
        'Radius': '0.5',
        'Movement direction': '0.0',
        'Movement speed': '0.01',
        'Rain level': '0',
        'Rainfall per hour': '0.005',
        'Diffusion rate': '0.02',
        //以下是如果上传了年降水文件，才会显示的数据输入
        'Rain band initX': '0.5',
        'Rain band initY': '0.5',
        'Rain band slope': '0.0',
        'Rain band width': '0.25',
        'Rain band length': '0.5',
        'Rain band intensity': '5.0',
        'Wind start': '0',
        'Wind end': '0',
        'Wind speed': '0.0',
        //通讯基站相关数据
        'Whether station monitor are used': 'false'
      },
      infectionParamConfig: 'config1',           //疫情模拟配置
      infectionConfigOptions: {                   //疫情模拟配置选项
        'config1': '麻疹',
        'config2': '白喉',
        'config3': '天花',
        'config4': '风疹',
        'config5': '流行性腮腺炎',
        'config6': '百日咳',
        'config7': 'SARS',
        'config8': '流行性感冒',
        'config9': 'COVID-19',
        'config10': '中东呼吸综合征',
        'config11': '普通感冒',
        'config12': '水痘',
        'config13': '猴痘',
        'custom': '自定义'
      },
      infectionParam: {                          //输入的疫情模拟参数
        'R0': 15,
        'I_H_para': 0.03,
        'I_R_para': 0.11,
        'H_R_para': 0.11,
        'simulation_days': 1
      },
      initInfectionList: [],                      // 初始感染点
      lockInfectionList: [],                      // 封锁区域
      showInfectionInput: false,                  // 设置初始感染点对话框
      showInfectionLock: false,                   // 设置封锁区域对话框
      useLockInfection: false,                    // 是否使用封闭区域传染病模拟
      infectionLockDay: 1,                        // 区域封锁时长
      infectionLockTypeNames:                     // 封锁区域类型名称
        {
          0: '无管控措施',
          1: '人为管控措施',
          2: '强化学习动态管控措施'
        },
      hasPolicy: false,                       //是否有控制策略结果

      // 手动规划
      selectionList: [],                          //已添加的手动规划选址列表
      roadLevelList: [],                          //已添加的道路防灾等级模拟列表
      // getSelectionList:[],                        //当前规划方案下的已经规划的风险点
      nowSelectType: '',                           //当前所点击的点的类型
      nowSelectCapacity: '',                       //当前所点击点的容纳量

      //自动规划
      autoSelectionList: [], //暂存的自动规划选址列表
      autoPlanList: [], //当前环境下的自动规划方案列表
      automaticPlanRunning: false, //当前是否在运行自动规划
      nowPlanPointList: [], // 当前选择的规划方案已经存在的选址，在这个当前规划方案的基础上进行规划，应该把这些选址都包含在内
      showAutoPlanPoint: false, // 是否显示自动规划的选址

      // 应急规划方案
      newEmergencyPlanType: null,
      emergencyPlanTypes: [
        {
          id: 1,
          label: "临时避难安置场所选址"
        },
        {
          id: 2,
          label: "应急物资供应设施选址"
        },
        {
          id: 3,
          label: "急救站选址"
        }
      ],
      emergencyPlanRainTaskList: [],
      newEmergencyPlanRainTask: null,
      emergencyTaskLogList: [],

      // 弹窗
      popInfoRoad: { id: 0, coord: [0, 0], originalLevel: 1, newLevel: 1 },      //道路防灾等级模拟
      popInfoInfection: { id: 0, coords: [[0, 0]], value: 0 },  // 传染病网格弹窗信息
      trafficInfoData: { flow: 0, voc: 0 },

      /****  文件 ****/
      dataFileList: [   //gis-data/{cityName}/{type}/...
        {
          type: 'road',
          label: '路网数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ],
        },
        {
          type: 'building',
          label: '建筑物数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ],
        },
        {
          type: 'dem',
          label: '高程数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "tif","ovr","tfw","xml" ],
        },
        {
          type: 'precipitation',
          label: '年降水数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ],
        },
        {
          type: 'water',
          label: '水文数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ],
        },
        {
          type: 'od',
          label: '交通出行量数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "csv","xlsx" ],
        },
        {
          type: 'hospital',
          label: '医疗设施数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ],
        },
        {
          type: 'community',
          label: '居民区数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ],
        },
        {
          type: 'stationpoint',
          label: '通讯基站点数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ],
        },
        {
          type: 'stationarea',
          label: '通讯基站面数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ],
        },
        {
          type: 'validation',
          label: '实际涝点数据',
          files: [],
          filesInfo: [],
          status: false,
          extensions: [ "xls","xlsx","csv"],
        }
      ],
      // 图片
      helpImgs:       //数据要求
        {
          'water': require('@/assets/images/dataRequirement/waterFiles.jpg'),
          'road': require('@/assets/images/dataRequirement/roadFiles.jpg'),
          'building': require('@/assets/images/dataRequirement/buildingFiles.jpg'),
          'dem': require('@/assets/images/dataRequirement/demFiles.jpg'),
          'precipitation': require('@/assets/images/dataRequirement/precipitationFiles.jpg'),
          'od': require('@/assets/images/dataRequirement/odFiles.jpg'),
          'hospital': require('@/assets/images/dataRequirement/hospitalFiles.jpg'),
          'community': require('@/assets/images/dataRequirement/communityFiles.jpg'),
          'windrose': require('@/assets/images/dataRequirement/windRose.png')
        },

      CanAutoPlan: {
        isTimeReady: false,//时间是否达到自动规划所需要的时间
        isFileCircleReady: false,//危险范围的数据csv是否正确生成
        isFilePointReady: false,//危险社区点的数据csv是否正确生成
        isFileExistPointReady: false//当前已存在点数据是否正确生成
      },

      disableAutoPlanButton: true,//禁用自动规划按钮
      disableSaveAutoPlanButton: true,//禁用保存自动规划数据按钮
      existPlanPoint: [],//当前已有的规划点数据

      // 是否停止轮询，离开页面时停止
      stopContinuousRequest: false,
    }
  },
  computed: {},
  watch: {
    measureData: {
      handler(newVal, oldVal) {
        chartUtils.updateHistogram(this.chartMeasure, newVal)
        chartUtils.resizeChartBottom(this.chartMeasure, 'chartMeasure')
        // console.log("Histogram Updated")
      },
      deep: true
    },
    area: {
      handler(newVal) {
        this.$nextTick(() => {
          this.city = newVal[1]
          this.cityName = this.getCityName(this.city)
          //直接修改这个view
          // this.map.setView(mapUtils.getNewView(mapData[this.area[1]].center, mapData[this.city].extent, this.zoomLevel))
          // this.map.addLayer(mapUtils.getNewTileLayer(this.city))
          // console.log(this.map.getView().getCenter())

          //直接重置这个map（思奇）
          this.map.setTarget(null)
          this.map = null
          mapUtils.initOL(this)
          mapUtils.initOLMap(this)

          // 交通压力测度，有个点击弹窗事件，放在其他事件之前才能覆盖其他的
          if (this.city === 'shaoxing') {
            mapUtils.buildMapPressure(this)
          }

          mapUtils.addOverlay(this)  //添加点击后弹窗的overlay
          mapUtils.signleClickPlanPoint(this, this) //点击个性规划点之后的处理函数，该函数只处理个性规划点
          mapUtils.pointermove(this)//点击个性规划点之后的处理函数，该函数只处理个性规划点

          // mapUtils.buildResidentialAreasAtTime(this, this.stepTimeMap[this.activeTimeIndex])//处理居民区热力图的函数
          // //这个函数本来用于 选定城市底图,更新规划方案 的响应
          // this.handle8ServiceOnPlanSelected(this.city, this.bottomMap, '0')
          /**
           * 这个函数用于加载并显示 应急规划方案
           * 当前这个功能的开发属于停滞状态
           * 这个函数可能需要在init()中调用，也可能将来绑定在某个前端控件上，暂时先放在此处
           **/
          this.handleEmergencyPlanGenerate(this.city, this.stepTimeMap[this.activeTimeIndex], this.type, this.selectedServices, this.chartMeasure)

        })
      },
      deep: true
    },
    city: {
      async handler(newVal) {
        console.log('entered city watch')
        //楷彬
        // 获取数据信息
        requestUtils.getDataInfo(this)
        // 获取应急规划方案信息
        requestUtils.getPlanResultInfo(this)
        // 更新应急规划方案模拟任务列表
        this.getEmergencyPlanRainTaskList();
        //这里需要请求后端，查找对应城市的所有底图，修改this.bottomMapOptions
        //...

        //临时代码
        if(newVal === "jiangmen"){
          this.floodParam['Whether drainage facilities are used'] = 'true'
        } else {
          this.floodParam['Whether drainage facilities are used'] = 'false'
        }

        //在城市选定之后, 默认选定'now'作为城市底图
        if (this.bottomMap === 'now') {
          //这里需要请求后端，查找对应 城市、底图 的所有规划方案, 修改this.planList
          //...
          await this.getPlanList('now')
          this.handleFloodMagnitudesSimulationOnPlanListChanged(newVal, this.bottomMap, this.floodMagnitudes, this.planList)
          //令当前选中的规划方案为'0'
          this.nowPlanId = '0'
          this.handle8ServiceOnPlanSelected(newVal, this.bottomMap, this.nowPlanId)
        } else {
          this.$nextTick(() => {
            this.bottomMap = 'now'
          })
        }
      }
    },
    bottomMap: {
      async handler(newVal) {
        // console.log("entered bottomMap watch")
        //这里需要请求后端，查找对应 城市、底图 的所有规划方案, 修改this.planList
        //...
        await this.getPlanList(newVal)
        this.handleFloodMagnitudesSimulationOnPlanListChanged(this.city, newVal, this.floodMagnitudes, this.planList)

        //在底图选定之后，默认选定'0'作为当前规划方案
        if (this.nowPlanId === '0') {
          this.handle8ServiceOnPlanSelected(this.city, newVal, this.nowPlanId)
        } else {
          this.$nextTick(() => {
            this.nowPlanId = '0'
          })
        }
      }
    },
    nowPlanId: {
      handler(newVal) {
        // console.log("entered nowPlanId watch")
        /**
         * 这个函数在 nowPlanId 修改时触发，用于请求并更新 应急/日常 共8个服务的饼图数据
         **/
        this.handle8ServiceOnPlanSelected(this.city, this.bottomMap, newVal)
        this.handleAutoPlanList()
      }
    },
    planList: {
      handler(newVal) {
        this.handleFloodMagnitudesSimulationOnPlanListChanged(this.city, this.bottomMap, this.floodMagnitudes, newVal)
      },
      deep: true
    }
  },
  mounted() {
    this.init()
    window.onresize = () => {
      if (this.chartMeasure) {
        chartUtils.resizeChartCol(this.chartEmergency, 'chartEmergency')
        chartUtils.resizeChartCol(this.chartDaily, 'chartDaily')
        chartUtils.resizeChartCol(this.chartFlood, 'chartFlood')
        chartUtils.resizeChartBottom(this.chartService, 'chartService')
        chartUtils.resizeChartBottom(this.chartMeasure, 'chartMeasure')

      }
    }
  },
  beforeDestroy() {
    // 离开页面时停止所有轮询
    this.stopContinuousRequest = true;
  },
  methods: {
    //初始化
    async init() {
      //楷彬
      // 初始化地图
      mapUtils.initOL(this)
      mapUtils.initOLMap(this)
      // 获取城市列表
      this.getCityList()
      // 获取模拟记录列表数据
      this.getSimulationTaskList()
      // 获取数据信息
      requestUtils.getDataInfo(this)
      // 获取应急规划方案信息
      requestUtils.getPlanResultInfo(this)
      // 获取应急规划选址执行记录
      this.getEmergencyTaskLogList()

      // 致远
      // 添加事件处理
      // mapUtils.addMapEventListener(this);
      // mapUtils.buildMapPlanPoint(this)
      mapUtils.addOverlay(this)//添加点击后弹窗的overlay
      mapUtils.signleClickPlanPoint(this, this) //点击个性规划点之后的处理函数，该函数只处理个性规划点
      mapUtils.pointermove(this)//点击个性规划点之后的处理函数，该函数只处理个性规划点

      mapUtils.buildResidentialAreasAtTime(this, 0)//处理居民区热力图的函数
      mapUtils.buildCommunicationBaseStationAtTime(this, 0)//处理通信基站的函数

      //初始化规划方案列表，从后端获取
      //这个函数在init()中的顺序必须要在getDataInfo下面
      this.getPlanList(this.bottomMap)

      this.chartBasic = chartUtils.buildPieChart(this.chartBasicNames, this.maxchartBasicValues, this.normalchartBasicValues, this.chartBasicValues[this.stepTimeMap[this.activeTimeIndex]], 'chartBasic', 'macarons')
      chartUtils.resizeChartBottom(this.chartBasic, 'chartBasic')

      //思奇
      // 初始化四个图表
      // 城市服务性能 随 洪涝严重程度 变化图 用折线图展示
      this.chartService = chartUtils.buildChartLine(this.serviceData, 'chartService', 'infographic')
      chartUtils.resizeChartBottom(this.chartService, 'chartService')
      // 不同应急规划方案 与 城市现状 的城市韧性对比 用柱状图展示
      this.chartMeasure = chartUtils.buildHistogram(this.measureData, 'chartMeasure', 'customed')
      chartUtils.resizeChartBottom(this.chartMeasure, 'chartMeasure')
      // 人均可获得 应急/日常服务图 用饼图展示
      // this.chartEmergency = chartUtils.buildGauge(this.emergencyNames, this.maxEmergencyValues, this.normalEmergencyValues, this.emergencyValues[this.stepTimeMap[this.activeTimeIndex]], 'chartEmergency', 'customed')
      this.chartEmergency = chartUtils.buildPieChart(this.emergencyNames, this.maxEmergencyValues, this.normalEmergencyValues, this.emergencyValues[this.stepTimeMap[this.activeTimeIndex]], 'chartEmergency', 'customed')
      chartUtils.resizeChartCol(this.chartEmergency, 'chartEmergency')
      // this.chartDaily = chartUtils.buildGauge(this.dailyNames, this.maxDailyValues, this.normalDailyValues, this.dailyValues[this.stepTimeMap[this.activeTimeIndex]], 'chartDaily', 'westeros')
      //this.chartDaily = chartUtils.buildGauge(this.dailyNames, [100, 20, 40, 5], [50, 30, 40, 3], [40, 20, 10, 1], 'chartDaily', 'westeros')
      this.chartDaily = chartUtils.buildPieChart(this.dailyNames, this.maxDailyValues, this.normalDailyValues, this.dailyValues[this.stepTimeMap[this.activeTimeIndex]], 'chartDaily', 'westeros')
      chartUtils.resizeChartCol(this.chartDaily, 'chartDaily')
      // 模拟洪涝灾害淹没情况图 用折线图展示
      // this.chartFlood = chartUtils.buildChartLine1(this.floodData, 'chartFlood', 'macarons')
      // chartUtils.resizeChartCol(this.chartFlood, 'chartFlood')

      // 更新中间折线图的数据
      // this.handleFloodMagnitudesSimulationOnPlanListChanged(this.city, this.bottomMap, this.floodMagnitudes, this.planList)
      // 更新右侧的饼图
      this.handle8ServiceOnPlanSelected(this.city, this.bottomMap, this.nowPlanId)
      /**
       * 这个函数用于加载并显示 应急规划方案
       * 当前这个功能的开发属于停滞状态
       * 这个函数可能需要在init()中调用，也可能将来绑定在某个前端控件上，暂时先放在此处
       **/
      this.handleEmergencyPlanGenerate(this.city, this.stepTimeMap[this.activeTimeIndex], this.type, this.selectedServices, this.chartMeasure)

    },
    // 更新
    update() {

    },
    getSimulationTaskList() {
      //将[洪涝模拟, 传染病模拟]的任务列表置为空
      this.simulationTaskList = []
      // 将洪涝模拟的任务列表置为空
      this.floodSimulationList = []
      //将传染病模拟的任务列表置为空
      this.infectionSimulationList = []
      // 获取洪涝模拟任务列表
      requestUtils.getTaskList(this, () => {
        this.getEmergencyPlanRainTaskList();
      });
      // 获取传染病模拟任务列表
      requestUtils.inquireCityInfectionSimulation(this, 0)
      requestUtils.inquireCityInfectionSimulation(this, 1)
      requestUtils.inquireCityInfectionSimulation(this, 2)
    },
    //发送全局提示
    sendMessage(message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    // 控制设置面板的弹出框是否显示
    popoverShow(refName) {
      this.$refs[refName].doShow()
    },
    // 控制设置面板中的弹出框是否长期显示
    isStick(stick, refName) {
      if (!stick) {
        this.$refs[refName].doClose()
      }
    },
    // 当左侧设置面板收起时，关闭其中的所有popover
    handSettingPanelClose(done) {
      this.$refs['popCreation'].doClose()
      this.$refs['popHistory'].doClose()
      this.$refs['popArea'].doClose()
      done()
    },
    // 设置柱状图数据的内容
    setMeasureData(key, val) {
      this.measureData[key] = val
    },
    // 从Map中删除所有当前显示的emergencyLayers, 并且清空emergencyLayers列表
    clearEmergencyLayers() {
      this.map.getLayers().forEach((layer) => {
        if (this.emergencyLayers[layer.layerName]) {
          this.map.removeLayer(layer)
        }
      })
      this.emergencyLayers = {}
    },
    // 重置视图
    resetView() {
      // this.sendMessage(mapData[this.city].center)
      this.city = this.area[1]
      //直接修改这个view
      this.map.setView(mapUtils.getNewView(mapData[this.area[1]].center, mapData[this.city].extent, this.zoomLevel))
      this.map.addLayer(mapUtils.getNewTileLayer(this.city))
      // this.map.getView().setCenter(mapData[this.area[1]].center)
      // this.map.getView().setZoom(this.zoomLevel)
    },
    // 上一时刻
    previous() {
      if (this.activeTimeIndex > 0) {
        this.activeTimeIndex--
      } else {
        return
      }

      //每当进入一个新时刻，就需要把居民区的所有按钮全部置为不可用，等待后端返回数据并计算出结果后再将其置为可用
      // this.disableAllResidentialAreasBottom()

      //修改应急服务图表
      // chartUtils.updateGauge(this.chartEmergency, cityServicePerformanceAPI.mockEmergencyNames, cityServicePerformanceAPI.mockEmergencyData[this.stepTimeMap[this.activeTimeIndex]])
      // chartUtils.updatePieChart(this.chartEmergency, this.emergencyNames, this.maxEmergencyValues, this.normalEmergencyValues, this.emergencyValues[this.stepTimeMap[this.activeTimeIndex]], 'customed')
      //修改日常服务图表
      // chartUtils.updateGauge(this.chartDaily, cityServicePerformanceAPI.mockDailyNames, cityServicePerformanceAPI.mockDailyData[this.stepTimeMap[this.activeTimeIndex]])
      // chartUtils.updatePieChart(this.chartDaily, this.dailyNames, this.maxDailyValues, this.normalDailyValues, this.dailyValues[this.stepTimeMap[this.activeTimeIndex]], 'westeros')
      //如果回退到0时刻，则调用计算常态下8个服务的函数
      if (this.stepTimeMap[this.activeTimeIndex] === 0) {
        this.handle8ServiceOnPlanSelected(this.city, this.bottomMap, this.nowPlanId)
      } else {
        if (this.currentSimulationType === 'flood') {
          this.handleSimulationTimeChangeFor8Service(this.city, this.bottomMap, this.nowPlanId, this.taskId, this.type, this.stepTimeMap[this.activeTimeIndex])
        } else if (this.currentSimulationType === 'infection') {
          this.handleInfectionSimulationTimeChangeFor8Service(this.city, this.bottomMap, this.currentInfectionDay, this.stepTimeMap[this.activeTimeIndex], this.currentTask.simulation_time)
        }
      }
      //修改柱状图
      this.measureData.xData = cityServicePerformanceAPI.mockMeasureXData[this.stepTimeMap[this.activeTimeIndex]]
      //将当前显示在map中的应急规划方案 移除
      this.clearEmergencyLayers()

      // 洪涝模拟结果显示更新
      if (this.currentSimulationType === 'flood') {
        mapUtils.buildMapAtTime(this, this.stepTimeMap[this.activeTimeIndex])
        mapUtils.getAutoPlanList(this)
      }

      // 传染病模拟结果显示更新
      if (this.currentSimulationType === 'infection') {
        this.currentInfectionHour = this.stepTimeMap[this.activeTimeIndex]
        this.onInfectionShowChange()
      }
    },
    // 下一时刻
    next() {
      if (this.activeTimeIndex < this.maxTimeIndex) {
        this.activeTimeIndex++
      } else {
        return
      }

      //每当进入一个新时刻，就需要把居民区的所有按钮全部置为不可用，等待后端返回数据并计算出结果后再将其置为可用
      // this.disableAllResidentialAreasBottom()

      // 洪涝模拟结果和测度显示更新
      if (this.currentSimulationType === 'flood') {
        //修改应急服务图表
        // chartUtils.updateGauge(this.chartEmergency, cityServicePerformanceAPI.mockEmergencyNames, cityServicePerformanceAPI.mockEmergencyData[this.stepTimeMap[this.activeTimeIndex]])
        // chartUtils.updatePieChart(this.chartEmergency, this.emergencyNames, this.maxEmergencyValues, this.normalEmergencyValues, this.emergencyValues[this.stepTimeMap[this.activeTimeIndex]], 'customed')
        //修改日常服务图表
        // chartUtils.updateGauge(this.chartDaily, cityServicePerformanceAPI.mockDailyNames, cityServicePerformanceAPI.mockDailyData[this.stepTimeMap[this.activeTimeIndex]])
        // chartUtils.updatePieChart(this.chartDaily, this.dailyNames, this.maxDailyValues, this.normalDailyValues, this.dailyValues[this.stepTimeMap[this.activeTimeIndex]], 'westeros')
        this.handleSimulationTimeChangeFor8Service(this.city, this.bottomMap, this.nowPlanId, this.taskId, this.type, this.stepTimeMap[this.activeTimeIndex])
        mapUtils.buildMapAtTime(this, this.stepTimeMap[this.activeTimeIndex])
        mapUtils.getAutoPlanList(this)
      }

      //修改柱状图
      this.measureData.xData = cityServicePerformanceAPI.mockMeasureXData[this.stepTimeMap[this.activeTimeIndex]]
      //将当前显示在map中的应急规划方案 移除
      this.clearEmergencyLayers()

      // 传染病模拟结果和测度显示更新
      if (this.currentSimulationType === 'infection') {
        this.currentInfectionHour = this.stepTimeMap[this.activeTimeIndex]
        this.onInfectionShowChange()
        this.handleInfectionSimulationTimeChangeFor8Service(this.city, this.bottomMap, this.currentInfectionDay, this.currentInfectionHour, this.currentTask.simulation_time)
      }
    },
    // 传染病天数变化
    onInfectionDayChange() {
      this.currentInfectionHour = this.stepTimeMap[this.activeTimeIndex]
      // 更新8个服务
      if (this.currentInfectionHour === 0 && this.currentInfectionDay === 0) {
        this.handle8ServiceOnPlanSelected(this.city, this.bottomMap, this.nowPlanId)
      } else {
        this.handleInfectionSimulationTimeChangeFor8Service(this.city, this.bottomMap, this.currentInfectionDay, this.currentInfectionHour, this.currentTask.simulation_time)
      }
      // 更新热力图显示
      this.onInfectionShowChange()
    },
    // 点击上传文件按钮
    onClickDataUpload(dataItem) {
      this.showDataUpload = true
      this.currentUploadType = dataItem.type

    },
    // 点击下载文件按钮
    onClickDataDownload(fileItem) {
      let url = `${serverInfo.baseURL_file}/download?city=${this.city}&type=${fileItem.type}&file=${fileItem.name}`
      window.location.href = url
    },
    // 点击删除文件按钮
    onClickDataDelete(fileItem) {
      let url = `${serverInfo.baseURL_file}/delete?city=${this.city}&type=${fileItem.type}&file=${fileItem.name}`
      axios
        .get(url)
        .then((res) => {
          if (res.data) {
            this.$message({
              message: res.data,
              type: 'success'
            })
            requestUtils.getDataInfo(this)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message({
            message: '删除数据文件失败',
            type: 'error'
          })
        })

    },
    // 上传数据文件
    uploadDataFiles(file, fileList, row) {
      console.log("uploadDataFiles",file,row)
      {
        let fileName = file.name;
        let parts = fileName.split('.')
        let ext = parts[parts.length-1];
        if(!row.extensions.includes(ext)){
          this.$message.error(`无法上传格式为${ext}的文件！`);
          row.files = row.files.slice(0,-1);
          return;
        }
      }
      // // 上传路网数据
      // if (row.upload === 'uploadRoadFiles') {
      //   let fileName = file.name
      //   if (fileName.split('.')[0] !== 'roads') {
      //     setTimeout(() => {
      //       this.$message.error(`请将上传文件命名为roads.${fileName.split('.')[1]}`)
      //     }, 100)
      //     this.dataFileList[0].files = this.dataFileList[0].files.slice(0, -1)
      //     return
      //   } else {
      //     this.dataFileList[0].files.push(file)
      //     return
      //   }
      // }
      // // 上传建筑物数据
      // if (row.upload === 'uploadBuildingFiles') {
      //   let fileName = file.name
      //   if (fileName.split('.')[0] !== 'buildings') {
      //     setTimeout(() => {
      //       this.$message.error(`请将上传文件命名为buildings.${fileName.split('.')[1]}`)
      //     }, 100)
      //     this.dataFileList[1].files = this.dataFileList[1].files.slice(0, -1)
      //     return
      //   } else {
      //     this.dataFileList[1].files.push(file)
      //     return
      //   }
      // }
      // // 上传高程数据
      // if (row.upload === 'uploadDemFiles') {
      //   let fileName = file.name
      //   if (fileName.split('.')[0] !== 'dem') {
      //     setTimeout(() => {
      //       this.$message.error(`请将上传文件命名为dem.${fileName.split('.')[1]}`)
      //     }, 100)
      //     this.dataFileList[2].files = this.dataFileList[2].files.slice(0, -1)
      //     return
      //   } else {
      //     this.dataFileList[2].files.push(file)
      //     return
      //   }
      // }
      // 上传其他数据
      row.files.push(file)
    },
    // 上传数据文件检查格式
    beforeDataUpload(file, item){
      console.log("beforeDataUpload",file,item);
    },
    // 上传文件请求
    submitUploadFiles(dataItem) {
      if(dataItem.files.length == 0){
        this.$message({
          message: `上传文件列表为空，请选择上传文件！`,
          type: 'warning'
        })
        return;
      }
      let zipFile = new JSZip();
      dataItem.files.forEach((f) => {
        zipFile.file(f.name,f.raw, { binary: true });
      });
      zipFile.generateAsync({ type: "blob" })
      .then((blob) => {
        let file = new File([blob],`${dataItem.type}.zip`,{type: "zip"});
        dataItem.files.push({
          name: `${dataItem.type}.zip`,
          raw: file,
        });
        requestUtils.uploadData(this, dataItem, () => {
            dataItem.files = []
            this.showDataUpload = false
            requestUtils.getDataInfo(this)
            requestUtils.publishGeo(this.city,dataItem.type)
          })

      }, (e) => {
        console.warn("压缩文件失败：",e);
        requestUtils.uploadData(this, dataItem, () => {
            dataItem.files = []
            this.showDataUpload = false
            requestUtils.getDataInfo(this)
            requestUtils.publishGeo(this.city,dataItem.type)
          })
      });

 
    },
    // 改变暴雨洪涝模拟的参数配置
    onFloodConfigChange(option) {
      const rainfalls = {
        'config1': '0.011468',    //5年一遇
        'config2': '0.014316',    //10年一遇
        'config3': '0.020928',    //50年一遇
        'config4': '0.023775'    //100年一遇
      }
      this.floodParam['Rain level'] = '0'
      this.floodParam['Rainfall per hour'] = rainfalls[option]
      this.floodParam['Rain band intensity'] = '0'
    },
    // 改变传染病参数配置
    onInfectionConfigChange(option) {
      const R0s = {
        'config1': 15, // '麻疹'
        'config2': 6.5, // '白喉'
        'config3': 6, //'天花'
        'config4': 6, //'风疹'
        'config5': 11, //'流行性腮腺炎'
        'config6': 5.5, //'百日咳'
        'config7': 2.9, //'SARS'
        'config8': 2, //'流行性感冒'
        'config9': 3.8, //'COVID-19'
        'config10': 0.5, //'中东呼吸综合征'
        'config11': 2.5, //'普通感冒'
        'config12': 11, //'水痘'
        'config13': 1.26 //'猴痘'
      }
      this.infectionParam['R0'] = R0s[option]
    },
    // 提交模拟任务
    submitTask() {
      // this.city = this.area[1]
      // this.resetView();
      if (this.type === 'infection') {
        requestUtils.submitInfectionGridSimulation(this, () => {
          this.getSimulationTaskList()
        })

      } else if (this.type === 'flood') {
        //检查通讯基站数据是否上传
        this.isStationFileUploaded(this.dataFileList)
        //检查实际涝点数据是否上传
        this.isValidationFileUploaded(this.dataFileList)
        // console.log(this.floodParam['Whether station monitor are used'])
        requestUtils.submitFloodSimulation(this, () => {
          this.getSimulationTaskList();
        })
      }
    },
    // 查看模拟任务
    async clickTask(task) {
      console.log('ClickTask:', task)
      // 判断模拟任务的城市是否为当前城市
      if (this.city != task.city) {
        this.$message({
          message: `当前城市为${this.cityName}，请先将城市切换为${this.getCityName(task.city)}`,
          type: 'warning'
        })
        return
      }
      this.currentSimulationType = task.simulationType
      this.currentTask = task
      this.taskId = task.id
      // 洪涝模拟任务
      if (task.simulationType === 'flood') {
        //将洪涝模拟展示的数据容器清空
        this.currentSimulationResult = {
          'submergedcells': {},
          'availableroads': {},
          'submergedroads': {},
          'dangerousroads': {},
          'riskcells': {},
          'riskpoints': {}
        }
        this.showLayers['grid'] = false
        requestUtils.getTaskResult(this, this.currentTask, () => {
          this.timeControlDisabled = false
          mapUtils.buildRiskLayer(this, this.currentTask)
        })
      }
      // 传染病模拟任务
      else if (task.simulationType === 'infection') {
        // 清空已有的传染病缓存数据
        this.infectionResultData = {}
        // 关闭洪涝模拟图层显示
        this.showLayers['submergedCells'] = false
        this.showLayers['submergedRoads'] = false
        this.showLayers['dangerousRoads'] = false
        this.showLayers['submergedRoads'] = false
        this.showLayers['availableRoads'] = false
        // 设置任务模拟总时间
        this.maxInfectionDay = task.para_json.simulation_days
        // 重置变量
        this.hasPolicy = false
        this.currentInfectionDay = 1
        this.currentInfectionShowType = 'total_num_data'
        this.thresholdInfected = 1
        // 获取网格数据
        requestUtils.getInfectionGrid(this, false, () => {
          // 获取传染病模拟结果
          requestUtils.getInfectionSimulationResult(this, this.currentInfectionDay, this.currentInfectionHour, task.simulation_time, task.lockType,
            () => {
              this.timeControlDisabled = false
              // 根据数据更新网格热力图颜色
              let colorMap = 1
              if (this.currentInfectionShowType === 'total_num_data' || this.currentInfectionShowType === 'S_data') {
                colorMap = 2
              }
              mapUtils.updateInfectionLayer(this.currentInfectionGridSource,
                this.infectionResultData[`${this.currentInfectionDay}_${this.currentInfectionHour}`][this.currentInfectionShowType],
                colorMap)
            })
        })
        // 获取控制策略结果
        if (task.lockType === 0) {
          requestUtils.getGridControlPolicy(this, 1, 4, task.simulation_time, (data) => {
            this.hasPolicy = true
          })
        }
        // 构建感染总人数折线图
        this.$nextTick(() => {
          this.chartInfection = chartUtils.buildChartLine(this.infectionPopulationData, 'chartInfection', 'customed')
          chartUtils.resizeChartBottom(this.chartInfection, 'chartInfection')
          this.chartInfection.showLoading()
          // 获取感染总人数数据并更新折线图
          this.onAddInfectionChart(this.currentTask);
          // let names = ['无封锁区域', '手动封锁区域', '强化学习封锁区域']
          // for (let i = 0; i < 3; ++i) {
          //   requestUtils.getInfectionTotalPopulation(this, i, null, false, (res) => {
          //     let num_times = Math.max(this.infectionPopulationData.yData.length, res.length)
          //     this.infectionPopulationData.yData = []
          //     for (let t = 1; t <= num_times; ++t) {
          //       this.infectionPopulationData.yData.push(t)
          //     }
          //     let name = `最新任务-${names[i]}`
          //     this.infectionPopulationData.xData[name] = res
          //     chartUtils.updateLineChart(this.chartInfection, this.infectionPopulationData)
          //     this.chartInfection.hideLoading()
          //   })
          // }

        })
      }
      this.onDisplayChange()
    },
    // 添加传染病模拟任务到对比曲线中
    onAddInfectionChart(task) {
      // 获取感染总人数数据并更新折线图
      let names = ['无管控措施', '人为管控措施', '强化学习动态管控措施']
      requestUtils.getInfectionTotalPopulation(this, task.lockType, task.simulation_time, false, (res) => {
        let num_times = Math.max(this.infectionPopulationData.yData.length, res.length)
        this.infectionPopulationData.yData = []
        for (let t = 1; t <= num_times; ++t) {
          this.infectionPopulationData.yData.push(t)
        }
        let cityName = this.getCityName(task.city);
        let name = `任务${task.id}-${cityName}-${names[task.lockType]}`
        this.infectionPopulationData.xData[name] = res
        chartUtils.updateLineChart(this.chartInfection, this.infectionPopulationData)
        this.chartInfection.hideLoading()
      })
    },

    // 进入联防联控预案生成模式
    async handleJointPreventionPlanGenerate() {
      // let jointPreventionCity = task.city
      // let simulationType = task.simulationType
      // let jointPreventionTaskId = task.id

      //1. 进入联防联控预案生成模式, 若第一次进入，对右侧面板的内容进行设置
      if (this.jointPlanEditMode === false) {
        this.showPlanPanel = true
        this.jointPlanEditMode = true

        //1.1 设置仿真模拟结果
        // 下一帧再调用，否则模拟类型切换之前右侧仿真模拟结果图表未显示，找不到对应的dom
        this.$nextTick(() => {
          if (this.currentSimulationType === "flood") {
            this.processFloodRecord()
            this.getFloodAdvice()
          }
          else if (this.currentSimulationType === "infection")
            this.processInfectionRecord()
        })

        // this.chartFlood = chartUtils.updateChartLine1(this.floodData, this.chartFlood, 'macarons')
        // chartUtils.resizeChartCol(this.chartFlood, 'chartFlood')

        //1.2 设置防灾重点区域
        // console.log("floodPointLayer Before Draw", this.floodDangerousPointLayer)
        // console.log("floodPointLayer After Draw", this.floodDangerousPointLayer)
        //1.3 设置规划决策建议
      }
      // console.log("jointPlanEditMode", this.jointPlanEditMode)
      //2. 关闭左边的设置面板
      this.$refs['popCreation'].doClose()
      this.$refs['popHistory'].doClose()
      this.$refs['popArea'].doClose()
      this.showSettingPanel = false

      //3. 弹出联防联控预案编辑面板
      this.showJointPlan = true
    },

    // 请求floodRecord数据，生成 仿真模拟结果图表 + 危险点列表
    async processFloodRecord() {
      //1. 请求后端数据并处理
      // console.log("this.taskId", this.taskId)
      let records = await jointPlanAPI.getFloodRecord(this.taskId)
      for (let record of records) {
        this.floodData.xData['危险区域'][record.timestep] = record.upcominginundatedarea / record.totalarea
        this.floodData.xData['淹没区域'][record.timestep] = record.inundatedarea / record.totalarea
      }
      this.floodData.xMax = records[24].totalarea
      this.floodDangerousPointList = JSON.parse(records[24].mostdangerousposition)

      //2. 模拟洪涝灾害淹没情况图 用折线图展示
      this.chartFlood = chartUtils.buildChartLine1(this.floodData, 'chartFlood', 'macarons')
      chartUtils.resizeChartCol(this.chartFlood, 'chartFlood')

      //3. 绘制防灾重点区域
      this.floodDangerousPointLayer = mapUtils.drawDangerousPoint(this,this.floodDangerousPointList, this.floodDangerousPointFeatures, this.floodDangerousPointLayer, this.map)

      // console.log("floodRecord", JSON.parse(records[5].mostdangerousposition))
    },
    //获取洪涝模拟的决策建议数据，生成 预案编制建议
    async getFloodAdvice() {
      let data = await jointPlanAPI.getAdvice(this.taskId, 24)
      console.log(data)
      this.flood_advice.carCount = data.vehiclesNum
      this.flood_advice.peopleCount = data.personNum
      this.flood_advice.shipCount = data.shippingNum
      this.flood_advice.riskPlace = data.riskPlace
    },

    // 请求infectionRecord数据，生成 仿真模拟结果图表 + 危险点列表
    async processInfectionRecord() {
      console.log("processInfectionRecord");
      // 初始化折线图，显示为加载中
      this.chartInfectionPlan = chartUtils.buildChartLine(this.infectionPopulationPlanData, 'chartInfectionPlan', 'customed')
      chartUtils.resizeChartCol(this.chartInfectionPlan, 'chartInfectionPlan')
      this.chartInfectionPlan.showLoading()
      // 获取感染总人数数据并更新折线图
      let names = ["无管控措施", "人为管控措施", "强化学习动态管控措施"];
      requestUtils.getInfectionTotalPopulation(this, this.currentTask.lockType, this.currentTask.simulation_time, false, (res) => {
        let num_times = Math.max(this.infectionPopulationPlanData.yData.length, res.length);
        this.infectionPopulationPlanData.yData = [];
        for (let t = 1; t <= num_times; ++t) {
          this.infectionPopulationPlanData.yData.push(t);
        }
        let name = `任务${this.currentTask.id}-${names[this.currentTask.lockType]}`;
        this.infectionPopulationPlanData.xData[name] = res;
        chartUtils.updateLineChart(this.chartInfectionPlan, this.infectionPopulationPlanData);
        this.chartInfectionPlan.hideLoading()
      });
      requestUtils.getInfectionTotalPopulation(this, 2, null, false, (res) => {
        let num_times = Math.max(this.infectionPopulationPlanData.yData.length, res.length);
        this.infectionPopulationPlanData.yData = [];
        for (let t = 1; t <= num_times; ++t) {
          this.infectionPopulationPlanData.yData.push(t);
        }
        let name = `最新任务-${names[2]}`
        this.infectionPopulationPlanData.xData[name] = res;
        chartUtils.updateLineChart(this.chartInfectionPlan, this.infectionPopulationPlanData);
        this.chartInfectionPlan.hideLoading()
      });
    },
    // 处理传染病防灾重点区域
    processInfectionDangerousList() {
      console.log("processInfectionDangerousList");
      this.infectionDangerousPointList = [];
      this.adviceInfection.peopleCount = 0;
      this.adviceInfection.carCount = 0;
      this.adviceInfection.riskList = [];
      let features = this.currentRiskSource.getFeatures();

      features.forEach((feature) => {
        let info = feature.info;
        if (info) {
          console.log(info);
          let gid = info.id;
          let coords = info.center;
          let population =  Math.round(info.value);
          let url = serverInfo.baseURL_reverse + `/reverse.php?format=jsonv2&lat=${coords[1]}&lon=${coords[0]}`;
          axios.get(url)
            .then(res => {
              if (res.status === 200) {
                let reverseInfo = res.data;
                this.infectionDangerousPointList.push({
                  gid: gid,
                  lon: coords[0].toFixed(4),
                  lat: coords[1].toFixed(4),
                  population: population,
                  display_name: reverseInfo.display_name,
                  reverseInfo: reverseInfo,
                });
                let text = this.getAdviceInfection(reverseInfo.category,population);
                if(text)
                  this.adviceInfection.riskList.push({
                    name: reverseInfo.display_name.split(',')[0],
                    text: text
                  })
                this.adviceInfection.peopleCount += population;
                this.adviceInfection.carCount += Math.ceil(population/4);
              }
            })

        }
      });

    },
    getAdviceInfection(type,population){
      if(type === "road" || type === "highway")
        return `该区域为公路区域，目前感染人数为${population}。传播风险较高，建议采取交通限制措施，如关闭某些道路、桥梁或入口，以限制人员和车辆的流动，可以减缓疾病的传播速度。另外，增加城市道路和公共场所的清洁频率，定期消毒公共交通工具、站点、手扶梯等，消灭病毒，保障市民的安全和健康。`
      if(type === "man_made")
        return `该区域为人流较为密集的区域，目前感染人数为${population}，接触感染者的风险较高，建议控制人群流量和人群接触距离，取消大规模人群聚集活动，避免感染大规模暴发。同时，需要注意控制场所人群流量的方法，避免引发人群恐慌。最后，建议定时对公共场所进行消毒，切断病毒传播途径。`
      if(type === "amenity" || type === "place")
        return `该区域为公共设施区域，为人群提供生活服务保障服务，目前感染人数为${population}。该区域建议鼓励人们在公共设施中保持社交距离，通常建议至少保持2米的距离。鼓励或要求人们在公共设施中佩戴口罩，特别是在无法保持足够社交距离的情况下。在可能的情况下，支持远程工作和在线服务，以减少人们在公共设施中的互动。定期清洁和消毒高触摸表面，如门把手、电梯按钮、扶手、公共厕所的水龙头和抽水马桶按钮等。`
      if(type === "tourism")
        return `该区域为旅游热点，目前感染人数为${population}。因为吸引了大量的游客，游客之间的密切接触，容易促进传染病的传播，区域传播风险较高。建议限制景点、餐馆、酒店等公共场所的入场人数，以确保游客能够保持足够的社交距离。在需要排队等候的地方标记出安全距离，并设立社交距离监控点。同时，建议与当地卫生部门合作，密切监测传染病的流行情况，根据需要采取适当的措施，例如加强防控措施或限制进入。`
      if(type === "building")
        return `该区域内包含建筑物，目前感染人数为${population}。建筑物内人群高度密集，长时间聚集导致感染几率增加。建议在建筑物内的公共区域标记出安全的社交距离，如电梯、候诊区、食堂等。促使员工和访客保持社交距离，并限制人数以避免拥挤。在建筑物内设置足够的洗手站点，并提供洗手液和纸巾。鼓励远程工作和在线会议，以减少建筑物内的人员流动。`
      return null;
    },
    //退出联防联控预案编辑模式
    handleJointPreventionPlanExit() {
      //1. 将危险点图层从地图出移除
      // console.log("floodDangerousPointLayer", this.floodDangerousPointLayer)
      this.floodDangerousPointFeatures=[];
      this.map.removeLayer(this.floodDangerousPointLayer);
      this.floodDangerousPointLayer = null
      //2. 关闭联防联控预案编辑面板, 重新加载此组件
      this.showJointPlan = false
      //3. 退出编辑模式
      this.jointPlanEditMode = false
    },
    //给危险点列表添加rowIndex属性
    addRowCount({ row, rowIndex }) {
      row.rowIndex = rowIndex
    },
    //当鼠标悬停于重点防灾区域表格上方
    onMouseOverDangerousPositionTable(row) {
      mapUtils.dangerousPointChangeStyle(this,this.floodDangerousPointFeatures, row.rowIndex, '#FF0000')
    },
    //当鼠标离开重点防灾区域表格上方
    onMouseOutDangerousPositionTable(row) {
      mapUtils.dangerousPointChangeStyle(this,this.floodDangerousPointFeatures, row.rowIndex, '#FC7C7C')
    },
    //当鼠标点击重点防灾区域表格
    onClickOverDangerousPositionTable(row) {
      mapUtils.addDangerousPositionPopup(this,this.floodDangerousPointList,row.rowIndex)
    },
    //关闭危险位置弹窗
    closeDangerousPositionPopup() {

      this.floodDangerousOverlay.setPosition(undefined);
    },
    //检查当前时刻 "年降水文件"是否上传
    isPrecipitationFileUploaded(dataFileList) {
      for (let dataFile of dataFileList) {
        if (dataFile.type === 'precipitation' && dataFile.status === true) {
          for (let file of dataFile.filesInfo) {
            if (file.name === 'rain.tif') {
              // console.log("检查了年降水文件是否上传")
              this.floodParam['Whether rain file is used'] = 'true'
              return true
            }
          }
        }
      }
      this.floodParam['Whether rain file is used'] = 'false'
      return false
    },
    //检查当前时刻 "验证文件/实际涝点文件" 是否上传
    isValidationFileUploaded(dataFileList) {
      for (let dataFile of dataFileList) {
        if (dataFile.type === 'validation' && dataFile.status === true) {
          for (let file of dataFile.filesInfo) {
            if (file.name === 'validation.xls' || file.name === 'validation.xlsx' || file.name === 'validation.csv') {
              // console.log("检查了验证文件是否上传")
              this.floodParam['Whether validation file is used'] = 'true'
              return true
            }
          }
        }
      }
      this.floodParam['Whether validation file is used'] = 'false'
      return false
    },
    //检查"通讯基站点数据"和"通讯基站面数据"是否上传
    isStationFileUploaded(dataFileList) {
      let isStationPointUpload = false;
      let isStationAreaUpload = false;
      for (let dataFile of dataFileList) {
        if (dataFile.type === 'stationpoint' && dataFile.status === true) {
          for (let file of dataFile.filesInfo) {
            if (file.name === 'stationpoint.shp') {
              isStationPointUpload = true
            }
          }
        }
        if (dataFile.type === 'stationarea' && dataFile.status === true) {
          for (let file of dataFile.filesInfo) {
            if (file.name === 'stationarea.shp') {
              isStationAreaUpload = true
            }
          }
        }
      }
      if (isStationPointUpload && isStationAreaUpload) {
        this.floodParam['Whether station monitor are used'] = 'true'
        return true
      }
      this.floodParam['Whether station monitor are used'] = 'false'
      return false
    },

    // 模拟模式改变
    onCreationModeChange(mode) {
      if (mode[1] == 'manualPlan') {
        mapUtils.addPlanSelection(this)
        // 手动规划不应该只能在城市现状底图上进行
        // this.nowPlanId = '0'
        // this.handlePlanChange()
      }
      else if(mode[1]=='automaticPlan')
      {
        console.log("切换成功，准备调用获取任务列表函数")
        mapUtils.getAutoPlanList(this)
      }
      else {
        this.selectionList = []
        this.roadLevelList = []
        mapUtils.removePlanSelection(this)
      }
    },
    // 手动规划模拟模式改变：选址规划/道路防灾等级
    onManualPlanModeChange(mode) {
      if (mode == 'selection') {
        this.onSelectionModeChange()
      } else {
        mapUtils.pausePlanSelection(this)
      }
    },
    // 选址类型改变
    onSelectionModeChange(type) {
      mapUtils.changeSelectionMode(this)
    },
    // 删除选址
    removeSelection(selection, index) {
      this.planSelectionLayers[selection.type].source.removeFeature(selection.feature)
      this.selectionList.splice(index, 1)
    },
    // 清空手动规划列表
    clearManualPlan() {
      this.selectionList = []
      this.roadLevelList = []

      mapUtils.removePlanSelection(this)
      // mapUtils.addPlanSelection(this)
    },

    //将规划的储备点存储到服务器当中
    savePlanPoint() {
      console.log('进入了savePlanPoint函数')
      const params = {
        city: this.city,
        planid: this.responsePlanID,
        mapname: this.bottomMap
      }

      console.log("nowPlanPointList",this.selectionList)
      let sendList = [];
      // for (let item of this.nowPlanPointList) {
      //   console.log("要储存的规划点数据为:",item)
      //   item.position = [item.positionX, item.positionY]
      //   this.selectionList.push(item)
      // }
      for (let i = 0; i < this.selectionList.length; i++) {
        sendList.push({
          'planid': this.responsePlanID,
          'type': this.selectionList[i].type,
          'positionX': this.selectionList[i].position[0],
          'positionY': this.selectionList[i].position[1],
          'capacity': this.selectionList[i].capacity,
          'scale': this.selectionList[i].scale,
          'mapname': this.bottomMap,
          'city': this.city
        })
        console.log("sendList",sendList)
      }
      console.log('发送给后端的参数为', params)
      const url = serverInfo.baseURL + '/measure/addPlanPoint'
      console.log(sendList)
      axios.post(url, sendList, { params })
        .then(response => {
          if (response.data === '构造成功') {
            this.$message({
              message: `存储个性规划点成功`,
              type: 'success'
            })
          } else {
            this.$message({
              message: `存储个性规划点失败`,
              type: 'warning'
            })
          }
          console.log(response.data)
        })
        .catch(error => {
          console.error(error)
        })
    },

    //保存个性预案的ID和命名到后端数据库
    async savePlanName() {
      const params = {
        city: this.city,
        mapname: this.bottomMap,
        planname: this.newPlanName
      }

      const url = serverInfo.baseURL + '/measure/addPlan'
      console.log('发送给后端的参数为', params)
      console.log('进入了savePlanName函数')
      const res = await axios.post(url, null, { params })
      console.log('res', res)
      console.log('savePlanName函数收到了后端发送的数据')
      if (res.data.status === '构造成功') {
        let tmpPlanList = JSON.parse(JSON.stringify(this.planList))
        // let tmpPlanList = [...this.planList]
        tmpPlanList[(res.data.planid).toString()] = this.newPlanName
        this.planList = tmpPlanList
        // this.planList[(res.data.planid).toString()] = this.newPlanName
        this.responsePlanID = res.data.planid
        console.log('responsePlanID', this.responsePlanID)
        console.log('response.data.planid', res.data.planid)
        this.$message({
          message: `存储个性规划方案成功`,
          type: 'success'
        })
      } else {
        this.$message({
          message: `存储个性规划方案失败`,
          type: 'warning'
        })
      }
    },

    // 确定手动规划列表
    async finishManualPlan() {
      console.log('进入了finishManualPlan函数')
      if (this.newPlanName !== '') {

        await this.savePlanName()

        this.savePlanPoint()
        this.clearManualPlan()
        this.newPlanName = ''
        this.creationMode = 'currentSimulation'
        this.showMannualPlanPopUp = false
        mapUtils.removePlanSelection(this)
      } else {
        this.$message({
          message: '请输入规划方案的名称',
          type: 'warning'
        })
      }
    },

    async beginAutoPlan() {
      //首先判断时间是否可以进行自动规划
      if (this.taskId === 0 || (this.taskId !== 0 && this.stepTimeMap[this.activeTimeIndex] === 24)) {
        this.CanAutoPlan.isTimeReady = true

        //此处检查3个长期规划所需的csv文件是否已经成功生成
        if (this.CanAutoPlan.isFileExistPointReady === true&&this.CanAutoPlan.isFilePointReady=== true&&this.CanAutoPlan.isFileCircleReady === true){
          //此时所有条件均已判断完成，开始进行长期规划

          //获取cityID
          let queryParams= {
              pageNum: 1,
              pageSize: 99,
              cityName: undefined,
          }
          let cityID=0;
          let roleList= await listRole(queryParams);
          let cityList=roleList.rows;
          for(let i=0;i<cityList.length;i++){
            if(cityList[i].cityCode===this.city){
              cityID=cityList[i].id;
              break;
            }
          }
          // console.log("cityID",cityID)
          // console.log("listCity",roleList)

          //获取taskname
          const UrlGetTaskName=serverInfo.baseURL+'/simulation/process/'+this.taskId;
          let taskData=(await axios.get(UrlGetTaskName)).data;
          // console.log("taskData",taskData)
          let taskName=""
          if(taskData==='')
          {
            taskName=""
          }
          else
          {
            taskName=taskData.name
          }
          // console.log("taskName",taskName)

          const url = ''
          const params = {
            mapName:"now",
            planId:this.nowPlanId,
            taskId:this.taskId,
            time:this.stepTimeMap[this.activeTimeIndex].toString(),
            service:this.AutoselectionMode,
            cityId:cityID,
            city:this.city,
            taskName:taskName
          }

          if(this.newAutoPlanName==="")
          {
            this.sendMessage('请输入规划名称', 'warning')
            return
          }


          //调用长期规划接口
          console.log("params",params)
          let response = await longInvoking(params)
          console.log("response",response)
          if(response.msg==="请求失败，请检查输入文件")
          {
            this.sendMessage('自动规划请求失败，请检查输入文件', 'error')
          }
          else if(response.msg==="操作成功")
          {
            let longInvokingId=response.data

            let longInvokingConfig={}
            longInvokingConfig.mapname="now"
            longInvokingConfig.city=this.city
            longInvokingConfig.planid=this.nowPlanId
            longInvokingConfig.taskid=this.taskId
            longInvokingConfig.time=this.stepTimeMap[this.activeTimeIndex].toString()
            longInvokingConfig.service=this.AutoselectionMode
            longInvokingConfig.longinvokingid=longInvokingId
            longInvokingConfig.longinvokingname=this.newAutoPlanName

            const urlAddLongTermList=serverInfo.baseURL + '/information/addLongTermList'
            console.log("JSON LongTermList", JSON.stringify(longInvokingConfig))
            axios.post(urlAddLongTermList,longInvokingConfig).then(response=>{
              if(response.data==="OK")
              {
                this.sendMessage('自动规划请求成功', 'success')
                mapUtils.getAutoPlanList(this)
              }
              else
              {
                this.sendMessage('自动规划请求失败，请检查输入文件', 'error')
              }
            })
          }

          //在地图上显示点


        } else {
          console.log("CanAutoPlan",this.CanAutoPlan)
          this.sendMessage('当前已存在的规划点数据储存到后端失败，请检查网络状态', 'error')
        }
      } else {
        this.sendMessage('当前时间不正确，请将模拟时刻调至24时刻之后再进行自动规划', 'error')
      }
    },

    //删除自动规划任务
    deleteAutoPlanTask(longInvokingId)
    {

      const url=serverInfo.baseURL + '/information/deleteLongTermList/'+longInvokingId

      axios.post(url).then(response=>{
        if(response.data==="OK")
        {
          this.sendMessage('删除自动规划任务成功', 'success')
          //重新获取自动规划任务列表
          mapUtils.getAutoPlanList(this)
        }
        else
        {
          this.sendMessage('删除自动规划任务失败', 'error')
        }
      })
    },


    //展示对应的自动规划任务
    async clickAutoPlanTask(longInvokingPlanDetail)
    {
      // console.log("longInvokingPlanDetail",longInvokingPlanDetail)
      this.showAutoPlanPoint=true

      this.newAutoPlanName=longInvokingPlanDetail.name

      const url=serverInfo.baseURL + '/information/getLongTermPointsNoConvert/'+"now"+'/'+this.city+'/'+this.nowPlanId+'/'+this.taskId+'/'+this.stepTimeMap[this.activeTimeIndex]+'/'+longInvokingPlanDetail.service

      let points=await axios.get(url)

      // console.log("points",points)

      mapUtils.buildAutomaticPlanPoint(this,points.data)

    },

    //删除对应的自动规划点
    deleteAutoPlanPoints(longInvokingPointDetail)
    {
      console.log("longInvokingPointDetail",longInvokingPointDetail)
      this.pointLayerSource.removeFeature(longInvokingPointDetail.feature)
      // this.selectionList.splice(longInvokingPointDetail, 1)
      this.selectionList = this.selectionList.filter(item => item.index !== longInvokingPointDetail.index);
    },

    //保存自动规划选址结果
    async saveAutoPlanResult() {
      this.newPlanName = this.newAutoPlanName
      await this.savePlanName()
      await this.savePlanPoint()
      // this.newPlanName=''
      this.sendMessage('自动规划方案保存完成', 'success')
      this.selectionList = []
      this.showAutoPlanPoint=false
      this.creationMode = 'currentSimulation'

    },

    // 切换传染病网格显示类型
    onInfectionShowChange() {
      let key = `${this.currentInfectionDay}_${this.currentInfectionHour}`
      let colorMap = 1
      if (this.currentInfectionShowType === 'total_num_data' || this.currentInfectionShowType === 'S_data') {
        colorMap = 2
      }

      if (key in this.infectionResultData) {
        mapUtils.updateInfectionLayer(this.currentInfectionGridSource,
          this.infectionResultData[key][this.currentInfectionShowType], colorMap)
      } else {
        requestUtils.getInfectionSimulationResult(this, this.currentInfectionDay, this.currentInfectionHour, this.currentTask.simulation_time, this.currentTask.lockType,
          () => {
            mapUtils.updateInfectionLayer(this.currentInfectionGridSource,
              this.infectionResultData[key][this.currentInfectionShowType], colorMap)
          })
      }

    },
    // 生成强化学习模拟决策
    onUpdateMADDPG() {
      requestUtils.MADDPGSimultion(this, this.currentTask.simulation_time)
    },
    // 更新传染病感染高风险区域
    updateInfectionRisk() {
      this.updateRiskDisabled = true;
      requestUtils.getInfectionRiskPoint(this, this.currentInfectionDay, this.currentInfectionHour, this.currentTask.simulation_time, this.thresholdInfected, this.currentTask.lockType, (data) => {
        this.showLayers.grid = false;
        this.showLayers.riskInfection = true;
        this.onDisplayChange();
        this.processInfectionDangerousList();
        this.updateRiskDisabled = false;
      });
    },
    // 根据拼音获取城市名
    getCityName(city) {
      if (city in mapData) {
        return mapData[city].cityName
      } else {
        return city
      }
    },
    // 获取交通压力测度结果
    async getTrafficPressure() {
      let res
      res = await ajax(`information/pressureData/shangyu/3`)
      return res
    },
    // 获取洪涝模拟结果
    async getSimulationResult(resultType, time) {
      let res
      if (time in this.currentSimulationResult[resultType]) {
        res = this.currentSimulationResult[resultType][time]
      } else {
        let len = this.infoTask.resultLens[resultType][time]
        if (len > this.resultMaxLen) len = this.resultMaxLen
        res = await ajax(`information/simulation/subresult/${this.infoTask.id}/${resultType}/${time}/0/${len}`)
        this.currentSimulationResult[resultType][time] = res
      }
      return res
    },
    // 获取洪涝风险点或风险区域
    async getRiskResult(resultType, time, reslLen) {
      let res
      if (time in this.currentSimulationResult[resultType]) {
        res = this.currentSimulationResult[resultType][time]
      } else {
        let len = reslLen
        if (len > this.resultMaxLen) len = this.resultMaxLen
        res = await ajax(`information/simulation/subresult/${this.infoTask.id}/${resultType}/${time}/0/${len}`)
        this.currentSimulationResult[resultType][time] = res
      }
      return res
    },
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

      // 交通压力测度图层
      if (this.showLayers.trafficPressure) {
        this.onMapAddLayer(this.currentTrafficPressureLayer)
      } else {
        this.map.removeLayer(this.currentTrafficPressureLayer)
      }

      // 洪涝模拟图层
      if (this.showLayers.submergedCells) {
        if (this.currentSubmergedcellsLayer) {
          this.onMapAddLayer(this.currentSubmergedcellsLayer)
        }
      } else {
        if (this.currentSubmergedcellsLayer) {
          this.map.removeLayer(this.currentSubmergedcellsLayer)
        }
      }

      if (this.showLayers.dangerousRoads) {
        if (this.currentDangerousroadsLayer) {
          this.onMapAddLayer(this.currentDangerousroadsLayer)
        }
      } else {
        if (this.currentDangerousroadsLayer) {
          this.map.removeLayer(this.currentDangerousroadsLayer)
        }
      }

      if (this.showLayers.submergedRoads) {
        if (this.currentSubmergedroadsLayer) {
          this.onMapAddLayer(this.currentSubmergedroadsLayer)
        }
      } else {
        if (this.currentSubmergedroadsLayer) {
          this.map.removeLayer(this.currentSubmergedroadsLayer)
        }
      }

      if (this.showLayers.availableRoads) {
        if (this.currentAvailableroadsLayer) {
          this.onMapAddLayer(this.currentAvailableroadsLayer)
        }
      } else {
        if (this.currentAvailableroadsLayer) {
          this.map.removeLayer(this.currentAvailableroadsLayer)
        }
      }

      // 洪涝模拟风险图层
      if (this.showLayers.riskCells) {
        if (this.riskCellsLayer) {
          this.onMapAddLayer(this.riskCellsLayer)
        }
      } else {
        if (this.riskCellsLayer) {
          this.map.removeLayer(this.riskCellsLayer)
        }
      }

      if (this.showLayers.riskPoints) {
        if (this.riskPointsLayer) {
          this.onMapAddLayer(this.riskPointsLayer)
        }
      } else {
        if (this.riskPointsLayer) {
          this.map.removeLayer(this.riskPointsLayer)
        }
      }

      if (this.showLayers.CommunicationBaseStation) {
        if (this.currentCommunicationBaseStationLayer) {
          this.onMapAddLayer(this.currentCommunicationBaseStationLayer)
        }
      } else {
        if (this.currentCommunicationBaseStationLayer) {
          this.map.removeLayer(this.currentCommunicationBaseStationLayer)
        }
      }
      // 传染病模拟图层
      if (this.showLayers.grid) {
        if (this.currentInfectionGridLayer) {
          this.onMapAddLayer(this.currentInfectionGridLayer)
        }
      } else {
        if (this.currentInfectionGridLayer) {
          this.map.removeLayer(this.currentInfectionGridLayer)
        }
      }
      // 传染病感染高风险图层
      if (this.showLayers.riskInfection) {
        if (this.currentRiskLayer) {
          this.onMapAddLayer(this.currentRiskLayer)
        }
      } else {
        if (this.currentRiskLayer) {
          this.map.removeLayer(this.currentRiskLayer)
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
    // 修改道路防灾等级
    modifyRoadLevel() {
      let info = this.popInfoRoad
      let feature = info.feature
      feature.info.newLevel = this.roadLevel
      this.roadLevelList.push({
        id: info.id,
        position: info.coord,
        originalLevel: info.originalLevel,
        newLevel: this.roadLevel,
        feature: feature
      })
      this.$refs.mapInfoPopoverRoad.showPopper = false

    },
    // 删除道路防灾等级修改
    removeRoadLevel(road) {
      road.feature.newLevel = road.feature.originalLevel
      this.roadLevelList.forEach(function(item, index, arr) {
        if (item.id == road.id) {
          arr.splice(index, 1)
        }
      })
    },
    // 修改模拟区域
    onModifyArea() {
      if (this.areaModifying) {
        if (this.modifyAreaLayer)           //删除绘制图层
        {
          this.map.removeInteraction(this.modifyAreaLayer.draw)
        }
      } else {
        if (!this.modifyAreaLayer) {
          mapUtils.addModifyArea(this)
        }//添加绘制图层和形状图层
        else {
          this.map.addInteraction(this.modifyAreaLayer.draw)
        }  //添加绘制图层
      }
      this.areaModifying = !this.areaModifying
    },
    // 取消模拟区域
    cancelModifyArea() {
      this.areaModifying = false
      this.currentArea = '未划定'
      mapUtils.removeModifyArea(this)
    },
    // 更新模拟区域计算结果
    updateArea() {

    },
    // 显示应急规划结果
    onPlanCheckChange(checked, plan) {
      if (checked) {
        if (plan.layer) {
          this.map.addLayer(plan.layer)
        } else {
          requestUtils.getPlanResult(this, plan)
        }
      } else {
        this.map.removeLayer(plan.layer)
      }
    },

    // 当右侧El-drawer里面的树状目录组件的checkbox被点击时调用的函数
    // data: 被点击的节点对应的数据对象
    // checked: 点击后 节点是否被选中
    // indeterminate: 点击的节点是否有子节点被选中
    handlePlansCheckChange(data, checked, indeterminate) {
      if (data.type) {
        if (checked) {
          if (data.layer) {
            this.map.addLayer(data.layer)
          } else {
            cityServicePerformanceAPI.getPlanView(this.city, data).then((res) => {
              mapUtils.buildPlanLayer(this, data, res)
            })
          }
        } else {
          if (data.layer) {
            this.map.removeLayer(data.layer)
          }
        }
      }
    },

    // "生成应急规划方案" 按钮的响应函数
    // city: 城市名，英文小写 this.city
    // simulationTime: 当前模拟时刻  this.stepTimeMap[this.activeTimeIndex]
    // disasterType: 灾害类型 ['flood', 'infection', 'explode'] this.type
    // requiredSchemes: 需要生成的设施列表
    // chart 需要修改的图表，设置为Loading
    async handleEmergencyPlanGenerate(city, simulationTime, disasterType, requiredSchemes, chart) {
      //后续的接口设计需要加上 simulationTime, disasterType, requiredSchemes 作为参数
      chart.showLoading()
      const schemesSnapshot = [...requiredSchemes] // "需要生成的设施列表" 的深拷贝副本
      this.emergencyPlansAtTime = await cityServicePerformanceAPI.getPlansInfo(city, simulationTime, this.setMeasureData, schemesSnapshot, this.sendMessage)
    },

    //Deprecated 当导入规划模拟方案时，计算此方案在给定灾害等级下对应的城市服务性能指数
    //data: getPlansInfo返回的 emergencyPlansAtTime 数组数据, 其中item包含了{level, time, sheme(Scheme), type, planNumber}的信息
    //city: 城市名，英文小写
    // onPlansImported(data, city){
    // }

    // 当进行手动规划时，将数据传入到后端
    // 这个函数是一个轮询器
    // async continuousGetMeasureNoSimulator(city, mapName, planId, scheme) {
    //   const res = await cityServicePerformanceAPI.getMeasureNoSimulator(city, mapName, planId, scheme)
    //   if (res.code === 1) {
    //     return Promise.resolve(res.value)
    //   }
    //   if (res.code === -1) {
    //     console.log(`获取城市服务指标${scheme}失败`)
    //     return Promise.reject()
    //   }
    //   await new Promise((resolve) => setTimeout(() => resolve(), 3600000))
    //   return this.continuousGetMeasureNoSimulator(city, mapName, planId, scheme)
    // },
    //
    // //这个函数也是一个轮询器
    // async continuousGetMeasureSimulator(city, mapName, planId, taskId, type, time, scheme) {
    //   const res = await cityServicePerformanceAPI.getMeasureSimulator(city, mapName, planId, taskId, type, time, scheme)
    //   if (res.code === 1) {
    //     return Promise.resolve(res.value)
    //   }
    //   if (res.code === -1) {
    //     console.log(`获取城市服务指标${scheme}失败`)
    //     return Promise.reject()
    //   }
    //   await new Promise((resolve) => setTimeout(() => resolve(), 3600000))
    //   return this.continuousGetMeasureSimulator(city, mapName, planId, taskId, type, time, scheme)
    // },

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
    //处理自动规划列表，使得自动规划列表可以随着地图参数的变化而变化
    handleAutoPlanList()
    {
      mapUtils.getAutoPlanList(this)
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

    //这个函数用于在开始灾害模拟之后，计算并显示右侧两张饼图的数据
    // city: this.city
    // mapName: this.bottomMap
    // planId: this.planId
    // taskId: this.taskId
    // type: this.type
    // time: this.stepTimeMap[this.activeTimeIndex]
    handleSimulationTimeChangeFor8Service(city, mapName, planId, taskId, type, time) {
      this.handleSimulationTimeChangeForEmergencyService(city, mapName, planId, taskId, type, time)
      this.handleSimulationTimeChangeForDailyService(city, mapName, planId, taskId, type, time)
      this.handleSimulationTimeChangeForResidentialArea(city, mapName, planId, taskId, type, time)
    },
    async handleSimulationTimeChangeForEmergencyService(city, mapName, planId, taskId, type, time) {
      chartUtils.updatePieChart(this.chartEmergency, this.emergencyNames, this.maxEmergencyValues, [0, 0, 0, 0], [0, 0, 0, 0], 'customed')
      this.chartEmergency.showLoading()
      let terminate = false
      let emergencyPromiseList = []
      //请求 4个应急服务 的计算
      for (let scheme of this.emergencyCodes) {
        emergencyPromiseList.push(cityServicePerformanceAPI.calculateMeasureSimulator(city, mapName, planId, taskId, type, time, scheme))
      }
      await Promise.all(emergencyPromiseList).catch(err => {

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
        this.continuousRequest(cityServicePerformanceAPI.getMeasureSimulator, city, 1, city, mapName, planId, taskId, type, time, this.emergencyCodes[index])
          .then(res => {
            this.emergencyValues[this.stepTimeMap[this.activeTimeIndex]][index] = res
            chartUtils.updatePieChart(this.chartEmergency, this.emergencyNames, this.maxEmergencyValues, this.normalEmergencyValues, this.emergencyValues[this.stepTimeMap[this.activeTimeIndex]], 'customed')
          })
          .catch(err => {
            if (err === 'switchCity') return
            console.log(`请求获取 应急服务${this.emergencyCodes[index]} 数据失败，请检查是否上传了相关的数据`)
            this.sendMessage(`请求获取 应急服务${this.emergencyCodes[index]} 数据失败，请检查是否上传了相关的数据`, 'warning')
            this.chartEmergency.hideLoading()
          })
      }
    },
    async handleSimulationTimeChangeForDailyService(city, mapName, planId, taskId, type, time) {
      chartUtils.updatePieChart(this.chartDaily, this.dailyNames, this.maxDailyValues, [0, 0, 0, 0], [0, 0, 0, 0], 'westeros')
      this.chartDaily.showLoading()
      let terminate = false
      let dailyPromiseList = []
      //请求 4个日常服务 的计算
      for (let scheme of this.dailyCodes) {
        dailyPromiseList.push(cityServicePerformanceAPI.calculateMeasureSimulator(city, mapName, planId, taskId, type, time, scheme))
      }
      await Promise.all(dailyPromiseList).catch(err => {
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
        this.continuousRequest(cityServicePerformanceAPI.getMeasureSimulator, city, 1, city, mapName, planId, taskId, type, time, this.dailyCodes[index])
          .then(res => {
            this.dailyValues[this.stepTimeMap[this.activeTimeIndex]][index] = res
            chartUtils.updatePieChart(this.chartDaily, this.dailyNames, this.maxDailyValues, this.normalDailyValues, this.dailyValues[this.stepTimeMap[this.activeTimeIndex]], 'westeros')
          })
          .catch(err => {
            if (err === 'switchCity') return
            console.log(`请求获取 日常服务${this.dailyCodes[index]} 数据失败，请检查是否上传了相关的数据`)
            this.sendMessage(`请求获取 日常服务${this.dailyCodes[index]} 数据失败，请检查是否上传了相关的数据`, 'warning')
            this.chartDaily.hideLoading()
          })
      }
    },
    async handleSimulationTimeChangeForResidentialArea(city, mapName, planId, taskId, type, time) {
      mapUtils.buildResidentialAreasAtTime(this, time)
      mapUtils.buildCommunicationBaseStationAtTime(this, time)
    },

    //这个函数用于在开始传染病模拟之后，计算并显示右侧两张饼图的数据
    // city: this.city
    // mapName: this.bottomMap
    // planId: this.planId
    // taskId: this.taskId
    // type: this.type
    // time: this.stepTimeMap[this.activeTimeIndex]
    handleInfectionSimulationTimeChangeFor8Service(city, mapName, date, time, filename) {
      if (this.currentTask.lockType === 1) {
        date = 0
        time = 0
      }
      this.handleInfectionSimulationTimeChangeForEmergencyService(city, mapName, date, time, filename)
      this.handleInfectionSimulationTimeChangeForDailyService(city, mapName, date, time, filename)
    },
    async handleInfectionSimulationTimeChangeForEmergencyService(city, mapName, date, time, filename) {
      chartUtils.updatePieChart(this.chartEmergency, this.emergencyNames, this.maxEmergencyValues, [0, 0, 0, 0], [0, 0, 0, 0], 'customed')
      this.chartEmergency.showLoading()
      let terminate = false
      let emergencyPromiseList = []
      //请求 4个应急服务 的计算
      for (let scheme of this.emergencyCodes) {
        emergencyPromiseList.push(cityServicePerformanceAPI.calculateInfectionMeasureSimulator(city, mapName, date, time, scheme, filename))
      }
      await Promise.all(emergencyPromiseList).catch(err => {

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
        this.continuousRequest(cityServicePerformanceAPI.getInfectionMeasureSimulator, city, 1, city, mapName, date, time, this.emergencyCodes[index], filename)
          .then(res => {
            this.emergencyValues[this.stepTimeMap[this.activeTimeIndex]][index] = res
            chartUtils.updatePieChart(this.chartEmergency, this.emergencyNames, this.maxEmergencyValues, this.normalEmergencyValues, this.emergencyValues[this.stepTimeMap[this.activeTimeIndex]], 'customed')
          })
          .catch(err => {
            if (err === 'switchCity') return
            console.log(`请求获取 应急服务${this.emergencyCodes[index]} 数据失败，请检查是否上传了相关的数据`)
            this.sendMessage(`请求获取 应急服务${this.emergencyCodes[index]} 数据失败，请检查是否上传了相关的数据`, 'warning')
            this.chartEmergency.hideLoading()
          })
      }
    },
    async handleInfectionSimulationTimeChangeForDailyService(city, mapName, date, time, filename) {
      chartUtils.updatePieChart(this.chartDaily, this.dailyNames, this.maxDailyValues, [0, 0, 0, 0], [0, 0, 0, 0], 'westeros')
      this.chartDaily.showLoading()
      let terminate = false
      let dailyPromiseList = []
      //请求 4个日常服务 的计算
      for (let scheme of this.dailyCodes) {
        dailyPromiseList.push(cityServicePerformanceAPI.calculateInfectionMeasureSimulator(city, mapName, date, time, scheme, filename))
      }
      await Promise.all(dailyPromiseList).catch(err => {
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
        this.continuousRequest(cityServicePerformanceAPI.getInfectionMeasureSimulator, city, 1, city, mapName, date, time, this.dailyCodes[index], filename)
          .then(res => {
            this.dailyValues[this.stepTimeMap[this.activeTimeIndex]][index] = res
            chartUtils.updatePieChart(this.chartDaily, this.dailyNames, this.maxDailyValues, this.normalDailyValues, this.dailyValues[this.stepTimeMap[this.activeTimeIndex]], 'westeros')
          })
          .catch(err => {
            if (err === 'switchCity') return
            console.log(`请求获取 日常服务${this.dailyCodes[index]} 数据失败，请检查是否上传了相关的数据`)
            this.sendMessage(`请求获取 日常服务${this.dailyCodes[index]} 数据失败，请检查是否上传了相关的数据`, 'warning')
            this.chartDaily.hideLoading()
          })
      }
    },

    // 这个函数用于在选定底图之后，进行四个洪涝严重程度的模拟, 然后对每个底图对应的规划方案，计算其平均韧性指标
    // city: this.city
    // mapName: this.bottomMap
    // magnitudeList: this.floodMagnitudes
    // planList: this.planList
    async handleFloodMagnitudesSimulationOnPlanListChanged(city, mapName, magnitudeList, planList) {
      let terminate = false
      //第一步, 构建this.serviceData中数据的结构, 让折线图显示loading状态
      let xData = {}
      for (let planId in planList) {
        xData[planList[planId]] = [0, 0, 0, 0, 0]
      }
      this.serviceData.xData = xData
      chartUtils.updateLineChart(this.chartService, this.serviceData)
      this.chartService.showLoading()

      //第二步, 根据当前的的城市和底图，运行四个不同程度的洪涝模拟
      this.isPrecipitationFileUploaded(this.dataFileList)  //检查一下有没有上传年降水文件
      this.isValidationFileUploaded(this.dataFileList) //检查一下有没有上传验证文件
      let calculateSimulationList = []
      for (let magnitude in magnitudeList) {
        let disturbance = {
          'Rainfall per hour': magnitudeList[magnitude],
          'Whether rain file is used': this.floodParam['Whether rain file is used']
        }
        // console.log('disturbance', disturbance)
        calculateSimulationList.push(cityServicePerformanceAPI.calculateMagnitude(city, mapName, disturbance, magnitude))
      }
      await Promise.all(calculateSimulationList).catch(err => {
        console.log('洪涝模拟请求计算失败，请检查网络环境')
        this.sendMessage('洪涝模拟请求计算失败，请检查网络环境', 'error')
        this.chartService.hideLoading()
        terminate = true
      })
      if (terminate) {
        return
      }

      //第三步, 检查这四个洪涝模拟有没有完成
      let simulationList = []
      for (let magnitude in magnitudeList) {
        simulationList.push(this.continuousRequest(cityServicePerformanceAPI.getMagnitude, city, 1, city, mapName, magnitude))
      }
      Promise.all(simulationList).then(successList => {
        //第四步, 对每一个规划方案，请求计算其4个模拟下的平均韧性指标（列表）
        for (let planId in planList) {
          cityServicePerformanceAPI.calculateEvenMeasure(city, mapName, planId).then(res => {
            // console.log("已发送calculateEvenMeasure请求")
            //第五步，获取计算好的列表，修改this.serviceData中对应位置的值
            this.continuousRequest(cityServicePerformanceAPI.getEvenMeasure, city, 1, city, mapName, planId)
              .then(data => {
                let column = [1, ...data]
                //对返回的列表取两位小数精度
                for (let i in column) {
                  column[i] = column[i].toFixed(2)
                }
                this.serviceData.xData[planList[planId]] = column
                //第六步，修改折线图
                chartUtils.updateLineChart(this.chartService, this.serviceData)
              })
              .catch(err => {
                if (err === 'switchCity') return
                this.sendMessage('城市服务性能变化 数据计算失败，请检查是否上传了相关的数据', 'warning')
                this.chartService.hideLoading()
              })
          })
            .catch(err => {
              this.sendMessage('城市服务性能变化 请求计算失败，请检查网络环境', 'warning')
              this.chartService.hideLoading()
            })
        }
      })
        .catch((err) => {

          console.log('洪涝模拟失败，请检查是否上传了高程、水域、路网和建筑相关文件')
          this.sendMessage('洪涝模拟失败，请检查是否上传了高程、水域、路网和建筑相关文件', 'error')
          this.chartService.hideLoading()
        })
    },

    handleMannualPlan() {
      this.nowSelectPlanPoint.scale = this.ValuePlanPointScale
      this.nowSelectPlanPoint.capacity = this.ValuePlanPointCapacity
      this.ValuePlanPointScale = 'small'
      this.ValuePlanPointCapacity = 1000
      this.$refs.mapInfoPlanPoint.showPopper = false
      this.selectionList.push(this.nowSelectPlanPoint)
      this.showMannualPlanPopUp = false
    },

    //临时编写的函数，用于展示长期规划得到的结果
    // async handleAutomaticPlan() {
    //   if (this.selectionMode === 'Hospital') {
    //     this.automaticPlanRunning = true
    //     this.sendMessage("自动规划运行中，请稍等", "info")
    //     let results = [
    //       {
    //         lon: 121.312231601866,
    //         lat: 31.2938385040454,
    //         capacity: 2077,
    //       },
    //       {
    //         lon: 121.263899844473,
    //         lat: 31.3515788333025,
    //         capacity: 4076,
    //       },
    //       {
    //         lon: 121.241228586222,
    //         lat: 31.3442267055702,
    //         capacity: 1642,
    //       },
    //       {
    //         lon: 121.306087875437,
    //         lat: 31.3144383347002,
    //         capacity: 74,
    //       },
    //       {
    //         lon: 121.220812658323,
    //         lat: 31.3398678898894,
    //         capacity: 1244,
    //       },
    //     ]
    //     for (let result of results) {
    //       let point = {}
    //       point.positionX = result.lon
    //       point.positionY = result.lat
    //       point.position = [result.lon, result.lat]
    //       point.capacity = result.capacity
    //       point.type = "Hospital"
    //       if (result.capacity < 2000) {
    //         point.scale = "small"
    //       } else if (result.capacity < 4000) {
    //         point.scale = "middle"
    //       } else {
    //         point.scale = "large"
    //       }
    //       //还差city, mapname, planid
    //       this.autoSelectionList.push(point)
    //     }
    //     setTimeout(() => {
    //       this.mapPointList = []
    //       this.selectionList = []
    //       mapUtils.buildAutomaticPlanPoint(this, this.autoSelectionList)
    //       this.sendMessage("自动规划运行完成", "success")
    //       this.automaticPlanRunning = false
    //     }, 3600000)
    //   }
    // },

    //临时编写的函数，用于将长期规划的结果保存到数据库中
    // async saveAutomaticPlan() {
    //   this.selectionList = this.autoSelectionList
    //   console.log(this.selectionList)
    //   await this.finishManualPlan()
    //   this.selectionList = []
    //   this.autoSelectionList = []
    // },


    //手动规划时使得设施规模和设施容纳量进行联动
    handleSelectScale(value) {
      console.log(value)
      if (this.selectionMode === 'Aid') {
        if (value === 'small') {
          this.ValuePlanPointCapacity = 2000
        }
        if (value === 'middle') {
          this.ValuePlanPointCapacity = 4000
        }
        if (value === 'large') {
          this.ValuePlanPointCapacity = 10000
        }
      } else if (this.selectionMode === 'Shelter') {
        if (value === 'small') {
          this.ValuePlanPointCapacity = 2000
        }
        if (value === 'middle') {
          this.ValuePlanPointCapacity = 4000
        }
        if (value === 'large') {
          this.ValuePlanPointCapacity = 20000
        }
      } else if (this.selectionMode === 'Supply') {

        if (value === 'small') {
          this.ValuePlanPointCapacity = 2000
        }
        if (value === 'middle') {
          this.ValuePlanPointCapacity = 4000
        }
        if (value === 'large') {
          this.ValuePlanPointCapacity = 20000
        }
      } else if (this.selectionMode === 'Break') {

        if (value === 'small') {
          this.ValuePlanPointCapacity = 2400
        }
        if (value === 'middle') {
          this.ValuePlanPointCapacity = 3600
        }
        if (value === 'large') {
          this.ValuePlanPointCapacity = 5000
        }
      } else if (this.selectionMode === 'Hospital') {
        if (value === 'small') {
          this.ValuePlanPointCapacity = 4000
        }
        if (value === 'middle') {
          this.ValuePlanPointCapacity = 8000
        }
        if (value === 'large') {
          this.ValuePlanPointCapacity = 16000
        }
      } else if (this.selectionMode === 'School') {

        if (value === 'small') {
          this.ValuePlanPointCapacity = 20000
        }
        if (value === 'middle') {
          this.ValuePlanPointCapacity = 20000
        }
        if (value === 'large') {
          this.ValuePlanPointCapacity = 26800
        }
      } else if (this.selectionMode === 'Work') {

        if (value === 'small') {
          this.ValuePlanPointCapacity = 2000
        }
        if (value === 'middle') {
          this.ValuePlanPointCapacity = 10000
        }
        if (value === 'large') {
          this.ValuePlanPointCapacity = 50000
        }
      } else if (this.selectionMode === 'Shopping') {

        if (value === 'small') {
          this.ValuePlanPointCapacity = 2000
        }
        if (value === 'middle') {
          this.ValuePlanPointCapacity = 10000
        }
        if (value === 'large') {
          this.ValuePlanPointCapacity = 50000
        }
      }
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

      //禁止自动规划的有关按钮
      this.disableAutoPlanButton= true
      this.disableSaveAutoPlanButton= true
    },

    //切换个性化预案之后，获取该预案当中的所有个性规划点
    handlePlanChange() {
      this.mapPointList = []
      this.selectionList = []

      const url = serverInfo.baseURL + `/measure/selectPlanPoint?planid=` + this.nowPlanId + '&city=' + this.city + '&mapname=' + this.bottomMap
      mapUtils.buildMapPlanPoint(this, url)

      //切换预案之后，重新加载对应的居民区韧性数据
      // mapUtils.buildResidentialAreasAtTime(this, this.stepTimeMap[this.activeTimeIndex])

    },

    //获取数据库当中已经存在的规划好的方案
    async getPlanList(mapName) {
      const url = serverInfo.baseURL + '/measure/selectPlan?city=' + this.city + '&mapname=' + mapName
      let tmpPlanList = {
        '0': '城市现状底图'
      }
      console.log(url)
      await axios.get(url).then(response => {
        response.data.forEach((item, index) => {
          tmpPlanList[item.planid] = item.planname
        })
        this.planList = tmpPlanList
      })
        .catch(error => {
          console.error(error)
          this.$message({
            message: '获取规划方案失败,请检查后端接口状态',
            type: 'error'
          })
        })
    },

    //删除模拟方案
    deletePlan() {
      // this.selectionList.forEach((item, index) => {
      //   const url = serverInfo.baseURL + '/measure/deletePlanPoint'
      //   const params = {
      //     id: index + 1,
      //     planid: this.nowPlanId,
      //     city: this.city,
      //     mapname: this.bottomMap
      //   }
      //   axios.post(url, null, { params }).then(response => {
      //     if (response.data === '删除成功') {
      //
      //     } else {
      //       this.$message({
      //         message: '删除个性规划点失败',
      //         type: 'error'
      //       })
      //     }
      //   })
      //     .catch(error => {
      //       console.error(error)
      //     })
      // })
      this.selectionList = []
      console.log(this.selectionList)
      const url = serverInfo.baseURL + '/measure/deletePlan?city=' + this.city + '&mapname=' + this.bottomMap + '&planid=' + this.nowPlanId
      console.log('进入了删除预案的函数')
      axios.post(url).then(response => {
        if (response.data === '删除成功') {
          // let tmpPlanList = [...this.planList]
          let tmpPlanList = JSON.parse(JSON.stringify(this.planList))
          delete tmpPlanList[this.nowPlanId]
          this.planList = tmpPlanList
          // delete this.planList[this.nowPlanId]
          this.$message({
            message: '删除预案成功',
            type: 'success'
          })
          this.nowPlanId = '0'
        } else {
          this.$message({
            message: '删除预案失败',
            type: 'error'
          })
        }
      })
        .catch(error => {
          console.error(error)
        })
      this.map.removeLayer(this.pointLayer)
    },
    // 获取初始感染点对话框子组件中的初始感染点列表
    updateInitInfectionList(data) {
      this.initInfectionList = data
    },
    // 完成初始感染点设置
    finishInitInfection() {
      this.$refs['infectionInput'].finishInitInfection()
      this.showInfectionInput = false
    },
    // 获取封锁区域对话框子组件中的封锁区域列表
    updateLockInfectionList(data) {
      this.lockInfectionList = data
    },
    updateInfectionLockDay(day) {
      this.infectionLockDay = day
    },
    // 完成封锁区域设置
    finishLockInfection() {
      this.$refs['infectionLock'].finishLockInfection()
      this.showInfectionLock = false
    },
    // 获取城市列表，包含城市代码
    getEmergencyPlanRainTaskList() {
      // 处理应急规划方案任务选项
      this.emergencyPlanRainTaskList = [];
      this.simulationTaskList.forEach((item) => {
        if (item.simulationType === "flood" && item.city === this.city) {
          let listItem = {
            value: item.id,
            label: `${this.cityName}-${item.name}-${item.id}`,
            children: [
              {
                value: 4,
                label: '4时'
              },
              {
                value: 8,
                label: '8时'
              },
              {
                value: 12,
                label: '12时'
              },
              {
                value: 16,
                label: '16时'
              },
              {
                value: 20,
                label: '20时'
              },
              {
                value: 24,
                label: '24时'
              }
            ]
          }
          this.emergencyPlanRainTaskList.push(listItem);
        }
      });
    },
    async getCityList() {
      const data = await cityList()
      this.cityList = data
    },
    getEmergencyTaskLogList() {
      const queryLogParams = {
        pageNum: 1,
        pageSize: 1000,
        cityName: ''
      }
      getTaskLogPage(queryLogParams).then(res => {
        this.emergencyTaskLogList = res.rows
      })
    },
    // 新建应急规划选址方案
    async submitEmergencyPlan() {
      if(!this.newEmergencyPlanType){
        this.$message.error("请选择应急选址类型！");
        return;
      }
      if(!this.newEmergencyPlanRainTask){
        this.$message.error("请选择模拟任务和时刻！");
        return;
      }
      console.log("submitEmergencyPlan:", this.newEmergencyPlanType, this.newEmergencyPlanRainTask)
      console.log("emergencyPlanRainTaskList:", this.emergencyPlanRainTaskList);
      let list = [];
      list.push(
        {
          name: '风险点计算',
          status: '1',
          point: '',
          line: ''
        }
      );
      this.emergencyPlanTypes.forEach((item) => {
        if (item.id === this.newEmergencyPlanType) {
          list.push({
            name: item.label,
            status: '1',
            point: '',
            line: ''
          })
        }
      })

      let form = {
        typeName: '',
        cityId: 0,
        cityName: this.cityName + '市',
        natural: ['1'],
        accident: [],
        sanitation: [],
        list,
        rain: this.newEmergencyPlanRainTask[0],
        rainTime: this.newEmergencyPlanRainTask[1],
        contagion: '',
      }
      this.emergencyPlanRainTaskList.forEach((item) => {
        if (item.value === this.newEmergencyPlanRainTask[0]) {
          form.typeName = item.label
        }
      });
      this.cityList.forEach((city) => {
        if (city.cityName === this.cityName + "市") {
          form.cityId = city.id;
        }
      });
      console.log("emergencyPlan Form:", form);
      const res = await invoking(form);
      if (res.code == 200) {
        this.$message.success('新建应急规划选址方案成功!')
        this.getEmergencyTaskLogList();
      } else {
        this.$message.error(data.msg)
      }
    },

    //测试为课题四提供的接口
    // async testAPI()
    // {
    //   console.log("进入了testAPI函数")
    //   await getNecessaryFilesForAutoPlan(this.city, 1258, 4, "Hospital")
    //   console.log("getNecessaryFilesForAutoPlan函数执行完毕")
    // }
  }
}
</script>

<style lang="scss" scoped>
// 页面主体布局
.layout-main {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
}

// 信息面板
.panel-info {
  width: 14vw;
  min-width: 230px;
  height: 100%;
  margin-right: 20px;
  padding-left: 5px;

  // 卡片
  .card {
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 5px 4px 4px 1px rgba(39, 56, 98, 0.2);
    background-color: #fff;
    transition: 0.3s;
  }

  .card:hover {
    box-shadow: 5px 4px 4px 3px rgba(39, 56, 98, 0.5);
  }

  // 标题
  .card-title {
    text-align: center;
    font-size: 16px;
    color: #000;
    font-weight: bold;
  }

  // 行
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

  // 信息面板按钮
  .controlButton {
    outline: none;
    border: none;
    background-color: #fff;
    background: none;
    width: 30px;
    height: 30px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    border: 1px solid #5177d2;
    border-radius: 100%;

    .controlIcon {
      color: #5177d2;
    }
  }

  .controlButton:hover {
    cursor: pointer;

    .controlIcon {
      color: #9097a5;
    }
  }

  .controlButton:active .controlIcon {
    color: #000;
  }

  .controlButtonDis:hover {
    cursor: default;

  }


}


// 中间面板
.panel-middle {
  width: auto;
  height: 195vh; //临时改动一下, 用于同时展示两个下侧的图表，后续可能要用 v-show/v-if 实现两个图表的切换显示
  // height: 110vh;
  font-family: "微软雅黑";
  padding-top: 5px;
  margin-left: 10px;
  margin-right: 20px;
  flex-grow: 1;
  flex-shrink: 1;

  // 时间线
  .time-step-controler {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 50px;
  }

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
    height: 55vh;
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s;
    box-shadow: 5px 4px 4px 1px rgba(39, 56, 98, 0.2);
    background-color: #eee;
  }

  .aMap:hover {
    box-shadow: 5px 4px 4px 3px rgba(39, 56, 98, 0.5);
  }

  // 图表布局
  .chart-layout-middle {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;

    // 图表容器
    .chart-container {
      width: 100%;
      height: 35vh;
      border-radius: 10px;
      transition: 0.3s;
      box-shadow: 5px 4px 4px 1px rgba(39, 56, 98, 0.2);
    }

    .chart-container:hover {
      box-shadow: 5px 4px 4px 3px rgba(39, 56, 98, 0.5);
    }

    .chart-container-infection {
      height: 45vh;
    }

    // 图表
    .chart {
      height: 100%;
      transition: 0.3s;
    }
  }

  .chart-layout-bottom {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;

    // 图表容器
    .chart-container {
      width: 100%;
      height: 35vh;
      border-radius: 10px;
      transition: 0.3s;
      box-shadow: 5px 4px 4px 1px rgba(39, 56, 98, 0.2);
    }

    .chart-container:hover {
      box-shadow: 5px 4px 4px 3px rgba(39, 56, 98, 0.5);
    }

    // 图表
    .chart {
      height: 100%;
      transition: 0.3s;
    }
  }
}
//危险位置弹出框样式
.ol-dangerousPositionPopup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 10px;
  left: -50px;
}
.ol-dangerousPositionPopup:after,
.ol-dangerousPositionPopup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-dangerousPositionPopup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-dangerousPositionPopup:before {
  border-top-color: #cccccc;
  /*border-width: 5px;*/
  left: 48px;
  margin-left: -11px;
}
.ol-dangerousPositionPopup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-dangerousPositionPopup-content {
  height: 80px;
  width: 180px;
  color:black;
}
.ol-dangerousPositionPopup-closer:after {
  content: "✖";
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
    height: 38vh;
  }

  // 图表
  .chart {
    height: 100%;
    transition: 0.3s;
  }
}

// 左侧弹窗
.showdrawer-button {
  position: absolute;
  z-index: 100;
  top: 25px;
  left: 0;

  .el-button {
    padding: 10px 5px;
    transition: 0.3s;
    animation-duration: 1s;
    animation-name: buttonScale;
    animation-iteration-count: infinite;
  }

  .el-button:hover {
    background-color: #fff;
    color: #409EFF;
  }
}

// 右侧弹窗
.showdrawer-button-right {
  left: auto;
  right: 0;
}

@keyframes buttonScale {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}

// 设置面板
.setting-panel {

  .setting-panel-title {
    text-align: center;
    font-weight: bold;
    color: #000;
    font-size: 18px;
    padding: 0;
    padding-bottom: 10px;
    margin: 0;
    border-bottom: #ddd 1px solid;
  }

  .setting-container {
    padding: 0 20px;
    margin: 0;

    // 行
    .line {
      display: flex;
      flex-direction: row;
      align-items: center;

      .label {
        font-weight: bold;
        font-size: 14px;
        color: #606266;
        margin-right: 5px;
        flex-shrink: 0;
      }

      .el-cascader {
        width: auto;
        margin-right: 10px;
      }

      .el-select {
        width: auto;
      }
    }

    .button-container {
      display: flex;
      flex-direction: row;
      width: 50%;

      .el-button {
        margin-top: 20px;
      }
    }

    .el-card {
      margin-top: 20px;

      .card-title {
        font-size: 16px;
        font-weight: bold;
        color: #555;
      }

      .line {
        margin: 5px 0;
      }

    }

    .button-row-right {
      margin-top: 10px;
      margin-right: 5px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }

  }

  .popup {
    width: 200px;
    background-color: white;
    padding: 18px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgb(177, 177, 177);

    .info {
      font-size: 14px;
      text-align: left;

      ul {
        padding-left: 0;
      }
    }
  }
}
</style>

<style lang="scss">
// 设置面板
.setting-panel {
  pointer-events: none;

  h4 {
    margin: 0;
  }

  .simu-result {
    padding: 0 8px 10px 8px;
    margin: 0;

    // 图表容器
    .chart-container {
      width: 100%;
      height: 35vh;
      border-radius: 4px;
    }

    // 图表
    .chart {
      height: 100%;
      transition: 0.3s;
    }
  }


  .el-drawer__container {
    pointer-events: none;
  }

  .el-drawer.ltr {
    pointer-events: auto;
    // opacity: 0.6;
    transition: 0.5s;
  }

  .el-drawer.ltr:hover {
    opacity: 1.0;
  }

  .el-drawer.rtl {
    pointer-events: auto;
    transition: 0.5s;
    width: 15%;
  }

  .el-tag--dark {
    border-color: white;
  }

}

// 右侧面板
.panel-right {
  .el-card {
    .el-card__header {
      padding-top: 10px;
    }

    .el-card__body {
      padding: 5px;
      overflow: visible;
    }
  }

  .custom-tree-node {
    overflow: hidden;
  }
}

// 帮助信息弹窗标题
.helpTitle {
  text-align: center;
  font-weight: bold;
  font-size: large;
  margin: 5px 0;
}

// 行
.line {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.label {
  font-weight: bold;
  font-size: 14px;
  color: #606266;
  margin-right: 5px;
  flex-shrink: 0;
}

//联防联控预案生成面板
.joint-plan {
  position: absolute;
  left: 0px;
  width: 70%;
  height: 50%;
  border-radius: 10px;
  broder-color: black;
  border: 10px;
  bottom: 5px;
}
</style>
