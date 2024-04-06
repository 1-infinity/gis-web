<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5" :xs="24">
        <div class="head-container">
          <el-input
            v-model="name"
            placeholder="请输入标准类型名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px;"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="standardCatalogTree"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            node-key="id"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col class="standard" :span="19" :xs="24">
        <el-card style="border-radius: 10px;">
        <div>
        <el-form style="width: 100%;float: left;margin-top: 20px;margin-left: 10px" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="70px">
          <el-form-item label="标准名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入标准名称"
              clearable
              size="small"
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="标准号" prop="stdNo">
            <el-input
              v-model="queryParams.stdNo"
              placeholder="请输入标准号"
              clearable
              size="small"
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        </div>
        <el-table style="min-height: calc( 100vh - 250px);" v-loading="loading" :data="standardList" @selection-change="handleSelectionChange">
<!--          <el-table-column type="selection" width="55" align="center"  />-->
          <el-table-column label="" width="40">
            <template slot-scope="scope">
<!--              <el-radio :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.row)" style="color: #fff;padding-left: 10px; margin-right: -25px;"></el-radio>-->
              <el-radio :label="scope.row.id" v-model="tableRadio" @change.native="getCurrentRow(scope.row)" style="color: #fff;padding-left: 10px; margin-right: -25px;"></el-radio>
            </template>
          </el-table-column>
          <el-table-column label="序号" type="index" align="center">
            <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="标准名称" align="left" prop="chineseName">
            <template slot-scope="scope">
              <a @click="handleInfo(scope.row)">{{scope.row.chineseName}}</a>
            </template>
          </el-table-column>
          <el-table-column label="标准号" align="left" prop="stdNo" />
<!--          <el-table-column label="关联网站" align="left" prop="relatedUrl" />-->
<!--          <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="230px">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button-->
<!--                size="mini"-->
<!--                type="text"-->
<!--                icon="el-icon-info"-->
<!--                @click="handleInfo(scope.row)"-->
<!--              >详情</el-button>-->
<!--              <el-button-->
<!--                size="mini"-->
<!--                type="text"-->
<!--                icon="el-icon-download"-->
<!--                @click="handleDownLoad(scope.row)"-->
<!--              >下载文档</el-button>-->
<!--              <el-button-->
<!--                v-if="(deptId === scope.row.deptId) || deptId == '100'"-->
<!--                size="mini"-->
<!--                type="text"-->
<!--                icon="el-icon-edit"-->
<!--                @click="handleUpdate(scope.row)"-->
<!--                v-hasPermi="['system:standard:edit']"-->
<!--              >编辑</el-button>-->
<!--              <el-button-->
<!--                v-if="(deptId === scope.row.deptId) || deptId == '100'"-->
<!--                size="mini"-->
<!--                type="text"-->
<!--                icon="el-icon-delete"-->
<!--                @click="handleDelete(scope.row)"-->
<!--                v-hasPermi="['system:standard:remove']"-->
<!--              >删除</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
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
  </div>
</template>

<script>
import { listData, getData,addStandardData,delStandardData, updatStandardeData   } from "@/api/system/standard";
import { TreeData,addData,delData, updateData } from "@/api/system/standardCatalog";
import UploadFile from "@/components/UploadFile"
import ExcelUpload from "@/components/ExcelUpload"
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import store from "../../../store"


