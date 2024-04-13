<template>
  <div>
    <div v-if="is_catalog">
      <el-row>
        <h1 style="text-align: center">南京市</h1>
        <h3 style="text-align: center;color: rgba(153,169,191,0.97)">《2020年南京市防汛预案》</h3>
      </el-row>
      <div>
        <el-checkbox-group v-model="selectedItems">
          <el-checkbox class="list-group-item"
                       v-for="item in items" :key="item.value" :label="item.value"
                       @change="handleSelectionChange($event,item.value)"
          >
            <el-row :span="24" :offset="5">
              <div class="grid-content bg-purple-dark">
                {{ item.label }}
              </div>
            </el-row>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div>
        <el-button type="primary" style="margin-left: 45%;margin-top: 100px" @click="get_detailed_plan">查看预案
        </el-button>
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
import axios from 'axios'
import Detailed_plan_nanjing from '@/views/joint/plan/detailed_plan_nanjing.vue'

export default {
  name: 'flood_nanjing',
  components: { Detailed_plan_nanjing },
  data() {
    return {
      selectedItems: [],
      items: [],
      is_catalog: true,
      is_detailed_plan: false
    }
  },
  methods: {
    handleSelectionChange(event, label) {
      if (label.length === 1)//说明此时为一个大章节的总标题，需要将其他小标题也设置为点击
      {
        if (event === true)//说明选上了总标题
        {
          // 选中了总标题，查找对应的小标题并设置为选中
          const subItems = this.items.filter(item => item.value.startsWith(label))
          for (const subItem of subItems) {
            if (this.selectedItems.indexOf(subItem.value) === -1) {
              this.selectedItems.push(subItem.value)
            }
          }
          console.log(this.selectedItems)
        } else {
          // 取消选中了总标题，查找对应的小标题并设置为取消选中
          const subItems = this.items.filter(item => item.value.startsWith(label))
          for (const subItem of subItems) {
            const index = this.selectedItems.indexOf(subItem.value)
            if (index !== -1) {
              this.selectedItems.splice(index, 1)
            }
          }
        }
      }
    },
    get_detailed_plan() {
      this.is_catalog = false
      this.is_detailed_plan = true
    },
    async getAllTitle(city, disaster) {
      const res = await axios.get(`http://localhost:8080/planQuery/getAllTitle?city=${city}&disaster=${disaster}`)
      res.data.data.forEach(title => {
        let item = {
          'label': title,
          'value': title.split(' ')[0].replace('.', '-')
        }
        this.items.push(item)
      })
    }
  },
  mounted() {
    // 当组件挂载到 DOM 后，从后端调用选项（标题）
    this.getAllTitle('南京市', '洪水')
  }
}
</script>

<style>
.list-group-item {
  margin-left: 20%;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.bg-purple-dark {
  width: 700px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
