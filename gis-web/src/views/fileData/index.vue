<template>
  <div class="app-container">
    <el-form :model="queryParams" size="small" :inline="true">
      <!--      <el-form-item label="数据名称">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.coverageName"-->
      <!--          placeholder="请输入数据名称"-->
      <!--          clearable-->
      <!--          style="width: 240px"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="类型名称">
        <el-input
          v-model="queryParams.typeName"
          placeholder="请输入类型名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属城市">
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['gis/upload:add']"
        >新增
        </el-button
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
          v-hasPermi="['system:role:remove']"
        >删除
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="uploadOtherData"
          v-hasPermi="['system:role:remove']"
        >其他文件上传
        </el-button
        >
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
      <!--      <el-table-column-->
      <!--        label="数据名称"-->
      <!--        prop="coverageName"-->
      <!--        :show-overflow-tooltip="true"-->
      <!--        width="150"-->
      <!--      />-->
      <el-table-column label="所属城市" align="center" prop="cityName">
      </el-table-column>
      <el-table-column label="类型名称" align="center" prop="typeName">
      </el-table-column>
      <el-table-column label="文件名称" align="center" prop="fileName">
      </el-table-column>
      <!--      <el-table-column label="图层风格" align="center" prop="style">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ parseStyle(scope.row.style) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        label="上传时间"
        align="center"
        prop="createTime"
        width="180"
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
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
            >修改</el-button
          > -->

          <!--          <el-button-->
          <!--            v-if="scope.row.publisherStatus == '1'"-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            @click="handlePul(scope.row)"-->
          <!--            v-hasPermi="['gis/upload:release']"-->
          <!--            >发布</el-button>-->
          <!--          <el-button-->
          <!--            v-if="scope.row.publisherStatus == '0'"-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            @click="handleYulan(scope.row)"-->
          <!--            >预览</el-button-->
          <!--          >-->

          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="downloadFile(scope.row)"
          >下载
          </el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['gis/upload:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <div style="height: 70vh; overflow-x: scroll; overflow-y: scroll">
        <el-form
          class="form"
          ref="form"
          :model="form"
          :rules="rules"
          :inline="true"
          label-width="150px"
        >
          <el-form-item class="item" label="城市" prop="cityId">
            <el-select
              v-model="form.cityId"
              placeholder="请选择城市"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="dict in cityList"
                :key="dict.id"
                :label="dict.cityName"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <!--        <el-alert-->
          <!--          title="zip文件内shp文件及其他文件名称只能由英文字母、数字和下划线组成！"-->
          <!--          type="warning"-->
          <!--          :closable="false"-->
          <!--          center-->
          <!--        >-->
          <!--        </el-alert>-->
          <div style="background-color: #fff8e6; color: #ffba00;padding:8px 0;border-radius:5px">
            <div style="text-align: center;font-size: 13px">上传文件为zip文件，请直接压缩shp文件及其相关文件到压缩包，不要将文件夹进行压缩！</div>
            <div style="text-align: center;font-size: 13px">zip文件内shp文件及其他文件名称只能由英文字母、数字和下划线组成！</div>
          </div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>基本数据：</span>
            </div>
            <template v-for="(val, i) in form.typeList">
              <el-row class="hangss" v-if="val.isRequired == '1'" :key="val.id">
                <el-col :span="15">
                  <el-form-item
                    :label="val.typeName"
                    :prop="'typeList.' + i + '.filelist'"
                    :rules="rules.filelist"
                  >
                    <el-upload
                      :action="uploadUrl+ '?type=' + val.id"
                      :multiple="false"
                      accept=".zip"
                      :file-list="val.filelist"
                      :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) => uploadSuccess(res, file, i, form.typeList)
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.typeList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.typeList, val)
                    "
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="图层风格">
                    <el-select
                      v-model="val.style"
                      placeholder="请选择图层风格"
                      style="width: 150px"
                    >
                      <el-option
                        v-for="dict in dict.type.coverage_style"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-else :key="val.id">
                <el-col :span="15">
                  <el-form-item :label="val.typeName">
                    <el-upload
                      :action="uploadUrl+ '?type=' + val.id"
                      :multiple="false"
                      :file-list="val.filelist"
                      accept=".zip"
                      :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) => uploadSuccess(res, file, i, form.typeList)
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.typeList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.typeList, val)
                    "
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="图层风格">
                    <el-select
                      v-model="val.style"
                      placeholder="请选择图层风格"
                      style="width: 150px"
                    >
                      <el-option
                        v-for="dict in dict.type.coverage_style"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>备选点数据：</span>
            </div>
            <template v-for="(val, i) in form.alternativeList">
              <el-row v-if="val.isRequired == '1'" :key="val.id">
                <el-col :span="15">
                  <el-form-item
                    :label="val.typeName"
                    :prop="'yanList.' + i + '.filelist'"
                    :rules="rules.filelist"
                  >
                    <el-upload
                      :action="uploadUrl+ '?type=' + val.id"
                      :multiple="false"
                      :file-list="val.filelist"
                      accept=".zip"
                      :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) => uploadSuccess(res, file, i, form.alternativeList)
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.alternativeList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.alternativeList, val)
                    "
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col
                >
                <el-col :span="9">
                  <el-form-item label="图层风格">
                    <el-select
                      v-model="val.style"
                      placeholder="请选择图层风格"
                      style="width: 150px"
                    >
                      <el-option
                        v-for="dict in dict.type.coverage_style"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-else :key="val.id">
                <el-col :span="15">
                  <el-form-item :label="val.typeName">
                    <el-upload
                      :action="uploadUrl+ '?type=' + val.id"
                      :multiple="false"
                      :file-list="val.filelist"
                      accept=".zip"
                      :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) => uploadSuccess(res, file, i, form.alternativeList)
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.alternativeList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.alternativeList, val)
                    "
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col
                >
                <el-col :span="9">
                  <el-form-item label="图层风格">
                    <el-select
                      v-model="val.style"
                      placeholder="请选择图层风格"
                      style="width: 150px"
                    >
                      <el-option
                        v-for="dict in dict.type.coverage_style"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>淹没数据：</span>
            </div>
            <template v-for="(val, i) in form.floodList">
              <el-row v-if="val.isRequired == '1'" :key="val.id">
                <el-col :span="15">
                  <el-form-item
                    :label="val.typeName"
                    :prop="'floodList.' + i + '.filelist'"
                    :rules="rules.filelist"
                  >
                    <el-upload
                      :action="uploadUrl+ '?type=' + val.id"
                      :multiple="false"
                      :file-list="val.filelist"
                      accept=".zip"
                      :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) => uploadSuccess(res, file, i, form.floodList)
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.floodList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.floodList, val)
                    "
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="降雨时刻" prop="rain" v-if="val.fileAddress && val.fileAddress != null && val.fileAddress != '' ">
                  <el-select
                    v-model="val.rain"
                    placeholder="请选择降雨时刻"
                    style="width: 150px"
                  >
                    <el-option
                      v-for="dict in rainList"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="降雨时刻" v-else>
                  <el-select
                    v-model="val.rain"
                    placeholder="请选择降雨时刻"
                    style="width: 150px"
                  >
                    <el-option
                      v-for="dict in rainList"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="图层风格">
                  <el-select
                    v-model="val.style"
                    placeholder="请选择图层风格"
                    style="width: 150px"
                  >
                    <el-option
                      v-for="dict in dict.type.coverage_style"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-else :key="val.id">
              <el-col :span="12">
                <el-form-item :label="val.typeName">
                  <el-upload
                    :action="uploadUrl+ '?type=' + val.id"
                    :multiple="false"
                    :file-list="val.filelist"
                    accept=".zip"
                    :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) => uploadSuccess(res, file, i, form.floodList)
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.floodList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.floodList, val)
                    "
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="降雨时刻" prop="rain" v-if="val.fileAddress && val.fileAddress != null && val.fileAddress != '' ">
                  <el-select
                    v-model="val.rain"
                    placeholder="请选择降雨时刻"
                    style="width: 150px"
                  >
                    <el-option
                      v-for="dict in rainList"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="降雨时刻" v-else>
                  <el-select
                    v-model="val.rain"
                    placeholder="请选择降雨时刻"
                    style="width: 150px"
                  >
                    <el-option
                      v-for="dict in rainList"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="图层风格">
                  <el-select
                    v-model="val.style"
                    placeholder="请选择图层风格"
                    style="width: 150px"
                  >
                    <el-option
                      v-for="dict in dict.type.coverage_style"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>疫情扩散数据：</span>
          </div>
          <template v-for="(val, i) in form.yanList">
            <el-row v-if="val.isRequired == '1'" :key="val.id">
              <el-col :span="15">
                <el-form-item
                  :label="val.typeName"
                  :prop="'yanList.' + i + '.filelist'"
                  :rules="rules.filelist"
                >
                  <el-upload
                    :action="uploadUrl+ '?type=' + val.id"
                    :multiple="false"
                    :file-list="val.filelist"
                    accept=".zip"
                    :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) => uploadSuccess(res, file, i, form.yanList)
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.yanList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.yanList, val)
                    "
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col
                >
                <el-col :span="9">
                  <el-form-item label="图层风格">
                    <el-select
                      v-model="val.style"
                      placeholder="请选择图层风格"
                      style="width: 150px"
                    >
                      <el-option
                        v-for="dict in dict.type.coverage_style"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-else :key="val.id">
                <el-col :span="15">
                  <el-form-item :label="val.typeName">
                    <el-upload
                      :action="uploadUrl+ '?type=' + val.id"
                      :multiple="false"
                      :file-list="val.filelist"
                      accept=".zip"
                      :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) => uploadSuccess(res, file, i, form.yanList)
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.yanList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.yanList, val)
                    "
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col
                >
                <el-col :span="9">
                  <el-form-item label="图层风格">
                    <el-select
                      v-model="val.style"
                      placeholder="请选择图层风格"
                      style="width: 150px"
                    >
                      <el-option
                        v-for="dict in dict.type.coverage_style"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>其他数据：</span>
              <el-button
                style="float: right"
                size="small"
                type="primary"
                @click="add"
              >添加
              </el-button
              >
            </div>
            <template v-for="(val, i) in form.otherList">
              <el-row v-if="val.isRequired == '1'" :key="val.id">
                <el-col :span="15">
                  <el-form-item
                    :label="val.typeName"
                    :prop="'otherList.' + i + '.filelist'"
                    :rules="rules.filelist"
                  >
                    <el-upload
                      :action="uploadUrl+ '?type=' + val.id"
                      :multiple="false"
                      :file-list="val.filelist"
                      accept=".zip"
                      :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) => uploadSuccess(res, file, i, form.otherList)
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.otherList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.otherList, val)
                    "
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col
                >
                <el-col :span="9">
                  <el-form-item label="图层风格">
                    <el-select
                      v-model="val.style"
                      placeholder="请选择图层风格"
                      style="width: 150px"
                    >
                      <el-option
                        v-for="dict in dict.type.coverage_style"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-else :key="val.id">
                <el-col :span="15">
                  <el-form-item :label="val.typeName">
                    <el-upload
                      :action="uploadUrl+ '?type=' + val.id"
                      :multiple="false"
                      :file-list="val.filelist"
                      accept=".zip"
                      :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) => uploadSuccess(res, file, i, form.otherList)
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.otherList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.otherList, val)
                    "
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col
                >
                <el-col :span="9">
                  <el-form-item label="图层风格">
                    <el-select
                      v-model="val.style"
                      placeholder="请选择图层风格"
                      style="width: 150px"
                    >
                      <el-option
                        v-for="dict in dict.type.coverage_style"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <template v-for="(val, i) in form.addList">
              <el-row :gutter="20" :key="val.id">
                <el-col :span="6">
                  <el-form-item
                    :prop="'addList.' + i + '.typeName'"
                    :rules="rules.typeName"
                  >
                    <el-input
                      v-model="val.typeName"
                      placeholder="请输入图层名称"
                      clearable
                      style="width: 150px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item
                    :prop="'addList.' + i + '.filelist'"
                    :rules="rules.filelist"
                  >
                    <el-upload
                      :action="uploadUrl+ '?type=' + val.id"
                      :multiple="false"
                      :file-list="val.filelist"
                      accept=".zip"
                      :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                      :on-success="
                      (res, file) =>
                        uploadSuccess(res, file, i, form.addList, 'add')
                    "
                      :on-remove="
                      (file, filelist) =>
                        onRemove(file, filelist, i, form.addList)
                    "
                      :before-upload="
                      (file) => beforeUpload(file, i, form.addList, val, 'add')
                    "
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-select
                    v-model="val.style"
                    placeholder="请选择图层风格"
                    style="width: 150px"
                  >
                    <el-option
                      v-for="dict in dict.type.coverage_style"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="handleRemove(val, i, form.addList)"
                  >删除
                  </el-button
                  >
                </el-col>
              </el-row>
            </template>
          </el-card>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="openUpload" width="700" append-to-body @before-close="cancelUpload">
      <div style="height: 70vh; overflow-x: scroll; overflow-y: scroll">
        <el-form
        ref="otherForm"
        class="form"
        :model="otherForm"
        :rules="otherRules"
        :inline="true"
        label-width="150px"
      >
        <el-row>
          <el-form-item label="城市" prop="cityId">
            <el-select
              v-model="otherForm.cityId"
              placeholder="请选择城市"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="dict in cityList"
                :key="dict.id"
                :label="dict.cityName"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row>

          <!--          <el-form-item label="文件分类" prop="type">-->
          <!--            <el-select-->
          <!--              v-model="otherForm.type"-->
          <!--              placeholder="请选择分类"-->
          <!--              label-width="150px"-->
          <!--              filterable-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="(item,index) in titleList"-->
          <!--                :key="index"-->
          <!--                :label="item.label"-->
          <!--                :value="item.label"-->
          <!--              ></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
        </el-row>
        <!--        <el-row>-->
        <!--          <el-form-item label="文件上传" prop="file" v-if="openUpload">-->
        <!--            <el-upload-->
        <!--              :action="uploadOtherUrl"-->
        <!--              :multiple="false"-->
        <!--              accept=".zip"-->
        <!--              :headers="{Authorization: 'Bearer ' + token,}"-->
        <!--              :on-success="(res) => uploadOtherSuccess(res)"-->
        <!--              :on-remove="onOtherRemove()"-->
        <!--              :before-upload="beforeOtherUpload()"-->
        <!--            >-->
        <!--              <el-button size="small" type="primary">点击上传</el-button>-->
        <!--            </el-upload>-->
        <!--          </el-form-item>-->
        <!--        </el-row>-->
        <div style="background-color: #fff8e6; color: #ffba00;padding:8px 0;border-radius:5px">
          <div style="text-align: center;font-size: 13px">上传文件为zip文件，请直接压缩相关文件到压缩包，不要将文件夹进行压缩！</div>
        </div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>洪涝模拟：</span>
          </div>

          <template v-for="(val, i) in otherForm.otherFloodList">
            <el-row v-if="val.isRequired == '1'" :key="val.type + val.typeName">
              <el-col :span="15">
                <el-form-item
                  :label="val.typeName"
                  :prop="'otherFloodList.' + i + '.filelist'"
                  :rules="rules.filelist"
                >
                  <el-upload
                    :action="uploadOtherUrl"
                    :multiple="false"
                    :file-list="val.filelist"
                    accept=".zip"
                    :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                    :on-success="
                      (res, file) => otherUploadSuccess(res, file, i,  otherForm.otherFloodList)
                    "
                    :on-remove="
                      (file, filelist) =>
                        otherOnRemove(file, filelist, i,  otherForm.otherFloodList)
                    "
                    :before-upload="
                      (file) => otherBeforeUpload(file, i,  otherForm.otherFloodList, val)
                    "
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col
              >

            </el-row>
            <el-row v-else :key="val.type + val.typeName">
              <el-col :span="15">
                <el-form-item :label="val.typeName">
                  <el-upload
                    :action="uploadOtherUrl"
                    :multiple="false"
                    :file-list="val.filelist"
                    accept=".zip"
                    :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                    :on-success="
                      (res, file) => otherUploadSuccess(res, file, i,  otherForm.otherFloodList)
                    "
                    :on-remove="
                      (file, filelist) =>
                        otherOnRemove(file, filelist, i,  otherForm.otherFloodList)
                    "
                    :before-upload="
                      (file) => otherBeforeUpload(file, i,  otherForm.otherFloodList, val)
                    "
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col
              >
            </el-row>
          </template>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>传染病模拟：</span>
          </div>

          <template v-for="(val, i) in otherForm.infectionList">
            <el-row v-if="val.isRequired == '1'" :key="val.type + val.typeName">
              <el-col :span="15">
                <el-form-item
                  :label="val.typeName"
                  :prop="'infectionList.' + i + '.filelist'"
                  :rules="rules.filelist"
                >
                  <el-upload
                    :action="uploadOtherUrl"
                    :multiple="false"
                    :file-list="val.filelist"
                    accept=".zip"
                    :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                    :on-success="
                      (res, file) => otherUploadSuccess(res, file, i, otherForm.infectionList)
                    "
                    :on-remove="
                      (file, filelist) =>
                        otherOnRemove(file, filelist, i, otherForm.infectionList)
                    "
                    :before-upload="
                      (file) => otherBeforeUpload(file, i, otherForm.infectionList, val)
                    "
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col
              >

            </el-row>
            <el-row v-else :key="val.type + val.typeName">
              <el-col :span="15">
                <el-form-item :label="val.typeName">
                  <el-upload
                    :action="uploadOtherUrl"
                    :multiple="false"
                    :file-list="val.filelist"
                    accept=".zip"
                    :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                    :on-success="
                      (res, file) => otherUploadSuccess(res, file, i, otherForm.infectionList)
                    "
                    :on-remove="
                      (file, filelist) =>
                        otherOnRemove(file, filelist, i, otherForm.infectionList)
                    "
                    :before-upload="
                      (file) => otherBeforeUpload(file, i, otherForm.infectionList, val)
                    "
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col
              >
            </el-row>
          </template>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>城市服务测度：</span>
          </div>

          <template v-for="(val, i) in otherForm.cityServerList">
            <el-row v-if="val.isRequired == '1'" :key="val.type + val.typeName">
              <el-col :span="15">
                <el-form-item
                  :label="val.typeName"
                  :prop="'cityServerList.' + i + '.filelist'"
                  :rules="rules.filelist"
                >
                  <el-upload
                    :action="uploadOtherUrl"
                    :multiple="false"
                    :file-list="val.filelist"
                    accept=".zip"
                    :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                    :on-success="
                      (res, file) => otherUploadSuccess(res, file, i, otherForm.cityServerList)
                    "
                    :on-remove="
                      (file, filelist) =>
                        otherOnRemove(file, filelist, i, otherForm.cityServerList)
                    "
                    :before-upload="
                      (file) => otherBeforeUpload(file, i, otherForm.cityServerList, val)
                    "
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col
              >

            </el-row>
            <el-row v-else :key="val.type + val.typeName">
              <el-col :span="15">
                <el-form-item :label="val.typeName">
                  <el-upload
                    :action="uploadOtherUrl"
                    :multiple="false"
                    :file-list="val.filelist"
                    accept=".zip"
                    :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                    :on-success="
                      (res, file) => otherUploadSuccess(res, file, i, otherForm.cityServerList)
                    "
                    :on-remove="
                      (file, filelist) =>
                        otherOonRemove(file, filelist, i, otherForm.cityServerList)
                    "
                    :before-upload="
                      (file) => otherBeforeUpload(file, i, otherForm.cityServerList, val)
                    "
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col
              >
            </el-row>
          </template>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>城市保障服务测度：</span>
          </div>

          <template v-for="(val, i) in otherForm.safeguardList">
            <el-row v-if="val.isRequired == '1'" :key="val.type + val.typeName">
              <el-col :span="15">
                <el-form-item
                  :label="val.typeName"
                  :prop="'safeguardList.' + i + '.filelist'"
                  :rules="rules.filelist"
                >
                  <el-upload
                    :action="uploadOtherUrl"
                    :multiple="false"
                    :file-list="val.filelist"
                    accept=".zip"
                    :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                    :on-success="
                      (res, file) => otherUploadSuccess(res, file, i, otherForm.safeguardList)
                    "
                    :on-remove="
                      (file, filelist) =>
                        otherOnRemove(file, filelist, i, otherForm.safeguardList)
                    "
                    :before-upload="
                      (file) => otherBeforeUpload(file, i, otherForm.safeguardList, val)
                    "
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col
              >

            </el-row>
            <el-row v-else :key="val.type + val.typeName">
              <el-col :span="15">
                <el-form-item :label="val.typeName">
                  <el-upload
                    :action="uploadOtherUrl"
                    :multiple="false"
                    :file-list="val.filelist"
                    accept=".zip"
                    :headers="{
                      Authorization: 'Bearer ' + token,
                    }"
                    :on-success="
                      (res, file) => otherUploadSuccess(res, file, i, otherForm.safeguardList)
                    "
                    :on-remove="
                      (file, filelist) =>
                        otherOnRemove(file, filelist, i, otherForm.safeguardList)
                    "
                    :before-upload="
                      (file) => otherBeforeUpload(file, i, otherForm.safeguardList, val)
                    "
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col
              >
            </el-row>
          </template>
        </el-card>
      </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUploadForm">确 定</el-button>
        <el-button @click="cancelUpload">取 消</el-button>
      </div>
    </el-dialog>
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
  typeListUp,
  publisher,
  downloadFileById
} from '@/api/gis/upload'
import { getToken } from '@/utils/auth'
import { addOtherFile } from '../../api/gis/upload'

