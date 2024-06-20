<template>
  <div class="container">
    <div id="document">
      <div style="text-align: center">
        <h1>洪涝灾害预案</h1>
      </div>
      <div v-for="(detailPlanItem,index) in detailPlanItems" :key="index">
        <div id="exportContent">
          <h1
            v-if="detailPlanItem.title.toString().split(' ')[0].length == 1"
          >{{ detailPlanItem.title }}</h1>
          <h2
            v-else-if="detailPlanItem.title.toString().split(' ')[0].length == 3"
          >{{ detailPlanItem.title }}</h2>
          <h3
            v-else-if="detailPlanItem.title.toString().split(' ')[0].length == 5"
          >{{ detailPlanItem.title }}</h3>
          <div
            class="formatted-text"
            v-if="detailPlanItem.content"
            v-html="detailPlanItem.content.replace(/\\n/g, '<br>')"
          ></div>
        </div>

        <el-collapse>
          <el-collapse-item title="修改建议" :name="index">
            <div class="content-container">
              <div v-if="LLMItems[index]">
                <div
                  :id="index"
                  v-if="LLMItems[index].text"
                  v-html="LLMItems[index].text.replace(/\\n/g, '<br>')"
                  class="editable-content"
                  contenteditable="true"
                ></div>
                <div v-else class="icon-loading">
                  <i class="el-icon-loading"></i>
                </div>
                <div class="icon-under-content">
                  <i
                    class="el-icon-refresh"
                    title="重新生成"
                    @click="refreshLLM(detailPlanItem.title,index)"
                  ></i>
                  <i class="el-icon-edit"></i>
                  <i class="el-icon-upload2" title="替换" @click="replaceLLM(index)"></i>
                </div>
              </div>
              <div v-else class="icon-loading">
                <i class="el-icon-loading"></i>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <el-button type="primary" style="margin-top: 50px" @click="exportToWord">导出预案</el-button>
  </div>
</template>
  
<script>
import axios from "axios";
import htmlDocx from "html-docx-js/dist/html-docx";

export default {
  name: "detailed_plan_nanjing",
  props: {
    city: {
      type: String,
    },
    type: {
      type: String,
    },
    ChosedItem: {
      type: Array,
    },
    template: {
      type: Object,
    },
    simulationData: {
      type: Object,
    },
  },
  data() {
    return {
      detailPlanItems: [],
      LLMItems: [],
    };
  },
  mounted() {
    this.getDetailedPlan();
  },
  methods: {
    // 对标题进行排序
    sortTitile() {
      this.ChosedItem.sort();
    },
    // 获取文件详细信息
    async getDetailedPlan() {
      this.sortTitile();
      this.LLMItems = [];
      this.detailPlanItems = [];
      try {
        const params = {
          documentId: this.template.id,
          title: this.ChosedItem,
        };
        const res = await axios.post(
          `http://localhost:8080/planQuery/getTextByTitle`,
          params
        );
        console.log(res);
        res.data.data.forEach(async (paragraph) => {
          let item = {
            title: paragraph.title,
            content: paragraph.content,
          };
          this.detailPlanItems.push(item);
          const LLMItem = await this.getDetailedPlanFronLLM(paragraph.title);
          this.LLMItems.push(LLMItem);
        });
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    },
    // 获取LLM结果
    async getDetailedPlanFronLLM(title) {
      const params = {
        query: `请给我写一个${this.city}市暴雨联防联控预案当中${title}部分的有关内容`,
        knowledge_base_name: "test",
        top_k: 3,
        score_threshold: 1,
        model_name: "chatglm2-6b",
        temperature: 0.7,
        max_tokens: 0,
        prompt_name: "default",
      };
      const res = await axios.post(
        `http://100.64.226.144:7865/chat/knowledge_base_chat`,
        params
      );
      const LLMItem = JSON.parse(
        res.data
          .replace(/: ping - \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+/g, "")
          .replace(/data:/g, "")
          .trim()
      );
      const resBySimulation = await this.getLLMBySimulation(LLMItem.answer);
      console.log(resBySimulation)
      return resBySimulation;
    },
    // 用模拟数据提高文本质量
    async getLLMBySimulation(answer) {
      let riskpoint = "";
      for (const key in this.simulationData.riskpoints) {
        riskpoint += `第${key}时刻危险区域有："${this.simulationData.riskpoints[key].display_name}",`;
      }
      let que = answer + riskpoint;
      const params = {
        query: que,
        conversation_id: "",
        stream: false,
        model_name: "openai-api",
        temperature: 0.7,
        max_tokens: 0,
        prompt_name: "default",
      };
      const res = await axios.post(
        `http://100.64.226.144:7865/chat/chat`,
        params
      );
      const LLMItemBySimulation = JSON.parse(res.data
          .replace(/: ping - \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+/g, "")
          .replace(/data:/g, "")
          .trim()
      );
      return LLMItemBySimulation;
    },
    // 重新获得LLM结果
    async refreshLLM(title, index) {
      this.LLMItems[index].text = "";
      const LLMItem = await this.getDetailedPlanFronLLM(title);
      this.LLMItems[index].text = LLMItem.text;
    },
    // 将预案信息设置为文本信息
    replaceLLM(index) {
      const content = document.getElementById(index).innerHTML
      this.detailPlanItems[index].content = content;
      console.log(this.detailPlanItems[index].content);
    },
    // 导出文件
    exportToWord() {
      // 获取 <div> 元素的 HTML 内容
      const content = document.getElementById("exportContent").innerHTML;
      const converted = htmlDocx.asBlob(content, { orientation: "portrait" });
      console.log(content);
      // 创建一个下载链接并触发下载
      const link = document.createElement("a");
      link.href = URL.createObjectURL(converted);
      // 命名文件
      link.download = `${this.city}市${this.type}灾害预案.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>
  
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#document {
  width: 50%;
  margin: 0 auto;
  text-align: left;
}
.formatted-text {
  white-space: pre-wrap;
}
.editable-content {
  color: red;
}
.content-container {
  font-size: 110%;
}
.icon-loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-icon-loading {
  font-size: 5em;
}
.icon-under-content {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-size: 1.5em;
  margin-right: 1%;
}
</style>
  