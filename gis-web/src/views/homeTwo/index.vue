<!--  -->
<template>
  <div class="home">
    <div class="left">
      <p>2020年“物联网与智慧城市关键技术及示范”重点专项</p>
      <p>韧性城市智能规划与仿真关键技术及应用</p>
    </div>
    <div class="title">韧性城市自适应规划决策平台</div>
    <div class="cards">
      <el-card
        class="box-card"
        @click.native="$router.push('/platform/upload')"
      >
        <div slot="header" class="clearfix">
          <span>韧性城市基础图层数据</span>
        </div>
        <div class="text item">
          <img src="../../assets/home/1.png" alt=""/>
        </div>
      </el-card>
      <el-card
        class="box-card"
        @click.native="$router.push('/platform/coverage')"
      >
        <div slot="header" class="clearfix">
          <span>韧性城市规划方案生成</span>
        </div>
        <div class="text item">
          <img src="../../assets/home/2.png" alt=""/>
        </div>
      </el-card>
      <el-card
        class="box-card"
        @click.native="$router.push('/platform/decisions')"
      >
        <div slot="header" class="clearfix">
          <span>韧性城市规划决策分析</span>
        </div>
        <div class="text item">
          <img src="../../assets/home/4.png" alt=""/>
        </div>
      </el-card>
      <el-card class="box-card"
               @click.native="$router.push('/platform/standard')"
      >
        <div slot="header" class="clearfix">
          <span>知识库</span>
        </div>
        <div class="text item">
          <img src="../../assets/home/3.png" alt=""/>
        </div>
      </el-card>
    </div>
    <div class="footer">
      <div>
        <img class="imgs" src="../../assets/home/13.png" alt=""/>
        <span>山东省计算中心（国家超级计算济南中心） </span>
      </div>
      <div>
        <img src="../../assets/home/11.png" alt=""/>
        <span>同济大学 </span>
      </div>

      <div>
        <img src="../../assets/home/16.png" alt=""/>
        <span>北京交通大学 </span>
      </div>
      <div>
        <img src="../../assets/home/19.png" alt=""/>
        <span>广东省城乡规划设计研究院有限公司 </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  props: [''],
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  padding: 18px;

  .left {
    font-size: 14px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #1f4e79;
  }

  .title {
    text-align: center;
    padding-top: 45px;
    font-size: 60px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #1f4e79;
  }

  .cards {
    margin-top: 45px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;

    .box-card {
      width: 310px;
      height: 270px;
      margin-right: 20px;

      &:nth-child(4n) {
        margin-right: 0;
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

      .text {
        padding: 15px;

        img {
          width: 240px;
          height: 160px;
        }
      }
    }
  }

  .left {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #1f4e79;
  }

  .footer {
    margin-top: 70px;
    display: flex;
    justify-content: center;

    div {
      margin-left: 15px;
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
