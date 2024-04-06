<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>韧性城市规划指标体系介绍</span>
          </div>
          <div>
            <p>
              以人为本的韧性城市是指城市遭遇多种扰动并经历变化，
              采用感知、学习、反馈等多维路径，通过提升城市抵御、吸收、恢复、适应和转变的能力，
              从而维持高频小灾时居民日常生活稳定性，以及低频大灾时居民基本生存保障能力。
              更本质上看，以人为本的韧性城市是指面对多种扰动过程，通过城市系统提供稳定的服务功能，保障居民安全并维持居民的正常生活状态。
            </p>
          </div>
        </el-card>
        <el-card style="position:relative; top: 30px">
          <div slot="header">
            <span>韧性城市系统构成</span>
          </div>
          <div id="compositionView" style="width: 450px; height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div slot="header">
            <span>韧性城市规划指标体系总览</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="4.5">
              <el-card>
                <span>指标总数:{{ this.targetnum }}条
                </span>
              </el-card>
            </el-col>
            <el-col :span="5.5">
              <el-card>
                <span>以人为本指标总数:{{ this.ppitemnum }}条
                </span>
              </el-card>
            </el-col>
            <el-col :span="4.5">
              <el-button type="primary" style="position:relative; top:8px" @click="showppTarget">显示以人为本指标
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-input placeholder="指标搜索" v-model="targetInput" style="width: 300px; top:8px">
                <el-button slot="append" icon="el-icon-search" @click="searchTarget"></el-button>
              </el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="success" style="position: relative; top:8px" @click="restore">还原
              </el-button>
            </el-col>
          </el-row>
          <div id="treeView" style="width: 960px; height: 600px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import "echarts/lib/component/tooltip";
