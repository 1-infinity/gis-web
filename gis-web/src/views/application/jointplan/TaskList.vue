<template>
  <div class="container">
    <div class="title">{{this.city}}市{{this.type}}灾害模拟数据</div>
    <div class="templates">
      <el-table
        :data="simulationTasks"
        :default-sort="{prop: 'id', order: 'ascending'}"
        class="table"
        height="60vh"
      >
        <el-table-column prop="id" label="序号" sortable width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" width="180" align="center"></el-table-column>
        <el-table-column prop="simulationArea" label="城市" width="180" align="center"></el-table-column>
        <el-table-column prop="simulationDate" label="任务提交时间" width="180" align="center"></el-table-column>
        <el-table-column prop="simulationState" label="状态" width="180" align="center">
          <template slot-scope="scope">
            <i class="el-icon-loading" v-if="scope.row.simulationState === 'processing'"></i>
            <i
              class="el-icon-success"
              v-if="scope.row.simulationState === 'finish'"
              style="color: green"
            ></i>
            <i
              class="el-icon-error"
              v-if="scope.row.simulationState === 'failed'"
              style="color: crimson"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="simulationTime" label="计算时间" width="180" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-radio
              v-model="radio"
              size="mini"
              :label="scope.row.id"
              @input="clickData(scope.row.id)"
              border
            >选择</el-radio>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import serverInfo from "@/views/simulator/serverInfo";

export default {
  name: "TaskList",
  data() {
    return {
      radio: "0",
      simulationTasks: [],
      //选中的任务
      infoTask: {
        id: null,
        date: null,
        area: null,
        computeTime: null,
        results: null,
        locationResults: null,
      },
      currentSimulationResult: null,
      currentSimulationType: null,
      currentTask: null,
      taskId: null,
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
    async getFloodTaskIdList() {
      const res = await axios.get(serverInfo.baseURL + "/simulation/processes");
      res.data.forEach((res) => {
        // 过滤当前城市的模拟数据
        if (res.simulationArea !== this.city) return;
        // 过滤灾害类型
        if (this.type === "洪涝" && res.simulationType !== "flood") return;
        // 处理时间戳
        res.simulationDate = new Date(res.simulationDate).toLocaleString();
        // 修改计算时间
        if (res.simulationState === "processing") {
          res.simulationTime = "计算中";
        } else {
          res.simulationTime =
            (parseInt(res.simulationTime) / 1000).toString() + " 秒";
        }
        this.simulationTasks.push(res);
      });
    },
    // 修改选择的数据
    clickData(id) {
      this.infoTask.id = id;
      this.getData();
    },

    async getData() {
      try {
        this.infoTask.results = await this.getResult();
        const locationResults = await this.getLocation();
        this.$emit("changeData", locationResults);
      } catch (error) {
        console.error("Error during handleBeforeDestroy:", error);
      }
    },

    async getResult() {
      const resultTypes = [
        "submergedcells",
        "availableroads",
        "riskpoints",
        "submergedroads",
      ];
      const times = ["4", "8", "12", "16", "20", "24"];
      const results = {};
      for (const resultType of resultTypes) {
        results[resultType] = {};
        await Promise.all(
          times.map(async (time) => {
            try {
              const len = await axios.get(
                serverInfo.baseURL +
                  `/information/simulation/length/${this.infoTask.id}/${resultType}/${time}`
              );
              const response = await axios.get(
                serverInfo.baseURL +
                  `/information/simulation/subresult/${this.infoTask.id}/${resultType}/${time}/0/${len.data}`
              );
              results[resultType][time] = response.data;
            } catch (error) {
              console.log(`获取模拟数据 ${resultType}:${time} 失败！`, error);
            }
          })
        );
      }
      return results;
    },

    async getLocation() {
      const results = {};
      for (const resultType in this.infoTask.results) {
        if (resultType == "riskpoints") {
          results[resultType] = {};
          for (const time in this.infoTask.results[resultType]) {
            var regex = /(-?\d+\.\d+)/g;
            var matches =
              this.infoTask.results[resultType][time][1].geom.match(regex);
            if (matches && matches.length >= 2) {
              var firstNumber = parseFloat(matches[0]);
              var secondNumber = parseFloat(matches[1]);
              const res = await axios.get(
                `http://100.64.226.144:9090/reverse?format=json&lat=${secondNumber}&lon=${firstNumber}&zoom=18&addressdetails=1`
              );
              results[resultType][time] = res.data;
            } else {
              console.log("未找到匹配的数字。");
            }
          }
        }
      }
      return results;
    },
  },
  mounted() {
    this.getFloodTaskIdList();
  },
};
</script>

<style scoped>
.templates {
  max-width: 75%;
  margin: 5% auto;
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