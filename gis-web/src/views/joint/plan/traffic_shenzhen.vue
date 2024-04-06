<template>
  <div>
  <div v-if="is_catalog">
    <el-row>
      <h1 style="text-align: center">深圳市</h1>
      <h3 style="text-align: center;color: #99a9bf">《2016深圳市处置道路交通突发事件应急预案》</h3>
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
    <Detailed_plan_traffic_shenzhen
      :ChosedItem="selectedItems"
      :itmes="items"
    >
    </Detailed_plan_traffic_shenzhen>
  </div>
  </div>
</template>

<script>
import Detailed_plan_traffic_shenzhen from '@/views/joint/plan/detailed_plan_traffic_shenzhen.vue'
export default {
  name: 'traffic_shenzhen',
  components: { Detailed_plan_traffic_shenzhen },
  data(){
    return{
      selectedItems: [],
      items:[
        {label:'1、总则',value:'1'},
        {label:'1.1 编制目的',value:'1-1'},
        {label:'1.2 编制依据',value:'1-2'},
        {label:'1.3 工作原则',value:'1-3'},
        {label:'1.4 突发事件分类分级',value:'1-4'},
        {label:'1.5 适用范围',value:'1-5'},
        {label:'1.6 突发事件现状',value:'1-6'},
        {label:'2、组织机构和职责',value:'2'},
        {label:'2.1 领导机构',value:'2-1'},
        {label:'2.2 应急指挥体系',value:'2-2'},
        {label:'3、运行机制',value:'3'},
        {label:'3.1 预防、监测与预警',value:'3-1'},
        {label:'3.2 应急处置与救援',value:'3-2'},
        {label:'3.3 后期处置',value:'3-3'},
        {label:'4 应急保障',value:'4'},
        {label:'4.1 人力资源保障',value:'4-1'},
        {label:'4.2 经费保障',value:'4-2'},
        {label:'4.3 物资保障',value:'4-3'},
        {label:'4.4 医疗卫生保障',value:'4-4'},
        {label:'4.5 交通运输保障',value:'4-5'},
        {label:'4.6 治安保障',value:'4-6'},
        {label:'4.7 人员防护保障',value:'4-7'},
        {label:'4.8 通信和信息保障',value:'4-8'},
        {label:'4.9 现场救援和工程抢险装备保障',value:'4-9'},
        {label:'4.10 应急避难场所保障',value:'4-10'},
        {label:'4.11 科技支撑保障',value:'4-11'},
        {label:'4.12 气象服务保障',value:'4-12'},
        {label:'4.13 法制保障',value:'4-13'},
        {label:'4.14 其他应急保障',value:'4-14'},
        {label:'5、监督管理',value:'5'},
        {label:'5.1 应急演练',value:'5-1'},
        {label:'5.2 宣传教育',value:'5-2'},
        {label:'5.3 培训',value:'5-3'},
        {label:'5.4 责任与奖惩',value:'5-4'},
        {label:'5.5 预案实施',value:'5-5'},
        {label:'6、预案管理',value:'6'},
        {label:'6.1 部门应急预案目录',value:'6-1'},
        {label:'6.2 预案管理',value:'6-2'},
        {label:'6.3 制定与解释',value:'6-3'}
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
