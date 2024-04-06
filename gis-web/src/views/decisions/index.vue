<template>
  <div class="app-container">
    <el-form :model="queryParams" size="small" :inline="true">
      <el-form-item label="名称">
        <el-input
          v-model="queryParams.planDecisionName"
          placeholder="请输入名称"
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
        >搜索
        </el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['decisions:add']"-->
<!--        >规划决策输入-->
<!--        </el-button-->
<!--        >-->
<!--      </el-col>-->
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
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="ids.length == 0"
          @click="handleDelete"
          v-hasPermi="['decisions:remove']"
        >删除
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          plain
          icon="el-icon-coin"
          size="mini"
          @click="handleShowLog"
        >规划决策执行记录
        </el-button>
        <!--        v-hasPermi="['decisions:remove']"  -->
      </el-col>
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
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="城市名称"
        prop="cityName"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="规划名称"
        prop="planDecisionName"
        align="center"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
      label="场景名称"
      prop="typeName"
      align="center"
      :show-overflow-tooltip="true"
    >

    </el-table-column>
      <el-table-column
        label="议题名称"
        prop="topicName"
        align="center"
        :show-overflow-tooltip="true"
      >
      </el-table-column>



      <el-table-column
        label="创建时间"
        align="center"
        width="200"
        prop="createTime"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
            icon="el-icon-set-up"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['decisions:contrast']"
          >决策对比
          </el-button
          >
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-pie-chart"-->
<!--            @click="handlefen(scope.row)"-->
<!--            v-hasPermi="['decisions:analysis']"-->
<!--          >决策统计-->
<!--          </el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleexportUp(scope.row)"
            v-hasPermi="['decisions:export']"
          >方案导出
          </el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['decisions:remove']"
          >删除
          </el-button
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
    <layer-loading :open="open" @close="close"></layer-loading>

    <!-- 添加或修改标准数据配置对话框 -->
    <el-dialog :title="title" :visible.sync="showLog" width="900px" :before-close="cancelLogTable" append-to-body>

      <el-form :model="queryLogParams" size="small" :inline="true">
        <el-form-item label="城市名称">
          <el-input
            v-model="queryLogParams.cityName"
            placeholder="请输入名称"
            clearable
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleLogQuery"
          >搜索
          </el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        v-loading="taskLoading"
        :data="taskLogList"
      >
        <el-table-column
          label="城市名称"
          prop="cityName"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          label="开始时间"
          align="center"
          width="200"
          prop="createTime"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="执行状态"
          align="center"
          width="200"
          prop="createTime"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0">执行中</el-tag>
            <el-tag type="success" v-if="scope.row.status == 1">执行完成</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 2">运行中断</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="结束时间"
          align="center"
          width="200"
          prop="endTime"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endTime) }}</span>
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
              icon="el-icon-delete"
              @click="handleDeleteLog(scope.row)"
              v-hasPermi="['decisions:remove']">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <pagination
        v-show="logTotal > 0"
        :total="logTotal"
        :page.sync="queryLogParams.pageNum"
        :limit.sync="queryLogParams.pageSize"
        @pagination="selectTaskLogList"
      />

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelLogTable">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listRole,
  delRole,
  cityList
} from '@/api/decisions/decisions'
import {
  getTaskLogPage,
  deleteLog
} from '@/api/decisions/taskLog'
import {
  downloadFile
} from '@/api/gis/upload'
import layerLoading from '../../components/layer-loading'

export default {
  name: 'Role',
  dicts: ['sys_normal_disable', 'data_type'],
  components: {
    layerLoading
  },
  data() {
    return {
      taskLoading: true,
      taskLogList: [],
      showLog: false,
      // 遮罩层
      loading: true,
      ids: [],
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      cityList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cityId: '',
        planDecisionName: ''
      },
      queryLogParams: {
        pageNum: 1,
        pageSize: 10,
        cityName: ''
      },
      logTotal: 0,
      // 查询参数
      dataFileShow: false,
      item: {},
      flag: true,
      rules: {
        cityId: [
          { required: true, message: '请输入城市名称', trigger: 'change' }
        ]
      },
      // 表单参数
      form: {}
    }
  },
  computed: {},
  created() {
    this.getList()
    this.cityLists()
  },
  methods: {
    // 多选框选中数据
    handleDeleteLog(row) {

      const id = row.id
      this.$modal
        .confirm('是否确认删除此数据项？')
        .then(function() {
          return deleteLog({ id })
        })
        .then(() => {
          this.selectTaskLogList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {
        })

    },
    handleLogQuery() {
      this.queryLogParams.pageNum = 1
      this.selectTaskLogList()
    },
    cancelLogTable() {
      this.showLog = false
      this.queryLogParams = {
        pageNum: 1,
        pageSize: 10,
        cityName: ''
      }
    },
    handleShowLog() {
      this.showLog = true
      this.selectTaskLogList()
    },
    selectTaskLogList() {
      this.taskLoading = true
      getTaskLogPage(this.queryLogParams).then(res => {

        this.taskLogList = res.rows
        this.logTotal = res.total
        this.taskLoading = false

      })

    },
    close() {
      this.open = false
      this.getList()
    },
    async cityLists() {
      const data = await cityList()
      this.cityList = data
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.queryParams).then((response) => {
        this.roleList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
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
      this.open = false
      this.reset()
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false
      this.reset()
    },
    // 表单重置
    reset() {
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.handleQuery()
    },

    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true : false
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true : false
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
    },
    handlefen(row) {
      this.$router.push({
        path: '/platform/analysis',
        query: { id: row.id }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({
        path: '/platform/graphic',
        query: { id: row.id }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id ? [row.id] : this.ids
      this.$modal
        .confirm('是否确认删除此数据项？')
        .then(function() {
          return delRole({ ids })
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/role/export',
        {
          ...this.queryParams
        },
        `role_${new Date().getTime()}.xlsx`
      )
    },
    handleexportUp(row) {

      downloadFile({ id: row.fileName }).then(res => {
        // this.pdfLoading = false
        const link = document.createElement('a')
        const blob = new Blob([res], { type: 'application/octet-stream' })
        // 获取heads中的filename文件名
        // console.log(res)
        // const temp = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
        // const fileName = decodeURIComponent(item.fileName)
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', 'result.zip')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      // exportUp({ id: row.id }).then((response) => {
      //   const blob = new Blob([response], { type: "application/vnd.ms-excel" });
      //   const link = document.createElement("a");
      //   document.body.appendChild(link);
      //   link.href = window.URL.createObjectURL(blob);
      //   link.download = "规划决策分析数据.xlsx";
      //   link.click();
      // });
    }
  }
}
</script>
<style lang="scss" scoped></style>
