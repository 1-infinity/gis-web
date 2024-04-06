<template>
  <div>
    <div v-if="is_catalog">
      <el-row>
        <h1 style="text-align: center">珠海市</h1>
        <h3 style="text-align: center;color: #99a9bf">《2009年珠海市防汛应急工作预案》</h3>
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
      <detailed_plan_zhuhai
        :ChosedItem="selectedItems"
        :itmes="items"
      >
      </detailed_plan_zhuhai>
    </div>
  </div>
</template>

<script>
import detailed_plan_nanjing from './detailed_plan_nanjing.vue'
import Detailed_plan_zhuhai from '@/views/joint/plan/detailed_plan_zhuhai.vue'
export default {
  name: 'flood_zhuhai',
  components: { Detailed_plan_zhuhai },
  data(){
    return{
      selectedItems: [],
      items:[
        {label: '调用仿真模拟结果',value: '0'},
        {label:'1 总则',value:'1'},
        {label:'1.1 编制目的',value:'1-1'},
        {label:'1.2 编制依据',value:'1-2'},
        {label:'1.3 适用范围',value:'1-3'},
        {label:'1.4 工作原则',value:'1-4'},
        {label:'2 组织机构与职责',value:'2'},
        {label:'2.1 组织机构',value:'2-1'},
        {label:'2.2 工作职责',value:'2-2'},
        {label:'3 预防和预警机制',value:'3'},
        {label:'3.1 预防预警信息',value:'3-1'},
        {label:'3.2 预警发布',value:'3-2'},
        {label:'4 应急响应',value:'4'},
        {label:'4.1 洪水应急响应级别与启动条件',value:'4-1'},
        {label:'4.2 暴雨应急响应级别与启动条件',value:'4-2'},
        {label:'5 应急响应行动',value:'5'},
        {label:'5.1 洪水应急响应',value:'5-1'},
        {label:'5.2 暴雨应急响应',value:'5-2'},
        {label:'5.3 堤防决口、水闸垮塌、水库溃坝',value:'5-3'},
        {label:'5.4 信息报送和处理',value:'5-4'},
        {label:'5.5 新闻报道、宣传',value:'5-5'},
        {label:'5.6 应急响应解除',value:'5-6'},
        {label:'6 应急保障',value:'6'},
        {label:'6.1 通信保障',value:'6-1'},
        {label:'6.2 技术保障',value:'6-2'},
        {label:'6.3 抢险队伍保障',value:'6-3'},
        {label:'6.4 交通运输保障',value:'6-4'},
        {label:'6.5 医疗保障',value:'6-5'},
        {label:'6.6 治安保障',value:'6-6'},
        {label:'6.7 物资保障',value:'6-7'},
        {label:'6.8 经费保障',value:'6-8'},
        {label:'7 善后工作',value:'7'},
        {label:'8 预案管理',value:'8'},
        {label:'8.1 预案编制与审批',value:'8-1'},
        {label:'8.2 预案的监督与奖惩',value:'8-2'},
        {label:'8.3 预案的修订和完善',value:'8-3'},
        {label:'8.4 预案解释权',value:'8-4'},
        {label:'8.5 预案实施',value:'8-5'},
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
