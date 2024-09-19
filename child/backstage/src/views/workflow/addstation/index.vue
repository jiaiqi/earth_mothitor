<template>
  <div class="app-container">
      <!-- 添加或修改台网数据对话框 -->
      <el-dialog :title="title" :visible.sync="open2" width="500px" append-to-body>
        <el-form
          ref="networkForm"
          :model="networkForm"
          :rules="rules2"
          label-width="100px"
        >
          <el-form-item label="序号" prop="sortNum">
            <el-input
              v-model="networkForm.sortNum"
              placeholder="请输入序号"
            />
          </el-form-item>
          <el-form-item label="台网编号" prop="netCode">
            <el-input
              v-model="networkForm.netCode"
              placeholder="请输入台网编号(只能为大写英文)"
              maxlength="2"
            />
          </el-form-item>
          <el-form-item label="台网名称" prop="netName">
            <el-input
              v-model="networkForm.netName"
              placeholder="请输入台网名称"
            />
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm(1)">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="台网列表" name="netWork" 
      v-if="showNetwork">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:seismometry:station:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(1)"
        >
          新增数据
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:seismometry:network:delete']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >
          删除
        </el-button>
      </el-col> -->
      <right-toolbar @queryTable="refresh(1)" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="companyLists"
      height="540"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="120" prop="sortNum" />
      <el-table-column label="台网编号" prop="netCode" />
      <el-table-column label="台网名称" prop="netName" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-if="scope.row.roleId !== 1" slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleClick(scope.row.netCode)"
          >
            查看
          </el-button>
          <el-button
            v-hasPermi="['upLoad:seismometry:network:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,1)"
          >
            修改
          </el-button>
          <el-button
            v-hasPermi="['upLoad:seismometry:network:delete']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row,1)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination style="height:56px" v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="filterNet" />
    </el-tab-pane>
    <!-- 添加或修改台站数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <div v-if="title !== '修改台站信息'" style="padding: 15px">
        <el-radio v-model="upradio" label="1">填写数据</el-radio>
        <el-radio v-model="upradio" label="2">上传文件</el-radio>
      </div>
      <el-form
        v-if="upradio === '1'"
        ref="stationForm"
        :model="stationForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="台站代码" prop="staCode">
          <el-input
            v-model="stationForm.staCode"
            placeholder="请输入台站代码(只能为大写英文)"
            maxlength="10"
          />
        </el-form-item>
        <el-form-item label="台站名称" prop="staName">
          <el-input
            v-model="stationForm.staName"
            placeholder="请输入台站名称"
          />
        </el-form-item>
        <el-form-item label="台站描述" prop="staDescribe">
          <el-input
            v-model="stationForm.staDescribe"
            type="textarea"
            placeholder="请输入台站描述"
          />
        </el-form-item>
        <el-form-item label="台站纬度" prop="staLat">
          <el-input
            v-model="stationForm.staLat"
            type="Number"
            placeholder="请输入台站纬度"
          />
        </el-form-item>
        <el-form-item label="台站经度" prop="staLon">
          <el-input
            v-model="stationForm.staLon"
            type="Number"
            placeholder="请输入台站经度"
          />
        </el-form-item>
        <el-form-item label="台站高程" prop="staHeight">
          <el-input
            v-model="stationForm.staHeight"
            placeholder="请输入台站高程"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="stationForm.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div
        v-if="title !== '修改台站信息'"
        class="upload"
        style="padding: 0 40px"
      >
        <el-upload
          v-if="upradio === '2'"
          ref="upload"
          class="upload-demo"
          drag
          :action="action"
          :headers="headers"
          :limit="1"
          :file-list="fileList"
          :multiple="false"
          :auto-upload="false"
          :disabled="isUploading"
          :on-error="handleUploadError"
          :on-progress="handleFileUploadProgress"
          :on-exceed="handleExceed"
          :on-success="handleUploadSuccess"
          accept=".xls,.xlsx"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传XLS/XLSX文件</div>
        </el-upload>
        <p
          class="uploadText"
          style="color: red; max-height: 100px; overflow: hidden"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="upradio === '1'" type="primary" @click="submitForm(2)">
          确 定
        </el-button>
        <el-button v-if="upradio === '2'" type="primary" @click="submitLoad">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-tab-pane label="台站列表" name="station" v-if="showStation">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="台站名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入台站名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getPageList({page:1,limit:10})">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:seismometry:station:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(2)"
        >
          新增数据
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:seismometry:station:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(3)"
        >
          批量新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini" type="warning" @click="modelExcel">台站模板下载</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:seismometry:station:delete']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >
          删除
        </el-button>
      </el-col> -->
      <right-toolbar @queryTable="refresh(2)" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      height="600"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="台网" prop="netName" />
      <el-table-column label="台站编码" prop="staCode" />
      <el-table-column label="台站名称" prop="staName" />
      <el-table-column label="纬度(°)" prop="lat" />
      <el-table-column label="经度(°)" prop="lon" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-if="scope.row.roleId !== 1" slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            v-if="showStationData"
            @click="handleCheck(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-hasPermi="['upLoad:seismometry:station:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,2)"
          >
            修改
          </el-button>
          <el-button
            v-hasPermi="['upLoad:seismometry:station:delete']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDel(scope.row)"
          >
            删除
          </el-button>
          <el-button
            v-hasPermi="['upLoad:seismometry:station:delete']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete2(scope.row)"
          >
            清除数据
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination style="height:56px" v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getPageList" />
    <!-- 清除测震数据 -->
    <el-dialog :title="title" :visible.sync="open3" width="500px" append-to-body>
      <div>
        <el-date-picker
          v-model="dataRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDelete(delRow,2)">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改台站数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <!-- <div v-if="title !== '修改台站信息'" style="padding: 15px">
        <el-radio v-model="upradio" label="1">填写数据</el-radio>
        <el-radio v-model="upradio" label="2">上传文件</el-radio>
      </div> -->

      <el-form
        ref="stationForm"
        :model="stationForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="台站代码" prop="staCode">
          <el-input
            v-model="stationForm.staCode"
            placeholder="请输入台站代码(只能为大写英文)"
            maxlength="10"
            :disabled="title == '详情'"
            onkeyup="this.value=this.value.replace(/[^A-Z]/g,'')"
          />
        </el-form-item>
        <el-form-item label="台站名称" prop="staName">
          <el-input
            v-model="stationForm.staName"
            placeholder="请输入台站名称"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="台站描述" prop="staDescribe">
          <el-input
            v-model="stationForm.describe"
            type="textarea"
            placeholder="请输入台站描述"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="站网代码" prop="netCode">
          <el-input
            v-model="stationForm.netCode"
            placeholder="请输入站网代码"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="站网名称" prop="netName">
          <el-input
            v-model="stationForm.netName"
            placeholder="请输入站网名称"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="台站纬度" prop="lat">
          <el-input
            v-model="stationForm.lat"
            type="Number"
            placeholder="请输入台站纬度"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="台站经度" prop="lon">
          <el-input
            v-model="stationForm.lon"
            type="Number"
            placeholder="请输入台站经度"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="台站高程" prop="staHeight">
          <el-input
            v-model="stationForm.height"
            placeholder="请输入台站高程"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="台基类型" prop="staType">
          <el-input
            v-model="stationForm.staType"
            placeholder="请输入台基类型"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="建站时间" prop="cTime">
          <el-date-picker
            v-model="stationForm.cTime"
            type="datetime"
            :disabled="title == '详情'"
            placeholder="选择建站时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="台站级别" prop="staLevel">
          <el-input
            v-model="stationForm.staLevel"
            :disabled="title == '详情'"
            placeholder="请输入台站级别"
          />
        </el-form-item>
        <el-form-item label="观测环境" prop="staArchitecture">
          <el-input
            v-model="stationForm.staArchitecture"
            placeholder="请输入观测环境"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="噪声级别" prop="noiseLevel">
          <el-input
            v-model="stationForm.noiseLevel"
            placeholder="请输入噪声级别"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="井深" prop="depth">
          <el-input
            v-model="stationForm.depth"
            placeholder="请输入井深"
            :disabled="title == '详情'"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="stationForm.remark"
            type="textarea"
            placeholder="请输入内容"
            :disabled="title == '详情'"
          />
        </el-form-item>
      </el-form>
      <!-- <div
        v-if="title !== '修改台站信息'"
        class="upload"
        style="padding: 0 40px"
      >
        <el-upload
          v-if="upradio === '2'"
          ref="upload"
          class="upload-demo"
          drag
          :action="action"
          :headers="headers"
          :limit="1"
          :file-list="fileList"
          :multiple="false"
          :auto-upload="false"
          :disabled="isUploading"
          :on-error="handleUploadError"
          :on-progress="handleFileUploadProgress"
          :on-exceed="handleExceed"
          :on-success="handleUploadSuccess"
          accept=".xls,.xlsx"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传XLS/XLSX文件</div>
        </el-upload>
        <p
          class="uploadText"
          style="color: red; max-height: 100px; overflow: hidden"
        />
      </div> -->
      <div v-if="title != '详情'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm(2)">
          确 定
        </el-button>
        <el-button v-if="upradio === '2'" type="primary" @click="submitLoad">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
      <!-- 添加或修改台站数据对话框 -->
      <el-dialog :title="title" :visible.sync="open4" width="700px" append-to-body>
        <div
          class="upload"
          style="padding: 0 40px"
        >
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :action="action2"
            :headers="headers"
            :limit="1"
            :file-list="fileList2"
            :multiple="false"
            :auto-upload="false"
            :on-progress="handleFileUploadProgress"
            :on-exceed="handleExceed"
            :on-success="handleUploadSuccess2"
            accept=".xls,.xlsx"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传XLS/XLSX文件；<b>且同个台站名字无需重复，只需填写一个</b></div>
          </el-upload>
          <p
            class="uploadText"
            style="color: red; max-height: 100px; overflow: hidden"
          />
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitImp">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import {
  getCompany,
  getCompanyList,
  getCompanyList2,
  getStation,
  addStation,
  delStation,
  updataStation,
  getStationData,
  addNetWork,
  updataNetWork,
  delNetWork,
  getNetPageList,
  delByStaId
} from '@/api/workflow/selsmometry.js'
import { getUserProfile } from "@/api/system/user"
import { getToken } from '@/utils/auth'
import { encode, decode } from '@/utils/base/dataEncry.js'
export default {
  name: 'AddStation',
  components: {},
  data() {
    return {
      // 上报单位
      companys: [],
      // 台网
      companyLists: [],
      // 当前台网id
      netId: undefined,
      // 查询台站参数
      networkOption: {
        netId: 1
      },
      // 查询参数
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
      },
      open3: false,
      open4: false,
      dataRange: '',
      fileList: [],
      fileList2: [],
      uploadUrl: process.env.VUE_APP_SEIS_API + '/auditserver/seismometry/upload',
      // 遮罩层
      loading: true,
      // 上传台站方式
      upradio: '',
      // 上传格式
      upradioType: '',
      // 文件上传地址
      action: process.env.VUE_APP_SEIS_API + '/station/importstationdata',
      action2: 'http://user.earthquake.ac.cn' + '/seisserver/station/pStation/importExcel',
      //选项卡变量
      activeName: 'netWork',
      //台站数据列表
      stationData: [],
      //显示台网维护
      showNetwork: true,
      //显示台站维护
      showStation: true,
      //显示台站数据
      showStationData: true,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      isUploading: true,
      //当前查看的台网id
      nowId: null,
      fileList: [],
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
      // 台站表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      open2: false,
      // 返回提示
      text: '',
      delRow: null,
      // 查询参数
      queryParams: {
        name: '',
        company: null,
        companyList: null
      },
      nowNetName: '',
      //选择的台站名称
      selStaName: '',
      // 表单参数
      stationForm: {
        id: null,
        netCode: null,
        netName: null,
        staLevel: null,
        staCode: null,
        staName: null,
        staType: null,
        cTime: null,
        noiseLevel: null,
        staDescribe: null,
        lat: null,
        lon: null,
        height: null,
        depth: null,
        staArchitecture: null,
        remark: null,
        describe: null,
      },
      // 台网表单参数
      networkForm: {
        id: null,
        netCode: null,
        netName: null,
        sortNum: null
      },
      // 表单校验
      rules: {
        staCode: [
          { required: true, message: '台站代码不能为空', trigger: 'blur' }
        ],
        staName: [
          { required: true, message: '台站名称不能为空', trigger: 'blur' }
        ],
        lat: [
          { required: true, message: '台站纬度不能为空', trigger: 'blur' }
        ],
        lon: [
          { required: true, message: '台站经度不能为空', trigger: 'blur' }
        ],
        netCode: [
          { required: true, message: '台网代码不能为空', trigger: 'blur' }
        ],
        netName: [
          { required: true, message: '台网名称不能为空', trigger: 'blur' }
        ]
      },
      // 表单校验
      rules2: {
        netCode: [
          { required: true, message: '台网代码不能为空', trigger: 'blur' }
        ],
        netName: [
          { required: true, message: '台网名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },

  watch: {},
  created() {
    this.filterNet()
    // console.log(this.$store.state.user)
    //超级管理员
    if(this.$store.state.user.permissions[0] == '*:*:*'){
      return
    }

    if(!this.$store.state.user.permissions.includes('upLoad:seismometry:network')){
      this.showNetwork = false
    }
    if(!this.$store.state.user.permissions.includes('upLoad:seismometry:station')){
      this.showStation = false
    }
    if(!this.$store.state.user.permissions.includes('upLoad:seismometry:stationData')){
      this.showStationData = false
    }
  },
  methods: {
    /** 查询上报单位 */
    getList() {
      // this.loading = true
      let data = encode({})
      getCompany(data)
        .then((res) => {
          this.companys = decode(res)
        })
        .catch(() => {})
    },
    //根据用户所在单位过滤台网
    filterNet(data) {
      let net = ''
      let netList = []
      let info = null
        info = {
          pageNum: 1,
          pageSize: 10,
        }
        if(data){
         info = {
            pageNum: data.page,
            pageSize: data.limit,
          }
        }
        this.loading = true
        getNetPageList(info).then((res) => {
          netList = res.records
          this.total = res.total
          getUserProfile().then((res) => {
            net = res.data.dept.deptName.substring(0,2)
            this.nowNetName = net
            //非超管按省局看
            if(!this.$store.state.user.permissions[0] == '*:*:*'){
              netList = netList.filter((item) => {
                return item.netName === net
              })
            }
            this.companyLists = netList
            this.loading = false
          })
        })
    },
    //获取台网
    changeCompany(e) {
      let datas = encode({unitId: 1 })
      getCompanyList(datas).then((res) => {
        this.companyLists = decode(res)
      })
    },
    handleCheck(data) {
      this.stationForm = data
      this.stationForm.cTime = new Date(this.stationForm.cTime).toLocaleDateString()
      this.title = '详情'
      this.open = true
      // this.loading = true
      // console.log(data)
      // let par = {
      //   staId: data.id,
      //   netId: data.netId
      // }
      // getStationData(encode(par)).then((res) => {
      //   this.loading = false
      //   this.stationData = decode(res)
      //   console.log(decode(res))
      //   this.activeName = 'stationData'
      //   this.selStaName = data.staName
      // })
    },
    handleUploadData() {

    },
    resetQuery(){
      this.queryParams.name = ''
      this.networkOption.staName = ''
      this.getPageList({page:1,limit:10})
    },
    getPageList(page){
      this.loading = true
      this.networkOption.netId = this.companyLists[0].id
      if(this.queryParams.name != ''){
        this.networkOption.staName = this.queryParams.name
      }
      this.nowId = this.companyLists[0].id  //当前查看的台站id
      this.networkOption = Object.assign({},this.networkOption,{pageNum: page.page,pageSize:page.limit})
      if(!this.networkOption.netId){
        delete(this.networkOption.netId)
      }
      let datas = encode(this.networkOption)
      //如果是管理员的话，查询所有台站
      // if(this.$store.state.user.name == "admin"){
      //   delete(this.networkOption.netId)
      //   datas = encode(this.networkOption)
      //   this.nowId = null
      // }
      getStation(datas)
      .then((res) => {
        let arr = decode(res).records
        this.total = decode(res).total
        arr.forEach(item=>{
          this.companyLists.forEach(itm=>{
            if(item.netId == itm.id){
              item.netName = itm.netName
            }
          })
        })
        this.roleList = arr
        this.loading = false
      })
      .catch((ree) => {
        this.$message.error('获取数据失败')
      })
    },
    // 选中台网 获取台站
    handleClick(e) {
      if(e.name){ //选项卡切换判断
        if(e.name == 'station'){    //切换到台站列表选项卡
          this.getPageList({page:1,limit:10})
        }else{
          setTimeout(() => {
            this.loading = false
          }, 1000);
        }
      }else{  //根据id台站列表加载
        this.nowId = e
        let par = {
          netCode: e,
          pageNum: 1,
          pageSize: 10
        }
        getStation(encode(par))
        .then((res) => {
          let arr = decode(res).records
          arr.forEach(item=>{
            this.companyLists.forEach(itm=>{
              if(item.netId == itm.id){
                item.netName = itm.netName
              }
            })
          })
          this.networkOption.netCode = decode(res).records[0].netCode
          this.roleList = arr
          this.total = decode(res).total
          this.loading = false
          this.activeName = 'station'
        })
        .catch((ree) => {
          this.$message.error('获取数据失败')
        })
      }
    },
    // 刷新
    refresh(type) {
      if(type == 1){
        this.filterNet()
      }
      if(type == 2){
        if(this.nowId){
          this.handleClick(this.nowId)
        }else {
          getStation({})
            .then((res) => {
              let arr = decode(res)
              this.roleList = arr
              this.loading = false
            })
            .catch((ree) => {
              this.$message.error('获取数据失败')
            })
        }
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.open2 = false
      this.open3 = false
      this.open4 = false
      this.reset()
    },
    // 文件个数超出
    handleExceed() {

    },
    //模板下载
    modelExcel() {
      window.open('http://www.earthquake.ac.cn/prodSer/downloadImage/?filename=测震模版-江苏(1)_1698656531287.xlsx')
    },
    // 上传失败
    handleUploadError(err) {
      this.$message.error('上传失败, 请重试')
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      let p = document.querySelector('.uploadText')
      p.innerHTML = ''
      // this.isUploading = true
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.$message.success('上传成功')
        this.isUploading = false
        this.fileList.push({ name: file.name, uid: res.uid })
      } else {
        this.$message.error('上传失败, 请重试')
        this.fileList = []
        let p = document.querySelector('.uploadText')
        p.innerHTML = res.replace(/null/g, '数据为空')
        // this.text = res
      }
    },
    // 上传成功回调
    handleUploadSuccess2(res, file) {
      if (res == '添加成功') {
        this.$message.success('上传成功')
        this.open4 = false
        this.fileList2 = []
      } else {
        if(res.code == '500'){
          this.$message.error(res.msg)
        }else{
          this.$message.error('上传失败, 请重试')
        }
        this.fileList2 = []
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 重置表单
    reset() {
      this.stationForm = {
        id: null,
        netCode: null,
        netName: null,
        staLevel: null,
        staCode: null,
        staName: null,
        staType: null,
        cTime: null,
        noiseLevel: null,
        staDescribe: null,
        lat: null,
        lon: null,
        height: null,
        depth: null,
        staArchitecture: null,
        remark: null,
        describe: null,
      }
      this.networkForm = {
        id: null,
        netCode: null,
        netName: null,
        sortNum: null
      }
    },
    handleExceed(files, fileList) {
      // console.log(files,fileList)
    },
    /** 新增按钮操作 */
    handleAdd(type) {
      this.reset()
      this.title = '新增数据'
      if(type == '1'){
        this.open2 = true
      }
      if(type == '2'){
        if(!this.nowId){
          this.$message.error('请选择一个台网点击“查看”后再新增')
          return
        }
        this.open = true
      }
      if(type == '3'){
        this.open4 = true
      }
    },
    submitImp() {
      this.open4 = false
      this.$refs.upload.submit()
    },
    /** 修改按钮操作 */
    handleUpdate(row,index) {
      if(index == 1){
        this.networkForm = {
          id: row.id,
          netCode: row.netCode,
          netName: row.netName,
          sortNum: row.sortNum,
        }
        this.open2 = true
        this.title = '修改台网信息'
      }else {
        this.stationForm = {
          id: row.id,
          staCode: row.staCode,
          staName: row.staName,
          staDescribe: row.staDescribe,
          staHeight: row.staHeight,
          remark: row.remark,
          netCode: row.netCode,
          netName: row.netName,
          staLevel: row.staLevel,
          staType: row.staType,
          cTime: new Date(row.cTime).toLocaleDateString(),
          noiseLevel: row.noiseLevel,
          lat: row.lat,
          lon: row.lon,
          height: row.height,
          depth: row.depth,
          staArchitecture: row.staArchitecture,
          describe: row.describe,
        }
        this.open = true
        this.title = '修改台站信息'
      }
    },

    /** 提交按钮 */
    submitForm(type) {
      if(type == 1){
        this.$refs['networkForm'].validate((valid) => {
        if (valid) {
          if (this.title !== '新增数据') {
            updataNetWork(encode(this.networkForm)).then((res) => {
              this.$modal.msgSuccess('修改成功')
              this.open2 = false
              this.filterNet()
              // this.handleNodeClick(this.networkForm.id)
            })
          } else {
            let addForm = {
              netCode: this.networkForm.netCode,
              netName: this.networkForm.netName,
              sortNum: this.networkForm.sortNum,
            }
            addNetWork(encode(addForm)).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open2 = false
              this.filterNet()
              // this.handleNodeClick(this.networkForm.id)
              this.reset()
            })
          }
        }
      })
      }else {
      this.$refs['stationForm'].validate((valid) => {
        if (valid) {
          if (this.title !== '新增数据') {
            updataStation(encode(this.stationForm)).then((res) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getPageList({page:1,limit:10})
            })
          } else {
            this.stationForm.netId = this.nowId
            addStation(encode(this.stationForm)).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getPageList({page:1,limit:10})
              this.reset()
            })
          }
        }
      })
    }
    },
    submitLoad() {
      this.$refs.upload.submit()
    },
    handleDelete2(row) {
      this.delRow = {...row}
      this.open3 = true
    },
    /** 删除按钮操作 */
    handleDel(row) {
        let name = row.staName
        let id = row.id
        this.$modal
          .confirm('是否确认删除名为"' + name + '"的台站吗？')
          .then(() => {
            return delStation(encode({ id: id }))
          })
          .then(() => {
            this.refresh(1)
            this.getPageList({page:1,limit:10})
            this.$modal.msgSuccess('删除成功')
          })
          .catch(() => {})
    },
    /** 删除按钮操作 */
    handleDelete(row,type) {
      if(type == 1){
        let name = row.netName
        let id = row.id
        this.$modal
          .confirm('是否确认删除名为"' + name + '"的台网吗？')
          .then(() => {
            return delNetWork(encode({ id: id }))
          })
          .then(() => {
            this.refresh(1)
            this.$modal.msgSuccess('删除成功')
          })
          .catch(() => {})
      }else{
        this.open3 = false
        const self = this
        let name = row.staName
        let id = row.id
        let year = new Date(this.dataRange[0]).getFullYear()
        let month = (new Date(this.dataRange[0]).getMonth() + 1) >=10 ? (new Date(this.dataRange[0]).getMonth() + 1) : '0'+(new Date(this.dataRange[0]).getMonth() + 1)
        let day = new Date(this.dataRange[0]).getDate() >=10 ? new Date(this.dataRange[0]).getDate() : '0'+new Date(this.dataRange[0]).getDate()
        let year2 = new Date(this.dataRange[1]).getFullYear()
        let month2 = (new Date(this.dataRange[1]).getMonth() + 1) >=10 ? (new Date(this.dataRange[1]).getMonth() + 1) : '0'+(new Date(this.dataRange[1]).getMonth() + 1)
        let day2 = new Date(this.dataRange[1]).getDate() >=10 ? new Date(this.dataRange[1]).getDate() : '0'+new Date(this.dataRange[1]).getDate()
        let data = year.toString()+month+day +'-'+ year2.toString()+month2+day2
        let par = 'stald='+id+'&beginEndTime='+data
        
        this.$modal
          .confirm('是否确认清除名为"' + name + '"的台站下的数据？')
          .then(() => {
            self.confirmDel(name,par)
          })
          .catch(() => {})
      }

    },
    confirmDel(name,par) {
      const self = this
      this.$prompt('请重新输入并确认要删除的台站名：', '删除数据确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if(value == name){
          delByStaId(par).then(() => {
            self.getPageList({page:1,limit:10})
            self.$modal.msgSuccess('清除数据成功')
          })
        }else{
          self.$modal.msgError('输入台站名有误')
        }
      }).catch(() => {
   
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.el-transfer {
  display: flex;
  .el-transfer__buttons {
    padding: 0 10px !important;
  }
}
.el-button + .el-button {
  margin-left: 0 !important;
}
</style>
