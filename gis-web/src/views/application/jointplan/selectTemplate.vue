<template>
  <div class="container">
    <div class="title">{{this.city}}市{{this.type}}灾害预案模板</div>
    <div class="templates">
      <el-table :data="templates" :default-sort="{prop: 'id', order: 'ascending'}" class="table">
        <el-table-column prop="id" label="序号" sortable width="80" align="center"></el-table-column>
        <el-table-column prop="mainTitle" label="名称" width="180" align="center"></el-table-column>
        <el-table-column prop="city" label="城市" width="180" align="center"></el-table-column>
        <el-table-column prop="disaster" label="灾害" width="180" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="提交时间" width="180" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-radio
              v-model="radio"
              size="mini"
              :label="scope.row.id"
              @input="clickTemplate(scope.row)"
              border
            >选择</el-radio>
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              style="color: crimson;"
              @click="removeTask(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        style="margin-top: 30px; float: right;"
        size="small"
        type="success"
        @click="upload"
      >上传文件</el-button>
    </div>
    <uploadJointPlan :city="city" :type="type" :dialog="is_UploadJointPlan" @closeDialog="closeDialog"></uploadJointPlan>
  </div>
</template>

<script>
import axios from "axios";
import uploadJointPlan from "@/components/UploadFile/UploadJointPlan.vue";
export default {
  name: "selectTemplate",
  components: {
    uploadJointPlan,
  },
  data() {
    return {
      templates: [],
      // 选择
      radio: "0",
      is_UploadJointPlan: false,
    };
  },
  props: {
    city: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  methods: {
    async getAllTemplates() {
      this.templates = [];
      const res = await axios.get(
        `http://localhost:8080/planQuery/getAllDocuments?city=${this.city}&disaster=${this.type}`
      );
      console.log(res);
      this.templates = res.data.data;
    },
    clickTemplate(template) {
      this.$emit("changeTemplate", template);
    },
    upload() {
      this.is_UploadJointPlan = true;
    },
    closeDialog() {
      this.is_UploadJointPlan = false;
      this.getAllTemplates();
    },
    async removeTask(id){
      await axios.delete(
        `http://localhost:8080/planQuery/deleteDocumentById?documentId=${id}`
      );
      this.templates = this.templates.filter(t => t.id !== id);
    }
  },
  mounted() {
    this.getAllTemplates();
  },
};
</script>

<style scoped>
.templates {
  max-width: 75%;
  margin: 5% auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.title {
  text-align: center;
  font-size: 48px;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
  font-weight: bold;
  color: #1f4e79;
}
.table {
  overflow: auto;
}
</style>