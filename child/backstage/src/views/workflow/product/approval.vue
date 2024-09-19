<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="产品名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入产品名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="提供单位" prop="institution">
          <el-input
            v-model="queryParams.institution"
            placeholder="请输入提供单位"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
              <el-form-item  label="审批状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择审批状态"  clearable>
            <el-option
              v-for="dict in statusList"
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
      <el-button style="margin: 8px 10px" type="success" size="small" @click="getApprHis">审批历史</el-button>
      <el-button v-if="hasSel.length != 0" style="margin: 8px 0px" type="primary" size="small" @click="onceAppr">一键审批</el-button>
    <el-tabs v-model="activeName" type="card" @tab-click="changeType">
      <el-tab-pane label="地下流体" name="underFluid">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="directoryName" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="providerUnit" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="productTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ new Date(scope.row.productTime).toLocaleDateString() }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.auditState == 99? 'success' : scope.row.auditState < 0 ?'danger': 
                (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.auditState | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.auditState != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,1)"
            >详情</el-button>
            <el-button v-if="scope.row.auditState >= 1 && scope.row.auditState < 99" 
              @click="check(scope.row,0)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="GNSS产品" name="gnss">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="description" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="institution" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="pTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ new Date(scope.row.pTime).toLocaleDateString() }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.auditState == 99? 'success' : scope.row.auditState < 0 ?'danger': 
                (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.auditState | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.auditState != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,2)"
            >详情</el-button>
            <el-button v-if="scope.row.auditState >= 1 && scope.row.auditState < 99" 
              @click="check(scope.row,1)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="InSAR产品" name="InSAR">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="description" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="institution" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="pTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ new Date(scope.row.pTime).toLocaleDateString() }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.auditState == 99? 'success' : scope.row.auditState < 0 ?'danger': 
                (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.auditState | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.auditState != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,2)"
            >详情</el-button>
            <el-button v-if="scope.row.auditState >= 1 && scope.row.auditState < 99" 
              @click="check(scope.row,1)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="地震区划图" name="distri">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="description" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="institution" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="pTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ new Date(scope.row.pTime).toLocaleDateString() }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.auditState == 99? 'success' : scope.row.auditState < 0 ?'danger': 
                (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.auditState | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.auditState != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,2)"
            >详情</el-button>
            <el-button v-if="scope.row.auditState >= 1 && scope.row.auditState < 99" 
              @click="check(scope.row,1)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="地震构造图" name="constru">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="description" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="institution" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="pTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ new Date(scope.row.pTime).toLocaleDateString() }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.auditState == 99? 'success' : scope.row.auditState < 0 ?'danger': 
                (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.auditState | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.auditState != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,2)"
            >详情</el-button>
            <el-button v-if="scope.row.auditState >= 1 && scope.row.auditState < 99" 
              @click="check(scope.row,1)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="地震活动断层" name="active">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="description" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="institution" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="pTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ new Date(scope.row.pTime).toLocaleDateString() }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.auditState == 99? 'success' : scope.row.auditState < 0 ?'danger': 
                (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.auditState | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.auditState != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,2)"
            >详情</el-button>
            <el-button v-if="scope.row.auditState >= 1 && scope.row.auditState < 99" 
              @click="check(scope.row,1)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="工程抗震" name="project">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="description" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="institution" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="pTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ new Date(scope.row.pTime).toLocaleDateString() }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.auditState == 99? 'success' : scope.row.auditState < 0 ?'danger': 
                (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.auditState | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.auditState != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,2)"
            >详情</el-button>
            <el-button v-if="scope.row.auditState >= 1 && scope.row.auditState < 99" 
              @click="check(scope.row,1)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="断层形变" name="level">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="directoryName" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="provideUnit" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="productTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ new Date(scope.row.productTime).toLocaleDateString() }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.auditState == 99? 'success' : scope.row.auditState < 0 ?'danger': 
                (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.auditState | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.auditState != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,3)"
            >详情</el-button>
            <el-button v-if="scope.row.auditState >= 1 && scope.row.auditState < 99" 
              @click="check(scope.row,2)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="重力" name="precursorCatalog2">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="nameProduct" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="provide" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="writeTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ scope.row.writeTime }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.approvalStatus == 99? 'success' : scope.row.approvalStatus < 0 ?'danger': 
                (scope.row.approvalStatus == 1||scope.row.approvalStatus == 10||scope.row.approvalStatus == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.approvalStatus | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.approvalStatus != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,4)"
            >详情</el-button>
            <el-button v-if="scope.row.approvalStatus >= 1 && scope.row.approvalStatus < 99" 
              @click="check(scope.row,3)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="地磁" name="precursorCatalog5">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="nameProduct" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="provide" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="writeTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ scope.row.writeTime }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.approvalStatus == 99? 'success' : scope.row.approvalStatus < 0 ?'danger': 
                (scope.row.approvalStatus == 1||scope.row.approvalStatus == 10||scope.row.approvalStatus == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.approvalStatus | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.approvalStatus != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,4)"
            >详情</el-button>
            <el-button v-if="scope.row.approvalStatus >= 1 && scope.row.approvalStatus < 99" 
              @click="check(scope.row,3)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="地电" name="precursorCatalog4">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="nameProduct" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="provide" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="writeTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ scope.row.writeTime }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.approvalStatus == 99? 'success' : scope.row.approvalStatus < 0 ?'danger': 
                (scope.row.approvalStatus == 1||scope.row.approvalStatus == 10||scope.row.approvalStatus == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.approvalStatus | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.approvalStatus != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,4)"
            >详情</el-button>
            <el-button v-if="scope.row.approvalStatus >= 1 && scope.row.approvalStatus < 99" 
              @click="check(scope.row,3)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="定点形变" name="precursorCatalog">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="nameProduct" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="provide" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="writeTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ scope.row.writeTime }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.approvalStatus == 99? 'success' : scope.row.approvalStatus < 0 ?'danger': 
                (scope.row.approvalStatus == 1||scope.row.approvalStatus == 10||scope.row.approvalStatus == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.approvalStatus | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.approvalStatus != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,4)"
            >详情</el-button>
            <el-button v-if="scope.row.approvalStatus >= 1 && scope.row.approvalStatus < 99" 
              @click="check(scope.row,3)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="水准" name="shuiz">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="description" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="institution" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="pTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ new Date(scope.row.pTime).toLocaleDateString() }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.auditState == 99? 'success' : scope.row.auditState < 0 ?'danger': 
                (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.auditState | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.auditState != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,2)"
            >详情</el-button>
            <el-button v-if="scope.row.auditState >= 1 && scope.row.auditState < 99" 
              @click="check(scope.row,1)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="地倾斜" name="precursorCatalog3">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
      >
      <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column prop="nameProduct" label="目录名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="provide" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="writeTime" label="产品编制时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div>
                    {{ scope.row.writeTime }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploader" label="上传人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.approvalStatus == 99? 'success' : scope.row.approvalStatus < 0 ?'danger': 
                (scope.row.approvalStatus == 1||scope.row.approvalStatus == 10||scope.row.approvalStatus == 20) ?'' : 'warning'"
                    style="font-weight:bold">
                    {{ scope.row.approvalStatus | auditStates }}
              </el-tag>
              </div>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click="handleUpload(scope.row)"
            >附件</el-button>
            <el-button
                v-if="scope.row.approvalStatus != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
            >审核记录</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row,4)"
            >详情</el-button>
            <el-button v-if="scope.row.approvalStatus >= 1 && scope.row.approvalStatus < 99" 
              @click="check(scope.row,3)" type="primary" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    </el-tabs>
      <el-dialog
        title="审批信息"
        :visible.sync="dialogVisible"
        width="40%">
        <div style="display:flex">
          <span>审批意见：</span>
          <el-input
            type="textarea"
            placeholder="请输入审批意见"
            v-model="opinion"
            rows="3"
            style="width:80%;"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="medium" @click="approval(1)">通 过</el-button>
          <el-button type="warning" size="medium" @click="approval(2)">驳 回</el-button>
          <el-button size="medium" @click="approval(4)">关 闭</el-button>
        </span>
      </el-dialog>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
              @pagination="pageLists" />
              <!-- 附件列表&上传 -->
        <el-dialog :title="title" :visible.sync="open3" width="1000px" append-to-body>
          <el-form ref="form" label-width="150px">
          <el-row>
            <el-col>
                <el-table
                  v-loading="loading2"
                  :data="fileList"
                  style="width: 100%">
                  <el-table-column
                    prop="fileName"
                    label="文件名"
                    width="230">
                  </el-table-column>
                  <el-table-column
                    prop="fileUrl"
                    label="路径">
                    <template slot-scope="scope">
                      <div style="color:#409EFF;cursor:pointer;" @click="downLoadFile(scope.row.fileUrl)">
                        {{ scope.row.fileUrl }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="uploader"
                    label="上传人">
                  </el-table-column>
                  <el-table-column
                    prop="uploadTime"
                    label="上传时间">
                    <template slot-scope="scope">
                      <div>
                        {{ new Date(scope.row.uploadTime).toLocaleString() }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
            </el-col>
          </el-row>
        </el-form>
        </el-dialog>
        <el-dialog title="审核记录" :visible.sync="open5" @close="open5 = false" width="1000px" append-to-body>
          <div>
            <el-table
              :data="hisRecord"
              v-loading="loading2"
              height="400"
              style="width: 100%;">
              <el-table-column
                prop="userName"
                label="审批人"
                width="190">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.userName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="auditState"
                label="状态"
                width="100">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.auditState| auditStates }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="时间"
                width="230">
                <template slot-scope="scope">
                  <div>
                    {{ new Date(scope.row.createTime).toLocaleString() }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="msg"
                label="意见">
              </el-table-column>
            </el-table>
          </div>
        </el-dialog>

      <!-- 地下流体详情 -->
      <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="目录名称" prop="directoryName">
                <el-input v-model="form.directoryName" :disabled="true" placeholder="请输入目录名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="关键词" prop="keyWord">
                <el-input v-model="form.keyWord" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入关键词" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="提供单位" prop="providerUnit">
                <el-input v-model="form.providerUnit" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入提供单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品编制时间" prop="productTime">
                <el-date-picker
                    v-model="form.productTime"
                    :disabled="title == '详情' || title == '文件上传'"
                    type="datetime"
                    placeholder="选择产品编制时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品名称" prop="productName">
                <el-input v-model="form.productName" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品内容" prop="productContent">
                <el-input type="textarea"
                :disabled="title == '详情' || title == '文件上传'"
                style="width: 450px;margin-left: 30px;"
                :rows="3"
                placeholder="请输入产品内容"
                v-model="form.productContent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="功能用途" prop="functionUse">
                <el-input type="textarea"
                :disabled="title == '详情' || title == '文件上传'"
                style="width: 450px;margin-left: 30px;"
                :rows="3"
                placeholder="请输入功能用途"
                v-model="form.functionUse"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="台网代码" prop="networkCode">
                <el-input v-model="form.networkCode" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入台网代码" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="台站代码" prop="stationCode">
                <el-input v-model="form.stationCode" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入台站代码" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="台站名称" prop="stationName">
                <el-input v-model="form.stationName" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入台站名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="测点代码" prop="testCode">
                <el-input v-model="form.testCode" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入测点代码" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="仪器名称型号" prop="instrumentName">
                <el-input v-model="form.instrumentName" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入仪器名称型号" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="测项代码" prop="measurementCode">
                <el-input v-model="form.measurementCode" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入测项代码" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分量代码" prop="numberCode">
                <el-input v-model="form.numberCode" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入分量代码" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="场地类型" prop="landType">
                <el-input v-model="form.landType" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入场地类型" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="起止时间" prop="beginEndTime">
                <el-input v-model="form.beginEndTime" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入起止时间" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="采样率" prop="samplingRate">
                <el-input v-model="form.samplingRate" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入采样率" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="原始数据来源" prop="dataSource">
                <el-input v-model="form.dataSource" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入原始数据来源" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品形式" prop="productForm">
                <el-input v-model="form.productForm" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品形式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品规格" prop="productStandard">
                <el-input v-model="form.productStandard" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品规格" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品生成方法" prop="idea">
                <el-input v-model="form.idea" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品生成方法" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品格式" prop="formate">
                <el-input v-model="form.formate" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品格式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据量" prop="dataSize">
                <el-input v-model="form.dataSize" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入数据量" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分发方式" prop="sendType">
                <el-input v-model="form.sendType" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入分发方式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="在线链接" prop="onlineLink">
                <el-input v-model="form.onlineLink" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入在线链接" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分发单位" prop="sendUnit">
                <el-input v-model="form.sendUnit" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入分发单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="维护和更新频率" prop="frequency">
                <el-input v-model="form.frequency" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入维护和更新频率" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系人" prop="linkMan">
                <el-input v-model="form.linkMan" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系电话" prop="tel">
                <el-input v-model="form.tel" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="电子邮件" prop="email">
                <el-input v-model="form.email" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入电子邮件" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系地址" prop="address">
                <el-input v-model="form.address" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品格式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="安全限制分级" prop="saftType">
                <el-input v-model="form.saftType" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品格式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="性能指标" prop="performance">
                <el-input v-model="form.performance" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入性能指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="质量指标" prop="qualityIndex">
                <el-input v-model="form.qualityIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入质量指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="技术指标" prop="jobIndex">
                <el-input v-model="form.jobIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入技术指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产权单位" prop="propertyUnit">
                <el-input v-model="form.propertyUnit" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产权单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产权人" prop="propertyMan">
                <el-input v-model="form.propertyMan" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产权人" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="引用格式" prop="citationFormat">
                <el-input v-model="form.citationFormat" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入引用格式" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="isEdit">
          <el-button type="primary" @click="submitForm">提 交</el-button>
          <el-button @click="reset">重 置</el-button>
        </div>
      </el-dialog>

      <!-- GNSS详情 -->
      <el-dialog :title="title" :visible.sync="openGnss" width="1000px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="目录名称" prop="description">
                <el-input v-model="form.description" :disabled="true" placeholder="请输入目录名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="关键词" prop="keyword">
                <el-input v-model="form.keyword" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入关键词" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="提供单位" prop="institution">
                <el-input v-model="form.institution" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入提供单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品编制时间" prop="pTime">
                <el-date-picker
                    v-model="form.pTime"
                    :disabled="title == '详情' || title == '文件上传'"
                    type="datetime"
                    placeholder="选择产品编制时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品名称" prop="name">
                <el-input v-model="form.name" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品内容" prop="productContent">
                <el-input type="textarea"
                :disabled="title == '详情' || title == '文件上传'"
                style="width: 450px;margin-left: 30px;"
                :rows="3"
                placeholder="请输入产品内容"
                v-model="form.productContent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="功能用途" prop="functionUse">
                <el-input type="textarea"
                :disabled="title == '详情' || title == '文件上传'"
                style="width: 450px;margin-left: 30px;"
                :rows="3"
                placeholder="请输入功能用途"
                v-model="form.functionUse"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="时间范围" prop="beginEndTime">
                <el-input v-model="form.beginEndTime" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入时间范围" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="空间范围" prop="spacialScale">
                <el-input v-model="form.spacialScale" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入空间范围" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="空间基准及精度" prop="spatialGranularity">
                <el-input v-model="form.spatialGranularity" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入空间基准及精度" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="原始数据来源" prop="originalDataSource">
                <el-input v-model="form.originalDataSource" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入原始数据来源" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品形式" prop="productForm">
                <el-input v-model="form.productForm" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品形式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品规格" prop="productStandard">
                <el-input v-model="form.productStandard" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品规格" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品生成方法" prop="productIdea">
                <el-input v-model="form.productIdea" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品生成方法" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="是否包含GIS数据" prop="containGis">
                <el-input v-model="form.containGis" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入是否包含GIS数据" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="附件（除GIS数据外）" prop="accessory">
                <el-input v-model="form.accessory" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入附件（除GIS数据外）" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="附件（GIS数据）" prop="gisAccessory">
                <el-input v-model="form.gisAccessory" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入附件（GIS数据）" />
              </el-form-item>
            </el-col>

            <el-col :span="20">
              <el-form-item label="产品形式" prop="productFormat">
                <el-input v-model="form.productFormat" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品形式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据量" prop="dataSize">
                <el-input v-model="form.dataSize" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入数据量" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分发方式" prop="distributionMode">
                <el-input v-model="form.distributionMode" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入分发方式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="在线链接" prop="onlineLink">
                <el-input v-model="form.onlineLink" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入在线链接" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分发单位" prop="sendUnit">
                <el-input v-model="form.sendUnit" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入分发单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="维护和更新频率" prop="frequency">
                <el-input v-model="form.frequency" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入维护和更新频率" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系人" prop="linkMen">
                <el-input v-model="form.linkMen" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系电话" prop="tel">
                <el-input v-model="form.tel" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="电子邮件" prop="email">
                <el-input v-model="form.email" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入电子邮件" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系地址" prop="address">
                <el-input v-model="form.address" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品格式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="安全限制分级" prop="securityLevel">
                <el-input v-model="form.securityLevel" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品格式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="性能指标" prop="performanceIndex">
                <el-input v-model="form.performanceIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入性能指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="质量指标" prop="qualityIndex">
                <el-input v-model="form.qualityIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入质量指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="技术指标" prop="technicalIndex">
                <el-input v-model="form.technicalIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入技术指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="责任单位" prop="accountabilityUnit">
                <el-input v-model="form.accountabilityUnit" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入责任单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="责任人" prop="dutyOfficer">
                <el-input v-model="form.dutyOfficer" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入责任人" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="引用格式" prop="citationFormat">
                <el-input v-model="form.citationFormat" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入引用格式" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>


      <!-- 跨断层水准 -->
      <el-dialog :title="title" :visible.sync="openLevel" width="1000px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="目录名称" prop="directoryName">
                <el-input v-model="form.directoryName" :disabled="true" placeholder="请输入目录名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="关键词" prop="keyWord">
                <el-input v-model="form.keyWord" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入关键词" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="提供单位" prop="provideUnit">
                <el-input v-model="form.provideUnit" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入提供单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品编制时间" prop="productTime">
                <el-date-picker
                    v-model="form.productTime"
                    :disabled="title == '详情' || title == '文件上传'"
                    type="datetime"
                    placeholder="选择产品编制时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品名称" prop="productName">
                <el-input v-model="form.productName" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品内容" prop="productContent">
                <el-input type="textarea"
                :disabled="title == '详情' || title == '文件上传'"
                style="width: 450px;margin-left: 30px;"
                :rows="3"
                placeholder="请输入产品内容"
                v-model="form.productContent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="功能用途" prop="functionUsr">
                <el-input type="textarea"
                :disabled="title == '详情' || title == '文件上传'"
                style="width: 450px;margin-left: 30px;"
                :rows="3"
                placeholder="请输入功能用途"
                v-model="form.functionUsr"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="时间范围" prop="timeRange">
                <el-input v-model="form.timeRange" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入时间范围" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="场地经度" prop="longitude">
                <el-input v-model="form.longitude" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入场地经度" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="场地纬度" prop="latitude">
                <el-input v-model="form.latitude" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入场地纬度" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="原始数据来源" prop="dataSource">
                <el-input v-model="form.dataSource" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入原始数据来源" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品形式" prop="productForm">
                <el-input v-model="form.productForm" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品形式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品规格" prop="productStandard">
                <el-input v-model="form.productStandard" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品规格" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品生成方法" prop="generationMethod">
                <el-input v-model="form.generationMethod" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品生成方法" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="是否包含GIS数据" prop="containGis">
                <el-input v-model="form.containGis" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入是否包含GIS数据" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="附件（除GIS数据外）" prop="addFile">
                <el-input v-model="form.addFile" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入附件（除GIS数据外）" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="附件（GIS数据）" prop="gisAddFile">
                <el-input v-model="form.gisAddFile" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入附件（GIS数据）" />
              </el-form-item>
            </el-col>

            <el-col :span="20">
              <el-form-item label="产品形式" prop="productFormat">
                <el-input v-model="form.productFormat" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品形式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据量" prop="dataSize">
                <el-input v-model="form.dataSize" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入数据量" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分发方式" prop="sendType">
                <el-input v-model="form.sendType" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入分发方式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="在线链接" prop="onlineLink">
                <el-input v-model="form.onlineLink" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入在线链接" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分发单位" prop="sendUnit">
                <el-input v-model="form.sendUnit" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入分发单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="维护和更新频率" prop="frequency">
                <el-input v-model="form.frequency" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入维护和更新频率" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系人" prop="linkMan">
                <el-input v-model="form.linkMan" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系电话" prop="tel">
                <el-input v-model="form.tel" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="电子邮件" prop="eamil">
                <el-input v-model="form.eamil" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入电子邮件" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系地址" prop="address">
                <el-input v-model="form.address" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品格式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="安全限制分级" prop="saftType">
                <el-input v-model="form.saftType" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品格式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="性能指标" prop="performanceIndex">
                <el-input v-model="form.performanceIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入性能指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="质量指标" prop="qualityIndex">
                <el-input v-model="form.qualityIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入质量指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="技术指标" prop="technicalIndex">
                <el-input v-model="form.technicalIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入技术指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="责任单位" prop="dutyUnit">
                <el-input v-model="form.dutyUnit" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入责任单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="责任人" prop="dutyPerson">
                <el-input v-model="form.dutyPerson" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入责任人" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="引用格式" prop="citationFormat">
                <el-input v-model="form.citationFormat" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入引用格式" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="isEdit">
          <el-button type="primary" @click="submitForm">提 交</el-button>
          <el-button @click="reset">重 置</el-button>
        </div>
      </el-dialog>


      <!-- 定点地磁-地电-形变详情 -->
      <el-dialog :title="title" :visible.sync="openPrecursorCatalog" width="1000px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="目录名称" prop="nameProduct">
                <el-input v-model="form.nameProduct" :disabled="true" placeholder="请输入目录名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="关键词" prop="keyWord">
                <el-input v-model="form.keyWord" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入关键词" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="提供单位" prop="provide">
                <el-input v-model="form.provide" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入提供单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品编制时间" prop="writeTime">
                <el-date-picker
                    v-model="form.writeTime"
                    :disabled="title == '详情' || title == '文件上传'"
                    type="datetime"
                    placeholder="选择产品编制时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品名称" prop="productName">
                <el-input v-model="form.productName" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品内容" prop="productContent">
                <el-input type="textarea"
                :disabled="title == '详情' || title == '文件上传'"
                style="width: 450px;margin-left: 30px;"
                :rows="3"
                placeholder="请输入产品内容"
                v-model="form.productContent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="功能用途" prop="ufunction">
                <el-input type="textarea"
                :disabled="title == '详情' || title == '文件上传'"
                style="width: 450px;margin-left: 30px;"
                :rows="3"
                placeholder="请输入功能用途"
                v-model="form.ufunction"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="台网代码" prop="stationId">
                <el-input v-model="form.stationId" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入台网代码" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="台站代码" prop="stationNum">
                <el-input v-model="form.stationNum" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入台站代码" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="台站名称" prop="stationName">
                <el-input v-model="form.stationName" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入台站名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="测点代码" prop="stationCode">
                <el-input v-model="form.stationCode" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入测点代码" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="仪器名称型号" prop="instrumentType">
                <el-input v-model="form.instrumentType" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入仪器名称型号" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="测项代码" prop="testCode">
                <el-input v-model="form.testCode" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入测项代码" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分量代码" prop="componentCode">
                <el-input v-model="form.componentCode" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入分量代码" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="起止时间" prop="strEndTime">
                <el-input v-model="form.strEndTime" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入起止时间" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="采样率" prop="samplingRate">
                <el-input v-model="form.samplingRate" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入采样率" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="原始数据来源" prop="dataSource">
                <el-input v-model="form.dataSource" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入原始数据来源" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品形式" prop="productForm">
                <el-input v-model="form.productForm" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品形式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品规格" prop="productSpecification">
                <el-input v-model="form.productSpecification" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品规格" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="产品生成方法" prop="generationMethod">
                <el-input v-model="form.generationMethod" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品生成方法" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="附件" prop="addIn">
                <el-input v-model="form.addIn" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入附件" />
              </el-form-item>
            </el-col>

            <el-col :span="20">
              <el-form-item label="产品形式" prop="productFormat">
                <el-input v-model="form.productFormat" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品形式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据量" prop="dataVolume">
                <el-input v-model="form.dataVolume" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入数据量" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分发方式" prop="distributionMode">
                <el-input v-model="form.distributionMode" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入分发方式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="在线链接" prop="onlineLink">
                <el-input v-model="form.onlineLink" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入在线链接" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分发单位" prop="distributionUnit">
                <el-input v-model="form.distributionUnit" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入分发单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="维护和更新频率" prop="renewalFrequency">
                <el-input v-model="form.renewalFrequency" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入维护和更新频率" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系人" prop="contactPerson">
                <el-input v-model="form.contactPerson" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系电话" prop="contactNumber">
                <el-input v-model="form.contactNumber" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="电子邮件" prop="email">
                <el-input v-model="form.email" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入电子邮件" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系地址" prop="contactAddress">
                <el-input v-model="form.contactAddress" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品格式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="安全限制分级" prop="safetyClassification">
                <el-input v-model="form.safetyClassification" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品格式" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="性能指标" prop="performanceIndex">
                <el-input v-model="form.performanceIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入性能指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="质量指标" prop="qualityIndex">
                <el-input v-model="form.qualityIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入质量指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="技术指标" prop="technicalIndex">
                <el-input v-model="form.technicalIndex" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入技术指标" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="责任单位" prop="propertyUnit">
                <el-input v-model="form.propertyUnit" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入责任单位" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="责任人" prop="propertyOwner">
                <el-input v-model="form.propertyOwner" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入责任人" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="引用格式" prop="referenceFormat">
                <el-input v-model="form.referenceFormat" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入引用格式" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="isEdit">
          <el-button type="primary" @click="submitForm">提 交</el-button>
          <el-button @click="reset">重 置</el-button>
        </div>
      </el-dialog>


      <el-dialog :title="title" :visible.sync="open2" width="1280px" append-to-body>
      <el-form :model="form">
        <el-row>
          <el-col :span="20">
            <el-form-item prop="institution">
              <el-upload
                class="upload"
                drag
                :limit="3"
                :file-list="fileList"
                :action="action2"
                :on-progress="onProgress"
                :on-success="handleUploadSuccess2"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </template>
    
  <script>
    import { proSerlist,
      getFileList, ufList, addFileList, delFileList, ufAdd,
      ufUpload, ufEditAuditState, ufDel, ufEdit, gnssList, gnssEditAuditState, levelList, 
      levelEditAuditState, dictionaryList, auditLogAdd, auditLogList,precursorCatalogList, precursorCatalogEditAuditState } from "@/api/workflow/prods";
    import Treeselect from "@riophae/vue-treeselect";
    import { Loading } from 'element-ui';
    import { getUserProfile } from "@/api/system/user"
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    import IconSelect from "@/components/IconSelect";
    import { encode, decode } from '@/utils/base/dataEncry.js';
    export default {
      name: "Menu",
      dicts: ['sys_show_hide', 'sys_normal_disable'],
      components: { Treeselect, IconSelect },
      data() {
        return {
          editor: null,
          mode: 'default', // or 'simple'
          // 遮罩层
          loading: true,
          typeName: 'underFluid',
          // 显示搜索条件
          showSearch: true,
          open2: false,
          open3: false,
          // 菜单表格树数据
          menuList: [],
          //是否可编辑
          isEdit: false,
          dialogVisible: false,
          //是否是省局用户
          isProvinceUser: false,
          //列表数
          total: 1,
          // 是否禁用
          isUploading: false,
          loading2: false,
          loading3: false,
          // 弹出层标题
          title: "新增",
          type: null,
          // 是否显示弹出层
          open: false,
          open5: false,
          openGnss: false,
          openLevel: false,
          openPrecursorCatalog: false,
          //审核意见
          opinion: '',
          activeName: 'underFluid',
          // 是否展开，默认全部折叠
          isExpandAll: false,
          // 重新渲染表格状态
          refreshTable: true,
          // 上传文件列表
          fileList: [],
          //审核记录
          hisRecord: [],
          user: {},
          //权限
          auth: null,
          // 文件上传地址
          action: process.env.VUE_APP_PRODS_API + '/prodSer/uploadFile',
          action2: process.env.VUE_APP_PRODS_API + '/prodSer/uf/upload',
          // 查询参数
          queryParams2: {
            pageNum: 1,
            pageSize: 10,
          },
          // 查询参数
          queryParams: {
            name: '',
            classification: '',
            institution: '',
            status:''
          },
          typeId: null,
          data: {},
               statusList: [
        // {
        //   label: '未提交',
        //   value: 0
        // },
        {
          label: '提交审核',
          value: 1
        },
        {
          label: '一审驳回',
          value: -10
        },
        {
          label: '二审驳回',
          value: -20
        },
        {
          label: '三审驳回',
          value: -30
        },
        {
          label: '一审通过',
          value: 10
        },
        {
          label: '二审通过',
          value: 20
        },
        {
          label: '三审通过',
          value: 30
        },
        {
          label: '审核完成',
          value: 99
        },
        {
          label: '已分发',
          value: 100
        } 
      ],
          //角色列表
          roleList: [],
          hasSel: [],
          // 表单参数
          form: {
            directoryName: '地下流体'
          },
          form2: {
          },
          id: null,
          // 表单校验
          rules: {
            directoryName: [
              { required: true, message: "目录名称不能为空", trigger: "blur" }
            ],
            providerUnit: [
              { required: true, message: "提供单位不能为空", trigger: "blur" }
            ],
            productName: [
              { required: true, message: "产品名称不能为空", trigger: "blur" }
            ],
            productContent: [
              { required: true, message: "产品内容不能为空", trigger: "blur" }
            ]
          }
        };
      },
      created() {
        // let taskId = this.$route.query.taskId
      },
      filters: {
        auditStates(val) {
            if(val == -10) return '一审驳回'
            if(val == -20) return '二审驳回'
            if(val == -30) return '三审驳回'
            if(val == 0) return '未提交'
            if(val == 1) return '提交审核'
            if(val == -1) return '被驳回'
            if(val == 10) return '一审通过'
            if(val == 20) return '二审通过'
            if(val == 99) return '审核完成'
        }
    },
      mounted() {
        this.getDictId('地下流体')
        // console.log(this.$store.state.user)
        //超级管理员或查看全部的权限
        if(this.$store.state.user.permissions[0] == '*:*:*' || this.$store.state.user.permissions.includes('workflow:product:approval:checkAll')){
          //管理员拥有所有审批权限
          this.auth = 99
          this.isProvinceUser = false
          //地下流体初始化
          this.getPageList({
            page: 1,
            limit: 20,
          });
          return
        }
        if(this.$store.state.user.permissions.includes('workflow:product:approval1')){
          this.auth = 1
          this.isProvinceUser = true
        }
        if(this.$store.state.user.permissions.includes('workflow:product:approval2')){
          this.auth = 10
          this.isProvinceUser = true
        }
        if(this.$store.state.user.permissions.includes('workflow:product:approval3')){
          this.auth = 20
          this.isProvinceUser = false
        }
        this.getUserId().then(res=>{
          this.getPageList({
            page: 1,
            limit: 20,
          });
        })
      },
      methods: {
          onCreated(editor) {
                this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
            },
      //获取当前登录用户所在单位
      getUserId(){
        const self = this
        return new Promise((resolve,reject)=>{
          getUserProfile().then(resp=>{
            self.user = resp.data
            resolve()
          }).catch((error) => {
            reject(error)
          })
        })
      },
        mounted() {
            // 模拟 ajax 请求，异步渲染编辑器
            setTimeout(() => {
                this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
            }, 1500)
        },
      async customUpload(file, insertFn) {                   // JS 语法
          // file 即选中的文件
          // 自己实现上传，并得到图片 url alt href
          // 最后插入图片
          insertFn(url, alt, href)
      },
        beforeDestroy() {
            const editor = this.editor
            if (editor == null) return
            editor.destroy() // 组件销毁时，及时销毁编辑器
        },
        // 选择图标
        selected(name) {
          this.form.icon = name;
        },
        getApprHis() {
          this.$router.push({ name: 'prodApprovalHis', params: { userName: this.userName } })
        },
        //地下流体
        getPageList(data) {
          this.menuList = []
          this.loading = true
          let info = {
            pageNum: data.page,
            pageSize: data.limit,
            productName: this.queryParams.name,
            providerUnit: this.queryParams.institution,
            auditState: this.auth
          }
          //管理员有全部审核权限
          if(this.auth == 99){
            delete(info.auditState)
          }
          if(this.queryParams.name == ''){
            delete(info.productName)
          }
          //省局用户只能审本省局的
          if(this.isProvinceUser){
            info.unitName = this.user.dept.deptName
          }else{
            //管理员或三审
            if(this.queryParams.institution == ''){
              delete(info.providerUnit)
            }
          }

          ufList(encode(info)).then(response => {
            this.loading = false;
            this.queryParams2.pageSize = decode(response).size;
            this.queryParams2.pageNum = decode(response).current;
            let list = decode(response).records
            this.total = decode(response).total;
            this.menuList = list;
          });
        },
        //GNSS
        getGnssPageList(data) {
          this.loading = true
          this.menuList = []
          let description = ''
          if(this.typeName == 'gnss'){
            description = 'GNSS产品'
          }
          if(this.typeName == 'InSAR'){
            description = 'InSAR产品'
          }
          if(this.typeName == 'distri'){
            description = '地震区划图'
          }
          if(this.typeName == 'constru'){
            description = '地震构造图'
          }
          if(this.typeName == 'active'){
            description = '地震活动断层'
          }
          if(this.typeName == 'project'){
            description = '工程抗震'
          }
          if(this.typeName == 'shuiz'){
            description = '水准产品'
          }
          let info = {
            pageNum: data.page,
            pageSize: data.limit,
            name: this.queryParams.name,
            institution: this.queryParams.institution,
            auditState: this.auth,
            description: description
          }
          //管理员有全部审核权限
          if(this.auth == 99){
            delete(info.auditState)
          }
          if(this.queryParams.name == ''){
            delete(info.name)
          }
          //省局用户只能审本省局的
          if(this.isProvinceUser){
            info.unitName = this.user.dept.deptName
          }else{
            //管理员或三审
            if(this.queryParams.institution == ''){
              delete(info.institution)
            }
          }
          gnssList(encode(info)).then(response => {
            this.loading = false;
            this.queryParams2.pageSize = decode(response).size;
            this.queryParams2.pageNum = decode(response).current;
            let list = decode(response).records
            this.total = decode(response).total;
            this.menuList = list;
          });
        },
        //跨断层水准
        getLevelPageList(data) {
          this.loading = true
          this.menuList = []
          let info = {
            pageNum: data.page,
            pageSize: data.limit,
            productName: this.queryParams.name,
            provideUnit: this.queryParams.institution,
            auditState: this.auth
          }
          //管理员有全部审核权限
          if(this.auth == 99){
            delete(info.auditState)
          }
          if(this.queryParams.name == ''){
            delete(info.productName)
          }
          //省局用户只能审本省局的
          if(this.isProvinceUser){
            info.unitName = this.user.dept.deptName
          }else{
            if(this.queryParams.institution == ''){
              delete(info.provideUnit)
            }
          }
          levelList(encode(info)).then(response => {
            this.loading = false;
            this.queryParams2.pageSize = decode(response).size;
            this.queryParams2.pageNum = decode(response).current;
            let list = decode(response).records
            this.total = decode(response).total;
            this.menuList = list;
          });
        },
        //定点地磁
        getPrecursorCatalogPageList(data) {
          this.loading = true
          this.menuList = []
          let info = {
            pageNum: data.page,
            pageSize: data.limit,
            nameProduct: this.queryParams.name,
            provide: this.queryParams.institution,
            auditState: this.auth
          }
          //管理员有全部审核权限
          if(this.auth == 99){
            delete(info.auditState)
          }
          if(this.queryParams.name == ''){
            delete(info.nameProduct)
          }
          //省局用户只能审本省局的
          if(this.isProvinceUser){
            info.unitName = this.user.dept.deptName
          }else{
            if(this.queryParams.institution == ''){
              delete(info.provide)
            }
          }
          precursorCatalogList(encode(info)).then(response => {
            this.loading = false;
            this.queryParams2.pageSize = decode(response).size;
            this.queryParams2.pageNum = decode(response).current;
            let list = decode(response).records
            this.total = decode(response).total;
            this.menuList = list;
          });
        },
        handleUpload(row) {
          this.form2 = {...row}
          this.loading2 = true
          this.loadFileList(row)
          this.title = '附件列表'
          this.open3 = true
        },
        pageLists(page) {
          //地下流体
          if(this.typeName == 'underFluid'){
            this.getDictId('地下流体')
            this.getPageList(page);
          }
          //GNSS
          if(this.typeName == 'gnss'){
            this.getDictId('GNSS产品')
            this.getGnssPageList(page);
          }
          //InSAR
          if(this.typeName == 'InSAR'){
            this.getDictId('InSAR产品')
            this.getGnssPageList(page);
          }
          //地震区划图
          if(this.typeName == 'distri'){
            this.getDictId('地震区划图')
            this.getGnssPageList(page);
          }
          //地震构造图
          if(this.typeName == 'constru'){
            this.getDictId('地震构造图')
            this.getGnssPageList(page);
          }
          //地震活动断层
          if(this.typeName == 'active'){
            this.getDictId('地震活动断层')
            this.getGnssPageList(page);
          }
          //工程抗震
          if(this.typeName == 'project'){
            this.getDictId('工程抗震')
            this.getGnssPageList(page);
          }
          //跨断层水准
          if(this.typeName == 'level'){
            this.getDictId('跨断层水准')
            this.getLevelPageList(page);
          }
          //水准
          if(this.typeName == 'shuiz'){
            this.getDictId('水准')
            this.getGnssPageList(page);
          }
          //定点地磁重力
          if(this.typeName.indexOf('precursorCatalog') != -1){
            this.getDictId('定点地磁')
            this.getPrecursorCatalogPageList(page);
          }
        },
        //切换选项卡
        changeType(e) {
          this.typeName = e.name
          this.queryParams.name = ''
          //地下流体
          if(e.name == 'underFluid'){
            this.getDictId('地下流体')
            this.getPageList({
              page: 1,
              limit: 20,
            });
          }
          //GNSS
          if(e.name == 'gnss'){
            this.getDictId('GNSS产品')
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //InSAR
          if(e.name == 'InSAR'){
            this.getDictId('InSAR产品')
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //地震区划图
          if(e.name == 'distri'){
            this.getDictId('地震区划图')
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //地震构造图
          if(e.name == 'constru'){
            this.getDictId('地震构造图')
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //地震活动断层
          if(e.name == 'active'){
            this.getDictId('地震活动断层')
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //工程抗震
          if(e.name == 'project'){
            this.getDictId('工程抗震')
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //跨断层水准
          if(e.name == 'level'){
            this.getDictId('跨断层水准')
            this.getLevelPageList({
              page: 1,
              limit: 20,
            });
          }
          //水准
          if(e.name == 'shuiz'){
            this.getDictId('水准')
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //定点地磁重力
          if(e.name == 'precursorCatalog'){
            this.getDictId('定点地磁')
            this.queryParams.name = '定点形变产品'
            this.getPrecursorCatalogPageList({
              page: 1,
              limit: 20,
            });
          }
          if(e.name == 'precursorCatalog2'){
            this.getDictId('定点地磁')
            this.queryParams.name = '重力产品'
            this.getPrecursorCatalogPageList({
              page: 1,
              limit: 20,
            });
          }
          if(e.name == 'precursorCatalog3'){
            this.getDictId('定点地磁')
            this.queryParams.name = '地倾斜'
            this.getPrecursorCatalogPageList({
              page: 1,
              limit: 20,
            });
          }
          if(e.name == 'precursorCatalog4'){
            this.getDictId('定点地磁')
            this.queryParams.name = '地电产品'
            this.getPrecursorCatalogPageList({
              page: 1,
              limit: 20,
            });
          }
          if(e.name == 'precursorCatalog5'){
            this.getDictId('定点地磁')
            this.queryParams.name = '地磁产品'
            this.getPrecursorCatalogPageList({
              page: 1,
              limit: 20,
            });
          }
        },
        check(row,type,temp) {
          this.id = row.id
          this.type = type
          this.data = {...row}
          this.dialogVisible = true
          if(temp == 1){
            this.opinion = '通过'
            this.approval(1)
          }
        },
        approval(type) {
          if (type === 4) {
            this.opinion = ''
            this.dialogVisible = false
            return
          }
            //通过
            if(type == 1){
              let auditState = 10
              //一审
              if(this.data.auditState == 1) {
                auditState = 10
              }
              //二审
              if(this.data.auditState == 10) {
                auditState = 20
              }
              //三审
              if(this.data.auditState == 20) {
                auditState = 99
              }
            let par2 = {
              productId: this.data.id,
              typeId: this.typeId,
              msg: this.opinion,
              userName: this.$store.state.user.name,
              auditState: auditState,
            }
            // 地下流体新增审批历史
            if(this.type == 0){
              par2.productName = this.data.productName
              par2.uploader = this.data.uploader
              par2.typeName = this.data.directoryName
              par2.pTime = this.data.uploadTime
            }
            // GNSS新增审批历史
            if(this.type == 1){
              par2.productName = this.data.name
              par2.uploader = this.data.uploader
              par2.typeName = this.data.description
              par2.pTime = this.data.uploadTime
            }
            // 跨断层水准新增审批历史
            if(this.type == 2){
              par2.productName = this.data.productName
              par2.uploader = this.data.uploader
              par2.typeName = this.data.directoryName
              par2.pTime = this.data.uploadTime
            }
            // 定点地磁新增审批历史
            if(this.type == 3){
              par2.productName = this.data.productName
              par2.uploader = this.data.uploader
              par2.typeName = this.data.nameProduct
              par2.pTime = this.data.uploadTime
            }
            
            let par = {
              id: this.data.id,
              auditState: auditState
            }
            //地下流体
            if(this.type == 0){
              this.loading = true
              ufEditAuditState(encode(par)).then(res=>{
                this.loading = false
                this.$message({
                  message: '审批成功！',
                  type: 'success'
                });
                this.getPageList({
                  page: 1,
                  limit: 20,
                });
              })
            }
            //GNSS
            if(this.type == 1){
              this.loading = true
              gnssEditAuditState(encode(par)).then(res=>{
                this.loading = false
                this.$message({
                  message: '审批成功！',
                  type: 'success'
                });
                this.getGnssPageList({
                  page: 1,
                  limit: 20,
                });
              })
            }
            //跨断层水准
            if(this.type == 2){
              this.loading = true
              levelEditAuditState(encode(par)).then(res=>{
                this.loading = false
                this.$message({
                  message: '审批成功！',
                  type: 'success'
                });
                this.getLevelPageList({
                  page: 1,
                  limit: 20,
                });
              })
            }
            //定点地磁
            if(this.type == 3){
              this.loading = true
              par.approvalStatus = par.auditState
              //一审
              if(this.data.approvalStatus == 1) {
                par.approvalStatus = 10
              }
              //二审
              if(this.data.approvalStatus == 10) {
                par.approvalStatus = 20
              }
              //三审
              if(this.data.approvalStatus == 20) {
                par.approvalStatus = 99
              }
              precursorCatalogEditAuditState(encode(par)).then(res=>{
                this.loading = false
                this.$message({
                  message: '审批成功！',
                  type: 'success'
                });
                this.getPrecursorCatalogPageList({
                  page: 1,
                  limit: 20,
                });
              })
            }
            auditLogAdd(encode(par2)).then()
          }
          //不通过
            if(type == 2){
              let auditState = 10
              //一审
              if(this.data.auditState == 1 || this.data.auditState == 1) {
                auditState = -10
              }
              //二审
              if(this.data.auditState == 10) {
                auditState = -20
              }
              //三审
              if(this.data.auditState == 20) {
                auditState = -30
              }
              let par2 = {
                productId: this.data.id,
                msg: this.opinion,
                typeId: this.typeId,
                userName: this.$store.state.user.name,
                auditState: auditState,
              }
              // 地下流体新增审批历史
            if(this.type == 0){
              par2.productName = this.data.productName
              par2.uploader = this.data.uploader
              par2.typeName = this.data.directoryName
              par2.pTime = this.data.uploadTime
            }
            // GNSS新增审批历史
            if(this.type == 1){
              par2.productName = this.data.name
              par2.uploader = this.data.uploader
              par2.typeName = this.data.description
              par2.pTime = this.data.uploadTime
            }
            // 跨断层水准新增审批历史
            if(this.type == 2){
              par2.productName = this.data.productName
              par2.uploader = this.data.uploader
              par2.typeName = this.data.directoryName
              par2.pTime = this.data.uploadTime
            }
            // 定点地磁新增审批历史
            if(this.type == 3){
              par2.productName = this.data.productName
              par2.uploader = this.data.uploader
              par2.typeName = this.data.nameProduct
              par2.pTime = this.data.uploadTime
            }
              let par = {
                id: this.data.id,
                auditState: auditState
              }
            //地下流体
            if(this.type == 0){
              this.loading = true
              ufEditAuditState(encode(par)).then(res=>{
                this.loading = false
                this.$message({
                  message: '驳回成功！',
                  type: 'success'
                });
                this.getPageList({
                  page: 1,
                  limit: 20,
                });
              })
            }
            //GNSS
            if(this.type == 1){
              this.loading = true
              gnssEditAuditState(encode(par)).then(res=>{
                this.loading = false
                this.$message({
                  message: '驳回成功！',
                  type: 'success'
                });
                this.getGnssPageList({
                  page: 1,
                  limit: 20,
                });
              })
            }
            //跨断层水准
            if(this.type == 2){
              this.loading = true
              levelEditAuditState(encode(par)).then(res=>{
                this.loading = false
                this.$message({
                  message: '驳回成功！',
                  type: 'success'
                });
                this.getLevelPageList({
                  page: 1,
                  limit: 20,
                });
              })
            }
            //定点地磁
            if(this.type == 3){
              this.loading = true
              par.approvalStatus = par.auditState
              //一审
              if(this.data.approvalStatus == 1) {
                par.approvalStatus = -10
              }
              //二审
              if(this.data.approvalStatus == 10) {
                par.approvalStatus = -20
              }
              //三审
              if(this.data.approvalStatus == 20) {
                par.approvalStatus = -30
              }
              precursorCatalogEditAuditState(encode(par)).then(res=>{
                this.loading = false
                this.$message({
                  message: '驳回成功！',
                  type: 'success'
                });
                this.getPrecursorCatalogPageList({
                  page: 1,
                  limit: 20,
                });
              })
            }
              auditLogAdd(encode(par2)).then()
            }
            this.opinion = ''
            this.dialogVisible = false
        },
        onProgress() {
          this.loading3 = Loading.service({
              lock: true,
              text: '数据上传中，请稍等...',
              spinner: 'el-icon-loading',
              background: 'rgba(255, 255, 255, 0.9)'
            });
        },
        getDictId(name) {
          dictionaryList(encode({productName: name})).then(res=>{
            let data = decode(res)
            this.typeId = data[0].id
          })
        },
        getHisList(id) {
          this.open5 = true
          this.loading2 = true
          auditLogList(encode({
            productId: id,
            typeId: this.typeId,
            pageNum: 1,
            pageSize: 999
          })).then(res=>{
            this.hisRecord = decode(res).records
            this.loading2 = false
          })
        },
        handleSelectionChange(e) {
          this.hasSel = [...e]
        },
        onceAppr() {
          const self = this
          this.$modal.confirm('是否确认一键审批？').then(function() {
            self.hasSel.forEach(item=>{
            let timer = null;
            if(self.typeName == 'underFluid' && item.auditState >= 1 && item.auditState < 99){
              if (!timer) {
                timer = setTimeout(function() {
                  self.check(item,0,1)
                  timer = null;
                }, 300)
              }
            }
            if(self.typeName == 'gnss' && item.auditState >= 1 && item.auditState < 99){
              if (!timer) {
                timer = setTimeout(function() {
                  self.check(item,1,1)
                  timer = null;
                }, 300)
              }
            }
            if(self.typeName == 'InSAR' && item.auditState >= 1 && item.auditState < 99){
              if (!timer) {
                timer = setTimeout(function() {
                  self.check(item,1,1)
                  timer = null;
                }, 300)
              }
            }
            if(self.typeName == 'distri' && item.auditState >= 1 && item.auditState < 99){
              if (!timer) {
                timer = setTimeout(function() {
                  self.check(item,1,1)
                  timer = null;
                }, 300)
              }
            }
            if(self.typeName == 'constru' && item.auditState >= 1 && item.auditState < 99){
              if (!timer) {
                timer = setTimeout(function() {
                  self.check(item,1,1)
                  timer = null;
                }, 300)
              }
            }
            if(self.typeName == 'active' && item.auditState >= 1 && item.auditState < 99){
              if (!timer) {
                timer = setTimeout(function() {
                  self.check(item,1,1)
                  timer = null;
                }, 300)
              }
            }
            if(self.typeName == 'project' && item.auditState >= 1 && item.auditState < 99){
              if (!timer) {
                timer = setTimeout(function() {
                  self.check(item,1,1)
                  timer = null;
                }, 300)
              }
            }
            if(self.typeName == 'level' && item.auditState >= 1 && item.auditState < 99){
              if (!timer) {
                timer = setTimeout(function() {
                  self.check(item,2,1)
                  timer = null;
                }, 300)
              }
            }
            if(self.typeName.indexOf('precursorCatalog') != -1 && item.approvalStatus >= 1 && item.approvalStatus < 99){
              if (!timer) {
                timer = setTimeout(function() {
                  self.check(item,3,1)
                  timer = null;
                }, 300)
              }
            }
          })
        })
        },
        //数据上传
        uploadData() {
          this.open2 = true
          this.title = '文件上传'
        },
        sentAudit(row) {
          this.$modal.confirm('是否确认提交' + row.directoryName+'？提交后将不可修改和删除').then(function() {
            let par = {
              id: row.id,
              auditState: 1
            }
            return ufEditAuditState(encode(par));
          }).then(() => {
            this.getPageList({
              page: 1,
              limit: 20
            });
            this.$modal.msgSuccess("提交审核成功");
          }).catch(() => {});
        },
        //下载文件
        downLoadFile(url) {
          window.open(url)
        },
        //删除附件
        delFiles(row) {
          this.loading2 = true
          let par = {
            id: row.id,
            productId: row.productId,
            typeId: row.typeId
          }
          delFileList(encode(par)).then(res => {
            // console.log(decode(res))
            this.loading2 = false
            this.loadFileList(this.form2)
          })
        },
        loadFileList(row) {
          let par = {
            productId: row.id,
            typeId: this.typeId
          }
          getFileList(encode(par)).then(res => {
            this.loading2 = false
            this.fileList = decode(res)
          })
        },
      // 上传成功回调
      handleUploadSuccess(res, file) {
        let par = {
          productId: this.form2.id,
          fileName: res.split('filename=')[1],
          typeId: this.typeId,
          realName: file.name,
          fileUrl: res,
          uploader: this.$store.state.user.name,
        }
        addFileList(encode(par)).then(resp => {
            if (resp) {
            this.$message.success(resp)
            this.fileList.push({
              name: file.name,
              url: res
            })
          } else {
            this.$message.error('上传失败, 请重试')
          }
        })
  
      },
      handleUploadSuccess2(e,f){
          if(e){
            this.$message(e)
          }
          this.loading3.close()
        },
        /** 转换菜单数据结构 */
        normalizer(node) {
          if (node.children && !node.children.length) {
            delete node.children;
          }
          return {
            id: node.menuId,
            label: node.menuName,
            children: node.children
          };
        },
        // 取消按钮
        cancel() {
          this.open = false;
          this.reset();
        },
        handleInfo(row,type) {
        //   console.log(JSON.stringify(row))
          this.title = "详情";
          this.isEdit = false
          let par = {
            id: row.id
          }
          this.form = row
          if(type == 1){
            this.open = true;
          }
          if(type == 2){
            this.openGnss = true;
          }
          if(type == 3){
            this.openLevel = true;
          }
          if(type == 4){
            this.openPrecursorCatalog = true;
          }
          //加载文件列表
          this.loadFileList(row)
        },
        // 表单重置
        reset() {
          this.form = {
            directoryName: '地下流体'
          };
          // this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
          if(this.activeName == 'underFluid'){
            this.getPageList({
              page: 1,
              limit: 20,
            });
          }
          if(this.activeName == 'gnss'){
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //InSAR
          if(this.activeName == 'InSAR'){
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //地震区划图
          if(this.activeName == 'distri'){
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //地震构造图
          if(this.activeName == 'constru'){
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //地震活动断层
          if(this.activeName == 'active'){
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          //工程抗震
          if(this.activeName == 'project'){
            this.getGnssPageList({
              page: 1,
              limit: 20,
            });
          }
          if(this.activeName == 'level'){
            this.getLevelPageList({
              page: 1,
              limit: 20,
            });
          }
          if(this.activeName.indexOf('precursorCatalog') != -1){
            this.getPrecursorCatalogPageList({
              page: 1,
              limit: 20,
            });
          }
        },
        /** 重置按钮操作 */
        resetQuery() {
          this.queryParams = {
            name: '',
            institution: '',
            status: ''
          }
          this.getPageList({
            page: 1,
            limit: 10
          });
        },
        /** 新增按钮操作 */
        handleAdd() {
          this.reset();
          this.open = true;
          this.title = "新增";
          this.isEdit = true
        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
          this.refreshTable = false;
          this.isExpandAll = !this.isExpandAll;
          this.$nextTick(() => {
            this.refreshTable = true;
          });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
          this.form = row;
          this.title = "修改";
          this.isEdit = true
          this.open = true;
          //加载文件列表
          this.loadFileList(row)
        },
        /** 提交按钮 */
        submitForm: function() {
          this.loading2 = true
          if (this.title == "修改") {
            ufEdit(encode(this.form)).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getPageList({
                  page: 1,
                  limit: 20
                });
                this.loading2 = false
              });
            } else {
                ufAdd(encode(this.form)).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getPageList({
                    page: 1,
                    limit: 20
                });
                this.loading2 = false
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
          this.$modal.confirm('是否确认删除' + row.directoryName).then(function() {
            let par = {
              id: row.id
            }
            return ufDel(encode(par));
          }).then(() => {
            this.getPageList({
              page: 1,
              limit: 20
            });
            this.$modal.msgSuccess("删除成功");
          }).catch(() => {});
        }
      }
    };
    </script>
  <style src="@wangeditor/editor/dist/css/style.css"></style>
  <style lang="scss" scoped>
    .upload {
      width: 100%;
      position: relative;
      left: 35%;
      margin-top: 20px;
    }
    .fileText {
      padding: 10px 0px;
      color: rgb(0, 89, 255);
      cursor: pointer;
    }
  </style>
    