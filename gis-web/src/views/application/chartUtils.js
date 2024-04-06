// Echarts图表相关函数
import * as echarts from 'echarts';
import echartTheme from '@/assets/echartTheme.json';
// 当前支持的主题: customed, macarons, westeros, roma, infographic, dark
import * as macarons from '@/assets/macarons'
import * as westeros from '@/assets/westeros'
import * as roma from '@/assets/roma'
import * as infographic from '@/assets/infographic'
import { toFixed } from "ol/math";
echarts.registerTheme('customed', echartTheme)

const colors = {
  "customed": ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4",],
  "macarons": ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa", "#07a2a4", "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553",],
  "westeros": ["#516b91", "#59c4e6", "#edafda", "#93b7e3", "#a5e7f0", "#cbb0e3",],
  "roma": ['#E01F54', '#001852', '#f5e8c8', '#b8d2c7', '#c6b38e', '#a4d8c2', '#f3d999', '#d3758f', '#dcc392', '#2e4783', '#82b6e9', '#ff6347', '#a092f1',],
  "infographic": ["#c1232b", "#27727b", "#fcce10", "#e87c25", "#b5c334", "#fe8463", "#9bca63", "#fad860", "#f3a43b", "#60c0dd", "#d7504b", "#c6e579",],
}


// 绘制折线图
// data: 折线图中展示的数据
// chartID: 渲染为折线图的<div>标签的id
// grid: 其中设置了 图表与外部容器的 外边距
// theme: 图表使用的主题，设置这个参数的目的是 如果要显示两张同样格式的表，可以配置不同的配色丰富视觉上的效果
export const buildChartLine = (data, chartID, theme) => {
  let chart = null;
  chart = echarts.init(document.getElementById(chartID), theme);
  let option = getLineOption(data)
  // 绘制图表
  chart.setOption(option);
  return chart;
};

export const updateLineChart = (chart, data) => {
  let newOption = getLineOption(data)
  chart.setOption(newOption, { notMerge: true })
  chart.hideLoading()
}

//根据数据格式，设置折线图的option
function getLineOption(data) {
  let xData = data.xData;
  let yData = data.yData;
  let series = [];
  for (let name in xData) {
    series.push({
      name: name,
      type: 'line',
      data: xData[name],
      smooth: true,
      symbol: 'emptyCircle',
      symbolSize: 6,
    })
  }
  let gridBottom = {
    top: '13%',
    bottom: '15%',
    left: '7%',
    right: '7%'
  }
  let option = {
    grid: gridBottom,
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: Object.keys(xData),
      orient: 'vertical',
      right: '1%',
      top: '1%',
    },
    xAxis: {
      type: 'category',
      data: yData,
      name: data.xName,
      boundaryGap: false,
      nameLocation: 'center',
      nameTextStyle: {
        color: 'black',
        fontSize: 14,
        fontWeight: 500,
      },
      nameGap: 25,
    },
    yAxis: {
      type: 'value',
      name: data.yName,
      nameLocation: 'center',
      nameTextStyle: {
        color: 'black',
        fontSize: 14,
        fontWeight: 500,
      },
      nameGap: 35,
    },
    series: series,
  };
  if("useZoom" in data && data.useZoom === true)
    option.dataZoom = [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ];

  return option
}

