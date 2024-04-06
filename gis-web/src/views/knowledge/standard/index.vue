<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="name"
            placeholder="请输入标准类型名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
          <!--          <el-checkbox>已配置</el-checkbox>-->
          <!--          <el-button-->
          <!--            type="primary"-->
          <!--            plain-->
          <!--            icon="el-icon-plus"-->
          <!--            size="mini"-->
          <!--          >新增</el-button>-->
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
            @node-contextmenu="rightClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <!--              <span>-->
              <!--                <el-button-->
              <!--                  type="text"-->
              <!--                  size="mini"-->
              <!--                  @click="() => append(data)">-->
              <!--                  新增-->
              <!--                </el-button>-->
              <!--                <el-button-->
              <!--                  type="text"-->
              <!--                  size="mini"-->
              <!--                  @click="() => remove(node, data)">-->
              <!--                  删除-->
              <!--                </el-button>-->
              <!--              </span>-->
            </span>
          </el-tree>
        </div>
        <!--        <div :style="{'z-index': 9999, position: 'fixed',left: optionCardX + 'px',-->
        <!--				top: optionCardY + 'px', width: '100px', background: 'white',-->
        <!--				 'box-shadow': '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'}"-->
        <!--             v-show="optionCardShow" id="option-button-group">-->

        <!--          <el-button @click="append" class="option-card-button">新建文件夹-->
        <!--          </el-button>-->
        <!--          <el-button @click="remove" class="option-card-button">删除文件夹-->
        <!--          </el-button>-->
        <!--          <el-button @click="rename" class="option-card-button">重命名-->
        <!--          </el-button>-->
        <!--        </div>-->

        <div
          id="menu"
          v-show="optionCardShow"
          @mouseleave="optionCardShow = !optionCardShow"
        >
          <el-card class="box-card">
            <div class="text item">
              <el-link
                icon="el-icon-circle-plus-outline"
                @click="() => treeAdd()"
                :underline="false"
                >添加分类</el-link
              >
            </div>
            <div class="text item">
              <el-link
                icon="el-icon-edit"
                @click="() => treeUpdate()"
                :underline="false"
                >修改分类</el-link
              >
            </div>
            <div class="text item">
              <el-link
                icon="el-icon-remove-outline"
                @click="() => treeRemove()"
                :underline="false"
                >删除分类</el-link
              >
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col class="standard" :span="20" :xs="24">
        <!--        <el-card>-->
        <div>
          <el-form
            style="width: 100%; float: left; margin-top: 0px; margin-left: 10px"
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="70px"
          >
            <el-form-item label="标准名/文件名" label-width="110px" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入标准名/文件名"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="标准号/文号" label-width="90" prop="stdNo">
              <el-input
                v-model="queryParams.stdNo"
                placeholder="请输入标准号/文号"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form>

          <el-row
            style="
              float: left;
              margin-top: 0px;
              margin-left: 5px;
              margin-bottom: 20px;
            "
            :gutter="10"
            class="mb8"
          >
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd(null)"
                v-hasPermi="['knowledge/standard:add']"
                >新增</el-button
              >
            </el-col>
            <!--          v-hasPermi="['system:standard:remove']"-->
            <!--          :disabled="multiple"-->
            <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                v-hasPermi="['knowledge/standard:remove']"
                @click="handleDelete"
                >删除</el-button
              >
            </el-col>
            <!--          <el-col :span="1.5">-->
            <!--            <el-button-->
            <!--              type="info"-->
            <!--              plain-->
            <!--              icon="el-icon-upload2"-->
            <!--              size="mini"-->
            <!--              @click="handleExport"-->
            <!--              v-hasPermi="['system:standard:upload']"-->
            <!--            >导入</el-button>-->
            <!--          </el-col>-->
          </el-row>
        </div>
        <!--          @selection-change="handleSelectionChange"-->
        <el-table
          style="min-height: calc(100vh - 250px)"
          v-loading="loading"
          :data="standardList"
          @selection-change="handleSelectionChange"
        >
          <!--          :selectable='selectable'-->
          <el-table-column type="selection" width="55" align="center" />
          <!--          <el-table-column label="序号" type="index" align="center">-->
          <!--            <template slot-scope="scope">-->
          <!--              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column
            label="标准名/文件名"
            align="left"
            prop="chineseName"
          >
            <template slot-scope="scope">
              <a @click="handleInfo(scope.row)">{{ scope.row.chineseName }}</a>
            </template>
          </el-table-column>
          <el-table-column label="标准号/文号" align="left" prop="stdNo" />
          <!--          <el-table-column label="标准年代号" align="left" prop="yearNumber" width="90px" />-->
          <!--          <el-table-column label="发布日期" align="left" prop="publishDate" width="100px"/>-->
          <!--          <el-table-column label="实施日期" align="left" prop="effectiveDate" width="100px"/>-->
          <!--          <el-table-column label="ICS分类号" align="left" prop="ics" />-->
          <!--          <el-table-column label="中文分类号" align="left" prop="ccs" />-->
          <!--          <el-table-column label="标准类型" align="left" prop="type" width="80px" />-->
          <!--          <el-table-column label="标准状态" align="left" prop="status" width="80px" />-->
          <!--          <el-table-column label="标准页数" align="left" prop="pageNo" width="80px" />-->
          <el-table-column
            label="操作"
            align="left"
            class-name="small-padding fixed-width"
            width="300px"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-info"
                @click="handleInfo(scope.row)"
                v-hasPermi="['knowledge/standard:details']"
                >详情</el-button
              >
              <el-button
                size="mini"
                type="text"
                v-if="scope.row.files && scope.row.files.length > 0"
                icon="el-icon-download"
                @click="handleDownLoad(scope.row)"
                v-hasPermi="['knowledge/standard:download']"
                >下载文档</el-button
              >
              <el-button
                size="mini"
                type="text"
                v-if="scope.row.relatedUrl && scope.row.relatedUrl != ''"
                icon="el-icon-link"
                @click="handleOpen(scope.row)"
                v-hasPermi="['knowledge/standard:relation']"
                >关联网站</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['knowledge/standard:modify']"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['knowledge/standard:remove']"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <!--        </el-card>-->
      </el-col>
    </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      :destroyOnClose="destroyOnClose"
      :show-close="false"
      :close-on-click-modal="false"
      class="standardInfo"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="110px"
        style="padding-right: 20px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="标准名/文件名" prop="chineseName">
              <el-input
                v-model="form.chineseName"
                placeholder="标准名/文件名"
                :disabled="infoType == 'info'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属目录" prop="catalogId">
              <treeselect
                noChildrenText="没有子节点"
                v-model="form.catalogId"
                :value="form.catalogId"
                :options="standardCatalogInfoTree"
                :show-count="true"
                :disabled="catalogDisabled || infoType == 'info'"
                placeholder="选择所属目录"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-row>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="标准类型" prop="type">-->
        <!--              <el-select-->
        <!--                style="width: 100%"-->
        <!--                v-model="form.type"-->
        <!--                placeholder="类型"-->
        <!--                clearable-->
        <!--                size="small"-->
        <!--                :disabled="infoType == 'info'"-->
        <!--                @change="formTypeChange"-->
        <!--              >-->
        <!--                <el-option-->
        <!--                  v-for="i in typeOptions"-->
        <!--                  :key="i.value"-->
        <!--                  :label="i.label"-->
        <!--                  :value="i.value"-->
        <!--                />-->
        <!--              </el-select>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="标准英文名称" prop="englishName">-->
        <!--              <el-input v-model="form.englishName" placeholder="标准英文名称" :disabled="infoType == 'info'" />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="标准号/文号" prop="stdNo">
              <el-input
                v-model="form.stdNo"
                placeholder="标准号/文号"
                :disabled="infoType == 'info'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联网址" prop="relatedUrl">
              <el-input
                v-model="form.relatedUrl"
                placeholder="关联网址"
                :disabled="infoType == 'info'"
              />
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="标准状态" prop="status">-->
          <!--              <el-select-->
          <!--                style="width:100%"-->
          <!--                v-model="form.status"-->
          <!--                placeholder="标准状态"-->
          <!--                clearable-->
          <!--                :disabled="infoType == 'info'"-->
          <!--                size="small"-->
          <!--              >-->
          <!--                <el-option-->
          <!--                  v-for="i in statusOptions"-->
          <!--                  :key="i.value"-->
          <!--                  :label="i.label"-->
          <!--                  :value="i.value"-->
          <!--                />-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
        <!--        <el-row>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="发布日期" prop="publishDate">-->
        <!--              <el-date-picker-->
        <!--                style="width: 100%"-->
        <!--                v-model="form.publishDate"-->
        <!--                type="date"-->
        <!--                format="yyyy-MM-dd"-->
        <!--                value-format="yyyy-MM-dd"-->
        <!--                placeholder="选择发布日期"-->
        <!--                :disabled="infoType == 'info'"-->
        <!--              >-->
        <!--              </el-date-picker>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="实施日期" prop="effectiveDate">-->
        <!--              <el-date-picker-->
        <!--                style="width: 100%"-->
        <!--                v-model="form.effectiveDate"-->
        <!--                type="date"-->
        <!--                format="yyyy-MM-dd"-->
        <!--                value-format="yyyy-MM-dd"-->
        <!--                placeholder="选择发布日期"-->
        <!--                :disabled="infoType == 'info'"-->
        <!--              >-->
        <!--              </el-date-picker>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="标准年代号" prop="yearNumber">-->
        <!--              <el-date-picker-->
        <!--                style="width: 100%"-->
        <!--                v-model="form.yearNumber"-->
        <!--                type="year"-->
        <!--                format="yyyy"-->
        <!--                placeholder="选择年"-->
        <!--                :disabled="infoType == 'info'"-->
        <!--              >-->
        <!--              </el-date-picker>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="标准页数" prop="pageNo">-->
        <!--              <el-input type="number" style="width: 100%" v-model="form.pageNo" placeholder="标准页数" :disabled="infoType == 'info'" />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="ICS分类号" prop="ics">-->
        <!--              <el-input v-model="form.ics" placeholder="ICS分类号" :disabled="infoType == 'info'" />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="中文分类号" prop="ccs">-->
        <!--              <el-input v-model="form.ccs" placeholder="中文分类号" :disabled="infoType == 'info'" />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-form-item label="附件" prop="attachment">
          <upload-file
            v-if="infoType == 'edit' || infoType == 'add'"
            @input="fileUploadResult"
            @remove="fileRemove"
            :file-size="50"
            :limit="1"
            :fileType="['pdf', 'doc', 'docx', 'xlsx', 'xls']"
            :value="attachment"
          ></upload-file>
          <el-table
            v-if="infoType == 'info'"
            :data="attachment"
            :show-header="false"
          >
            <el-table-column>
              <template slot-scope="scope">
                <el-link
                  :href="`${downloadFileUrl}?fileId=${scope.row.uid}`"
                  :download="scope.row.name"
                  :underline="false"
                  target="_blank"
                >
                  <span class="el-icon-document"> {{ scope.row.name }} </span>
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :disabled="infoType == 'info'"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="infoType == 'add' || infoType == 'edit'"
          @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="treeOpen"
      width="800px"
      :destroyOnClose="destroyOnClose"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form ref="treeForm" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入属性名称"
                :disabled="infoType == 'info'"
              />
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
              <el-input
                type="Number"
                v-model="form.sortNum"
                placeholder="请输入排序"
                :disabled="infoType == 'info'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注"
            :disabled="infoType == 'info'"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="infoType == 'add' || infoType == 'edit'"
          @click="submitTreeForm"
          >确 定</el-button
        >
        <el-button @click="treeCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 文档下载对话框   -->
    <el-dialog
      :title="downloadTitle"
      :visible.sync="openDownload"
      width="500px"
      :destroyOnClose="destroyOnClose"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-table :data="attachment">
        <el-table-column label="文档">
          <template slot-scope="scope">
            <el-link
              :href="`${downloadFileUrl}?fileId=${scope.row.uid}`"
              :download="scope.row.name"
              :underline="false"
              target="_blank"
            >
              <span class="el-icon-document"> {{ scope.row.name }} </span>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--导入弹窗-->
    <el-dialog
      :close-on-click-modal="false"
      title="数据导入"
      :visible.sync="showExport"
      width="500px"
      class="expert-dialog"
    >
      <excel-upload :code="code"></excel-upload>
    </el-dialog>
  </div>
