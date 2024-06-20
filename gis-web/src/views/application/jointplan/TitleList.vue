<template>
  <div>
    <el-row>
      <h1 style="text-align: center">{{ template.city }}市</h1>
      <h3 style="text-align: center;color: rgba(153,169,191,0.97)">{{ template.mainTitle }}</h3>
    </el-row>
    <div>
      <el-checkbox-group v-model="selectedItems" class="title-list">
        <el-checkbox
          class="list-group-item"
          v-for="item in items"
          :key="item.value"
          :label="item.value"
          @change="handleSelectionChange($event,item.value)"
        >
          <el-row>
            <h2
              v-if="item.value.split('.').length - 1 === 0"
              class="grid-content bg-purple-dark"
            >{{ item.value }}</h2>
            <h3
              v-else-if="item.value.split('.').length - 1 === 1"
              class="grid-content bg-purple-dark"
            >{{ item.value }}</h3>
            <h4
              v-else-if="item.value.split('.').length - 1 === 2"
              class="grid-content bg-purple-dark"
            >{{ item.value }}</h4>
            <h5
              v-else-if="item.value.split('.').length - 1 === 3"
              class="grid-content bg-purple-dark"
            >{{ item.value }}</h5>
            <div v-else class="grid-content bg-purple-dark">{{ item.value }}</div>
          </el-row>
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
  
  <script>
import axios from "axios";

export default {
  name: "TitleList",
  data() {
    return {
      selectedItems: [],
      items: [],
    };
  },
  props: {
    template: {
      type: Object,
    },
  },
  methods: {
    handleSelectionChange(event, label) {
      label = label.split(" ")[0];

      //说明此时为一个大章节的总标题，需要将其他小标题也设置为点击
      if (event === true) {
        //说明选上了总标题
        // 选中了总标题，查找对应的小标题并设置为选中
        const subItems = this.items.filter((item) =>
          item.value.startsWith(label)
        );
        if (subItems.length > 0) {
          for (const subItem of subItems) {
            if (this.selectedItems.indexOf(subItem.value) === -1) {
              this.selectedItems.push(subItem.value);
            }
          }
        }
      } else {
        // 取消选中了总标题，查找对应的小标题并设置为取消选中
        const subItems = this.items.filter((item) =>
          item.value.startsWith(label)
        );
        for (const subItem of subItems) {
          const index = this.selectedItems.indexOf(subItem.value);
          if (index !== -1) {
            this.selectedItems.splice(index, 1);
          }
        }
      }

      // 发送数据
      this.$emit("selectionChange", this.selectedItems);
    },
    async getAllTitle(id, mainTitle) {
      const res = await axios.get(
        `http://localhost:8080/planQuery/getAllTitle?id=${id}&mainTitle=${mainTitle}`
      );
      if (res) {
        res.data.data.titleList.forEach((title) => {
          let item = {
            value: title,
          };
          this.items.push(item);
        });
      }
    },
  },
  mounted() {
    this.selectedItems = [];
    this.$emit("selectionChange", this.selectedItems);
    // 当组件挂载到 DOM 后，从后端调用选项（标题）
    this.getAllTitle(this.template.id, this.template.mainTitle);
  },
};
</script>
  
<style scoped>
.title-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-row {
  margin-bottom: 20px;
}

.bg-purple-dark {
  width: 700px;
}

.grid-content {
  border-radius: 4px;
}
</style>
  