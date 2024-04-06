<!--  -->
<template>
  <div>
    <div class="home" v-show="!showCanvas">
      <div class="left">
        <p>2020年“物联网与智慧城市关键技术及示范”重点专项</p>
        <p>韧性城市智能规划与仿真关键技术及应用</p>
      </div>
      <div class="title">韧性城市智能规划平台</div>
      <div class="main-cards">
        <el-card class="box-card" @click.native="$router.push('/integration/integrationCanvas')">
          <div slot="header" class="clearfix">
            <span>韧性城市智能规划</span>
          </div>
          <div class="text item">
            <img src="../../assets/home/dd.png" alt="" />
          </div>
        </el-card>
      </div>
      <div class="subtitle">课题平台：</div>
      <el-row :gutter="100" style="left:80px;top:30px;">
        <el-col :span="8">
          <el-button>城市风险与灾害监测/预警/管理基础信息</el-button>
        </el-col>
        <el-col :span="8">
          <el-button @click="goToSubjectThree">城市韧性智能模拟/预测/推演</el-button>
        </el-col>
        <el-col :span="8">
          <el-button @click="$router.push('/platform/homeTwo')">韧性城市自适应规划决策</el-button>
        </el-col>
      </el-row>
<!--       <div class="children-cards">
        <el-card class="box-card">
          <div class="clearfix">
            <span> 城市风险与灾害监测/预警/管理基础信息</span>
          </div>
        </el-card>
        <el-card class="box-card" @click.native="goToSubjectThree">
          <div class="clearfix">
            <span>城市韧性智能模拟/预测/推演</span>
          </div>
        </el-card>
        <el-card class="box-card" @click.native="$router.push('/platform/homeTwo')">
          <div  class="clearfix">
            <span>韧性城市自适应规划决策 </span>
          </div>
        </el-card>
      </div> -->
      <div class="footer">
        <div v-for="(val, i) in list" :key="'a' + i">
          <img :class="[i == 2 ? 'imgs' : '']" :src="require('@/assets/home/' + val.value)" alt="" />
          <span>{{ val.name }}</span>
        </div>
      </div>
    </div>
    <!-- <div v-show="showCanvas">
      <integrationCanvas ref="canvas" @goBackHome="goBackHome"></integrationCanvas>
    </div> -->
  </div>
</template>

<script>
/* import integrationCanvas from '../intergration/integrationCanvas.vue'; */
import serverInfo from '../simulator/serverInfo';

export default {
  name: "home",
  props: [""],
  components: {
    /* integrationCanvas, */
  },
  data() {
    return {
      list: [
        {
          name: "同济大学",
          value: "11.png",
        },
        {
          name: "西北工业大学",
          value: "12.png",
        },
        {
          name: "山东省计算中心（国家超级计算济南中心）",
          value: "13.png",
        },
        {
          name: "中国国土勘测规划院",
          value: "14.jpg",
        },
        {
          name: "中国科学院软件研究所",
          value: "15.jpg",
        },
        {
          name: "北京交通大学",
          value: "16.png",
        },
        {
          name: "紫光云技术有限公司",
          value: "17.png",
        },
        {
          name: "中外建设信息有限责任公司",
          value: "18.png",
        },
        {
          name: "广东省城乡规划设计研究院",
          value: "19.png",
        },
        {
          name: "北京聚慧融智城市信息技术研究院有限公司",
          value: "20.png",
        },
      ],
      showCanvas: false,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    /* const goToCanvas = this.goToCanvas; */
   },
  methods: {
    hanuoclick() {
      window.open("http://101.34.0.68:8083/", "_blank");
    },
    /* goToCanvas(){
      this.showCanvas=true;
      this.$refs.canvas.goIn();
    },
    goBackHome(){
      this.showCanvas = false;
    }, */
    goToSubjectThree(){
      window.open(`http://${serverInfo.baseIP}:8010/`,"_blank");
    }
  },
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  padding: 18px;

  .left {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #1f4e79;
  }

  .title {
    text-align: center;
    padding-top: 25px;
    font-size: 60px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #1f4e79;
  }

  .subtitle {
    position: relative;
    left: 20px;
    padding-top: 25px;
    font-size: 20px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #1f4e79;
  }

  .main-cards {
    margin-top: 45px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;

    .box-card {
      width: 600px;
      cursor: pointer;
      height: 375px;

      &:nth-child(2n) {
        margin-left: 2%;
        margin-right: 2%;
      }

      .clearfix {
        text-align: center;

        span {
          font-size: 16px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #1f4e79;
        }

        button {
          font-size: 12px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #5f94ff;
        }
      }

      ::v-deep.el-card__body {
        padding: 0;
        text-align: center;
      }

      .text {
        padding: 10px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .children-cards {
    margin-top: 45px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;

    .box-card {
      width: 210px;
      cursor: pointer;
      height: 135px;

      &:nth-child(2n) {
        margin-left: 2%;
        margin-right: 2%;
      }

      .clearfix {
        text-align: center;

        span {
          font-size: 16px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #1f4e79;
        }

        button {
          font-size: 12px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #5f94ff;
        }
      }

      ::v-deep.el-card__body {
        padding: 0;
        text-align: center;
      }

      .text {
        padding: 10px;

        img {
          width: 100%;
          height: 200px;
        }
      }
    }
  }

  .footer {
    margin-top: 70px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    div {
      margin: 0 50px 10px 0;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #3d3d3d;

      img {
        width: 44px;
        height: 44px;
      }

      .imgs {
        height: 60px;
      }

      span {
        margin-left: 10px;
      }
    }
  }
}
</style>
