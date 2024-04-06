<template>
  <div class="wen">
    <!--      title="规划选项输入"-->
    <el-dialog
      title="应急规划选项输入"
      :visible.sync="open"
      width="70%"
      append-to-body
      :before-close="close"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <h2>城市</h2>
        <el-form-item label="" prop="cityId">
          <el-select
            v-model="ruleForm.cityId"
            placeholder="请选择城市"
            style="width: 400px"
            filterable
            @change="citySelectChang"
          >
            <el-option
              v-for="dict in cityList"
              :key="dict.id"
              :label="dict.cityName"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <h2>韧性议题</h2>
        <el-form-item label="自然灾害韧性" prop="ziran">
          <el-cascader
            v-model="ruleForm.ziran"
            placeholder="请选择自然灾害韧性"
            :options="ziranList"
            :props="props"
            clearable
            style="width: 400px"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="事故灾害韧性">
          <el-cascader
            v-model="ruleForm.shigu"
            placeholder="请选择事故灾害韧性"
            :options="shiguList"
            :props="props"
            clearable
            style="width: 400px"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="公共卫生韧性" prop="gong">
          <el-cascader
            v-model="ruleForm.gong"
            placeholder="请选择公共卫生韧性"
            :options="gongList"
            :props="props"
            clearable
            style="width: 400px"
          ></el-cascader>
        </el-form-item>
        <h2>韧性目标</h2>
        <div class="cen" style="margin-bottom: 30px">
          <div class="title"></div>
          <div class="title-div">
            <span class="title-span">底线目标（近期）</span
            ><span>保障人民生命健康和财产安全</span>
          </div>
          <div class="title-div">
            <span class="title-span">核心目标</span
            ><span>以人为本，保障居民可获取服务水平</span>
          </div>
          <div class="title-div">
            <span class="title-span">理想目标（远期）</span
            ><span>形成防范长期风险的整体能力</span>
          </div>
        </div>
        <h2>韧性提升措施</h2>
        <el-form-item label="保障重点区域安全">
          <div class="form-items">
            <el-checkbox disabled v-model="ruleForm.checked1"
            >风险点计算
            </el-checkbox
            >
            <el-select
              v-model="ruleForm.anquanp"
              placeholder="请选择风险点选色"
              style="width: 160px"
            >
              <el-option
                v-for="dict in dict.type.point_style"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <div class="all" v-for="(city, i) in youList">
          <el-form-item :label="i == 0 ? '优化核心设施布局' : ''">
            <el-checkbox-group
              v-model="ruleForm.hospital"
              ref="youListRef"
              @change="handleCheckedCitiesChange"
            >
              <div class="form-items">
                <el-checkbox
                  :label="city.value"
                  :key="city.value"
                  :disabled="city.disabled"
                >{{ city.label }}
                </el-checkbox>
                <div>
                  <!--                  <el-input-number v-model="city.pointNum" placeholder="选址点数量" style="width: 160px; margin-left: 10px"></el-input-number>-->
                  <el-select
                    :disabled="city.disabled"
                    v-model="city.styleD"
                    placeholder="请选择选址选色"
                    style="width: 160px; margin-left: 10px"
                  >
                    <el-option
                      v-for="dict in dict.type.point_style"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select
                  >
                  <el-select
                    :disabled="city.disabled"
                    v-model="city.styleY"
                    placeholder="请选择路线选色"
                    style="width: 160px; margin-left: 10px"
                  >
                    <el-option
                      v-for="dict in dict.type.line_style"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </el-checkbox-group>
            <div class="cus" v-if="i == 0" @click="dataFiles('2')">
              <span>参考文件1：</span
              ><span
            >《江苏省城市应急避难场所建设技术标准》DGJ32/J122-2011</span
            >
            </div>
            <div class="cus" v-else-if="i == 1" @click="dataFiles('3')">
              <span>参考文件1：</span
              ><span>《急救中心建设标准》（建标177-2016）</span>
            </div>
          </el-form-item>
        </div>

        <el-form-item label="减少脆弱人群暴露">
          <div class="form-items">
            <el-checkbox v-model="ruleForm.checked2" @change="handJian" :disabled="youList[0].disabled"
            >临时避难安置场所空间布局
            </el-checkbox
            >
            <div>
              <!--              <el-input-number v-model="ruleForm.pointNum" placeholder="选址点数量" style="width: 160px; margin-left: 10px"></el-input-number>-->
              <el-select
                v-model="ruleForm.vaolupoint"
                placeholder="请选择选址选色"
                :disabled="youList[0].disabled"
                style="width: 160px; margin-left: 10px"
              >
                <el-option
                  v-for="dict in dict.type.point_style"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="ruleForm.vaoluline"
                placeholder="请选择路线选色"
                :disabled="youList[0].disabled"
                style="width: 160px; margin-left: 10px"
              >
                <el-option
                  v-for="dict in dict.type.line_style"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <div class="cus2" @click="dataFiles('5')">
          <span>参考文件1：</span
          ><span>《防灾避难场所设计规范》GB51143-2015</span>
        </div>
        <div class="cus2" @click="dataFiles('4')">
          <span>参考文件2：</span
          ><span
        >《广东省人民政府办公厅关于印发广东省应急避护场所建设规划纲要（2013－2020年）》</span
        >
        </div>
        <el-form-item label="应急对策/措施">
          <div class="form-items">
            <!--            @change="handJian"-->
            <el-checkbox v-model="ruleForm.checkedWater" :disabled="youList[0].disabled"
            >排水设施布局
            </el-checkbox
            >
            <div>
              <!--              <el-input-number v-model="ruleForm.pointNum" placeholder="选址点数量" style="width: 160px; margin-left: 10px"></el-input-number>-->
              <el-select
                v-model="ruleForm.waterPoint"
                placeholder="请选择选址选色"
                :disabled="youList[0].disabled"
                style="width: 160px; margin-left: 10px"
              >
                <el-option
                  v-for="dict in dict.type.point_style"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
