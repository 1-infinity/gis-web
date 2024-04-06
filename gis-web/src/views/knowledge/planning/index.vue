<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="操作人员" prop="createBy">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.createBy"-->
      <!--          placeholder="请输入操作人员"-->
      <!--          clearable-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="类型" prop="noticeType">-->
      <!--        <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable>-->
      <!--          <el-option-->
      <!--            v-for="dict in dict.type.sys_notice_type"-->
      <!--            :key="dict.value"-->
      <!--            :label="dict.label"-->
      <!--            :value="dict.value"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['knowledge/planning:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['knowledge/planning:modify']"
          >修改</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['knowledge/planning:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="planningList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!--      <el-table-column label="序号" align="center" prop="id" width="100" />-->
      <el-table-column
        label="标题"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="描述"
        align="center"
        prop="discription"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="关联标准号/文号"
        align="center"
        prop="stdNo"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="standardTo(scope.row)"
            style="text-decoration: none; font-size: 13px; text-align: center"
            >{{ scope.row.stdNo }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="关联标准名/文件名"
        align="center"
        prop="chineseName"
        :show-overflow-tooltip="true"
      />
      <el-table-column align="center" prop="url" label="缩略图" width="120">
        <template slot-scope="scope">
          <img
            v-for="(item, index) in scope.row.attachment"
            :key="index"
            :src="`${baseUrl}${item.url}`"
            style="width: 50px; height: 50px"
            alt=""
            @click="preview(scope.row)"
          />
        </template>
      </el-table-column>
      <!--      <el-table-column label="创建者" align="center" prop="createBy" width="120" />-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['knowledge/planning:modify']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['knowledge/planning:remove']"
            >删除</el-button
          >
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-link"-->
          <!--            @click="handleRelate(scope.row)"-->
          <!--          >关联标准</el-button>-->
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-picture"-->
          <!--            @click="preview(scope.row)"-->
          <!--          >预览截图</el-button>-->
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

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入公告标题" />
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="公告类型" prop="noticeType">-->
          <!--              <el-select v-model="form.noticeType" placeholder="请选择公告类型">-->
          <!--                <el-option-->
          <!--                  v-for="dict in dict.type.sys_notice_type"-->
          <!--                  :key="dict.value"-->
          <!--                  :label="dict.label"-->
          <!--                  :value="dict.value"-->
          <!--                ></el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="24">-->
          <!--            <el-form-item label="状态">-->
          <!--              <el-radio-group v-model="form.status">-->
          <!--                <el-radio-->
          <!--                  v-for="dict in dict.type.sys_notice_status"-->
          <!--                  :key="dict.value"-->
          <!--                  :label="dict.value"-->
          <!--                >{{dict.label}}</el-radio>-->
          <!--              </el-radio-group>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input
                v-model="form.discription"
                type="textarea"
                :min-height="192"
              ></el-input>
              <!--              <editor v-model="form.discription" :min-height="192"/>-->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="关联标准/文件"
              label-width="110"
              prop="standardId"
            >
              <input v-model="form.standardId" type="hidden" />
              <!--              :style="{width:infoType == 'info'?'100%':'70%'}"-->
              <el-input
                v-model="form.associateStandardName"
                style="width: 64%"
                readonly
              >
                <!--                infoType != 'info' &&-->
                <el-button
                  slot="append"
                  icon="el-icon-delete"
                  v-if="form.associateStandardName != null"
                  @click="clearSelectStandard()"
                ></el-button>
              </el-input>
              <!--              v-if="infoType != 'info'"-->
              <el-button
                style="width: 20%; margin-left: 2%; padding: 10px"
                type="primary"
                @click="selectStandard()"
                >选择标准/文件
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="截图" prop="attachment">
              <upload-file
                @input="fileUploadResult"
                @remove="fileRemove"
                :fileType="['JPG', 'PNG', 'png', 'jpg']"
                :limit="1"
                :value="attachment"
              ></upload-file>
              <!--              <el-table  :data="attachment" :show-header="false">-->
              <!--                <el-table-column >-->
              <!--                  <template slot-scope="scope">-->
              <!--                    <el-link :href="`${downloadFileUrl}?fileId=${scope.row.uid}`" :download="scope.row.name" :underline="false" target="_blank">-->
              <!--                      <span class="el-icon-document"> {{ scope.row.name }} </span>-->
              <!--                    </el-link>-->
              <!--                  </template>-->
              <!--                </el-table-column>-->
              <!--              </el-table>-->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--    <el-dialog :title="title" :visible.sync="selectOpen" width="800px" :destroyOnClose='destroyOnClose' :show-close="false" :close-on-click-modal="false" >-->
    <!--    <el-dialog :title="title" :visible.sync="selectOpen"  width="900px"  style="height: 1000px;scroll-behavior: auto">-->
    <el-dialog :title="title" :visible.sync="selectOpen" :fullscreen="true">
      <standard-select
        @select="selectChange"
        style="margin-top: -30px"
      ></standard-select>
      <div
        slot="footer"
        class="dialog-footer"
        style="margin-top: -40px; margin-bottom: -20px; margin-right: 50px"
      >
        <el-button type="primary" @click="submitRelate"
          >关联标准/文件</el-button
        >
        <el-button @click="cancelRelate">取 消</el-button>
      </div>
    </el-dialog>

    <!--  标准弹窗  -->
    <el-dialog
      :close-on-click-modal="false"
      :title="standardSelectDialog.title"
      :visible.sync="standardSelectDialog.open"
      width="800px"
      append-to-body
    >
      <el-form
        :model="standardQueryParams"
        ref="standardQueryParams"
        :inline="true"
        label-width="70px"
      >
        <el-form-item label="标准名/文件名" label-width="110" prop="name">
          <el-input
            v-model="standardQueryParams.name"
            placeholder="请输入标准名/文件名"
            clearable
            size="small"
            @keyup.enter.native="handleStandardQuery(false)"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleStandardQuery(false)"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetStandardQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="standardList"
        ref="standardTable"
        @select-all="cancelAllStandardSelection"
        @select="handleStandardSelection"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="标准名/文件名"
          align="left"
          prop="chineseName"
        />
        <el-table-column
          label="标准号/文号"
          align="left"
          prop="stdNo"
          :show-overflow-tooltip="true"
        />
        <!--        <el-table-column label="标准类型" align="left" prop="type" :show-overflow-tooltip="true" />-->
      </el-table>

      <pagination
        v-show="standardTotal > 0"
        :total="standardTotal"
        :page.sync="standardQueryParams.pageNum"
        :limit.sync="standardQueryParams.pageSize"
        @pagination="getStandardList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSelectStandard"
          >确 定</el-button
        >
        <el-button @click="cancelStandardSelect">取 消</el-button>
      </div>
    </el-dialog>
    <preview ref="preview" v-if="previewVisible"></preview>
  </div>
</template>

<script>
import {
  listPlanning,
  getPlanning,
  delPlanning,
  addPlanning,
  updatePlanning,
} from "@/api/system/planning";
import { listStandard } from "@/api/system/standard";
import UploadFile from "@/components/UploadFile";
import ExcelUpload from "@/components/ExcelUpload";
import StandardSelect from "../standard/stanrdSelect.vue";
import preview from "./preview.vue";

export default {
  name: "Planning",
  dicts: ["sys_notice_status", "sys_notice_type"],
  components: { UploadFile, ExcelUpload, StandardSelect, preview },
  data() {
    return {
      // 遮罩层
      loading: true,
      downloadFileUrl: process.env.VUE_APP_BASE_API + "/file/download",
      baseUrl: process.env.VUE_APP_BASE_API,
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
      // 公告表格数据
      planningList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      selectOpen: false,
      selectStandardId: "",
      attachment: [],
      previewVisible: false,
      // 标准集合
      standardList: [],
      standardTotal: 0,
      selectedStandard: null,
      standardSelectDialog: {
        title: "选择标准/文件",
        open: false,
      },
      // 查询参数
      standardQueryParams: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        delFlag: "0",
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        createBy: undefined,
        status: undefined,
      },

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        // noticeType: [
        //   { required: true, message: "公告类型不能为空", trigger: "change" }
        // ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      listPlanning(this.queryParams).then((response) => {
        this.planningList = response.rows;
        this.planningList.forEach((item) => {
          item.attachment =
            item.attachment != null ? JSON.parse(item.attachment) : null;
          item.url =
            item.attachment != null && item.attachment.length > 0
              ? this.baseUrl + item.attachment[0].url
              : null;
        });
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
        id: undefined,
        title: undefined,
        type: undefined,
        discription: undefined,
        status: "0",
        standardId: undefined,
      };
      this.attachment = [];
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加规划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPlanning(id).then((response) => {
        this.form = response.data;
        this.form.associateStandardName = response.data.chineseName;
        this.attachment = JSON.parse(response.data.attachment);
        this.open = true;
        this.title = "修改规划";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.attachment = JSON.stringify(this.attachment);
          if (this.form.id != undefined) {
            updatePlanning(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlanning(this.form).then((response) => {
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
      const ids = row.id != null ? [row.id] : this.ids;
      this.$modal
        .confirm('是否确认删除公告编号为"' + ids + '"的数据项？')
        .then(function () {
          return delPlanning(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 关联按钮操作 */
    handleRelate(row) {
      const ids = row.id || this.ids;
      this.reset();
      this.form.id = row.id;
      this.selectOpen = true;
      // this.$modal.confirm('是否确认删除公告编号为"' + ids + '"的数据项？').then(function() {
      //   return delPlanning(ids);
      // }).then(() => {
      //   this.getList();
      //   this.$modal.msgSuccess("删除成功");
      // }).catch(() => {});
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
    selectChange(e) {
      this.selectStandardId = e;
    },
    submitRelate() {
      console.log(" this.form=====", this.form);
      this.form.standardId = this.selectStandardId;
      if (this.form.id != undefined) {
        updatePlanning(this.form).then((response) => {
          this.$modal.msgSuccess("关联成功");
          this.selectOpen = false;
          this.getList();
        });
      }
    },
    cancelRelate() {
      this.reset();
      this.selectOpen = false;
    },
    // 查看标准
    standardTo(e) {
      this.$router.push({
        path: "/platform/standard",
        query: {
          id: e.standardId,
        },
      });
    },
    preview(data) {
      // console.log("preview record====",data)
      this.previewVisible = true;
      this.$nextTick(() => {
        this.$refs.preview.init(data);
      });
    },
    //选择标准弹窗
    selectStandard() {
      this.standardSelectDialog.open = true;
      this.handleStandardQuery(true);
    },
    // 清除选择标准
    clearSelectStandard() {
      this.form.standardId = null;
      this.form.associateStandardName = null;
      this.$forceUpdate();
    },
    handleStandardQuery(filterSelected) {
      this.standardQueryParams.pageNum = 1;
      this.getStandardList();
    },
    // 查询标准
    getStandardList() {
      this.standardList = [];
      listStandard(this.standardQueryParams).then((response) => {
        if (response.rows && response.rows.length > 0) {
          this.standardList = response.rows;
        }
        this.standardTotal = response.total;
      });
    },
    confirmSelectStandard() {
      if (this.selectedStandard) {
        this.form.standardId = this.selectedStandard.id;
        this.form.associateStandardName =
          this.selectedStandard.chineseName +
          "(" +
          this.selectedStandard.stdNo +
          ")";
      } else {
        this.form.standardId = null;
        this.form.associateStandardName = null;
      }
      this.selectedStandard = null;
      this.standardSelectDialog.open = false;
      this.$forceUpdate();
    },
    cancelStandardSelect() {
      this.selectedStandard = null;
      this.standardSelectDialog.open = false;
    },
    /** 重置按钮操作 */
    resetStandardQuery() {
      this.standardQueryParams = {
        pageNum: 1,
        pageSize: 10,
        name: "",
        type: null,
        delFlag: "0",
      };
      this.handleStandardQuery(false);
    },
    //标准复选框
    handleStandardSelection(selection, row) {
      this.$refs.standardTable.clearSelection();
      if (selection.length === 0) {
        // 判断selection是否有值存在
        this.selectedStandard = null;
        return;
      }
      if (row) {
        this.selectedStandard = row;
        this.$refs.standardTable.toggleRowSelection(row, true);
      }
    },
    // 标准弹窗 ———————————————————————————————————————————————————————————————————————————— start
    cancelAllStandardSelection() {
      this.$refs.standardTable.clearSelection();
    },
  },
};
</script>
