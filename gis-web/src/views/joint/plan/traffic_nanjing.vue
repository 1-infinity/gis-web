<template>
  <div>
  <div v-if="is_catalog">
    <el-row>
      <h1 style="text-align: center">南京市</h1>
      <h3 style="text-align: center;color: #99a9bf">《2018年南京市城市公共交通突发事件应急预案》</h3>
    </el-row>
    <div>
      <el-checkbox-group v-model="selectedItems">
        <el-checkbox class="list-group-item" v-for="item in items" :key="item.value" :label="item.value" @change="handleSelectionChange($event,item.value)">
          <el-row :span="24" :offset="5">
          <div class="grid-content bg-purple-dark">
            {{item.label}}
          </div>
          </el-row>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div>
      <el-button type="primary" style="margin-left: 45%;margin-top: 100px" @click="get_detailed_plan">查看预案</el-button>
    </div>
  </div>
  <div v-if="is_detailed_plan">
    <Detailed_plan_traffic_nanjing
      :ChosedItem="selectedItems"
      :itmes="items"
    >
    </Detailed_plan_traffic_nanjing>
  </div>
  </div>
</template>

<script>
import Detailed_plan_traffic_nanjing from '@/views/joint/plan/detailed_plan_traffic_nanjing.vue'
export default {
  name: 'traffic_nanjing',
  components: { Detailed_plan_traffic_nanjing },
  data(){
    return{
      selectedItems: [],
      items:[
        {label:'1、总则',value:'1'},
        {label:'1.1 编制目的',value:'1-1'},
        {label:'1.2 编制依据',value:'1-2'},
        {label:'1.3 工作原则',value:'1-3'},
        {label:'1.4 适用范围',value:'1-4'},
        {label:'1.5 分类分级',value:'1-5'},
        {label:'2、组织体系',value:'2'},
        {label:'2.1 应急指挥部',value:'2-1'},
        {label:'2.2 应急指挥部办公室',value:'2-2'},
        {label:'2.3 应急工作组',value:'2-3'},
        {label:'2.4 各部门主要职责',value:'2-4'},
        {label:'3、预警预防',value:'3'},
        {label:'3.1 预警体系',value:'3-1'},
        {label:'3.2 预警分级',value:'3-2'},
        {label:'3.3 预警发布',value:'3-3'},
        {label:'3.4 警后预防',value:'3-4'},
        {label:'4 应急处置',value:'4'},
        {label:'4.1 信息报告',value:'4-1'},
        {label:'4.2 先期处置',value:'4-2'},
        {label:'4.3 分级响应',value:'4-3'},
        {label:'4.4 分类救援',value:'4-4'},
        {label:'4.5 响应终止',value:'4-5'},
        {label:'4.6 信息发布',value:'4-6'},
        {label:'5、善后处理',value:'5'},
        {label:'5.1 人员处置',value:'5-1'},
        {label:'5.2 灾后重建',value:'5-2'},
        {label:'5.3 社会救援',value:'5-3'},
        {label:'5.4 保险',value:'5-4'},
        {label:'6、调查评估',value:'6'},
        {label:'6.1 评估总结',value:'6-1'},
        {label:'6.2 评估总结',value:'6-2'},
        {label:'7、应急保障',value:'7'},
        {label:'7.1 应急指挥保障',value:'7-1'},
        {label:'7.2 应急通讯保障',value:'7-2'},
        {label:'7.3 应急物资保障',value:'7-3'},
        {label:'7.4 应急队伍保障',value:'7-4'},
        {label:'7.5 应急运输保障',value:'7-5'},
        {label:'7.6 公共客运保障',value:'7-6'},
        {label:'7.7 经费保障',value:'7-7'},
        {label:'7.8 宣传、培训与演练',value:'7-8'},
        {label:'8、附 则',value:'8'},
        {label:'8.1 预案制定与发布',value:'8-1'},
        {label:'8.2 预案解释',value:'8-2'},
        {label:'8.3 预案管理与更新',value:'8-3'},
        {label:'8.4 奖惩制度',value:'8-4'},
        {label:'8.5 预案的生效',value:'8-5'},
      ],
      is_catalog:true,
      is_detailed_plan:false,
    }
  },
  methods:{
    handleSelectionChange(event,label) {
      if (label.length === 1)//说明此时为一个大章节的总标题，需要将其他小标题也设置为点击
      {
        if (event === true)//说明选上了总标题
        {
          // 选中了总标题，查找对应的小标题并设置为选中
          const subItems = this.items.filter(item => item.value.startsWith(label));
          console.log(subItems)
          for (const subItem of subItems) {
            console.log(subItem.value)
            if(this.selectedItems.indexOf(subItem.value)===-1) {
              this.selectedItems.push(subItem.value);
            }
          }
        } else {
          // 取消选中了总标题，查找对应的小标题并设置为取消选中
          const subItems = this.items.filter(item => item.value.startsWith(label));
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
