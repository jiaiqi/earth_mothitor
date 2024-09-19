<template>
    <div class="app-container">
        <!-- 添加或修改台网数据对话框 -->
        <el-col :span="2">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            multiple
            :limit="10"
            :headers="headers"
            :on-progress="onProgress"
            :on-success="onSuccess"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="warning" @click="modelExcel">上传模板下载</el-button>
        </el-col>
        <div>
          <el-table
            v-loading="loading"
            :data="infoData"
            stripe
          >
            <el-table-column prop="directoryName" label="所属数据目录名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="descriptions" label="摘要描述" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="prividerUnit" width="120" label="提供单位" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="processes" width="180" label="处理过程" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="networkCode" width="100" label="台网代码" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stationCode" width="100" label="观测站代码" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stationName" width="200" label="观测站名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="sendUnit" label="分发单位" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="linkMan" label="联系人" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="tel" label="联系电话" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button 
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="openInfo(scope.row.id)"
                v-hasPermi="['upLoad:fluid:index']"
              >详情</el-button>
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
                title="注：上传数据时，需要把表格第一行黄底内容的提示信息删除；且紫色部分为必填项"
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
        <el-dialog title="详情" :visible.sync="open" @close="open = false" width="800px" append-to-body>
          <div style="height: 520px;overflow-y:auto;padding:0px 50px">
            <el-form ref="form" :model="form" label-width="100px">
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
              <el-form-item label="数据目录提供单位" prop="prividerUnit">
                {{ form.prividerUnit }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="处理过程" prop="processes">
                {{ form.processes }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="台网代码" prop="networkCode">
                {{ form.networkCode }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="观测站代码" prop="stationCode">
                {{ form.stationCode }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="观测站名称" prop="stationName">
                {{ form.stationName }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="观测站经度" prop="longitude">
                {{ form.longitude }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="观测站纬度" prop="latitude">
                {{ form.latitude }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="观测站纬度" prop="latitude">
                {{ form.latitude }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="观测站高程" prop="stationElevation">
                {{ form.stationElevation }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="建站时间" prop="buildTime">
                {{ form.buildTime }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="测项代码" prop="testCode">
                {{ form.testCode }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="测项名称" prop="testName">
                {{ form.testName }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="测点代码" prop="spotCode">
                {{ form.spotCode }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="仪器名称" prop="apparatusName">
                {{ form.apparatusName }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分量代码" prop="componentCode">
                {{ form.componentCode }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分量名称" prop="componentName">
                {{ form.componentName }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="采样率" prop="samplingRate">
                {{ form.samplingRate }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="起止时间" prop="beginEndTime">
                {{ form.beginEndTime }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="场地类型" prop="landType">
                {{ form.landType }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="是否需要辅助测项" prop="helpTest">
                {{ form.helpTest }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="备注" prop="remark">
                {{ form.remark }}
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
              <el-form-item label="分发单位" prop="sendUnit">
                {{ form.sendUnit }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系人" prop="linkMan">
                {{ form.linkMan }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="联系电话" prop="tel">
                {{ form.tel }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="电子邮件" prop="emil">
                {{ form.emil }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="维护和更新频率" prop="frequency">
                {{ form.frequency }}
             </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="安全限制分级" prop="securityLevel">
                {{ form.securityLevel }}
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
              <el-form-item label="质量等级" prop="qualityRank">
                {{ form.qualityRank }}
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
  import { Loading } from 'element-ui';
//   import { quickAdd } from "@/api/workflow/audit";
  import { getListWithTaskFluid } from '@/api/workflow/audit.js'
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
        fileList: [],
        uploadUrl: '',
        //模板
        model:[
          {
            name: '地下流体数据目录-陕西局示例_1689672995575.xlsx',
            url: 'http://www.earthquake.ac.cn/prodSer/downloadImage/?filename=地下流体数据目录-陕西局示例_1689672995575.xlsx',
          },
          {
            name: '4-地下流体数据目录-广东_1689673033696.xlsx',
            url: 'http://www.earthquake.ac.cn/prodSer/downloadImage/?filename=4-地下流体数据目录-广东_1689673033696.xlsx',
          }
        ],
        // 遮罩层
        loading: true,
        loading2: null,
        // 上传台站方式
        upradio: '',
        // 上传格式
        upradioType: '',
        // 文件上传地址
        action: process.env.VUE_APP_DIREC_API + '/station/importstationdata',
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
        open3: false,
        // 返回提示
        text: '',
        taskId: null,
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
        open: false,
        // 表单校验
        rules: {
          staCode: [
            { required: true, message: '台站代码不能为空', trigger: 'blur' }
          ],
          staName: [
            { required: true, message: '台站名称不能为空', trigger: 'blur' }
          ],
          staLat: [
            { required: true, message: '台站纬度不能为空', trigger: 'blur' }
          ],
          staLon: [
            { required: true, message: '台站经度不能为空', trigger: 'blur' }
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
      this.taskId = this.$route.query.taskId
      this.getAuditInfo({page:1,limit:10})
      this.uploadUrl = process.env.VUE_APP_DIREC_API + '/auditserver/under_fluid/underFluidUpload?creator='+this.$store.state.user.name
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
      getAuditInfo(page) {
        if(this.taskId){
            let par = 'taskId='+this.taskId+'&pageNum='+page.page+'&pageSize='+page.limit
        getListWithTaskFluid(par).then(res=>{
            this.loading = false
            this.infoData = res.records
            this.total = res.total
          })
        }else {
          this.loading = false
        }
      },
      openInfo(id){
        this.form = {}
        this.id = id
        this.infoData.forEach(item=>{
          if(item.id == this.id){
            this.form = item
          }
        })
        this.open = true
      },
      onSuccess(e,f){
        if(e){
          this.$message(e)
        }
        this.loading2.close()
      },
      modelExcel() {
        this.open3 = true
      },
      onProgress(e,f){
        this.loading2 = Loading.service({
            lock: true,
            text: '数据上传中，请稍等...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.9)'
          });
      },
      handleCheck(data) {
        this.loading = true
        let par = {
          staId: data.id,
          netId: data.netId
        }
        getStationData(encode(par)).then((res) => {
          this.loading = false
          this.stationData = decode(res)
          this.activeName = 'stationData'
          this.selStaName = data.staName
        })
      },
      handleUploadData() {
  
      },
      // 选中台网 获取台站
      handleClick(e) {
        this.loading = true
        if(e.name){ //选项卡切换判断
          if(e.name == 'station'){    //切换到台站列表选项卡
            this.networkOption.netId = this.companyLists[0].id
            this.nowId = this.companyLists[0].id  //当前查看的台站id
            this.netId = e
            let datas = encode(this.networkOption)
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
            this.activeName = 'station'
          })
          .catch((ree) => {
            this.$message.error('获取数据失败')
          })
        }
      },
      // 刷新
      refresh(type) {
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
        this.reset()
      },
      handlePreview(file) {
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
            netCode: row.netCode,
            netName: row.netName,
            sortNum: row.sortNum,
          }
          this.open2 = true
          this.title = '修改台网信息'
        }else {
          this.upradio = '1'
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
                this.refresh(2)
              })
            } else {
              this.stationForm.netId = this.nowId
              addStation(encode(this.stationForm)).then((response) => {
                this.$modal.msgSuccess('新增成功')
                this.open = false
                this.refresh(2)
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
          let name = row.staName
          let id = row.id
          this.$modal
            .confirm('是否确认删除名为"' + name + '"的台站吗？')
            .then(() => {
              return delStation(encode({ id: id }))
            })
            .then(() => {
              this.refresh(2)
              this.$modal.msgSuccess('删除成功')
            })
            .catch(() => {})
        }
  
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
  