import { targetData } from "./CityScoreData.js";
import * as echarts from "echarts";
export default {
  name: "allView",
  data() {
    return {
      ppitemnum: 0,
      targetnum: 0,
      targetInput: "",
      targetData: targetData,
      myChart: null,
      compositionTree: null,
      treeData: {},
      compositionData: {},
      option: {},
      Coption: {},
    };
  },
  mounted() {
    for (var i = 0; i < 7; i++) {
      for (var data of this.targetData[i]) {
        if (data.pp) {
          this.ppitemnum++;
        }
      }
    }

    for (var j = 0; j < 7; j++) {
      for (var t of this.targetData[j]) {
        this.targetnum++;
      }
    }

    this.initTreeView();
  },

  beforeDestroy() {
    if (!this.myChart && !this.compositionTree) {
      return;
    }
    this.myChart.dispose();
    this.compositionTree.dispose();
    this.myChart = null;
    this.compositionTree = null;
  },

  methods: {
    initTreeView: function () {
      this.initData();
      this.initOptions();
      this.initCoptions();
      this.myChart = null;
      this.compositionTree = null;
      this.myChart = echarts.init(document.getElementById("treeView"));
      this.compositionTree = echarts.init(document.getElementById("compositionView"));
      this.myChart.setOption(this.option);
      // this.myChart.resize();
      this.compositionTree.setOption(this.Coption);
      // this.compositionTree.resize()
    },

    showppTarget: function () {
      this.initData();
      this.initOptions();
      console.log(typeof (this.myChart));
      for (var i = 0; i < 7; i++) {
        for (var data of this.targetData[i]) {
          if (data.pp) {
            for (var p = 0; p < 7; p++) {
              for (var j of this.treeData.children[p].children) {
                if (j.name === data.target) {
                  j["label"] = {
                    backgroundColor: "#ff9933",
                  };
                }
              }
            }
          }
        }
      }
      this.myChart.setOption(this.option);
    },
    // 校验输入框不能有特殊字符
    checkSpecialKey(str) {
      if(!str) return false;
      let specialKey =
        "@[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
      for (let i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      return true;
    },
    searchTarget: function () {
      if (this.targetInput === "") {
        alert("搜索内容不能为空！");
        return;
      }
      else if (!this.checkSpecialKey(this.targetInput)) {
        alert("搜索内容不能包含特殊字符！");
        return;
      }
      else {
        this.initData();
        this.initOptions();
        let flag = 0;
        for (var i = 0; i < 7; i++) {
          for (var data of this.targetData[i]) {
            if (data.target.search(this.targetInput) !== -1) {
              for (var p = 0; p < 7; p++) {
                for (var j of this.treeData.children[p].children) {
                  if (j.name === data.target) {
                    j["label"] = {
                      backgroundColor: "#3366ff",
                    };
                    flag++;
                  }
                }
              }
            }
          }
        }
        this.myChart.setOption(this.option);
        if (flag === 0) {
          alert("没有匹配项");
        } else {
        }
      }
    },

    initData: function () {
      this.compositionData = {
        name: "系统构成",
        description: "韧性城市规划指标体系共由6大系统构成",
        children: [
          {
            name: "生命线系统",
            description: "子系统数：3 ；指标数：5",
            children: [
              { name: "水系统" },
              { name: "食物供应" },
              { name: "能源系统" },
            ],
          },
          {
            name: "重要建筑物",
            description: "子系统数：5 ；指标数：6",
            children: [
              { name: "应急指挥中心" },
              { name: "救灾物质仓库" },
              { name: "消防设施" },
              { name: "军事设施" },
              { name: "学校及其他公建" },
            ],
          },
          {
            name: "连接系统",
            description: "子系统数：2 ；指标数：4",
            children: [{ name: "道路交通系统" }, { name: "通讯系统" }],
          },
          {
            name: "医疗服务系统",
            description: "子系统数：2 ；指标数：3",
            children: [{ name: "医院" }, { name: "社区卫生所" }],
          },
          {
            name: "污染处理系统",
            description: "子系统数：2 ；指标数：2",
            children: [{ name: "污水处理系统" }, { name: "废弃物处置系统" }],
          },
          {
            name: "开放空间系统",
            description: "子系统数：2 ；指标数：4",
            children: [{ name: "应急避难系统" }, { name: "生态空间网格" }],
          },
        ],
      };

      this.treeData = {
        name: "城市系统",
        children: [
          {
            name: "生命线系统",
            children: [],
          },
          {
            name: "重要建筑物",
            children: [],
          },
          {
            name: "连接系统",
            children: [],
          },
          {
            name: "医疗服务系统",
            children: [],
          },
          {
            name: "污染处理系统",
            children: [],
          },
          {
            name: "开放空间系统",
            children: [],
          },
          {
            name: "其他",
            children: [],
          },
        ],
      };

      for (var i = 0; i < 7; i++) {
        for (var data of this.targetData[i]) {
          this.treeData.children[i].children.push({
            name: data.target,
            value: data.focus,
            children: [
              {
                name: "管控尺度",
                value: data.scale,
              },
              {
                name: "管控层级",
                value: data.level,
              },
            ],
          });
        }
      }
    },

    initCoptions: function () {
      this.Coption = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          hideDelay: 800,
          formatter: function (params) {
            return params.data.description;  // 返回 description 属性的值
          },
          backgroundColor: "#3399ff",
        },
        series: [
          {
            type: "tree",
            data: [this.compositionData],
            top: "1%",
            left: "20%",
            bottom: "1%",
            right: "30%",
            symbolSize: 10,
            // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            // roam: true,
            // -1为全部展开
            initialTreeDepth: 2,
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
            label: {
              normal: {
                position: "top",
                verticalAlign: "middle",
                align: "right",
                color: "#000000",
                fontSize: 16,
                backgroundColor: "transparent",
              },
            },
            leaves: {
              label: {
                normal: {
                  position: "right",
                  verticalAlign: "middle",
                  align: "left",
                },
              },
            },
          },
        ],
      };
    },

    initOptions: function () {
      this.option = {
        // 浮框
        tooltip: {
          // 显示项
          trigger: "item",
          // 显示方式：mousemove/click
          triggerOn: "mousemove",
          // 隐藏时延：*ms
          hideDelay: 800,
          // 显示内容：{c}为值
          formatter: "{c}",
          // 浮框背景色
          backgroundColor: "#3399ff",
        },
        series: [
          {
            type: "tree",
            data: [this.treeData],
            top: "1%",
            left: "7%",
            bottom: "1%",
            right: "40%",
            symbolSize: 15,
            // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            // roam: true,
            // -1为全部展开
            initialTreeDepth: 2,
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
            label: {
              normal: {
                position: "top",
                verticalAlign: "middle",
                align: "right",
                color: "#000000",
                fontSize: 16,
                backgroundColor: "transparent",
                /*                 formatter(v) {
                                  if (v.collapsed) {
                                    let text = v.name;
                                    if (text.length >= 10) {
                                      text = `${text.slice(0, 10)}\n${text.slice(
                                        10,
                                        text.length
                                      )}`;
                                      return text;
                                    }
                                  }
                                }, */
              },
            },
            leaves: {
              label: {
                normal: {
                  position: "right",
                  verticalAlign: "middle",
                  align: "left",
                },
              },
            },
          },
        ],
      };
    },

    restore: function () {
      this.initTreeView();
      this.targetInput = "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