<!--              <el-select-->
<!--                v-model="ruleForm.waterLine"-->
<!--                placeholder="请选择路线选色"-->
<!--                :disabled="youList[0].disabled"-->
<!--                style="width: 160px; margin-left: 10px"-->
<!--              >-->
<!--                <el-option-->
<!--                  v-for="dict in dict.type.line_style"-->
<!--                  :key="dict.value"-->
<!--                  :label="dict.label"-->
<!--                  :value="dict.value"-->
<!--                ></el-option>-->
<!--              </el-select>-->
            </div>
          </div>
        </el-form-item>
        <el-form-item label="">
          <div class="form-items">
            <!--            @change="handJian"-->
            <el-checkbox v-model="ruleForm.checkedBlast" :disabled="ruleForm.shigu.length == 0"
            >疏散点空间布局
            </el-checkbox
            >
            <div>
              <el-input-number v-model="ruleForm.blastNum" placeholder="爆炸范围" style="width: 160px; margin-left: 10px" :disabled="ruleForm.shigu.length == 0"></el-input-number>
              <el-select
                v-model="ruleForm.blastPoint"
                placeholder="请选择选址选色"
                :disabled="ruleForm.shigu.length == 0"
                style="width: 160px; margin-left: 10px"
              >
                <el-option
                  v-for="dict in dict.type.point_style"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="ruleForm.blastLine"
                placeholder="请选择路线选色"
                :disabled="ruleForm.shigu.length == 0"
                style="width: 160px; margin-left: 10px"
              >
                <el-option
                  v-for="dict in dict.type.line_style"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <h2>居民需求</h2>
        <el-form-item label="生存保障">
          <el-checkbox-group v-model="ruleForm.checkedList1">
            <el-checkbox
              v-for="city in baoList"
              :label="city.value"
              :key="city.value"
              :disabled="checkboxDisabled(ruleForm.checkedList1,city.value)"
              onclick="return false;"
            >{{ city.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="生命健康">
          <el-checkbox-group v-model="ruleForm.checkedList2">
            <el-checkbox
              v-for="city in shengList"
              :label="city.value"
              :key="city.value"
              :disabled="checkboxDisabled(ruleForm.checkedList2,city.value)"
              onclick="return false;"
            >{{ city.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="就业生计">
          <el-checkbox-group v-model="ruleForm.checkedList3">
            <el-checkbox
              v-for="city in jiuList"
              :label="city.value"
              :key="city.value"
              :disabled="checkboxDisabled(ruleForm.checkedList3,city.value)"
              onclick="return false;"
            >{{ city.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="社会交往">
          <el-checkbox-group v-model="ruleForm.checkedList4">
            <el-checkbox
              v-for="city in sheList"
              :label="city.value"
              :key="city.value"
              :disabled="checkboxDisabled(ruleForm.checkedList4,city.value)"
              onclick="return false;"
            >{{ city.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="高效治理">
          <el-checkbox-group v-model="ruleForm.checkedList5">
            <el-checkbox
              v-for="city in gaoList"
              :label="city.value"
              :key="city.value"
              :disabled="checkboxDisabled(ruleForm.checkedList5,city.value)"
              onclick="return false;"
            >{{ city.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!--        <h2>规划决策算法</h2>-->
        <!--        <el-form-item label="">-->
        <!--          <el-checkbox-group v-model="ruleForm.gui">-->
        <!--            <el-checkbox-->
        <!--              :disabled="city.disabled"-->
        <!--              v-for="city in guiList"-->
        <!--              :label="city.value"-->
        <!--              :key="city.value"-->
        <!--            >{{ city.label }}-->
        <!--            </el-checkbox>-->
        <!--          </el-checkbox-group>-->
        <!--        </el-form-item>-->
        <h2>议题场景数据</h2>
        <el-form-item label="暴雨内涝" prop="rainList">
          <el-cascader
            v-model="ruleForm.rainList"
            placeholder="请选择暴雨内涝"
            :options="rainFloodAllList"
            style="width: 400px"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="传染病" prop="contagion">
          <el-cascader
            v-model="ruleForm.contagion"
            placeholder="请选择传染病"
            :options="contagionAllList"
            clearable
            style="width: 400px"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="危险品" prop="contagion">
          <el-cascader
            v-model="ruleForm.planId"
            placeholder="请选择危险品"
            :options="rainFloodList"
            clearable
            style="width: 400px"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="wen"
      :title="datafile.title"
      :visible.sync="dataFileShow"
      width="50%"
      center
      append-to-body
    >
      <img :src="datafile.url" alt="" @click="handStandard()"/>
      <p class="miao">描述：{{ datafile.discription }}</p>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  cityList,
  exportUp,
  invoking,
  dataFile,
  dataScope,
  changeRoleStatus
} from '@/api/decisions/decisions'
// import serverInfo from "@/views/simulator/serverInfo";
import serverInfo from '../../views/simulator/serverInfo'
import request from '@/utils/request'
import mapData from '@/views/simulator/components/mapData'
import axios from 'axios'

export default {
  name: '',
  props: ['open'],
  dicts: [
    'sys_normal_disable',
    'data_type',
    'coverage_style',
    'point_style',
    'line_style'
  ],
  components: {},
  watch: {
    'ruleForm.ziran': {
      handler(val) {
        if (val && val != null && val.length > 0) {
          for (let i = 0; this.youList.length > i; i++) {
            if (this.youList[i].value == 1 || this.youList[i].value == 2) {
              this.youList[i].disabled = false
            }
          }
          this.$forceUpdate()
        } else {
          this.ruleForm.rainList = []
          for (let i = 0; this.youList.length > i; i++) {
            if (this.youList[i].value == 1 || this.youList[i].value == 2) {
              this.youList[i].disabled = true
              this.youList[i].styleD = ''
              this.youList[i].styleY = ''
              this.ruleForm.checked2 = false
              this.ruleForm.vaolupoint = ''
              this.ruleForm.vaoluline = ''
              if (this.list1 && this.list1 != null && this.list1.length > 0) {
                let list = []
                this.list1.forEach(item => {
                  if (item != 1 && item != 2) {
                    list.push(item)
                  }
                })
                this.ruleForm.hospital = list
                this.list1 = list
                this.ruleForm.checkedList1 = []
                this.ruleForm.checkedList2 = []
                if (list.length > 0) {

                  this.ruleForm.checkedList1.push('4')
                  this.ruleForm.checkedList2.push('1')
                  this.ruleForm.checkedList2.push('5')
                }

              }
            }
          }
          this.$forceUpdate()
        }
      },
      deep: true,
      immediate: true
    },
    'ruleForm.gong': {
      handler(val) {
        if (val && val != null && val.length > 0) {
          for (let i = 0; this.youList.length > i; i++) {
            if (this.youList[i].value == 4) {
              this.youList[i].disabled = false
            }
          }
          this.$forceUpdate()
        } else {
          this.ruleForm.contagion = ''
          for (let i = 0; this.youList.length > i; i++) {
            if (this.youList[i].value == 4) {
              this.youList[i].disabled = true
              this.youList[i].styleD = ''
              this.youList[i].styleY = ''
              if (this.list1 && this.list1 != null && this.list1.length > 0) {
                let list = []
                this.list1.forEach(item => {
                  if (item != 4) {
                    list.push(item)
                  }
                })
                this.ruleForm.hospital = list
                this.list1 = list
                // 医院
                if (!list.includes('2')) {

                  this.ruleForm.checkedList2.splice(
                    this.ruleForm.checkedList2.indexOf('1'),
                    1
                  )
                }
                if (this.ruleForm.checked2 == false) {
                  this.ruleForm.checkedList2.splice(
                    this.ruleForm.checkedList2.indexOf('5'),
                    1
                  )
                  this.ruleForm.checkedList1.splice(
                    this.ruleForm.checkedList2.indexOf('4'),
                    1
                  )
                }
              }
            }
          }
          this.$forceUpdate()
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    var validateData = (rule, value, callback) => {
      if ((this.ruleForm.contagion.length == 0 && this.ruleForm.gong.length != 0) || (this.ruleForm.contagion.length != 0 && this.ruleForm.gong.length == 0)) {
        callback(new Error('请选择议题和议题场景数据'))
      } else {
        callback()
      }
    }

    var validateRain = (rule, value, callback) => {
      if ((this.ruleForm.rainList.length != 0 && this.ruleForm.ziran.length == 0) || (this.ruleForm.rainList.length == 0 && this.ruleForm.ziran.length != 0)) {
        callback(new Error('请选择议题和议题场景数据'))
      } else {
        callback()
      }
    }

    var validate = (rule, value, callback) => {
      if (this.ruleForm.ziran.length == 0 && this.ruleForm.gong.length == 0 && this.ruleForm.shigu.length == 0) {
        callback(new Error('请选择自然灾害韧性、事故灾害韧性或公共卫生韧性，其中一个'))
      } else {
        callback()
      }
    }
    return {
      contagionAllList: [
        {
          value: '0',
          label: '模拟数据',
          children: [
            // {
            //   id: 0,                            // 任务ID
            //   value: '2023-07-25_16_27_08',    // 模拟任务提交时间，对应模拟结果的文件夹名字
            //   city: 'guangzhou',
            //   label: '2023-07-25_16_27_08'
            //   // 城市
            // }

          ]
        },
        {
          value: '1',
          label: '上传数据',
          children: [
            {
              label: '0h扩散图层',
              value: '0'
            },
            {
              label: '12h扩散图层',
              value: '12'
            },
            {
              label: '24h扩散图层',
              value: '24'
            },
            {
              label: '36h扩散图层',
              value: '36'
            },
            {
              label: '48h扩散图层',
              value: '48'
            }, {
              label: '60h扩散图层',
              value: '60'
            },
            {
              label: '72h扩散图层',
              value: '72'
            }
          ]
        }
      ],
      rainFloodAllList: [
        {
          value: '0',
          label: '模拟数据',
          children: [
            //   { value: 3,
            //   simulationArea: 'shanghai',
            //   label: '任务',
            //   children: [
            //     // 4、8、12、16、20、24
            //     {
            //       value: 4,
            //       label: '4时'
            //     },
            //     {
            //       value: 8,
            //       label: '8时'
            //     },
            //     {
            //       value: 12,
            //       label: '12时'
            //     },
            //     {
            //       value: 16,
            //       label: '16时'
            //     },
            //     {
            //       value: 20,
            //       label: '20时'
            //     },
            //     {
            //       value: 24,
            //       label: '24时'
            //     }
            //   ]
            // }
          ]
        },
        {
          value: '1',
          label: '上传数据',
          children: [{
            value: '1',
            label: '大雨淹没图层',
            children: [{
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
              }]
          }, {
            value: '2',
            label: '暴雨淹没图层',
            children: [{
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
              }]
          }, {
            value: '3',
            label: '大暴雨淹没图层',
            children: [{
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
              }]
          }, {
            value: '4',
            label: '特大暴雨淹没图层',
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
              }]
          }]
        }
      ],
      props: { multiple: true, emitPath: false, checkStrictly: false },
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      cityList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cityId: '',
        planDecisionName: ''
      },
      // 查询参数
      dataFileShow: false,
      item: {},
      flag: true,
      roleList: [],
      rain: [{
        value: '1',
        label: '大雨淹没图层',
        children: [{
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
          }]
      }, {
        value: '2',
        label: '暴雨淹没图层',
        children: [{
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
          }]
      }, {
        value: '3',
        label: '大暴雨淹没图层',
        children: [{
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
          }]
      }, {
        value: '4',
        label: '特大暴雨淹没图层',
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
          }]
      }],
      contagion: [
        {
          label: '0h扩散图层',
          value: '0'
        },
        {
          label: '12h扩散图层',
          value: '12'
        },
        {
          label: '24h扩散图层',
          value: '24'
        },
        {
          label: '36h扩散图层',
          value: '36'
        },
        {
          label: '48h扩散图层',
          value: '48'
        }, {
          label: '60h扩散图层',
          value: '60'
        },
        {
          label: '72h扩散图层',
          value: '72'
        }
      ],
      ziranList: [
        {
          label: '暴雨内涝',
          value: '1'
        },
        {
          label: '海平面上升',
          value: '2',
          disabled: true
        },
        {
          label: '风暴潮洪',
          value: '3',
          disabled: true
        },
        {
          label: '极端气温',
          value: '4',
          disabled: true
        },
        {
          label: '地质灾害',
          value: '5',
          disabled: true
        }
      ],
      shiguList: [
        {
          label: '危化品爆炸',
          value: '1',
          disabled: false
        },
        {
          label: '危化品泄露',
          value: '2',
          disabled: true
        },
        {
          label: '设施安全事故',
          value: '3',
          disabled: true
        }
      ],
      gongList: [
        {
          label: '传染病',
          value: '1'
        }
      ],
      baoList: [
        {
          label: '空气、水系统',
          value: '1',
          checked: true
        },
        {
          label: '食物供应系统',
          value: '2',
          checked: false
        },
        {
          label: '能源系统',
          value: '3',
          checked: true
        },
        {
          label: '道路交通系统',
          value: '4',
          checked: false
        },
        {
          label: '通讯信息系统',
          value: '5',
          checked: true
        },
        {
          label: '高层建筑、避难场所',
          value: '6',
          checked: false
        },
        {
          label: '救灾物资仓库',
          value: '7',
          checked: false
        },
        {
          label: '消防、军事建筑',
          value: '8',
          checked: true
        }
      ],
      shengList: [
        {
          label: '医院',
          value: '1',
          checked: false
        },
        {
          label: '社区卫生所',
          value: '2',
          checked: false
        },
        {
          label: '污水处理厂',
          value: '3',
          checked: true
        },
        {
          label: '废弃物处理厂',
          value: '4',
          checked: true
        },
        {
          label: '公园绿地',
          value: '5',
          checked: false
        },
        {
          label: '河湖水系',
          value: '6',
          checked: true
        }
      ],
      jiuList: [
        {
          label: '产业布局',
          value: '1',
          checked: true
        },
        {
          label: '经济结构',
          value: '2',
          checked: true
        }
      ],
      sheList: [
        {
          label: '社交网络',
          value: '1',
          checked: true
        },
        {
          label: '弱势群体',
          value: '2',
          checked: true
        }
      ],
      gaoList: [
        {
          label: '风险管理机制',
          value: '1',
          checked: true,
          disabled: true
        },
        {
          label: '行政管理机制',
          value: '2',
          checked: true,
          disabled: true
        }
      ],
      youList: [
        {
          label: '应急物资储备库空间布局',
          value: '1',
          checked: false,
          styleD: '',
          styleY: '',
          disabled: false,
          pointNum: undefined
        },
        {
          label: '急救站空间布局',
          value: '2',
          checked: false,
          styleD: '',
          styleY: '',
          disabled: false,
          pointNum: undefined
        },
        // {
        //   label: '核酸采样点空间布局',
        //   value: '3',
        //   checked: false,
        //   styleD: '',
        //   styleY: '',
        //   disabled: true,
        //   pointNum: undefined
        // },
        {
          label: '方舱医院空间布局',
          value: '4',
          checked: false,
          styleD: '',
          styleY: '',
          disabled: false,
          pointNum: undefined
        }
      ],
      guiList: [
        {
          label: '智能决策算法',
          value: '1',
          checked: true,
          disabled: true
        },
        {
          label: '穷举算法',
          value: '2',
          checked: false,
          disabled: true
        }
      ],
      datafile: {},
      id: '',
      ruleForm: {
        planId: '',
        cityId: '',
        cityName: '',
        ziran: [],
        shigu: [],
        gong: [],
        gui: ['1'],
        list1: [],
        list2: [],
        checkedList1: [],
        checkedList2: [],
        checkedList3: [],
        checkedList4: [],
        checkedList5: [],
        hospital: [],
        checked1: true,
        checked2: false,
        checkedWater: false,
        waterPoint: '',
        waterLine: '',
        blastNum: undefined,
        blastPoint: '',
        blastLine: '',
        checkedBlast: false,
        // pointNum: this.ruleForm.pointNum

        anquanp: '',
        vaolupoint: '',
        vaoluline: '',
        rainList: [],
        contagion: '',
        diffusionLevel: '',
        pointNum: undefined
      },
      rules: {
        cityId: [
          { required: true, message: '请输入城市名称', trigger: 'change' }
        ],
        ziran: [{ validator: validate, trigger: 'change' }],
        gong: [{ validator: validate, trigger: 'change' }],
        rainList: [{ validator: validateRain, trigger: 'change' }],
        contagion: [{ validator: validateData, trigger: 'change' }]
      },
      // 表单参数
      form: {},
      rainFloodList: [
        // {
        //   value: 3,
        //   simulationArea: 'shanghai',
        //   label: '任务',
        //   children: [
        //     // 4、8、12、16、20、24
        //     {
        //       value: 4,
        //       label: '4时'
        //     },
        //     {
        //       value: 8,
        //       label: '8时'
        //     },
        //     {
        //       value: 12,
        //       label: '12时'
        //     },
        //     {
        //       value: 16,
        //       label: '16时'
        //     },
        //     {
        //       value: 20,
        //       label: '20时'
        //     },
        //     {
        //       value: 24,
        //       label: '24时'
        //     }
        //   ]
        // }
      ],
      taskIds: [
        // {
        //   id: 0,                            // 任务ID
        //   value: '2023-07-25_16_27_08',    // 模拟任务提交时间，对应模拟结果的文件夹名字
        //   city: 'guangzhou',
        //   label: '2023-07-25_16_27_08'
        //   // 城市
        // }
      ],
      rainFloodOldList: [],
      taskOldIds: []
    }
  },
  computed: {},

  created() {
    this.cityLists()
  },
  mounted() {
    this.getTaskIdList()
    this.getFloodTaskIdList()
  },
  methods: {
    citySelectChang(e) {
      this.ruleForm.contagion = ''
      this.ruleForm.rainList = []

      this.rainFloodList = []
      this.taskIds = []
      let cityCode = ''
      let cityName = ''

      this.cityList.forEach(item => {
        if (item.id == e) {
          cityCode = item.cityCode
          cityName = item.cityName
        }
      })
      this.rainFloodOldList.forEach(item => {
        if(! item.simulationArea in mapData)  return
        item.cityName = mapData[item.simulationArea].cityName + "市"
        if (cityName === item.cityName ) {
          let listItem = {
            value: item.id,
            label: `${cityName}-${item.name}-${item.id}`,
            planId: item.planid,
            children: [
              // 4、8、12、16、20、24
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
          this.rainFloodList.push(listItem)
        }
      })

      this.rainFloodAllList[0].children = this.rainFloodList
      // 处理传染病模拟任务
      this.taskOldIds.forEach(item => {
        if(! item.city in mapData)  return
        item.cityName = mapData[item.city].cityName + "市"
        if (cityName === item.cityName ) {
          const simulation_types = {'none_type':'无管控措施', 'lock_type':'人为管控措施', 'MADDPG_type':'强化学习管控措施'};
          let listItem = {
            value: item.simulation_time,
            label: `${cityName}-${simulation_types[item.simulationType]}-${item.simulation_time}`
          }
          this.taskIds.push(listItem)
        }
      })

      this.contagionAllList[0].children = this.taskIds
    },
    // 获取洪涝模拟任务列表
    getFloodTaskIdList() {
      axios.get(serverInfo.baseURL + '/simulation/processes')
      .then(res => {
        this.rainFloodOldList = res.data
      })
    },
    // 获取传染病模拟任务列表
    getTaskIdList() {
      axios.get(serverInfo.baseURL_infection + '/get_simulation_result_list')
      .then(res => {
        this.taskOldIds = res.data.result_list
      })
    },
    // 判断军民需求，选择框样式
    checkboxDisabled(list, value) {
      return list.indexOf(value) < 0
    },
    close() {
      this.$emit('close')
    },
    handJian(value) {
      this.list2 = value
      if (value) {
        if (!this.ruleForm.checkedList1.includes('4')) {
          this.ruleForm.checkedList1.push('4')
        }
        if (!this.ruleForm.checkedList1.includes('6')) {
          this.ruleForm.checkedList1.push('6')
        }
        if (!this.ruleForm.checkedList2.includes('5')) {
          this.ruleForm.checkedList2.push('5')
        }
      } else {
        if (this.ruleForm.checkedList1.indexOf('4') !== -1 && (!this.list1 || this.list1.length == 0 || (!this.list1.includes('2') && !this.list1.includes('3') && !this.list1.includes('4')))) {
          this.ruleForm.checkedList1.splice(
            this.ruleForm.checkedList1.indexOf('4'),
            1
          )
        }
        if (this.ruleForm.checkedList1.indexOf('6') !== -1) {
          this.ruleForm.checkedList1.splice(
            this.ruleForm.checkedList1.indexOf('6'),
            1
          )
        }

        if (this.ruleForm.checkedList2.indexOf('5') !== -1 && (!this.list1 || this.list1.length == 0 || (!this.list1.includes('3') && !this.list1.includes('4')))) {
          this.ruleForm.checkedList2.splice(
            this.ruleForm.checkedList2.indexOf('5'),
            1
          )
        }
      }
    },
    handleCheckedCitiesChange(value) {
      this.list1 = value
      if (value.includes('1')) {
        if (!this.ruleForm.checkedList1.includes('2')) {
          this.ruleForm.checkedList1.push('2')
        }
        if (!this.ruleForm.checkedList1.includes('7')) {
          this.ruleForm.checkedList1.push('7')
        }
      } else {
        if (this.ruleForm.checkedList1.indexOf('2') !== -1) {
          this.ruleForm.checkedList1.splice(
            this.ruleForm.checkedList1.indexOf('2'),
            1
          )
        }
        if (this.ruleForm.checkedList1.indexOf('7') !== -1) {
          this.ruleForm.checkedList1.splice(
            this.ruleForm.checkedList1.indexOf('7'),
            1
          )
        }
      }

      if (value.includes('2')) {
        if (!this.ruleForm.checkedList1.includes('4')) {
          this.ruleForm.checkedList1.push('4')
        }
        if (!this.ruleForm.checkedList2.includes('1')) {
          this.ruleForm.checkedList2.push('1')
        }
        if (!this.ruleForm.checkedList2.includes('2')) {
          this.ruleForm.checkedList2.push('2')
        }
      } else {
        if (this.ruleForm.checkedList1.indexOf('4') !== -1 && !value.includes('3') && !value.includes('4') && (!this.list2 || this.list2.length == 0 || !this.list2)) {
          this.ruleForm.checkedList1.splice(
            this.ruleForm.checkedList1.indexOf('4'),
            1
          )
        }
        if (this.ruleForm.checkedList2.indexOf('1') !== -1 && !value.includes('3')) {
          this.ruleForm.checkedList2.splice(
            this.ruleForm.checkedList2.indexOf('1'),
            1
          )
        }
        if (this.ruleForm.checkedList2.indexOf('2') !== -1 && !value.includes('4')) {
          this.ruleForm.checkedList2.splice(
            this.ruleForm.checkedList2.indexOf('2'),
            1
          )
        }
      }

      if (value.includes('3')) {
        if (!this.ruleForm.checkedList1.includes('4')) {
          this.ruleForm.checkedList1.push('4')
        }
        if (!this.ruleForm.checkedList2.includes('1')) {
          this.ruleForm.checkedList2.push('1')
        }
        if (!this.ruleForm.checkedList2.includes('2')) {
          this.ruleForm.checkedList2.push('2')
        }
        if (!this.ruleForm.checkedList2.includes('5')) {
          this.ruleForm.checkedList2.push('5')
        }
      } else {
        if (this.ruleForm.checkedList1.indexOf('4') !== -1 && !value.includes('2') && !value.includes('4') && (this.list2.length == 0 || !this.list2)) {
          this.ruleForm.checkedList1.splice(
            this.ruleForm.checkedList1.indexOf('4'),
            1
          )
        }
        if (this.ruleForm.checkedList2.indexOf('1') !== -1 && !value.includes('2') && !value.includes('4')) {
          this.ruleForm.checkedList2.splice(
            this.ruleForm.checkedList2.indexOf('1'),
            1
          )
        }
        if (this.ruleForm.checkedList2.indexOf('2') !== -1 && !value.includes('2')) {
          this.ruleForm.checkedList2.splice(
            this.ruleForm.checkedList2.indexOf('2'),
            1
          )
        }
        if (this.ruleForm.checkedList2.indexOf('5') !== -1 && !value.includes('4') && (!this.list2 || this.list2.length == 0 || !this.list2)) {
          this.ruleForm.checkedList2.splice(
            this.ruleForm.checkedList2.indexOf('5'),
            1
          )
        }
      }

      if (value.includes('4')) {
        if (!this.ruleForm.checkedList1.includes('4')) {
          this.ruleForm.checkedList1.push('4')
        }
        if (!this.ruleForm.checkedList2.includes('1')) {
          this.ruleForm.checkedList2.push('1')
        }
        if (!this.ruleForm.checkedList2.includes('5')) {
          this.ruleForm.checkedList2.push('5')
        }
      } else {
        if (this.ruleForm.checkedList1.indexOf('4') !== -1 && !value.includes('3') && !value.includes('2') && (this.list2.length == 0 || !this.list2)) {
          this.ruleForm.checkedList1.splice(
            this.ruleForm.checkedList1.indexOf('4'),
            1
          )
        }
        if (this.ruleForm.checkedList2.indexOf('1') !== -1 && !value.includes('3') && !value.includes('2')) {
          this.ruleForm.checkedList2.splice(
            this.ruleForm.checkedList2.indexOf('1'),
            1
          )
        }
        if (this.ruleForm.checkedList2.indexOf('5') !== -1 && !value.includes('3') && (this.list2.length == 0 || !this.list2)) {
          this.ruleForm.checkedList2.splice(
            this.ruleForm.checkedList2.indexOf('5'),
            1
          )
        }
      }

    },
    handStandard() {
      // this.$router.push({
      //   path: "/platform/standard",
      //   query: { id: this.datafile.standardId },
      // });

      this.$router.push({
        path: '/platform/planning',
        query: { id: this.datafile.standardId }
      })
    },
    async dataFiles(val) {
      this.id = val
      const data = await dataFile(val)
      if (data.code == 200) {
        this.dataFileShow = true
        this.datafile = data.data

        let list = JSON.parse(this.datafile.attachment).map((item) => {
          item.urls = process.env.VUE_APP_BASE_API + item.url
          return item
        })
        this.datafile.url = list[0].urls
      } else {
        this.$message.warning(data.msg)
      }
    },
    submit() {
      if (this.ruleForm.cityId == null || this.ruleForm.cityId == '') {
        this.$message.error('请选择城市')
        return
      }
      // this.ruleForm.contagion
      // if (!this.ruleForm.contagion || this.ruleForm.cityId == '') {
      //   this.$message.error("请选择城市")
      //   return
      // }
      // this.ruleForm.rainList
      // if (this.ruleForm.cityId == null || this.ruleForm.cityId == '') {
      //   this.$message.error("请选择城市")
      //   return
      // }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.handUp()
        }
      })
    },
    async handUp() {
      const loading = this.$loading({
        lock: true,
        customClass: 'create-isLoading', // *这里设置他的class名称,这里最重要
        text: '数据加载中...请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      let index = this.cityList.findIndex(
        (val) => val.id == this.ruleForm.cityId
      )
      let list = []
      list.push(
        {
          name: '风险点计算',
          status: this.ruleForm.checked1 ? '1' : '2',
          point: this.ruleForm.anquanp,
          line: ''
        },
        {
          name: '临时避难安置场所空间布局',
          status: this.ruleForm.checked2 ? '1' : '2',
          point: this.ruleForm.vaolupoint,
          line: this.ruleForm.vaoluline,
          pointNum: this.ruleForm.pointNum
        },
        {
          name: '排水设施布局',
          status: this.ruleForm.checkedWater ? '1' : '2',
          point: this.ruleForm.waterPoint,
          // line: this.ruleForm.waterLine,
          pointNum: this.ruleForm.pointNum
        },
        {
          name: '疏散点空间布局',
          status: this.ruleForm.checkedBlast ? '1' : '2',
          point: this.ruleForm.blastPoint,
          line: this.ruleForm.blastLine,
          pointNum: this.ruleForm.blastNum
        },
      )
      if (this.ruleForm.hospital.includes('1')) {
        this.youList[0].checked = true
      }
      if (this.ruleForm.hospital.includes('2')) {
        this.youList[1].checked = true
      }
      if (this.ruleForm.hospital.includes('3')) {
        this.youList[2].checked = true
      }
      if (this.ruleForm.hospital.includes('4')) {
        this.youList[3].checked = true
      }
      this.youList.forEach((val) => {
        list.push({
          name: val.label,
          status: val.checked ? '1' : '2',
          point: val.styleD,
          line: val.styleY,
          pointNum: val.pointNum
        })
      })

      let form = {
        typeName: '',
        cityId: this.ruleForm.cityId, // 城市id
        cityName: this.cityList[index].cityName, // 城市名称
        natural: this.ruleForm.ziran, // 自然灾害韧性
        accident: this.ruleForm.shigu, // 事故灾害韧性
        sanitation: this.ruleForm.gong, // 公共卫生韧性
        list, // 措施列表(急救站选择，应急物资供应点选址等)
        rain: this.ruleForm.rainList && this.ruleForm.rainList.length > 0 ? this.ruleForm.rainList[1] : '', // 暴雨等级
        rainTime: this.ruleForm.rainList && this.ruleForm.rainList.length > 0 ? this.ruleForm.rainList[2] : '', // 暴雨时刻
        contagion: this.ruleForm.contagion && this.ruleForm.contagion.length > 0 ? this.ruleForm.contagion[1] : '', // 传染病扩散时刻
        taskId: this.ruleForm.taskId,
        planId: ''
        // diffusionLevel: this.ruleForm.contagion && this.ruleForm.contagion.length > 0 ? this.ruleForm.contagion[0] : ''
      }

      this.rainFloodList.forEach(item => {
        if(item.id = this.ruleForm.taskId) {
          form.planId = item.planId
        }
      })


      console.log('this.ruleForm.rainList', this.ruleForm.rainList)

      if (this.ruleForm.rainList && this.ruleForm.rainList.length > 0 && this.ruleForm.rainList[0] == 1) {
        let childrenList = this.rainFloodAllList[1].children
        childrenList.forEach(item => {
          if (item.value == form.rain) {
            form.typeName = item.label
          }

        })

      } else if (this.ruleForm.rainList && this.ruleForm.rainList.length > 0 && this.ruleForm.rainList[0] == 0) {
        this.rainFloodList.forEach(item => {
          if (item.value == form.rain) {
            form.typeName = item.label
          }
        })
      }
//       console.log("form", form)
//     return
      const data = await invoking(form)
      loading.close()
      if (data.code == 200) {
        this.ruleForm = {
          cityId: '',
          cityName: '',
          ziran: [],
          shigu: [],
          gong: [],
          checkedList1: [],
          checkedList2: [],
          checkedList3: [],
          checkedList4: [],
          checkedList5: [],
          hospital: [],
          checked1: true,
          checked2: false,
          checkedWater: false,
          blastNum: undefined,
          blastPoint: '',
          blastLine: '',
          checkedBlast: false,
          anquanp: '',
          vaolupoint: '',
          waterPoint: '',
          vaoluline: '',
          rainList: [],
          contagion: '',
          pointNum: undefined
        };
        (this.youList = [
          {
            label: '应急物资储备库空间布局',
            value: '1',
            checked: false,
            styleD: '',
            styleY: '',
            pointNum: ''
          },
          {
            label: '急救站空间布局',
            value: '2',
            checked: false,
            styleD: '',
            styleY: '',
            pointNum: ''
          },
          // {
          //   label: '核酸采样点空间布局',
          //   value: '3',
          //   checked: false,
          //   styleD: '',
          //   styleY: '',
          //   pointNum: ''
          // },
          {
            label: '方舱医院空间布局',
            value: '4',
            checked: false,
            styleD: '',
            styleY: '',
            pointNum: ''
          }
        ]),
          this.$emit('close')

        this.$modal.msgSuccess('算法调用中，请稍后刷新页面！')
      } else {
        this.$message.error(data.msg)
      }
    },
    handleexportUp(row) {
      exportUp({ id: row.id }).then((response) => {
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        const link = document.createElement('a')
        document.body.appendChild(link)
        link.href = window.URL.createObjectURL(blob)
        link.download = '规划决策分析数据.xlsx'
        link.click()
      })
    },
    async cityLists() {
      const data = await cityList()
      this.cityList = data
    }
  }
}
</script>

<style lang="scss" scoped>
.all {
  .cus {
    color: #999999;
    line-height: 20px;
    cursor: pointer;

    &:hover {
      color: rgb(64, 158, 255);
    }
  }
}

.wen {
  ::v-deep.el-dialog {
    .el-dialog__header {
      padding: 50px 20px 20px !important;
    }
  }
}

.form-items {
  display: flex;
  justify-content: space-between;
}

.cus2 {
  color: #999999;
  padding-left: 130px;
  cursor: pointer;

  &:hover {
    color: rgb(64, 158, 255);
  }
}

.cen {
  color: #606266;
  padding-left: 130px;
}

.miao {
  color: #000;
}

.title {
  margin: 30px 0 15px 0;
  font-size: 16px;
}

.title-div {
  font-size: 14px;

  .title-span {
    font-size: 16px;
    display: inline-block;
    width: 180px;
    font-weight: 500;
  }
}
</style>
<style>
.create-isLoading .el-loading-spinner i {
  font-size: 50px !important;
}

.el-loading-spinner .el-loading-text {
  font-size: 20px !important;
  font-weight: 600;
}
</style>