//根据数据格式，设置柱状图的Option
function getHistogramChartOption(data) {
  //设置网格数据gird
  let grid = {
    top: '13%',
    bottom: '15%',
    left: '7%',
    right: '1%'
  }
  //设置内容数据series
  let series = []
  for (let name in data.xData) {
    series.push({
      name: name,
      type: 'bar',
      barWidth: '10%',
      data: data.xData[name],
    })
  }
  //设置图例legend
  let legend = {
    data: Object.keys(data.xData),
    orient: 'horizontal',
    right: '1%',
    top: '1%',
  }
  let tooltip = {
    show: true,
    trigger: 'item',
    // textStyle: {     //文字样式
    //   color: '#6A6A6A',
    //   decoration: 'none',
    //   fontFamily: 'Verdana, sans-serif',
    // },
    // // formatter: '{c}',
    // formatter: function (data) {
    //   return data.value.toFixed(2)
    // },
  }
  //设置x轴标识
  let xAxis = [
    {
      type: 'category',
      data: data.yData,
      name: data.xName,
      nameLocation: 'center',
      nameTextStyle: {
        color: 'black',
        fontSize: 14,
        fontWeight: 500,
      },
      nameGap: 25,
    }
  ]
  //设置y轴标识
  let yAxis = [
    {
      type: 'value',
      name: data.yName,
      nameLocation: 'center',
      nameTextStyle: {
        color: 'black',
        fontSize: 14,
        fontWeight: 500,
      },
      nameGap: 35,
    }
  ]
  return {
    grid: grid,
    series: series,
    legend: legend,
    tooltip: tooltip,
    xAxis: xAxis,
    yAxis: yAxis,
  }
}

//绘制柱状图
export const buildHistogram = (data, chartID, theme) => {
  let chart = null
  chart = echarts.init(document.getElementById(chartID), theme)
  //获取柱状图的option信息
  let option = getHistogramChartOption(data)
  // console.log(option)
  // 绘制图表
  chart.setOption(option)
  return chart
}

//修改柱状图数值
export const updateHistogram = (chart, data) => {
  let newOption = getHistogramChartOption(data)
  // chart.clear()
  chart.setOption(newOption, { notMerge: true })
  chart.hideLoading()
}

