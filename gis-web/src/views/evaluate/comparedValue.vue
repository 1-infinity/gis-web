<template>
  <div class="app-container">
    <el-row :gutter="10">

      <!-- 雷达图 -->
      <el-col :span="12">
        <el-card style="height: 700px;">
          <div slot="header">
            <span>韧性城市现状评分对比</span>
            <!-- 选择器，选择城市 -->
            <div style="position: relative; float: right; bottom: 10px;">
              <el-cascader :options="options" :props="props" style="width: 300px" placeholder="城市"
                :show-all-levels="false" v-model="cityValue" @change="changeCity">
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </div>
          </div>
          <span>雷达图</span>
          <el-divider></el-divider>
          <div id="compareRadar" style="
              height: 500px;
              width: 100%;
              position: relative;
            "></div>
        </el-card>
      </el-col>

      <!-- 柱状图 -->
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>韧性城市评分对比</span>
          </div>
          <span>柱状图</span>
          <el-divider></el-divider>
          <div id="compareBarChart" style="
              height: 550px;
              width: 100%;
              position: relative;
            "></div>
        </el-card>
      </el-col>

      <!-- 表格和环形图 -->
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>现状评分对比细则（不同城市现状评分对比）
              <el-tooltip class="item" effect="light" :content="valueDetails" placement="left-start">
                <i class="el-icon-warning-outline" style="position: relative; left: 5px; top: 0px"></i>
              </el-tooltip>
              <el-button type="success"
                style="background-color: rgb(25,123,196);position: relative; float: right; bottom: 10px;"
                @click="outputResult()" round>导出结果</el-button>
            </span>
          </div>

          <!-- 表格 -->
          <el-table :data="tableData" border max-height="585" style="width: 100%; font-size: 15px" id="comparedtable">
            <el-table-column prop="system" label="系统" width="120" :filters="filters" :filter-method="filterMethod">
            </el-table-column>

            <el-table-column prop="target" label="指标" width="350">
            </el-table-column>

            <el-table-column v-for="(detail, index) in compareDetails" :key="index" :label="detail.city" width="120">
              <template slot-scope="scope">
                <span>{{ loadScore(scope, detail.score) }}</span>
              </template>
            </el-table-column>

          </el-table>
        </el-card>
      </el-col>

      <!-- 环形图 -->
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>各系统内指标评分占比</span>

            <!-- 单选框 -->
            <el-select v-model="selectedCity" @change="changeCityForsystem" placeholder="选择城市" style="float: right;">
              <div>选择城市： </div>
              <el-option v-for="c in city" :key="c" :label="c" :value="c"></el-option>
            </el-select>


          </div>
          <el-divider></el-divider>
          <!-- 分页组件 -->
          <div id="comparePieChart" style="
              height: 540px;
              width: 100%;
              position: relative;
            "></div>
          <el-pagination v-model="currentPage" :page-size="pageSize" :total="totalCharts"
            @current-change="handlePageChange" layout="prev, pager, next"></el-pagination>

        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts'
// import { Radar } from "@antv/g2plot";
import { Radar as G2Radar } from "@antv/g2plot";
//导入该界面所需要的界面
import { targetData, COMPRoptions, moniData } from "./CityScoreData.js";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import ajax1 from "./ajax1"
// import FilterHeader from '@/components/FilterHeader'

require("echarts/theme/blue")