</template>

<script>
import {
  listData,
  getData,
  addStandardData,
  delStandardData,
  updateStandardData,
} from "@/api/system/standard";
import {
  TreeData,
  addData,
  delData,
  updateData,
  getTreeData,
} from "@/api/system/standardCatalog";
import UploadFile from "@/components/UploadFile";
import ExcelUpload from "@/components/ExcelUpload";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import store from "../../../store";
import { windowOpen } from "echarts/lib/util/format";

export default {
  name: "Standard",
  components: { Treeselect, UploadFile, ExcelUpload },
  data() {
    return {
      code: "standard",
      downloadFileUrl: process.env.VUE_APP_BASE_API + "/file/download",
      baseUrl: process.env.VUE_APP_BASE_API,
      // 关闭时销毁 Dialog 中的元素
      destroyOnClose: true,
      // 子页面类型
      infoType: "",
      defaultProps: {
        children: "children",
        label: "name",
      },
      // 想子页面传递值
      infoId: "",
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
      // 弹出层标题
      title: "",
      downloadTitle: "文档下载",
      // 是否显示弹出层
      open: false,
      treeOpen: false,
      // 是否显示文档下载弹出层
      openDownload: false,
      // 是否显示导入弹出层
      showExport: false,
      // 标准类别树
      standardCatalogTree: [],
      // 标准类别查询
      name: undefined,
      optionCardShow: false,
      optionCardX: "", // 让右键菜单出现在鼠标右键的位置
      optionCardY: "",
      optionData: [],
      node: null, // 将当前节点保存
      tree: null,
      nodeData: {},
      // 标准状态options
      statusOptions: [
        { label: "未生效", value: "0" },
        { label: "现行", value: "1" },
        { label: "废止", value: "2" },
      ],
      // 标准类型options
      typeOptions: [
        { label: "公共标准", value: "0" },
        { label: "内部标准", value: "1" },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        stdNo: "",
        catalogId: null,
        delFlag: "0",
        id: null,
      },
      // 表单参数
      form: {},
      formType: null,
      catalogDisabled: false,
      attachment: [],
      // 表单校验
      rules: {
        chineseName: [
          { required: true, message: "标准名/文件名不能为空", trigger: "blur" },
        ],
        stdNo: [
          { required: true, message: "标准号/文号不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择标准类型", trigger: "blur" }],
        status: [
          { required: true, message: "请选择标准状态", trigger: "blur" },
        ],
        name: [
          { required: true, message: "属性名称不能为空", trigger: "blur" },
        ],
        sortNum: [{ required: true, message: "排序不能为空", trigger: "blur" }],
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
      this.$refs.tree.filter(val);
    },
    // showExport: {
    //   handler(val) {
    //     console.log('showExport:', val)
    //     if (!val) {
    //       this.getTree()
    //       this.getList()
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // formType: {
    //   handler(val) {
    //     console.log('formType:', val)
    //     if (val == '1') {
    //       this.form.catalogId = null
    //       this.catalogDisabled = true
    //     } else {
    //       this.catalogDisabled = false
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
    // this.deptId = store.getters.dept.deptId
    this.queryParams.catalogId = null;
    this.queryParams.id = this.$route.query.id;
    this.getTree();
    this.getList();
  },
  activated() {
    this.queryParams.catalogId = null;
    this.queryParams.id = this.$route.query.id;
    this.getTree();
    this.getList();
  },
  methods: {
    append(data) {
      // const newChild = { id: id++, label: 'testtest', children: [] };
      // if (!data.children) {
      //   this.$set(data, 'children', []);
      // }
      // data.children.push(newChild);
      // console.log("parentData=======",data);
    },
    treeAdd() {
      this.handleTreeAdd(this.nodeData.data.id);
    },
    treeUpdate() {
      this.handleTreeUpdate(this.nodeData.data.id);
    },
    treeRemove() {
      if (this.nodeData.data.parentId === 0) {
        this.$modal.msgError("根节点不能删除！");
        return;
      }
      this.handleTreeDelete(this.nodeData.data.id, this.nodeData.data.label);
    },
    // 文件夹右键时触发的事件
    floderOption(e, data, n, t) {
      this.optionCardShow = false;
      this.optionCardX = e.x; // 让右键菜单出现在鼠标右键的位置
      this.optionCardY = e.y - 110;
      this.optionData = data;
      this.node = n; // 将当前节点保存
      this.tree = t;
      this.optionCardShow = true; // 展示右键菜单
    },
    rightClick(MouseEvent, object, Node, element) {
      this.nodeData = Node;
      // debugger
      this.optionCardShow = true;
      let menu = document.querySelector("#menu");
      menu.style.cssText =
        "position: fixed; left: " +
        (MouseEvent.clientX - 10) +
        "px" +
        "; top: " +
        (MouseEvent.clientY - 25) +
        "px; z-index: 999; cursor:pointer;";
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
    },
    /** 分类树新增按钮操作 */
    handleTreeAdd(id) {
      this.title = "添加信息";
      this.infoType = "add";
      this.infoId = null;
      this.form.parentId = id || this.queryParams.parentId;
      this.treeOpen = true;
    },
    /** 分类树更新按钮操作 */
    handleTreeUpdate(id) {
      this.title = "修改信息";
      this.infoType = "edit";
      this.infoId = null;
      this.form.parentId = id || this.queryParams.parentId;
      this.getTreeInfoData(id);
      this.treeOpen = true;
    },
    // 获取详情信息
    getTreeInfoData(id) {
      getTreeData(id)
        .then((res) => {
          if (res.data && res.data != null) {
            this.form = res.data;
          }
        })
        .catch((er) => {
          this.msgError("获取详情信息失败：" + er);
        });
    },
    /** 删除按钮操作 */
    handleTreeDelete(id, name) {
      // const ids = id != null ? [row.id] : this.ids;
      const ids = [id];
      this.$confirm('是否删除"' + name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delData(ids);
        })
        .then(() => {
          this.getTree();
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    selectable(row, index) {
      if (this.deptId == "100") {
        return true;
      }
      if (row.deptId == null) {
        return false;
      }
      return row.deptId == this.deptId;
    },
    fileUploadResult(e) {
      if (e && e.length > 0) {
        this.attachment = e;
      }
    },
    fileRemove(e) {
      if (e) {
        if ((e.length = 0)) {
          this.attachment = [];
        } else {
          this.attachment = e;
        }
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.catalogId = data.id;
      this.queryParams.id = null;
      this.getList();
    },
    getTree() {
      this.standardCatalogTree = [];
      this.standardCatalogInfoTree = [];
      const params = {
        name: "",
        parentId: null,
        isDeleted: "0",
      };
      TreeData(params).then((res) => {
        if (res.data) {
          this.standardCatalogTree = res.data;
          /*this.standardCatalogTree.push({
            id: -1,
            name: '内部标准',
            label: '内部标准',
            isDisabled: true,
            parentId: null
          })*/
          this.standardCatalogInfoTree = res.data;
        }
      });
    },
    /** 查询属性列表 */
    getList() {
      this.loading = true;
      this.standardList = [];
      listData(this.queryParams).then((response) => {
        if (response.rows && response.rows.length > 0) {
          this.standardList = response.rows;
          this.standardList.forEach((item) => {
            item.files =
              item.attachment != null ? JSON.parse(item.attachment) : null;
            item.url =
              item.files != null && item.files.length > 0
                ? this.baseUrl + item.files[0].url
                : null;
            item.file =
              item.files != null && item.files.length > 0
                ? item.files[0]
                : null;
          });
        }
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.openDownload = false;
      this.open = false;
      this.form = {};
      this.formType = null;
      this.attachment = [];
      this.infoId = "";
      this.infoType = "";
    },
    // 取消按钮
    treeCancel() {
      this.openDownload = false;
      this.treeOpen = false;
      this.form = {};
      this.formType = null;
      this.attachment = [];
      this.infoId = "";
      this.infoType = "";
    },
    // 关闭dialog并刷新列表
    cancelAndReset() {
      this.open = false;
      this.form = {};
      this.formType = null;
      this.infoId = "";
      this.infoType = "";
      this.attachment = [];
      this.getTree();
      this.getList();
    },
    // 关闭dialog并刷新列表
    treeCancelAndReset() {
      this.treeOpen = false;
      this.form = {};
      this.formType = null;
      this.infoId = "";
      this.infoType = "";
      this.attachment = [];
      this.getTree();
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.id = null;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.catalogId = null;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(id) {
      this.title = "添加信息";
      this.infoType = "add";
      this.infoId = null;
      this.form.catalogId =
        this.queryParams.catalogId == undefined
          ? null
          : this.queryParams.catalogId;
      this.catalogDisabled = false;
      this.open = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids;
      this.infoType = "edit";
      this.infoId = id;
      this.title = "修改信息";
      this.getInfoData(id);
      this.open = true;
    },
    /** 下载文档 */
    handleDownLoad(row) {
      // if (row && row.attachment) {
      //   this.openDownload = true
      //   this.attachment = JSON.parse(row.attachment);
      // } else {
      //   this.msgError("该标准暂无文档");
      // }

      if (row && row.file) {
        let link = document.createElement("a");
        link.href = this.baseUrl + row.file.url; //this.baseUrl+item.files[0].url
        link.download = row.file.name; // 自定义文件名
        console.log("downloadName======", link.download);
        link.click(); // 下载文件
        this.closeDownloadFile(row);
      } else {
        this.$message.error("下载出错，请重试");
        this.closeDownloadFile(row);
      }
    },

    closeDownloadFile(row) {
      if (row && row.file) {
        // 释放内存
        URL.revokeObjectURL(this.baseUrl + row.file.url);
      }
    },

    /** 打开外站 */
    handleOpen(row) {
      if (row && row.relatedUrl) {
        // windowOpen(row.relatedUrl);
        window.open(row.relatedUrl);
      }
    },
    /** 查看详情给 */
    handleInfo(row) {
      const id = row.id || this.ids;
      this.infoType = "info";
      this.infoId = id;
      this.title = "详细信息";
      this.getInfoData(id);
      this.open = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id != null ? [row.id] : this.ids;
      this.$confirm("是否删除数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delStandardData(ids);
        })
        .then(() => {
          this.getTree();
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    handleExport() {
      this.showExport = true;
    },
    /** 标准文件提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.name = this.form.chineseName;
          this.form.attachment = JSON.stringify(this.attachment);
          if (
            this.form.id != null &&
            this.form.id != undefined &&
            this.form.id != ""
          ) {
            updateStandardData(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.cancelAndReset();
            });
          } else {
            addStandardData(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.cancelAndReset();
            });
          }
        }
      });
    },
    /** 分类树提交按钮 */
    submitTreeForm: function () {
      this.$refs["treeForm"].validate((valid) => {
        if (valid) {
          if (
            this.form.id != null &&
            this.form.id != undefined &&
            this.form.id != ""
          ) {
            updateData(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.treeCancelAndReset();
            });
          } else {
            addData(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.treeCancelAndReset();
            });
          }
        }
      });
    },
    // 获取详情信息
    getInfoData(id) {
      getData(id)
        .then((res) => {
          if (res.data && res.data != null) {
            this.attachment = JSON.parse(res.data.attachment);
            this.form = res.data;
            this.formType = res.data.type;
          }
        })
        .catch((er) => {
          this.msgError("获取详情信息失败：" + er);
        });
    },
    formTypeChange(val) {
      this.formType = val;
    },
  },
};
</script>
<style scoped>
.standard .el-card__body {
  padding: 0px 0px 20px 0px;
}
.el-input.is-disabled .el-input__inner {
  background-color: #ffffff;
  color: #606266;
}
.standardInfo .vue-treeselect--disabled .vue-treeselect__control {
  background-color: #ffffff;
}
.standardInfo .el-textarea.is-disabled .el-textarea__inner {
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
  clear: both;
}

.box-card {
  width: 120px;
  height: 95px;
}
</style>