//创建并返回仪表图的配置项
function getGaugeOption(names, maxValues, normalValues, realValues, theme) {
  let option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#eee',
      borderColor: '#777',
      borderWidth: 1,
      borderRadius: 4,
      formatter: function(params){
        // console.log(params)
        const tooltip_title = `color: ${colors[theme][params.dataIndex]}; align: center; font-size: 16px; font-weight: bold;`
        const tooltip_current = ``
        const tooltip_normal = `font-weight: bold;`
        const tooltip_recommend = `font-style: italic;`
        // return [
        //   `<span style="${tooltip_title}">${names[params.dataIndex]}</span>`,
        //   `<hr/><span style="${tooltip_current}">当前值: ${realValues[params.dataIndex].toFixed(4)} ㎡/人 </span>`,
        //   `<br/><span style="${tooltip_normal}">常态值: ${normalValues[params.dataIndex].toFixed(4)} ㎡/人 </span>`,
        //   `<br/><span style="${tooltip_recommend}">推荐值: ${maxValues[params.dataIndex].toFixed(4)} ㎡/人 </span>`,
        // ].join('')
        // 去掉单位
        return [
          `<span style="${tooltip_title}">${names[params.dataIndex]}</span>`,
          `<hr/><span style="${tooltip_current}">当前值: ${realValues[params.dataIndex].toFixed(4)} </span>`,
          `<br/><span style="${tooltip_normal}">常态值: ${normalValues[params.dataIndex].toFixed(4)} </span>`,
          `<br/><span style="${tooltip_recommend}">推荐值: ${maxValues[params.dataIndex].toFixed(4)} </span>`,
        ].join('')
      },
      rich:{
        title:{
          fontSize: 14,
          fontWeight: 'bold'
        },
        c:{
          fontSize: 12,
        },
        n:{
          fontSize: 12,
        },
        m:{
          fontSize: 12,
        }
      }
    },

    series: [
      {
      name:'当前值',
      type: 'gauge',
      center: ['65%', '50%'],
      startAngle: -135,
      endAngle: -45,
      pointer: {
        show: false
      },
      progress: {
        show: true,
        overlap: false,
        roundCap: false,
        clip: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 50,
          borderWidth: 0,
          shadowColor: '#EEEDBD',
          shadowBlur: 10,
        }
      },
      splitLine: {
        show: false,
        distance: 0,
        length: 10
      },
      axisTick: {
        show: true,
        distance: -54,
        length: 4,
      },
      axisLabel: {
        show: true,
        // inside: true,
        distance: -30,
      },
      data: [
        { value: (realValues[0]/maxValues[0]).toFixed(2),
          name: names[0],
          title: {
            offsetCenter: ['-180%', '-125%'],
            fontWeight:"bold"
          },
          detail: {
            //显示当前值
            formatter: function(){
              const current = ``
              return [
                `${current}${realValues[0].toFixed(2)}`,
              ].join('')
            },
            offsetCenter: ['-180%', '-95%']
          },
        },
        { value: (realValues[1]/maxValues[1]).toFixed(2),
          name: names[1],
          title: {
            offsetCenter: ['-180%', '-60%'],
            fontWeight:"bold"
          },
          detail: {
            formatter: function(){
              const current = ``
              return [
                `${current}${realValues[1].toFixed(2)}`,
              ].join('')
            },
            offsetCenter: ['-180%', '-30%']
          },
        },
        { value: (realValues[2]/maxValues[2]).toFixed(2),
          name: names[2],
          title: {
            offsetCenter: ['-180%', '5%'],
            fontWeight:"bold"
          },
          detail: {
            formatter: function(){
              const current = ``
              return [
                `${current}${realValues[2].toFixed(2)}`,
              ].join('')
            },
            offsetCenter: ['-180%', '35%']
          },
        },
        { value: (realValues[3]/maxValues[3]).toFixed(2),
          name: names[3],
          title: {
            offsetCenter: ['-180%', '70%'],
            fontWeight:"bold"
          },
          detail: {
            formatter: function(){
              const current = ``
              return [
                `${current}${realValues[3].toFixed(2)}`,
              ].join('')
            },
            offsetCenter: ['-180%', '100%']
          },
        },
      ],
      max:1,
      title: {
        fontSize: 14,
        offSetCenter: ['50%', '50%']
      },
      detail: {
        width: 50,
        height: 14,
        fontSize: 14,
        color: 'inherit',
        borderColor: 'inherit',
        borderRadius: 20,
        borderWidth: 1,
        valueAnimation: true,
      }},

      //常态值
      {
        name:'常态值',
        type: 'gauge',
        center: ['65%', '50%'],
        startAngle: -135,
        endAngle: -45,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: false,
          clip: false,
          itemStyle: {
            color:'rgb(255,255,255,0)',
            borderWidth: 1.1,
            borderColor: '#525252',
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: [
              [1,new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 1,
                  color: "rgba(255, 255, 255, 0)"
                }
              ])
            ]],
            width: 50,
            borderWidth: 0,
            shadowColor: '#EEEDBD',
            shadowBlur: 10,
          }
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        data: [
          { value: (normalValues[0]/maxValues[0]).toFixed(2),
          detail: {
            show:false
          },
        },
          { value: (normalValues[1]/maxValues[1]).toFixed(2),
          detail: {
            show: false
          },
        },
          { value: (normalValues[2]/maxValues[2]).toFixed(2),
          detail: {
            show: false
          },
        },
          { value: (normalValues[3]/maxValues[3]).toFixed(2),
          detail: {
            show: false
          },
        },
        ],
        max:1,
        title: {
          show:false
        },
        detail: {
          width: 50,
          height: 14,
          fontSize: 14,
          color: 'inherit',
          borderColor: 'inherit',
          borderRadius: 20,
          borderWidth: 1,
          valueAnimation: true,
        }},

    ],
  }
  return option
}

//绘制仪表图
export const buildGauge = (names, maxValues, normalValues, realValues, chartID, theme) => {
  let chart = echarts.init(document.getElementById(chartID), theme)
  let option = getGaugeOption(names, maxValues, normalValues, realValues, theme)
  chart.setOption(option)
  return chart
}

export const updateGauge = (names, maxValues, normalValues, realValues, theme) => {
  let newOption = getGaugeOption(names, maxValues, normalValues, realValues, theme)
  chart.setOption(newOption, { nowMerge: true })
  chart.hideLoading()
}

