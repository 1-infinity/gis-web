<template xmlns="http://www.w3.org/1999/html">
  <div>
    <div id="exportContent">
      <el-card class="box-card" v-for="(item, index) in ChosedItem" :key="index"
               v-loading="getLoadingFlag(item)"
      >
        <div slot="header" class="clearfix">
          <span>{{ getLabel(item) }}</span>

          <el-button style="float: right; padding: 3px 0;width: 60px;height: 30px" icon="el-icon-refresh" @click="retryModelOutPut(item)"></el-button>
        </div>
        <p>
          <modify class="update">
            {{getText(item)}}
          </modify>
        </p>
      </el-card>
    </div>
    <div>
      <el-button type="primary" style="margin-left: 45%;margin-top: 50px" @click="exportToWord">导出预案</el-button>
      <el-button type="primary" @click="lastStep">返回上一步</el-button>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import htmlDocx from 'html-docx-js/dist/html-docx'
import city from '@/views/city/index.vue'
import axios from 'axios'

export default {
  name: 'Detailed_plan_flood_LLM',
  props:
    {
      ChosedItem: {
        type: Array
      },
      items: {
        type: Array
      },
      city: {
        type: String
      }
    },
  data() {
    return {
      Prompts: [
        { prompts: ['总则的总体内容'], value: '1', label: '总则', status: false, text: '' },
        {
          prompts: [
            '编制目的当中的有关内容'
          ], value: '1.1', label: '编制目的', status: false, text: ''
        },
        {
          prompts: [
            '编制依据当中的有关内容'
          ], value: '1.2', label: '编制依据', status: false, text: ''
        },
        {
          prompts: [
            '适用范围当中的有关内容'
          ], value: '1.3', label: '适用范围', status: false, text: ''
        },
        {
          prompts: [
            '编制原则当中的有关内容'
          ], value: '1.4', label: '编制原则', status: false, text: ''
        },
        { prompts: ['风险评估的总体内容'], value: '2', label: '风险评估', status: false, text: '' },
        {
          prompts: [
            '洪涝灾害特点当中的有关内容'
          ], value: '2.1', label: '洪涝灾害特点', status: false, text: ''
        },
        {
          prompts: [
            '典型灾情回顾当中的有关内容'
          ], value: '2.2', label: '典型灾情回顾', status: false, text: ''
        },
        {
          prompts: [
            '防灾工程体系当中的有关内容'
          ], value: '2.3', label: '防灾工程体系', status: false, text: ''
        },
        {
          prompts: [
            '防灾重点当中的有关内容'
          ], value: '2.4', label: '防灾重点', status: false, text: ''
        },
        { prompts: ['机构与职责的有关内容'], value: '3', label: '机构与职责', status: false, text: '' },
        {
          prompts: [
            '市三防指挥部的组成和对应的职责'
          ], value: '3.1', label: '市三防指挥部', status: false, text: ''
        },
        {
          prompts: [
            '指挥工作小组的组成和对应的职责'
          ], value: '3.2', label: '指挥工作小组', status: false, text: ''
        },
        {
          prompts: [
            '人民武装部队的职责',
            '发改委的职责',
            '发改委的职责',
            '财政局的职责',
            '应急管理局的职责',
            '教育局的职责',
            '公安局的职责',
            '民政局的职责',
            '自然资源和规划局的职责',
            '水利局的职责',
            '生态环境局的职责',
            '卫健委的职责',
            '工信局的职责',
            '城管局的职责',
            '工信局的职责',
            '气象局的职责',
            '人防办的职责',
            '国网供电公司的职责',
            '电信分公司、移动分公司、联通分公司、广电网络分公司的职责',
            '铁路局',
            '民航局'
          ], value: '3.3', label: '各成员单位职责', status: false, text: ''
        },
        { prompts: ['监测预警的总体内容'], value: '4', label: '监测预警', status: false, text: '' },
        {
          prompts: [
            '监测的有关内容'
          ], value: '4.1', label: '监测', status: false, text: ''
        },
        {
          prompts: [
            '暴雨预警的有关内容'
          ], value: '4.2', label: '暴雨预警', status: false, text: ''
        },
        {
          prompts: [
            '预防行动的有关内容'
          ], value: '4.3', label: '预防行动', status: false, text: ''
        },
        { prompts: ['应急响应的总体内容'], value: '5', label: '应急响应', status: false, text: '' },
        {
          prompts: [
            '总体要求的有关内容'
          ], value: '5.1', label: '总体要求', status: false, text: ''
        },
        {
          prompts: [
            '一级应急响应的启动条件',
            '一级应急响应的响应行动'
          ], value: '5.2', label: '一级应急响应', status: false, text: ''
        },
        {
          prompts: [
            '二级应急响应的启动条件',
            '二级应急响应的响应行动'
          ], value: '5.3', label: '二级应急响应', status: false, text: ''
        },
        {
          prompts: [
            '三级应急响应的启动条件',
            '三级应急响应的响应行动'
          ], value: '5.4', label: '三级应急响应', status: false, text: ''
        },
        {
          prompts: [
            '四级应急响应的启动条件',
            '四级应急响应的响应行动'
          ], value: '5.5', label: '四级应急响应', status: false, text: ''
        },
        {
          prompts: [
            '信息报送处理和发布的有关内容'
          ], value: '5.6', label: '信息报送处理和发布', status: false, text: ''
        },
        {
          prompts: [
            '应急处置的有关内容'
          ], value: '5.7', label: '应急处置', status: false, text: ''
        },
        {
          prompts: [
            '应急结束的有关内容'
          ], value: '5.8', label: '应急结束', status: false, text: ''
        },
        { prompts: ['后期处置的总体内容'], value: '6', label: '后期处置', status: false, text: '' },
        {
          prompts: [
            '灾后救助的有关内容'
          ], value: '6.1', label: '灾后救助', status: false, text: ''
        },
        {
          prompts: [
            '物资补充的有关内容'
          ], value: '6.2', label: '物资补充', status: false, text: ''
        },
        {
          prompts: [
            '水毁修复的有关内容'
          ], value: '6.3', label: '水毁修复', status: false, text: ''
        },
        {
          prompts: [
            '灾后重建的有关内容'
          ], value: '6.4', label: '灾后重建', status: false, text: ''
        },
        {
          prompts: [
            '保险补偿的有关内容'
          ], value: '6.5', label: '保险补偿', status: false, text: ''
        },
        {
          prompts: [
            '总结评估的有关内容'
          ],
          value: '6.6', label: '总结评估', status: false, text: ''
        },
        { prompts: ['应急保障的总体内容'], value: '7', label: '应急保障', status: false, text: '' },
        {
          prompts: [
            '通信与信息保障的有关内容'
          ], value: '7.1', label: '通信与信息保障', status: false, text: ''
        },
        {
          prompts: [
            '抢险与救援保障的有关内容'
          ], value: '7.2', label: '抢险与救援保障', status: false, text: ''
        },
        {
          prompts: [
            '民生与交通保障的有关内容'
          ], value: '7.3', label: '民生与交通保障', status: false, text: ''
        },
        {
          prompts: [
            '治安与医疗保障的有关内容'
          ], value: '7.4', label: '治安与医疗保障', status: false, text: ''
        },
        {
          prompts: [
            '物资与资金保障的有关内容'
          ], value: '7.5', label: '物资与资金保障', status: false, text: ''
        },
        {
          prompts: [
            '公众与社会保障的有关内容'
          ], value: '7.6', label: '公众与社会保障', status: false, text: ''
        },
        { prompts: ['宣传、培训和演练的总体内容'], value: '8', label: '宣传、培训和演练', status: false, text: '' },
        {
          prompts: [
            '宣传的有关内容'
          ], value: '8.1', label: '宣传', status: false, text: ''
        },
        {
          prompts: [
            '培训的有关内容'
          ], value: '8.2', label: '培训', status: false, text: ''
        },
        {
          prompts: [
            '演练的有关内容'
          ], value: '8.3', label: '演练', status: false, text: ''
        },
        { prompts: ['预案管理的总体内容'], value: '9', label: '预案管理', status: false, text: '' },
        {
          prompts: [
            '预案修编增编的有关内容'
          ], value: '9.1', label: '预案修编增编', status: false, text: ''
        },
        {
          prompts: [
            '预案报送备案的有关内容'
          ], value: '9.2', label: '预案报送备案', status: false, text: ''
        },
        {
          prompts: [
            '预案操作要求的有关内容'
          ], value: '9.3', label: '预案操作要求', status: false, text: ''
        }
      ],
      // Prompts: [
      //   { prompts: ['总则的总体内容'], value: '1', label: '总则', status: false, text: '' },
      //   {
      //     prompts: [
      //       '编制目的当中的有关内容'
      //     ], value: '1.1', label: '编制目的', status: false, text: ''
      //   }
      // ]
    }
  },
  mounted() {
    let elems = document.getElementsByClassName('update')
    for (let i = 0; i < elems.length; i++) {
      elems[i].setAttribute('contenteditable', 'true')
    }

    // //向后端发送请求，获取对应的模型输出,当一个请求完成后再发送下一个请求
    // while (1)
    // {
    //   let flag = 0
    //   for (let i = 0; i < this.ChosedItem.length; i++) {
    //     if (this.getLoadingFlag(this.ChosedItem[i])) {
    //       flag = 1
    //       break
    //     }
    //   }
    //   if (flag === 0) {
    //     break
    //   }
    // }

    for (let i = 0; i < this.ChosedItem.length; i++) {
      this.getModelOutput(this.ChosedItem[i])
    }
  },
  computed: {
    getLoadingFlag() {
      return (item) => {
        const prompt = this.Prompts.find(prompt => prompt.value === item)
        return prompt ? !prompt.status : true
      }
    },
    getText() {
      return (item) => {
        const prompt = this.Prompts.find(prompt => prompt.value === item)
        return prompt ? prompt.text : ''
      }
    }
  },
  methods:
    {
      exportToWord() {
        // 获取要导出的 <div> 元素
        const divElement = document.getElementById('exportContent')

        // 获取 <div> 元素的 HTML 内容
        const htmlContent = divElement.innerHTML
        // 转换 HTML 为 Word 文档
        const convertedContent = htmlDocx.asBlob(htmlContent)

        // 创建一个下载链接并触发下载
        const downloadLink = document.createElement('a')
        downloadLink.href = URL.createObjectURL(convertedContent)
        downloadLink.download = this.city+'市暴雨洪涝联防联控预案' + '.docx'
        downloadLink.click()
      },
      lastStep() {
        this.$emit('lastStep')
      },
      getLabel(value) {
        // 在这里你可以根据 value 在 items 数组中查找对应的 label
        const item = this.Prompts.find(item => item.value === value)
        return item ? item.label : ''
      },
      async getModelOutput(value) {
        // console.log(this.city)
        // 在这里你可以根据 value 在 items 数组中查找对应的 label
        const item = this.Prompts.find(item => item.value === value)
        const prompts = item ? item.prompts : []
        let result = ''
        for (let i = 0; i < prompts.length; i++) {
          const prompt = prompts[i]
          const postData = {
            prompt: '请给我写一个' + this.city + '市暴雨防控应急预案的' + prompt,
            history: [],
            num_beams:3,
          }
          axios.post('http://100.64.226.144:8012/', postData).then((Response) => {
            console.log(postData)
            console.log(Response.data.response)
            result += Response.data.response + '\n'
            if (i === prompts.length - 1) {
              item.status = true
              item.text = result
              return 1
              // setTimeout(() => {
              //   item.status = true
              // }, 1000)
            }
          }).catch((error) => {
            console.log(error)
          })
        }
        return 0
      },
      retryModelOutPut(value) {
        const item = this.Prompts.find(item => item.value === value)
        item.status = false
        this.getModelOutput(value)
      }

    }
}

</script>


<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}

.pre {
  font-size: 14px;
  white-space: pre-wrap;
}

.update {
  color: red;
}
</style>
