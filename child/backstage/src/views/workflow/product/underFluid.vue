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
            v-loading.fullscreen.lock="loading2"
            v-hasPermi="['workflow:product:underFluid:add']"
          >新增</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="uploadData"
            v-loading.fullscreen.lock="loading2"
            v-hasPermi="['workflow:product:underFluid:add']"
          >批量上传</el-button>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="warning" @click="modelExcel">上传模板下载</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getPageList({page: 1,limit: 20})"></right-toolbar>
      </el-row>
  
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
      >
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
          </template>
        </el-table-column> -->
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
              v-hasPermi="['workflow:product:underFluid:add']"
            >{{ scope.row.auditState == 0 ? '上传附件':'附件' }}</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row)"
              v-hasPermi="['workflow:product:underFluid']"
            >详情</el-button>
            <el-button
              style="color: #F56C6C;"
              size="mini"
              type="text"
              icon="el-icon-document-checked"
              @click="sentAudit(scope.row)"
              v-if="scope.row.auditState == 0"
              v-hasPermi="['workflow:product:underFluid']"
            >提交审核</el-button>
            <el-button
                v-if="scope.row.auditState != 0"
                size="mini"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
                v-hasPermi="['workflow:product:underFluid']"
            >审核记录</el-button>
            <el-button 
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-if="scope.row.auditState == 0"
              v-hasPermi="['workflow:product:underFluid:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
               v-if="scope.row.auditState <= 0"
              @click="handleDelete(scope.row)"
              v-hasPermi="['workflow:product:underFluid:del']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
              @pagination="getPageList" />
        <el-dialog title="模板下载" :visible.sync="open6" @close="open6 = false" width="1000px" append-to-body>
          <div>
            <div>
              <el-alert
                title="注：上传数据时，需要把表格第一行黄底内容的提示信息删除"
                type="warning">
              </el-alert>
            </div>
            <el-table
            :data="model"
          >
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="url" label="链接">
              <template slot-scope="scope">
                <a :href="scope.row.url" style="color:rgb(0, 102, 255)">{{ scope.row.url }}</a>
              </template>
            </el-table-column>
            </el-table>
          </div>
        </el-dialog>
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
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="delFiles(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
            </el-col>
            <el-col>
              <el-upload
                v-if="form2.auditState == 0"
                class="upload"
                drag
                :limit="3"
                :file-list="fileList"
                :action="action"
                :on-success="handleUploadSuccess"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
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
      <!-- 添加或修改菜单对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="目录名称" prop="directoryName">
                <el-input v-model="form.directoryName" placeholder="请输入目录名称" />
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
      <el-dialog :title="title" :visible.sync="open2" width="900px" append-to-body>
      <el-form :model="form" :rules="rules2">
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
                :headers="headers"
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
      ufUpload, ufEditAuditState, ufDel, ufEdit, dictionaryList, auditLogList } from "@/api/workflow/prods";
    import Treeselect from "@riophae/vue-treeselect";
    import { Loading } from 'element-ui';
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    import { getUserProfile } from "@/api/system/user"
    import IconSelect from "@/components/IconSelect";
    import { getToken } from '@/utils/auth'
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
          // 显示搜索条件
          showSearch: true,
          user: null,
          headers: {
            Authorization: 'Bearer ' + getToken()
          },
          //模板
          model:[
            {
              name: '产品模版-地下流体',
              url: 'http://www.earthquake.ac.cn/prodSer/downloadImage/?filename=产品模版-地下流体_1692568858119_1693993951885.xlsx',
            }
          ],
          open2: false,
          open3: false,
          open6: false,
          // 菜单表格树数据
          menuList: [],
          //是否可编辑
          isEdit: false,
          typeId: null,
          //列表数
          total: 1,
          // 是否禁用
          isUploading: false,
          loading2: false,
          loading3: false,
          open5: false,
          // 弹出层标题
          title: "新增",
          // 是否显示弹出层
          open: false,
          // 是否展开，默认全部折叠
          isExpandAll: false,
          // 重新渲染表格状态
          refreshTable: true,
          // 上传文件列表
          fileList: [],
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
            institution: ''
          },
          hisRecord:[],
          isAdmin: false,
          // 表单参数
          form: {
            directoryName: '地下流体'
          },
          form2: {
          },
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
        this.getDictId()
        this.getUserId()
        //超级管理员
        if(this.$store.state.user.permissions[0] == '*:*:*' || this.$store.state.user.roles.includes('platform_admin')){
          this.isAdmin = true
        }
        this.getPageList({
          page: 1,
          limit: 20,
        });
      },
      methods: {
          onCreated(editor) {
                this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
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
      //获取当前登录用户所在单位
      getUserId(){
        const self = this
        getUserProfile().then(resp=>{
          self.user = resp.data
        })
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
        getPageList(data) {
          this.menuList = []
          this.loading = true
          let info = {
            pageNum: data.page,
            pageSize: data.limit,
            productName: this.queryParams.name,
            providerUnit: this.queryParams.institution,
            uploader: this.$store.state.user.name
          }
          if(this.queryParams.name == ''){
            delete(info.productName)
          }
          if(this.queryParams.institution == ''){
            delete(info.providerUnit)
          }
          //管理员查看所有用户
          if(this.isAdmin) {
            delete(info.uploader)
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
        handleUpload(row) {
          this.form2 = {...row}
          this.loading2 = true
          this.loadFileList(row)
          this.title = '附件上传'
          this.open3 = true
        },
        onProgress() {
          this.loading3 = Loading.service({
              lock: true,
              text: '数据上传中，请稍等...',
              spinner: 'el-icon-loading',
              background: 'rgba(255, 255, 255, 0.9)'
            });
        },
        getDictId() {
          dictionaryList(encode({productName: '地下流体'})).then(res=>{
            let data = decode(res)
            this.typeId = data[0].id
          })
        },
        //数据上传
        uploadData() {
          this.action2 = process.env.VUE_APP_PRODS_API + '/prodSer/uf/upload?uploader='+this.user.userName+'&unitName='+this.user.dept.deptName+'&unitId='+this.user.dept.deptId
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
        modelExcel() {
          this.open6 = true
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
            // console.log(decode(res))
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
            this.loadFileList(this.form2)
          } else {
            this.$message.error('上传失败, 请重试')
          }
        })
  
      },
      handleUploadSuccess2(e,f){
        if(e=='解析成功'){
          this.$modal.msgSuccess("解析成功");
        }else{
          this.$message.error('上传失败, 请重试')
        }
          this.getPageList({
            page: 1,
            limit: 20,
          });
          this.open2 = false
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
        handleInfo(row) {
        //   console.log(JSON.stringify(row))
          this.title = "详情";
          this.isEdit = false
          let par = {
            id: row.id
          }
          this.form = row
          this.open = true;
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
          this.getPageList({
            page: 1,
            limit: 20,
          });
        },
        /** 重置按钮操作 */
        resetQuery() {
          this.queryParams = {
            name: '',
            institution: ''
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
              this.form.uploader = this.user.userName
              this.form.unitName = this.user.dept.deptName
              this.form.unitId = this.user.dept.deptId
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
              page: this.queryParams2.pageNum,
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
    