//创建并返回饼图(人均可获得 应急/日常 服务水平)的配置项
function getPieOption(names, maxValues, normalValues, realValues, theme) {
  //为了使标签大小适应屏幕分辨率
  let nowClientWidth = document.documentElement.clientWidth;
  function nowSize(val,initWidth=1920){
    return val * (nowClientWidth/initWidth);
  }
  let normalRadius = getRadius(maxValues, normalValues, 80)
  let realRadius = getRadius(maxValues, realValues, 80)
  let option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#eee',
      borderColor: '#777',
      borderWidth: 1,
      borderRadius: 4,
      formatter: function (params) {
        // console.log(params)
        const tooltip_title = `color: ${colors[theme][params.dataIndex]}; align: center; font-size: nowSize(16); font-weight: bold;`
        const tooltip_current = ``
        const tooltip_normal = `font-weight: bold;`
        const tooltip_recommend = `font-style: italic;`
        // return [
        //   `<span style="${tooltip_title}">${names[params.dataIndex]}</span>`,
        //   `<hr/><span style="${tooltip_current}">当前值: ${realValues[params.dataIndex].toFixed(4)} ㎡/人 </span>`,
        //   `<br/><span style="${tooltip_normal}">常态值: ${normalValues[params.dataIndex].toFixed(4)} ㎡/人 </span>`,
        //   `<br/><span style="${tooltip_recommend}">推荐值: ${maxValues[params.dataIndex].toFixed(4)} ㎡/人 </span>`,
        // ].join('')
        // 去掉单位
        return [
          `<span style="${tooltip_title}">${names[params.dataIndex]}</span>`,
          `<hr/><span style="${tooltip_current}">当前值: ${realValues[params.dataIndex].toFixed(4)} </span>`,
          `<br/><span style="${tooltip_normal}">常态值: ${normalValues[params.dataIndex].toFixed(4)} </span>`,
          `<br/><span style="${tooltip_recommend}">推荐值: ${maxValues[params.dataIndex].toFixed(4)} </span>`,
        ].join('')
      },
      rich: {
        title: {
          fontSize: nowSize(14),
          fontWeight: 'bold'
        },
        c: {
          fontSize: nowSize(12),
        },
        n: {
          fontSize: nowSize(12),
        },
        m: {
          fontSize: nowSize(12),
        }
      }
    },
    // legend: {
    //     data: [
    //         'Direct',
    //         'Marketing',
    //         'Search Engine',
    //         'Email',
    //         'Union Ads',
    //         'Video Ads',
    //         'Baidu',
    //         'Google',
    //         'Bing',
    //         'Others'
    //     ]
    // },
    series: [
      {
        name: '推荐值',
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['80%', '98%'],
        emphasis: {
          disabled: true,
          scale: false,
        },
        labelLine: {
          show: true,
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: 'rgb(1,1,1,1)',
        },
        label: {
          show: true,
          position: 'inside',
          backgroundColor: '#F6F8FC',
          borderColor: '#8C8D8E',
          borderWidth: 1,
          borderRadius: 2,
          formatter: function (params) {
            // console.log(params)
            // return [
            //   '{title|' + params.data.name + '}',
            //   '{text| 推荐值: }{number|' + maxValues[params.dataIndex].toFixed(4) + '} {text|㎡/人} '
            // ].join('\n')
            // 去掉单位
            return [
              '{title|' + params.data.name + '}',
              '{text| 推荐值: }{number|' + maxValues[params.dataIndex].toFixed(4) + '} '
            ].join('\n')
          },
          rich: {
            title: {
              color: '#000000',
              fontSize: nowSize(14),
              fontWeight: 'bold',
              lineHeight: nowSize(18)
            },
            text: {
              color: '#000000',
              fontSize: nowSize(9),
              lineHeight: nowSize(18),
              fontWeight: "italic",
            },
            number: {
              color: '#fff',
              backgroundColor: '#707176',
              padding: [3, 4],
              borderRadius: 4,
              fontSize: nowSize(9),
            }
          }
        },
        // label: {
        //     formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
        //     backgroundColor: '#F6F8FC',
        //     borderColor: '#8C8D8E',
        //     borderWidth: 1,
        //     borderRadius: 4,
        //     rich: {
        //         a: {
        //             color: '#6E7079',
        //             lineHeight: 22,
        //             align: 'center'
        //         },
        //         hr: {
        //             borderColor: '#8C8D8E',
        //             width: '100%',
        //             borderWidth: 1,
        //             height: 0
        //         },
        //         b: {
        //             color: '#4C5058',
        //             fontSize: 14,
        //             fontWeight: 'bold',
        //             lineHeight: 33
        //         },
        //         per: {
        //             color: '#fff',
        //             backgroundColor: '#4C5058',
        //             padding: [3, 4],
        //             borderRadius: 4
        //         }
        //     }
        // },
        data: [
          {
            value: 1,
            name: names[0],
            label: {
              rotate: -45,
            }
          },
          {
            value: 1,
            name: names[1],
            label: {
              rotate: 45,
            }
          },
          {
            value: 1,
            name: names[2],
            label: {
              rotate: -45,
            }
          },
          {
            value: 1,
            name: names[3],
            label: {
              rotate: 45,
            }
          },
        ]
      },
      {
        name: '20%线',
        type: 'pie',
        center: ['50%', '50%'],
        // selectedMode: 'single',
        radius: ['16%', '17%'],
        emphasis: {
          disabled: true,
          scale: false,
        },
        itemStyle: {
          borderColor: '#888888',
          color: '#888888',
        },
        label: {
          position: 'inner',
          fontSize: nowSize(10),
          formatter: params => {
            return "       20%"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1, },
        ]
      },
      {
        name: '40%线',
        type: 'pie',
        center: ['50%', '50%'],
        // selectedMode: 'single',
        radius: ['32%', '33%'],
        emphasis: {
          disabled: true,
          scale: false,
        },
        itemStyle: {
          borderColor: '#888888',
          color: '#888888',
        },
        label: {
          position: 'inner',
          fontSize: nowSize(10),
          formatter: params => {
            return "       40%"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1, },
        ]
      },
      {
        name: '60%线',
        type: 'pie',
        center: ['50%', '50%'],
        // selectedMode: 'single',
        radius: ['48%', '49%'],
        emphasis: {
          disabled: true,
          scale: false,
        },
        itemStyle: {
          borderColor: '#888888',
          color: '#888888',
        },
        label: {
          position: 'inner',
          fontSize: nowSize(10),
          formatter: params => {
            return "       60%"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1, },
        ]
      },
      {
        name: '80%线',
        type: 'pie',
        center: ['50%', '50%'],
        // selectedMode: 'single',
        radius: ['64%', '65%'],
        emphasis: {
          disabled: true,
          scale: false,
        },
        itemStyle: {
          borderColor: '#888888',
          color: '#888888',
        },
        labelLine: {
          show: false
        },
        label: {
          position: 'inner',
          fontSize: nowSize(10),
          formatter: params => {
            return "       80%"
          }
        },
        data: [
          { value: 1, },
        ]
      },
      {
        name: '现状常态值',
        type: 'pie',
        roseType: 'area',
        center: ['50%', '50%'],
        // selectedMode: 'single',
        radius: [0, normalRadius + '%'],
        emphasis: {
          // disabled: true,
          scale: false,
        },
        // label: {
        //   position: 'inner',
        //   fontSize: 8,
        //   color: "#000000",
        //   formatter: function (params) {
        //     return "常态值: " + normalValues[params.dataIndex].toFixed(2) + "㎡/人"
        //   }
        // },
        label: false,
        labelLine: {
          show: false
        },
        itemStyle: {
          color: 'rgb(0,0,0,0)',
          borderWidth: 2.5,
        },
        data: [
          {
            value: getValue(maxValues, normalValues, 0),
            name: names[0] + '现状常态值',
            normalValue: normalValues[0],
            itemStyle: {
              borderColor: colors[theme][0]
            },
            label: {
              rotate: -45,
            }
          },
          {
            value: getValue(maxValues, normalValues, 1),
            name: names[1] + '现状常态值',
            normalValue: normalValues[1],
            itemStyle: {
              borderColor: colors[theme][1]
            },
            label: {
              rotate: 45,
            }
          },
          {
            value: getValue(maxValues, normalValues, 2),
            name: names[2] + '现状常态值',
            normalValue: normalValues[2],
            itemStyle: {
              borderColor: colors[theme][2]
            },
            label: {
              rotate: -45,
            }
          },
          {
            value: getValue(maxValues, normalValues, 3),
            name: names[3] + '现状常态值',
            normalValue: normalValues[3],
            itemStyle: {
              borderColor: colors[theme][3]
            },
            label: {
              rotate: 45,
            }
          },
        ]
      },
      {
        name: '当前值',
        type: 'pie',
        center: ['50%', '50%'],
        roseType: 'area',
        // selectedMode: 'single',
        radius: ["0%", realRadius + '%'],
        emphasis: {
          disabled: true,
          scale: false,
          // focus: 'name',
        },
        // label: {
        //   position: 'inner',
        //   fontSize: 5
        // },
        labelLine: {
          show: false
        },
        label: false,
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: function (params) {
            return "hello"
          }
        },
        itemStyle: {
          // color: 'rgb(160, 160, 160, 0.5)'
          opacity: 0.6,
        },
        data: [
          { value: getValue(maxValues, realValues, 0), name: names[0], realValue: realValues[0] },
          { value: getValue(maxValues, realValues, 1), name: names[1], realValue: realValues[1] },
          { value: getValue(maxValues, realValues, 2), name: names[2], realValue: realValues[2] },
          { value: getValue(maxValues, realValues, 3), name: names[3], realValue: realValues[3] },
        ]
      },
      {
        name: "边框",
        type: 'pie',
        center: ['50%', '50%'],
        radius: ["0%", "98%"],
        emphasis: {
          disabled: true,
          scale: false
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: 'rgb(1,1,1,1)',
          color: 'rgb(0,0,0,0)',
        },
        data: [
          { value: 1, },
          { value: 1, },
          { value: 1, },
          { value: 1, },
        ],
      },
    ] //series[]的结尾
  }
  return option
}

