<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="网站名称" label-width="120px" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入网站名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择数据类型" clearable>
          <el-option
            v-for="dict in dict.type.data_config_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['sysdata:config:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['sysdata:config:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['sysdata:config:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['sysdata:config:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
<!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
<!--    </el-row>-->

    <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="数据配置ID" align="center" prop="id" />-->
      <el-table-column label="网站名称" align="center" prop="name" />
      <el-table-column label="数据类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_config_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="网址" align="center" prop="url" />
      <el-table-column label="抓取数据总量（条）" align="center" prop="dataTotal" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh"
            @click="handleQuery"
          >刷新</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="fileZip(scope.row,'test')"
          >下载数据</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-data"
            @click="dataDetail(scope.row)"
          >数据详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { detailListConfig, getConfig, delConfig, addConfig, updateConfig,fetchData,fileZip } from "@/api/sysdata/config";

export default {
  name: "dataConfig",
  dicts: ['data_config_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 标准数据配置表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询标准数据配置列表 */
    getList() {
      this.loading = true;
      detailListConfig(this.queryParams).then(response => {
        this.configList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        type: null,
        url: null,
        createBy: null,
        createTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 任务数据详情 */
    dataDetail(row) {
      const rid = row.id;
      const type = row.type;
      this.$router.push({ path: '/sysdata/data-detail/index', query: { rid: rid,type:type } })
    },
    /** 爬取数据按钮操作 */
    handleFetchData(row) {
      const ids = row.id || this.ids;
      const name = row.name;
      this.$modal.confirm('是否确认爬取"' + name + '"的数据？').then(function() {
        return fetchData(ids);
      }).then(() => {
        // this.getList();
        this.$modal.msgSuccess("正在爬取数据");
      }).catch(() => {});
    },
    // 下载全部数据
    fileZip(e, downloadName) {
      this.$modal.msgSuccess("正在下载数据，请耐心等待!");
      fileZip(e.id).then(res => {
           // if (res.headers['content-disposition']) {
        //   // this.tasklist.dataListLoading = false
        // } else {
        //   this.$message('当前下载图片错误')
        //   // this.tasklist.dataListLoading = false
        // }
        // this.$modal.msgSuccess('正在下载数据，请耐心等待。')
        const link = document.createElement('a')
        let blob = new Blob([res], {
          type: 'application/octet-stream'
        })
        // let blob = new Blob([res])
        //获取heads中的filename文件名
        // let temp = res.headers['content-disposition']
        //   .split(';')[1]
        //   .split('filename=')[1]
        // let fileName = decodeURIComponent(temp)
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', e.name+'导出数据.zip')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        // this.form = response.data;
        // this.open = true;
        // this.title = "修改标准数据配置";
      });
      // this.$http({
      //   url: this.$http.adornUrl(
      //     `/evaluation/batchDownloadFiles/${e.id}/${downloadName}`
      //   ),
      //   method: 'GET',
      //   responseType: 'blob'
      // }).then((res) => {
      //   // console.log(res)
      //   if (res.headers['content-disposition']) {
      //     this.tasklist.dataListLoading = false
      //   } else {
      //     this.$message('当前下载图片错误')
      //     this.tasklist.dataListLoading = false
      //   }
      //   const link = document.createElement('a')
      //   let blob = new Blob([res.data], {
      //     type: 'application/octet-stream'
      //   })
      //   //获取heads中的filename文件名
      //   let temp = res.headers['content-disposition']
      //     .split(';')[1]
      //     .split('filename=')[1]
      //   let fileName = decodeURIComponent(temp)
      //   link.style.display = 'none'
      //   link.href = URL.createObjectURL(blob)
      //   link.setAttribute('download', fileName)
      //   document.body.appendChild(link)
      //   link.click()
      //   document.body.removeChild(link)
      //   // console.log(111)
      // })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('sysdata/config/export', {
        ...this.queryParams
      }, `config_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
