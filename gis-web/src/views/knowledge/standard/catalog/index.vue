<template>
  <div class="app-container">
    <el-row :gutter="20">
<!--      <el-col :span="4" :xs="24">-->
<!--        <div class="head-container">-->
<!--          <el-input-->
<!--            v-model="name"-->
<!--            placeholder="请输入标准类型名称"-->
<!--            clearable-->
<!--            size="small"-->
<!--            prefix-icon="el-icon-search"-->
<!--            style="margin-bottom: 20px"-->
<!--          />-->
<!--        </div>-->
<!--        <div class="head-container">-->
<!--          <el-tree-->
<!--            :data="standardCatalogTree"-->
<!--            :props="defaultProps"-->
<!--            :expand-on-click-node="false"-->
<!--            :filter-node-method="filterNode"-->
<!--            ref="tree"-->
<!--            default-expand-all-->
<!--            @node-click="handleNodeClick"-->
<!--          />-->
<!--        </div>-->
<!--      </el-col>-->
      <el-col class="catlog" :span="24" :xs="24">
        <el-card style="border-radius: 10px">
        <el-form style="width: 100%;float: left;margin-top: 20px;margin-left: 10px" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
          <el-form-item label="标准类型名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入标准类型名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row style="float: left;margin-top: 0px;margin-left: 10px;margin-bottom: 20px" :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd(null)"
              v-hasPermi="['system:standardCatalog:add']"
            >新增</el-button>
          </el-col>
<!--          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete(null)"
              v-hasPermi="['system:standardCatalog:remove']"
            >删除</el-button>
          </el-col>-->
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:standardCatalog:upload']"
            >导入</el-button>
          </el-col>
        </el-row>

        <el-table style="min-height: calc(100vh - 250px )"
                  v-loading="loading"
                  :data="standardCatalogList"
                  row-key="id"
                  default-expand-all
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
<!--          @selection-change="handleSelectionChange"-->
<!--          <el-table-column type="selection" width="55" align="center" :selectable='selectable' />-->
<!--          <el-table-column label="序号" type="index" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="标准类型名称" align="left" prop="name">
            <template slot-scope="scope">
              <a @click="handleInfo(scope.row)">{{scope.row.name}}</a>
            </template>
          </el-table-column>
<!--          <el-table-column label="上级标准类型" align="left" prop="parentName" :show-overflow-tooltip="true" />-->
          <el-table-column label="排序" align="left" prop="sortNum"/>
          <el-table-column label="创建时间" align="left" prop="createTime" width="180" />
          <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-if="(deptId === scope.row.deptId) || deptId == '100'"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:standardCatalog:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="handleAdd(scope.row.id)"
                v-hasPermi="['system:standardCatalog:add']"
              >添加下级</el-button>
              <el-button
                v-if="(deptId === scope.row.deptId) || deptId == '100'"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:standardCatalog:remove']"
              >删除</el-button>
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
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px"
               :destroyOnClose='destroyOnClose'
               :show-close="false"
               :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入属性名称" :disabled="infoType == 'info'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级目录" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :value="form.parentId"
                noChildrenText="没有子节点"
                :options="standardCatalogInfoTree"
                :show-count="true"
                :disabled="infoType == 'info'"
                placeholder="选择上级目录"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortNum">
              <el-input type="Number" v-model="form.sortNum" placeholder="请输入排序" :disabled="infoType == 'info'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :disabled="infoType == 'info'"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="infoType == 'add' || infoType == 'edit'" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--导入弹窗-->
    <el-dialog :close-on-click-modal = "false" title="数据导入" :visible.sync="showExport" width="500px" class="expert-dialog">
      <excel-upload :code="code"></excel-upload>
    </el-dialog>
  </div>
</template>

<script>
import { listData, delData, TreeData, getData, addData, updateData } from "@/api/system/standardCatalog";
import ExcelUpload from "@/components/ExcelUpload"
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import store from "../../../../store"


export default {
  name: "StandardCatalog",
  components: { Treeselect, ExcelUpload },
  data() {
    return {
      code: 'standard_catalog',
      // 关闭时销毁 Dialog 中的元素
      destroyOnClose: true,
      // 子页面类型
      infoType: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 想子页面传递值
      infoId: '',
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
      // 字典表格数据
      standardCatalogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示导入excel弹出层
      showExport: false,
      // 属性分类树
      standardCatalogTree: [],
      name: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        parentId: null,
        isDeleted: '0'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "属性名称不能为空", trigger: "blur" }
        ],
        sortNum: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      },
      now: new Date(),
      // 属性分类树
      standardCatalogInfoTree: [],
      deptId: undefined,
    };
  },
  watch: {
    // 根据名称筛选部门树
    name(val) {
      this.$refs.tree.filter(val)
    },
    showExport: {
      handler(val) {
        console.log('showExport:', val)
        if (!val) {
          this.getTree()
          this.getList()
        }
      },
      deep: true,
        immediate: true
    }
  },
  created() {
    this.deptId = store.getters.dept.deptId
    // this.queryParams.parentId = 0
    this.getTree();
    this.getList();
  },
  methods: {
    selectable(row,index) {
      if (this.deptId == '100') {
        return true
      }
      if (row.deptId == null) {
        return false
      }
      return row.deptId == this.deptId
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.parentId = data.id
      this.getList()
    },
    getTree() {
      this.standardCatalogTree = []
      this.standardCatalogInfoTree = []
      const params = {
        name: '',
        parentId: null,
        isDeleted: '0'
      }
      TreeData(params).then(res => {
        if (res.data) {
          this.standardCatalogTree = res.data
          this.standardCatalogInfoTree = res.data
        }
      })
    },
    /** 查询属性列表 */
    getList() {
      this.loading = true;
      this.standardCatalogList = [];
      listData(this.queryParams).then(response => {
        if (response.rows && response.rows.length > 0) {
          this.standardCatalogList = this.handleTree(response.rows, 'id', 'pid')
        }
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.form = {}
      this.infoId = ''
      this.infoType = ''
    },
    // 关闭dialog并刷新列表
    cancelAndReset() {
      this.open = false;
      this.form = {}
      this.infoId = ''
      this.infoType = ''
      this.getTree();
      this.getList();
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
    /** 新增按钮操作 */
    handleAdd(id) {
      this.title = "添加信息";
      this.infoType = 'add';
      this.infoId = null
      this.form.parentId = id || this.queryParams.parentId
      this.open = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleExport() {
      this.showExport = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      this.infoType = 'edit'
      this.infoId = id
      this.title = "修改信息";
      this.getInfoData(id)
      this.open = true;
    },
    /** 查看详情给 */
    handleInfo(row) {
      const id = row.id
      this.infoType = 'info'
      this.infoId = id
      this.title = "详细信息";
      this.getInfoData(id)
      this.open = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row != null ? [row.id] : this.ids;
      this.$confirm('是否删除数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(function() {
        return delData(ids);
      }).then(() => {
        this.getTree();
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null && this.form.id != undefined && this.form.id != '') {
            updateData(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.cancelAndReset()
            });
          } else {
            addData(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.cancelAndReset()
            });
          }
        }
      });
    },
    // 获取详情信息
    getInfoData(id) {
      getData(id)
        .then(res => {
          if (res.data && res.data != null) {
            this.form = res.data
          }
        })
        .catch(er => {
          this.msgError("获取详情信息失败：" + er);
        })
    },
  }
};
</script>
<style lang="scss" scoped>
.catlog .el-card__body {
  padding: 0px 0px 20px 0px;
}
.el-input.is-disabled .el-input__inner {
  background-color: #ffffff;
  color: #606266;
}
</style>