//创建饼图
// names 是每个数据项的名称，显示在标签中
// maxValues 是每个数据项的推荐值
// normalValues 是每个数据项的常态值
// realValues 是每个数据项的当前值
// id 是渲染为此图表的<div>标签的id
// theme 用于指定配色
export const buildPieChart = (names, maxValues, normalValues, realValues, id, theme) => {
  let chartDom = document.getElementById(id)
  let myChart = echarts.init(chartDom, theme)
  let option = getPieOption(names, maxValues, normalValues, realValues, theme)
  myChart.setOption(option)
  return myChart
}

export const updatePieChart = (chart, names, maxValues, normalValues, realValues, theme) => {
  let newOption = getPieOption(names, maxValues, normalValues, realValues, theme)
  chart.setOption(newOption, { nowMerge: true })
  chart.hideLoading()
}


// mVector 是每项最大值的列表
// vector 是每项的值的列表
// maxRadius 是最大值的半径
const getRadius = (mVector, vector, maxRadius) => {
  let ratio = 0
  for (let i = 0; i < mVector.length; ++i) {
    ratio = vector[i] / mVector[i] > ratio ? vector[i] / mVector[i] : ratio
  }
  if (ratio > 1) ratio = 1
  return ratio * maxRadius
}

//用于计算 应该设置给pieChart数据项的值
const getValue = (mVector, vector, i) => {
  let ratio = 0
  let max = 0
  for (let j = 0; j < mVector.length; ++j) {
    if (vector[j] / mVector[j] > ratio) {
      ratio = vector[j] / mVector[j]
      max = mVector[j]
    }
  }
  let res = vector[i] / mVector[i] * max
  if (res > max) res = max
  return res
}

