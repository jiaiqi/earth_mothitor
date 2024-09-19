<template>
  <div class="app-container">
      <!-- 添加或修改台网数据对话框 -->
      <el-col :span="2">
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :headers="headers"
          multiple
          :limit="10"
          :on-progress="onProgress"
          :on-success="onSuccess"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-col>
      <el-col :span="2">
        <el-button size="small" type="warning" @click="modelExcel">上传模板下载</el-button>
      </el-col>
      <el-col :span="10" style="margin-bottom:5px">
        <el-alert
          title="请下载最新数据目录模板上传数据目录"
          show-icon
          type="warning">
        </el-alert>
      </el-col>
      <div>
        <el-table
          v-loading="loading"
          :data="infoData"
          stripe
        >
          <el-table-column prop="realName" width="300" label="文件名" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <a style="color: #409EFF" :href="scope.row.url" target="_blank">
                  {{ scope.row.realName }}
              </a>
          </template>
          </el-table-column>
          <el-table-column prop="uploader" width="150" label="上传人" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="uploadDepartment" label="上传单位" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div>
                  {{ new Date(scope.row.uploadTime).toLocaleString() }}
                </div>
              </template>
            </el-table-column>
          <el-table-column prop="status" width="120" label="状态" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <div :style="{ color: scope.row.status == 1 ?'#67C23A': '#606266' }">{{ scope.row.status == 1 ? '已解析' : '未解析' }}</div>
              </template>
          </el-table-column>
          <el-table-column prop="auditState" width="120" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tag :type="scope.row.auditState >= 99? 'success' : scope.row.auditState < 0 ?'danger': 
              (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                style="font-weight:bold">
                {{ scope.row.auditState | auditStates }}
              </el-tag>
          </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-dropdown
            @visible-change="handleCommand(scope.row)">
              <span style="font-size: 14px;padding: 0px 3px;" 
              class="el-dropdown-link">
                解析<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button 
                    style="font-size: 14px;padding: 0px 3px;"
                    size="small"
                    type="text"
                    icon="el-icon-thumb"
                    v-if="isExtend"
                    @click="toExpandExcel(scope.row)"
                    v-hasPermi="['upLoad:prevention:expand']"
                  >解析文件</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    style="font-size: 14px;padding: 0px 3px;"
                    size="small"
                    type="text"
                    icon="el-icon-tickets"
                    @click="expandResult(scope.row)"
                    v-hasPermi="['upLoad:prevention:expand']"
                  >解析结果</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          <el-button
              style="font-size: 14px;padding: 0px 3px;"
              v-if="scope.row.auditState == 0"
              size="small"
              type="text"
              icon="el-icon-document-checked"
              @click="sentAudit(scope.row)"
              v-hasPermi="['upLoad:prevention:audit']"
          >提交审核</el-button>
          <el-button
                style="font-size: 14px;padding: 0px 3px;"
                v-if="scope.row.auditState == 99"
                size="small"
                type="text"
                icon="el-icon-s-promotion"
                @click="sendData(scope.row)"
                v-hasPermi="['upLoad:fluid:audit']"
            >分发</el-button>

           <el-button
              style="font-size: 14px;padding: 0px 3px;"
              v-if="scope.row.auditState == 100"
              size="small"
              type="text"
              icon="el-icon-s-promotion"
              @click="revokeData(scope.row)"
              v-hasPermi="['upLoad:fluid:audit']"
          >撤销分发</el-button>
          <el-button
                style="font-size: 14px;padding: 0px 3px;"
                v-if="scope.row.auditState != 0"
                size="small"
                type="text"
                icon="el-icon-document-checked"
                @click="getHisList(scope.row.id)"
                v-hasPermi="['upLoad:fluid:audit']"
            >审核记录</el-button>
          <el-button 
              style="font-size: 14px;padding: 0px 3px;color:rgb(255, 56, 56)"
             v-if="scope.row.auditState <= 0"
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="delFile(scope.row)"
              v-hasPermi="['upLoad:prevention:delete']"
          >删除</el-button>
          </template>
        </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="pages.pageNum" :limit.sync="pages.pageSize"
              @pagination="getAuditInfo" />
      </div>
      <el-dialog title="模板下载" :visible.sync="open3" @close="open3 = false" width="1000px" append-to-body>
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
      <el-dialog title="解析结果" :visible.sync="open4" @close="open4 = false" width="1300px" append-to-body>
        <el-col :span="2">
          <el-button 
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="delExpandFile"
            v-hasPermi="['upLoad:prevention:delete']"
          >清除数据</el-button>
        </el-col>
        <el-col :span="2">
          <el-select v-model="mode" size="mini" placeholder="请选择类型" @change="expandResult(nowRow)">
            <el-option
              label="线"
              value="线"/>
            <el-option
              label="点"
              value="点"/>
          </el-select>
        </el-col>
        <div v-show="mode == '线'">
          <el-table
          v-show="mode == '线'"
          :data="resultList"
          v-loading="loading"
          height="500"
          stripe
        >
        <el-table-column prop="directoryName" label="所属数据目录名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="descriptions" label="摘要描述" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="provider" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="processingProcess" label="处理过程" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="projectName" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="lineName" label="剖面名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="dateOfCommence" label="开工日期" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="completionDate" label="竣工日期" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="personToContact" label="联系人" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="phoneNum" label="联系电话" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button 
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="openInfo(scope.row)"
                v-hasPermi="['upLoad:prevention:index']"
              >详情</el-button>
            </template>
          </el-table-column>
          </el-table>
        </div>
        <div v-show="mode == '点'">
          <el-table
          v-show="mode == '点'"
          :data="resultList"
          v-loading="loading"
          height="500"
          stripe
        >
          <el-table-column prop="lineName" label="联合钻孔剖面名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="pointNum" label="钻孔编号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="begDate"  label="开工日期" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="endTime"  label="竣工日期" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="heigh" label="孔口标高（m）" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button 
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="openInfo(scope.row)"
                v-hasPermi="['upLoad:prevention:index']"
              >详情</el-button>
            </template>
          </el-table-column>
          </el-table>
        </div>
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
                prop="ingAuditState"
                label="状态"
                width="100">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.ingAuditState| auditStates }}
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
                prop="logMsg"
                label="意见">
              </el-table-column>
            </el-table>
          </div>
        </el-dialog>
      <el-dialog title="详情" :visible.sync="open" @close="open = false" width="800px" append-to-body>
        <div style="height: 520px;overflow-y:auto;padding:0px 50px">
          <el-form ref="form" :model="form" label-width="160px">
        <el-row>
          <el-col :span="20">
              <el-form-item label="所属数据目录名称" prop="directoryName">
                {{ form.directoryName }}
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="摘要描述" prop="descriptions">
                {{ form.descriptions }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据目录提供单位" prop="provider">
                {{ form.provider }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="处理过程" prop="processingProcess">
                {{ form.processingProcess }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="所属项目名称" prop="projectName">
                {{ form.projectName }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="剖面名称" prop="lineName">
                {{ form.lineName }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="开工日期" prop="dateOfCommence">
                {{ form.dateOfCommence }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="竣工日期" prop="completionDate">
                {{ form.completionDate }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据格式" prop="dataFormat">
                {{ form.dataFormat }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据量" prop="dataSize">
                {{ form.dataSize }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分发方式" prop="distributionMode">
                {{ form.distributionMode }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="在线链接" prop="onlineLink">
                {{ form.onlineLink }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分发单位" prop="distributionDepartment">
                {{ form.distributionDepartment }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系人" prop="personToContact">
                {{ form.personToContact }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系电话" prop="phoneNum">
                {{ form.phoneNum }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="电子邮件" prop="email">
                {{ form.email }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="维护和更新频率" prop="updateFrequency">
                {{ form.updateFrequency }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="安全限制分级" prop="safetyRestrictionClassification">
                {{ form.safetyRestrictionClassification }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="质量描述" prop="qualityDescription">
                {{ form.qualityDescription }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="质量标准" prop="qualityStandard">
                {{ form.qualityStandard }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="质量等级" prop="qualityGrade">
                {{ form.qualityGrade }}
             </el-form-item>
            </el-col>
          </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="open = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 点详情 -->
      <el-dialog title="详情" :visible.sync="open2" @close="open2 = false" width="800px" append-to-body>
        <div style="height: 520px;overflow-y:auto;padding:0px 50px">
          <el-form ref="form" :model="form" label-width="160px">
        <el-row>
          <el-col :span="20">
              <el-form-item label="联合钻孔剖面名称" prop="lineName">
                {{ form.lineName }}
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="钻孔编号" prop="pointNum">
                {{ form.pointNum }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="开工日期" prop="begDate">
                {{ form.begDate }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="竣工日期" prop="endTime">
                {{ form.endTime }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="孔口标高（m）" prop="heigh">
                {{ form.heigh }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="终孔深度（m）" prop="deepth">
                {{ form.deepth }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="高程系" prop="elevationSystem">
                {{ form.elevationSystem }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="地下水位（初见）（m）" prop="waterLevel">
                {{ form.waterLevel }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="钻孔点经度(°)" prop="lon">
                {{ form.lon }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="钻孔点纬度（°）" prop="lat">
                {{ form.lat }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="坐标系" prop="coordinateSystem">
                {{ form.coordinateSystem }}
             </el-form-item>
            </el-col>
          </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="open = false">取 消</el-button>
        </div>
      </el-dialog>
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
} from '@/api/workflow/selsmometry.js'
import { drAnaly, drGetTaskId, drDelByFileId, mpfindByFileId } from '@/api/dataup/probedata.js'
import { excelfileList, excelCreate, excelRemove, excelUpdate, setAuditState, getAuditLog, pushData,revokePushData } from '@/api/dataup/criterion.js'
import { Loading } from 'element-ui';
//   import { quickAdd } from "@/api/workflow/audit";
import { getListWithTask } from '@/api/workflow/audit.js'
import { getUserProfile } from "@/api/system/user"
import { getToken } from '@/utils/auth'
import { encode, decode } from '@/utils/base/dataEncry.js'
export default {
  name: 'AddStation',
  components: {},
  data() {
    return {
      // 台网
      companyLists: [],
      // 当前台网id
      netId: undefined,
      total: 0,
      //模板
      model:[
          {
            name: '钻孔联合剖面-模版',
            url: 'http://www.earthquake.ac.cn/prodSer/downloadImage/?filename=钻孔联合剖面-模版_1692019644883.xlsx',
          }
        ],
      form: {

      },
      pages: {
        pageNum: 1,
        pageSize: 10,
      },
      // 查询参数
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
      },
      open3: false,
      open4: false,
      open5: false,
      fileList: [],
      //解析结果列表
      resultList: [],
      //审核记录
      hisRecord: [],
      uploadUrl: '',
      //当前的文件id
      nowFileId: null,
      // 遮罩层
      loading: true,
      loading2: null,
      //临时解析结果类型
      mode: '线',
      // 文件上传地址
      action: process.env.VUE_APP_DIREC_API + '/station/importstationdata',
      //台站数据列表
      stationData: [],
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      isUploading: true,
      //当前查看的台网id
      nowId: null,
      nowRow: null,
      fileList: [],
      // 选中数组
      ids: [],
      infoData: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      id: null,
      // 台站表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      open2: false,
      //是否已解析
      isExtend: false,
      // 返回提示
      text: '',
      taskId: null,
      deptName: null,
      deptId: null,
      //当前文件的文件名
      fileName: null,
      // 查询参数
      queryParams: {
        company: null,
        companyList: null
      },
      nowNetName: '',
      //选择的台站名称
      selStaName: '',
      // 表单参数
      stationForm: {
        staCode: null,
        staName: null,
        staDescribe: null,
        staLat: null,
        staLon: null,
        staHeight: null,
        remark: null
      },
      // 台网表单参数
      networkForm: {
        id: null,
        netCode: null,
        netName: null,
        sortNum: null
      },
      isAdmin: false,
    }
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
        if(val == 100) return '已分发'
      }
    },
  watch: {},
  created() {
      // console.log(this.$store.state.user)
      this.getUserDept()
    this.taskId = this.$route.query.taskId
    // this.filterNet()
    this.uploadUrl = process.env.VUE_APP_PRODS_API + '/prodSer/uploadFile'
  },
  mounted() {
      //超级管理员
      if(this.$store.state.user.permissions[0] == '*:*:*' || this.$store.state.user.roles.includes('platform_admin')){
        this.isAdmin = true
      }
      this.getAuditInfo({page:1,limit:10})

    },
  methods: {
    modelExcel() {
      this.open3 = true
    },
    getUserDept() {
      getUserProfile().then((res) => {
          this.deptName = res.data.dept.deptName
          this.deptId = res.data.dept.deptId
      })
    },
    handleCommand(row) {
      if(row.status == 1){
        this.isExtend = false
      }else{
        this.isExtend = true
      }
    },
    getAuditInfo(page) {
      this.loading = true
      let par = {
        uploader: this.$store.state.user.name,
        pageNum:page.page,
        pageSize:page.limit,
        subjectId:16,
      }
      //管理员查看所有用户
      if(this.isAdmin) {
          delete(par.uploader)
        }
      excelfileList(encode(par)).then(res=>{
          this.loading = false
          this.infoData = decode(res).records
          this.total = decode(res).total
      })
    },
    openInfo(item){
      this.title = "详情"
      this.form = {...item}
      if(this.mode == '线'){
        this.open = true
      }else{
        this.open2 = true
      }
    },
    onSuccess(e,f){
      // console.log(e)
      let par = {
          subjectId:16,
          fileName: e.split('filename=')[1],
          realName: this.fileName,
          url: e,
          uploader: this.$store.state.user.name,
          uploadDepartment: this.deptName,
          unitId: this.deptId,
          status: 0,
          auditState: 0
      }
      excelCreate(encode(par)).then(res=>{
         if(res){
          this.$message.success('上传成功')
          this.getAuditInfo({page:1,limit:10})
         }else{
          this.$message.error('上传失败')
         }
      })
      this.loading2.close()
    },
    sentAudit(row) {
      const self = this
      if(row.status != 1){
        this.$message.error('请解析后再提交')
        return
      }
      this.$modal
        .confirm('是否确认提交审核？')
        .then(() => {
          self.loading = true
          let par = {
            fileId: row.id,
            auditState: 1
          }
          setAuditState(encode(par)).then(res=>{
            self.loading = false
            self.getAuditInfo({page:1,limit:10})
          })
        })
      },
      sendData(row) {
        let par = {
          fileId: row.id,
          subjectName: '活断层钻孔联合剖面'
        }
        const self = this
        this.$modal
          .confirm('是否确认分发？')
          .then(() => {
            self.loading = true
            return pushData(encode(par))
          })
          .then((res) => {
            if(res == '分发成功'){
              let par2 = {
                fileId: row.id,
                auditState: 100
              }
              setAuditState(encode(par2)).then(res=>{
                self.loading = false
                self.getAuditInfo({page:1,limit:10})
                self.$modal.msgSuccess('分发成功')
              })
            }else{
              self.$message.error(res)
            }
            self.loading = false
          })
          .catch(() => {})
      },


     revokeData(row){
     let par = {
        fileId: row.id,
        subjectName: '活断层钻孔联合剖面'
      }
      const self = this
      this.$modal
        .confirm('是否确认撤销分发？')
        .then(() => {
          self.loading = true
          return revokePushData(encode(par))
        })
        .then((res) => {
          if(res == '撤销分发成功'){
            let par2 = {
              fileId: row.id,
              auditState: 99
            }
            setAuditState(encode(par2)).then(res=>{
              self.loading = false
              self.getAuditInfo({page:1,limit:10})
              self.$modal.msgSuccess('撤销分发成功')
            })
          }else{
            self.$message.error(res)
          }
          self.loading = false
        })
        .catch(() => {})
    },


    delFile(row) {
      let name = row.fileName
      let id = row.id
      const self = this
      this.$modal
        .confirm('是否确认删除名为"' + name + '"的文件吗？')
        .then(() => {
          self.loading = true
          return excelRemove(encode({ id: id }))
        })
        .then(() => {
          this.getAuditInfo({page:1,limit:10})
          drDelByFileId(encode({
            fileId: id
          })).then(res=>{
            self.loading = false
            this.$modal.msgSuccess('删除成功')
          })
        })
        .catch(() => {})
    },
    onProgress(e,f){
      this.fileName = f.name
      this.loading2 = Loading.service({
          lock: true,
          text: '数据上传中，请稍等...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
      });
    },
    getHisList(id) {
      this.open5 = true
      this.loading2 = true
      getAuditLog(encode({
        fileId: id,
        pageNum: 1,
        pageSize: 999
      })).then(res=>{
        this.hisRecord = decode(res).records
        this.loading2 = false
      })
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
    handleUploadData() {

    },
    toExpandExcel(item) {
      let par = {
        fileName: item.fileName,
        fileId: item.id
      }
      this.loading = true
      drAnaly(encode(par)).then(res=>{
        if(res.code != 500){
          //解析后，修改为已解析状态
          let p = {
            id: item.id,
            status: 1
          }
          excelUpdate(encode(p)).then(resp=>{
            this.loading = false
            this.getAuditInfo({page:1,limit:10})
          })
          this.$message.success(res)
        }else{
          this.loading = false
          this.$message.error(res.msg)
        }
      })
    },
    expandResult(item) {
      this.nowRow = item
      let par = {
        fileId: item.id,
        mode: this.mode == '线' ? 1 : 2,
        pageNum:1,
        pageSize: 999
      }
      this.loading = true
      mpfindByFileId(encode(par)).then(res=>{
        let resp = decode(res).records
        this.resultList = [...resp]
        this.open4 = true
        this.nowFileId = item.id
        this.loading = false
      }).catch(e=>{
        this.loading = false
      })
    },
    //删除解析结果文件
    delExpandFile() {
      let par = {
        fileId: this.nowFileId
      }
      const self = this
      this.$modal
        .confirm('是否确认清除数据？')
        .then(() => {
          this.loading = true
          return drDelByFileId(encode(par))
        })
        .then(() => {
          self.loading = false
          self.open4 = false
          //清除解析结果后，修改为未解析状态
          let p = {
            id: self.nowFileId,
            status: 0
          }
          excelUpdate(encode(p)).then(resp=>{
            self.getAuditInfo({page:1,limit:10})
          })
          self.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    // 选中台网 获取台站
    handleClick(e) {
      this.loading = true
      if(e.name){ //选项卡切换判断
        if(e.name == 'station'){    //切换到台站列表选项卡
          this.nowId = this.companyLists[0].id  //当前查看的台站id
          this.netId = e
          let datas = encode({})
          //如果是管理员的话，查询所有台站
          if(this.$store.state.user.name == "admin"){
            datas = {}
            this.nowId = null
          }
          getStation(datas)
            .then((res) => {
              let arr = decode(res)
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
        }else{
          setTimeout(() => {
            this.loading = false
          }, 1000);
        }
      }else{  //根据id台站列表加载
        this.nowId = e
        let par = {
          netId: e
        }
        getStation(encode(par))
        .then((res) => {
          let arr = decode(res)
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
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.open2 = false
      this.open4 = false
      this.reset()
    },
    handlePreview(file) {
      // console.log(file)
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 重置表单
    reset() {
      this.stationForm = {
        staCode: null,
        staName: null,
        staDescribe: null,
        staLat: null,
        staLon: null,
        staHeight: null,
        remark: null
      }
      this.networkForm = {
        id: null,
        netCode: null,
        netName: null,
        sortNum: null
      }
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
          staLat: row.staLat,
          staLon: row.staLon,
          staHeight: row.staHeight,
          remark: row.remark
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
            })
          } else {
            this.stationForm.netId = this.nowId
            addStation(encode(this.stationForm)).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.reset()
            })
          }
        }
      })
    }
    },
    submitLoad() {
      this.$refs.upload.submit()
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
