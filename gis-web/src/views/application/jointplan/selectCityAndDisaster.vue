<!-- 联防联控业务流程-步骤一 -->
<template>
  <div>
    <div class="title">联防联控预案编制</div>
    <el-form class="form">
      <el-form-item label="请选择城市:">
        <el-cascader
          v-model="area"
          :options="areaOptions"
          placeholder="请选择城市"
          :show-all-levels="false"
          :clearable="true"
          :filterable="true"
          @change="changeCity"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf">({{ data.children.length }})</span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="请选择预案类型:">
        <el-select
          v-model="planTypeValue"
          :clearable="true"
          placeholder="请选择预案类型"
          @change="changeType"
        >
          <el-option
            v-for="item in planTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
import { options } from "@/views/evaluate/CityScoreData.js"; //导入城市选项数据

export default {
  name: "selectCityAndDisater",
  data() {
    return {
      city: "",
      area: [],
      areaOptions: options,
      planTypeValue: "",
      planTypeOptions: [
        {
          value: 1,
          label: "暴雨洪涝灾害",
        },
        {
          value: 2,
          label: "传染病灾害",
        },
      ],
    };
  },
  methods: {
    changeCity() {
      this.city = this.area[1];
      this.$emit("changeCity", this.city);
    },
    changeType() {
      this.$emit("changePanType", this.planTypeValue);
    },

  },
  mounted() {
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
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
  text-align: center;
  .el-form-item {
    display: inline-flex;
  }
}
</style>
  