// 绘制折线图
// data: 折线图中展示的数据
// chartID: 渲染为折线图的<div>标签的id
// theme: 图表使用的主题，设置这个参数的目的是 如果要显示两张同样格式的表，可以配置不同的配色丰富视觉上的效果
export const buildChartLine1 = (data, chartID, theme) => {
  let chart = null;
  chart = echarts.init(document.getElementById(chartID), theme);
  let option = getLineOption1(data,theme)
  // 绘制图表
  chart.setOption(option);
  return chart;
};

//根据数据格式，设置折线图的option
function getLineOption1(data,theme) {
  let xData = data.xData;
  let yData = data.yData;
  let series = [];

  let pieces = [];
  var seriesData = xData['危险区域'];
  //动态设置visualMap的pieces值
  for (var i = 0; i < seriesData.length - 1; i++) {
    var slope = (seriesData[i + 1] - seriesData[i]) / (i + 1 - i);
    if (slope >= 0.04) {
      pieces.push({
        gt: i,
        lte: i + 1,
        color: 'red'
      })
    }
    else {
      pieces.push({
        gt: i,
        lte: i + 1,
        color: colors[theme][1]
      })
    }
  }
  for (let name in xData) {
    series.push({
      name: name,
      type: 'line',
      data: xData[name],
      smooth: true,
      symbol: 'emptyCircle',
      symbolSize: 4,
    })
  }
  let gridBottom = {
    top: '10%',
    bottom: '13%',
    left: '12%',
    right: '5%'
  }
  let option = {
    grid: gridBottom,
    tooltip: {
      trigger: 'axis',
      formatter: function(params){
        if(params[0].name>=1&&params[0].name<=8){
          let val0 = (params[0].value*data.xMax).toFixed(2);
          let val1 = (params[1].value*data.xMax).toFixed(2);
          let circle = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:`;
          let data0 = `${circle}${colors[theme][0]}"></span> ${
            params[0].seriesName
          }： ${val0} km²`;
          let data1 = `${circle}red"></span> ${
            params[1].seriesName
          }： ${val1} km²`;
          return `${params[0].axisValueLabel}时<br/>${data0}<br/>${data1}`;
        }
        else{
          let val0 = (params[0].value*data.xMax).toFixed(2);
          let val1 = (params[1].value*data.xMax).toFixed(2);
          let circle = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:`;
          let data0 = `${circle}${colors[theme][0]}"></span> ${
            params[0].seriesName
          }： ${val0} km²`;
          let data1 = `${circle}${colors[theme][1]}"></span> ${
            params[1].seriesName
          }： ${val1} km²`;
          return `${params[0].axisValueLabel}时<br/>${data0}<br/>${data1}`;
        }
      },
    },
    visualMap: {
      dimension: 0,
      seriesIndex:1,
      show: false,
      pieces: pieces
    },
    legend: {
      data: Object.keys(xData),
      orient: 'horizontal',
      right: '1%',
      top: '1%',
    },
    xAxis: {
      type: 'category',
      data: yData,
      name: data.xName,
      boundaryGap: false,
      nameLocation: 'center',
      nameTextStyle: {
        color: 'black',
        fontSize: 12,
        fontWeight: 500,
      },
      nameGap: 25,
    },
    yAxis: {
      type: 'value',
      name: data.yName,
      axisLabel:{
        formatter:'{value}%',
        textStyle: {
         fontSize: 10,
        }
      },
      nameLocation: 'center',
      nameTextStyle: {
        color: 'black',
        fontSize: 12,
        fontWeight: 500,
      },
      nameGap: 35,
    },
    series: series
  };
  if("useZoom" in data && data.useZoom === true)
    option.dataZoom = [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ];

  return option
}

export const updateChartLine1 = (data, chart, theme) => {
  let newOptions = getLineOption1(data, theme)
  chart.setOptions(newOptions, { nowMerge: true })
}


// 图表尺寸自适应页面-中间底下
export const resizeChartBottom = (chart, chartID) => {
  chart.resize({
    width: document.getElementById(chartID).parentElement.parentElement.offsetWidth * 0.98,
    height: document.getElementById(chartID).parentElement.offsetHeight,
  });
};
// 图表尺寸自适应页面-右侧面板
export const resizeChartCol = (chart, chartID) => {
  chart.resize({
    width: document.getElementById(chartID).parentElement.offsetWidth,
    height: document.getElementById(chartID).parentElement.offsetHeight,
  });
};