export default {
  name: 'Role',
  dicts: ['sys_normal_disable', 'data_type', 'coverage_style'],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var toFileList = (rule, value, callback) => {
      callback()
    }
    return {
      openUpload: false,
      uploadUrl: process.env.VUE_APP_BASE_API + '/coverage/upload', // 上传的图片服务器地址
      uploadOtherUrl: process.env.VUE_APP_BASE_API + '/coverage/uploadForOther', // 上传的图片服务器地址
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
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        coverageName: undefined,
        typeName: undefined,
        cityId: undefined
      },
      // 表单参数
      form: {
        cityId: '',
        cityName: '',
        list: [],
        alternativeList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '临时避难安置场所空间分布备选点',
            id: 'shelter',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '急救站空间分布备选点',
            id: 'FirstAidPoint',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '应急物资储备库空间分布备选点',
            id: 'supply',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '方舱医院空间分布备选点',
            id: 'mhospital',
            isRequired: '0'
          },
          // {
          //   filelist: [],
          //   fileName: '',
          //   fileAddress: '',
          //   style: '',
          //   typeName: '消防站选址备选点',
          //   id: 'break',
          //   isRequired: '0'
          // },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '医院空间分布备选点',
            id: 'hospital',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '学校空间分布备选点',
            id: 'school',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '就业中心空间分布备选点',
            id: 'work',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '商场空间分布备选点',
            id: 'shopping',
            isRequired: '0'
          }
        ],
        typeList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '建筑数据',
            id: 'building',
            isRequired: '1'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '路网数据',
            id: 'road',
            isRequired: '1'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '人口分布数据',
            id: 'population',
            isRequired: '1'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '水文数据',
            id: 'water',
            isRequired: '1'

          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '城市边界',
            id: 'city',
            isRequired: '1'
          }
        ],
        floodList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '大雨淹没数据',
            id: '1',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '暴雨淹没数据',
            id: '2',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '大暴雨淹没数据',
            id: '3',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '特大暴雨淹没数据',
            value: '4',
            isRequired: '0'
          }
        ],
        otherList: [],
        yanList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '0h扩散图层',
            id: '0',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '12h扩散图层',
            id: '12',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '24h扩散图层',
            id: '24',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '32h扩散图层',
            id: '32',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '48h扩散图层',
            id: '48',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '60h扩散图层',
            id: '60',
            isRequired: '0'
          },
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '72h扩散图层',
            id: '72',
            isRequired: '0'
          }
        ],
        addList: []
      },

      defaultProps: {
        children: 'children',
        label: 'label'
      },

      cityList: [],
      otherForm: {
        cityId: '',
        type: '',
        list: [],
        typeName: '',
        file: '',
        fileName: '',
        otherFloodList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '高程数据',
            type: 'dem',
            isRequired: '1'

          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '年降水量',
            type: 'rain',
            isRequired: '0'

          }
        ],
        infectionList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '城市边界',
            type: 'infection',
            isRequired: '1'

          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '城市乡镇街道级地图',
            type: 'infection',
            isRequired: '1'

          }
        ],
        cityServerList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '居⺠区点',
            type: 'now',
            isRequired: '1'

          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '居民区',
            type: 'now',
            isRequired: '1'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '医疗设施点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '教育设施点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '商业服务业设施点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '避难空间点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '救灾物资点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '应急医疗点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '消防站点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '就业中⼼点',
            type: 'now',
            isRequired: '0'
          }
        ],
        safeguardList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '通讯基站',
            type: 'station',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '通讯基站服务范围',
            type: 'station',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '垃圾处理⼚',
            type: 'garbage',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '变电站',
            type: 'electricity',
            isRequired: '0'
          }
        ]
      },
      otherRules: {
        cityId: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
        // type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        // file: [{ required: true, message: '请上传文件', trigger: 'blur' }],
        filelist: [{ required: true, validator: toFileList, trigger: 'blur' }]
      },
      // 表单校验
      rules: {
        cityId: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
        style: [{ required: true, message: '颜色不能为空', trigger: 'blur' }],
        filelist: [{ required: true, validator: toFileList, trigger: 'blur' }],
        typeName: [
          { required: true, message: '名称不能为空', trigger: 'change' }
        ],
        rain: [{ required: false, message: '降雨时刻不能为空', trigger: 'blur' }]
      },
      token: '',
      rainList: [
        {
          label: '4时',
          value: '4'
        },
        {
          label: '8时',
          value: '8'
        },
        {
          label: '12时',
          value: '12'
        },
        {
          label: '16时',
          value: '16'
        },
        {
          label: '20时',
          value: '20'
        },
        {
          label: '24时',
          value: '24'
        }
      ],
      titleList: [
        // {
        //   label: '暴雨数据',
        //   value: 'rain'
        // },
        {
          label: '高程数据',
          value: 'dem'
        },
        // {
        //   label: '水文数据',
        //   value: 'water'
        // },
        {
          label: '等级医院',
          value: 'hospital'
        },
        {
          label: '社区卫生服务中心',
          value: 'hospital'
        },
        {
          label: '应急医疗服务设施',
          value: 'hospital'
        },
        {
          label: '幼儿园',
          value: 'school'
        },
        {
          label: '小学',
          value: 'school'
        },
        {
          label: '初中',
          value: 'school'
        },
        {
          label: '高中',
          value: 'school'
        },
        // 中间
        {
          label: '消防站',
          value: 'Break'
        },
        {
          label: '应急避难场所',
          value: 'Shelter'
        },
        {
          label: '应急物资储备仓库',
          value: 'Supply'
        },
        {
          label: '通讯基站',
          value: 'basestation'
        },
        {
          label: '变电站',
          value: 'electricity'
        },
        {
          label: '污水处理厂',
          value: 'sewage'
        },
        {
          label: '垃圾处理厂',
          value: 'garbage'
        },
        {
          label: '中心水厂',
          value: 'watersupply'
        },
        // input
        {
          label: '菜场及生鲜超市',
          value: 'market'
        }, {
          label: '商业零售',
          value: 'retail'
        }, {
          label: '社区服务中心',
          value: 'CScenter'
        }, {
          label: '派出所',
          value: 'police'
        }, {
          label: '就业中心',
          value: 'work'
        },
        {
          label: '城市地图数据',
          value: 'infection'
        },
        {
          label: '城市乡镇街道级地图数据',
          value: 'infection'
        }
      ]
    }
  },
  created() {
    this.token = getToken()
    this.handelTypeLists()
    this.getList()
    this.cityLists()
  },
  methods: {
    /* 5.图片上传成功后回调 */
    uploadOtherSuccess(res) {
      if (res.code === 200) {

        this.otherForm.file = res.newFileName
        this.otherForm.fileName = res.originalFileName
        // name: res.originalFileName,

      } else {
        this.$message.error(res.msg)
        return false
      }
    },

    /* 6.图片上传前校验 */
    beforeOtherUpload(file, i, bal, val, v) {
      // if (v == "add" && !val.typeName) {
      //   this.$message.error("请先输入图层名称");
      //   return false;
      // }
      // if (bal[i].fileName) {
      //   this.$message.error("只能上传一个数据");
      //   return false;
      // }
    },

    /* 8.删除图片时的回调函数 */
    onOtherRemove() {
      this.otherForm.file = ''
      this.otherForm.fileName = ''
    },
    submitUploadForm() {

      this.$refs['otherForm'].validate((valid) => {
        if (valid) {
          addOtherFile(this.otherForm).then(res => {
            this.$modal.msgSuccess('保存成功')
            this.cancelUpload()
            this.getList()
          })

          // const loading = this.$loading({
          //   lock: true,
          //   customClass: "create-isLoading", // *这里设置他的class名称,这里最重要
          //   text: "数据加载中...请稍后",
          //   spinner: "el-icon-loading",
          //   background: "rgba(0, 0, 0, 0.2)",
          // });
          // if (this.form.id != undefined) {
          //   updateRole(this.form).then((response) => {
          //     this.$modal.msgSuccess("修改成功");
          //     this.open = false;
          //     this.getList();
          //   });
          // } else {
          //   addRole({
          //     cityId: this.form.cityId,
          //     cityName: cityobj[0].cityName,
          //     list: this.form.list,
          //   }).then((response) => {
          //     loading.close();
          //     this.$modal.msgSuccess("新增成功");
          //     this.open = false;
          //     this.reset();
          //     this.getList();
          //   });
          // }
        }
      })
    },
    cancelUpload() {
      this.openUpload = false
      this.otherForm = {
        cityId: '',
        type: '',
        list: [],
        typeName: '',
        file: '',
        fileName: '',
        otherFloodList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '高程数据',
            type: 'dem',
            isRequired: '1'

          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '年降水量',
            type: 'rain',
            isRequired: '0'

          }
        ],
        infectionList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '城市边界',
            type: 'infection',
            isRequired: '1'

          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '城市乡镇街道级地图',
            type: 'infection',
            isRequired: '1'

          }
        ],
        cityServerList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '居⺠区点',
            type: 'now',
            isRequired: '1'

          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '居民区',
            type: 'now',
            isRequired: '1'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '医疗设施点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '教育设施点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '商业服务业设施点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '避难空间点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '救灾物资点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '应急医疗点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '消防站点',
            type: 'now',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '就业中⼼点',
            type: 'now',
            isRequired: '0'
          }
        ],
        safeguardList: [
          {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '通讯基站',
            type: 'station',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '通讯基站服务范围',
            type: 'station',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '垃圾处理⼚',
            type: 'garbage',
            isRequired: '0'
          }, {
            filelist: [],
            fileName: '',
            fileAddress: '',
            style: '',
            typeName: '变电站',
            type: 'electricity',
            isRequired: '0'
          }
        ]
      },
        this.$refs['otherForm'].resetFields()
    },
    uploadOtherData() {
      this.openUpload = true
    },
    downloadFile(item) {
      downloadFileById({ id: item.id }).then(res => {
        // this.pdfLoading = false
        const link = document.createElement('a')
        const blob = new Blob([res], { type: 'application/octet-stream' })
        // 获取heads中的filename文件名
        // console.log(res)
        // const temp = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
        // const fileName = decodeURIComponent(item.fileName)
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', item.fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    parseStyle(bal) {
      if (!bal) {
        return ''
      }
      let index = this.dict.type.coverage_style.findIndex(
        (val) => bal == val.value
      )
      return this.dict.type.coverage_style[index].label
    },
    async handlePul(val) {
      this.loading = true
      const data = await publisher({ id: val.id })
      this.loading = false
      if (data.code == 200) {
        this.getList()
        this.$message.success('发布成功')
      }
    },
    handleYulan(val) {
      this.$router.push({
        path: 'coverage',
        query: { id: val.id, cityId: val.cityId }
      })
    },
    handleRemove(val, i, addList) {
      addList.splice(i, 1)
      let index = this.form.list.findIndex((bal) => bal.nameb == 'add' + i)
      if (index !== -1) this.form.list.splice(index, 1)
    },
    add() {
      this.form.addList.push({
        filelist: [],
        typeName: '',
        fileName: '',
        fileAddress: '',
        style: '',
        rain: ''
      })
    },
    async cityLists() {
      const data = await cityList()
      this.cityList = data
    },
    async handelTypeLists() {
      // const data = await typeListUp()
      // data.forEach((val) => {
      //   val.filelist = []
      //   val.fileName = ''
      //   val.fileAddress = ''
      //   val.style = ''
      //   if (val.type == '0') {
      //     this.form.typeList.push(val)
      //   } else if (val.type == '1') {
      //     this.form.floodList.push(val)
      //   } else if (val.type == '2') {
      //     this.form.otherList.push(val)
      //   } else if (val.type == '3') {
      //     this.form.yanList.push(val)
      //   }
      // })
    },

    /* 5.图片上传成功后回调 */
    uploadSuccess(res, file, i, bal, name) {
      if (res.code === 200) {
        let obj = {
          url: res.newFileName,
          name: res.originalFileName
        }
        bal[i].fileAddress = res.newFileName
        bal[i].fileName = res.originalFileName;
        (bal[i].nameb = name == 'add' ? name + i : ''),
          bal[i].filelist.push(obj)
        this.form.list.push({
          typeId: bal[i].id,
          typeName: bal[i].typeName,
          fileAddress: res.newFileName,
          fileName: bal[i].fileName,
          style: bal[i].style,
          nameb: name == 'add' ? name + i : ''
        })
      } else {
        this.$message.error(res.msg)
        return false
      }
    },

    /* 6.图片上传前校验 */
    beforeUpload(file, i, bal, val, v) {
      if (v == 'add' && !val.typeName) {
        this.$message.error('请先输入图层名称')
        return false
      }
      if (bal[i].fileName) {
        this.$message.error('只能上传一个数据')
        return false
      }
    },

    /* 8.删除图片时的回调函数 */
    onRemove(file, filelists, i, bal) {
      let index = this.form.list.findIndex((val) => (val.typeId = bal[i].id))
      this.form.list.splice(index, 1)
      bal[i].filelist = []
      bal[i].fileAddress = ''
      bal[i].fileName = ''
    },

    /* 5.图片上传成功后回调 */
    otherUploadSuccess(res, file, i, bal, name) {
      if (res.code === 200) {
        let obj = {
          url: res.newFileName,
          name: res.originalFileName
        }
        bal[i].fileAddress = res.newFileName
        bal[i].fileName = res.originalFileName;
        (bal[i].nameb = name == 'add' ? name + i : ''),
          bal[i].filelist.push(obj)
        this.otherForm.list.push({
          type: bal[i].type,
          // typeId: bal[i].id,
          typeName: bal[i].typeName,
          fileAddress: res.newFileName,
          fileName: bal[i].fileName,
          nameb: name == 'add' ? name + i : ''
        })
      } else {
        this.$message.error(res.msg)
        return false
      }
    },

    /* 6.图片上传前校验 */
    otherBeforeUpload(file, i, bal, val, v) {
      if (v == 'add' && !val.typeName) {
        this.$message.error('请先输入图层名称')
        return false
      }
      if (bal[i].fileName) {
        this.$message.error('只能上传一个数据')
        return false
      }
    },

    /* 8.删除图片时的回调函数 */
    otherOnRemove(file, filelists, i, bal) {
      let index = this.otherForm.list.findIndex((val) => (val.typeId = bal[i].id))
      this.form.list.splice(index, 1)
      bal[i].filelist = []
      bal[i].fileAddress = ''
      bal[i].fileName = ''
    },
    handlType(val) {
      let list = this.dict.type.data_type.filter((bal) => bal.value == val)
      return list[0].label
    },
    /** 提交按钮 */
    submitForm: function() {
      this.form.list.forEach((val) => {
        this.form.typeList.forEach((bal) => {
          if (val.typeId == bal.id) {
            val.style = bal.style
          }
        })
        this.form.floodList.forEach((bal) => {
          if (val.typeId == bal.id) {
            val.style = bal.style
            val.rain = bal.rain
          }
        })
        this.form.yanList.forEach((bal) => {
          if (val.typeId == bal.id) {
            val.style = bal.style
          }
        })
        this.form.otherList.forEach((bal) => {
          if (val.typeId == bal.id) {
            val.style = bal.style
          }
        })
        this.form.addList.forEach((bal) => {
          // console.log(val.nameb, bal.nameb)
          if (val.nameb == bal.nameb) {
            val.style = bal.style
          }
        })
      })
      let cityobj = this.cityList.filter((val) => val.id == this.form.cityId)

      // console.log("this.form", this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            customClass: 'create-isLoading', // *这里设置他的class名称,这里最重要
            text: '数据加载中...请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.2)'
          })
          if (this.form.id != undefined) {
            updateRole(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addRole({
              cityId: this.form.cityId,
              cityName: cityobj[0].cityName,
              list: this.form.list
            }).then((response) => {
              loading.close()
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.reset()
              this.getList()
            })
          }
        }
      })
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
      this.form = {
        cityId: '',
        cityName: '',
        list: [],
        // typeList: [],
        // floodList: [],
        // yanList: [],
        otherList: [],
        addList: []
      }
      this.handelTypeLists()
      this.cityLists()
      this.$refs['form'].resetFields()
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
      this.title = '文件管理'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      getRole({ id: row.id }).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改角色'
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
    }
  }
}
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

    > > > .el-form-item {
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
