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
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="线列表" name="netWork" 
        v-if="showNetwork">
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button
            v-hasPermi="['upLoad:prospecting:stationList:add']"
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(1)"
          >
            新增数据
          </el-button>
        </el-col> -->
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
        <right-toolbar :show-search.sync="showSearch" @queryTable="refresh(1)" />
      </el-row>
  
      <el-table
        v-loading="loading"
        :data="companyLists"
        height="540"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="目录名称" prop="directoryName" />
        <el-table-column label="提供单位" prop="providerUnit" />
        <el-table-column label="项目名称" prop="projectName" />
        <el-table-column label="线名称" prop="descriptions" />
        <el-table-column label="联系人" prop="personToContact" />
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
              @click="handleClick(scope.row)"
            >
              查看点
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="handleInfo(scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-hasPermi="['upLoad:prospecting:stationList:edit']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row,1)"
            >
              修改
            </el-button>
            <el-button
              v-hasPermi="['upLoad:prospecting:stationList:del']"
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
      <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
        <el-form
          ref="networkForm"
          :model="networkForm"
          :rules="rules"
          label-width="150px"
        >
          <el-form-item label="所属数据目录名称" prop="directoryName">
            <el-input
              v-model="networkForm.directoryName"
              placeholder="请输入所属数据目录名称"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="摘要描述" prop="descriptions">
            <el-input
              v-model="networkForm.descriptions"
              placeholder="请输入摘要描述"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="数据目录提供单位" prop="providerUnit">
            <el-input
              v-model="networkForm.providerUnit"
              placeholder="请输入数据目录提供单位"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="处理过程" prop="treatingProcesses">
            <el-input
              v-model="networkForm.treatingProcesses"
              placeholder="请输入处理过程"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="所属项目名称" prop="projectName">
            <el-input
              v-model="networkForm.projectName"
              placeholder="请输入所属项目名称"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="测线名称" prop="descriptions">
            <el-input
              v-model="networkForm.descriptions"
              placeholder="请输入测线名称"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="起点桩号" prop="startNumber">
            <el-input
              v-model="networkForm.startNumber"
              placeholder="请输入起点桩号"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="终点桩号" prop="endNumber">
            <el-input
              v-model="networkForm.endNumber"
              placeholder="请输入终点桩号"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="道间距（m）" prop="trackPitch">
            <el-input
              v-model="networkForm.trackPitch"
              placeholder="请输入道间距（m）"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="测线长度（km）" prop="lineNumber">
            <el-input
              v-model="networkForm.lineNumber"
              placeholder="请输入测线长度（km）"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="开工日期" prop="dateOfCommence">
            <el-date-picker
                v-model="networkForm.dateOfCommence"
                type="date"
                :disabled="title == '详情'"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="完工日期" prop="completionDate">
            <el-date-picker
                v-model="networkForm.completionDate"
                type="date"
                :disabled="title == '详情'"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="数据格式" prop="dataFormat">
            <el-input
              v-model="networkForm.dataFormat"
              placeholder="请输入数据格式"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="数据量" prop="dataSize">
            <el-input
              v-model="networkForm.dataSize"
              placeholder="请输入数据量"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="分发方式" prop="distributionMode">
            <el-input
              v-model="networkForm.distributionMode"
              placeholder="请输入分发方式"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="分发单位" prop="distributionDepartment">
            <el-input
              v-model="networkForm.distributionDepartment"
              placeholder="请输入分发单位"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="联系人" prop="personToContact">
            <el-input
              v-model="networkForm.personToContact"
              placeholder="请输入联系人"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="phoneNum">
            <el-input
              v-model="networkForm.phoneNum"
              placeholder="请输入联系电话"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="电子邮件" prop="email">
            <el-input
              v-model="networkForm.email"
              placeholder="请输入电子邮件"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="维护和更新频率" prop="updateFrequency">
            <el-input
              v-model="networkForm.updateFrequency"
              placeholder="请输入维护和更新频率"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="安全限制分级" prop="safetyRestrictionClassification">
            <el-input
              v-model="networkForm.safetyRestrictionClassification"
              placeholder="请输入安全限制分级"
              :disabled="title == '详情'"
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
      <el-tab-pane label="点列表" name="station">
        <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
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
        </el-col> -->
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
        <right-toolbar :show-search.sync="showSearch" @queryTable="refresh(2)" />
      </el-row>
  
      <el-table
        v-loading="loading"
        :data="roleList"
        height="600"
      >
        <el-table-column label="序号" prop="pointNum" />
        <el-table-column label="编号" width="150" prop="id" />
        <el-table-column label="时间" width="250" prop="time">
          <template slot-scope="scope">
            {{ scope.row.time }}
          </template>
        </el-table-column>
        <el-table-column label="纬度(°)" prop="lat">
          <template slot-scope="scope">
            {{ scope.row.lat.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="经度(°)" prop="lon">
          <template slot-scope="scope">
            {{ scope.row.lon.toFixed(2) }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="备注" prop="reemark" /> -->
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-tickets"
              @click="handleCheck(scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-hasPermi="['upLoad:prospecting:stationList:edit']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row,2)"
            >
              修改
            </el-button>
            <el-button
              v-hasPermi="['upLoad:prospecting:stationList:del']"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row,2)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="height:56px" v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
              @pagination="getPageList" />
      <!-- 添加或修改台站数据对话框 -->
      <el-dialog :title="title" :visible.sync="open3" width="700px" append-to-body>
  
        <el-form
          ref="stationForm"
          :model="stationForm"
          :rules="rules"
          label-width="100px"
        >
        <el-form-item label="序号" prop="pointNum">
            <el-input
              v-model="stationForm.pointNum"
              placeholder="请输入序号"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="时间" prop="time">
            <el-input
              v-model="stationForm.time"
              placeholder="请输入时间"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input
              v-model="stationForm.lat"
              placeholder="请输入纬度"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="经度" prop="lon">
            <el-input
              v-model="stationForm.lon"
              placeholder="请输入经度"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="备注" prop="reemark">
            <el-input
              v-model="stationForm.reemark"
              placeholder="请输入备注"
              :disabled="title == '详情'"
            />
          </el-form-item>
        </el-form>
        <div v-if="title != '详情'" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm(2)">
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
        getPageList,
        getList,
        editGeo,
        delGeo,
        delDrill,
        editDrill,
        getPointPageList,
        getPointDrillList,
        editPoint,
        editDrillPoint,
        delDrillPoint,
        delPoint,
        drillList
    } from '@/api/dataup/probedata'
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
        dataRange: '',
        fileList: [],
        uploadUrl: process.env.VUE_APP_SEIS_API + '/auditserver/seismometry/upload',
        // 遮罩层
        loading: true,
        // 上传台站方式
        upradio: '',
        // 上传格式
        upradioType: '',
        // 文件上传地址
        action: process.env.VUE_APP_SEIS_API + '/station/importstationdata',
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
        open3: false,
        // 返回提示
        text: '',
        delRow: null,
        // 查询参数
        queryParams: {
          company: null,
          companyList: null
        },
        nowNetName: '',
        //选择的台站名称
        selStaName: '',
        lineId: null,
        // 表单参数
        stationForm: {
          id: null,
          lineId: null,
          pointNum: null,
          time: null,
          lat: null,
          lon: null,
          taskId: null,
          reemark: null,
          descriptions: null
        },
        // 台网表单参数
        networkForm: {
          id: null,
          directoryName: null,
          descriptions: null,
          providerUnit: null,
          treatingProcesses: null,
          region: null,
          projectName: null,
          lineName: null,
          startNumber: null,
          beginLatitude: null,
          endNumber: null,
          trackPitch: null,
          lineNumber: null,
          dateOfCommence: null,
          testCount: null,
          completionDate: null,
          dataFormat: null,
          dataSize: null,
          distributionMode: null,
          distributionDepartment: null,
          personToContact: null,
          phoneNum: null,
          email: null,
          updateFrequency: null,
          safetyRestrictionClassification: null,
          taskId: null,
          taskState: null,
          childPoint: []
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
      this.filterNet({page:1,limit:10})
      // console.log(this.$store.state.user)
    },
    methods: {
      /** 查询上报单位 */
      getList() {
        // this.loading = true
        let data = encode({})
        getCompany(data)
          .then((res) => {
            console.log(decode(res))
            this.companys = decode(res)
          })
          .catch(() => {})
      },
      //根据用户所在单位过滤台网
      filterNet(data) {
        let info = null
          info = 'pageNum=1&pageSize=10'
          if(data){
           info = 'pageNum='+data.page+'&pageSize='+data.limit
          }
          this.loading = true
          drillList(info).then((res) => {
            this.total = res.total
            this.companyLists = res.records
            if(this.companyLists.length != 0){
              this.getPointList(this.companyLists[0].id)
            }
            this.loading = false
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
        this.title = '详情'
        this.open3 = true
      },
      handleUploadData() {
  
      },
      handleInfo(row) {
        this.open = true
        this.networkForm = {...row}
        this.title = '详情'
      },
      getPointList(id){
        let par = 'pageNum=1&pageSize=10&line_id='+id
        getPointDrillList(par)
          .then((res) => {
            let arr = res.records
            this.roleList = arr
            this.loading = false
          })
          .catch((ree) => {
            this.$message.error('获取数据失败')
          })
      },
      // 选中台网 获取台站
      handleClick(e) {
        this.lineId = e.id
        this.activeName = 'station'
        this.getPointList(e.id)
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
        this.reset()
      },
      // 文件个数超出
      handleExceed() {
  
      },
      // 上传失败
      handleUploadError(err) {
        console.log(err, 3)
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
          console.log(res, 1)
        }
        console.log(file, 2)
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
          directoryName: null,
          descriptions: null,
          providerUnit: null,
          treatingProcesses: null,
          region: null,
          projectName: null,
          lineName: null,
          startNumber: null,
          beginLatitude: null,
          endNumber: null,
          trackPitch: null,
          lineNumber: null,
          dateOfCommence: null,
          testCount: null,
          completionDate: null,
          dataFormat: null,
          dataSize: null,
          distributionMode: null,
          distributionDepartment: null,
          personToContact: null,
          phoneNum: null,
          email: null,
          updateFrequency: null,
          safetyRestrictionClassification: null,
          taskId: null,
          taskState: null,
          childPoint: []
        }
      },
      handleExceed(files, fileList) {
        console.log(files,fileList)
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
            this.$message.error('请选择一个台网后再新增')
            return
          }
          this.open = true
        }
  
      },
      /** 修改按钮操作 */
      handleUpdate(row,index) {
        if(index == 1){
          this.networkForm = {
            id: row.id,
            directoryName: row.directoryName,
            descriptions: row.descriptions,
            providerUnit: row.providerUnit,
            treatingProcesses: row.treatingProcesses,
            region: row.region,
            projectName: row.projectName,
            descriptions: row.descriptions,
            startNumber: row.startNumber,
            beginLatitude: row.beginLatitude,
            endNumber: row.endNumber,
            trackPitch: row.trackPitch,
            lineNumber: row.lineNumber,
            dateOfCommence: row.dateOfCommence,
            testCount: row.testCount,
            completionDate: row.completionDate,
            dataFormat: row.dataFormat,
            dataSize: row.dataSize,
            distributionMode: row.distributionMode,
            distributionDepartment: row.distributionDepartment,
            personToContact: row.personToContact,
            phoneNum: row.phoneNum,
            email: row.email,
            updateFrequency: row.updateFrequency,
            safetyRestrictionClassification: row.safetyRestrictionClassification,
            taskId: row.taskId,
            taskState: row.taskState,
            childPoint: []
          }
          this.open = true
          this.title = '修改线信息'
        }else {
          this.stationForm = {
            id: row.id,
            lineId: row.lineId,
            pointNum: row.pointNum,
            time: row.time,
            lat: row.lat,
            lon: row.lon,
            taskId: row.taskId,
            reemark: row.reemark,
            lineName: row.lineName
          }
          this.open3 = true
          this.title = '修改点信息'
        }
      },
  
      /** 提交按钮 */
      submitForm(type) {
        if(type == 1){
          this.$refs['networkForm'].validate((valid) => {
          if (valid) {
            editDrill(encode(this.networkForm)).then((res) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.filterNet({page:1,limit:10})
            })
          }
        })
        }else {
        this.$refs['stationForm'].validate((valid) => {
          if (valid) {
            editDrillPoint(encode(this.stationForm)).then((res) => {
              this.$modal.msgSuccess('修改成功')
              this.open3 = false
              this.getPointList(this.lineId)
              // this.getPageList({page:1,limit:10})
            })
          }
        })
      }
      },
      submitLoad() {
        this.$refs.upload.submit()
      },
      /** 删除按钮操作 */
      handleDelete(row,type) {
        if(type == 1){
          let name = row.descriptions
          let id = row.id
          this.$modal
            .confirm('是否确认删除名为"' + name + '"的线吗？')
            .then(() => {
              return delDrill(encode({ id: id }))
            })
            .then(() => {
              this.filterNet({page:1,limit:10})
              this.$modal.msgSuccess('删除成功')
            })
            .catch(() => {})
        }else{
          let id = row.id
          this.$modal
            .confirm('是否确认删除编号为"' + id + '"的点吗？')
            .then(() => {
              return delDrillPoint(encode({ id: id }))
            })
            .then(() => {
              this.$modal.msgSuccess('删除成功')
              this.getPointList(this.lineId)
            })
            .catch(() => {})
        }
  
      },
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
  