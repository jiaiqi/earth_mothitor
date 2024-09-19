<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="专题名称" prop="aName">
        <el-input
          v-model="queryParams.aName"
          placeholder="请输入专题名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['workflow:order:index']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
    <el-tabs v-if="showInfo" v-model="activeName2" type="card" @tab-click="tabChange2">
      <div style="text-align:right;padding: 0px 50px;cursor: pointer;" @click="back"><i class="el-icon-back"></i>返回</div>
      <el-tab-pane label="最新动态" name="news" 
      v-if="showNews">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleNewsAdd"
          v-hasPermi="['workflow:bigEar:news:add']"
        >新增</el-button>
      </el-col>
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="newsList"
    >
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
        </template>
      </el-table-column> -->
      <el-table-column prop="title" label="专题名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="ctime" label="发布时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div>
            {{ new Date(scope.row.ctime).toLocaleDateString() }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="situation" label="需求概况" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column prop="visits" label="浏览量" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleNewInfo(scope.row)"
            v-hasPermi="['workflow:order:index']"
          >详情</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleNewsUpdate(scope.row)"
            v-hasPermi="['workflow:order:index']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleNewDel(scope.row)"
            v-hasPermi="['workflow:order:index']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination style="margin: 15px 0px;" v-show="total2 > 0" :total="total2" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getPageList" /> -->
    </el-tab-pane>
      <el-tab-pane label="专业产品" name="prods" 
        v-if="showProds">
        <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleProdsAdd"
          
        >新增</el-button>
      </el-col>
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="productList"
    >
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
        </template>
      </el-table-column> -->
      <el-table-column prop="title" label="名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="catalog" label="分类" :show-overflow-tooltip="true"></el-table-column>
       <el-table-column prop="unit" label="单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="ctime" label="发布时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div>
            {{ new Date(scope.row.ctime).toLocaleDateString() }}
          </div>
        </template>
      </el-table-column> 
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleProdsInfo(scope.row)"
            
          >详情</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleProdsUpdate(scope.row)"
            
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleProdsDelete(scope.row)"
           
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
      
        </el-tab-pane>
      <el-tab-pane label="专家研讨" name="Exper" 
        v-if="showExper">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleExpAdd"
                v-hasPermi="['workflow:bigEar:Exper:add']"
              >新增</el-button>
            </el-col>
          </el-row>
        <el-table
          v-loading="loading"
          :data="experList"
        >
          <!-- <el-table-column type="expand">
            <template slot-scope="props">
            </template>
          </el-table-column> -->
          <el-table-column prop="title" label="名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="unit" label="发布单位" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="author" label="发布人" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="visits" label="浏览量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-search"
                @click="handleExpInfo(scope.row)"
                v-hasPermi="['workflow:bigEar:Exper:check']"
              >详情</el-button>
              <el-button 
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleExpUpdate(scope.row)"
                v-hasPermi="['workflow:bigEar:Exper:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleExpDelete(scope.row)"
                v-hasPermi="['workflow:bigEar:Exper:delete']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      <pagination v-show="total2 > 0" :total="total2" :page.sync="queryParams3.pageNum" :limit.sync="queryParams3.pageSize"
        @pagination="getPageList2" />
      </el-tab-pane>
    </el-tabs>
    <div v-else>
      <div>
      <el-tabs type="card" v-model="active" @tab-click="tabChange">
        <el-tab-pane label="大震列表" name="bigEar">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['workflow:bigEar:add']"
              >新增</el-button>
            </el-col>
          </el-row>
          <el-table
            v-loading="loading"
            :data="earList"
          >
            <el-table-column prop="headTitle" label="标题" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="localName" label="位置" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="m" label="震级" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="otime" label="发震时间" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ new Date(scope.row.otime).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="auditStatus" width="120" label="审核状态" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag :type="scope.row.auditStatus >= 99 ? 'success' : scope.row.auditStatus < 0 ?'danger': 
              (scope.row.auditStatus == 0 || scope.row.auditStatus == 10||scope.row.auditStatus == 20) ?'' : scope.row.auditStatus == 1? 'success': 'warning'"
                style="font-weight:bold">
                {{ scope.row.auditStatus | auditStates }}
              </el-tag>
            </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-search"
                  @click="handleInfo(scope.row)"
                  v-hasPermi="['workflow:bigEar:index']"
                >{{ scope.row.auditStatus == 0 ? '查看/修改':'查看' }}</el-button>
                <el-button 
                v-if="scope.row.auditStatus == 0"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['workflow:bigEar:edit']"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['workflow:bigEar:delete']"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
          @pagination="getList" />
          </el-tab-pane>
        <el-tab-pane v-if="showWindow" label="飘窗内容" name="window">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleWindowAdd"
                v-hasPermi="['workflow:bigEar:window:add']"
              >新增</el-button>
            </el-col>
          </el-row>
            <el-table
              v-if="refreshTable"
              v-loading="loading"
              :data="menuList"
            >
        <el-table-column prop="spName" label="专题名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="begtime" label="开始时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ new Date(scope.row.begtime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="endtime" label="结束时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ new Date(scope.row.endtime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="是否展示" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.flag == 1 ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleWinInfo(scope.row)"
            v-hasPermi="['workflow:order:index']"
          >详情</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleWinUpdate(scope.row)"
            v-hasPermi="['workflow:order:index']"
          >修改</el-button>
          <el-button
            v-if="scope.row.auditState <= 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleWinDelete(scope.row)"
            v-hasPermi="['workflow:order:index']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination style="margin: 15px 0px;" v-show="total2 > 0" :total="total2" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getPageList" /> -->
        </el-tab-pane>
      </el-tabs>
    </div>
    </div>


    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1280px" @close="open = false" append-to-body>
      <el-dialog title="事件选择" :visible.sync="showEvent" @close="showEvent = false" width="800px" append-to-body>
        <div>
          <el-table
            v-loading="loading2"
            highlight-current-row
            height="500"
            @current-change="handleCurrentChange"
            :data="eventList"
          >
            <el-table-column prop="localName" label="位置" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="m" label="震级" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="otime" label="发震时间" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ new Date(scope.row.otime).toLocaleString() }}
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total4 > 0" :total="total4" :page.sync="queryParams4.pageNum" :limit.sync="queryParams4.pageSize"
          @pagination="openEvent" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showEvent = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="标题" prop="headTitle">
              <el-input v-model="spcialProForm.headTitle" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="关联事件" prop="eventId">
              <el-input @focus="openEvent({page:1,limit:20})" v-model="eventName" placeholder="请选择关联事件" />
           </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="位置" prop="localName">
              <el-input v-model="spcialProForm.localName" :disabled="true" placeholder="请输入位置" />
           </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="经纬度" prop="lon">
              经度：
              <el-input style="width: 150px;margin: 0px 5px;" v-model="spcialProForm.lon" :disabled="true" placeholder="请输入经度" />
              纬度：
              <el-input style="width: 150px;margin: 0px 5px;" v-model="spcialProForm.lat" :disabled="true" placeholder="请输入纬度" />
           </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="发震时间" prop="otime">
              <el-date-picker
                v-model="spcialProForm.otime"
                :disabled="true"
                type="datetime"
                placeholder="选择发震时间">
              </el-date-picker>
           </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="震级" prop="m">
              <el-input v-model="spcialProForm.m" placeholder="请输入震级" :disabled="true" />
           </el-form-item>
          </el-col>
          <!-- <el-col :span="20">
            <el-form-item label="开始时间" prop="aType">
              <el-select v-model="queryParams.aType" placeholder="请选择目录类别" clearable>
                <el-option
                  v-for="dict in typeList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div v-if="title != '详情'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="title" :visible.sync="open2"  @close="open2 = false" width="1000px" append-to-body>
      <!-- 大震选择列表 -->
      <el-dialog title="大震专题选择" :visible.sync="showSpList" width="1000px" append-to-body>
        <el-table
            highlight-current-row
            height="500"
            @current-change="handleCurrentChange2"
            :data="allEathList"
          >
            <el-table-column prop="headTitle" label="标题" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="localName" label="位置" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="m" label="震级" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="otime" label="发震时间" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ new Date(scope.row.otime).toLocaleString() }}
              </template>
            </el-table-column>
          </el-table>
      </el-dialog>
      <el-form ref="form" :model="windowData" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="专题" prop="specialId">
              <el-input @focus="openSp" v-model="windowData.spName" :disabled="title == '详情'" placeholder="请输入专题" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="是否展示" prop="flag">
              <el-select v-model="windowData.flag" placeholder="请选择是否展示" :disabled="title == '详情'" clearable>
                <el-option
                  :value="1">是</el-option>
                  <el-option
                  :value="0">否</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="开始时间" prop="begtime">
              <el-date-picker
              :disabled="title == '详情'"
                v-model="windowData.begtime"
                type="datetime"
                placeholder="选择开始时间">
              </el-date-picker>
           </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="结束时间" prop="endtime">
              <el-date-picker
              :disabled="title == '详情'"
                v-model="windowData.endtime"
                type="datetime"
                placeholder="选择结束时间">
              </el-date-picker>
           </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="title != '详情'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitWinForm">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </el-dialog>

    <!-- 专家研讨弹窗 -->
    <el-dialog :title="title" :visible="open3"  @close="open3 = false" width="1080px">
      <el-form ref="form" :model="expData" :rules="rules2" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="标题" prop="title">
              <el-input v-model="expData.title" :disabled="title == '详情'" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="发布单位" prop="unit">
              <el-input v-model="expData.unit" :disabled="title == '详情'" placeholder="请输入发布单位" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="发布人" prop="author">
              <el-input v-model="expData.author" :disabled="title == '详情'" placeholder="请输入发布人" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            {{showType}}
            <el-form-item label="展示形式" prop="showType">
              <el-select v-model="showType" placeholder="请选择" :disabled="title == '详情'" clearable>
                <el-option
                  value="跳转">跳转</el-option>
                  <el-option
                  value="富文本">富文本</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item v-if="showType == '跳转'" label="跳转路径" prop="url">
              <el-input v-model="expData.url" :disabled="title == '详情'" placeholder="请输入跳转路径" />
            </el-form-item>
            <el-form-item v-else-if="showType == '富文本'" label="内容" prop="text">
              <div v-if="title != '详情'" style="border: 1px solid #ccc;margin-top: 20px;">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor10" :defaultConfig="toolbarConfig10" :mode="mode" />
                <!-- {{form.sText}} -->
                <Editor ref="editor" style="height: 300px; overflow-y: hidden;" v-model="expData.text" :defaultConfig="editorConfig" :mode="mode"
                  @onCreated="onCreated10" />
              </div>
              <div v-else>
                <div class="text" v-html="expData.text"></div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="title != '详情'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitExpForm">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </el-dialog>

    <!-- 最新动态弹窗 -->
    <el-dialog :title="title" :visible="open4"  @close="open4 = false" width="1080px">
      <el-form ref="form" :model="newsData" :rules="rules3" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="标题" prop="title">
              <el-input v-model="newsData.title" :disabled="title == '详情'" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="发布人" prop="author">
              <el-input v-model="newsData.author" :disabled="title == '详情'" placeholder="请输入发布人" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
          <el-form-item v-if="newsData.imgLink == ''" label="封面图片" prop="imgLink">
              <el-upload
                class="upload"
                drag
                :limit="1"
                :file-list="fileList"
                :action="action"
                list-type="picture"
                :on-success="handleUploadSuccess"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">只能上传一张jpg/png文件，且不超过2MB</div>
              </el-upload>
            </el-form-item>
            <div style="width:100%;display:flex;justify-content:center;margin:15px 0px" v-else>
              <img :src="newsData.imgLink" style="width:230px;height:170px" />
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="展示形式" prop="showType">
              <el-select v-model="showType" placeholder="请选择" :disabled="title == '详情'" clearable>
                <el-option
                  value="跳转">跳转</el-option>
                  <el-option
                  value="富文本">富文本</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item v-if="showType == '跳转'" label="跳转路径" prop="url">
              <el-input v-if="title != '详情'" v-model="newsData.url" :disabled="title == '详情'" placeholder="请输入跳转路径" />
              <div v-else style="color:blue"><a :href="newsData.url" target="_blank">{{newsData.url}}</a></div>
            </el-form-item>
            <el-form-item v-else-if="showType == '富文本'" label="内容" prop="text">
              <div v-if="title != '详情'" style="border: 1px solid #ccc;margin-top: 20px;">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor11" :defaultConfig="toolbarConfig11" :mode="mode" />
                <!-- {{form.sText}} -->
                <Editor ref="editor" style="height: 300px; overflow-y: hidden;" v-model="newsData.text" :defaultConfig="editorConfig" :mode="mode"
                  @onCreated="onCreated11" />
              </div>
              <div v-else>
                <div class="text" v-html="newsData.text"></div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="title != '详情'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitNewsForm">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </el-dialog>

       <!-- 专业产品弹窗 -->
    <el-dialog :title="title" :visible="open5"  @close="open5 = false" width="75%">
      <el-form ref="form" :model="catalogData" :rules="rules5" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="title">
              <el-input v-model="catalogData.title" :disabled="title == '详情'" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="catalog">
                <el-select
                :disabled="title == '详情'"
               v-model="catalogData.catalog"
               placeholder="请选择分类"
               clearable
               style="width: 590px"
            >
               <el-option
                  v-for="dict in DZZT_LIST"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
               />
            </el-select> 
            </el-form-item>
          </el-col>
            <el-col :span="12">
          <el-form-item label="单位" prop="unit">
              <el-input v-model="catalogData.unit" :disabled="title == '详情'" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布人" prop="author">
              <el-input v-model="catalogData.author" :disabled="title == '详情'" placeholder="请输入发布人" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
             
          <el-form-item  label="封面图片">
              <el-upload
              v-if="title !== '详情'"
                class="upload"
                drag
                :limit="1"
                :file-list="fileList"
                :action="action"
                list-type="picture"
                :on-success="handleUploadCatalogSuccess"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">只能上传一张jpg/png文件，且不超过2MB</div>
              </el-upload>
              <div style="width:100%;display:flex;justify-content:center;margin:15px 0px" v-if=" title == '详情' && catalogData.visits && catalogData.visits!== ''">
              <img :src="catalogData.visits" style="width:230px;height:170px" />
            </div>
            </el-form-item>
           
          </el-col> 
          <el-col :span="25"> 
            <el-form-item   label="内容" prop="text">
              <div v-if="title != '详情'" style="border: 1px solid #ccc;margin-top: 20px;">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor11" :defaultConfig="toolbarConfig11" :mode="mode" />
                <!-- {{form.sText}} -->
                <Editor ref="editor" style="height: 300px; overflow-y: hidden;" v-model="catalogData.text" :defaultConfig="editorConfig" :mode="mode"
                  @onCreated="onCreated11" />
              </div>
              <div v-else>
                <div class="text" v-html="catalogData.text"></div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="title != '详情'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCatalogForm">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
  import { delMenu, addMenu, updateMenu } from "@/api/system/menu";
  import { quickAdd } from "@/api/workflow/audit";
  import { getEarthList, getEveList, getQWList, addQW, editQW, delQW, earthAdd, earthEdit, earthDel,
    getConfList, addConfList, delConfList, editConfList, getZJList, addZJ, editZJ, delZJ,
    delNew, editNew, addNew, getNewList,getCatalogList,delCatalog, editCatalog, addCatalog
  } from "@/api/workflow/bigEar";
  import { getUserProfile } from "@/api/system/user"
  import { socialList, getField, getClassification, socialAdd, socialEdit, socialDel } from "@/api/workflow/directory";
  // import { getField } from "@/api/workflow/directory";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { IEditorConfig } from '@wangeditor/editor'
  import { encode, decode } from '@/utils/base/dataEncry.js';
