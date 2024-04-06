<template>
  <div>
    <div v-if="is_catalog">
      <el-row>
        <h1 style="text-align: center">{{cityName}}市</h1>
        <h3 style="text-align: center;color: #99a9bf">模板：《2019年深圳市防汛预案》</h3>
      </el-row>
      <div>
        <el-checkbox-group v-model="selectedItems">
          <el-checkbox class="list-group-item" v-for="item in items" :key="item.value" :label="item.value" :checked="true" @change="handleSelectionChange($event,item.value)">
            <el-row :span="24" :offset="5">
              <div class="grid-content bg-purple-dark">
                {{item.value}} {{item.label}}
              </div>
            </el-row>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div>
        <el-button type="primary" style="margin-left: 45%;margin-top: 50px" @click="get_detailed_plan">查看预案</el-button>
      </div>
    </div>
    <div v-if="is_detailed_plan">
      <Detailed_plan_flood_LLM
        :ChosedItem="selectedItems"
        :itmes="items"
        :city="cityName"
        @lastStep="get_structure_plan"
      >
      </Detailed_plan_flood_LLM>
    </div>
  </div>
</template>

<script>
import Detailed_plan_shenzhen from '@/views/joint/plan/detailed_plan_shenzhen.vue'
import Detailed_plan_flood_LLM from '@/views/joint/plan/detailed_plan_flood_LLM.vue'
export default {
  name: 'flood_shenzhen',
  components: { Detailed_plan_shenzhen,Detailed_plan_flood_LLM },
  props:
    {
      city:{
        type: String,
        default: "shenzhen",
      },
      cityName:{
        type: String,
        default: "深圳",
      },
    },
  data(){
    return{
      selectedItems: [],
      items:[
        {label:'总则',value:'1'},
        {label:'编制目的',value:'1.1'},
        {label:'编制依据',value:'1.2'},
        {label:'适用范围',value:'1.3'},
        {label:'编制原则',value:'1.4'},
        {label:'风险评估',value:'2'},
        {label:'洪涝灾害特点',value:'2.1'},
        {label:'典型灾情回顾',value:'2.2'},
        {label:'防灾工程体系',value:'2.3'},
        {label:'防灾重点',value:'2.4'},
        {label:'机构与职责',value:'3'},
        {label:'市三防指挥部',value:'3.1'},
        {label:'指挥工作小组',value:'3.2'},
        {label:'各成员单位职责',value:'3.3'},
        {label:'监测预警',value:'4'},
        {label:'监测',value:'4.1'},
        {label:'暴雨预警',value:'4.2'},
        {label:'预防行动',value:'4.3'},
        {label:'应急响应',value:'5'},
        {label:'总体要求',value:'5.1'},
        {label:'一级应急响应',value:'5.2'},
        {label:'二级应急响应',value:'5.3'},
        {label:'三级应急响应',value:'5.4'},
        {label:'四级应急响应',value:'5.5'},
        {label:'信息报送处理和发布',value:'5.6'},
        {label:'应急处置',value:'5.7'},
        {label:'应急结束',value:'5.8'},
        {label:'后期处置',value:'6'},
        {label:'灾后救助', value:'6.1'},
        {label:'物资补充',value:'6.2'},
        {label:'水毁修复',value:'6.3'},
        {label:'灾后重建',value:'6.4'},
        {label:'保险补偿',value:'6.5'},
        {label:'总结评估',value:'6.6'},
        {label:'应急保障',value:'7'},
        {label:'通信与信息保障',value:'7.1'},
        {label:'抢险与救援保障',value:'7.2'},
        {label:'民生与交通保障',value:'7.3'},
        {label:'治安与医疗保障',value:'7.4'},
        {label:'物资与资金保障',value:'7.5'},
        {label:'公众与社会保障',value:'7.6'},
        {label:'宣传、培训和演练',value:'8'},
        {label:'宣传',value:'8.1'},
        {label:'培训',value:'8.2'},
        {label:'演练',value:'8.3'},
        {label:'预案管理',value:'9'},
        {label:'预案修编增编',value:'9.1'},
        {label:'预案报送备案',value:'9.2'},
        {label:'预案操作要求',value:'9.3'},
      ],
      is_catalog:true,
      is_detailed_plan:false,
    }
  },
  methods:{
    handleSelectionChange(event,label) {
      // console.log("cityName",this.cityName)
      if (label.indexOf(".") === -1)//说明此时为一个大章节的总标题，需要将其他小标题也设置为点击
      {
        if (event === true)//说明选上了总标题
        {
          // 选中了总标题，查找对应的小标题并设置为选中
          const subItems = this.items.filter(item => item.value.startsWith(label + "."));
          console.log(subItems)
          for (const subItem of subItems) {
            console.log(subItem.value)
            if(this.selectedItems.indexOf(subItem.value)===-1) {
              this.selectedItems.push(subItem.value);
            }
          }
        } else {
          // 取消选中了总标题，查找对应的小标题并设置为取消选中
          const subItems = this.items.filter(item => item.value.startsWith(label + "."));
          for (const subItem of subItems) {
            const index = this.selectedItems.indexOf(subItem.value);
            if (index !== -1) {
              this.selectedItems.splice(index, 1);
            }
          }
        }
      }
    },
    get_detailed_plan()
    {
      this.is_catalog=false;
      this.is_detailed_plan=true;
      console.log("selectedItems", this.selectedItems)
    },
    get_structure_plan(){
      this.is_catalog=true;
      this.is_detailed_plan=false;
      this.selectedItems = []
      console.log("ChosenItems", this.selectedItems)
    }
  }
}
</script>

<style>
.list-group-item{
  margin-left: 20%;
}
.el-row {
  margin-bottom: 20px;
&:last-child {
   margin-bottom: 0;
 }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
//background: #99a9bf;
  width: 700px;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
