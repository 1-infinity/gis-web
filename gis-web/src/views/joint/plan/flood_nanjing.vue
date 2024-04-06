<template>
  <div>
  <div v-if="is_catalog">
    <el-row>
      <h1 style="text-align: center">南京市</h1>
      <h3 style="text-align: center;color: #99a9bf">《2020年南京市防汛预案》</h3>
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
    <detailed_plan_nanjing
      :ChosedItem="selectedItems"
      :itmes="items"
    >
    </detailed_plan_nanjing>
  </div>
  </div>
</template>

<script>
import detailed_plan_nanjing from './detailed_plan_nanjing.vue'
import Detailed_plan_nanjing from '@/views/joint/plan/detailed_plan_nanjing.vue'
export default {
  name: 'flood_nanjing',
  components: { Detailed_plan_nanjing },
  data(){
    return{
      selectedItems: [],
      items:[
        {label:'1、总则',value:'1'},
        {label:'1.1 编制目的',value:'1-1'},
        {label:'1.2 编制依据',value:'1-2'},
        {label:'1.3 适用范围',value:'1-3'},
        {label:'1.4 工作原则',value:'1-4'},
        {label:'2、组织体系',value:'2'},
        {label:'2.1 市防汛防旱指挥部',value:'2-1'},
        {label:'2.2 联防指挥部',value:'2-2'},
        {label:'2.3 区防汛防旱指挥部',value:'2-3'},
        {label:'2.4 其他防汛组织',value:'2-4'},
        {label:'2.5 工作组',value:'2-5'},
        {label:'2.6 专家库',value:'2-6'},
        {label:'3、监测预报、预警和预防',value:'3'},
        {label:'3.1 监测预报',value:'3-1'},
        {label:'3.2 预警',value:'3-2'},
        {label:'3.3 预防',value:'3-3'},
        {label:'4 应急响应',value:'4'},
        {label:'4.1 总体要求',value:'4-1'},
        {label:'4.2 应急响应启动条件',value:'4-2'},
        {label:'4.3 应急响应行动',value:'4-3'},
        {label:'4.4 应急响应措施',value:'4-4'},
        {label:'4.5 信息报告和发布',value:'4-5'},
        {label:'4.6 应急响应变更和结束',value:'4-6'},
        {label:'5、保障措施',value:'5'},
        {label:'5.1 组织保障',value:'5-1'},
        {label:'5.2 资金保障',value:'5-2'},
        {label:'5.3 物资保障',value:'5-3'},
        {label:'5.4 队伍保障',value:'5-4'},
        {label:'5.5 通信保障',value:'5-5'},
        {label:'5.6 交通保障',value:'5-6'},
        {label:'5.7 电力保障',value:'5-7'},
        {label:'5.8 治安保障',value:'5-8'},
        {label:'5.9 卫生保障',value:'5-9'},
        {label:'5.10 宣传培训与演练',value:'5-10'},
        {label:'6、善后工作',value:'6'},
        {label:'6.1 灾后救助',value:'6-1'},
        {label:'6.2 灾后重建',value:'6-2'},
        {label:'6.3 水毁修复',value:'6-3'},
        {label:'6.4 补偿要求',value:'6-4'},
        {label:'6.5 总结评估',value:'6-5'},
        {label:'6.6 奖惩',value:'6-6'},
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