export default {
  name: "StandardSelect",
  components: { Treeselect, UploadFile, ExcelUpload },
  data() {
    return {
      code: 'standard',
      downloadFileUrl: process.env.VUE_APP_BASE_API + "/file/download",
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
      // 表格数据
      standardList: [],
      tableRadio:'',
      // 弹出层标题
      title: "",
      downloadTitle: '文档下载',
      // 是否显示弹出层
      open: false,
      treeOpen:false,
      // 是否显示文档下载弹出层
      openDownload: false,
      // 是否显示导入弹出层
      showExport: false,
      // 标准类别树
      standardCatalogTree: [],
      // 标准类别查询
      name: undefined,
      optionCardShow: false,
      optionCardX:'',   // 让右键菜单出现在鼠标右键的位置
      optionCardY : '',
      optionData : [],
      node : null, // 将当前节点保存
      tree : null,
      nodeData: {},
      // 标准状态options
      statusOptions: [
        {label:'未生效', value: '0'},
        {label:'现行', value: '1'},
        {label:'废止', value: '2'}
      ],
      // 标准类型options
      typeOptions: [
        {label:'公共标准', value: '0'},
        {label:'内部标准', value: '1'}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        stdNo: '',
        catalogId: null,
        delFlag: '0'
      },
      // 表单参数
      form: {},
      formType: null,
      catalogDisabled: false,
      attachment: [],
      // 表单校验
      rules: {
        chineseName: [
          { required: true, message: "标准中文名称不能为空", trigger: "blur" }
        ],
        stdNo: [
          { required: true, message: "标准号不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择标准类型", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择标准状态", trigger: "blur" }
        ],
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
  },
  created() {
    // this.deptId = store.getters.dept.deptId
    this.queryParams.catalogId = null
    this.getTree();
    this.getList();
  },
  methods: {
    append(data) {
      console.log("parentData=======",data);
    },
    treeAdd() {
      this.handleTreeAdd(this.nodeData.data.id);
    },
    treeRemove() {
      if(this.nodeData.data.parentId===0){
        this.$modal.msgError("根节点不能删除！");
        return;
      };
      this.handleTreeDelete(this.nodeData.data.id,this.nodeData.data.label);

    },
    // 文件夹右键时触发的事件
    floderOption(e, data, n, t) {
      this.optionCardShow = false
      this.optionCardX = e.x   // 让右键菜单出现在鼠标右键的位置
      this.optionCardY = e.y - 110
      this.optionData = data
      this.node = n // 将当前节点保存
      this.tree = t
      this.optionCardShow = true  // 展示右键菜单
    },
    rightClick(MouseEvent, object, Node, element) {
      this.nodeData = Node
      this.optionCardShow = true;
      let menu = document.querySelector("#menu");
      menu.style.cssText = "position: fixed; left: " + (MouseEvent.clientX - 10) + 'px' + "; top: " + (MouseEvent.clientY - 25) + 'px; z-index: 999; cursor:pointer;';
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
    },
    /** 新增按钮操作 */
    handleTreeAdd(id) {
      this.title = "添加信息";
      this.infoType = 'add';
      this.infoId = null
      this.form.parentId = id || this.queryParams.parentId
      this.treeOpen = true;
    },
    /** 删除按钮操作 */
    handleTreeDelete(id,name) {
      // const ids = id != null ? [row.id] : this.ids;
      const ids =  [id];
      this.$confirm('是否删除"'+name+'"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delData(ids);
      }).then(() => {
        this.getTree();
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    selectable(row,index) {
      if (this.deptId == '100') {
        return true
      }
      if (row.deptId == null) {
        return false
      }
      return row.deptId == this.deptId
    },
    fileUploadResult(e) {
      if (e && e.length > 0) {
        this.attachment = e
      }
    },
    fileRemove(e) {
      if (e) {
        if(e.length = 0){
          this.attachment = []
        }else{
          this.attachment = e
        }
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.catalogId = data.id
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
      this.standardList = [];
      listData(this.queryParams).then(response => {
        if (response.rows && response.rows.length > 0) {
          this.standardList = response.rows
        }
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.openDownload = false
      this.open = false;
      this.form = {}
      this.formType = null
      this.attachment = []
      this.infoId = ''
      this.infoType = ''
    },
    // 取消按钮
    treeCancel() {
      this.openDownload = false
      this.treeOpen = false;
      this.form = {}
      this.formType = null
      this.attachment = []
      this.infoId = ''
      this.infoType = ''
    },
    // 关闭dialog并刷新列表
    cancelAndReset() {
      this.open = false;
      this.form = {}
      this.formType = null
      this.infoId = ''
      this.infoType = ''
      this.attachment = []
      this.getTree();
      this.getList();
    },
    // 关闭dialog并刷新列表
    treeCancelAndReset() {
      this.treeOpen = false;
      this.form = {}
      this.formType = null
      this.infoId = ''
      this.infoType = ''
      this.attachment = []
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
      this.queryParams.catalogId = null
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(id) {
      this.title = "添加信息";
      this.infoType = 'add';
      this.infoId = null
      this.form.catalogId = this.queryParams.catalogId == undefined ? null : this.queryParams.catalogId
      this.catalogDisabled = false
      this.open = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.tableRadio = selection
      this.$emit("select",this.tableRadio)
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
    /** 下载文档 */
    handleDownLoad(row) {
      if (row && row.attachment) {
        this.openDownload = true
        this.attachment = JSON.parse(row.attachment);
      } else {
        this.msgError("该标准暂无文档");
      }
    },
    /** 查看详情给 */
    handleInfo(row) {
      const id = row.id || this.ids
      this.infoType = 'info'
      this.infoId = id
      this.title = "详细信息";
      this.getInfoData(id)
      this.open = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id != null ? [row.id] : this.ids;
      this.$confirm('是否删除数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStandardData(ids);
        }).then(() => {
          this.getTree();
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
    },
    handleExport() {
      this.showExport = true
    },
    /** 标准文件提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.name = this.form.chineseName;
          this.form.attachment = JSON.stringify( this.attachment );
          if (this.form.id != null && this.form.id != undefined && this.form.id != '') {
            updateStandardData(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.cancelAndReset()
            });
          } else {
            addStandardData(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.cancelAndReset()
            });
          }
        }
      });
    },
    /** 分类树提交按钮 */
    submitTreeForm: function() {
      this.$refs["treeForm"].validate(valid => {
        if (valid) {
          if (this.form.id != null && this.form.id != undefined && this.form.id != '') {
            updateData(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.treeCancelAndReset()
            });
          } else {
            addData(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.treeCancelAndReset()
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
            this.attachment = JSON.parse(res.data.attachment)
            this.form = res.data
            this.formType = res.data.type
          }
        })
        .catch(er => {
          this.msgError("获取详情信息失败：" + er);
        })
    },
    formTypeChange(val) {
      this.formType = val
    },
    getCurrentRow(row) {
      // console.log(row)
      console.log("this.tableRadio======",this.tableRadio)
      // this.selectStandardId = e;
      this.$emit("select",this.tableRadio)
    },
  }
};
</script>
<style>
.standard .el-card__body {
  padding: 0px 0px 20px 0px;
}
.el-input.is-disabled .el-input__inner {
  background-color: #ffffff;
  color: #606266;
}
.standardInfo .vue-treeselect--disabled .vue-treeselect__control{
  background-color: #ffffff;
}
.standardInfo .el-textarea.is-disabled .el-textarea__inner{
  background-color: #ffffff;
  color: #606266;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.text {
  font-size: 14px;
}
.item {
  margin-bottom: 5px;
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
  width: 120px;
  height: 70px;
}
</style>
