<template>
  <div class="upload-file">
    <el-form label-width="120px">
      <el-form-item label="下载模板">
        <div style="display:inline-block;margin-left:10px;">
          <el-button type="primary" icon="el-icon-download" size="mini" @click="downloadIsTemplate">
            下载导入模板
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="导入数据">
        <div style="display:inline-block;margin-left:10px;">
          <el-upload
            :action="uploadTemplateUrl"
            :before-upload="handleBeforeUpload"
            :file-list="fileList"
            :limit="1"
            :on-error="handleUploadError"
            :on-success="handleUploadSuccess"
            :show-file-list="false"
            :headers="headers"
            :data="uploadParam"
            class="upload-file-uploader"
            ref="upload"
          >
            <!-- 上传按钮 -->
            <el-button size="mini" type="primary">选取文件</el-button>
            <!-- 上传提示 -->
            <div class="el-upload__tip" slot="tip">
              请上传
              <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
              的文件
            </div>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog :close-on-click-modal = "false" title="数据导入结果" :visible.sync="showResult" width="600px" append-to-body>
      <el-table :data="tableList"
                row-key="name">
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="result" label="导入结果">
          <template slot-scope="scope">
            <span :style="{color:scope.row.result === 'success'?'#6f974c':'#eed783'}">{{ scope.row.result }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        small
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="resultList.length">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "ExcelUpload",
  props: {
    // 值
    code: {
      type: String,
      default: ''
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["xlsx"],
    },
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
      downloadTemplateUrl: process.env.VUE_APP_BASE_API + "/file/download/template",
      uploadTemplateUrl: process.env.VUE_APP_BASE_API + "/file/upload/template", // 上传的文件服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
      templateList: [
        {code: 'standard',value: '标准明细导入模板.xlsx'},
        {code: 'standard_catalog',value: '标准目录导入模板.xlsx'},
        {code: 'dataElement',value: '数据元导入模板.xlsx'},
        {code: 'metadata',value: '元数据导入模板.xlsx'},
      ],
      uploadParam: {
        code: this.code
      },
      showResult: false,
      resultList: [],
      tableList: []
    };
  },
  watch: {
    code: {
      handler(val) {
        console.log('code:', val)
      },
      deep: true,
      immediate: true
    },
    showResult: {
      handler(val) {
        console.log('showResult:', val)
        if (!val) {
          this.resultList = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {

  },
  methods: {
    // 导入失败
    handleUploadError(err) {
      console.log('导入失败：', err)
      this.$message.error("导入失败, 请重试");
    },
    // 导入成功回调
    handleUploadSuccess(res, file) {
      console.log('导入成功：', res)
      this.tableList = []
      this.resultList = res.data
      this.resultList.forEach((item, index) => {
        if (index < 10) {
          this.tableList.push(item)
        }
      })
      this.showResult = true
      this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
      this.$message.success("导入成功");
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$message.error(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          return false;
        }
      }
      return true;
    },
    downloadIsTemplate() {
      this.templateList.forEach(item => {
        if (item.code == this.code) {
          window.open(this.downloadTemplateUrl + '?code=' + item.code, '_blank')
        }
      })
    },
    handleCurrentChange(current) {
      this.tableList = []
      this.resultList.forEach((item, index) => {
        if (10 * (current - 1) <= index && index <= 10 * current - 1) {
          this.tableList.push(item)
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
