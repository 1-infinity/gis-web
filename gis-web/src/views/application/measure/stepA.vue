<!-- 韧性测度业务流程-步骤一 -->
<template>
  <div>
    <div class="title">韧性测度业务流程</div>
    <el-form class="form">
      <el-form-item label="请选择城市:">
        <el-cascader :options="areaOptions" placeholder="城市" :show-all-levels="false" v-model="area">
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
import { options } from "@/views/evaluate/CityScoreData.js";   //导入城市选项数据

export default {
  name: "stepA",
  components: {
  },
  data() {
    return {
      city: "",
      cityName: "",
      area: [],
      areaOptions: options,
    };
  },
  watch: {
    area: {
      handler(newVal) {
        this.city = newVal[1]
        this.$emit("onChangeCity",this.city) //将新的值传递给父组件
      },
      deep: true
    }
  },
  created() { },
  mounted() {
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
// 标题
.title {
  text-align: center;
  font-size: 48px;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
  font-weight: bold;
  color: #1f4e79;
}

.form {
  margin: 50px auto;
  text-align: center;
  .el-form-item {
    display: inline-flex;
  }
}
</style>
  