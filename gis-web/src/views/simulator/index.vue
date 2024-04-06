<template>
  <div class="app-container">
    <el-row :gutter="32">
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>参数设置</span>
          </div>
          <el-form ref="form">
            <el-form-item label="灾害类型:">
              <el-radio v-model="type" label="flood">暴雨洪涝</el-radio>
              <el-radio v-model="type" label="infection">传染病</el-radio>
              <el-radio v-model="type" label="explode">危化品爆炸</el-radio>
            </el-form-item>
            <!-- 设置洪水数据 -->
            <div v-show="type == 'flood'">
              <el-form-item label="模拟城市:">
                <el-cascader :options="areaOptions" placeholder="城市" :show-all-levels="false" v-model="area">
                  <template slot-scope="{ node, data }">
                    <span>{{ data.label }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                  </template>
                </el-cascader>
              </el-form-item>
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
                      <el-upload name="buildings" :auto-upload="false" :on-change="uploadBuildingFiles" multiple action=""
                        :file-list="buildingFiles">
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
                <el-collapse-item title="韧性测度数据" name="2">
                  <template slot="title">
                    <p style="font-size: 14px; font-weight: bold;">韧性测度数据</p>
                  </template>
                  <el-form-item label="交通出行量(OD)数据(可选):">
                    <el-popover placement="right" width="800" trigger="hover">
                      <p class="helpTitle">数据要求</p>
                      <el-image :src="helpImgs['od']"></el-image>
                      <i class="el-icon-question" slot="reference"></i>
                    </el-popover>
                    <el-upload name="od" :on-change="uploadODFile" :auto-upload="false" multiple action=""
                      :file-list="odFiles">
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__tip" slot="tip">
                        请上传od.csv文件
                      </div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="医院数据(可选):">
                    <el-popover placement="right" width="800" trigger="hover">
                      <p class="helpTitle">数据要求</p>
                      <el-image :src="helpImgs['hospital']"></el-image>
                      <i class="el-icon-question" slot="reference"></i>
                    </el-popover>
                    <el-upload name="od" :on-change="uploadHospitalFile" :auto-upload="false" multiple action=""
                      :file-list="hospitalFiles">
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__tip" slot="tip">
                        请上传hospital.xls文件
                      </div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="居民区数据(可选):">
                    <el-popover placement="right" width="800" trigger="hover">
                      <p class="helpTitle">数据要求</p>
                      <el-image :src="helpImgs['community']"></el-image>
                      <i class="el-icon-question" slot="reference"></i>
                    </el-popover>
                    <el-upload name="od" :on-change="uploadCommunityFile" :auto-upload="false" multiple action=""
                      :file-list="communityFiles">
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__tip" slot="tip">
                        请上传community.xls文件
                      </div>
                    </el-upload>
                  </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="暴雨洪涝模拟参数" name="3">
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

            <!-- 设置疫情数据 -->
            <div v-show="type == 'infection'">
              <el-form-item label="模拟方式:">
                <!-- <el-radio v-model="infectionModel" label="gamma">传染病空间模拟</el-radio> -->
                <el-radio v-model="infectionModel" label="before">传染病灾前模拟</el-radio>
                <!-- <el-radio v-model="infectionModel" label="maddpg">传染病人口流动控制模拟</el-radio> -->
                <el-radio v-model="infectionModel" label="after">传染病灾后模拟与预测</el-radio>
                <el-radio v-model="infectionModel" label="performance">传染病灾害模拟效率对比</el-radio>
              </el-form-item>
              <el-form-item label="模拟城市:">
                <el-cascader :options="areaOptions" placeholder="城市" :show-all-levels="false" v-model="area" @change="onChangeInfectionArea">
                  <template slot-scope="{ node, data }">
                    <span>{{ data.label }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                  </template>
                </el-cascader>
              </el-form-item>
              <!-- 设置传染病灾前模拟 -->
              <div v-show="infectionModel == 'before'">
                <el-form-item label="初始感染点列表：">
                  <el-popover placement="right" width="400" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>初始情况下感染人群的位置和人数，请点击“修改”按钮后在地图上添加</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <el-table :data="initInfectionList" max-height="200" size="mini"
                    :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
                    <el-table-column property="id" label="序号" width="100"></el-table-column>
                    <el-table-column property="population" label="感染人数" width="140">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.population" style="width:120px;" :min="1" :max="20"
                          :precision="0" :step="1" size="small"></el-input-number>
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
                    <el-button type="primary" size="small" style="margin: 10px;" @click="showInfectionInput = true"
                      plain>修改</el-button>
                  </div>
                </el-form-item>
                <el-form-item label="是否封锁区域:">
                  <el-popover placement="right" width="400" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>对选定的区域封锁一段时间，进行传染病模拟</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <el-switch v-model="useLockInfection" active-text="是" inactive-text="否" style="margin-left: 10px;">
                  </el-switch>
                </el-form-item>
                <el-form-item label="封锁区域列表：" v-show="useLockInfection">
                  <el-table :data="lockInfectionList" max-height="200" size="mini"
                    :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
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
                    <el-button type="primary" size="small" style="margin: 10px;" @click="showInfectionLock = true"
                      plain>修改</el-button>
                  </div>
                </el-form-item>
                <el-form-item label="配置:">
                  <el-popover placement="right" width="400" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>提供了一些常见类型传染病的参数</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <el-select v-model="infectionParamConfig" @change="onInfectionConfigChange">
                    <el-option v-for="(name, config) in infectionConfigOptions" :label="name" :key="config"
                      :value="config"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="传染病基本繁殖数:">
                  <el-popover placement="right" width="400" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>传染病基本繁殖数(R0)：在没有外力介入，所有人都没有免疫力的情况下，一个感染传染病的人，会传染给其他多少个人的平均数</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="infectionParamBefore['R0']" placeholder="请输入内容"
                    :disabled="infectionParamConfig != 'custom'"></el-input> -->
                  <el-input-number v-model="infectionParamBefore['R0']" :min="0" :controls="false"
                    :disabled="infectionParamConfig != 'custom'"></el-input-number>
                </el-form-item>
                <el-form-item label="感染后住院率:">
                  <el-popover placement="right" width="300" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>单位时间内每个被感染的患者住院的概率(I_H_para)</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="infectionParamBefore['I_H_para']" placeholder="请输入内容"></el-input> -->
                  <el-input-number v-model="infectionParamBefore['I_H_para']" :min="0" :max="1"
                    :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="感染后自愈率:">
                  <el-popover placement="right" width="300" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>单位时间内每个被感染的患者自愈的概率(I_R_para)</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="infectionParamBefore['I_R_para']" placeholder="请输入内容"></el-input> -->
                  <el-input-number v-model="infectionParamBefore['I_R_para']" :min="0" :max="1"
                    :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="住院后治愈率:">
                  <el-popover placement="right" width="300" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>单位时间内每个住院的患者治愈的概率(H_R_para)</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="infectionParamBefore['H_R_para']" placeholder="请输入内容"></el-input> -->
                  <el-input-number v-model="infectionParamBefore['H_R_para']" :min="0" :max="1"
                    :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="模拟总天数:">
                  <el-popover placement="right" width="300" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>该任务模拟传染病发生后的总天数</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="infectionParamBefore['simulation_days']" placeholder="请输入内容"></el-input> -->
                  <el-input-number v-model="infectionParamBefore['simulation_days']" :min="0" :precision="0"
                    :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="是否同时提交无管控措施任务:" v-show="useLockInfection">
                  <el-popover placement="right" width="400" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>是则同时提交两个任务，一个使用管控措施一个不使用管控措施，其他参数相同</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <el-switch v-model="sumbitBothTask" active-text="是" inactive-text="否" style="margin-left: 10px;">
                  </el-switch>
                </el-form-item>
              </div>
              <!-- 设置传染病人口流动控制模拟 -->
              <div v-show="infectionModel == 'maddpg'">
                <el-form-item label="区域:">
                  <el-input v-model="infectionParamMADDPG['Region']" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="传染病基本繁殖数:">
                  <el-input v-model="infectionParamMADDPG['R0']" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="住院率:">
                  <el-input v-model="infectionParamMADDPG['Gamma']" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="治愈率:">
                  <el-input v-model="infectionParamMADDPG['Theta']" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="初始感染人数:">
                  <el-input v-model="infectionParamMADDPG['Number']" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="行政区域划分数据:">
                  <el-upload name="regions" :auto-upload="false" :on-change="uploadRegionFiles" action="">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__tip" slot="tip">
                      请上传shp文件
                    </div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="人口数量数据:">
                  <el-upload name="population" :auto-upload="false" :on-change="uploadPopulationFile" action="">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__tip" slot="tip">
                      请上传population.npy文件
                    </div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="人口出行量数据:">
                  <el-upload name="od" :auto-upload="false" :on-change="uploadODFileInfection" action="">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__tip" slot="tip">
                      请上传od.npy文件
                    </div>
                  </el-upload>
                </el-form-item>
              </div>
              <!-- 设置传染病灾后模拟预测 -->
              <div v-show="infectionModel == 'after'">
                <el-form-item label="设置感染后住院率:">
                  <el-popover placement="right" width="300" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>单位时间内每个被感染的患者住院的概率(I_H_para)</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="infectionParamAfter['I_H_para']" placeholder="请输入内容"></el-input> -->
                  <el-input-number v-model="infectionParamAfter['I_H_para']" :min="0" :max="1"
                    :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="设置感染后自愈率:">
                  <el-popover placement="right" width="300" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>单位时间内每个被感染的患者自愈的概率(I_R_para)</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="infectionParamAfter['I_R_para']" placeholder="请输入内容"></el-input> -->
                  <el-input-number v-model="infectionParamAfter['I_R_para']" :min="0" :max="1"
                    :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="设置住院后治愈率:">
                  <el-popover placement="right" width="300" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>单位时间内每个住院的患者治愈的概率(H_R_para)</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="infectionParamAfter['H_R_para']" placeholder="请输入内容"></el-input> -->
                  <el-input-number v-model="infectionParamAfter['H_R_para']" :min="0" :max="1"
                    :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="每日新增感染人数文件:">
                  <el-upload name="file" :auto-upload="false" :on-change="uploadSeirPopulationXlsx" :file-list="infectionParamAfter['file']" action="">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__tip" slot="tip">
                      模拟时期每日新增感染人数的xlsx文件
                    </div>
                  </el-upload>
                </el-form-item>
              </div>
              <!-- 传染病模拟效率 -->
              <div v-show="infectionModel == 'performance'">
                <el-form-item label="区域:">
                  <el-popover placement="right" width="400" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>模拟城市内要进行传染病模拟的区域</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input style="width:auto;" v-model="infectionParamPerformance['start_region']"
                    placeholder="请输入内容"></el-input> -->
                  <el-select v-model="infectionParamPerformance['start_region']">
                    <el-option v-for="name in city4LevelNameList" :label="name" :key="name" :value="name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="传染病基本繁殖数:">
                  <el-popover placement="right" width="400" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>传染病基本繁殖数(R0)：在没有外力介入，所有人都没有免疫力的情况下，一个感染传染病的人，会传染给其他多少个人的平均数</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <el-input-number v-model="infectionParamPerformance['R0']" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="感染后住院率:">
                  <el-popover placement="right" width="400" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>单位时间内每个被感染的患者住院的概率(Gamma)</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <el-input-number v-model="infectionParamPerformance['Gamma']" :min="0" :max="1"
                    :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="住院后治愈率:">
                  <el-popover placement="right" width="400" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>单位时间内每个住院的患者治愈的概率(Theta)</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <el-input-number v-model="infectionParamPerformance['Theta']" :min="0" :max="1"
                    :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="初始感染人数:">
                  <el-popover placement="right" width="400" trigger="hover">
                    <p class="helpTitle">参数说明</p>
                    <p>初始情况下感染者人数</p>
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <el-input-number v-model="infectionParamPerformance['start_number']" :min="0" :step="1"
                    :controls="false"></el-input-number>
                </el-form-item>
              </div>

            </div>

            <!-- 设置危化品爆炸数据 -->
            <div v-show="type == 'explode'">
              <el-form-item label="模拟城市:">
                <el-cascader :options="areaOptions" placeholder="城市" :show-all-levels="false" v-model="area">
                  <template slot-scope="{ node, data }">
                    <span>{{ data.label }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                  </template>
                </el-cascader>
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
              <el-form-item label="加油站数据(必须):">
                <el-popover placement="right" width="800" trigger="hover">
                  <p class="helpTitle">数据要求</p>
                  <el-image :src="helpImgs['gasstation']"></el-image>
                  <i class="el-icon-question" slot="reference"></i>
                </el-popover>
                <el-upload name="station" :auto-upload="false" :on-change="uploadStationFile" action=""
                  :file-list="stationFiles">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__tip" slot="tip">
                    请上传*.csv文件
                  </div>
                </el-upload>
                <el-form-item label="爆炸范围半径:">
                  <el-popover placement="right" title="参数说明" content="表示爆炸范围圆的半径，单位是经纬度" trigger="hover">
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="explodeParam.radius" placeholder="请输入内容"></el-input> -->
                  <el-input-number v-model="explodeParam.radius" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="爆炸幅度:">
                  <el-popover placement="right" title="参数说明" content="表示爆炸波幅度大小" trigger="hover">
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="explodeParam.amplitude" placeholder="请输入内容"></el-input> -->
                  <el-input-number v-model="explodeParam.amplitude" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="高斯方差:">
                  <el-popover placement="right" title="参数说明" content="表示爆炸波高斯方差大小" trigger="hover">
                    <i class="el-icon-question" slot="reference" style="margin-right: 5px;"></i>
                  </el-popover>
                  <!-- <el-input v-model="explodeParam.sigma" placeholder="请输入内容"></el-input> -->
                  <el-input-number v-model="explodeParam.sigma" :min="0" :controls="false"></el-input-number>
                </el-form-item>
              </el-form-item>
            </div>

            <!-- 操作 -->
            <el-form-item>
              <el-button @click="submitTask" type="primary">提交任务</el-button>
              <el-button v-show="type == 'infection' && infectionModel == 'performance'" @click="showInfectionEfficiency"
                type="success" plain>查看结果</el-button>
            </el-form-item>


          </el-form>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div slot="header" style="font-weight: bold;">
            <i class="el-icon-heavy-rain"></i>
            暴雨洪涝灾害模拟任务
          </div>
          <el-table :data="tableData" style="height: 50vh; overflow:auto;">
            <el-table-column label="序号" prop="id" :show-overflow-tooltip="true" width="60" />
            <el-table-column property="name" label="任务名称" align="center" width="120"></el-table-column>
            <!-- <el-table-column label="名称" prop="simulationArea" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{
                  scope.row.simulationArea + "-" + scope.row.simulationType
              }}</span>
            </template>
          </el-table-column> -->
            <el-table-column label="位置" prop="simulationArea" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ parseCity(scope.row.simulationArea) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="灾害类型" prop="simulationType" align="center" :show-overflow-tooltip="true" width="80">
              <template slot-scope="scope">
                <span>{{ typeNames[scope.row.simulationType] }}</span>
              </template>
            </el-table-column>

            <el-table-column label="任务类型" prop="isNewSimulation" align="center" :show-overflow-tooltip="true" width="80">
              <template slot-scope="scope">
                <span>{{ taskTypeNames[scope.row.isNewSimulation] }}</span>
              </template>
            </el-table-column>

            <el-table-column label="任务提交时间" align="center" width="180" prop="simulationDate">
              <template slot-scope="scope">
                <span>{{ scope.row.simulationDate }}</span>
              </template>
            </el-table-column>

            <el-table-column label="状态" align="center" width="100" prop="simulationDate">
              <template slot-scope="scope">
                <i class="el-icon-loading" v-if="scope.row.simulationState === 'processing'"></i>
                <i class="el-icon-success" v-if="scope.row.simulationState === 'finish'" style="color: green"></i>
                <i class="el-icon-error" v-if="scope.row.simulationState === 'failed'" style="color: crimson"></i>
              </template>
            </el-table-column>

            <el-table-column label="模拟计算时间" align="center" width="180" prop="simulationDate">
              <template slot-scope="scope">
                <span>{{ scope.row.simulationTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-set-up"
                  :disabled="scope.row.simulationState !== 'finish'" @click="clickTask(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card style="margin-top: 10px;">
          <div slot="header" style="font-weight: bold;">
            <i class="el-icon-s-grid"></i>
            传染病灾害模拟任务
          </div>
          <el-table :data="infectionSimulationList" style="height: 50vh; overflow:auto;">
            <el-table-column label="序号" prop="id" :show-overflow-tooltip="true" width="80" />
            <el-table-column label="位置" prop="city" align="center" :show-overflow-tooltip="true" width="80">
              <template slot-scope="scope">
                <span>{{ parseCity(scope.row.city) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="灾害类型" prop="simulationType" :show-overflow-tooltip="true" width="100">
              <template slot-scope="scope">
                <span>{{ typeNames[scope.row.simulationType] }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="是否封锁区域" align="center" :show-overflow-tooltip="true" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.useLock ? "是" : "否" }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="管控措施类型" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ lockTypeNames[scope.row.lockType] }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="已完成的模拟时长" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.num_result.toFixed(0) }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="模拟总时长" align="center" :show-overflow-tooltip="true" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.para_json.simulation_days * 24 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="基本繁殖数" align="center" :show-overflow-tooltip="true" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.para_json.R0 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="80" prop="simulationDate">
              <template slot-scope="scope">
                <i class="el-icon-loading" v-if="scope.row.status === 'processing'"></i>
                <i class="el-icon-success" v-if="scope.row.status === 'finish'" style="color: green"></i>
                <i class="el-icon-error" v-if="scope.row.status === 'no'" style="color: crimson"></i>
              </template>
            </el-table-column>
            <el-table-column label="任务提交时间" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.simulationTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-set-up" :disabled="scope.row.simulationState === 'no'"
                  @click="clickTask(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card style="margin-top: 10px;">
          <div slot="header" style="font-weight: bold;">
            <i class="el-icon-warning"></i>
            危化品爆炸模拟任务
          </div>
          <el-table :data="explodeSimulationList" style="height: 50vh; overflow:auto;">
            <el-table-column label="序号" prop="id" :show-overflow-tooltip="true" width="80" />
            <el-table-column label="位置" prop="city" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ parseCity(scope.row.city) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="灾害类型" prop="simulationType" :show-overflow-tooltip="true" width="150">
              <template slot-scope="scope">
                <span>{{ typeNames[scope.row.simulationType] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="80" prop="simulationDate">
              <template slot-scope="scope">
                <i class="el-icon-loading" v-if="scope.row.state === 'processing'"></i>
                <i class="el-icon-success" v-if="scope.row.state === 'finish'" style="color: green"></i>
                <i class="el-icon-error" v-if="scope.row.state === 'no'" style="color: crimson"></i>
              </template>
            </el-table-column>
            <el-table-column label="任务提交时间" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.submitTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-set-up" :disabled="scope.row.state !== 'finish'"
                  @click="clickTask(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer :visible.sync="drawer" :wrapperClosable="false" size="78%">
      <template slot="title">
        <span v-if="drawType == 'flood'">暴雨洪涝灾害模拟结果</span>
        <span v-if="drawType == 'infection' && infectionModel !='performance'">传染病灾害模拟结果</span>
        <span v-if="drawType == 'infection' && infectionModel =='performance'">传染病灾害模拟效率对比结果</span>
        <span v-if="drawType == 'explode'">危化品爆炸模拟结果</span>
      </template>
      <flodsimulation :type="drawType" :status="status" :metric="metric" v-show="drawType == 'flood'" />
      <infectionSimulation :type="drawType" :idSuffix="infectionModel" :infectionModel="infectionModel" :status="status" :taskList="infectionSimulationList"
        v-show="drawType == 'infection'" />
      <explodeSimulation :type="drawType" :status="status" v-show="drawType == 'explode'" />
    </el-drawer>
    <el-dialog title="传染病灾前模拟初始感染点设置" :visible.sync="showInfectionInput" width="80%" center>
      <div slot="title" style="font-size: 18px; font-weight: bold;">传染病灾前模拟初始感染点设置</div>
      <infectionInput ref="infectionInput" :area="area" @updateInitInfectionList="updateInitInfectionList" />
      <div slot="footer">
        <el-button @click="showInfectionInput = false">取 消</el-button>
        <el-button type="primary" @click="finishInitInfection">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="传染病灾前模拟封锁区域设置" :visible.sync="showInfectionLock" width="80%" center>
      <div slot="title" style="font-size: 18px; font-weight: bold;">传染病灾前模拟封锁区域设置</div>
      <infectionLock ref="infectionLock" :area="area" @updateLockInfectionList="updateLockInfectionList"
        @updateInfectionLockDay="updateInfectionLockDay" />
      <div slot="footer">
        <el-button @click="showInfectionLock = false">取 消</el-button>
        <el-button type="primary" @click="finishLockInfection">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import axios from "axios";
import ajax from "./ajax";
import serverInfo from './serverInfo';
import flodsimulation from "./components/flood/disasterSimulator-ol.vue";
import infectionSimulation from "./components/infection/infectionSimulation-ol.vue";
import infectionInput from "./components/infection/infectionInput.vue";
import infectionLock from "./components/infection/infectionLock.vue";
import explodeSimulation from "./components/explode/explodeSimulationNew.vue";
import { options } from "../evaluate/CityScoreData.js";
import mapData from '../simulator/components/mapData'

export default {
  name: "Simulator",
  components: { flodsimulation, infectionSimulation, infectionInput, infectionLock, explodeSimulation },
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
      type: "flood",
      drawType: "flood",
      infectionModel: "before",

      // 洪涝模拟是否上传数据
      useUploadFile: true,

      typeNames: {
        'flood': '暴雨洪涝',
        'infection': '传染病',
        'explode': '危化品爆炸',
      },
      taskTypeNames: {
        'false': '模拟',
        'true': '推演',
      },

      area: [],
      areaOptions: options,

      areaOptions_seir: [
        {
          value: 'Shanghai',
          label: '上海',
        },
        {
          value: 'Minhang',
          label: '闵行',
        },
        {
          value: 'Yangpu',
          label: '杨浦',
        },
        {
          value: 'guangzhou',
          label: '广州',
        },
      ],

      //折叠面板
      floodActiveNames: ["1"],

      files: [],
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
      infectionParamGamma: {
        type: "infection",
        Population: "1000",
        "Initial Infection": "3",
        "Crowd Speed": "0.01",
        "Infectious Range": "0.01",
      },
      infectionParamBefore: {
        "simulation_city": "guangzhou",
        "I_H_para": 0.03,
        "I_R_para": 0.11,
        "H_R_para": 0.11,
        "simulation_days": 1,
        "R0": 15,
      },
      infectionParamMADDPG: {
        "R0": 1.6,
        "Gamma": 0.45,
        "Theta": 0.15,
        "Number": 10,
        "Region": "新华",
        "file": [],
        "populationFile": [],
        "odFile": [],
      },
      infectionParamAfter: {
        "city": "guangzhou",
        "I_H_para": 0.0136,
        "I_R_para": 0.1922,
        "H_R_para": 0.111,
        "file": [],
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
      initInfectionList: [],                      // 初始感染点
      lockInfectionList: [],                      // 封锁区域
      showInfectionInput: false,                  // 设置初始感染点对话框
      showInfectionLock: false,                   // 设置封锁区域对话框
      useLockInfection: false,                    // 是否使用封闭区域传染病模拟
      infectionLockDay: 1,                        // 区域封锁时长
      sumbitBothTask: false,                       // 是否同时提交不封锁和封锁区域任务
      lockTypeNames:                               // 封锁区域类型名称
      {
        0: '无管控措施',
        1: '人为管控措施',
        2: '强化学习动态管控措施'
      },
      infectionParamPerformance: {                  // 传染病模拟效率
        "city": "guangzhou",
        "R0": 2,
        "Gamma": 0.45,
        "Theta": 0.15,
        "start_number": 10,
        "start_region": "新华",
      },
      city4LevelNameList: ["新华"],                       //城市乡镇街道级名称

      // 危化品爆炸参数
      explodeParam: {
        radius: 0.045,
        sigma: 0.02,
        amplitude: 10.0,
      },

      tableData: [],
      infectionSimulationList: [],                // 传染病模拟任务列表
      explodeSimulationList: [],                  // 危化品爆炸模拟任务列表
      status: {},
      metric: {},
      drawer: false,
      waterFiles: [],
      roadFiles: [],
      buildingFiles: [],
      demFiles: [],
      rainFiles: [],
      odFiles: [],
      hospitalFiles: [],
      communityFiles: [],
      stationFiles: [],
      inputarray1: [1],
      taskTimer: null,
      infectionStartTime: null,   //传染病模拟操作开始时间
    };
  },
  mounted() {
    let getTaskFunction = () => {
      this.getTaskList();
      this.inquireCityInfectionSimulation(0);
      this.inquireCityInfectionSimulation(1);
      this.inquireCityInfectionSimulation(2);
      this.getExplodeTaskList();
      console.log("Get Task List!");
    };
    getTaskFunction();
    // this.taskTimer = setInterval(getTaskFunction, 10000);
    // 传染病模拟：获取城市全部的乡镇街道级名称
    this.getCityLevelName();
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
    displayHelp(value) {
      console.log(value);
    },
    uploadWaterFiles(file) {
      let fileName = file.name;
      let parts = fileName.split('.')
      let ext = parts[parts.length-1];
      let extensions = [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ];
      if(!extensions.includes(ext)){
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
      let ext = parts[parts.length-1];
      let extensions = [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ];
      if(!extensions.includes(ext)){
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
      let ext = parts[parts.length-1];
      let extensions = [ "shp","cpg","dbf","prj","qix","sbn","sbx","shx","xml" ];
      if(!extensions.includes(ext)){
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
      let ext = parts[parts.length-1];
      let extensions = [ "tif","ovr","tfw","xml" ];
      if(!extensions.includes(ext)){
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
      let ext = parts[parts.length-1];
      let extensions = [ "tif","ovr","tfw","xml" ];
      if(!extensions.includes(ext)){
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
    uploadODFile(file) {
      let fileName = file.name;
      let parts = fileName.split('.')
      let ext = parts[parts.length-1];
      let extensions = [ "csv","xlsx" ];
      if(!extensions.includes(ext)){
        this.$message.error(`无法上传格式为${ext}的文件！`);
        this.odFiles = this.odFiles.slice(0, -1);
        return;
      }
      if (fileName.split(".")[0] != "od") {
        this.$message.error(`请将上传文件命名为od.${fileName.split(".")[1]}`);
        this.odFiles = this.odFiles.slice(0, -1);
        return;
      }
      else {
        this.odFiles.push(file);
        this.files.push(file);
      }
    },
    uploadHospitalFile(file) {
      let fileName = file.name;
      let parts = fileName.split('.')
      let ext = parts[parts.length-1];
      let extensions = [ "csv","xlsx" ];
      if(!extensions.includes(ext)){
        this.$message.error(`无法上传格式为${ext}的文件！`);
        this.hospitalFiles = this.hospitalFiles.slice(0, -1);
        return;
      }
      if (fileName.split(".")[0] != "hospital") {
        this.$message.error(`请将上传文件命名为hospital.${fileName.split(".")[1]}`);
        this.hospitalFiles = this.hospitalFiles.slice(0, -1);
        return;
      }
      else {
        this.hospitalFiles.push(file);
      }
    },
    uploadCommunityFile(file) {
      let fileName = file.name;
      let parts = fileName.split('.')
      let ext = parts[parts.length-1];
      let extensions = [ "csv","xlsx" ];
      if(!extensions.includes(ext)){
        this.$message.error(`无法上传格式为${ext}的文件！`);
        this.communityFiles = this.communityFiles.slice(0, -1);
        return;
      }
      if (fileName.split(".")[0] != "community") {
        this.$message.error(`请将上传文件命名为community.${fileName.split(".")[1]}`);
        this.communityFiles = this.communityFiles.slice(0, -1);
        return;
      }
      else {
        this.communityFiles.push(file);
      }
    },
    uploadRegionFiles(file) {
      this.infectionParamMADDPG["file"].push(file);
    },
    uploadPopulationFile(file) {
      this.infectionParamMADDPG["populationFile"].push(file);
    },
    uploadODFileInfection(file) {
      this.infectionParamMADDPG["odFile"].push(file);
    },
    uploadSeirPopulationXlsx(file) {
      let fileName = file.name;
      let parts = fileName.split('.')
      let ext = parts[parts.length-1];
      let extensions = [ "xlsx" ];
      if(!extensions.includes(ext)){
        this.$message.error(`无法上传格式为${ext}的文件！`);
        this.infectionParamAfter["file"] = [];
        return;
      }
      else{
        this.infectionParamAfter["file"].push(file);
      }
    },
    uploadStationFile(file) {
      let fileName = file.name;
      if (fileName.split(".")[1] != "csv") {
        setTimeout(() => {
          this.$message.error(`请上传csv文件`);
        }, 100);
        this.stationFiles = this.stationFiles.slice(0, -1);
        return;
      }
      else {
        this.stationFiles.push(file);
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
        'config13': 1.26, //'猴痘'
        'custom': 1, //自定义
      };
      this.infectionParamBefore['R0'] = R0s[option];
    },
    submitTask() {

      console.log(this.type, this.infectionModel);
      // 暴雨洪涝模拟
      if (this.type === "flood") {
        if (this.useUploadFile) {
          if (this.area.length === 0)
            return this.$message.error("请选择模拟城市");
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
        formData.append("area", this.area[1]);
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
            this.uploadMeasureFiles();
            this.uploadResilence();
            this.getTaskList(() => {
              this.requestMeasure();
            });
          })
          .catch((err) => {
            console.log(err);
            loading.close();
            this.$message({
              message: "仿真环境上传失败",
              type: "error",
            });
          });


      }
      // 传染病模拟
      else if (this.type === "infection") {  // 传染病模拟
        if (this.area.length === 0)
          return this.$message.error("请选择模拟城市");
        // 传染病空间模拟
        if (this.infectionModel === "gamma") {
          if (this.area.length === 0)
            return this.$message.error("请选择模拟城市");
          if (this.roadFiles.length === 0)
            return this.$message.error("请上传路网数据");
          if (this.buildingFiles.length === 0)
            return this.$message.error("请上传建筑物数据");
          if (this.demFiles.length === 0)
            return this.$message.error("请上传路网数据");

          let totalSize = 0;
          this.roadFiles.forEach((file) => {
            totalSize += file.size;
          });
          this.buildingFiles.forEach((file) => {
            totalSize += file.size;
          });
          this.demFiles.forEach((file) => {
            totalSize += file.size;
          });
          if (totalSize >= 1073741824) {
            this.$message.error("上传文件总大小不能超过1GB");
            return;
          }

          if (Number(this.infectionParamGamma["Population"]) < 0) {
            return this.$message.error("人口总数必须大于0");
          }
          if (Number(this.infectionParamGamma["Initial Infection"]) < 0) {
            return this.$message.error("初始感染人数必须大于0");
          }
          if (Number(this.infectionParamGamma["Crowd Speed"]) < 0) {
            return this.$message.error("人群移速必须大于0");
          }
          if (Number(this.infectionParamGamma["Infectious Range"]) < 0) {
            return this.$message.error("可感染范围必须大于0");
          }

          const loading = this.$loading({
            lock: true,
            text: "仿真环境上传中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          let formData = new FormData();
          // formData重复的往一个值添加数据并不会被覆盖掉，可以全部接收到，可以通过formData.getAll('files')来查看所有插入的数据
          for (let i = 0; i < this.files.length; i++) {
            formData.append("files", this.files[i].raw);
          }
          formData.append("type", this.type);
          formData.append("area", this.area[1]);
          formData.append(
            "disturbance",
            JSON.stringify(
              this.type === "flood" ? this.floodParam : this.infectionParamGamma
            )
          );
          let url = serverInfo.baseURL + "/simulation/simulator";
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
              setTimeout(() => {
                this.infectionSimulationList = [];
                this.inquireCityInfectionSimulation(0);
                this.inquireCityInfectionSimulation(1);
                this.inquireCityInfectionSimulation(2);
              }, 100);
            })
            .catch((err) => {
              console.log(err);
              loading.close();
              this.$message({
                message: "仿真环境上传失败",
                type: "error",
              });
            });


        }
        // 传染病灾前模拟
        else if (this.infectionModel === "before") {

          if (Number(this.infectionParamBefore["I_H_para"]) < 0) {
            return this.$message.error("感染后住院率必须大于0");
          }
          if (Number(this.infectionParamBefore["I_R_para"]) < 0) {
            return this.$message.error("感染后自愈率必须大于0");
          }
          if (Number(this.infectionParamBefore["H_R_para"]) < 0) {
            return this.$message.error("住院后治愈率必须大于0");
          }
          if (Number(this.infectionParamBefore["R0"]) < 0) {
            return this.$message.error("R0必须大于0");
          }
          if (Number(this.infectionParamBefore["simulation_days"]) < 0) {
            return this.$message.error("模拟总天数必须大于0");
          }

          this.infectionParamBefore["simulation_city"] = this.area[1];

          let I_input = {}, region_list = {};
          this.initInfectionList.forEach((infection, index) => {
            I_input[index] = infection.population;
            region_list[index] = infection.position;
          });
          this.infectionParamBefore['I_input'] = JSON.stringify(I_input);
          this.infectionParamBefore['region_list'] = JSON.stringify(region_list);

          let formData = new FormData();
          for (let key in this.infectionParamBefore) {
            formData.append(key, this.infectionParamBefore[key]);
          }
          // 添加操作时间
          const executionTime = new Date() - this.infectionStartTime;
          this.infectionStartTime = new Date();

          // 不封锁区域
          if (!this.useLockInfection) {
            this.submitInfectionBefore(formData, false);
          }
          else  // 封锁区域
          {
            // 同时提交不封锁区域任务
            if (this.sumbitBothTask) {
              this.submitInfectionBefore(formData, false);
            }
            let formData_lock = new FormData();
            let lock_area = {};
            this.lockInfectionList.forEach((infection, index) => {
              lock_area[index] = infection.position;
            });
            this.infectionParamBefore['lock_area'] = JSON.stringify(lock_area);
            this.infectionParamBefore['lock_day'] = this.infectionLockDay;
            for (let key in this.infectionParamBefore) {
              formData_lock.append(key, this.infectionParamBefore[key]);
            }
            this.submitInfectionBefore(formData_lock, true);
          }


        }
        // 传染病人口流动控制模拟
        else if (this.infectionModel === "maddpg") {

          if (Number(this.infectionParamMADDPG["R0"]) < 0) {
            return this.$message.error("传染病基本繁殖数必须大于0");
          }
          if (Number(this.infectionParamMADDPG["Gamma"]) < 0 || Number(this.infectionParamMADDPG["Gamma"]) > 1) {
            return this.$message.error("住院率必须在0~1之间");
          }
          if (Number(this.infectionParamMADDPG["Theta"]) < 0 || Number(this.infectionParamMADDPG["Theta"]) > 1) {
            return this.$message.error("治愈率必须在0~1之间");
          }
          if (Number(this.infectionParamMADDPG["Num"]) < 0) {
            return this.$message.error("初始感染人数必须大于0");
          }

          const loading = this.$loading({
            lock: true,
            text: "仿真环境上传中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });

          // {
          //   loading.close();
          //   this.$message({
          //     message: "仿真环境上传成功",
          //     type: "success",
          //   });
          //   // let port = "8010";
          //   let port = "80";
          //   this.status = {
          //     imgData1: `http://${serverInfo.baseIP}:${port}/tj-httpd/static/Infection/MADDPG/img1.jpg`,
          //     imgData2: `http://${serverInfo.baseIP}:${port}/tj-httpd/static/Infection/MADDPG/img2.jpg`,
          //     imgData3: `http://${serverInfo.baseIP}:${port}/tj-httpd/static/Infection/MADDPG/img3.jpg`,
          //     regionIndex: this.infectionParamMADDPG["Region"],
          //   };
          //   this.drawType = "infection";
          //   this.drawer = true;
          //   return;
          // }
          let formData = new FormData();
          formData.append("filename", this.infectionParamMADDPG["file"][0].raw);
          formData.append("populationFile", this.infectionParamMADDPG["populationFile"][0].raw);
          formData.append("ODfile", this.infectionParamMADDPG["odFile"][0].raw);
          formData.append("R0", this.infectionParamMADDPG["R0"]);
          formData.append("Gamma", this.infectionParamMADDPG["Gamma"]);
          formData.append("Theta", this.infectionParamMADDPG["Theta"]);
          formData.append("Region", this.infectionParamMADDPG["Region"]);
          formData.append("Number", this.infectionParamMADDPG["Number"]);

          let headers = {
            "Content-Type": "application/json",
          };
          const service = axios.create({
            baseURL: serverInfo.baseURL_infection,
            timeout: 16000000
          });
          service
            .post('/MADDPGControl', formData, { headers: headers })
            .then((res) => {
              loading.close();
              this.$message({
                message: "仿真环境上传成功",
                type: "success",
              });
              this.status = {
                imgData1: `data:image/jpg;base64,${res.data.img1}`,
                imgData2: `data:image/jpg;base64,${res.data.img2}`,
                imgData3: `data:image/jpg;base64,${res.data.img3}`,
                regionName: this.infectionParamMADDPG["Region"],
              };
              this.drawType = "infection";
              this.drawer = true;
            })
            .catch((err) => {
              console.log(err);
              loading.close();
              this.$message({
                message: "仿真环境上传失败",
                type: "error",
              });
            });


        }
        // 传染病灾后模拟预测
        else if (this.infectionModel === "after") {

          if (Number(this.infectionParamAfter["I_H_para"]) < 0) {
            return this.$message.error("感染后住院率必须大于0");
          }
          if (Number(this.infectionParamAfter["I_R_para"]) < 0) {
            return this.$message.error("感染后自愈率必须大于0");
          }
          if (Number(this.infectionParamAfter["H_R_para"]) < 0) {
            return this.$message.error("住院后治愈率必须大于0");
          }
          this.infectionParamAfter["city"] = this.area[1];

          const loading = this.$loading({
            lock: true,
            text: "仿真环境上传中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });

          let headers = {
            "Content-Type": "multipart/form-data",
          };
          const service = axios.create({
            baseURL: serverInfo.baseURL_infection,
            timeout: 16000000
          });
          let formData = new FormData();
          for (let key in this.infectionParamAfter) {
            if (key === "file") continue;
            formData.append(key, this.infectionParamAfter[key])
          }
          formData.append("file", this.infectionParamAfter["file"][0].raw);

          service
            .post('/get_DSIHR', formData, { headers: headers })
            .then((res) => {
              loading.close();
              this.$message({
                message: "仿真环境上传成功",
                type: "success",
              });
              this.status = {
                data: res.data,
              };
              this.drawType = "infection";
              this.drawer = true;
            })
            .catch((err) => {
              console.log(err);
              loading.close();
              this.$message({
                message: "仿真环境上传失败",
                type: "error",
              });
            });


        }
        // 传染病模拟效率
        else if (this.infectionModel === "performance") {

          if (Number(this.infectionParamPerformance["Gamma"]) < 0) {
            return this.$message.error("感染后住院率必须大于0");
          }
          if (Number(this.infectionParamPerformance["Theta"]) < 0) {
            return this.$message.error("住院后治愈率必须大于0");
          }
          if (Number(this.infectionParamPerformance["R0"]) < 0) {
            return this.$message.error("R0必须大于0");
          }
          if (Number(this.infectionParamPerformance["start_number"]) < 0) {
            return this.$message.error("初始感染人数必须大于0");
          }

          const loading = this.$loading({
            lock: true,
            text: "传染病模拟效率计算任务提交中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });

          let headers = {
            "Content-Type": "multipart/form-data",
          };
          const service = axios.create({
            baseURL: serverInfo.baseURL_infection,
            timeout: 16000000
          });

          let formData = new FormData();
          this.infectionParamPerformance["city"] = this.area[1];
          for (let key in this.infectionParamPerformance) {
            formData.append(key, this.infectionParamPerformance[key]);
          }

          service
            .post('/efficiencyComparison', formData, { headers: headers })
            .then((res) => {
              loading.close();
              this.$message({
                message: "传染病模拟效率计算任务提交成功",
                type: "success",
              });
              console.log("/efficiencyComparison Res:", res.data);
            })
            .catch((err) => {
              console.log(err);
              loading.close();
              this.$message({
                message: "传染病模拟效率计算任务提交失败",
                type: "error",
              });
            });

        }

      }
      // 危化品爆炸模拟
      else if (this.type === "explode") {
        if (this.roadFiles.length === 0)
          return this.$message.error("请上传路网数据");
        let totalSize = 0;
        this.roadFiles.forEach((file) => {
          totalSize += file.size;
        });
        if (totalSize >= 1073741824) {
          this.$message.error("上传文件总大小不能超过1GB");
          return;
        }
        let checkValues = true;
        if (Number(this.explodeParam.radius) < 0) {
          setTimeout(() => {
            this.$message.error("爆炸范围半径必须大于0");
          }, 100);
          checkValues = false;
        }
        if (Number(this.explodeParam.amplitude) < 0) {
          setTimeout(() => {
            this.$message.error("爆炸幅度必须大于0");
          }, 100);
          checkValues = false;
        }
        if (Number(this.explodeParam.sigma) < 0) {
          setTimeout(() => {
            this.$message.error("高斯方差必须大于0");
          }, 100);
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
        formData.append("city", this.area[1]);
        formData.append("radius", this.explodeParam.radius);
        formData.append("amplitude", this.explodeParam.amplitude);
        formData.append("sigma", this.explodeParam.sigma);
        for (let i = 0; i < this.roadFiles.length; i++) {
          formData.append("roadFiles", this.roadFiles[i].raw);
        }
        for (let i = 0; i < this.stationFiles.length; i++) {
          formData.append("stationFiles", this.stationFiles[i].raw);
        }
        let url = serverInfo.baseURL_explode + "/simulationUpload";
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
            this.getExplodeTaskList();
          })
          .catch((err) => {
            console.log(err);
            loading.close();
            this.$message({
              message: "仿真环境上传失败",
              type: "error",
            });
          });

      }


    },
    // 提交传染病灾前模拟任务
    submitInfectionBefore(formData, useLock) {

      const loading = this.$loading({
        lock: true,
        text: "仿真环境上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let headers = {
        "Content-Type": "multipart/form-data",
      };
      const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
      });

      let url = (useLock) ? 'lock_simulation' : 'grid_simulation';
      service
        .post(url, formData, { headers: headers })
        .then((res) => {
          loading.close();
          if (res.data.status === true) {
            this.$message({
              message: "传染病模拟任务上传成功",
              type: "success",
            });
          }
          else {
            this.$message({
              message: res.data.msg,
              type: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          loading.close();
          this.$message({
            message: "传染病模拟任务上传失败",
            type: "error",
          });
        });

    },
    getTaskList(callback) {
      ajax("/simulation/processes")
        .then((res) => {
          this.tableData = res.map((r) => {
            let simulationTime;
            if (r.simulationState === 'processing') {
              simulationTime = "计算中";
            }
            else {
              simulationTime = (parseInt(r.simulationTime) / 1000).toString() + " 秒";
            }
            return {
              ...r,
              simulationDate: new Date(r.simulationDate).toLocaleString(),
              simulationTime: simulationTime,
            };
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
    async clickTask(task) {

      this.drawType = task.simulationType;

      const loading = this.$loading({
        lock: true,
        text: "获取模拟任务数据中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      console.log("SimulationType:", task.simulationType);
      console.log("Task:", task);

      if (task.simulationType === "flood") {

        const resultTypes = ["submergedcells", "availableroads", "dangerousroads", "submergedroads"];
        const times = ["4", "8", "12", "16", "20", "24"];
        let resCount = 0, resultLens = {};
        resultTypes.forEach((resultType) => {
          resultLens[resultType] = {};
          times.forEach(async (time) => {
            try {
              let len = await ajax(`information/simulation/length/${task.id}/${resultType}/${time}`);
              resultLens[resultType][`${time}`] = len;
              console.log(`获取模拟数据 ${resultType}:${time} 成功！`);
            }
            catch {
              console.log(`获取模拟数据 ${resultType}:${time} 失败！`);
            }
            finally {
              resCount++;
              //所有请求结束
              if (resCount >= resultTypes.length * times.length) {
                this.status = {
                  resultLens: resultLens,
                  date: task.simulationDate,
                  area: task.simulationArea,
                  id: task.id,
                  computeTime: task.simulationTime,
                };
                this.$message({
                  message: "获取模拟任务数据完成",
                  type: "success",
                });
                loading.close();
                this.drawer = true;
              }
            }
          });
        });


      }
      else if (task.simulationType === "infection") {
        // gama
        // this.infectionModel = "gamma";
        // const times = ["0", "12", "24", "36", "48", "60", "72"];
        // let resCount = 0, resultLens = {};
        // times.forEach(async (time) => {
        //   try {
        //     let len = await ajax(`/information/simulation/length/${task.id}/infectcells/${time}`);
        //     resultLens[`${time}`] = len;
        //     console.log(`获取模拟数据 infectcells:${time} 成功！`);
        //   }
        //   catch {
        //     console.log(`获取模拟数据 infectcells:${time} 失败！`);
        //   }
        //   finally {
        //     resCount++;
        //     //所有请求结束
        //     if (resCount >= times.length) {
        //       this.status = {
        //         resultLens: {
        //           "infectcells": resultLens,
        //         },
        //         date: task.simulationDate,
        //         area: task.simulationArea,
        //         id: task.id,
        //         computeTime: task.simulationTime,
        //       };
        //       this.$message({
        //         message: "获取模拟任务数据完成",
        //         type: "success",
        //       });
        //       loading.close();
        //       this.drawer = true;
        //     }
        //   }
        // });
        this.infectionModel = "before";
        this.status = task;
        loading.close();
        this.drawer = true;

      }
      else if (task.simulationType === "explode") {
        this.status = task;
        loading.close();
        this.drawer = true;
      }


    },
    // 上传测度数据文件
    uploadMeasureFiles() {
      let filesLen = 0;
      filesLen += this.roadFiles.length;
      filesLen += this.odFiles.length;
      filesLen += this.hospitalFiles.length;
      filesLen += this.communityFiles.length;
      if (filesLen == 0) return;

      let formData = new FormData();
      for (let i = 0; i < this.roadFiles.length; i++) {
        formData.append("files", this.roadFiles[i].raw);
      }
      for (let i = 0; i < this.hospitalFiles.length; i++) {
        formData.append("files", this.hospitalFiles[i].raw);
      }
      for (let i = 0; i < this.odFiles.length; i++) {
        formData.append("files", this.odFiles[i].raw);
      }
      for (let i = 0; i < this.communityFiles.length; i++) {
        formData.append("files", this.communityFiles[i].raw);
      }
      formData.append("city", this.area[1]);

      let url = serverInfo.baseURL + "/measure/uploadFile";
      let headers = {
        "Content-Type": "multipart/form-data",
      };
      axios
        .post(url, formData, { headers: headers })
        .then((res) => {
          this.$message({
            message: "测度功能相关数据上传成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "测度功能相关数据上传失败",
            type: "error",
          });
        });


    },
    // 生成交通韧性测度计算任务
    requestMeasure() {
      let currentTask = this.tableData[this.tableData.length - 1];

      let formData = new FormData();
      formData.append("id", currentTask.id);
      formData.append("city", currentTask.simulationArea);

      let url = serverInfo.baseURL + "/measure/resilence";
      let headers = {
        "Content-Type": "multipart/form-data",
      };
      axios
        .post(url, formData, { headers: headers })
        .then((res) => {
          if (res.data.success) {
            this.$message({
              message: res.data.data,
              type: "success",
            });
          }
          else {
            this.$message({
              message: res.data.errorMsg,
              type: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "生成交通韧性测度计算任务失败",
            type: "error",
          });
        });
    },
    // 上传城市建筑肌理任务
    uploadResilence() {
      if (this.buildingFiles.length == 0) return;
      let currentTask = this.tableData[this.tableData.length - 1];

      let formData = new FormData();
      formData.append("cityname", currentTask.simulationArea);
      for (let i = 0; i < this.buildingFiles.length; i++) {
        formData.append("files", this.buildingFiles[i].raw);
      }

      let url = serverInfo.baseURL_resilience + "/upload";
      let headers = {
        "Content-Type": "multipart/form-data",
      };
      axios
        .post(url, formData, { headers: headers })
        .then((res) => {
          if (res.data.status) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "生成城市肌理韧性计算任务失败",
            type: "error",
          });
        });
    },
    inquireCityInfectionSimulation(lockType = 0) {

      let headers = {
        "Content-Type": "multipart/form-data",
      };
      const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
      });
      let url;
      if (lockType === 0)
        url = '/inquire_city_simulation_result';
      else if (lockType === 1)
        url = '/inquire_city_simulation_lock_result';
      else if (lockType === 2)
        url = '/query_city_simulation_MADDPG_result';

      function convertTime(time) {
        const items = time.split('_');
        return `${items[0]} ${items[1]}:${items[2]}:${items[3]}`;
      }
      function parseTime(time) {
        const items1 = time.split('_');
        const items2 = items1[0].split('-');
        const items = [...items2, ...items1];
        items.forEach((v, index, arr) => {
          arr[index] = parseInt(v);
        });
        return items;
      }

      service
        .post(url, { headers: headers })
        .then((res) => {
          if (res.data.msg === "success") {
            this.$message({
              message: "传染病模拟任务列表获取成功",
              type: "success",
            });
            res.data.simulation_task.forEach((task) => {
              if (task.simulation_record_num > 0 && task.simulation_record.length > 0) {   // 该城市存在传染病模拟任务
                task.simulation_record.forEach((record) => {
                  record.city = task.city;
                  record.simulationType = "infection";
                  record.simulationTime_str = record.simulation_time;
                  record.simulationTime = convertTime(record.simulation_time);
                  record.lockType = lockType;
                  if (record.task_state === "True")
                    record.status = "finish";
                  else
                    record.status = "processing";
                  this.infectionSimulationList.push(record);
                });
              }

            });
            this.infectionSimulationList.sort((a, b) => {
              const timeItems1 = parseTime(a.simulation_time);
              const timeItems2 = parseTime(b.simulation_time);
              for (let i = 0; i < timeItems1.length; ++i) {
                if (timeItems1[i] !== timeItems2[i]) {
                  return timeItems1[i] - timeItems2[i];
                }
              }
              return 0;
            });
            this.infectionSimulationList.forEach((record, index) => {
              record.id = index + 1;
            });
          }
          else {
            this.$message({
              message: "传染病模拟任务列表获取失败：" + res.data.msg,
              type: "warning",
            });
          }

        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "传染病模拟任务列表获取失败",
            type: "error",
          });
        });
    },
    // 获取初始感染点对话框子组件中的初始感染点列表
    updateInitInfectionList(data) {
      this.initInfectionList = data;
    },
    // 完成初始感染点设置
    finishInitInfection() {
      this.$refs["infectionInput"].finishInitInfection();
      this.showInfectionInput = false;
    },
    // 获取封锁区域对话框子组件中的封锁区域列表
    updateLockInfectionList(data) {
      this.lockInfectionList = data;
    },
    updateInfectionLockDay(day) {
      this.infectionLockDay = day;
    },
    // 完成封锁区域设置
    finishLockInfection() {
      this.$refs["infectionLock"].finishLockInfection();
      this.showInfectionLock = false;
    },
    getExplodeTaskList() {
      let url = serverInfo.baseURL_explode + "/getTaskList";
      axios
        .get(url)
        .then((res) => {
          this.$message({
            message: "获取危化品爆炸模拟任务列表成功",
            type: "success",
          });
          res.data.forEach((item, index, arr) => {
            arr[index]["simulationType"] = "explode";
          });
          res.data.sort((a, b) => { return a.id - b.id });
          this.explodeSimulationList = res.data;
        })
        .catch((err) => {
          console.log(err);
          loading.close();
          this.$message({
            message: "获取危化品爆炸模拟任务列表失败",
            type: "error",
          });
        });
    },
    // 传染病效率：获取城市全部的乡镇街道级名称
    getCityLevelName() {
      let headers = {
        "Content-Type": "multipart/form-data",
      };
      const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000
      });

      let formData = new FormData();
      formData.append("city", "guangzhou");

      service
        .post('/get_city_4_level_name', formData, { headers: headers })
        .then((res) => {
          this.city4LevelNameList = res.data.name_list;
          this.city4LevelNameList.sort((a, b) => a.localeCompare(b));
        })
        .catch((err) => {
          console.log(err);
          console.err("获取城市乡镇街道级名称失败！");
        });

    },
    // 传染病效率：查看对比结果
    showInfectionEfficiency() {

      // this.status = {
      //   data: {
      //     "baseline_run_time": "64.2106032",
      //     "baseline_Isum": [ 1,2,3,4,5,6 ],
      //     "our_model_run_time": "31.1411289",
      //     "our_model_Isum": [ 1,2,3,4,5,6 ],
      //   },
        
      // };
      // this.drawType = "infection";
      // this.drawer = true;
      // return;

      let headers = {
        "Content-Type": "multipart/form-data",
      };
      const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000
      });


      service
        .post('/get_efficiency_result', { headers: headers })
        .then((res) => {
          if (res.data.msg === "false") {
            this.$message({
              message: "没有运行传染病模拟效率计算或未完成计算",
              type: "warning",
            });
          }
          else {
            this.status = {
              data: res.data,
            };
            this.drawType = "infection";
            this.drawer = true;
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "获取传染病模拟效率对比结果失败 " + err,
            type: "error",
          });
        });
    },
    // 传染病切换模拟城市，开始计时
    onChangeInfectionArea(){

      function formaDate(timer) {
          const year = timer.getFullYear()
          const month = timer.getMonth() + 1 // 由于月份从0开始，因此需加1
          const day = timer.getDate()
          const hour = timer.getHours()
          const minute = timer.getMinutes()
          const second = timer.getSeconds()
          return `${pad(year, 4)}-${pad(month)}-${pad(day)}_${pad(hour)}_${pad(minute)}_${pad(second)}`
      }
      function pad(timeEl, total = 2, str = '0') {
          return timeEl.toString().padStart(total, str)
      }

      this.infectionStartTime = new Date();

      let headers = {
        "Content-Type": "multipart/form-data",
      };
      const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000
      });

      let formData = new FormData();
      formData.append("city", this.area[1]);
      formData.append("start_time", formaDate(this.infectionStartTime));

      service
        .post('/get_lock_simulation_start_time', formData, { headers: headers })
        .then((res) => {
          console.log("记录传染病模拟操作开始时间成功！");
        })
        .catch((err) => {
          console.log(err);
          console.err("记录传染病模拟操作开始时间失败！");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
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
