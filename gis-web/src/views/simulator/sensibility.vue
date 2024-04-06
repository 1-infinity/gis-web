<template>
  <div class="app-container">
    <el-form ref="form1">
      <el-form-item>
        <el-input v-model="city" style="width: 200px" placeholder="请输入城市名"></el-input>
        <el-button type="primary" plain @click="generate">
          生成洪水敏感性</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 60%" center>
      <el-table-column prop="id" label="敏感性测绘id" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="敏感性测绘区域" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="模拟用时" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-form ref="form" label-width="150px">
      <el-form-item label="洪水敏感性测绘id">
        <!-- <el-input
          v-model="id"
          style="width: 100px"
          placeholder="请输入id"
        ></el-input> -->
        <el-input-number v-model="id" style="width: 100px" :min="1" :precision="0" :controls="false"></el-input-number>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询结果</el-button>
      <el-button @click="clear">取消</el-button>
    </el-form>
    <div class="block" v-show="isShow">
      <el-image style="width: 500px; height: 500px" :src="url">
        <div slot="error">
          <el-alert type="warning" title="该任务结果不存在！" :closable="false" show-icon>
          </el-alert>
        </div>
      </el-image>
    </div>
  </div>
</template>


<script>
import ajax from "./ajax";
import axios from "axios";
import serverInfo from "./serverInfo";
export default {
  name: "sensibility",
  components: {},
  data() {
    return {
      tableData: [],
      city: "",
      id: "",
      url: "",
      isShow: false,
    };
  },

  methods: {
    clear() {
      this.id = "";
    },
    onSubmit() {
      let hasTask = false;
      this.tableData.forEach(row => {
        if (row.id === this.id) {
          hasTask = true;
        }
      });
      if (!hasTask) {
        this.$message({
          message: "搜索的任务id不存在",
          type: "error",
        });
        return;
      }
      let u = serverInfo.baseURL + "/simulation/getFloodSty/" + this.id;
      this.isShow = true;
      this.url = u;
    },
    getFloodInfo() {
      ajax("/simulation/getAllFloodSty").then((res) => {
        this.tableData = res;
        this.tableData.sort((a, b) => { return a.id - b.id });
        //   let blob = new Blob([res]);   // 返回的文件流数据
        //   let url = window.URL.createObjectURL(blob);  // 将他转化为路径
      });
    },
    // 校验输入框不能有特殊字符
    checkSpecialKey(str) {
      if (!str) return false;
      let specialKey =
        "@[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
      for (let i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      return true;
    },
    // 校验输入框不能有数字
    checkNumber(str) {
      let specialKey =
        "1234567890";
      for (let i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      return true;
    },
    async generate() {
      if (this.city === "") {
        this.$message({
          message: "请输入城市名！",
          type: "error",
        });
        return;
      }
      else if (!this.checkSpecialKey(this.city)) {
        this.$message({
          message: "城市名不能包含特殊字符！",
          type: "error",
        });
        return;
      }
      else if (!this.checkNumber(this.city)) {
        this.$message({
          message: "城市名不能包含数字！",
          type: "error",
        });
        return;
      }
      let url = serverInfo.baseURL + "/simulation/floodStySimulator";
      let formData = new FormData();
      formData.append("city", this.city);
      let headers = {
        "Content-Type": "multipart/form-data",
      };
      axios
        .post(url, formData, { headers: headers })
        .then((res) => {
          console.log(res);
          this.$message({
            message: "生成洪水敏感性成功",
            type: "success",
          });
          this.city = "";
          setTimeout(() => {
            this.getFloodInfo();
          }, 1000);

        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "失败",
            type: "error",
          });
        });
    },
  },
  mounted() {
    this.getFloodInfo();
  },
};
</script>