export default {
  name: "comparedValue",
  //vue对象中的data数据
  data() {
    return {
      //用来存储该项目中涉及到的所有城市
      city: [],
      cityValue: [],
      tableData: [],
      //模拟的城市数据
      moniData: moniData,
      //多选框的选项列表
      options: COMPRoptions,
      //提示信息
      valueDetails: "现状评分：每项1~5分，分数越高，城市韧性越强。",
      props: { multiple: true },
      radarPlot: Object,
      chart: Object,
      pieChart: Object,
      //雷达图比较的项数
      radarAxis: 10,
      //默认得分
      defaultScore: [0, 0, 0, 0, 0, 0, 0],
      //参与比较的城市
      compareCity: [],
      //参与比较的城市的得分
      compareCityScore: [],
      //更多细节
      compareDetails: [],
      //筛选表格的选项（应包含所有系统的名称）
      filters: [],
      selectedCity: "上海",
      currentPage: 1, // 当前页码
      pageSize: 1, // 每页显示的图表数量
      totalCharts: 7, // 总图表数量
    };
  },
  components: {},

  mounted() {
    // var count = 0
    // 添加全选选项
    this.filters.unshift({ text: '全选', value: 'all' });
    //循环遍历targetData数组中的每个元素，将其赋值给变量data
    for (var data of targetData) {
      //内层的for循环遍历data数组中的每个元素，将其赋值给变量t
      for (var t of data) {
        //通过push()方法将一个新对象添加到tableData数组中。
        //这个新对象有两个属性，即system和target。
        //属性system的值来自于变量t中的system属性，属性target的值来自于变量t中的target属性。
        //示例：target（指标）: "水源地模块化布置及连通程度",system(系统): "生命线系统"
        this.tableData.push({ system: t.system, target: t.target });
        //该数据用于加入到右边的表格中
        var systemExists = this.filters.some((filter) => filter.text === t.system);
        if (!systemExists) {
          this.filters.push({ text: t.system, value: t.system });
        }
      }
    }
    this.filteredTableData = this.tableData.slice(); // 初始情况下显示所有行
    // 将options下所有children下的内容存储在city数组中
    this.options.forEach(option => {
      if (option.children) {
        this.city.push(...option.children.map(child => child.value));
      }
    });
    // console.log(this.city)
    // console.log(this.tableData);
    this.radarAxis = 10;
    try {
      this.compareRadarInit();
      this.drawBarChart();
      this.initPieChart();
    }
    catch {

    }

    // console.log(mounted)

    this.loadCurrentValue();
  },

  methods: {
    filterMethod(value, row) {
      // 如果选择的是全选，则显示所有行
      if (value === 'all') {
        return true;
      }
      // 否则只显示系统为选择值的行
      return row.system === value;
    },
    clearScore: function () {

    },
    // 加载现状评分
    async loadCurrentValue() {
      const cityNameMap = {
        "上海": "shanghai",
        "无锡": "wuxi",
        "重庆": "chongqing",
        "珠三角城市群": "zhusanjiao",
        "宁波": "ningbo",
        "四会": "sihui",
        "广州": "guangzhou",
        "乌鲁木齐": "wulumuqi",
        "东营": "dongying",
        "威海": "weihai",
        "淄博": "zibo",
        "连云港": "lianyungang",
        "鄂州": "ezhou",
        "佛山": "foshan",
        "肇庆": "zhaoqing",
        "深圳": "shenzhen",
        "东莞": "dongguan",
        "惠州": "huizhou",
        "珠海": "zhuhai",
        "中山": "zhongshan",
        "江门": "jiangmen",
      };
      this.moniData.forEach(async (item, index, arr) => {
        const cityData = await ajax1(`/evalution/getCityToughnessEvaluation/${cityNameMap[item.city]}`);
        let hasValue = cityData.success;
        let k = 0;
        for (let i = 0; i < 7; i++) {
          let cityScore = 0;
          for (let j = 0; j < targetData[i].length; j++) {
            if(hasValue){
              item.details[i].children[j].value = cityData["data"][k].val;
            }
            else{
              item.details[i].children[j].value = 0;
            }
            cityScore += item.details[i].children[j].value;
            k = k + 1;
          }
          item.cityScore[i] = cityScore;
        };
      })

    },

    //导出表格
    outputResult: function () {
      if (this.city === "") {
        alert("请选择城市");
      } else {
        // 设置当前日期
        let time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let name = year + "" + month + "" + day + "对比结果";
        // console.log(name)
        /* generate workbook object from table */
        //  .table要导出的是哪一个表格
        var wb = XLSX.utils.table_to_book(document.getElementById('comparedtable'));
        this.$message({
          message: '导出成功',
          type: 'success'
        });
        /* get binary string as output */
        var wbout = XLSX.write(wb,
          {
            bookType: "xlsx",
            bookSST: true,
            type: "array"
          });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: "application/octet-stream" }), name + ".xlsx");
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      }
    },

    // 让每行显示对应数组的分数值
    loadScore: function (scope, arr) {
      return arr[scope.$index];
    },
    //获取选择器选择的城市的信息
    changeCity: function () {
      /*TO DO
      加载后端评分城市
      */
      //获取需要比较的城市的信息
      this.compareCity = [];
      this.compareCityScore = [];
      this.compareDetails = [];
      //雷达图比较项目个数
      this.radarAxis = 10;

      for (var arr of this.cityValue) {
        if (this.compareCity.indexOf(arr[1]) === -1) {
          this.compareCity.push(arr[1]);
        }
      }
      if (this.compareCity.length !== 0) {
        for (var city of this.compareCity) {
          let flag = false;
          for (var data of this.moniData) {
            if (city === data.city) {
              flag = true;
              this.compareCityScore.push(data.cityScore);
              let arr = [];
              for (var sys of data.details) {
                for (var ch of sys.children) {
                  arr.push(ch.value);
                }
              }
              this.compareDetails.push({ city: city, score: arr });
            }
          }
          //该城市还没进行评分
          if (!flag) {
            this.$message({
              message: city + '还没有进行现状评分',
              type: 'warning'
            });
          }
          //城市已经评分
          else {
            this.radarAxis =
              (Math.floor(Math.max(...this.compareCityScore[0]) / 10) + 1) * 10;

          }
        }
      }
      this.radarPlot.destroy();
      this.compareRadarInit();
      this.chart.dispose();
      this.drawBarChart();
    },
    changeCityForsystem: function () {
      console.log(this.selectedCity)
      this.pieChart.dispose()
      this.initPieChart()
    },
    //初始化雷达图
    compareRadarInit: function () {
      const data = [];
      //当没有被选中的城市的时候，初始化为默认的情况
      if (this.compareCity.length === 0) {
        data.push(
          { city: "城市", system: "生命线系统", score: this.defaultScore[0] },
          { city: "城市", system: "重要建筑物", score: this.defaultScore[1] },
          { city: "城市", system: "连接系统", score: this.defaultScore[2] },
          { city: "城市", system: "医疗服务系统", score: this.defaultScore[3] },
          { city: "城市", system: "污染处理系统", score: this.defaultScore[4] },
          { city: "城市", system: "开放空间系统", score: this.defaultScore[5] },
          { city: "城市", system: "其他", score: this.defaultScore[6] }
        );
      }
      //否则按照选中的城市初始化。
      else {
        //遍历每一个被选中的城市，并将其信息放入雷达图中
        for (var i = 0; i < this.compareCity.length; i++) {
          data.push(
            {
              city: this.compareCity[i],
              system: "生命线系统",
              score: this.compareCityScore[i][0],
            },
            {
              city: this.compareCity[i],
              system: "重要建筑物",
              score: this.compareCityScore[i][1],
            },
            {
              city: this.compareCity[i],
              system: "连接系统",
              score: this.compareCityScore[i][2],
            },
            {
              city: this.compareCity[i],
              system: "医疗服务系统",
              score: this.compareCityScore[i][3],
            },
            {
              city: this.compareCity[i],
              system: "污染处理系统",
              score: this.compareCityScore[i][4],
            },
            {
              city: this.compareCity[i],
              system: "开放空间系统",
              score: this.compareCityScore[i][5],
            },
            {
              city: this.compareCity[i],
              system: "其他",
              score: this.compareCityScore[i][6],
            }
          );
        }
      }

      //定义雷达图
      this.radarPlot = new G2Radar("compareRadar", {
        data,
        autoFit: false,
        xField: "system",
        yField: "score",
        seriesField: "city",
        meta: {
          score: {
            alias: "分数",
          },
        },
        yAxis: {
          min: 0,
          max: this.radarAxis,
        },
        point: {},
        area: {},
      });
      this.radarPlot.render();
    },
    // 画柱状图
    drawBarChart() {
      this.chart = echarts.init(document.getElementById('compareBarChart'), "blue");
      console.log("init成功");
      let option = {
        title: {
          text: '',
          subtext: '得分'
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: false },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: {
          data: ['生命线系统', '重要建筑物', '连接系统', '医疗服务系统', '污染处理系统', '开放空间系统', '其他'],
          axisLabel: { // 调整文字样式和方向
            rotate: -45, // 逆时针旋转45度
            textStyle: {
              fontSize: 12, // 调整字体大小
            },
          },
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        legend: { // 添加图例设置
          data: this.compareCity, // 设置图例的数据，即选中的城市名称
        },
        tooltip: {
          trigger: 'axis',  // 触发方式为坐标轴
        },
        series: this.getBarChartData(), // 根据数据动态生成柱状图的数据系列
      };

      // 添加鼠标悬浮时的事件处理
      this.chart.on('mousemove', (params) => {
        // 获取当前鼠标所在的点的数据
        let data = params[0]?.data;
        if (data) {
          // 清除之前的画线
          chart.dispatchAction({
            type: 'hideTip', // 隐藏 tooltip
          });
          chart.dispatchAction({
            type: 'highlight', // 高亮当前的柱状图
            dataIndex: params[0].dataIndex,
          });
          chart.dispatchAction({
            type: 'drawLine', // 绘制虚线
            seriesIndex: 0, // 数据系列的索引
            dataIndex: params[0].dataIndex, // 数据索引
            name: params[0].seriesName, // 数据系列名称
            value: [params[0].dataIndex, data], // 虚线的位置，横坐标固定，纵坐标为当前柱状图的值
            style: {
              stroke: 'rgba(0, 0, 0, 0.5)', // 虚线颜色
              lineWidth: 1, // 虚线宽度
              lineDash: [4, 4], // 虚线样式
            },
          });
        }
      });

      this.chart.setOption(option);
    },

    getBarChartData() {
      // 根据需要从 this.compareDetails 中获取数据，生成柱状图的数据系列
      // 返回一个包含柱状图数据的数组
      // 示例：
      const data = []
      if (this.compareCity.length === 0) {
        data.push(
          {
            name: "",
            type: 'bar',
            data: [0, 0, 0, 0, 0, 0, 0]
          }
        );
      }
      //否则按照选中的城市初始化。
      else {
        //遍历每一个被选中的城市，并将其信息放入雷达图中
        for (var i = 0; i < this.compareCity.length; i++) {
          data.push({
            name: this.compareCity[i],
            type: 'bar',
            data: [this.compareCityScore[i][0],
            this.compareCityScore[i][1],
            this.compareCityScore[i][2],
            this.compareCityScore[i][3],
            this.compareCityScore[i][4],
            this.compareCityScore[i][5],
            this.compareCityScore[i][6],
            ],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            }
          });
        }
      }

      console.log(data)
      return data
    },
    initPieChart() {

      //载入选择的城市的信息
      let selectedCityinfo = []
      //保存用于渲染图表的数据
      let datas = [];
      let title = [];
      //检查是否正确读取
      console.log(this.moniData)
      console.log(this.moniData.length)

      for (var i = 0; i < this.moniData.length; i++) {
        console.log(this.moniData[i].city)
        console.log(this.selectedCity)
        if (this.moniData[i].city == this.selectedCity) {
          selectedCityinfo = this.moniData[i].details
          break;
        }
      }
      console.log(selectedCityinfo)

      for (var i = 0; i < selectedCityinfo.length; i++) {
        title.push(selectedCityinfo[i].system)
        datas.push(selectedCityinfo[i].children)
      }
      //根据当前页面截取所需要的数据
      let SelectedSystem = datas[this.currentPage - 1]
      let SelectedTitle = title[this.currentPage - 1]
      console.log(SelectedSystem)
      console.log(SelectedTitle)
      // 从页面中获取该图表的容器
      const chartDom = document.getElementById('comparePieChart');
      this.pieChart = echarts.init(chartDom, "blue");

      // 构建环形图的数据
      const pieData = SelectedSystem.map(item => ({
        name: item.name,
        value: item.value
      }));

      const option = {
        title: {
          text: SelectedTitle,
          left: 'center',
          textStyle: {
            color: '#999',
            fontWeight: 'normal',
            fontSize: 20
          }
        },
        series: [
          {
            type: 'pie',
            radius: [30, 80],
            top: 'middle',
            height: 600,
            left: 'center',
            width: 600,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              alignTo: 'edge',
              formatter: '{name|{b}}\n{time|{c} 分}',
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              rich: {
                time: {
                  fontSize: 10,
                  color: '#999'
                }
              }
            },
            labelLine: {
              length: 15,
              length2: 0,
              maxSurfaceAngle: 80
            },
            labelLayout: function (params) {
              const isLeft = params.labelRect.x < this.pieChart.getWidth() / 2;
              const points = params.labelLinePoints;
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
              return {
                labelLinePoints: points
              };
            },
            data: pieData
          }
        ]
      };

      option && this.pieChart.setOption(option);
    },
    handlePageChange(page) {
      console.log(page)
      this.currentPage = page;
      this.initPieChart();
    },

  },

};
</script>

<style lang="scss" scoped></style>
