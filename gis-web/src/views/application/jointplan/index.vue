<template>
  <div>
    <div v-if="is_catalog">
      <el-row>
        <h1 style="text-align: center">南京市</h1>
        <h3 style="text-align: center;color: rgba(153,169,191,0.97)">{{ mainTitle }}</h3>
      </el-row>
      <div>
        <el-checkbox-group v-model="selectedItems">
          <el-checkbox
            class="list-group-item"
            v-for="item in items"
            :key="item.value"
            :label="item.value"
            @change="handleSelectionChange($event,item.value)"
          >
            <el-row
              :span="24"
              :offset="5"
            >
              <div class="grid-content bg-purple-dark">
                {{ item.value }}
              </div>
            </el-row>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div>
        <el-button
          type="primary"
          style="margin-left: 45%;margin-top: 100px"
          @click="get_detailed_plan"
        >查看预案
        </el-button>
      </div>
    </div>
    <div v-if="is_detailed_plan">
      <DetailedPlan
        :ChosedItem="selectedItems"
        :itmes="items"
        :documentId="documentId"
        @back="back"
      >
      </DetailedPlan>
    </div>
    <div>
      <input
        type="file"
        ref="fileInput"
      >
      <button @click="uploadFile">上传文件</button>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import DetailedPlan from "@/views/application/jointplan/DetailedPlan.vue";
// import UploadFile from '@/components/UploadFile/index.vue'

export default {
  name: "JointPlan",
  components: { DetailedPlan },
  data() {
    return {
      selectedItems: [],
      items: [],
      is_catalog: true,
      is_detailed_plan: false,
      // 文件的id
      documentId: 0,
      // 文件标题
      mainTitle: "",
    };
  },
  methods: {
    handleSelectionChange(event, label) {
      label = label.split(" ")[0];
      if (label.length === 1) {
        //说明此时为一个大章节的总标题，需要将其他小标题也设置为点击
        if (event === true) {
          //说明选上了总标题
          // 选中了总标题，查找对应的小标题并设置为选中
          const subItems = this.items.filter((item) =>
            item.value.startsWith(label)
          );
          for (const subItem of subItems) {
            if (this.selectedItems.indexOf(subItem.value) === -1) {
              this.selectedItems.push(subItem.value);
            }
          }
        } else {
          // 取消选中了总标题，查找对应的小标题并设置为取消选中
          const subItems = this.items.filter((item) =>
            item.value.startsWith(label)
          );
          for (const subItem of subItems) {
            const index = this.selectedItems.indexOf(subItem.value);
            if (index !== -1) {
              this.selectedItems.splice(index, 1);
            }
          }
        }
      }
    },
    back() {
      this.is_catalog = true;
      this.is_detailed_plan = false;
    },
    get_detailed_plan() {
      this.is_catalog = false;
      this.is_detailed_plan = true;
    },
    async getAllTitle(city, disaster) {
      const res = await axios.get(
        `http://localhost:8080/planQuery/getAllTitle?city=${city}&disaster=${disaster}`
      );
      console.log(res)
      this.documentId = res.data.data.documentId;
      this.mainTitle = res.data.data.mainTitle;
      res.data.data.titleList.forEach((title) => {
        let item = {
          value: title,
        };
        this.items.push(item);
      });
    },
    uploadFile() {
      const fileInput = this.$refs.fileInput;
      const file = fileInput.files[0]; // 获取文件对象
      console.log(file);

      if (!file) {
        alert("请选择文件");
        return;
      }

      const formData = new FormData(); // 创建表单数据对象
      formData.append("file", file); // 将文件对象添加到表单数据中
      formData.append("mainTitle", "南京"); // 将文件对象添加到表单数据中
      formData.append("city", "南京市"); // 将文件对象添加到表单数据中
      formData.append("disaster", "洪涝"); // 将文件对象添加到表单数据中
      // 输出 FormData 的内容到控制台
      for (const entry of formData.entries()) {
        console.log(entry);
      }
      
      axios
        .post("http://localhost:8080/document/addDocumentByFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // 设置请求头，表明发送的是 FormData 格式的数据
          },
        })
        .then((response) => {
          console.log("文件上传成功", response.data);
        })
        .catch((error) => {
          console.error("上传失败", error);
        });
    },
  },
  mounted() {
    // 当组件挂载到 DOM 后，从后端调用选项（标题）
    this.getAllTitle("南京市", "洪水");
  },
};
</script>

<style>
.list-group-item {
  margin-left: 20%;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.bg-purple-dark {
  width: 700px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
