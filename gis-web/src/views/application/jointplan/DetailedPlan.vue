<template>
    <div>
      <div id="exportContent">
        <div style="text-align: center">
          <h1>洪涝灾害预案</h1>
        </div>
        <div
          v-for="detailPlanItem in detailPlanItems"
          :key="detailPlanItem.title"
        >
          <h1 v-if="detailPlanItem.title.toString().split(' ')[0].length == 1">{{ detailPlanItem.title }}</h1>
          <h2 v-else-if="detailPlanItem.title.toString().split(' ')[0].length == 3">{{ detailPlanItem.title }}</h2>
          <h3 v-else-if="detailPlanItem.title.toString().split(' ')[0].length == 5">{{ detailPlanItem.title }}</h3>
          <div
            class="formatted-text"
            v-if="detailPlanItem.content"
            v-html="detailPlanItem.content.replace(/\\n/g, '<br>')"
          ></div>
        </div>
      </div>
      <el-button
        type="primary"
        style="margin-left: 45%;margin-top: 50px"
        @click="exportToWord"
      >导出预案</el-button>
      <el-button
        type="primary"
        @click="lastStep"
      >返回上一步</el-button>
    </div>
  </template>
  
  <script>
  import htmlDocx from "html-docx-js/dist/html-docx";
  import axios from "axios";
  
  export default {
    name: "detailed_plan_nanjing",
    props: {
      ChosedItem: {
        type: Array,
      },
      items: {
        type: Array,
      },
      documentId: {
        type: Number,
      },
      city: {
        type: String,
      },
    },
    data() {
      return {
        detailPlanItems: [],
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
        try {
          const params = {
            documentId: this.documentId,
            title: this.ChosedItem,
          };
          const res = await axios.post(
            `http://localhost:8080/planQuery/getTextByTitle`,
            params
          );
          res.data.data.forEach((paragraph) => {
            let item = {
              title: paragraph.title,
              content: paragraph.content,
            };
            this.detailPlanItems.push(item);
          });
        } catch (e) {
          console.error("Error fetching data:", e);
        }
      },
      // 导出文件
      exportToWord() {
        // 获取要导出的 <div> 元素
        const divElement = document.getElementById("exportContent");
  
        // 获取 <div> 元素的 HTML 内容
        const htmlContent = divElement.innerHTML;
        // 转换 HTML 为 Word 文档
        const convertedContent = htmlDocx.asBlob(htmlContent);
  
        // 创建一个下载链接并触发下载
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(convertedContent);
        downloadLink.download = "flood_plan_" + this.city + ".docx";
        downloadLink.click();
      },
      // 回退
      lastStep() {
        this.$emit("back");
      },
    },
  };
  </script>
  
  <style>
  .formatted-text {
    white-space: pre-wrap;
  }
  </style>
  