<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-card>
          <div slot="header">
            <span>韧性城市现状评分</span>
            <div style="position: relative; float: right; bottom: 10px;">
              <el-cascader :options="options" placeholder="城市" :show-all-levels="false" v-model="cityValue"
                @change="recordCity" style="width: 200px">
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </div>
          </div>
          <el-tabs v-model="activeName" style="position: relative; height: 460px;">
            <el-tab-pane label="雷达图" name="雷达图">
              <div id="valueRadar"
                style="
                                                                                                                                                                                                                                                                                                            height: 350px;
                                                                                                                                                                                                                                                                                                            width: 350px;
                                                                                                                                                                                                                                                                                                            position: relative;
                                                                                                                                                                                                                                                                                                            float: ;
                                                                                                                                                                                                                                                                                                          ">
              </div>
            </el-tab-pane>
            <el-tab-pane label="旭日图" name="旭日图">
              <div id="sunBurst"
                style="
                                                                                                                                                                                                                                                                                                            height: 350px;
                                                                                                                                                                                                                                                                                                            width: 350px;
                                                                                                                                                                                                                                                                                                            position: relative;
                                                                                                                                                                                                                                                                                                            float: left;
                                                                                                                                                                                                                                                                                                          ">
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card style="position: relative;background: #99ccff;top: 10px;">
          <i class="score-item">生命线系统：</i><i style="float: right" class="score-item">
            {{ this.cityScore[0] }} 分</i><br />
          <i class="score-item">重要建筑物： </i><i style="float: right" class="score-item">
            {{ this.cityScore[1] }} 分</i><br />
          <i class="score-item">连接系统：</i><i style="float: right" class="score-item">
            {{ this.cityScore[2] }} 分</i><br />
          <i class="score-item">医疗服务系统：</i><i style="float: right" class="score-item">
            {{ this.cityScore[3] }} 分</i><br />
          <i class="score-item">污染处理系统：</i><i style="float: right" class="score-item">
            {{ this.cityScore[4] }} 分</i><br />
          <i class="score-item">开放空间系统：</i><i style="float: right" class="score-item">
            {{ this.cityScore[5] }} 分</i><br />
          <i class="score-item">其他：</i><i style="float: right" class="score-item">
            {{ this.cityScore[6] }} 分</i>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card>
          <div slot="header">
            <el-row :gutter="10">
              <el-col :span="12">
                现状评分细则
                <el-tooltip class="item" effect="light" :content="valueDetails2" placement="right-start">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </el-col>
              <el-col :span="3">
                <el-button type="success" @click="outputResult()" round>导出结果</el-button>
              </el-col>
              <el-col :span="3">
                <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false" :on-change="uploadFoundData"
                  :show-file-list="false" multiple>
                  <el-button type="success" round>基础数据</el-button>
                </el-upload>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" @click="saveResult()" round>保存结果</el-button>
              </el-col>
              <el-col :span="3">
                <el-button type="warning" @click="clearScore()" round>清除评分</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-tabs v-model="activeTab" @tab-click="handleClick">
                <el-tab-pane label="现状评分" name="first" :disabled="distab0">
                  <div style="overflow-y: scroll; height: 670px" v-show="expvis0">
                    <table class="table" border="2" border-collapse="collapse" id="standardValuedTable">
                      <thead style="position: sticky; top: 0; z-index: 2; background: #6699ff;">
                        <tr>
                          <th style="width: 380px">系统</th>
                          <th style="width: 100px">编号</th>
                          <th style="width: 400px">指标</th>
                          <th style="width: 100px">指标性质</th>
                          <th style="width: 100px">管控尺度</th>
                          <th style="width: 100px">评分选项</th>
                          <th style="width: 880px">评分区</th>
                          <th style="width: 260px">现状得分</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>{{ tableData[0][0].system }}</th>
                          <th>A0</th>
                          <th v-popover:popoverA01>{{ tableData[0][0].target }}</th>
                          <th>{{ tableData[0][0].dir }}</th>
                          <th>{{ tableData[0][0].scale }}</th>
                          <th><select v-model="evaluationMethod[0]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[0] === 'manual'">
                            <el-cascader v-model="WaterSourceHuman" :options="Soptions[0][0][0]" @change="humanA0"
                              style="width: 150px"></el-cascader>
                            水源地，总供水量满足地区用量，并
                            <el-cascader v-model="WaterSurplusHuman" :options="Soptions[0][0][1]" @change="humanA0"
                              style="width: 150px"></el-cascader>
                            余量，每个水源地
                            <el-cascader v-model="OriginpipeHuman" :options="Soptions[0][0][2]" @change="humanA0"
                              style="width: 150px"></el-cascader>
                            原水管且
                            <el-cascader v-model="IsConnectedHuman" :options="Soptions[0][0][3]" @change="humanA0"
                              style="width: 150px"></el-cascader>
                            连通管。
                          </th>
                          <th v-if="evaluationMethod[0] === 'auto'">
                            <el-input v-model="WaterSource" @input="A0()" ref="ref1"
                              style="width: 150px"></el-input>个水源地，水源供应量为
                            <el-input v-model="WaterSupply" @input="A0()" ref="ref2"
                              style="width: 150px"></el-input>万立方米/天，水源需求量为
                            <el-input v-model="WaterDemand" @input="A0()" ref="ref3"
                              style="width: 150px"></el-input>万立方米/天，每个水源地
                            <el-cascader v-model="Originpipe" :options="Soptions[0][0][2]" @change="A0()" ref="ref4"
                              style="width: 150px">
                            </el-cascader>原水管且
                            <el-cascader v-model="IsConnected" :options="Soptions[0][0][3]" @change="A0()" ref="ref5"
                              style="width: 150px">
                            </el-cascader>连通管
                          </th>
                          <th v-if="evaluationMethod[0] === 'calc'">
                            不可上传
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[0][0].detail"
                            placement="right-start">
                            <th>{{ tableData[0][0].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[0][1].system }}</th>
                          <th>A1</th>
                          <th v-popover:popoverA11>{{ tableData[0][1].target }}</th>
                          <th>{{ tableData[0][1].dir }}</th>
                          <th>{{ tableData[0][1].scale }}</th>
                          <th><select v-model="evaluationMethod[1]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[1] === 'manual'">
                            <el-cascader v-model="EnergyTypes" :options="Soptions[0][1][0]" @change="humanA1()"
                              ref="ref10" style="width: 150px"></el-cascader>，总供应量满足地区要求，并
                            <el-cascader v-model="EnergySurplus" :options="Soptions[0][1][1]" @change="humanA1()"
                              ref="ref12" style="width: 150px"></el-cascader>余量。
                          </th>
                          <th v-if="evaluationMethod[1] === 'auto'">
                            有<el-input v-model="EnergyType" @input="A1()" ref="ref6"
                              style="width: 150px"></el-input>种能源种类，能源供应量为
                            <el-input v-model="EnergySupply" @input="A1()" ref="ref7"
                              style="width: 150px"></el-input>万千瓦，能源需求量为
                            <el-input v-model="EnergyDemand" @input="A1()" ref="ref8"
                              style="width: 150px"></el-input>万千瓦，区域能源设施数为
                            <el-input v-model="EnergyFacilities" @input="A1()" ref="ref9" style="width: 150px"></el-input>
                          </th>
                          <th v-if="evaluationMethod[1] === 'calc'">
                            不可上传
                          </th>

                          <el-tooltip class="item" effect="light" :content="tableData[0][1].detail"
                            placement="right-start">
                            <th>{{ tableData[0][1].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[0][2].system }}</th>
                          <th>A2</th>
                          <th v-popover:popoverA21>{{ tableData[0][2].target }}</th>
                          <th>{{ tableData[0][2].dir }}</th>
                          <th>{{ tableData[0][2].scale }}</th>
                          <th><select v-model="evaluationMethod[2]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[2] === 'manual'">
                            饮用水应急储备率为<el-cascader v-model="DrinkingWaterRate" :options="Soptions[0][2][0]"
                              @change="humanA2()" ref="ref10" style="width: 150px"></el-cascader>
                            ，食物应急储备率为<el-cascader v-model="FoodReserveRate" :options="Soptions[0][2][1]"
                              @change="humanA2()" ref="ref12" style="width: 150px"></el-cascader>
                            ，能源应急储备率为<el-cascader v-model="EnergyReserveRate" :options="Soptions[0][2][2]"
                              @change="humanA2()" ref="ref14" style="width: 150px"></el-cascader>
                            ，应急储备的饮用水、能源和食物服务人口覆盖比例为<el-cascader v-model="ServedPeopleRate" :options="Soptions[0][2][3]"
                              @change="humanA2()" ref="ref16" style="width: 150px">
                            </el-cascader>
                          </th>
                          <th v-if="evaluationMethod[2] === 'auto'">
                            饮用水应急储备总量为
                            <el-input v-model="DrinkingWaterReserve" @input="A2()" ref="ref10"
                              style="width: 150px"></el-input>万升
                            ，标准饮用水应急储备量为
                            <el-input v-model="StandardDrinkingWaterReserve" @input="A2()" ref="ref11"
                              style="width: 150px">
                            </el-input>万升
                            ，食物应急储备总量为
                            <el-input v-model="FoodReserve" @input="A2()" ref="ref12" style="width: 150px"></el-input>
                            万吨，标准食物应急储备总量为
                            <el-input v-model="StandardFoodReserve" @input="A2()" ref="ref13"
                              style="width: 150px"></el-input>
                            万吨，能源应急储备总量为
                            <el-input v-model="EnergyReserve" @input="A2()" ref="ref14" style="width: 150px"></el-input>万度
                            ，标准能源应急储备量为
                            <el-input v-model="StandardEnergy" @input="A2()" ref="ref15"
                              style="width: 150px"></el-input>万度
                            ，应急储备的饮用水、能源和食物服务人口为
                            <el-input v-model="ServedPeople" @input="A2()" ref="ref16" style="width: 150px"></el-input>万人
                            ，地区总人口为
                            <el-input v-model="CityPeople" @input="A2()" ref="ref17" style="width: 150px"></el-input>万人
                          </th>
                          <th v-if="evaluationMethod[2] === 'calc'">
                            不可上传
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[0][2].detail"
                            placement="right-start">
                            <th>{{ tableData[0][2].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[0][3].system }}</th>
                          <th>A3</th>
                          <th v-popover:popoverA31>{{ tableData[0][3].target }}</th>
                          <th>{{ tableData[0][3].dir }}</th>
                          <th>{{ tableData[0][3].scale }}</th>
                          <th><select v-model="evaluationMethod[3]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[3] === 'manual'">
                            重要生命线工程
                            <el-cascader v-model="scoreValue[0][3]" :options="Soptions[0][3][0]"
                              @change="handleChange(scoreValue[0][3])" style="width: 150px"></el-cascader>{{
                                tableData[0][3].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[3] === 'auto'">
                            重要生命线工程设施数为
                            <el-input v-model="LifelineInf" @input="A3()" ref="ref18" style="width: 150px"></el-input>
                            个，其中，重点设防数为
                            <el-input v-model="KeyNum1" @input="A3()" ref="ref19" style="width: 150px"></el-input>
                            个，特殊设防数为
                            <el-input v-model="SpecialNum1" @input="A3()" ref="ref20" style="width: 150px"></el-input>个
                          </th>
                          <th v-if="evaluationMethod[3] === 'calc'">
                            <el-button round @click="downExcelA3">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="A3_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[0][3].detail"
                            placement="right-start">
                            <th>{{ tableData[0][3].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[0][4].system }}</th>
                          <th>A4</th>
                          <th v-popover:popoverA41>{{ tableData[0][4].target }}</th>
                          <th>{{ tableData[0][4].dir }}</th>
                          <th>{{ tableData[0][4].scale }}</th>
                          <th><select v-model="evaluationMethod[4]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[4] === 'manual'">
                            {{ tableData[0][4].target }}为
                            <el-cascader v-model="scoreValue[0][4]" :options="Soptions[0][4][0]"
                              @change="handleChange(scoreValue[0][4])" style="width: 150px"></el-cascader>{{
                                tableData[0][4].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[4] === 'auto'">
                            以所有营业的菜市场（生鲜超市）为起点，步行10min可达到范围的区域面积为
                            <el-input v-model="EmgencyMarketArea" @input="A4()" ref="ref21"
                              style="width: 150px"></el-input>万公顷，
                            地区总面积为
                            <el-input v-model="CityArea" @input="A4()" ref="ref22" style="width: 150px"></el-input>万公顷
                          </th>
                          <th v-if="evaluationMethod[4] === 'calc'">
                            <el-button round @click="downExcelA4">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="A4_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[0][4].detail"
                            placement="right-start">
                            <th>{{ tableData[0][4].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[1][0].system }}</th>
                          <th>B0</th>
                          <th v-popover:popoverB01>{{ tableData[1][0].target }}</th>
                          <th>{{ tableData[1][0].dir }}</th>
                          <th>{{ tableData[1][0].scale }}</th>
                          <th><select v-model="evaluationMethod[5]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[5] === 'manual'">
                            {{ tableData[1][0].target }}为
                            <el-cascader v-model="scoreValue[1][0]" :options="Soptions[1][0][0]"
                              @change="handleChange(scoreValue[1][0])" style="width: 150px"></el-cascader>{{
                                tableData[1][0].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[5] === 'auto'">
                            位于灾害危险区的重要建筑物数量为
                            <el-input v-model="DangerousImpBuilding" @input="B0()" ref="ref23"
                              style="width: 150px"></el-input>
                            个,重要建筑物数量为
                            <el-input v-model="ImpBuilding" @input="B0()" ref="ref24" style="width: 150px"></el-input>个
                          </th>
                          <th v-if="evaluationMethod[5] === 'calc'">
                            <el-button round @click="downExcelB0">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="B0_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[1][0].detail"
                            placement="right-start">
                            <th>{{ tableData[1][0].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[1][1].system }}</th>
                          <th>B1</th>
                          <th v-popover:popoverB11>{{ tableData[1][1].target }}</th>
                          <th>{{ tableData[1][1].dir }}</th>
                          <th>{{ tableData[1][1].scale }}</th>
                          <th><select v-model="evaluationMethod[6]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[6] === 'manual'">
                            重要建筑物
                            <el-cascader v-model="scoreValue[1][1]" :options="Soptions[1][1][0]"
                              @change="handleChange(scoreValue[1][1])" style="width: 150px"></el-cascader>{{
                                tableData[1][1].change[0]
                              }}设防标准
                          </th>
                          <th v-if="evaluationMethod[6] === 'auto'">
                            地区建筑总数为
                            <el-input v-model="CityBuilding" @input="B1()" ref="ref25" style="width: 150px"></el-input>
                            个，其中，达到重点设防标准的数量为
                            <el-input v-model="ComplianceBuilding" @input="B1()" ref="ref26"
                              style="width: 150px"></el-input>
                            个，超过重点设防标准的数量为
                            <el-input v-model="ExceedingBuilding" @input="B1()" ref="ref27"
                              style="width: 150px"></el-input>个
                          </th>
                          <th v-if="evaluationMethod[6] === 'calc'">
                            <el-button round @click="downExcelB1">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="B1_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[1][1].detail"
                            placement="right-start">
                            <th>{{ tableData[1][1].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[1][2].system }}</th>
                          <th>B2</th>
                          <th v-popover:popoverB21>{{ tableData[1][2].target }}</th>
                          <th>{{ tableData[1][2].dir }}</th>
                          <th>{{ tableData[1][2].scale }}</th>
                          <th><select v-model="evaluationMethod[7]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[7] === 'manual'">
                            {{ tableData[1][2].target }}为
                            <el-cascader v-model="scoreValue[1][2]" :options="Soptions[1][2][0]"
                              @change="handleChange(scoreValue[1][2])" style="width: 150px"></el-cascader>{{
                                tableData[1][2].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[7] === 'auto'">
                            超高层建筑物数量为
                            <el-input v-model="ExtraHighBuilding" @input="B2()" ref="ref28"
                              style="width: 150px"></el-input>
                            个,地区建筑物数量为
                            <el-input v-model="CityBuilding" @input="B2()" ref="ref29" style="width: 150px"></el-input>个
                          </th>
                          <th v-if="evaluationMethod[7] === 'calc'">
                            <el-button round @click="downExcelB2">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="B2_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[1][2].detail"
                            placement="right-start">
                            <th>{{ tableData[1][2].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[1][3].system }}</th>
                          <th>B3</th>
                          <th v-popover:popoverB31>{{ tableData[1][3].target }}</th>
                          <th>{{ tableData[1][3].dir }}</th>
                          <th>{{ tableData[1][3].scale }}</th>
                          <th><select v-model="evaluationMethod[8]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[8] === 'manual'">
                            应急指挥场所，每
                            <el-cascader v-model="scoreValue[1][3]" :options="Soptions[1][3][0]"
                              @change="handleChange(scoreValue[1][3])" style="width: 150px"></el-cascader>{{
                                tableData[1][3].change[0]
                              }}人口配置1个
                          </th>
                          <th v-if="evaluationMethod[8] === 'auto'">
                            应急指挥场所数量为
                            <el-input v-model="EmergencySite" @input="B3()" ref="ref30" style="width: 150px"></el-input>
                            个,地区总人口为
                            <el-input v-model="CityPeople" @input="B3()" ref="ref31" style="width: 150px"></el-input>万人
                          </th>
                          <th v-if="evaluationMethod[8] === 'calc'">
                            <el-button round @click="downExcelB3">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="B3_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[1][3].detail"
                            placement="right-start">
                            <th>{{ tableData[1][3].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[1][4].system }}</th>
                          <th>B4</th>
                          <th v-popover:popoverB41>{{ tableData[1][4].target }}</th>
                          <th>{{ tableData[1][4].dir }}</th>
                          <th>{{ tableData[1][4].scale }}</th>
                          <th><select v-model="evaluationMethod[9]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[9] === 'manual'">
                            应急指挥场所，每
                            <el-cascader v-model="scoreValue[1][4]" :options="Soptions[1][4][0]"
                              @change="handleChange(scoreValue[1][4])" style="width: 150px"></el-cascader>{{
                                tableData[1][4].change[0]
                              }}平方米/人
                          </th>
                          <th v-if="evaluationMethod[9] === 'auto'">
                            地区应急避难场所总面积为
                            <el-input v-model="EmergencyArea" @input="B4()" ref="ref32" style="width: 150px"></el-input>
                            万公顷,地区总人口为
                            <el-input v-model="CityPeople" @input="B4()" ref="ref33" style="width: 150px"></el-input>万人
                          </th>
                          <th v-if="evaluationMethod[9] === 'calc'">
                            <el-button round @click="downExcelB4">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="B4_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[1][4].detail"
                            placement="right-start">
                            <th>{{ tableData[1][4].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[1][5].system }}</th>
                          <th>B5</th>
                          <th v-popover:popoverB51>{{ tableData[1][5].target }}</th>
                          <th>{{ tableData[1][5].dir }}</th>
                          <th>{{ tableData[1][5].scale }}</th>
                          <th><select v-model="evaluationMethod[10]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[10] === 'manual'">
                            {{ tableData[1][5].target }}为
                            <el-cascader v-model="scoreValue[1][5]" :options="Soptions[1][5][0]"
                              @change="handleChange(scoreValue[1][5])" style="width: 150px"></el-cascader>{{
                                tableData[1][5].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[10] === 'auto'">
                            以消防求援站为起点，消防车接警出动后5min可达到范围的区域面积为
                            <el-input v-model="FirefightingArea" @input="B5()" ref="ref34"
                              style="width: 150px"></el-input>
                            万公顷,地区总面积为
                            <el-input v-model="CityArea" @input="B5()" ref="ref35" style="width: 150px"></el-input>万公顷
                          </th>
                          <th v-if="evaluationMethod[10] === 'calc'">
                            <el-button round @click="downExcelB5">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="B5_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[1][5].detail"
                            placement="right-start">
                            <th>{{ tableData[1][5].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[2][0].system }}</th>
                          <th>C0</th>
                          <th v-popover:popoverC01>{{ tableData[2][0].target }}</th>
                          <th>{{ tableData[2][0].dir }}</th>
                          <th>{{ tableData[2][0].scale }}</th>
                          <th><select v-model="evaluationMethod[11]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[11] === 'manual'">
                            {{ tableData[2][0].target }}为
                            <el-cascader v-model="scoreValue[2][0]" :options="Soptions[2][0][0]"
                              @change="handleChange(scoreValue[2][0])" style="width: 150px"></el-cascader>{{
                                tableData[2][0].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[11] === 'auto'">
                            位于灾害危险区的重要交通基础设施数量为
                            <el-input v-model="DanTpInf" @input="C0()" ref="ref36" style="width: 150px"></el-input>
                            个,重要交通基础设置总数量为
                            <el-input v-model="TpInf" @input="C0()" ref="ref37" style="width: 150px"></el-input>个
                          </th>
                          <th v-if="evaluationMethod[11] === 'calc'">
                            <el-button round @click="downExcelC0">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="C0_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[2][0].detail"
                            placement="right-start">
                            <th>{{ tableData[2][0].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[2][1].system }}</th>
                          <th>C1</th>
                          <th v-popover:popoverC11>{{ tableData[2][1].target }}</th>
                          <th>{{ tableData[2][1].dir }}</th>
                          <th>{{ tableData[2][1].scale }}</th>
                          <th><select v-model="evaluationMethod[12]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[12] === 'manual'">
                            重要交通基础设施
                            <el-cascader v-model="scoreValue[2][1]" :options="Soptions[2][1][0]"
                              @change="handleChange(scoreValue[2][1])" style="width: 150px"></el-cascader>{{
                                tableData[2][1].change[0]
                              }}设防标准
                          </th>
                          <th v-if="evaluationMethod[12] === 'auto'">
                            总重要交通基础设施数量为
                            <el-input v-model="TpInf" @input="C1()" ref="ref38" style="width: 150px"></el-input>
                            个，其中，重点设防数为
                            <el-input v-model="KeyNum2" @input="C1()" ref="ref39" style="width: 150px"></el-input>
                            个，特殊设防数为
                            <el-input v-model="SpecialNum2" @input="C1()" ref="ref40" style="width: 150px"></el-input>个
                          </th>
                          <th v-if="evaluationMethod[12] === 'calc'">
                            <el-button round @click="downExcelC1">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="C1_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[2][1].detail"
                            placement="right-start">
                            <th>{{ tableData[2][1].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[2][2].system }}</th>
                          <th>C2</th>
                          <th v-popover:popoverC21>{{ tableData[2][2].target }}</th>
                          <th>{{ tableData[2][2].dir }}</th>
                          <th>{{ tableData[2][2].scale }}</th>
                          <th><select v-model="evaluationMethod[13]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[13] === 'manual'">
                            {{ tableData[2][2].target }}为
                            <el-cascader v-model="scoreValue[2][2]" :options="Soptions[2][2][0]"
                              @change="handleChange(scoreValue[2][2])" style="width: 150px"></el-cascader>{{
                                tableData[2][2].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[13] === 'auto'">
                            地区总面积为
                            <el-input v-model="CityArea" @input="C2()" ref="ref41" style="width: 150px"></el-input>
                            万公顷，以灾中可保证设施完好、功能完整的重要公共服务设施为起点，步行15min可达到范围的区域面积为
                            <el-input v-model="WalkArea" @input="C2()" ref="ref42" style="width: 150px"></el-input>万公顷
                          </th>
                          <th v-if="evaluationMethod[13] === 'calc'">
                            <el-button round @click="downExcelC2">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="C2_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[2][2].detail"
                            placement="right-start">
                            <th>{{ tableData[2][2].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[2][3].system }}</th>
                          <th>C3</th>
                          <th v-popover:popoverC31>{{ tableData[2][3].target }}</th>
                          <th>{{ tableData[2][3].dir }}</th>
                          <th>{{ tableData[2][3].scale }}</th>
                          <th><select v-model="evaluationMethod[14]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[14] === 'manual'">
                            {{ tableData[2][3].target }}为
                            <el-cascader v-model="scoreValue[2][3]" :options="Soptions[2][3][0]"
                              @change="handleChange(scoreValue[2][3])" style="width: 150px"></el-cascader>{{
                                tableData[2][3].change[0]
                              }}米/人
                          </th>
                          <th v-if="evaluationMethod[14] === 'auto'">
                            满足《城市综合防灾规划标准》条件的道路总长为
                            <el-input v-model="SD_StreetLength" @input="C3()" ref="ref43"
                              style="width: 150px"></el-input>千米，评价区域总人口为
                            <el-input v-model="CityPeople" @input="C3()" ref="ref44" style="width: 150px"></el-input>万人
                          </th>
                          <th v-if="evaluationMethod[14] === 'calc'">
                            <el-button round @click="downExcelC3">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="C3_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[2][3].detail"
                            placement="right-start">
                            <th>{{ tableData[2][3].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[3][0].system }}</th>
                          <th>D0</th>
                          <th v-popover:popoverD01>{{ tableData[3][0].target }}</th>
                          <th>{{ tableData[3][0].dir }}</th>
                          <th>{{ tableData[3][0].scale }}</th>
                          <th><select v-model="evaluationMethod[15]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[15] === 'manual'">
                            {{ tableData[3][0].target }}为
                            <el-cascader v-model="scoreValue[3][0]" :options="Soptions[3][0][0]"
                              @change="handleChange(scoreValue[3][0])" style="width: 150px"></el-cascader>{{
                                tableData[3][0].change[0]
                              }}平方千米
                          </th>
                          <th v-if="evaluationMethod[15] === 'auto'">
                            地区应急医疗设施用地面积为
                            <el-input v-model="MedicalArea" @input="D0()" ref="ref45"
                              style="width: 150px"></el-input>万公顷,地区总人口为
                            <el-input v-model="CityPeople" @input="D0()" ref="ref46" style="width: 150px"></el-input>万人
                          </th>
                          <th v-if="evaluationMethod[15] === 'calc'">
                            <el-button round @click="downExcelD0">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="D0_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[3][0].detail"
                            placement="right-start">
                            <th>{{ tableData[3][0].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[3][1].system }}</th>
                          <th>D1</th>
                          <th v-popover:popoverD11>{{ tableData[3][1].target }}</th>
                          <th>{{ tableData[3][1].dir }}</th>
                          <th>{{ tableData[3][1].scale }}</th>
                          <th><select v-model="evaluationMethod[16]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[16] === 'manual'">
                            {{ tableData[3][1].target }}为
                            <el-cascader v-model="scoreValue[3][1]" :options="Soptions[3][1][0]"
                              @change="handleChange(scoreValue[3][1])" style="width: 150px"></el-cascader>{{
                                tableData[3][1].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[16] === 'auto'">
                            以社区卫生服务设施为起点，步行15min可达到范围的区域面积为
                            <el-input v-model="WalkArea2" @input="D1()" ref="ref47"
                              style="width: 150px"></el-input>万公顷,地区总面积为
                            <el-input v-model="CityArea" @input="D1()" ref="ref48" style="width: 150px"></el-input>万公顷
                          </th>
                          <th v-if="evaluationMethod[16] === 'calc'">
                            <el-button round @click="downExcelD1">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="D1_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[3][1].detail"
                            placement="right-start">
                            <th>{{ tableData[3][1].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[3][2].system }}</th>
                          <th>D2</th>
                          <th v-popover:popoverD21>{{ tableData[3][2].target }}</th>
                          <th>{{ tableData[3][2].dir }}</th>
                          <th>{{ tableData[3][2].scale }}</th>
                          <th><select v-model="evaluationMethod[17]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[17] === 'manual'">
                            设定时速为
                            <el-cascader v-model="AmbulanceSpeedHuman" :options="Soptions[3][2][0]" @change="humanD2()"
                              ref="ref52" style="width: 150px"></el-cascader>
                            时，{{ tableData[3][2].target }}为
                            <el-cascader v-model="AmbulanceRateHuman" :options="Soptions[3][2][1]" @change="humanD2()"
                              ref="ref53" style="width: 150px"></el-cascader>
                          </th>
                          <th v-if="evaluationMethod[17] === 'auto'">
                            设定时速为
                            <el-input v-model="AmbulanceSpeed" @input="D2()" ref="ref49" style="width: 150px"></el-input>
                            时，{{ tableData[3][2].target }}为
                            <el-input v-model="AmbulanceRate" @input="D2()" ref="ref49" style="width: 150px"></el-input>
                          </th>
                          <th v-if="evaluationMethod[17] === 'calc'">
                            不可上传
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[3][2].detail"
                            placement="right-start">
                            <th>{{ tableData[3][2].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[4][0].system }}</th>
                          <th>E0</th>
                          <th v-popover:popoverE01>{{ tableData[4][0].target }}</th>
                          <th>{{ tableData[4][0].dir }}</th>
                          <th>{{ tableData[4][0].scale }}</th>
                          <th><select v-model="evaluationMethod[18]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[18] === 'manual'">
                            {{ tableData[4][0].target }}为
                            <el-cascader v-model="scoreValue[4][0]" :options="Soptions[4][0][0]"
                              @change="handleChange(scoreValue[4][0])" style="width: 150px"></el-cascader>{{
                                tableData[4][0].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[18] === 'auto'">
                            所有模块化分散式污水、固废处理厂处理规模为
                            <el-input v-model="DirtyThing" @input="E0()" ref="ref50"
                              style="width: 150px"></el-input>万吨/日，地区总污水量、固废量为
                            <el-input v-model="AreaDirtyThing" @input="E0()" ref="ref51"
                              style="width: 150px"></el-input>万吨
                          </th>
                          <th v-if="evaluationMethod[18] === 'calc'">
                            <el-button round @click="downExcelE0">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="E0_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[4][0].detail"
                            placement="right-start">
                            <th>{{ tableData[4][0].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[4][1].system }}</th>
                          <th>E1</th>
                          <th v-popover:popoverE11>{{ tableData[4][1].target }}</th>
                          <th>{{ tableData[4][1].dir }}</th>
                          <th>{{ tableData[4][1].scale }}</th>
                          <th><select v-model="evaluationMethod[19]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[19] === 'manual'">
                            排水系统覆盖率为
                            <el-cascader v-model="WaterLengthRate" :options="Soptions[4][1][0]" @change="humanE1()"
                              ref="ref52" style="width: 150px"></el-cascader>
                            雨污分流比例为
                            <el-cascader v-model="RainLengthRate" :options="Soptions[4][1][1]" @change="humanE1()"
                              ref="ref53" style="width: 150px"></el-cascader>
                          </th>
                          <th v-if="evaluationMethod[19] === 'auto'">
                            有排水管道的道路长度为
                            <el-input v-model="WaterLength" @input="E1()" ref="ref52"
                              style="width: 150px"></el-input>千米,有雨水管道的道路长度为
                            <el-input v-model="RainLength" @input="E1()" ref="ref53" style="width: 150px"></el-input>
                            千米,地区道路总长度（除高架、桥梁、高速公路、城市快速路外）为
                            <el-input v-model="StreetLength" @input="E1()" ref="ref54" style="width: 150px"></el-input>千米
                          </th>
                          <th v-if="evaluationMethod[19] === 'calc'">
                            <el-button round @click="downExcelE1">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="E1_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[4][1].detail"
                            placement="right-start">
                            <th>{{ tableData[4][1].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[5][0].system }}</th>
                          <th>F0</th>
                          <th v-popover:popoverF01>{{ tableData[5][0].target }}</th>
                          <th>{{ tableData[5][0].dir }}</th>
                          <th>{{ tableData[5][0].scale }}</th>
                          <th><select v-model="evaluationMethod[20]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[20] === 'manual'">
                            {{ tableData[5][0].target }}为
                            <el-cascader v-model="scoreValue[5][0]" :options="Soptions[5][0][0]"
                              @change="handleChange(scoreValue[5][0])" style="width: 150px"></el-cascader>{{
                                tableData[5][0].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[20] === 'auto'">
                            河、湖等水域面积为
                            <el-input v-model="WaterArea" @input="F0()" ref="ref55"
                              style="width: 150px"></el-input>万公顷，地区总面积为
                            <el-input v-model="CityArea" @input="F0()" ref="ref56" style="width: 150px"></el-input>万公顷
                          </th>
                          <th v-if="evaluationMethod[20] === 'calc'">
                            <el-button round @click="downExcelF0">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="F0_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[5][0].detail"
                            placement="right-start">
                            <th>{{ tableData[5][0].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[5][1].system }}</th>
                          <th>F1</th>
                          <th v-popover:popoverF11>{{ tableData[5][1].target }}</th>
                          <th>{{ tableData[5][1].dir }}</th>
                          <th>{{ tableData[5][1].scale }}</th>
                          <th><select v-model="evaluationMethod[21]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[21] === 'manual'">
                            {{ tableData[5][1].target }}为
                            <el-cascader v-model="scoreValue[5][1]" :options="Soptions[5][1][0]"
                              @change="handleChange(scoreValue[5][1])" style="width: 150px"></el-cascader>{{
                                tableData[5][1].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[21] === 'auto'">
                            绿地、林地、农田、山地、水域、湿地等总面积为
                            <el-input v-model="EcologyArea" @input="F1()" ref="ref57"
                              style="width: 150px"></el-input>万公顷，地区总面积为
                            <el-input v-model="CityArea" @input="F1()" ref="ref58" style="width: 150px"></el-input>万公顷
                          </th>
                          <th v-if="evaluationMethod[21] === 'calc'">
                            <el-button round @click="downExcelF1">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="F1_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[5][1].detail"
                            placement="right-start">
                            <th>{{ tableData[5][1].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[5][2].system }}</th>
                          <th>F2</th>
                          <th v-popover:popoverF21>{{ tableData[5][2].target }}</th>
                          <th>{{ tableData[5][2].dir }}</th>
                          <th>{{ tableData[5][2].scale }}</th>
                          <th><select v-model="evaluationMethod[22]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[22] === 'manual'">
                            {{ tableData[5][2].target }}为
                            <el-cascader v-model="scoreValue[5][2]" :options="Soptions[5][2][0]"
                              @change="handleChange(scoreValue[5][2])" style="width: 150px"></el-cascader>{{
                                tableData[5][2].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[22] === 'auto'">
                            绿地面积为
                            <el-input v-model="GreenArea" @input="F2()" ref="ref59"
                              style="width: 150px"></el-input>万公顷，地区总面积为
                            <el-input v-model="CityArea" @input="F2()" ref="ref60" style="width: 150px"></el-input>万公顷
                          </th>
                          <th v-if="evaluationMethod[22] === 'calc'">
                            <el-button round @click="downExcelF2">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="F2_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[5][2].detail"
                            placement="right-start">
                            <th>{{ tableData[5][2].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[5][3].system }}</th>
                          <th>F3</th>
                          <th v-popover:popoverF31>{{ tableData[5][3].target }}</th>
                          <th>{{ tableData[5][3].dir }}</th>
                          <th>{{ tableData[5][3].scale }}</th>
                          <th><select v-model="evaluationMethod[23]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[23] === 'manual'">
                            {{ tableData[5][3].target }}为
                            <el-cascader v-model="scoreValue[5][3]" :options="Soptions[5][3][0]"
                              @change="handleChange(scoreValue[5][3])" style="width: 150px"></el-cascader>{{
                                tableData[5][3].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[23] === 'auto'">
                            根据地区现状下垫面分析及海绵控规，地区总体可到达的年径流总量控制率为
                            <el-input v-model="Control" @input="F3()" ref="ref61" style="width: 150px"></el-input>
                          </th>
                          <th v-if="evaluationMethod[23] === 'calc'">
                            不可上传
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[5][3].detail"
                            placement="right-start">
                            <th>{{ tableData[5][3].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[6][0].system }}</th>
                          <th>G0</th>
                          <th v-popover:popoverG01>现状地区{{ tableData[6][0].target }}</th>
                          <th>{{ tableData[6][0].dir }}</th>
                          <th>{{ tableData[6][0].scale }}</th>
                          <th><select v-model="evaluationMethod[24]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[24] === 'manual'">
                            现状地区{{ tableData[6][0].target }}为
                            <el-cascader v-model="scoreValue[6][0]" :options="Soptions[6][0][0]"
                              @change="handleChange(scoreValue[6][0])" style="width: 150px"></el-cascader>{{
                                tableData[6][0].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[24] === 'auto'">
                            现状地区规划留白用地总面积为
                            <el-input v-model="BlankArea" @input="G0()" ref="ref62"
                              style="width: 150px"></el-input>万公顷,现状地区规划用地总面积为
                            <el-input v-model="PlanArea" @input="G0()" ref="ref63" style="width: 150px"></el-input>万公顷
                          </th>
                          <th v-if="evaluationMethod[24] === 'calc'">
                            <el-button round @click="downExcelG0">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="G0_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[6][0].detail"
                            placement="right-start">
                            <th>{{ tableData[6][0].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[6][1].system }}</th>
                          <th>G1</th>
                          <th v-popover:popoverG11>{{ tableData[6][1].target }}</th>
                          <th>{{ tableData[6][1].dir }}</th>
                          <th>{{ tableData[6][1].scale }}</th>
                          <th><select v-model="evaluationMethod[25]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[25] === 'manual'">
                            高风险区域的建设用地比例（绿地除外）为
                            <el-cascader v-model="scoreValue[6][1]" :options="Soptions[6][1][0]"
                              @change="handleChange(scoreValue[6][1])" style="width: 150px"></el-cascader>{{
                                tableData[6][1].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[25] === 'auto'">
                            不可计算
                          </th>
                          <th v-if="evaluationMethod[25] === 'calc'">
                            不可上传
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[6][1].detail"
                            placement="right-start">
                            <th>{{ tableData[6][1].val }}</th>
                          </el-tooltip>
                        </tr>
                        <tr>
                          <th>{{ tableData[6][2].system }}</th>
                          <th>G2</th>
                          <th v-popover:popoverG21>{{ tableData[6][2].target }}</th>
                          <th>{{ tableData[6][2].dir }}</th>
                          <th>{{ tableData[6][2].scale }}</th>
                          <th><select v-model="evaluationMethod[26]">
                              <option value="auto">自动评分</option>
                              <option value="manual">手动评分</option>
                              <option value="calc">自动计算</option>
                            </select></th>
                          <th v-if="evaluationMethod[26] === 'manual'">
                            {{ tableData[6][2].target }}为
                            <el-cascader v-model="scoreValue[6][2]" :options="Soptions[6][2][0]"
                              @change="handleChange(scoreValue[6][2])" style="width: 150px"></el-cascader>{{
                                tableData[6][2].change[0]
                              }}
                          </th>
                          <th v-if="evaluationMethod[26] === 'auto'">
                            绘制风险地图并在显著位置展示的社区数量为
                            <el-input v-model="RiskComNum" @input="G2()" ref="ref64"
                              style="width: 150px"></el-input>个,地区所有社区数量为
                            <el-input v-model="CommunityNum" @input="G2()" ref="ref65" style="width: 150px"></el-input>个
                          </th>
                          <th v-if="evaluationMethod[26] === 'calc'">
                            <el-button round @click="downExcelG2">下载模版</el-button>
                            <el-upload ref="upload" action="" accept=".xlsx, .xls" :auto-upload="false"
                              :on-change="G2_load" :show-file-list="false"
                              style="margin-left:10px;display: inline-block;">
                              <el-button type="primary" round>上传excel</el-button>
                            </el-upload>
                          </th>
                          <el-tooltip class="item" effect="light" :content="tableData[6][2].detail"
                            placement="right-start">
                            <th>{{ tableData[6][2].val }}</th>
                          </el-tooltip>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-popover ref="popoverA01" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《可持续发展城市和社区-韧性城市指标体系》ISO37123-2019 拟定，从水源地模块化布置情况和连通程度两个角度评价水源地现有建设情况是否达到规划要求。">
    </el-popover>
    <el-popover ref="popoverA02" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《可持续发展城市和社区-韧性城市指标体系》ISO37123-2019 拟定，从水源地模块化布置情况和连通程度两个角度评价水源地现有建设情况是否达到规划要求。">
    </el-popover>
    <el-popover ref="popoverA03" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《可持续发展城市和社区-韧性城市指标体系》ISO37123-2019 拟定，从水源地模块化布置情况和连通程度两个角度评价水源地现有建设情况是否达到规划要求。">
    </el-popover>
    <el-popover ref="popoverA11" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《可持续发展城市和社区-韧性城市指标体系》ISO37123-2019 拟定，采取分级评价的方法评价能源设施现有建设情况是否达到规划要求。模块化是指设施服务功能具有一定独立性，可避免关联失效，但在某一个组件或者多个组件失效的时候又可相互代替，有效避免安全故障。部分地区若无该指标，可使用设置有冗余备用设施的能源设施的比例，或防灾预案中灾中可保障的能源供应水平与常态能源供应水平的比例。">
    </el-popover>
    <el-popover ref="popoverA12" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《可持续发展城市和社区-韧性城市指标体系》ISO37123-2019 拟定，采取分级评价的方法评价能源设施现有建设情况是否达到规划要求。模块化是指设施服务功能具有一定独立性，可避免关联失效，但在某一个组件或者多个组件失效的时候又可相互代替，有效避免安全故障。部分地区若无该指标，可使用设置有冗余备用设施的能源设施的比例，或防灾预案中灾中可保障的能源供应水平与常态能源供应水平的比例。">
    </el-popover>
    <el-popover ref="popoverA13" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《可持续发展城市和社区-韧性城市指标体系》ISO37123-2019 拟定，采取分级评价的方法评价能源设施现有建设情况是否达到规划要求。模块化是指设施服务功能具有一定独立性，可避免关联失效，但在某一个组件或者多个组件失效的时候又可相互代替，有效避免安全故障。部分地区若无该指标，可使用设置有冗余备用设施的能源设施的比例，或防灾预案中灾中可保障的能源供应水平与常态能源供应水平的比例。">
    </el-popover>
    <el-popover ref="popoverA21" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《可持续发展城市和社区-韧性城市指标体系》ISO37123-2019、《防灾避难场所设计规范》GB51143-2015、《城市综合防灾规划标准》GB 51327-2018 等标准拟定，评价现有饮用水、能源和食物储备情况是否达到规划要求。供水、能源、食物储备量达到相关规划要求，且覆盖全部人口得 0 分;供水、能源、食物储备量达到相关规划要求 1.1 倍且覆盖全部人口得 1 分，供水、能源、食物储备量达到相关规划要求 1.2 倍且覆盖全部人口得 1 分;供水、能源、食物储备量为相关规划要求 0.95 倍，或未能覆盖全部人口得-1 分，供水、能源、食物储备量为相关规划要求 0.90 倍，或未能覆盖全部人口得-2 分。">
    </el-popover>
    <el-popover ref="popoverA22" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《可持续发展城市和社区-韧性城市指标体系》ISO37123-2019、《防灾避难场所设计规范》GB51143-2015、《城市综合防灾规划标准》GB 51327-2018 等标准拟定，评价现有饮用水、能源和食物储备情况是否达到规划要求。供水、能源、食物储备量达到相关规划要求，且覆盖全部人口得 0 分;供水、能源、食物储备量达到相关规划要求 1.1 倍且覆盖全部人口得 1 分，供水、能源、食物储备量达到相关规划要求 1.2 倍且覆盖全部人口得 1 分;供水、能源、食物储备量为相关规划要求 0.95 倍，或未能覆盖全部人口得-1 分，供水、能源、食物储备量为相关规划要求 0.90 倍，或未能覆盖全部人口得-2 分。">
    </el-popover>
    <el-popover ref="popoverA23" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《可持续发展城市和社区-韧性城市指标体系》ISO37123-2019、《防灾避难场所设计规范》GB51143-2015、《城市综合防灾规划标准》GB 51327-2018 等标准拟定，评价现有饮用水、能源和食物储备情况是否达到规划要求。供水、能源、食物储备量达到相关规划要求，且覆盖全部人口得 0 分;供水、能源、食物储备量达到相关规划要求 1.1 倍且覆盖全部人口得 1 分，供水、能源、食物储备量达到相关规划要求 1.2 倍且覆盖全部人口得 1 分;供水、能源、食物储备量为相关规划要求 0.95 倍，或未能覆盖全部人口得-1 分，供水、能源、食物储备量为相关规划要求 0.90 倍，或未能覆盖全部人口得-2 分。">
    </el-popover>
    <el-popover ref="popoverA31" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《城镇防灾减灾指南》DB31/T 906-2021 拟定，以抗震设防标准为参照，评价重要生命线工程设施的设防标准是否达到规划要求。地区重要生命线工程设施全部按重点设防类建设得0分，5% 按特殊设防类建设得 1 分，10% 按特殊设防类得 2 分;2% 未达到重点设防类得 -1 分，5% 未达到重点设防类得-2 分。">
    </el-popover>
    <el-popover ref="popoverA32" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《城镇防灾减灾指南》DB31/T 906-2021 拟定，以抗震设防标准为参照，评价重要生命线工程设施的设防标准是否达到规划要求。地区重要生命线工程设施全部按重点设防类建设得0分，5% 按特殊设防类建设得 1 分，10% 按特殊设防类得 2 分;2% 未达到重点设防类得 -1 分，5% 未达到重点设防类得-2 分。">
    </el-popover>
    <el-popover ref="popoverA33" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《城镇防灾减灾指南》DB31/T 906-2021 拟定，以抗震设防标准为参照，评价重要生命线工程设施的设防标准是否达到规划要求。地区重要生命线工程设施全部按重点设防类建设得0分，5% 按特殊设防类建设得 1 分，10% 按特殊设防类得 2 分;2% 未达到重点设防类得 -1 分，5% 未达到重点设防类得-2 分。">
    </el-popover>
    <el-popover ref="popoverA41" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，用于评价菜市场(生鲜超市)现有建设情况是否达到规划要求。">
    </el-popover>
    <el-popover ref="popoverA42" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，用于评价菜市场(生鲜超市)现有建设情况是否达到规划要求。">
    </el-popover>
    <el-popover ref="popoverA43" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，用于评价菜市场(生鲜超市)现有建设情况是否达到规划要求。">
    </el-popover>
    <el-popover ref="popoverB01" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价位于灾害危险区的重要建筑物占所有重要建筑物的比例。">
    </el-popover>
    <el-popover ref="popoverB02" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价位于灾害危险区的重要建筑物占所有重要建筑物的比例。">
    </el-popover>
    <el-popover ref="popoverB03" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价位于灾害危险区的重要建筑物占所有重要建筑物的比例。">
    </el-popover>
    <el-popover ref="popoverB11" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价重要建筑物防灾设施不同标准所占的比例。">
    </el-popover>
    <el-popover ref="popoverB12" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价重要建筑物防灾设施不同标准所占的比例。">
    </el-popover>
    <el-popover ref="popoverB13" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价重要建筑物防灾设施不同标准所占的比例。">
    </el-popover>
    <el-popover ref="popoverB21" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018、国家标准《防洪标准》GB 50201 拟定，评价位于规划区域的超高层建筑占地区所有建筑物的比例。">
    </el-popover>
    <el-popover ref="popoverB22" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018、国家标准《防洪标准》GB 50201 拟定，评价位于规划区域的超高层建筑占地区所有建筑物的比例。">
    </el-popover>
    <el-popover ref="popoverB23" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018、国家标准《防洪标准》GB 50201 拟定，评价位于规划区域的超高层建筑占地区所有建筑物的比例。">
    </el-popover>
    <el-popover ref="popoverB31" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价灾害危险区进行应急指挥的综合抗灾能力。">
    </el-popover>
    <el-popover ref="popoverB32" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价灾害危险区进行应急指挥的综合抗灾能力。">
    </el-popover>
    <el-popover ref="popoverB33" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价灾害危险区进行应急指挥的综合抗灾能力。">
    </el-popover>
    <el-popover ref="popoverB41" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标引自《国土空间规划城市体检评估规程（试行）》，评价应急避难场所中人均面积大小。">
    </el-popover>
    <el-popover ref="popoverB42" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标引自《国土空间规划城市体检评估规程（试行）》，评价应急避难场所中人均面积大小。">
    </el-popover>
    <el-popover ref="popoverB43" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标引自《国土空间规划城市体检评估规程（试行）》，评价应急避难场所中人均面积大小。">
    </el-popover>
    <el-popover ref="popoverB51" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市消防站建设标准》建标 152-2017 拟定，评价灾害危险区的消防救援建设水平及 5 分钟可达覆盖率。">
    </el-popover>
    <el-popover ref="popoverB52" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市消防站建设标准》建标 152-2017 拟定，评价灾害危险区的消防救援建设水平及 5 分钟可达覆盖率。">
    </el-popover>
    <el-popover ref="popoverB53" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市消防站建设标准》建标 152-2017 拟定，评价灾害危险区的消防救援建设水平及 5 分钟可达覆盖率。">
    </el-popover>
    <el-popover ref="popoverC01" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价位于灾害危险区的重要交通基础设施占所有的重要交通基础设施数量的比例。">
    </el-popover>
    <el-popover ref="popoverC02" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价位于灾害危险区的重要交通基础设施占所有的重要交通基础设施数量的比例。">
    </el-popover>
    <el-popover ref="popoverC03" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，评价位于灾害危险区的重要交通基础设施占所有的重要交通基础设施数量的比例。">
    </el-popover>
    <el-popover ref="popoverC11" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，重要交通基础设施不同设防标准所占的比例。">
    </el-popover>
    <el-popover ref="popoverC12" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，重要交通基础设施不同设防标准所占的比例。">
    </el-popover>
    <el-popover ref="popoverC13" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="本指标参考《城市综合防灾规划标准》GB 51327-2018 拟定，重要交通基础设施不同设防标准所占的比例。">
    </el-popover>
    <el-popover ref="popoverC21" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标评价重要公共服务设施设置数量、位置是否达到规划要求。具体体现为重要公共服务设施灾中设施及使用功能保存完整程度、重要公共服务设施步行 15min 覆盖率。重要公共服务设施设置数量、位置超过规划要求得 1 分，重要公共服务设施设置数量、位置达到规划要求得 0 分，重要公共服务设施设置数量、位置未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverC22" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标评价重要公共服务设施设置数量、位置是否达到规划要求。具体体现为重要公共服务设施灾中设施及使用功能保存完整程度、重要公共服务设施步行 15min 覆盖率。重要公共服务设施设置数量、位置超过规划要求得 1 分，重要公共服务设施设置数量、位置达到规划要求得 0 分，重要公共服务设施设置数量、位置未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverC23" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标评价重要公共服务设施设置数量、位置是否达到规划要求。具体体现为重要公共服务设施灾中设施及使用功能保存完整程度、重要公共服务设施步行 15min 覆盖率。重要公共服务设施设置数量、位置超过规划要求得 1 分，重要公共服务设施设置数量、位置达到规划要求得 0 分，重要公共服务设施设置数量、位置未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverC31" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标评价城市建设用地中满足《城市综合防灾规划标准》(GB/T51327-2018)6.2.3 要求的人均应急疏散通道长度是否满足规划要求;以道路密度和人口密度进行折算、建设用人口密度按 10000 人/km2 计算。
                                                                                                    现状人均应急疏散道路长度超过规划要求得 1 分，现状人均应急疏散道路长度达到规划要求得 0 分，现状人均应急疏散道路长度未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverC32" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标评价城市建设用地中满足《城市综合防灾规划标准》(GB/T51327-2018)6.2.3 要求的人均应急疏散通道长度是否满足规划要求;以道路密度和人口密度进行折算、建设用人口密度按 10000 人/km2 计算。
                                                                                                    现状人均应急疏散道路长度超过规划要求得 1 分，现状人均应急疏散道路长度达到规划要求得 0 分，现状人均应急疏散道路长度未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverC33" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标评价城市建设用地中满足《城市综合防灾规划标准》(GB/T51327-2018)6.2.3 要求的人均应急疏散通道长度是否满足规划要求;以道路密度和人口密度进行折算、建设用人口密度按 10000 人/km2 计算。
                                                                                                      现状人均应急疏散道路长度超过规划要求得 1 分，现状人均应急疏散道路长度达到规划要求得 0 分，现状人均应急疏散道路长度未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverD01" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参照《城市综合防灾规划标准》(GB/T51327-2018)及《城市公共设施规划规范》(GB50442-2008)医疗卫生设施相关要求拟定，应急医疗服务设施指配置防灾设施，可用于突发灾害应对重伤病人员医疗救护的医院，包括应急保障医院、市区级临时应急医疗场所。评价应急医疗设施用地面积是否充足。
                                                                                                  现状人均应急医疗设施用地面积超过规划要求得 1 分，现状人均应急医疗设施用地面积达到规划要求得 0 分，现状人均应急医疗设施用地面积未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverD02" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参照《城市综合防灾规划标准》(GB/T51327-2018)及《城市公共设施规划规范》(GB50442-2008)医疗卫生设施相关要求拟定，应急医疗服务设施指配置防灾设施，可用于突发灾害应对重伤病人员医疗救护的医院，包括应急保障医院、市区级临时应急医疗场所。评价应急医疗设施用地面积是否充足。
                                                                                                    现状人均应急医疗设施用地面积超过规划要求得 1 分，现状人均应急医疗设施用地面积达到规划要求得 0 分，现状人均应急医疗设施用地面积未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverD03" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参照《城市综合防灾规划标准》(GB/T51327-2018)及《城市公共设施规划规范》(GB50442-2008)医疗卫生设施相关要求拟定，应急医疗服务设施指配置防灾设施，可用于突发灾害应对重伤病人员医疗救护的医院，包括应急保障医院、市区级临时应急医疗场所。评价应急医疗设施用地面积是否充足。
                                                                                                    现状人均应急医疗设施用地面积超过规划要求得 1 分，现状人均应急医疗设施用地面积达到规划要求得 0 分，现状人均应急医疗设施用地面积未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverD11" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，评价现状社区卫生服务设施对社区的覆盖情况。">
    </el-popover>
    <el-popover ref="popoverD12" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，评价现状社区卫生服务设施对社区的覆盖情况。">
    </el-popover>
    <el-popover ref="popoverD13" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，评价现状社区卫生服务设施对社区的覆盖情况。">
    </el-popover>
    <el-popover ref="popoverD21" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="反应时间，指接到患者呼救信息至急救力量到达现场所需要的时间，为国际上用以衡量急救系统质量的重要指标，按照国际化惯例，市区的反应时间不超过 8 分钟，郊区的反应时间不超过 15~30 分钟。
                                                                                                该指标评价现状医疗救护设施对地区急救需求的覆盖程度，以地区内任意医疗急救中心救护车至地区交通最不利点(高峰时段)所需要时间衡量。
                                                                                                现状医疗救护设施设置数量、位置超过规划要求得 1 分，现状医疗救护设施设置数量、位置达到规划要求得 0 分，现状医疗救护设施设置数量、位置未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverD22" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="反应时间，指接到患者呼救信息至急救力量到达现场所需要的时间，为国际上用以衡量急救系统质量的重要指标，按照国际化惯例，市区的反应时间不超过 8 分钟，郊区的反应时间不超过 15~30 分钟。
                                                                                                  该指标评价现状医疗救护设施对地区急救需求的覆盖程度，以地区内任意医疗急救中心救护车至地区交通最不利点(高峰时段)所需要时间衡量。
                                                                                                  现状医疗救护设施设置数量、位置超过规划要求得 1 分，现状医疗救护设施设置数量、位置达到规划要求得 0 分，现状医疗救护设施设置数量、位置未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverD23" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="反应时间，指接到患者呼救信息至急救力量到达现场所需要的时间，为国际上用以衡量急救系统质量的重要指标，按照国际化惯例，市区的反应时间不超过 8 分钟，郊区的反应时间不超过 15~30 分钟。
                                                                                                  该指标评价现状医疗救护设施对地区急救需求的覆盖程度，以地区内任意医疗急救中心救护车至地区交通最不利点(高峰时段)所需要时间衡量。
                                                                                                  现状医疗救护设施设置数量、位置超过规划要求得 1 分，现状医疗救护设施设置数量、位置达到规划要求得 0 分，现状医疗救护设施设置数量、位置未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverE01" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参照《可持续发展城市和社区-韧性城市指标体系》(ISO37123-2019)拟定，计算分散式布置的污水、固废物处理厂站处理规模总和占地区污水、固废总处理量的比例。
                                                                                                现状污水、废弃物处理厂站设置数量、位置超过规划要求得 1 分，现状污水、废弃物处理厂站设置数量、位置达到规划要求得 0 分，现状污水、废弃物处理厂站设置数量、位置未达到规划要求得-1 分。模块化是指设施服务功能具有一定独立性，可避免关联失效，但在某一个组件或者多个组件失效的时候又可相互代替，有效避免安全故障。部分地区若无该指标，可使用设置有冗余备用设施的污水、废弃物处理厂的比例，或防灾预案中灾中可保障的污水、废弃物处理规模与常态污水、废弃物处理规模的比例。">
    </el-popover>
    <el-popover ref="popoverE02" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参照《可持续发展城市和社区-韧性城市指标体系》(ISO37123-2019)拟定，计算分散式布置的污水、固废物处理厂站处理规模总和占地区污水、固废总处理量的比例。
                                                                                                  现状污水、废弃物处理厂站设置数量、位置超过规划要求得 1 分，现状污水、废弃物处理厂站设置数量、位置达到规划要求得 0 分，现状污水、废弃物处理厂站设置数量、位置未达到规划要求得-1 分。模块化是指设施服务功能具有一定独立性，可避免关联失效，但在某一个组件或者多个组件失效的时候又可相互代替，有效避免安全故障。部分地区若无该指标，可使用设置有冗余备用设施的污水、废弃物处理厂的比例，或防灾预案中灾中可保障的污水、废弃物处理规模与常态污水、废弃物处理规模的比例。">
    </el-popover>
    <el-popover ref="popoverE03" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参照《可持续发展城市和社区-韧性城市指标体系》(ISO37123-2019)拟定，计算分散式布置的污水、固废物处理厂站处理规模总和占地区污水、固废总处理量的比例。
                                                                                                  现状污水、废弃物处理厂站设置数量、位置超过规划要求得 1 分，现状污水、废弃物处理厂站设置数量、位置达到规划要求得 0 分，现状污水、废弃物处理厂站设置数量、位置未达到规划要求得-1 分。模块化是指设施服务功能具有一定独立性，可避免关联失效，但在某一个组件或者多个组件失效的时候又可相互代替，有效避免安全故障。部分地区若无该指标，可使用设置有冗余备用设施的污水、废弃物处理厂的比例，或防灾预案中灾中可保障的污水、废弃物处理规模与常态污水、废弃物处理规模的比例。">
    </el-popover>
    <el-popover ref="popoverE11" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标评价排水系统覆盖率及雨季溢流污染控制比例。
                                                                                              现状排水系统覆盖率及雨污分流比例超过规划要求得 1 分，现状排水系统覆盖率及雨污分流比例达到规划要求得 0 分，现状排水系统覆盖率及雨污分流比例未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverE12" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标评价排水系统覆盖率及雨季溢流污染控制比例。
                                                                                                现状排水系统覆盖率及雨污分流比例超过规划要求得 1 分，现状排水系统覆盖率及雨污分流比例达到规划要求得 0 分，现状排水系统覆盖率及雨污分流比例未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverE13" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标评价排水系统覆盖率及雨季溢流污染控制比例。
                                                                                                现状排水系统覆盖率及雨污分流比例超过规划要求得 1 分，现状排水系统覆盖率及雨污分流比例达到规划要求得 0 分，现状排水系统覆盖率及雨污分流比例未达到规划要求得-1 分。">
    </el-popover>
    <el-popover ref="popoverF01" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，河湖水面率=河、湖等水域面积/地区总面积。该指标用于评价区域现状河湖水面率是否达到规划要求。">
    </el-popover>
    <el-popover ref="popoverF02" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，河湖水面率=河、湖等水域面积/地区总面积。该指标用于评价区域现状河湖水面率是否达到规划要求。">
    </el-popover>
    <el-popover ref="popoverF03" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，河湖水面率=河、湖等水域面积/地区总面积。该指标用于评价区域现状河湖水面率是否达到规划要求。">
    </el-popover>
    <el-popover ref="popoverF11" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参照《城市水系规划规范》GB50513-2009(2016 年版)条文说明 5.5 表 4，生态空间面积占比=绿地、林地、农田、山地、水域、湿地等总面积/地区总面积。该指标用于评价区域现状生态空间面积是否达到规划要求。根据《全国主体功能区规划》第四章战略目标，全国绿色生态空间比例保持在 40% 以上。">
    </el-popover>
    <el-popover ref="popoverF12" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参照《城市水系规划规范》GB50513-2009(2016 年版)条文说明 5.5 表 4，生态空间面积占比=绿地、林地、农田、山地、水域、湿地等总面积/地区总面积。该指标用于评价区域现状生态空间面积是否达到规划要求。根据《全国主体功能区规划》第四章战略目标，全国绿色生态空间比例保持在 40% 以上。">
    </el-popover>
    <el-popover ref="popoverF13" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参照《城市水系规划规范》GB50513-2009(2016 年版)条文说明 5.5 表 4，生态空间面积占比=绿地、林地、农田、山地、水域、湿地等总面积/地区总面积。该指标用于评价区域现状生态空间面积是否达到规划要求。根据《全国主体功能区规划》第四章战略目标，全国绿色生态空间比例保持在 40% 以上。">
    </el-popover>
    <el-popover ref="popoverF21" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《城市绿地防灾避险设计导则》拟定，计算满足《城市绿地防灾避险设计导则》的避险绿地占城市总绿地面积的比例，用于评价现状避险绿地面积是否达到规划要求。其中，低于城市防洪标准规定的洪水淹没线以下的城市绿地、坡度大于 15%的区域、面积超过绿地总面积 60%的城市绿地，以及开敞空间小于 600 平方米的城市绿地不应作为城市防灾避险功能绿地。">
    </el-popover>
    <el-popover ref="popoverF22" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《城市绿地防灾避险设计导则》拟定，计算满足《城市绿地防灾避险设计导则》的避险绿地占城市总绿地面积的比例，用于评价现状避险绿地面积是否达到规划要求。其中，低于城市防洪标准规定的洪水淹没线以下的城市绿地、坡度大于 15%的区域、面积超过绿地总面积 60%的城市绿地，以及开敞空间小于 600 平方米的城市绿地不应作为城市防灾避险功能绿地。">
    </el-popover>
    <el-popover ref="popoverF23" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标参考《城市绿地防灾避险设计导则》拟定，计算满足《城市绿地防灾避险设计导则》的避险绿地占城市总绿地面积的比例，用于评价现状避险绿地面积是否达到规划要求。其中，低于城市防洪标准规定的洪水淹没线以下的城市绿地、坡度大于 15%的区域、面积超过绿地总面积 60%的城市绿地，以及开敞空间小于 600 平方米的城市绿地不应作为城市防灾避险功能绿地。">
    </el-popover>
    <el-popover ref="popoverF31" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，根据《海绵城市建设技术指南》年径流总量控制率要求，用于评价现状地区达到的径流总量控制率是否达到规划要求。根据地区现状下垫面分析及海绵控规，地区总体可到达的年径流总量控制率，越接近 85%越好。">
    </el-popover>
    <el-popover ref="popoverF32" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，根据《海绵城市建设技术指南》年径流总量控制率要求，用于评价现状地区达到的径流总量控制率是否达到规划要求。根据地区现状下垫面分析及海绵控规，地区总体可到达的年径流总量控制率，越接近 85%越好。">
    </el-popover>
    <el-popover ref="popoverF33" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="该指标引自《国土空间规划城市体检评估规程(试行)》，根据《海绵城市建设技术指南》年径流总量控制率要求，用于评价现状地区达到的径流总量控制率是否达到规划要求。根据地区现状下垫面分析及海绵控规，地区总体可到达的年径流总量控制率，越接近 85%越好。">
    </el-popover>
    <el-popover ref="popoverG01" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="根据《国土空间调查、规划、用途管制用地用海分类指南》，评价现状地区规划留白用地比例。规划留白用地比例=规划留白用地总面积/规划用地总面积。规划留白区域上限为 5%，留白比例 5%得 2 分，留白比例不足得分依次降低。">
    </el-popover>
    <el-popover ref="popoverG02" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="根据《国土空间调查、规划、用途管制用地用海分类指南》，评价现状地区规划留白用地比例。规划留白用地比例=规划留白用地总面积/规划用地总面积。规划留白区域上限为 5%，留白比例 5%得 2 分，留白比例不足得分依次降低。">
    </el-popover>
    <el-popover ref="popoverG03" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="根据《国土空间调查、规划、用途管制用地用海分类指南》，评价现状地区规划留白用地比例。规划留白用地比例=规划留白用地总面积/规划用地总面积。规划留白区域上限为 5%，留白比例 5%得 2 分，留白比例不足得分依次降低。">
    </el-popover>
    <el-popover ref="popoverG11" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="参考《城市防洪规划规范》GB 51079-2016和《城市综合防灾规划标准》（GB/T51327-2018）附录A 表A，评价位于用地防灾适宜性评估分类为不适宜，或国土空间开发适宜性评价为城镇建设不适宜区内的建设用地规模（绿地除外）。">
    </el-popover>
    <el-popover ref="popoverG12" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="参考《城市防洪规划规范》GB 51079-2016和《城市综合防灾规划标准》（GB/T51327-2018）附录A 表A，评价位于用地防灾适宜性评估分类为不适宜，或国土空间开发适宜性评价为城镇建设不适宜区内的建设用地规模（绿地除外）。">
    </el-popover>
    <el-popover ref="popoverG13" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="参考《城市防洪规划规范》GB 51079-2016和《城市综合防灾规划标准》（GB/T51327-2018）附录A 表A，评价位于用地防灾适宜性评估分类为不适宜，或国土空间开发适宜性评价为城镇建设不适宜区内的建设用地规模（绿地除外）。">
    </el-popover>
    <el-popover ref="popoverG21" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="参考《城镇防灾减灾指南》DB31/T 906-2021，用于评价绘制风险地区的社区占总社区数量比例是否达到规划要求。绘制风险地图的社区比例=绘制风险地图并在显著位置展示的社区数量/地区所有社区数量。">
    </el-popover>
    <el-popover ref="popoverG22" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="参考《城镇防灾减灾指南》DB31/T 906-2021，用于评价绘制风险地区的社区占总社区数量比例是否达到规划要求。绘制风险地图的社区比例=绘制风险地图并在显著位置展示的社区数量/地区所有社区数量。">
    </el-popover>
    <el-popover ref="popoverG23" placement="top-start" title="指标说明" width="400" trigger="hover"
      content="参考《城镇防灾减灾指南》DB31/T 906-2021，用于评价绘制风险地区的社区占总社区数量比例是否达到规划要求。绘制风险地图的社区比例=绘制风险地图并在显著位置展示的社区数量/地区所有社区数量。">
    </el-popover>
  </div>
</template>

<script>
import xlsx from "xlsx";
import { Radar, Sunburst } from "@antv/g2plot";
import ajax1 from "./ajax1"
import FileSaver from "file-saver";

import {
  targetData,
  options,
  Soptions,
  Coptions,
  Poptions,
  moniData,
} from "./CityScoreData.js";
export default {
  name: "currentValue",
  data() {
    return {
      expvis0: true,
      expvis1: true,
      expvis2: true,
      vis0: false,
      vis1: false,
      vis2: false,
      activeTab: 'first',
      distab0: false,
      distab1: false,
      distab2: false,
      percent: 40, // 进度条
      cityValue: [], // 记录城市
      cityfoundData: [], // 基础数据文件 
      scoreValue: [[], [], [], [], [], [], []], // 留空记录下拉框的序号
      city: "",
      valueDetails2: "现状评分：每项1~5分，最后记各系统总分,分数越高，城市韧性越强。鼠标悬浮得分列可查看具体评分标准。",
      tableData: targetData,
      options: options,
      Soptions: Soptions,
      Coptions: Coptions,
      Poptions: Poptions,
      moniData: moniData,
      radarPlot: Object,
      sunBurst: Object,
      radarAxis: 10,
      cityScore: [0, 0, 0, 0, 0, 0, 0], // 各系统总分
      detailScore: [[], [], [], [], [], [], []], // 指标得分
      activeName: "雷达图",
      evaluationMethod: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto',],

      // 指标变量
      // A0
      WaterSource: "",
      WaterSupply: "",
      WaterDemand: "",
      Originpipe: "",
      IsConnected: "",
      WaterSourceHuman: "",
      WaterSurplusHuman: "",
      OriginpipeHuman: "",
      IsConnectedHuman: "",
      // A1
      EnergyType: "",
      EnergySupply: "",
      EnergyDemand: "",
      EnergyFacilities: "",
      EnergyTypes: "",
      EnergySurplus: "",
      // A2
      DrinkingWaterReserve: "",
      StandardDrinkingWaterReserve: "",
      FoodReserve: "",
      StandardFoodReserve: "",
      EnergyReserve: "",
      StandardEnergy: "",
      ServedPeople: "",
      CityPeople: "",
      DrinkingWaterRate: "",
      FoodReserveRate: "",
      EnergyReserveRate: "",
      ServedPeopleRate: "",
      // CityPeople: "",
      // A3
      LifelineInf: "",
      KeyNum1: "",
      SpecialNum1: "",
      // auto
      character_A3: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        defence: {
          text: "defence",
          type: "string",
        },
      },
      // A4
      EmgencyMarketArea: "",
      CityArea: "",
      // CityArea: "",
      character_A4: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        OpenInDanger: {
          text: "OpenInDanger",
          type: "string",
        },
        area: {
          text: "area",
          type: "number", // 单位：万公顷
        }
      },
      // B0
      DangerousImpBuilding: "",
      ImpBuilding: "",
      character_B0: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        IsImportant: {
          text: "IsImportant",
          type: "string",
        },
        InDanger: {
          text: "InDanger",
          type: "string",
        }
      },
      // B1
      ComplianceBuilding: "",
      ExceedingBuilding: "",
      CityBuilding: "",
      // auto
      character_B1: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        defence: {
          text: "defence",
          type: "string",
        },
      },
      // B2
      ExtraHighBuilding: "",
      // auto
      character_B2: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        height: {
          text: "height",
          type: "number", // 单位：米
        },
      },
      // CityBuilding: 0,
      // B3
      EmergencySite: "",
      // CityPeople: 0,
      character_B3: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
      },
      // B4
      EmergencyArea: "",
      // CityPeople: 0,
      character_B4: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        area: {
          text: "area",
          type: "number", // 单位：万公顷
        }
      },
      // B5
      FirefightingArea: "",
      // CityArea: 0,
      character_B5: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
      },
      // C0
      DanTpInf: "",
      TpInf: "",
      // auto
      allhazardpoint: "",
      // 字段对应表
      character_C0: {
        location: {
          text: "location",
          type: "string",
        }
      },
      // C1
      // TpInf: 0,
      KeyNum2: "",
      SpecialNum2: "",
      character_C1: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        defence: {
          text: "defence",
          type: "string",
        },
      },
      // C2
      // CityArea: 0,
      WalkArea: "",
      character_C2: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
      },
      // C3
      SD_StreetLength: "",
      // CityPeople: "",
      character_C3: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        S_defence: {
          text: "S_defence", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        length: {
          text: "length", // 单位：千米
          type: "number",
        },
      },
      // D0
      MedicalArea: "",
      // CityPeople: 0,
      character_D0: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        area: {
          text: "area",
          type: "number", // 单位：万公顷
        }
      },
      // D1
      WalkArea2: "",
      character_D1: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
      },
      // D2
      AmbulanceRate: "",
      AmbulanceRateHuman: "",
      AmbulanceSpeed: "",
      AmbulanceSpeedHuman: "",
      // E0
      DirtyThing: "",
      AreaDirtyThing: 340965.2,
      character_E0: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        disposed: {
          text: "disposed",
          type: "number",
        },
      },
      // E1
      RainLength: "",
      WaterLength: "",
      RainLengthRate: "",
      WaterLengthRate: "",
      StreetLength: "",
      character_E1: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        length: {
          text: "length",
          type: "number",
        },
        RainLength: {
          text: "RainLength",
          type: "number",
        },
        WaterLength: {
          text: "WaterLength",
          type: "number",
        },
      },
      // F0
      WaterArea: "",
      // auto
      character_F0: {
        warea: {
          text: "warea", // excel中的标题
          type: "number", // 类型，后面会转换
        },
        aarea: {
          text: "aarea",
          type: "number",
        },
      },
      // F1
      EcologyArea: "",
      // auto
      character_F1: {
        narea: {
          text: "narea", // excel中的标题
          type: "number", // 类型，后面会转换
        },
        aarea: {
          text: "aarea",
          type: "number",
        },
      },
      // F2
      GreenArea: "",
      // auto
      character_F2: {
        garea: {
          text: "garea", // excel中的标题
          type: "number", // 类型，后面会转换
        },
        aarea: {
          text: "aarea",
          type: "number",
        },
      },
      // F3
      Control: "",
      // G0
      BlankArea: "",
      PlanArea: "",
      character_G0: {
        barea: {
          text: "barea", // excel中的标题
          type: "number", // 类型，后面会转换
        },
        parea: {
          text: "parea",
          type: "number",
        },
      },
      // G1
      DisScore: "",
      // G2
      RiskComNum: "",
      CommunityNum: "",
      character_G2: {
        name: {
          text: "name", // excel中的标题
          type: "string", // 类型，后面会转换
        },
        PaintDangerMap: {
          text: "PaintDangerMap",
          type: "string",
        },
      },
    };
  },
  props: {
    people: {
      type: Number,
      default: () => { return 0 },
    },
    area: {
      type: Number,
      default: () => { return 0 },
    },
    dirtything: {
      type: Number,
      default: () => { return 0 },
    },
    selectedCity: {
      type: Array,
      default: () => { return [] },
    },
    cityfoundDataFiles: {
      type: Array,
      default: () => { return [] },
    }
  },
  components: {},

  mounted() {
    // 获取表格元素
    var tables = this.$el.getElementsByClassName('table');


    // 监听表格输入事件
    for (var i = 0; i < tables.length; i++) {
      tables[i].addEventListener('input', function () {
        // 禁用所有表格
        for (var j = 0; j < tables.length; j++) {
          tables[j].disabled = true;
        }

        // 启用当前表格
        this.disabled = false;
      });
    }
    //////////////////////////////////////////////////////
    this.cityValue = this.selectedCity;
    this.cityfoundData = this.cityfoundDataFiles;
    this.CityPeople = this.people;
    this.CityArea = this.area;
    this.AreaDirtyThing = this.dirtything;
    this.resetValue();

    this.radarAxis = 10;

    this.radarInit();
    this.sunBurstInit();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 表格第一列合并
    /*  let DOMf1 = document.getElementById("frameTable1").tBodies[0].rows
        let DOMf2 = document.getElementById("frameTable2").tBodies[0].rows
        let DOMf3 = document.getElementById("frameTable3").tBodies[0].rows
        let DOM1 = document.getElementById("standardValuedTable1").tBodies[0].rows
        let DOM2 = document.getElementById("standardValuedTable2").tBodies[0].rows
        let DOM3 = document.getElementById("standardValuedTable3").tBodies[0].rows
        let spanArr = [{
          //合并第二列
          index: 0,
          rows: 0,     //0为第一列
        },];
        this.COMSpanArr1(DOMf1, spanArr, 0);
        this.COMSpanArr2(DOMf2, spanArr, 0);
        this.COMSpanArr2(DOMf3, spanArr, 0);
        this.COMSpanArr2(DOM1, spanArr, 0);
        this.COMSpanArr2(DOM2, spanArr, 0);
        this.COMSpanArr2(DOM3, spanArr, 0); */

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    for (var i = 0; i < 7; i++) {
      for (var data of this.tableData[i]) {
        this.scoreValue[i].push("");
      }
    }

    if (this.cityValue.length > 0) {
      console.log("record");
      this.recordCity();
    }
  },

  methods: {
    downExcelA3() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/A3.xlsx' // 文件路径
      a.download = 'A3.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelA4() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/A4.xlsx' // 文件路径
      a.download = 'A4.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelB0() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/B0.xlsx' // 文件路径
      a.download = 'B0.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelB1() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/B0.xlsx' // 文件路径
      a.download = 'B0.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelB1() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/B1.xlsx' // 文件路径
      a.download = 'B1.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelB2() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/B2.xlsx' // 文件路径
      a.download = 'B2.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelB3() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/B3.xlsx' // 文件路径
      a.download = 'B3.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelB4() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/B4.xlsx' // 文件路径
      a.download = 'B4.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelB5() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/B5.xlsx' // 文件路径
      a.download = 'B5.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelC0() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/C0.xlsx' // 文件路径
      a.download = 'C0.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelC1() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/C1.xlsx' // 文件路径
      a.download = 'C1.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelC2() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/C2.xlsx' // 文件路径
      a.download = 'C2.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelC3() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/C3.xlsx' // 文件路径
      a.download = 'C3.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelD0() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/D0.xlsx' // 文件路径
      a.download = 'D0.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelD1() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/D1.xlsx' // 文件路径
      a.download = 'D1.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelE0() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/E0.xlsx' // 文件路径
      a.download = 'E0.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelE1() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/E1.xlsx' // 文件路径
      a.download = 'E1.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelF0() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/F0.xlsx' // 文件路径
      a.download = 'F0.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelF1() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/F1.xlsx' // 文件路径
      a.download = 'F1.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelF2() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/F2.xlsx' // 文件路径
      a.download = 'F2.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelG0() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/G0.xlsx' // 文件路径
      a.download = 'G0.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    downExcelG2() {
      let a = document.createElement('a') // 创建a标签
      a.href = '/static/G2.xlsx' // 文件路径
      a.download = 'G2.xlsx' // 文件名称
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a)
      // 定时器(可选)
      setTimeout(() => {
        a.click() // 模拟点击(要加)
        document.removeChild(a) //删除元素(要加)
        setTimeout(() => {
          self.URL.revokeObjectURL(a.href) // 用来释放文件路径(可选)
        }, 200)
      }, 66)
    },
    handleClick(tab) {
      console.log("tabIndex", tab.index);
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'warning'
        });
      }
      else {

        this.distab1 = true;
        this.distab2 = true;
        this.expvis0 = false;
        this.vis0 = true;

      }
    },
    resetValue: function () {
      console.log("reset");
      // To do 浅复制问题笨解决
      for (var i = 0; i < 7; i++) {
        for (var d of this.tableData[i]) {
          d.val = 0;
        }
      }
    },

    uploadFoundData(file) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'warning'
        });
      } else {
        if (file.name.split(".")[1] != "xlsx") {
          this.$message({
            message: '请上传xlsx格式文件',
            type: 'warning'
          });
          return;
        }
        let flag = false;
        let files = [];
        for (let i = 0; i < this.cityfoundData.length; i++) {
          let form = this.cityfoundData[i];
          if (form.name.slice(0, 6) === file.name.slice(0, 6)) {
            this.cityfoundData.splice(i, 1);
            flag = true;
          }
        }
        console.log(file);
        files.push(file);
        this.cityfoundData.push(file);
        this.loadFoundationData(files);
      }
    },

    async recordCity() {
      this.resetValue();
      this.city = this.cityValue[1];
      if (this.city === "dongying") {
        this.tableData[0][4].target = "商业用地覆盖率";
        this.evaluationMethod[4] = "manual";
      }
      else {
        this.tableData[0][4].target = "菜市场（生鲜超市）可步行10分钟覆盖率";
        this.evaluationMethod[4] = "auto";
      }
      const cityData = await ajax1(`/evalution/getCityToughnessEvaluation/${this.city}`);
      if (cityData["data"] !== null) {
        console.log("not null")
        this.clearScore();
        this.inputCurrentValue(cityData);
        this.loadFoundationData(this.cityfoundData);
      }
      else {
        this.clearScore();
        this.loadFoundationData(this.cityfoundData);
      }
    },

    clearScore: function () {
      this.resetValue();
      this.rePrint();
    },

    inputCurrentValue: function (cityData) {
      let k = 0;
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < this.tableData[i].length; j++) {
          this.tableData[i][j].val = cityData["data"][k].val;
          k = k + 1;
        }
      };
      this.rePrint();
    },

    loadFoundationData(foundData) {
      console.log("loadFoundationData");
      for (let i = 0; i < foundData.length; i++) {
        let data = foundData[i];
        switch (data.name) {
          case "A3.xlsx":
            this.A3_load(data);
            break;
          case "A4.xlsx":
            this.A4_load(data);
            break;
          case "B0.xlsx":
            this.B0_load(data);
            break;
          case "B1.xlsx":
            this.B1_load(data);
            break;
          case "B2.xlsx":
            this.B2_load(data);
            break;
          case "B3.xlsx":
            this.B3_load(data);
            break;
          case "B4.xlsx":
            this.B4_load(data);
            break;
          case "B5.xlsx":
            this.B5_load(data);
            break;
          case "C0.xlsx":
            this.C0_load(data);
            break;
          case "C1.xlsx":
            this.C1_load(data);
            break;
          case "C2.xlsx":
            this.C2_load(data);
            break;
          case "C3.xlsx":
            this.C3_load(data);
            break;
          case "D0.xlsx":
            this.D0_load(data);
            break;
          case "D1.xlsx":
            this.D1_load(data);
            break;
          case "E0.xlsx":
            this.E0_load(data);
            break;
          case "E1.xlsx":
            this.E1_load(data);
            break;
          case "F0.xlsx":
            this.F0_load(data);
            break;
          case "F1.xlsx":
            this.F1_load(data);
            break;
          case "F2.xlsx":
            this.F2_load(data);
            break;
          case "G0.xlsx":
            this.G0_load(data);
            break;
          case "G2.xlsx":
            this.G2_load(data);
            break;
          case "A3.xls":
            this.A3_load(data);
            break;
          case "A4.xls":
            this.A4_load(data);
            break;
          case "B0.xls":
            this.B0_load(data);
            break;
          case "B1.xls":
            this.B1_load(data);
            break;
          case "B2.xls":
            this.B2_load(data);
            break;
          case "B3.xls":
            this.B3_load(data);
            break;
          case "B4.xls":
            this.B4_load(data);
            break;
          case "B5.xls":
            this.B5_load(data);
            break;
          case "C0.xls":
            this.C0_load(data);
            break;
          case "C1.xls":
            this.C1_load(data);
            break;
          case "C2.xls":
            this.C2_load(data);
            break;
          case "C3.xls":
            this.C3_load(data);
            break;
          case "D0.xls":
            this.D0_load(data);
            break;
          case "D1.xls":
            this.D1_load(data);
            break;
          case "E0.xls":
            this.E0_load(data);
            break;
          case "E1.xls":
            this.E1_load(data);
            break;
          case "F0.xls":
            this.F0_load(data);
            break;
          case "F1.xls":
            this.F1_load(data);
            break;
          case "F2.xls":
            this.F2_load(data);
            break;
          case "G0.xls":
            this.G0_load(data);
            break;
          case "G2.xls":
            this.G2_load(data);
            break;
        }
      }
      this.$message({
        message: '自动计算完成',
        type: 'success'
      });
    },

    assert_len() {
      const cityData = this.record_data();
      let flag = 0;
      for (let t = 0; t < cityData.length; t++) {
        if (cityData[t].val == 0) {
          flag++;
        }
      }
      return flag;
    },

    record_data() {
      const cityData = [];
      let k = 1;
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < this.tableData[i].length; j++) {
          cityData.push({
            "id": k,
            "target": this.tableData[i][j].target,
            "system": this.tableData[i][j].system,
            "focus": this.tableData[i][j].focus,
            "val": this.tableData[i][j].val,
            "pp": this.tableData[i][j].pp,
            "dir": this.tableData[i][j].dir,
            "scale": this.tableData[i][j].scale,
            "level": this.tableData[i][j].level,
            "detail": this.tableData[i][j].detail,
            "city": this.city,
          });
          k = k + 1;
        }
      };
      return cityData;
    },

    // 保存结果到数据库
    async saveResult() {
      const cityData = this.record_data();
      let flag = this.assert_len;
      if (flag > 0) {
        this.$message({
          message: '还有指标未评分',
          type: 'warning'
        });
      }
      else {
        const result = await ajax1("/evalution/saveCityToughnessEvaluation", cityData, "POST");
        if (result["success"]) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        }
      }
      return flag;
    },

    // 导出结果
    outputResult() {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        // 设置当前日期
        let time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let name = year + "" + month + "" + day + this.city;
        // console.log(name)
        /* generate workbook object from table */
        //  .table要导出的是哪一个表格
        var wb = xlsx.utils.table_to_book(
          document.getElementById("standardValuedTable")
        );
        this.$message({
          message: '导出成功',
          type: 'success'
        })
        /* get binary string as output */
        var wbout = xlsx.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            name + ".xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      }
    },

    handleChange: function (value) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        var arr = value[0].split("-");
        this.tableData[Number(arr[0] - 1)][Number(arr[1] - 1)].val = Number(arr[2]);
        /*         this.tableData[Number(arr[0] - 1)][Number(arr[1] - 1)].change[arr[2] - 1] =
                  Soptions[arr[0] - 1][arr[1] - 1][arr[2] - 1][Number(arr[2]) - 1].label; */
        this.rePrint();
      }
    },

    rePrint: function () {
      this.cityScore = [0, 0, 0, 0, 0, 0, 0];
      for (var i = 0; i < 7; i++) {
        for (var data of this.tableData[i]) {
          this.cityScore[i] += data.val;
        }
      }
      this.radarAxis =
        (Math.floor(Math.max(...this.cityScore) / 10) + 1) * 10;
      this.radarPlot.destroy();
      this.sunBurst.destroy();
      this.radarInit();
      this.sunBurstInit();
    },

    radarInit: function () {
      const data = [
        { system: "生命线系统", score: this.cityScore[0] },
        { system: "重要建筑物", score: this.cityScore[1] },
        { system: "连接系统", score: this.cityScore[2] },
        { system: "医疗服务系统", score: this.cityScore[3] },
        { system: "污染处理系统", score: this.cityScore[4] },
        { system: "开放空间系统", score: this.cityScore[5] },
        { system: "其他", score: this.cityScore[6] },
      ];

      this.radarPlot = new Radar("valueRadar", {
        data,
        autoFit: false,
        xField: "system",
        yField: "score",
        meta: {
          score: {
            alias: "分数",
          },
        },
        yAxis: {
          min: 0,
          max: this.radarAxis,
        },
        point: {},
      });
      this.radarPlot.render();
    },

    sunBurstInit: function () {
      const data = {
        name: "城市评分",
        children: [
          {
            name: "生命线系统",
            children: [],
          },
          { name: "重要建筑物", children: [] },
          { name: "连接系统", children: [] },
          { name: "医疗服务系统", children: [] },
          { name: "污染处理系统", children: [] },
          { name: "开放空间系统", children: [] },
          { name: "其他", children: [] },
        ],
      };

      for (var i = 0; i < 7; i++) {
        for (var d of this.tableData[i]) {
          data.children[i].children.push({
            name: d.target,
            value: d.val,
          });
        }
      }

      this.sunBurst = new Sunburst("sunBurst", {
        data,
        innerRadius: 0.3,
        interactions: [{ type: "element-active" }],
        label: {
          layout: [{ type: "limit-in-shape" }],
        },
      });
      this.sunBurst.render();
    },
    // 校验输入框输入是否为正值数字
    checkInput() {
      const validateNumber = (value) => {
        if (value === "") return true;
        if (!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value)) {
          this.$message.error("请输入正值数字");
          return false;
        }
        else
          return true;
      }
      if (!validateNumber(this.WaterSource)) {
        this.WaterSource = "";
        return false;
      }
      if (!validateNumber(this.WaterSupply)) {
        this.WaterSupply = "";
        return false;
      }
      if (!validateNumber(this.WaterDemand)) {
        this.WaterDemand = "";
        return false;
      }
      if (!validateNumber(this.EnergyType)) {
        this.EnergyType = "";
        return false;
      }
      if (!validateNumber(this.EnergyDemand)) {
        this.EnergyDemand = "";
        return false;
      }
      if (!validateNumber(this.EnergyFacilities)) {
        this.EnergyFacilities = "";
        return false;
      }
      if (!validateNumber(this.DrinkingWaterReserve)) {
        this.DrinkingWaterReserve = "";
        return false;
      }
      if (!validateNumber(this.StandardDrinkingWaterReserve)) {
        this.StandardDrinkingWaterReserve = "";
        return false;
      }
      if (!validateNumber(this.FoodReserve)) {
        this.FoodReserve = "";
        return false;
      }
      if (!validateNumber(this.StandardFoodReserve)) {
        this.StandardFoodReserve = "";
        return false;
      }
      if (!validateNumber(this.EnergyReserve)) {
        this.EnergyReserve = "";
        return false;
      }
      if (!validateNumber(this.StandardEnergy)) {
        this.StandardEnergy = "";
        return false;
      }
      if (!validateNumber(this.ServedPeople)) {
        this.ServedPeople = "";
        return false;
      }
      if (!validateNumber(this.CityPeople)) {
        this.CityPeople = "";
        return false;
      }
      if (!validateNumber(this.LifelineInf)) {
        this.LifelineInf = "";
        return false;
      }
      if (!validateNumber(this.KeyNum1)) {
        this.KeyNum1 = "";
        return false;
      }
      if (!validateNumber(this.SpecialNum1)) {
        this.SpecialNum1 = "";
        return false;
      }
      if (!validateNumber(this.EmgencyMarketArea)) {
        this.EmgencyMarketArea = "";
        return false;
      }
      if (!validateNumber(this.CityArea)) {
        this.CityArea = "";
        return false;
      }
      if (!validateNumber(this.DangerousImpBuilding)) {
        this.DangerousImpBuilding = "";
        return false;
      }
      if (!validateNumber(this.ImpBuilding)) {
        this.ImpBuilding = "";
        return false;
      }
      if (!validateNumber(this.CityBuilding)) {
        this.CityBuilding = "";
        return false;
      }
      if (!validateNumber(this.ComplianceBuilding)) {
        this.ComplianceBuilding = "";
        return false;
      }
      if (!validateNumber(this.ExceedingBuilding)) {
        this.ExceedingBuilding = "";
        return false;
      }
      if (!validateNumber(this.ExtraHighBuilding)) {
        this.ExtraHighBuilding = "";
        return false;
      }
      if (!validateNumber(this.EmergencySite)) {
        this.EmergencySite = "";
        return false;
      }
      if (!validateNumber(this.EmergencyArea)) {
        this.EmergencyArea = "";
        return false;
      }
      if (!validateNumber(this.FirefightingArea)) {
        this.FirefightingArea = "";
        return false;
      }
      if (!validateNumber(this.DanTpInf)) {
        this.DanTpInf = "";
        return false;
      }
      if (!validateNumber(this.TpInf)) {
        this.TpInf = "";
        return false;
      }
      if (!validateNumber(this.KeyNum2)) {
        this.KeyNum2 = "";
        return false;
      }
      if (!validateNumber(this.SpecialNum2)) {
        this.SpecialNum2 = "";
        return false;
      }
      if (!validateNumber(this.WalkArea)) {
        this.WalkArea = "";
        return false;
      }
      if (!validateNumber(this.SD_StreetLength)) {
        this.SD_StreetLength = "";
        return false;
      }
      if (!validateNumber(this.MedicalArea)) {
        this.MedicalArea = "";
        return false;
      }
      if (!validateNumber(this.WalkArea2)) {
        this.WalkArea2 = "";
        return false;
      }
      if (!validateNumber(this.AmbulanceSpeed)) {
        this.AmbulanceSpeed = "";
        return false;
      }
      if (!validateNumber(this.AmbulanceRate)) {
        this.AmbulanceRate = "";
        return false;
      }
      if (!validateNumber(this.DirtyThing)) {
        this.DirtyThing = "";
        return false;
      }
      if (!validateNumber(this.AreaDirtyThing)) {
        this.AreaDirtyThing = "";
        return false;
      }
      if (!validateNumber(this.WaterLength)) {
        this.WaterLength = "";
        return false;
      }
      if (!validateNumber(this.RainLength)) {
        this.RainLength = "";
        return false;
      }
      if (!validateNumber(this.StreetLength)) {
        this.StreetLength = "";
        return false;
      }
      if (!validateNumber(this.EcologyArea)) {
        this.EcologyArea = "";
        return false;
      }
      if (!validateNumber(this.GreenArea)) {
        this.GreenArea = "";
        return false;
      }
      if (!validateNumber(this.Control)) {
        this.Control = "";
        return false;
      }
      if (!validateNumber(this.BlankArea)) {
        this.BlankArea = "";
        return false;
      }
      if (!validateNumber(this.PlanArea)) {
        this.PlanArea = "";
        return false;
      }
      if (!validateNumber(this.RiskComNum)) {
        this.RiskComNum = "";
        return false;
      }
      if (!validateNumber(this.CommunityNum)) {
        this.CommunityNum = "";
        return false;
      }
      if (!validateNumber(this.EnergySupply)) {
        this.EnergySupply = "";
        return false;
      }
      if (!validateNumber(this.WaterArea)) {
        this.WaterArea = "";
        return false;
      }

      return true;
    },
    A0: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (
        this.WaterSupply !== "" &&
        this.WaterDemand !== "" &&
        this.WaterSource !== ""
      ) {
        var ee = 0;
        var arr1 = this.Originpipe[0].split("-");
        var arr2 = this.IsConnected[0].split("-");
        var wl =
          (Number(this.WaterSupply) - Number(this.WaterDemand)) /
          Number(this.WaterDemand);
        if (wl >= 0.1 && wl < 0.2) {
          // 余量占两分
          ee = ee + 1;
        } else if (wl >= 0.2) {
          ee = ee + 2;
        }
        if (this.WaterSource >= 2) {
          // 水源地占一分
          ee = ee + 1;
        }
        var pipe = Number(arr1[2]) / 2; // 取值为0，1，一分
        var conn = Number(arr2[2]) / 2; // 取值为0，1，一分
        ee = ee + pipe + conn;
        this.tableData[0][0].val = ee;
        this.rePrint();
      }

    },

    humanA0: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else if (
        this.WaterSourceHuman !== "" &&
        this.WaterSurplusHuman !== "" &&
        this.OriginpipeHuman !== "" &&
        this.IsConnectedHuman !== ""
      ) {
        var ee = 0;
        var arr1 = this.WaterSourceHuman[0].split("-");
        var arr2 = this.WaterSurplusHuman[0].split("-");
        var arr3 = this.OriginpipeHuman[0].split("-");
        var arr4 = this.IsConnectedHuman[0].split("-");

        // 水源地占一分
        if (Number(arr1[2]) >= 2)
          ee = ee + 1;
        // 余量占两分
        if (Number(arr2[2]) === 2)
          ee = ee + 1;
        else if (Number(arr2[2]) === 3)
          ee = ee + 2;

        var pipe = Number(arr3[2]) / 2; // 取值为0，1，一分
        var conn = Number(arr4[2]) / 2; // 取值为0，1，一分
        ee = ee + pipe + conn;

        this.tableData[0][0].val = ee;
        this.rePrint();
      }
    },

    A1: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (
        this.EnergyType !== "" &&
        this.EnergySupply !== "" &&
        this.EnergyDemand !== "" &&
        this.EnergyFacilities
      ) {
        var ee = 0;
        var dd =
          (Number(this.EnergySupply) - Number(this.EnergyDemand)) /
          Number(this.EnergyDemand);
        if (dd > 0.1 && dd <= 0.2) {
          ee = ee + 1;
        } else if (dd > 0.2) {
          ee = ee + 2;
        }
        if (Number(this.EnergyType) >= 2) {
          ee = ee + 1;
        }
        if (Number(this.EnergyFacilities) / 1 === 1) {
          ee = ee + 1;
        } else if (Number(this.EnergyFacilities) >= 2) {
          ee = ee + 2;
        }
        this.tableData[0][1].val = ee;
        this.rePrint();
      }
    },

    humanA1: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else if (
        this.EnergyTypes !== "" &&
        this.EnergySurplus !== ""
      ) {
        var ee = 0;

        var arr1 = this.EnergyTypes[0].split("-");
        var arr2 = this.EnergySurplus[0].split("-");

        if (Number(arr1[2]) === 1)
          ee = ee + 1;
        else if (Number(arr1[2]) === 2)
          ee = ee + 2;
        else if (Number(arr1[2]) === 3)
          ee = ee + 2;
        else if (Number(arr1[2]) === 4)
          ee = ee + 3;

        if (Number(arr2[2]) === 2)
          ee = ee + 1;
        else if (Number(arr2[2]) === 3)
          ee = ee + 2;

        this.tableData[0][1].val = ee;
        this.rePrint();
      }
    },

    A2: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (
        this.DrinkingWaterReserve !== "" &&
        this.StandardDrinkingWaterReserve !== "" &&
        this.FoodReserve !== "" &&
        this.StandardFoodReserve !== "" &&
        this.EnergyReserve !== "" &&
        this.StandardEnergyReserve !== "" &&
        this.CityPeople !== "" &&
        this.ServedPeople !== ""
      ) {
        var ee = 0; // 0.05算0.25分，0.2算1分
        var aa =
          Number(this.DrinkingWaterReserve) /
          Number(this.StandardDrinkingWaterReserve) -
          0.9;
        var bb =
          Number(this.FoodReserve) / Number(this.StandardFoodReserve) - 0.9;
        var cc =
          Number(this.EnergyReserve) / Number(this.StandardEnergyReserve) - 0.9;
        var dd = Number(this.ServedPeople) / Number(this.CityPeople);
        // 每个标准占1分，如果都满足则占5分
        aa = aa >= 0 ? aa * 5 : 0;
        bb = bb >= 0 ? bb * 5 : 0;
        cc = cc >= 0 ? cc * 5 : 0;
        aa = aa >= 1 ? 1 : aa;
        bb = bb >= 0 ? 1 : bb;
        cc = cc >= 0 ? 1 : cc;
        dd = dd >= 1 ? 1 : 0;
        ee = aa + bb + cc + dd;
        if (aa === 1 && bb === 1 && cc === 1 && dd === 1) {
          ee = ee + 1;
        }
        this.tableData[0][2].val = ee;
        this.rePrint();
      }
    },

    humanA2: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else if (
        this.DrinkingWaterRate !== "" &&
        this.FoodReserveRate !== "" &&
        this.EnergyReserveRate !== "" &&
        this.ServedPeopleRate !== ""
      ) {
        var ee = 0;
        var arr1 = this.DrinkingWaterRate[0].split("-");
        var arr2 = this.FoodReserveRate[0].split("-");
        var arr3 = this.EnergyReserveRate[0].split("-");
        var arr4 = this.ServedPeopleRate[0].split("-");
        var aa = 0;
        var bb = 0;
        var cc = 0;
        var dd = 0;

        if (Number(arr1[2]) === 1)
          aa = 0;
        else if (Number(arr1[2]) === 2)
          aa = 0.25;
        else if (Number(arr1[2]) === 3)
          aa = 0.5;
        else if (Number(arr1[2]) >= 4)
          aa = 1;

        if (Number(arr2[2]) === 1)
          bb = 0;
        else if (Number(arr2[2]) === 2)
          bb = 0.25;
        else if (Number(arr2[2]) === 3)
          bb = 0.5;
        else if (Number(arr2[2]) >= 4)
          bb = 1;

        if (Number(arr3[2]) === 1)
          cc = 0;
        else if (Number(arr3[2]) === 2)
          cc = 0.25;
        else if (Number(arr3[2]) === 3)
          cc = 0.5;
        else if (Number(arr3[2]) >= 4)
          cc = 1;

        if (Number(arr4[2]) <= 2)
          dd = 0;
        else if (Number(arr4[2]) >= 3)
          dd = 1;

        // 每个标准占1分，如果都满足则占5分   
        ee = aa + bb + cc + dd;
        if (aa === 1 && bb === 1 && cc === 1 && dd === 1) {
          ee = ee + 1;
        }
        this.tableData[0][2].val = ee;
        this.rePrint();
      }
    },

    A3: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (
        this.LifelineInf !== "" &&
        this.KeyNum1 !== "" &&
        this.SpecialNum1 !== ""
      ) {
        var ee = 0;
        var dd1 = Number(this.KeyNum1) / Number(this.LifelineInf);
        var dd2 = Number(this.SpecialNum1) / Number(this.LifelineInf);

        if (dd1 >= 0.95 && dd1 < 0.98) {
          ee = 1;
        } else if (dd1 >= 0.98 && dd1 < 1.0) {
          ee = 2;
        } else if (dd1 === 1.0 && dd2 < 0.05) {
          ee = 3;
        } else if (dd1 === 1.0 && dd2 >= 0.05 && dd2 < 0.1) {
          ee = 4;
        } else if (dd1 === 1.0 && dd2 >= 0.1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[0][3].val = ee;
        this.rePrint();
      }
    },

    // 采集EXCEL数据
    async A3_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_A3).then((result) => {
          let aa = 0;
          let bb = 0;
          let cc = 0;
          result.forEach((item) => {
            aa += 1;
            if (item.defence === "crucial") {
              bb += 1;
            } else if (item.defence === "special") {
              bb += 1;
              cc += 1;
            }
          });
          this.LifelineInf = aa;
          this.KeyNum1 = bb;
          this.SpecialNum1 = cc;
          this.A3();
        });
      }
    },

    A4: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.EmgencyMarketArea !== "" && this.CityArea !== "") {
        var ee = 0;
        var dd = Number(this.EmgencyMarketArea) / Number(this.CityArea);
        if (dd >= 0 && dd < 0.6) {
          ee = 1;
        } else if (dd >= 0.6 && dd < 0.7) {
          ee = 2;
        } else if (dd >= 0.7 && dd < 0.8) {
          ee = 3;
        } else if (dd >= 0.9 && dd < 1.0) {
          ee = 4;
        } else if (dd === 1.0) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[0][4].val = ee;
        this.rePrint();
      }
    },

    async A4_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_A4).then((result) => {
          // 人10分钟步行500米
          let S = 0;
          result.forEach((item) => {
            if (item.OpenInDanger === "YES") {
              let t = item.area; // 单位万公顷
              let u = Math.sqrt(t * 100000000 / Math.PI) + 500;
              S += u * u * Math.PI;
            }
          });
          this.EmgencyMarketArea = (S / 100000000).toFixed(2);
          this.A4();
        });
      }
    },

    B0: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.DangerousImpBuilding !== "" && this.ImpBuilding !== "") {
        var ee = 0;
        var dd = Number(this.DangerousImpBuilding) / Number(this.ImpBuilding);
        if (dd > 0.1) {
          ee = 1;
        } else if (dd > 0.05 && dd <= 0.1) {
          ee = 2;
        } else if (dd > 0.02 && dd <= 0.05) {
          ee = 3;
        } else if (dd > 0.0 && dd <= 0.02) {
          ee = 4;
        } else if (dd === 0) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[1][0].val = ee;
        this.rePrint();
      }
    },

    // 采集EXCEL数据
    async B0_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_B0).then((result) => {
          let aa = 0;
          let bb = 0;
          result.forEach((item) => {
            if (item.IsImportant === "YES") {
              aa += 1;
              if (item.InDanger === "YES") {
                bb += 1;
              }
            }
          });
          this.ImpBuilding = aa;
          this.DangerousImpBuilding = bb;
          this.B0();
        });
      }
    },

    B1: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (
        this.ComplianceBuilding !== "" &&
        this.ExceedingBuilding !== "" &&
        this.CityBuilding !== ""
      ) {
        var ee = 0;
        var dd1 = Number(this.ComplianceBuilding) / Number(this.CityBuilding);
        var dd2 = Number(this.ExceedingBuilding) / Number(this.CityBuilding);
        if (dd1 >= 0.95 && dd1 < 0.98) {
          ee = 1;
        } else if (dd1 >= 0.98 && dd1 < 1.0) {
          ee = 2;
        } else if (dd1 === 1.0 && dd2 < 0.05) {
          ee = 3;
        } else if (dd1 === 1.0 && dd2 >= 0.05 && dd2 < 0.1) {
          ee = 4;
        } else if (dd1 === 1.0 && dd2 >= 0.1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[1][1].val = ee;
        this.rePrint();
      }
    },

    // 采集EXCEL数据
    async B1_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_B1).then((result) => {
          let aa = 0;
          let bb = 0;
          let cc = 0;
          result.forEach((item) => {
            aa += 1;
            if (item.defence === "crucial") {
              bb += 1;
            } else if (item.defence === "special") {
              bb += 1;
              cc += 1;
            }
          });
          this.CityBuilding = aa;
          this.ComplianceBuilding = bb;
          this.ExceedingBuilding = cc;
          this.B1();
        });
      }
    },

    B2: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.ExtraHighBuilding !== "" && this.CityBuilding !== "") {
        var ee = 0;
        var dd = Number(this.ExtraHighBuilding) / Number(this.CityBuilding);
        if (dd >= 0.3 && dd <= 1) {
          ee = 1;
        } else if (dd >= 0.2 && dd < 0.3) {
          ee = 2;
        } else if (dd >= 0.15 && dd < 0.2) {
          ee = 3;
        } else if (dd >= 0.05 && dd < 0.15) {
          ee = 4;
        } else if (dd >= 0 && dd < 0.05) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[1][2].val = ee;
        this.rePrint();
      }
    },

    // 采集EXCEL数据
    async B2_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_B2).then((result) => {
          let aa = 0;
          let bb = 0;
          result.forEach((item) => {
            aa += 1;
            if (item.height > 100) {
              bb += 1;
            }
          });
          this.CityBuilding = aa;
          this.ExtraHighBuilding = bb;
          this.B2();
        });
      }
    },

    B3: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.EmergencySite !== "" && this.CityPeople !== "") {
        var ee = 0;
        var dd = Number(this.CityPeople) / Number(this.EmergencySite);
        if (dd > 50) {
          ee = 1;
        } else if (dd > 40 && dd <= 50) {
          ee = 2;
        } else if (dd > 30 && dd <= 40) {
          ee = 3;
        } else if (dd > 20 && dd <= 30) {
          ee = 4;
        } else if (dd >= 0 && dd < 20) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[1][3].val = ee;
        this.rePrint();
      }
    },

    async B3_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_B3).then((result) => {
          this.EmergencySite = Number(result.length);
          this.B3();
        });
      }
    },

    B4: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.EmergencyArea !== "" && this.CityPeople !== "") {
        var ee = 0;
        var dd = Number(this.EmergencyArea) * 100000000 / Number(this.CityPeople) / 1000;
        if (dd > 0.5 && dd <= 1.0) {
          ee = 1;
        } else if (dd > 1.0 && dd <= 2.0) {
          ee = 2;
        } else if (dd > 2.0 && dd <= 3.0) {
          ee = 3;
        } else if (dd > 3.0 && dd <= 4.5) {
          ee = 4;
        } else if (dd > 4.5) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[1][4].val = ee;
        this.rePrint();
      }
    },

    async B4_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_B4).then((result) => {
          let aa = 0;
          result.forEach((item) => {
            aa += item.area;
          });
          this.EmergencyArea = aa.toFixed(2);
          this.B4();
        });
      }
    },

    B5: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.FirefightingArea !== "" && this.CityArea !== "") {
        var ee = 0;
        var dd = Number(this.FirefightingArea) / Number(this.CityArea);
        if (dd >= 0.7 && dd < 0.8) {
          ee = 1;
        } else if (dd >= 0.8 && dd < 0.9) {
          ee = 2;
        } else if (dd >= 0.9 && dd < 0.95) {
          ee = 3;
        } else if (dd >= 0.95 && dd < 1.0) {
          ee = 4;
        } else if (dd === 1.0) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[1][5].val = ee;
        this.rePrint();
      }
    },

    async B5_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_B5).then((result) => {
          let S = 0;
          // 消防车5分钟行驶直线距离3000米
          result.forEach((item) => {
            S += 3000 * 3000 * Math.PI;
          });
          this.FirefightingArea = (S / 100000000).toFixed(2);
          this.B5();
        });
      }
    },

    C0: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.DanTpInf !== "" && this.TpInf !== "") {
        var ee = 0;
        var dd = Number(this.DanTpInf) / Number(this.TpInf);
        if (dd >= 0.10) {
          ee = 1;
        } else if (dd >= 0.08 && dd < 0.10) {
          ee = 2;
        } else if (dd >= 0.05 && dd < 0.08) {
          ee = 3;
        } else if (dd >= 0.02 && dd < 0.05) {
          ee = 4;
        } else if (dd >= 0 && dd < 0.02) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[2][0].val = ee;
        this.rePrint();
      }
    },

    // 采集EXCEL数据
    async C0_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        // 统计灾害地的数据
        try {
          const allhazardpoint = await ajax1(`/information/static/hazardpoints/${this.city}`);
          this.allhazardpoint = allhazardpoint;
          this.readExcel(ev, this.character_C0).then((result) => {
            this.TpInf = result.length;
            this.DanTpInf = 0;
            // 统计地区，a,b分别是灾害地经纬度
            for (var item1 of result) {
              var lc = eval('(' + item1.location + ')');
              var c = Number(lc.lng);
              var d = Number(lc.lat);
              for (var item of allhazardpoint) {
                var geom = item.geom;
                let arr = geom.split(/[\s()]/);
                var a = Number(arr[2]);
                var b = Number(arr[3]);
                var count = this.C0_fun(a, b, c, d);
                if (count === 1) {
                  this.DanTpInf = Number(this.DanTpInf) + 1;
                  break; // 为灾害建筑，跳出循环，避免重复计算
                }
              }
            }
            this.C0();
          });
          this.$message({
            message: '灾害点数据导入成功',
            type: 'success'
          });
        }
        catch (err) {
          this.$message({
            message: '灾害点数据导入失败 ' + err,
            type: 'error'
          });
        }
      }
    },

    C1: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (
        this.TpInf !== "" &&
        this.KeyNum2 !== "" &&
        this.SpecialNum2 !== ""
      ) {
        var ee = 0;
        var dd1 = Number(this.KeyNum2) / Number(this.TpInf);
        var dd2 = Number(this.SpecialNum2) / Number(this.TpInf);
        if (dd1 >= 0.95 && dd1 < 0.98) {
          ee = 1;
        } else if (dd1 >= 0.98 && dd1 < 1.0) {
          ee = 2;
        } else if (dd1 === 1.0 && dd2 < 0.05) {
          ee = 3;
        } else if (dd1 === 1.0 && dd2 >= 0.05 && dd2 < 0.1) {
          ee = 4;
        } else if (dd1 === 1.0 && dd2 >= 0.1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[2][1].val = ee;
        this.rePrint();
      }
    },

    // 采集EXCEL数据
    async C1_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_C1).then((result) => {
          let aa = 0;
          let bb = 0;
          let cc = 0;
          result.forEach((item) => {
            aa += 1;
            if (item.defence === "crucial") {
              bb += 1;
            } else if (item.defence === "special") {
              bb += 1;
              cc += 1;
            }
          });
          this.TpInf = aa;
          this.KeyNum2 = bb;
          this.SpecialNum2 = cc;
          this.C1();
        });
      }
    },

    C2: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.CityArea !== "" && this.WalkArea !== "") {
        var ee = 0;
        var dd = Number(this.WalkArea) / Number(this.CityArea);
        if (dd >= 0 && dd < 0.6) {
          ee = 1;
        } else if (dd >= 0.6 && dd < 0.7) {
          ee = 2;
        } else if (dd >= 0.7 && dd < 0.8) {
          ee = 3;
        } else if (dd >= 0.8 && dd < 0.9) {
          ee = 4;
        } else if (dd >= 0.9 && dd <= 1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[2][2].val = ee;
        this.rePrint();
      }
    },

    async C2_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_C2).then((result) => {
          // 人15分钟步行750米
          let S = 0;
          result.forEach((item) => {
            S += 750 * 750 * Math.PI;
          });
          this.WalkArea = (S / 100000000).toFixed(2);
          this.C2();
        });
      }
    },

    C3: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.SD_StreetLength !== "" && this.CityPeople !== "") {
        var ee = 0;
        var dd = Number(this.SD_StreetLength) * 1000 / (Number(this.CityPeople) * 10000);
        if (dd >= 0 && dd < 0.3) {
          ee = 1;
        } else if (dd >= 0.3 && dd < 0.4) {
          ee = 2;
        } else if (dd >= 0.4 && dd < 0.5) {
          ee = 3;
        } else if (dd >= 0.5 && dd < 0.65) {
          ee = 4;
        } else if (dd >= 0.65) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[2][3].val = ee;
        this.rePrint();
      }
    },

    async C3_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_C3).then((result) => {
          let L = 0;
          result.forEach((item) => {
            if (item.S_defence === "YES") {
              L += item.length;
            }
          });
          this.SD_StreetLength = L;
          this.C3();
        });
      }
    },

    D0: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.MedicalArea !== "" && this.CityPeople !== "") {
        var ee = 0;
        var dd = (Number(this.MedicalArea) * 100 / (Number(this.CityPeople)) / 10);
        if (dd >= 0 && dd < 3) {
          ee = 1;
        } else if (dd >= 3 && dd < 3.5) {
          ee = 2;
        } else if (dd >= 3.5 && dd < 4) {
          ee = 3;
        } else if (dd >= 4 && dd < 5) {
          ee = 4;
        } else if (dd >= 5) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[3][0].val = ee;
        this.rePrint();
      }
    },

    async D0_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_D0).then((result) => {
          let S = 0;
          result.forEach((item) => {
            S += item.area;
          });
          this.MedicalArea = S.toFixed(2);
          this.D0();
        });
      }
    },

    D1: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.WalkArea2 !== "" && this.CityArea !== "") {
        var ee = 0;
        var dd = Number(this.WalkArea2) / Number(this.CityArea);
        if (dd < 0.6) {
          ee = 1;
        } else if (dd >= 0.6 && dd < 0.7) {
          ee = 2;
        } else if (dd >= 0.7 && dd < 0.8) {
          ee = 3;
        } else if (dd >= 0.8 && dd < 0.9) {
          ee = 4;
        } else if (dd >= 0.9 && dd <= 1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[3][1].val = ee;
        this.rePrint();
      }
    },

    async D1_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_D1).then((result) => {
          // 人15分钟步行750米
          let S = 0;
          result.forEach((item) => {
            S += 750 * 750 * Math.PI;
          });
          this.WalkArea2 = (S / 100000000).toFixed(2);
          this.D1();
        });
      }
    },

    D2: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.AmbulanceRate !== "" &&
        this.AmbulanceSpeed !== ""
      ) {
        var ee = 0;
        var speed = Number(this.AmbulanceSpeed);
        var rate = Number(this.AmbulanceRate);
        if (rate < 80) {
          ee = 1;
        }
        else if (rate >= 80 && rate < 90) {
          ee = 2;
        }
        else if (rate >= 90 && rate < 95) {
          ee = 3;
        }
        else if (rate >= 95 && rate < 100) {
          ee = 4;
        }
        else if (rate === 100) {
          ee = 5;
        }

        this.tableData[3][2].val = ee;
        this.rePrint();
      }
    },

    humanD2: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else if (this.AmbulanceRateHuman !== "" &&
        this.AmbulanceSpeedHuman !== ""
      ) {
        var ee = 0;
        var arr = this.AmbulanceRateHuman[0].split("-");
        var rate = Number(arr[2]);
        ee = rate;

        this.tableData[3][2].val = ee;
        this.rePrint();
      }
    },

    E0: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.DirtyThing !== "" && this.AreaDirtyThing !== "") {
        var ee = 0;
        var dd = Number(this.DirtyThing) * 365 / Number(this.AreaDirtyThing);
        if (dd >= 0 && dd < 0.8) {
          ee = 1;
        } else if (dd >= 0.8 && dd < 0.85) {
          ee = 2;
        } else if (dd >= 0.85 && dd < 0.9) {
          ee = 3;
        } else if (dd >= 0.9 && dd < 0.95) {
          ee = 4;
        } else if (dd >= 0.95) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[4][0].val = ee;
        this.rePrint();
      }
    },

    async E0_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_E0).then((result) => {
          // 每日处理能力
          let D = 0;
          result.forEach((item) => {
            D += item.disposed;
          });
          this.DirtyThing = D.toFixed(2);
          this.E0();
        });
      }
    },

    E1: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (
        this.WaterLength !== "" &&
        this.RainLength !== "" &&
        this.StreetLength !== ""
      ) {
        var ee = 0;
        var dd =
          (Number(this.WaterLength) / Number(this.StreetLength) + Number(this.RainLength) / Number(this.StreetLength)) / 2;
        if (dd >= 0 && dd < 0.8) {
          ee = 1;
        } else if (dd >= 0.8 && dd < 0.85) {
          ee = 2;
        } else if (dd >= 0.85 && dd < 0.9) {
          ee = 3;
        } else if (dd >= 0.9 && dd < 0.95) {
          ee = 4;
        } else if (dd >= 0.95 && dd <= 1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[4][1].val = ee;
        this.rePrint();
      }
    },

    humanE1: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else if (
        this.WaterLengthRate !== "" &&
        this.RainLengthRate !== ""
      ) {
        var ee = 0;
        console.log(this.RainLengthRate[0]);
        var arr1 = this.WaterLengthRate[0].split("-");
        var arr2 = this.RainLengthRate[0].split("-");
        console.log(arr2[2]);
        var rate1 = Number(arr1[2]) * 0.05 + 0.75;
        var rate2 = Number(arr2[2]) * 0.05 + 0.75;
        var dd = (rate1 + rate2) / 2;
        if (dd >= 0 && dd < 0.8) {
          ee = 1;
        } else if (dd >= 0.8 && dd < 0.85) {
          ee = 2;
        } else if (dd >= 0.85 && dd < 0.9) {
          ee = 3;
        } else if (dd >= 0.9 && dd < 0.95) {
          ee = 4;
        } else if (dd >= 0.95 && dd <= 1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[4][1].val = ee;
        this.rePrint();
      }
    },

    async E1_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_E1).then((result) => {
          let L = 0;
          let W = 0;
          let R = 0;
          result.forEach((item) => {
            L += item.length;
            W += item.WaterLength;
            R += item.RainLength;
          });
          this.StreetLength = L;
          this.WaterLength = W;
          this.RainLength = R;
          this.E1();
        });
      }
    },

    F0: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.WaterArea !== "" && this.CityArea !== "") {
        var ee = 0;
        var dd = Number(this.WaterArea) / Number(this.CityArea);
        if (dd >= 0 && dd < 0.1) {
          ee = 1;
        } else if (dd >= 0.1 && dd < 0.2) {
          ee = 2;
        } else if (dd >= 0.2 && dd < 0.3) {
          ee = 3;
        } else if (dd >= 0.3 && dd < 0.4) {
          ee = 4;
        } else if (dd >= 0.4 && dd <= 1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[5][0].val = ee;
        this.rePrint();
      }
    },

    // 采集EXCEL数据
    async F0_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_F0).then((result) => {
          this.WaterArea = Number(result[0].warea);
          this.CityArea = Number(result[0].aarea);
          this.F0();
        });
      }
    },

    F1: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.EcologyArea !== "" && this.CityArea !== "") {
        var ee = 0;
        var dd = Number(this.EcologyArea) / Number(this.CityArea);
        if (dd < 0.2) {
          ee = 1;
        } else if (dd >= 0.2 && dd < 0.25) {
          ee = 2;
        } else if (dd >= 0.25 && dd < 0.3) {
          ee = 3;
        } else if (dd >= 0.3 && dd < 0.35) {
          ee = 4;
        } else if (dd >= 0.35 && dd <= 1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[5][1].val = ee;
        this.rePrint();
      }
    },

    // 采集EXCEL数据
    async F1_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_F1).then((result) => {
          this.EcologyArea = Number(result[0].narea);
          this.CityArea = Number(result[0].aarea);
          this.F1();
        });
      }
    },

    F2: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.GreenArea !== "" && this.CityArea !== "") {
        var ee = 0;
        var dd = Number(this.GreenArea) / Number(this.CityArea);
        if (dd >= 0 && dd < 0.2) {
          ee = 1;
        } else if (dd >= 0.2 && dd < 0.3) {
          ee = 2;
        } else if (dd >= 0.3 && dd < 0.4) {
          ee = 3;
        } else if (dd >= 0.4 && dd < 0.5) {
          ee = 4;
        } else if (dd >= 0.5 && dd <= 1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[5][2].val = ee;
        this.rePrint();
      }
    },

    // 采集EXCEL数据
    async F2_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_F2).then((result) => {
          this.GreenArea = Number(result[0].garea);
          this.CityArea = Number(result[0].aarea);
          this.F2();
        });
      }
    },

    F3: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.Control !== "") {
        var ee = 0;
        var dd = Number(this.Control);
        if (dd < 0.65) {
          ee = 1;
        } else if (dd >= 0.65 && dd < 0.7) {
          ee = 2;
        } else if (dd >= 0.7 && dd < 0.75) {
          ee = 3;
        } else if (dd >= 0.75 && dd < 0.8) {
          ee = 4;
        } else if (dd >= 0.85 && dd <= 1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[5][3].val = ee;
        this.rePrint();
      }
    },

    G0: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.BlankArea !== "" && this.PlanArea !== "") {
        var ee = 0;
        var dd = Number(this.BlankArea) / Number(this.PlanArea);
        if (dd > 0 && dd < 0.015) {
          ee = 1;
        } else if (dd >= 0.015 && dd < 0.03) {
          ee = 2;
        } else if (dd >= 0.03 && dd < 0.04) {
          ee = 3;
        } else if (dd >= 0.04 && dd < 0.05) {
          ee = 4;
        } else if (dd >= 0.05 && dd <= 1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[6][0].val = ee;
        this.rePrint();
      }
    },

    async G0_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_G0).then((result) => {
          this.BlankArea = Number(result[0].barea);
          this.PlanArea = Number(result[0].parea);
          this.G0();
        });
      }
    },

    G1: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.DisScore !== "") {
        var arr1 = this.DisScore[0].split("-");
        var ee = arr1[2];
        this.tableData[6][1].val = ee;
        this.rePrint();
      }
    },

    G2: function () {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      }
      if (!this.checkInput()) return;
      if (this.RiskComNum !== "" && this.CommunityNum !== "") {
        var ee = 0;
        var dd = Number(this.RiskComNum) / Number(this.CommunityNum);
        if (dd > 0 && dd < 0.1) {
          ee = 1;
        } else if (dd >= 0.1 && dd < 0.25) {
          ee = 2;
        } else if (dd >= 0.25 && dd < 0.4) {
          ee = 3;
        } else if (dd >= 0.4 && dd < 0.6) {
          ee = 4;
        } else if (dd >= 0.6 && dd <= 1) {
          ee = 5;
        } else {
          ee = 0;
        }
        this.tableData[6][2].val = ee;
        this.rePrint();
      }
    },

    async G2_load(ev) {
      if (this.city === "") {
        this.$message({
          message: '请选择城市',
          type: 'error'
        });
      } else {
        this.readExcel(ev, this.character_G2).then((result) => {
          let aa = 0;
          let bb = 0;
          result.forEach((item) => {
            aa += 1;
            if (item.PaintDangerMap === "YES") {
              bb += 1;
            }
          });
          this.RiskComNum = bb;
          this.CommunityNum = aa;
          this.G2();
        });
      }
    },

    // 把文件按照二进制进行读取
    readFile: function (file) {
      return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (ev) => {
          resolve(ev.target.result);
        };
      });
    },

    C0_fun: function (a, b, c, d) {
      // a,b是灾害地经纬度，c,d是目标坐标的经纬度
      /*
      1、在纬度相等的情况下：
      经度每隔0.00001度，距离相差约1米；
      每隔0.0001度，距离相差约10米；
      每隔0.001度，距离相差约100米；
      每隔0.01度，距离相差约1000米；
      每隔0.1度，距离相差约10000米。
      2、在经度相等的情况下：
      纬度每隔0.00001度，距离相差约1.1米；
      每隔0.0001度，距离相差约11米；
      每隔0.001度，距离相差约111米；
      每隔0.01度，距离相差约1113米；
      每隔0.1度，距离相差约11132米。
      */
      // 相距小于50米属于灾害地
      if (
        ((a - c) / 0.0001 * 10) * ((a - c) / 0.0001 * 10) +
        ((b - d) / 0.0001 * 11) * ((b - d) / 0.0001 * 11) < 2500
      ) {
        return 1;
      } else {
        // 不属于灾害地
        return 0;
      }
    },

    async readExcel(ev, character) {
      let file = ev.raw;
      if (!file) return;
      // 读取file中的数据,变成JSON格式
      let data = await this.readFile(file);
      let workbook = xlsx.read(data, { type: "binary" });
      let worksheet = workbook.Sheets[workbook.SheetNames[0]]; // 第一个sheet中的数据
      data = xlsx.utils.sheet_to_json(worksheet);
      // 把读取出来的数据变成可以传给服务器的数据
      let arr = [];
      data.forEach((item) => {
        let obj = {};
        for (let key in character) {
          // 数据
          if (!character.hasOwnProperty(key)) break;
          let v = character[key];
          let text = v.text;
          let type = v.type;
          v = item[text] || "";
          if (type === "number") {
            v = Number(v);
          }
          obj[key] = v;
        }
        arr.push(obj);
      });
      return arr;
    },
    // 合并单元格
    // 来自CSDN 小白小党
    // 第一个参数为表格DOM
    // 第二个参数为数组[{index: 0,rows: 1,}]，index一般为0，rows为需要合并的列
    // 第三个参数为基准行
    COMSpanArr1: function (DOM, array, standard) {
      if (DOM.length > 0) {
        for (var i = 0; i < DOM.length; i++) {
          if (i > 0) {
            for (var j = 0; j < array.length; j++) {
              if (DOM[array[j].index].cells[standard].innerText == DOM[i].cells[standard].innerText &&
                DOM[array[j].index].cells[array[j].rows].innerText == DOM[i].cells[array[j].rows].innerText) {
                DOM[i].cells[array[j].rows].style.display = "none"
                DOM[array[j].index].cells[array[j].rows].rowSpan = (DOM[array[j].index].cells[array[j].rows].rowSpan) + 1
              } else {
                array[j].index = i
              }
            }
          }
        }
      }
    },
    COMSpanArr2: function (DOM, array, standard) {
      if (DOM.length > 0) {
        for (var i = 0; i < DOM.length; i++) {
          if (i >= 0) { // 修改此处的条件，包括第一行
            for (var j = 0; j < array.length; j++) {
              if (DOM[array[j].index].cells[standard].innerText == DOM[i].cells[standard].innerText &&
                DOM[array[j].index].cells[array[j].rows].innerText == DOM[i].cells[array[j].rows].innerText) {
                DOM[i].cells[array[j].rows].style.display = "none";
                DOM[array[j].index].cells[array[j].rows].rowSpan = (DOM[array[j].index].cells[array[j].rows].rowSpan) + 1;
              } else {
                array[j].index = i;
              }
            }
          }
        }
      }
    }


  },
};
</script>

<style lang="scss" scoped>
.score-item {
  font-size: 18px;
}

table {
  border-collapse: collapse;
  /* 折叠边框 */
  border: 2px solid #000;
  /* 设置边框宽度和颜色 */
}

thead th {
  /* 添加背景色、文本颜色等样式 */
  background: #6699ff;
  color: #fff;
  height: 40px;
}
</style>
