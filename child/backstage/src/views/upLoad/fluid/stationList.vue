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
      <el-form :model="queryParams2" ref="queryForm" size="small" :inline="true">
        <el-form-item label="台站名称" prop="name">
          <el-input
            v-model="queryParams2.name"
            placeholder="请输入台站名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getList({page:1,limit:10})">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
        <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['upLoad:fluid:add']"
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
            v-hasPermi="['upLoad:fluid:add']"
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleUpLoad"
          >
            批量上传
          </el-button>
        </el-col>
        <el-col :span="2">
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
        <right-toolbar :show-search.sync="showSearch" @queryTable="refresh(2)" />
      </el-row>
  
      <el-table
        v-loading="loading"
        :data="roleList"
        height="600"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="台站名称" prop="stationName" />
        <el-table-column label="台站编码" prop="stationCode" />
        <el-table-column label="台网编号" prop="networkCode" />
        <el-table-column label="纬度(°)" prop="latitude" />
        <el-table-column label="经度(°)" prop="longitude" />
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
              v-hasPermi="['upLoad:fluid:edit']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-hasPermi="['upLoad:fluid:edit']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="delstation(scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-hasPermi="['upLoad:fluid:del']"
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
              @pagination="getList" />
      <!-- 清除台站数据 -->
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
          <el-button type="primary" @click="handleDelete(delRow)">
            确 定
          </el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 添加或修改台站数据对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
        <el-form
          ref="stationForm"
          :model="stationForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="台站代码" prop="stationCode">
            <el-input
              v-model="stationForm.stationCode"
              placeholder="请输入台站代码"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="台站名称" prop="stationName">
            <el-input
              v-model="stationForm.stationName"
              placeholder="请输入台站名称"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="台网代码" prop="networkCode">
            <el-input
              v-model="stationForm.networkCode"
              placeholder="请输入台网代码"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input
              v-model="stationForm.longitude"
              placeholder="请输入经度"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input
              v-model="stationForm.latitude"
              placeholder="请输入纬度"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="高程" prop="stationElevation">
            <el-input
              v-model="stationForm.stationElevation"
              placeholder="请输入高程"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="建站时间" prop="buildTime">
            <el-date-picker
                v-model="stationForm.buildTime"
                type="date"
                :disabled="title == '详情'"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="测项代码" prop="testCode">
            <el-input
              v-model="stationForm.testCode"
              placeholder="请输入测项代码"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="测项名称" prop="testName">
            <el-input
              v-model="stationForm.testName"
              placeholder="请输入测项名称"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="测点代码" prop="spotCode">
            <el-input
              v-model="stationForm.spotCode"
              placeholder="请输入测点代码"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="仪器名称" prop="apparatusName">
            <el-input
              v-model="stationForm.apparatusName"
              :disabled="title == '详情'"
              placeholder="请输入仪器名称"
            />
          </el-form-item>
          <el-form-item label="分量代码" prop="componentCode">
            <el-input
              v-model="stationForm.componentCode"
              placeholder="请输入分量代码"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="分量名称" prop="componentName">
            <el-input
              v-model="stationForm.componentName"
              placeholder="请输入分量名称"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="采样率" prop="samplingRate">
            <el-input
              v-model="stationForm.samplingRate"
              placeholder="请输入采样率"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <!-- <el-form-item label="起止时间" prop="beginEndTime">
            <el-input
              v-model="stationForm.beginEndTime"
              placeholder="请输入起止时间"
              :disabled="title == '详情'"
            />
          </el-form-item> -->
          <el-form-item label="场地类型" prop="landType">
            <el-input
              v-model="stationForm.landType"
              placeholder="请输入场地类型"
              :disabled="title == '详情'"
            />
          </el-form-item>
          <el-form-item label="是否需要辅助测项" prop="helpTest">
            <el-input
              v-model="stationForm.helpTest"
              placeholder="请输入是否需要辅助测项"
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
          <el-button type="primary" @click="submitForm">
            确 定
          </el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>

  <!-- 添加台站数据对话框 -->
  <el-dialog :title="'添加台站'" :visible.sync="open4" width="500px" append-to-body>
      <div class="upload" style="padding: 0 40px">
        <el-upload
          ref="upload2"
          class="upload-demo"
          drag
          :action="action2"
          :headers="headers"
          :limit="1"
          :file-list="fileList"
          :multiple="false"
          :auto-upload="false"
          :on-success="handleUploadSuccess"
          accept=".xls,.xlsx"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传XLS/XLSX文件  <b>且同个台站名字无需重复，只需填写一个</b></div>
        </el-upload>
        <p class="uploadText" style="color: red" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitStationFile"> 确 定 </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    </div>
  </template>
  
  <script>
  import {
    getStationList,
    delStation,
    addStation,
    editStation
  } from '@/api/workflow/underFluid.js'
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
        dataRange: null,
        // 查询台站参数
        networkOption: {
          netId: 1
        },
        // 查询参数
        queryParams2: {
          pageNum: 1,
          pageSize: 10,
          name: ''
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
        action2: 'http://user.earthquake.ac.cn' + '/precursorserver/upderFluid/station/importExcel',
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
        open4: false,
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
        // 表单参数
        stationForm: {
          id: null,
          networkCode: null,
          stationCode: null,
          stationName: null,
          longitude: null,
          latitude: null,
          stationElevation: null,
          buildTime: null,
          testCode: null,
          testName: null,
          spotCode: null,
          apparatusName: null,
          componentCode: null,
          componentName: null,
          samplingRate: null,
          beginEndTime: null,
          landType: null,
          helpTest: null,
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
      this.getList({page:1,limit:10})
    },
    methods: {
      /** 查询上报单位 */
      getList(page) {
        this.loading = true
        let par = {pageNum:page.page,pageSize:page.limit}
        if(this.queryParams2.name != ''){
          par.stationName = this.queryParams2.name
        }
        let data = encode(par)
        getStationList(data)
          .then((res) => {
            this.loading = false
            this.roleList = decode(res).records
            this.total = decode(res).total
          })
          .catch(() => {})
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
        this.stationForm.buildTime = new Date(this.stationForm.buildTime).toLocaleDateString()
        this.title = '详情'
        this.open = true
      },
      handleUploadData() {
  
      },
      handleUpLoad() {
        this.open4 = true
      },
      modelExcel() {
        window.open('http://www.earthquake.ac.cn/prodSer/downloadImage/?filename=地下流体批量上传_1697184727935.xlsx')
      },
      getPageList(page){
        this.loading = true
        this.networkOption.netId = this.companyLists[0].id
        this.nowId = this.companyLists[0].id  //当前查看的台站id
        this.networkOption = Object.assign({},this.networkOption,{pageNum: page.page,pageSize:page.limit})
        let datas = encode(this.networkOption)
        //如果是管理员的话，查询所有台站
        if(this.$store.state.user.name == "admin"){
          datas = {pageNum: page.page,pageSize:page.limit}
          this.nowId = null
        }
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
        console.log(e)
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
            this.roleList = arr
            this.loading = false
            this.activeName = 'station'
          })
          .catch((ree) => {
            this.$message.error('获取数据失败')
          })
        }
      },
      submitStationFile() {
        this.cancel()
        this.loading = true
        this.$refs.upload2.submit()
      },
      // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res == '添加成功') {
        this.$message.success('上传成功')
        this.fileList = []
        this.cancel()
        this.getList({page:1,limit:10})
      } else {
        if(res.code == '500'){
          this.$message.error(res.msg)
        }else{
          this.$message.error('上传失败, 请重试')
        }
        this.fileList = []
        // let p = document.querySelector('.uploadText')
        // p.innerHTML = res(/null/g, '数据为空')
        // this.text = res
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
      resetQuery() {
        this.queryParams2.name = ''
        this.getList({page:1,limit:10})
      },
      // 重置表单
      reset() {
        this.stationForm = {
          id: null,
          networkCode: null,
          stationCode: null,
          stationName: null,
          longitude: null,
          latitude: null,
          stationElevation: null,
          buildTime: null,
          testCode: null,
          testName: null,
          spotCode: null,
          apparatusName: null,
          componentCode: null,
          componentName: null,
          samplingRate: null,
          beginEndTime: null,
          landType: null,
          helpTest: null,
        }
        this.networkForm = {
          id: null,
          netCode: null,
          netName: null,
          sortNum: null
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
          // if(!this.nowId){
          //   this.$message.error('请选择一个台网后再新增')
          //   return
          // }
          this.open = true
        }
  
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
          this.stationForm = {...row}
          this.open = true
          this.title = '修改台站信息'
      },
      delstation(item) {
        const self = this
        this.$modal
            .confirm('是否确认删除名为"' + item.stationName + '"的台站？')
            .then(() => {
              delStation(encode({id:item.id})).then((res) => {
                self.$modal.msgSuccess('删除成功')
                self.getList({page:1,limit:10})
              })
            })
            .catch(() => {})
      },
  
      /** 提交按钮 */
      submitForm() {
        this.$refs['stationForm'].validate((valid) => {
          if (valid) {
            if(this.title == '新增数据'){
              this.open = false
              addStation(encode(this.stationForm)).then((res) => {
                this.$modal.msgSuccess('新增成功')
                this.getList({page:1,limit:10})
              })
            }else{
              this.open = false
              editStation(encode(this.stationForm)).then((res) => {
                this.$modal.msgSuccess('修改成功')
                this.getList({page:1,limit:10})
              })
            }
            
          }
        })
      },
      submitLoad() {
        this.$refs.upload.submit()
      },
      handleDelete2(row) {
        this.delRow = {...row}
        this.open3 = true
      },
      /** 删除按钮操作 */
      handleDelete(row) {
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
              self.getList({page:1,limit:10})
              self.$modal.msgSuccess('清除数据成功')
            })
          }else{
            self.$modal.msgError('输入台站名有误')
          }
        }).catch(() => {
     
        });
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
  