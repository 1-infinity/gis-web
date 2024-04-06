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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['sysdata:config:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sysdata:config:edit']"
          >爬取配置</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sysdata:config:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document-copy"
            @click="handleFetchData(scope.row)"
          >爬取数据</el-button>
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

    <!-- 添加或修改标准数据配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="数据类型" label-width="120px" prop="type">
          <el-select v-model="form.type" placeholder="请选择数据类型" @change="typeChange">
            <el-option
              v-for="dict in dict.type.data_config_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
          <!--          <span v-if="form.type==='1'">-->
          <!--            (全量更新)-->
          <!--          </span>-->
        </el-form-item>
        <el-form-item label="网站名称" label-width="120px" prop="name">
          <el-input v-model="form.name" placeholder="请输入网站名称" />
        </el-form-item>
        <el-form-item label="网址" label-width="120px" prop="url">
          <el-input v-model="form.url" placeholder="请输入爬取网址" />
        </el-form-item>
        <el-form-item label="更新类型" label-width="120px" prop="url">
<!--          <span v-if="form.type==='1'">-->
<!--            全量更新-->
<!--          </span>-->
          <el-radio-group v-model="form.updateType" :disabled="form.type==='1'">
            <el-radio label="1">全量更新</el-radio>
            <el-radio label="2">增量更新</el-radio>
<!--            <el-radio-->
<!--              v-for="dict in dict.type.sys_normal_disable"-->
<!--              :key="dict.value"-->
<!--              :label="dict.value"-->
<!--            >{{dict.label}}</el-radio>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type==='2'" label="获取页数" label-width="120px" prop="url">
<!--          <el-input v-model="form.pageNum" placeholder="请输入获取页数" />-->
          <el-input-number v-model="form.pageNum" controls-position="right" :min="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listConfig, getConfig, delConfig, addConfig, updateConfig,fetchData,fileZip } from "@/api/sysdata/config";
import request from '@/utils/request'

export default {
  name: "Config",
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
      listConfig(this.queryParams).then(response => {
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
        pageNum: null,
        updateType: null,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "网站爬取配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "网站爬取配置";
      });
    },
    typeChange(){
      if(this.form.type ==='1'){
        this.form.updateType = '1';
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateConfig(this.form).then(response => {
              this.$modal.msgSuccess("配置成功");
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const name = row.name;
      this.$modal.confirm('是否确认删除"' + name + '"的配置项？').then(function() {
        return delConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 爬取数据按钮操作 */
    handleFetchData(row) {
      const ids = row.id || this.ids;
      const name = row.name;
      this.$modal.confirm('是否确认爬取"' + name + '"的数据？')
      // .then(() =>{
      //   this.$modal.msgSuccess("正在爬取数据，请酌情稍后处理数据!");
      // })
      .then(function(){
        return fetchData(ids);
      })
      .then((res) => {
        this.$modal.msgSuccess(res.msg);
      }).catch(() => {});
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
