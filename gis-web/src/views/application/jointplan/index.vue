<template>
  <div class="container">
    <div class="step-view">
      <selectCD v-show="step == 0" @changeCity="changeCity" @changePanType="changePanType"></selectCD>
      <selectTemplate
        v-if="step == 1"
        :city="cityName"
        :type="type"
        @changeTemplate="changeTemplate"
      ></selectTemplate>
      <taskList v-if="step == 2" :city="city" :type="type" @changeData="changeData"></taskList>
      <titleList v-if="step == 3" :template="template" @selectionChange="changeSelection"></titleList>
      <detailedPlan
        v-if="step == 4"
        :ChosedItem="selectedItems"
        :city="cityName"
        :type="type"
        :template="template"
        :simulationData="simulationData"
      ></detailedPlan>
    </div>
    <div  class="steps">
      <el-steps :active="step" align-center finish-status="success" style="width:50%">
        <el-step title="步骤1" description="选择城市和灾害类型"></el-step>
        <el-step title="步骤2" description="选择预案模板"></el-step>
        <el-step title="步骤3" description="选择模拟数据"></el-step>
        <el-step title="步骤4" description="选择标题"></el-step>
        <el-step title="步骤5" description="导出预案"></el-step>
      </el-steps>
    </div>
    <div class="step-button">
      <el-button type="primary" size="large" @click="prevStep" :disabled="disablePreStepButton">上一步</el-button>
      <el-button
        ref="btnNextStep"
        type="primary"
        size="large"
        @click="nextStep"
        :disabled="disableNextStepButton"
      >下一步</el-button>
    </div>
  </div>
</template>

<script>
import selectCD from "@/views/application/jointplan/selectCityAndDisaster.vue";
import selectTemplate from "@/views/application/jointplan/selectTemplate.vue";
import detailedPlan from "@/views/application/jointplan/DetailedPlan.vue";

import titleList from "@/views/application/jointplan/TitleList.vue";
import taskList from "@/views/application/jointplan/TaskList.vue";

import mapData from "@/views/simulator/components/mapData";

export default {
  name: "JointPlan",
  components: {
    selectCD,
    selectTemplate,
    detailedPlan,
    taskList,
    titleList,
  },
  data() {
    return {
      city: "",
      cityName: "",
      planType: "",
      type: "",
      template: null,
      selectedItems: [],
      simulationData: null,

      step: 0,
      maxStep: 3,
      minStep: 0,

      is_UploadJointPlan: false,
      disablePreStepButton: false,
      disableNextStepButton: false,
    };
  },
  methods: {
    closeDialog() {
      this.is_UploadJointPlan = false;
    },
    uploadFile() {
      this.is_UploadJointPlan = true;
    },
    //上一步
    prevStep() {
      this.step--;
    },
    //下一步
    nextStep() {
      this.step++;
      // // if(this.planType===1){
      // console.log(this.selectedItems);
      // if (this.stepIndex < this.maxStepIndex) {
      //   this.stepIndex++;
      //   // console.log(this.city)
      //   if (this.stepIndex === this.maxStepIndex) {
      //     this.$refs.btnNextStep.$el.innerText = "导出预案";
      //   }
      // } else if (this.stepIndex === this.maxStepIndex) {
      //   if (this.planType == 1) this.$refs.editJointPlan.exportToWord();
      //   else this.$refs.editJointPlanInfection.exportToWord();
      // }
      // // }
      // // else if(this.planType===2){
      // //   this.stepIndex++;
      // // }
    },
    //修改城市
    changeCity(city) {
      this.city = city;
      this.cityName = this.getCityName(city);
    },
    // 修改预案类型
    changePanType(planType) {
      if (planType == 1) {
        this.type = "洪涝";
        this.planType = planType;
      }
    },
    //根据拼音获取城市名称
    getCityName(city) {
      if (city in mapData) {
        return mapData[city].cityName;
      } else {
        return city;
      }
    },
    // 修改选择的预案
    changeTemplate(template) {
      this.template = template;
    },
    // 修改选择的标题
    changeSelection(selectedItems) {
      this.selectedItems = selectedItems;
    },
    // 修改选择的模拟数据
    changeData(taskData) {
      console.log(taskData);
      this.simulationData = taskData;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  padding: 20px;

  .step-view {
    min-height: 400px;
    width: 100%;
  }
  .steps {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 2vh;
    margin-top: 2vh;
  }

  .step-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
