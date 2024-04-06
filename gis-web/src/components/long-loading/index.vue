<template>
  <div class="wen">
    <!--      title="规划选项输入"-->
    <el-dialog
      title="长期规划选项输入"
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
        <!--        <h2>韧性议题</h2>-->
        <!--        <el-form-item label="自然灾害韧性" prop="ziran">-->
        <!--          <el-cascader-->
        <!--            v-model="ruleForm.ziran"-->
        <!--            placeholder="请选择自然灾害韧性"-->
        <!--            :options="ziranList"-->
        <!--            :props="props"-->
        <!--            clearable-->
        <!--            style="width: 400px"-->
        <!--          ></el-cascader>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="事故灾害韧性">-->
        <!--          <el-cascader-->
        <!--            v-model="ruleForm.shigu"-->
        <!--            placeholder="请选择事故灾害韧性"-->
        <!--            :options="shiguList"-->
        <!--            :props="props"-->
        <!--            clearable-->
        <!--            style="width: 400px"-->
        <!--          ></el-cascader>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="公共卫生韧性" prop="gong">-->
        <!--          <el-cascader-->
        <!--            v-model="ruleForm.gong"-->
        <!--            placeholder="请选择公共卫生韧性"-->
        <!--            :options="gongList"-->
        <!--            :props="props"-->
        <!--            clearable-->
        <!--            style="width: 400px"-->
        <!--          ></el-cascader>-->
        <!--        </el-form-item>-->
        <!--        <h2>韧性目标</h2>-->
        <!--        <div class="cen" style="margin-bottom: 30px">-->
        <!--          <div class="title"></div>-->
        <!--          <div class="title-div">-->
        <!--            <span class="title-span">底线目标（近期）</span-->
        <!--            ><span>保障人民生命健康和财产安全</span>-->
        <!--          </div>-->
        <!--          <div class="title-div">-->
        <!--            <span class="title-span">核心目标</span-->
        <!--            ><span>以人为本，保障居民可获取服务水平</span>-->
        <!--          </div>-->
        <!--          <div class="title-div">-->
        <!--            <span class="title-span">理想目标（远期）</span-->
        <!--            ><span>形成防范长期风险的整体能力</span>-->
        <!--          </div>-->
        <!--        </div>-->
        <h2>韧性提升措施</h2>
        <el-form-item label="保障重点区域安全">
          <div class="form-items">
            <el-checkbox disabled v-model="ruleForm.checked1"
            >需求点计算
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
          <el-form-item :label="i == 0 ? '长期规划设施布局' : ''">
            <el-checkbox-group
              v-model="ruleForm.hospital"
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
            <!--            <div class="cus" v-if="i == 0" @click="dataFiles('2')">-->
            <!--              <span>参考文件1：</span-->
            <!--              ><span-->
            <!--            >《江苏省城市应急避难场所建设技术标准》DGJ32/J122-2011</span-->
            <!--            >-->
            <!--            </div>-->
            <!--            <div class="cus" v-else-if="i == 1" @click="dataFiles('3')">-->
            <!--              <span>参考文件1：</span-->
            <!--              ><span>《急救中心建设标准》（建标177-2016）</span>-->
            <!--            </div>-->
          </el-form-item>
        </div>

        <!--        <el-form-item label="减少脆弱人群暴露">-->
        <!--          <div class="form-items">-->
        <!--            <el-checkbox v-model="ruleForm.checked2" @change="handJian"-->
        <!--            >临时避难安置场所选址-->
        <!--            </el-checkbox-->
        <!--            >-->
        <!--            <div>-->
        <!--              &lt;!&ndash;              <el-input-number v-model="ruleForm.pointNum" placeholder="选址点数量" style="width: 160px; margin-left: 10px"></el-input-number>&ndash;&gt;-->
        <!--              <el-select-->
        <!--                v-model="ruleForm.vaolupoint"-->
        <!--                placeholder="请选择选址选色"-->
        <!--                style="width: 160px; margin-left: 10px"-->
        <!--              >-->
        <!--                <el-option-->
        <!--                  v-for="dict in dict.type.point_style"-->
        <!--                  :key="dict.value"-->
        <!--                  :label="dict.label"-->
        <!--                  :value="dict.value"-->
        <!--                ></el-option>-->
        <!--              </el-select>-->
        <!--              <el-select-->
        <!--                v-model="ruleForm.vaoluline"-->
        <!--                placeholder="请选择路线选色"-->
        <!--                style="width: 160px; margin-left: 10px"-->
        <!--              >-->
        <!--                <el-option-->
        <!--                  v-for="dict in dict.type.line_style"-->
        <!--                  :key="dict.value"-->
        <!--                  :label="dict.label"-->
        <!--                  :value="dict.value"-->
        <!--                ></el-option>-->
        <!--              </el-select>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <!--        <div class="cus2" @click="dataFiles('5')">-->
        <!--          <span>参考文件1：</span-->
        <!--          ><span>《防灾避难场所设计规范》GB51143-2015</span>-->
        <!--        </div>-->
        <!--        <div class="cus2" @click="dataFiles('4')">-->
        <!--          <span>参考文件2：</span-->
        <!--          ><span-->
        <!--        >《广东省人民政府办公厅关于印发广东省应急避护场所建设规划纲要（2013－2020年）》</span-->
        <!--        >-->
        <!--        </div>-->


        <!--        <h2>居民需求</h2>-->
        <!--        <el-form-item label="生存保障">-->
        <!--          <el-checkbox-group v-model="ruleForm.checkedList1">-->
        <!--            <el-checkbox-->
        <!--              v-for="city in baoList"-->
        <!--              :label="city.value"-->
        <!--              :key="city.value"-->
        <!--              :disabled="checkboxDisabled(ruleForm.checkedList1,city.value)"-->
        <!--              onclick="return false;"-->
        <!--            >{{ city.label }}-->
        <!--            </el-checkbox>-->
        <!--          </el-checkbox-group>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="生命健康">-->
        <!--          <el-checkbox-group v-model="ruleForm.checkedList2">-->
        <!--            <el-checkbox-->
        <!--              v-for="city in shengList"-->
        <!--              :label="city.value"-->
        <!--              :key="city.value"-->
        <!--              :disabled="checkboxDisabled(ruleForm.checkedList2,city.value)"-->
        <!--              onclick="return false;"-->
        <!--            >{{ city.label }}-->
        <!--            </el-checkbox>-->
        <!--          </el-checkbox-group>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="就业生计">-->
        <!--          <el-checkbox-group v-model="ruleForm.checkedList3">-->
        <!--            <el-checkbox-->
        <!--              v-for="city in jiuList"-->
        <!--              :label="city.value"-->
        <!--              :key="city.value"-->
        <!--              :disabled="checkboxDisabled(ruleForm.checkedList3,city.value)"-->
        <!--              onclick="return false;"-->
        <!--            >{{ city.label }}-->
        <!--            </el-checkbox>-->
        <!--          </el-checkbox-group>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="社会交往">-->
        <!--          <el-checkbox-group v-model="ruleForm.checkedList4">-->
        <!--            <el-checkbox-->
        <!--              v-for="city in sheList"-->
        <!--              :label="city.value"-->
        <!--              :key="city.value"-->
        <!--              :disabled="checkboxDisabled(ruleForm.checkedList4,city.value)"-->
        <!--              onclick="return false;"-->
        <!--            >{{ city.label }}-->
        <!--            </el-checkbox>-->
        <!--          </el-checkbox-group>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="高效治理">-->
        <!--          <el-checkbox-group v-model="ruleForm.checkedList5">-->
        <!--            <el-checkbox-->
        <!--              v-for="city in gaoList"-->
        <!--              :label="city.value"-->
        <!--              :key="city.value"-->
        <!--              :disabled="checkboxDisabled(ruleForm.checkedList5,city.value)"-->
        <!--              onclick="return false;"-->
        <!--            >{{ city.label }}-->
        <!--            </el-checkbox>-->
        <!--          </el-checkbox-group>-->
        <!--        </el-form-item>-->
        <h2>议题场景数据</h2>
        <el-form-item label="任务ID" prop="rainList">
          <el-cascader
            v-model="ruleForm.rainList"
            placeholder="请选择任务ID"
            :options="rainFloodList"
            style="width: 400px"
            clearable
          ></el-cascader>
        </el-form-item>
        <!--        <el-form-item label="传染病" prop="contagion">-->
        <!--          <el-cascader-->
        <!--            v-model="ruleForm.contagion"-->
        <!--            placeholder="请选择传染病"-->
        <!--            :options="contagionAllList"-->
        <!--            clearable-->
        <!--            style="width: 400px"-->
        <!--          ></el-cascader>-->
        <!--        </el-form-item>-->
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
  longInvokingForLocal,
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
      if (this.ruleForm.ziran.length == 0 && this.ruleForm.gong.length == 0) {
        callback(new Error('请选择自然灾害韧性或公共卫生韧性，其中一个'))
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
        }
        // {
        //   value: '1',
        //   label: '上传数据',
        //   children: [
        //     {
        //       label: '0h扩散图层',
        //       value: '0'
        //     },
        //     {
        //       label: '12h扩散图层',
        //       value: '12'
        //     },
        //     {
        //       label: '24h扩散图层',
        //       value: '24'
        //     },
        //     {
        //       label: '36h扩散图层',
        //       value: '36'
        //     },
        //     {
        //       label: '48h扩散图层',
        //       value: '48'
        //     }, {
        //       label: '60h扩散图层',
        //       value: '60'
        //     },
        //     {
        //       label: '72h扩散图层',
        //       value: '72'
        //     }
        //   ]
        // }
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
          disabled: true
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
          label: '医院',
          value: '1',
          checked: false,
          styleD: '',
          styleY: '',
          pointNum: ''
        },
        {
          label: '学校',
          value: '2',
          checked: false,
          styleD: '',
          styleY: '',
          pointNum: ''
        },
        {
          label: '就业中心',
          value: '3',
          checked: false,
          styleD: '',
          styleY: '',
          pointNum: ''
        },
        {
          label: '商场',
          value: '4',
          checked: false,
          styleD: '',
          styleY: '',
          pointNum: ''
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
        // rainList: [{ validator: validateRain, trigger: 'change' }],
        // contagion: [{ validator: validateData, trigger: 'change' }]
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
      taskOldIds: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.cityLists()
  },
  mounted() {
    // this.getTaskIdList()
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

      // 获取该城市的规划方案列表
      let planList = {
        0: '城市现状底图'
      };
      axios.get(serverInfo.baseURL + `/measure/selectPlan?city=${cityCode}&mapname=now`)
      .then(res => {
        try{
          res.data.forEach((item)=>{
            planList[item.planid] = item.planname
          })
        }
        catch{
          console.error("获取规划方案失败！")
        }
        
        // 处理洪涝模拟任务
        for(let planid in planList){
          const planName = planList[planid];
          this.rainFloodOldList.forEach(item => {
            if(! item.simulationArea in mapData)  return
            item.cityName = mapData[item.city].cityName + "市"
            if (cityName === item.cityName ) {
                let label = `${cityName}-"${planName}"-${item.taskid}号任务`
                if(item.taskid === 0)
                  label = `${cityName}-"${planName}"-常态`
                let listItem = {
                  value: `${planid}-${item.taskid}`,
                  label: label,
                  planId: planid,
                  taskid: item.taskid,
                }
                this.rainFloodList.push(listItem)
            }
          })
          }

        // 去重
        this.rainFloodList = Array.from(new Set(this.rainFloodList.map(JSON.stringify)), JSON.parse);
        this.$forceUpdate()
      })


      //
      // this.rainFloodAllList[0].children = this.rainFloodList
      //
      // this.taskOldIds.forEach(item => {
      //   if (cityCode == item.city) {
      //     let listItem = {
      //       value: item.simulation_time,
      //       label: item.simulation_time
      //     }
      //     this.taskIds.push(listItem)
      //   }
      // })
      //
      // this.contagionAllList[0].children = this.taskIds
    },
    // 获取洪涝模拟任务列表
    getFloodTaskIdList() {
      // serverInfo.baseURL + '/information/getAllLongTermComplete'
      // request({
      //   url: serverInfo.baseURL + '/information/getAllLongTermComplete',
      //   method: 'get'
      // }).then(res => {
      //   this.rainFloodOldList = res
      // })
      axios.get(serverInfo.baseURL + '/information/getAllLongTermComplete')
      .then(res => {
        this.rainFloodOldList = res.data
      })

    },
    getTaskIdList() {
      request({
        url: serverInfo.baseURL_infection + '/get_simulation_result_list',
        method: 'get'
      }).then(res => {
        // console.log(res)
        this.taskOldIds = res.result_list
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
        if (this.ruleForm.checkedList1.indexOf('4') !== -1 && !this.list1.includes('2') && !this.list1.includes('3') && !this.list1.includes('4')) {
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
        if (this.ruleForm.checkedList2.indexOf('5') !== -1 && !this.list1.includes('3') && !this.list1.includes('4')) {
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
        if (this.ruleForm.checkedList1.indexOf('4') !== -1 && !value.includes('3') && !value.includes('4') && (this.list2.length == 0 || !this.list2)) {
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
        if (this.ruleForm.checkedList2.indexOf('5') !== -1 && !value.includes('4') && (this.list2.length == 0 || !this.list2)) {
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
      // list.push(
      //   {
      //     name: '风险点计算',
      //     status: this.ruleForm.checked1 ? '1' : '2',
      //     point: this.ruleForm.anquanp,
      //     line: ''
      //   },
      //   {
      //     name: '临时避难安置场所选址',
      //     status: this.ruleForm.checked2 ? '1' : '2',
      //     point: this.ruleForm.vaolupoint,
      //     line: this.ruleForm.vaoluline,
      //     pointNum: this.ruleForm.pointNum
      //   }
      // )
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

      // console.log(" this.ruleForm.rainList",  this.ruleForm.rainList[0])
      let form = {
        cityId: this.ruleForm.cityId, // 城市id
        list, // 措施列表(急救站选择，应急物资供应点选址等) （参考应急规划）
        rain: this.ruleForm.rainList && this.ruleForm.rainList.length > 0 ? this.ruleForm.rainList[0] : ''

      }

      // console.log("this.ruleForm.rainList", this.ruleForm.rainList)

      this.rainFloodList.forEach(item => {
        if(item.value == form.rain) {
          form.typeName = item.label
          form.planId = item.planId
          form.taskid = item.taskid
        }
      })
      form.rain = form.taskid
      console.log('form', form)
      const data = await longInvokingForLocal(form)
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
          anquanp: '',
          vaolupoint: '',
          vaoluline: '',
          rainList: [],
          contagion: '',
          pointNum: undefined
        };
        (this.youList = [
          {
            label: '医院',
            value: '1',
            checked: false,
            styleD: '',
            styleY: '',
            pointNum: ''
          },
          {
            label: '学校',
            value: '2',
            checked: false,
            styleD: '',
            styleY: '',
            pointNum: ''
          },
          {
            label: '就业中心',
            value: '3',
            checked: false,
            styleD: '',
            styleY: '',
            pointNum: ''
          },
          {
            label: '商场',
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
