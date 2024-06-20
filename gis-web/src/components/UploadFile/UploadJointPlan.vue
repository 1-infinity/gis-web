<template>
  <el-dialog
    title="上传"
    :visible.sync="dialog"
    :before-close="closeDialog"
    width="35%"
    style="text-align: center;"
  >
    <el-upload
      class="upload-demo"
      action="#"
      drag
      ref="fileInput"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
      :on-change="handleChange"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div slot="tip" class="el-upload__tip">只能上传docx文件，且不超过20MB</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="uploadFile">上 传</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "UploadJointPlan",
  props: {
    dialog: {
      type: Boolean,
    },
    city: {
      type: String,
    },
    type:{
      type: String,
    }
  },
  data() {
    return {
      fileList: [],
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  },
  methods: {
    uploadFile() {
      const formData = new FormData(); // 创建表单数据对象
      formData.append("file", this.fileList[0].raw); // 将文件对象添加到表单数据中
      formData.append("mainTitle", this.fileList[0].raw.name); // 将文件对象添加到表单数据中
      formData.append("city", this.city); // 将文件对象添加到表单数据中
      formData.append("disaster", this.type); // 将文件对象添加到表单数据中
      // 输出 FormData 的内容到控制台
      //   for (const entry of formData.entries()) {
      //     console.log(entry);
      //   }
      axios
        .post("http://localhost:8080/document/addDocumentByFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // 设置请求头，表明发送的是 FormData 格式的数据
          },
        })
        .then((response) => {
          this.$message.success("文件上传成功", response.data);
          this.closeDialog();
        })
        .catch((error) => {
          this.$message.error("上传失败", error);
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    handleChange(file, fileList) {
      //文件数量改变
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
  },
};
</script>