import { value } from "dom7";
  export default {
    name: "Menu",
    dicts: ['sys_show_hide', 'sys_normal_disable'],
    components: { Treeselect, IconSelect, Editor, Toolbar },
    data() {
      return {
        editor: null,
        editor2: null,
        editor3: null,
        editor4: null,
        editor5: null,
        editor6: null,
        editor7: null,
        editor8: null,
        editor9: null,
        editor10: null,
        editor11: null,
        toolbarConfig: { },
        toolbarConfig2: { },
        toolbarConfig3: { },
        toolbarConfig4: { },
        toolbarConfig5: { },
        toolbarConfig6: { },
        toolbarConfig7: { },
        toolbarConfig8: { },
        toolbarConfig9: { },
        toolbarConfig10: { },
        toolbarConfig11: { },
        richText: '',
        richText2: '',
        richText3: '',
        richText4: '',
        richText5: '',
        richText6: '',
        richText7: '',
        richText8: '',
        richText9: '',
        richText10: '',
        richText11: '',
        mode: 'default', // or 'simple'
        showType: '',
        activeNames: '',
        active: 'bigEar',
        action:  process.env.VUE_APP_PRODS_API + '/prodSer/uploadFile',
        actionImg: process.env.VUE_APP_PRODS_API + '/prodSer/uploadImage',
        //大震列表
        earList: [],
        fileList: [],
        // 遮罩层
        loading: true,
        loading2: true,
        loading3: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        //事件列表
        eventList: [],
        //专家研讨列表
        experList: [],
        //最新动态列表
        newsList: [],
        //专业产品列表
        productList: [],
        //打开事件选择弹窗
        showEvent: false,
        //最新动态权限
        showNews: true,
        //产品权限
        showProds: true,
        //专家研讨模块权限
        showExper: true,
        //飘窗管理权限
        showWindow: true,
        //大震专题选择列表
        showSpList: false,
        //是否可编辑
        isEdit: false,
        //列表数
        total: 1,
        total2: 1,
        total3: 1,
        total4: 1,
        exist: false,
        // 菜单选项
        typeList: [
          {
            value: 0,
            label: '数据目录'
          },
          {
            value: 1,
            label: '产品目录'
          },
          {
            value: 2,
            label: '技术服务目录'
          }
        ],


         DZZT_LIST: [
          {
            value: 2,
            label: '震源机制解'
          },
          {
            value: 3,
            label: '地震烈度'
          },
          {
            value: 4,
            label: '发震构造'
          },
          {
            value: 5,
            label: '余震序列'
          }
          ,
          {
            value: 6,
            label: '同震形变'
          }
              ,
          {
            value: 7,
            label: '地震灾害'
          }
            ,
          {
            value: 8,
            label: '应急救灾'
          }
        ],
        // 弹出层标题
        title: "新增",
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
        //显示详情页
        showInfo: false,
        // 是否显示弹出层
        open: false,
        open2: false,
        open3: false,
        open4: false,
        open5: false,
        eventId: '',
        //当前选择的事件名
        eventName: '',
        activeName: 'news',
        activeName2: 'news',
        editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            server: process.env.VUE_APP_PRODS_API + '/prodSer/uploadImage',
            fieldName: 'file'
          },
        },
      },
        // 查询参数
        queryParams4: {
          pageNum: 1,
          pageSize: 20,
        },
        // 查询参数
        queryParams3: {
          pageNum: 1,
          pageSize: 20,
        },
        // 查询参数
        queryParams2: {
          pageNum: 1,
          pageSize: 20,
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        user: {},
        postGroup: {},
        fieldId: '',
        earthId: '',
        classificationId: '',
        //专业产品数据
        spcialProForm: {
          id: 0,
          spId: 0,
          eventId: 0,
          headTitle: "",
          lat: "",
          localName: "",
          lon: '',
          m: "",
          otime: "",
          spInfo: "",
          spLd: "",
          spFzgz: "",
          spYzxl: "",
          spTzxb: "",
          spDzzh: "",
          spYjjz: "",
          spCkwx: "",
        },
        // 专业的表单参数
        form: {
          id: null,
          cname: '',
          code: '',
          dataRole: '',
          depth: '',
          flag: '',
          id: '',
          lat: '',
          localName: '',
          lon: '',
          m: '',
          ml: '',
          otime: '',
          uTime: '',
          unitId: '',
          utime: ''
        },
        windowData: {
          id: '',
          specialId: '',
          flag: '',
          begtime: '',
          endtime: '',
          orderNum: '',
          spName: ''
        },
        expData: {
          id: '',
          spId: '',
          title: '',
          url: '',
          unit: '',
          author: '',
          cTime: '',
          text: '',
          visits: ''
        },
        newsData: {
          id: '',
          spId: '',
          url: '',
          text: '',
          imgLink: '',
          visits: '',
          title: '',
          cTime: '',
          author: '',
        },
        catalogData: {
          id: '',
          spId: '',
          unit: '',
          text: '', 
          visits: '',
          title: '',
          cTime: '',
          author: '',
        },
        props: {
          value: 'bClass',
          label: 'bClass',
          children: 'sClass'
        },
        taskId: null,
        sClassification: [],
        menuOptions: [],
        menuOptions2: [],
        allEathList: [],
        deptName: null,

        // 表单校验
        rules: {
          menuName: [
            { required: true, message: "菜单名称不能为空", trigger: "blur" }
          ],
          orderNum: [
            { required: true, message: "菜单顺序不能为空", trigger: "blur" }
          ],
          path: [
            { required: true, message: "路由地址不能为空", trigger: "blur" }
          ]
        },
        rules2: {
          title: [
            { required: true, message: "标题不能为空", trigger: "blur" }
          ],
          unit: [
            { required: true, message: "发布单位不能为空", trigger: "blur" }
          ],
          showType: [
            { required: true, message: "展示形式不能为空", trigger: "blur" }
          ],
        },
        rules3: {
          title: [
            { required: true, message: "标题不能为空", trigger: "blur" }
          ],
          showType: [
            { required: true, message: "展示形式不能为空", trigger: "blur" }
          ],
        },
        rules5: {
          title: [
            { required: true, message: "标题不能为空", trigger: "blur" }
          ],
          catalog: [
            { required: true, message: "分类不能为空", trigger: "blur" }
          ],
          unit: [
            { required: true, message: "发布单位不能为空", trigger: "blur" }
          ],
           author: [
            { required: true, message: "发布人不能为空", trigger: "blur" }
          ],
           text: [
            { required: true, message: "发布内容不能为空", trigger: "blur" }
          ],
           
        },
      };
    },
    filters: {
      auditStates(val) {
        if(val == -10) return '一审驳回'
        if(val == -20) return '二审驳回'
        if(val == -30) return '三审驳回'
        if(val == 0) return '提交审核'
        if(val == 1) return '审核完成'
        if(val == -1) return '被驳回'
        if(val == 10) return '一审通过'
        if(val == 20) return '二审通过'
        if(val == 99) return '审核完成'
        if(val == 100) return '已分发'
      }
    },
    created() {
      this.getUserDept()
      this.taskId = this.$route.query.taskId
      this.getList({page:1,limit:10,taskId:this.taskId});
      //获取全部大震
      getEarthList('pageNum=1&pageSize=9999').then(res=>{
        this.allEathList = res.records
        this.allEathList = this.allEathList.filter(itm=>{return itm.auditStatus == 1})
      })
      
      // this.getPageList({
      //   page: 1,
      //   limit: 10
      // });
    },
    mounted() {
      //超级管理员
      if(this.$store.state.user.permissions[0] == '*:*:*'){
        return
      }
      if(this.$store.state.user.permissions.includes('workflow:bigEar:news')){
        this.showNews = true
      }else{
        this.showNews = false
      }
      if(this.$store.state.user.permissions.includes('workflow:bigEar:prods')){
        this.showProds = true
      }else{
        this.showProds = false
      }
      if(this.$store.state.user.permissions.includes('workflow:bigEar:Exper')){
        this.showExper = true
      }else{
        this.showExper = false
      }
      if(this.$store.state.user.permissions.includes('workflow:bigEar:window')){
        this.showWindow = true
      }else{
        this.showWindow = false
      }
    },
    methods: {
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated2(editor) {
            this.editor2 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated3(editor) {
            this.editor3 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated4(editor) {
            this.editor4 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated5(editor) {
            this.editor5 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated6(editor) {
            this.editor6 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated7(editor) {
            this.editor7 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated8(editor) {
            this.editor8 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated9(editor) {
            this.editor9 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated10(editor) {
            this.editor10 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated11(editor) {
            this.editor11 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
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
      handleUploadSuccess(e) {
        this.newsData.imgLink = e
      },

      handleUploadCatalogSuccess(e) {
        if(this.isUrl(e)){
        this.catalogData.visits = e
        }else{
           this.catalogData.visits = '';
            this.$modal.msgEror("上传封面图片失败！");
        }
      },

      isUrl(str) {
      const pattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*\\.)+[a-z]{2,}|'+ 
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
      return pattern.test(str);
    },
      handleWindowAdd() {
        this.reset()
        this.open2 = true
        this.title = '新增'
      },
      // 选择图标
      selected(name) {
        this.form.icon = name;
      },
      handleItemChange(val) {
        // console.log('active item:', val);
      },
      getUserDept() {
        getUserProfile().then((res) => {
            this.deptName = res.data.dept.deptName
        })
      },
      back() {
        this.spcialProForm = {
          id: 0,
          spId: 0,
          eventId: 0,
          headTitle: "",
          lat: "",
          localName: "",
          lon: '',
          m: "",
          otime: "",
          spInfo: "",
          spLd: "",
          spFzgz: "",
          spYzxl: "",
          spTzxb: "",
          spDzzh: "",
          spYjjz: "",
          spCkwx: "",
        }
        this.showInfo = false
      },
      getPageList2(data) {
        this.experList = []
        getZJList({
          pageNum: data.page,
          pageSize: data.limit,
          spid: this.earthId
        }).then(res=>{
          this.experList = res.records
          this.total2 = res.total2
        })
      },
      getPageList3(data) {
        this.newsList = []
        getNewList({
          spid: this.earthId
        }).then(res=>{
          this.newsList = res
        })
      },

       getProductPage(data) {
        this.productList = [] 
        getCatalogList(data).then(res=>{
          this.productList = res
        })
      },
      getPageList() {
        this.menuList = []
        getConfList().then(res=>{
          this.menuList = res
          this.menuList.forEach(item=>{
            this.allEathList.forEach(itm=>{
              if(item.specialId == itm.spId){
                item.spName = itm.headTitle
              }
            })
          })
        })
      },
      getClassificationName(data) {
        getClassification().then(res => {
         return res.filter((item)=>{
            if(item.id == data){
              return item.bClass + '/' + item.sClass
            }
          })
        })
      },
      uploadImg() {
        // 修改 uploadImage 菜单配置

      },
      openSp() {
        this.showSpList = true
      },
      openEvent(data) {
        this.showEvent = true
        getEveList({
          pageNum: data.page,
          pageSize: data.limit,
          m: 5
        }).then(res=>{
          this.loading2 = false
          this.eventList = res.records
          this.total4 = res.total
        })
      },
      /** 查询菜单列表 */
     getList(data) {
      let par = ''
      if(data.taskId){
        par = 'pageNum='+data.page+'&pageSize='+data.limit+'&taskId='+data.taskId
      }else {
        par = 'pageNum='+data.page+'&pageSize='+data.limit
      }
      getEarthList(par).then(res=>{
          this.loading = false;
          this.earList = res.records
          this.total = res.total
      })
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
      getqwList(id) {
        getQWList(id).then(res=>{
          if(res.length != 0){
            this.exist = true
            this.spcialProForm = res[0]
          }else {
            this.exist = false
          }
        })
      },
      saveSP() {
        let info = {
          id: this.spcialProForm.id,
          remark: "",
          spCkwx: this.spcialProForm.spCkwx,
          spDzzh: this.spcialProForm.spDzzh,
          spFzgz: this.spcialProForm.spFzgz,
          spId: this.earthId,
          spInfo: this.spcialProForm.spInfo,
          spLd: this.spcialProForm.spLd,
          spTzxb: this.spcialProForm.spTzxb,
          spYjjz: this.spcialProForm.spYjjz,
          spYzxl: this.spcialProForm.spYzxl
        }

          if(this.exist){
            editQW(encode(info)).then(res=>{

              this.$modal.msgSuccess("修改成功");
            })
          }else {
            //只有没有数据的条件下才会增加
            addQW(encode(info)).then(res=>{
              this.$modal.msgSuccess("新增成功");
            })
          }

      },
      tabChange(data) {
        if(data.index == 0){
          this.getList({page: 1,limit:10});
        }
        if(data.index == 1){
          this.getPageList()
        }
      },
      tabChange2(data) {
        if(data.index == 0){
          this.getPageList3()
          // this.getList({page:1,limit:10});
        }
        if(data.index == 2){
          this.getPageList2({page:1,limit:10})
        }
      },
      handleCurrentChange(row) {
        this.spcialProForm.otime = row.otime
        this.spcialProForm.m = row.m
        this.spcialProForm.lon = row.lon
        this.spcialProForm.lat = row.lat
        this.spcialProForm.localName = row.localName
        this.spcialProForm.eventId = row.id
        this.eventName = row.localName
        this.showEvent = false
      },
      handleCurrentChange2(row) {
        this.windowData.specialId = row.spId
        this.windowData.spName = row.headTitle
        this.showSpList = false
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      handleInfo(row) {
        this.eventId = row.eventId
        this.spcialProForm = row
        this.earthId = row.spId
        this.showInfo = true
        this.getqwList(this.earthId)
        this.getPageList2({page:1,limit:10})
        this.getPageList3()
        this.getProductPage(this.earthId)
      },
      handleProdsInfo(row) {
        this.open5 = true
        this.catalogData = row 
        this.title = '详情'
      },
      handleProdsUpdate(row) {
        this.open5 = true
        this.catalogData = row
        this.catalogData.spId = this.earthId
        this.title = '修改'
      },
      handleProdsDelete(row) {
          this.$modal.confirm('是否确认删除"' + row.title+'"').then(function() {
          let par = {
          id: row.id
        }
          return delCatalog(encode(par));
        }).then(() => {
          this.getProductPage(this.earthId)
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      handleExpInfo(row) {
        this.open3 = true
        this.expData = row
        if(row.text != ''){
          this.showType = '富文本'
        }else {
          this.showType = '跳转'
        }
        this.title = '详情'
      },
      handleExpUpdate(row) {
        this.open3 = true
        this.expData = row
        this.expData.spId = this.earthId
        this.title = '修改'
      },
      handleExpDelete(row) {
        this.$modal.confirm('是否确认删除"' + row.title+'"').then(function() {
          let par = {
          id: row.id
        }
          return delZJ(encode(par));
        }).then(() => {
          this.getPageList2({page:this.queryParams3.pageNum,limit:10});
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      // 表单重置
      reset() {
        // this.spcialProForm = {
        //   id: 0,
        //   spId: 0,
        //   eventId: 0,
        //   headTitle: "",
        //   lat: "",
        //   localName: "",
        //   lon:'',
        //   m: "",
        //   otime: "",
        //   spInfo: "",
        //   spLd: "",
        //   spFzgz: "",
        //   spYzxl: "",
        //   spTzxb: "",
        //   spDzzh: "",
        //   spYjjz: "",
        //   spCkwx: "",
        // };
        this.windowData= {
          id: '',
          specialId: '',
          flag: '',
          begtime: '',
          endtime: '',
          orderNum: '',
          spName: ''
        },
        this.expData = {
          id: '',
          spId: '',
          title: '',
          url: '',
          unit: '',
          author: '',
          cTime: new Date().toLocaleDateString(),
          text: '',
          visits: ''
        }
        this.newsData = {
          id: '',
          spId: '',
          url: '',
          text: '',
          imgLink: '',
          visits: '',
          title: '',
          cTime: new Date().toLocaleDateString(),
          author: '',
        }
         this.catalogData = {
          id: '',
          spId: '',
          unit: '',
          text: '', 
          visits: '',
          title: '',
          cTime: new Date().toLocaleDateString(),
          author: '',
        }
        this.fileList = []
        this.eventName = ""
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList({page: 1,limit:10});
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      getSelData() {
        let bClass = []
        let sClass = []
        let bClass2 = []
        this.menuOptions2 = []
        this.menuOptions = []
        getClassification().then(res => {
          res.map(item => {
            bClass2.push(item.bClass)
          })
          bClass2 = Array.from(new Set(bClass2))
          bClass2.forEach((itm,index) => {
            this.menuOptions2.push({
              bClass: itm
            })
          })
        })

        getField().then(res => {
          res.map(item => {
            bClass.push(item.bClass)
            sClass.push({bClass: item.sClass})
          })
          bClass = Array.from(new Set(bClass))
          bClass.forEach((itm,index) => {
            if(index == 0){
              this.menuOptions.push({
                bClass: itm,
                sClass: sClass.slice(0,7)
              })
            }
            if(index == 1){
              this.menuOptions.push({
                bClass: itm,
                sClass: sClass.slice(7,13)
              })
            }
            if(index == 2){
              this.menuOptions.push({
                bClass: itm,
                sClass: sClass.slice(13,17)
              })
            }
            if(index == 3){
              this.menuOptions.push({
                bClass: itm,
                sClass: sClass.slice(17,21)
              })
            }
            if(index == 4){
              this.menuOptions.push({
                bClass: itm,
                sClass: sClass.slice(21,27)
              })
            }
          })
        })
      },
      // 专家新增
      handleExpAdd() {
        this.reset();
        this.open3 = true;
        this.expData.spId = this.earthId
        this.title = "新增";
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset(); 
        this.open = true;
        this.title = "新增";
      },

      handleProdsAdd() {
        this.reset();
        this.open5 = true;
        this.catalogData.spId = this.earthId
        this.title = "新增";
      },
      //最新动态新增
      handleNewsAdd() {
        this.reset();
        this.open4 = true;
        this.newsData.spId = this.earthId
        this.title = "新增";
      },
      //最新动态修改
      handleNewsUpdate(row) {
        this.open4 = true;
        this.newsData = row
        this.newsData.spId = this.earthId
        if(row.text != ''){
          this.showType = '富文本'
        }else {
          this.showType = '跳转'
        }
        this.title = "修改";
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      //最新动态详情
      handleNewInfo(row) {
        this.newsData = row
        this.open4 = true
        this.title = '详情'
        if(row.text != ''){
          this.showType = '富文本'
        }else {
          this.showType = '跳转'
        }
      },
      //最新动态删除
      handleNewDel(row) {
        this.$modal.confirm('是否确认删除"' + row.title+'"').then(function() {
          let par = {
          id: row.id
        }
          return delNew(encode(par));
        }).then(() => {
          this.getPageList3();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      handleWinInfo(row) {
        this.windowData = row
        this.open2 = true
        this.title = '详情'
      },
      handleWinUpdate(row) {
        this.windowData = row
        this.open2 = true
        this.title = '修改'
      },
      handleWinDelete(row) {
        this.$modal.confirm('是否确认删除"' + row.spName+'"').then(function() {
          let par = {
          id: row.id
        }
          return delConfList(encode(par));
        }).then(() => {
          this.getPageList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.open = true;
        this.title = "修改";
        this.spcialProForm = row
        this.eventName = this.spcialProForm.localName

      },
      // 飘窗提交
      submitWinForm() {
        let form = {}
        if (this.title == "修改") {
          editConfList(encode(this.windowData)).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open2 = false;
              this.getPageList();
            });
          } else {
            addConfList(encode(this.windowData)).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open2 = false;
              this.getPageList();
            })
          }
      },
      submitExpForm() {
        let form = {}
        if (this.title == "修改") {
          editZJ(encode(this.expData)).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open3 = false;
              this.getPageList2({page:1,limit:10});
            });
          } else {
            addZJ(encode(this.expData)).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open3 = false;
              this.getPageList2({page:1,limit:10});
            })
          }
      },
      submitNewsForm() {
        let form = {}
        if (this.title == "修改") {
          editNew(encode(this.newsData)).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open4 = false;
              this.getPageList3();
            });
          } else {
            addNew(encode(this.newsData)).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open4 = false;
              this.getPageList3();
            })
          }
      },
      submitCatalogForm() {
        let form = {}
        if (this.title == "修改") {
          editCatalog(encode(this.catalogData)).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open5 = false;
              this.getProductPage(this.earthId);
            });
          } else {
            addCatalog(encode(this.catalogData)).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open5 = false;
              this.getProductPage(this.earthId);
            })
          }
      },
      /** 提交按钮 */
      submitForm: function() {
        let form = {}
        if (this.title == "修改") {
          form = {
            headTitle: this.spcialProForm.headTitle,
            bmId: this.spcialProForm.eventId,
            createBy: this.$store.state.user.name,
            createTime: new Date().toLocaleString(),
            id: this.spcialProForm.spId
          }
            earthEdit(encode(form)).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList({page: 1,limit:10});
            });
          } else {
            form = {
              headTitle: this.spcialProForm.headTitle,
              bmId: this.spcialProForm.eventId,
              createBy: this.$store.state.user.name,
              createTime: new Date().toLocaleString()
            }
            let par = {
              title: this.spcialProForm.headTitle,
              disciplineKey: '大震专题',
              creator: this.$store.state.user.name,
              unitName: this.deptName
            }
            quickAdd(par).then(res=>{
              form.auditTaskId = res
              earthAdd(encode(form)).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList({page: 1,limit:10});
              });
            })
          }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm('是否确认删除' + row.headTitle).then(function() {
          let par = {
          id: row.spId
        }
          return earthDel(encode(par));
        }).then(() => {
          this.getList({page: this.queryParams.pageNum,limit:10});
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    }
  };
  </script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
.text img{
  width: 800px;
}
</style>
  