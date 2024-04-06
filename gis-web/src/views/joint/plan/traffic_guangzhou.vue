<template>
  <div>
  <div v-if="is_catalog">
    <el-row>
      <h1 style="text-align: center">广州市</h1>
      <h3 style="text-align: center;color: #99a9bf">《2014年广州市道路交通相关事故应急预案》</h3>
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
    <Detailed_plan_traffic_guangzhou
      :ChosedItem="selectedItems"
      :itmes="items"
    >
    </Detailed_plan_traffic_guangzhou>
  </div>
  </div>
</template>

<script>
import Detailed_plan_traffic_guangzhou from '@/views/joint/plan/detailed_plan_traffic_guangzhou.vue'
export default {
  name: 'traffic_guangzhou',
  components: { Detailed_plan_traffic_guangzhou },
  data(){
    return{
      selectedItems: [],
      items:[
        {label:'1、总则',value:'1'},
        {label:'1.1 编制目的',value:'1-1'},
        {label:'1.2 编制依据',value:'1-2'},
        {label:'1.3 工作原则',value:'1-3'},
        {label:'1.4 适用范围',value:'1-4'},
        {label:'2、应急组织体系及职责',value:'2'},
        {label:'2.1 道路交通事故应急救援指挥部',value:'2-1'},
        {label:'2.2 现场指挥部',value:'2-2'},
        {label:'2.3 交通事故现场救援分工',value:'2-3'},
        {label:'2.4 指挥部各成员单位职责',value:'2-3'},
        {label:'3、预测预警预防机制',value:'3'},
        {label:'3.1 预测预警预防信息',value:'3-1'},
        {label:'3.2 预测预警预防措施',value:'3-2'},
        {label:'3.3 预测预警预防支持系统',value:'3-3'},
        {label:'4 应急响应',value:'4'},
        {label:'4.1 响应分级、程序和内容',value:'4-1'},
        {label:'4.2 信息报送',value:'4-2'},
        {label:'4.3 现场施救',value:'4-3'},
        {label:'4.4 应急人员的安全防护',value:'4-4'},
        {label:'4.5 群众的安全防护',value:'4-5'},
        {label:'4.6 事故的调查处理及损失评估',value:'4-6'},
        {label:'4.7 新闻报道',value:'4-7'},
        {label:'4.8 应急结束',value:'4-8'},
        {label:'5、后期处理理',value:'5'},
        {label:'5.1 后期处理',value:'5-1'},
        {label:'5.2 保险、社会救助基金',value:'5-2'},
        {label:'6、保障措施',value:'6'},
        {label:'6.1 保障措施',value:'6-1'},
        {label:'7、宣传、培训和演练',value:'7'},
        {label:'7.1 宣传、培训',value:'7-1'},
        {label:'7.2 演练',value:'7-2'},
        {label:'8、附则',value:'8'},
        {label:'8.1 名词术语',value:'8-1'},
        {label:'8.2 预案修订与解释',value:'8-2'},
        {label:'8.3 责任与奖惩',value:'8-3'},
        {label:'8.4 实施时间',value:'8-4'}
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
