<template>
  <div class="app-container">
    <iframe :src="pdfUrl" width="100%" height="100%" style="background-color: #1f2d3d;height: 100vh"></iframe>
  </div>
</template>

<script>
import {
  getFile
} from "@/api/gis/upload";
export default {
  name: "Role",
  dicts: ["sys_normal_disable", "data_type", "coverage_style"],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      // 遮罩层
      loading: true,
      pdfUrl: ''
    };
  },
  created() {
    this.getUrl()
  },
  methods: {
    // 获取pdf地址
    getUrl() {
      getFile().then(rsp => {
          this.pdfLoading = false
          let blob = new Blob([rsp], { type: 'application/octet-stream' })
          let pdfUrl = URL.createObjectURL(blob)
            this.pdfUrl = '/pdfjs/web/viewer.html?file=' + pdfUrl
        }).catch(e => {
          this.pdfLoading = false
          console.log(e)
        })
    }
  },
};
</script>
<style lang="scss" scope>
.data {
  margin-left: 30px;
  font-weight: 700;
  font-size: 14px;
  color: #606266;
}
.divider {
  margin: 40px 0 20px 0 !important;
}
.el-dialog {
  .form {
    .item {
      .el-form-item__label {
        width: 50px !important;
      }
    }
    .el-row {
      .el-col {
        .el-form-item {
          display: flex;
          align-items: center;
          .el-form-item__label {
            padding: 5px 10px;
            line-height: 18px;
            font-size: 12px !important;
            font-weight: 400;
          }
        }
      }
    }
  }
}

.el-card {
  margin-top: 15px;
}
.addlist {
  display: flex;
  .add-1 {
    width: 150px;
    >>> .el-form-item {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .add-2 {
    flex: 4;
  }
  .add-3 {
    flex: 2;
  }
  .add-4 {
    flex: 2;
  }
}
</style>
