<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" size="small" :inline="true">
      <el-form-item label="数据类型名称">
        <el-input
          v-model="queryParams.planDecisionName"
          placeholder="请输入数据类型名称"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="城市名称">
        <el-select
          v-model="queryParams.cityId"
          placeholder="请选择城市"
          style="width: 100%"
        >
          <el-option
            v-for="dict in cityList"
            :key="dict.id"
            :label="dict.cityName"
            :value="dict.id"
            style="width: 240px"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
          >新增</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
          >修改</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="ids.length == 0"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
          >导出</el-button
        >
      </el-col> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="规划主题名称"
        prop="typeName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="场景名称"
        prop="name"
        :show-overflow-tooltip="true"
      >
      </el-table-column>

      <el-table-column label="数量" prop="num" :show-overflow-tooltip="true">
      </el-table-column>

      <!-- <el-table-column
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
            v-hasPermi="['system:role:edit']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  cityList,
  dataScope,
  changeRoleStatus,
} from "@/api/decisions/analysis";

export default {
  name: "Role",
  dicts: ["sys_normal_disable", "data_type"],
  data() {
    return {
      // 遮罩层
      loading: true,
      ids: [],
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      cityList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: this.$route.query.id,
      },
      // 表单参数
      form: {},
    };
  },
  computed: {},
  created() {
    this.getList();
    this.cityLists();
  },
  methods: {
    async cityLists() {
      const data = await cityList();
      this.cityList = data;
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.queryParams).then((response) => {
        this.roleList = JSON.parse(response.data.analyseData);
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      // this.$modal
      //   .confirm('确认要"' + text + '""' + row.roleName + '"角色吗？')
      //   .then(function () {
      //     return changeRoleStatus(row.id, row.status);
      //   })
      //   .then(() => {
      //     this.$modal.msgSuccess(text + "成功");
      //   })
      //   .catch(function () {
      //     row.status = row.status === "0" ? "1" : "0";
      //   });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {},
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.handleQuery();
    },

    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == "menu") {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == "dept") {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == "menu") {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type == "dept") {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == "menu") {
        this.form.menuCheckStrictly = value ? true : false;
      } else if (type == "dept") {
        this.form.deptCheckStrictly = value ? true : false;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加城市";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({ path: "/decisions/graphic", query: { id: row.id } });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id ? [row.id] : this.ids;
      this.$modal
        .confirm("是否确认删除此数据项？")
        .then(function () {
          return delRole({ ids });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/role/export",
        {
          ...this.queryParams,
        },
        `role_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
