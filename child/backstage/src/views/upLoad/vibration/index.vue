<template>
  <div class="app-container">
      <el-button
          v-hasPermi="['upLoad:vibration:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          class="importData"
          @click="handleAdd(1)"
        >
          导入数据
        </el-button>
        <el-button class="importData" size="mini" type="warning" @click="modelExcel">模板下载</el-button>
    <el-tabs v-model="activeName" type="card" @tab-click="handleChangeClick">
      <el-tab-pane label="事件列表" name="effect" v-if="showEffect">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
    >
      <el-form-item label="年份" prop="company">
        <el-select
          v-model="queryParams.company"
          style="width: 240px"
          placeholder="选择一个或多个年"
          multiple
          @visible-change="blurValue"
          @remove-tag="removerValue"
        >
          <el-option
            v-for="dict in companys"
            :key="dict.id"
            :label="dict.year"
            :value="dict.year"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:vibration:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          :disabled="disabledAdd"
          size="mini"
          @click="handleAdd(1)"
        >
          新增数据
        </el-button>
      </el-col>

      <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:vibration:del']"
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
      <!-- <right-toolbar :show-search.sync="showSearch" @queryTable="refresh" /> -->
    </el-row>
    <div v-if="disabledAdd" style="color: red">请先选择查看年份</div>
    <el-table v-else v-loading="loading" :data="roleList" height="600">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="55" align="center" label="#" />
      <el-table-column prop="shockAddr" label="发震地点" />
      <el-table-column prop="shockLevel" label="震级" sortable />
      <el-table-column prop="depth" label="地震深度(km)" sortable />
      <el-table-column prop="shockDate" label="发震时间" sortable>
        <template slot-scope="scope">
          {{ scope.row.shockDate }} {{ scope.row.shockTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="100"
      >
        <template v-if="scope.row.roleId !== 1" slot-scope="scope">
          <!-- <el-button
            v-hasPermi="['system:role:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >
            修改
          </el-button> -->
          <el-button
            v-hasPermi="['upLoad:vibration:del']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleEffectDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-tab-pane>
  <el-tab-pane label="台站列表" name="station" v-if="showStation">
    <el-form :model="queryParams2" ref="queryForm" size="small" :inline="true">
        <el-form-item label="台站名称" prop="name">
          <el-input
            v-model="queryParams2.name"
            placeholder="请输入台站名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="台网名称" prop="net">
          <el-input
            v-model="queryParams2.net"
            placeholder="请输入台网名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getStationList({page:1,limit:10})">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:vibration:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(2)"
        >
          新增数据
        </el-button>
      </el-col>
      <el-dialog title="模板下载" :visible.sync="open4" @close="open4 = false" width="1000px" append-to-body>
          <div>
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
      :data="stationList"
      height="600"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="台网" prop="netName" />
      <el-table-column label="台站编码" prop="staCode" />
      <el-table-column label="台站名称" prop="staName" />
      <el-table-column label="纬度(°)" prop="lat" />
      <el-table-column label="经度(°)" prop="lon" />
      <el-table-column label="台站类型" prop="staType" />
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
            v-hasPermi="['upLoad:vibration:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-hasPermi="['upLoad:vibration:del']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
          <!-- <el-button
            v-hasPermi="['upLoad:vibration:index']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDataDel2(scope.row)"
          >
            清除数据
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="pages.pageNum" :limit.sync="pages.pageSize"
              @pagination="getStationList" />
    <!-- 清除强震数据 -->
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
        <el-button type="primary" @click="handleDataDel(delRow)">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改台站数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>

      <el-form
        ref="stationForm"
        :model="stationForm"
        label-width="100px"
      >
        <el-form-item label="台站代码" prop="staCode">
          <el-input
            v-model="stationForm.staCode"
            :disabled="title == '详情'"
            placeholder="请输入台站代码"
            maxlength="16"
          />
        </el-form-item>
        <el-form-item label="台站名称" prop="staName">
          <el-input
          :disabled="title == '详情'"
            v-model="stationForm.staName"
            placeholder="请输入台站名称"
          />
        </el-form-item>
        <el-form-item label="观测环境" prop="staArchitecture">
          <el-input
          :disabled="title == '详情'"
            v-model="stationForm.staArchitecture"
            type="textarea"
            placeholder="请输入观测环境"
          />
        </el-form-item>
        <el-form-item label="高程" prop="height">
          <el-input
          :disabled="title == '详情'"
            v-model="stationForm.height"
            placeholder="请输入高程"
          />
        </el-form-item>
        <el-form-item label="台站纬度" prop="lat">
          <el-input
            v-model="stationForm.lat"
            type="Number"
            :disabled="title == '详情'"
            placeholder="请输入台站纬度"
          />
        </el-form-item>
        <el-form-item label="台站经度" prop="lon">
          <el-input
            v-model="stationForm.lon"
            type="Number"
            :disabled="title == '详情'"
            placeholder="请输入台站经度"
          />
        </el-form-item>
        <el-form-item label="台基类型" prop="staType">
          <el-input
            v-model="stationForm.staType"
            :disabled="title == '详情'"
            placeholder="请输入台基类型"
          />
        </el-form-item>
        <el-form-item label="台网名称" prop="netName">
          <el-input
            v-model="stationForm.netName"
            :disabled="title == '详情'"
            placeholder="请输入台网名称"
          />
        </el-form-item>
        <el-form-item label="台网代码" prop="netCode">
          <el-input
            v-model="stationForm.netCode"
            :disabled="title == '详情'"
            placeholder="请输入台网代码"
          />
        </el-form-item>
        <el-form-item label="台站等级" prop="staLevel">
          <el-input
            v-model="stationForm.staLevel"
            :disabled="title == '详情'"
            placeholder="请输入台站等级"
          />
        </el-form-item>
        <!-- <el-form-item label="备注">
          <el-input
            v-model="stationForm.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item> -->
      </el-form>
      <div v-if="title != '详情'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改台站数据对话框 -->
    <el-dialog :title="title" :visible.sync="open2" width="500px" append-to-body>
      <div style="padding: 15px">
        <el-radio v-model="upradio" label="1">上传台站数据</el-radio>
        <el-radio v-model="upradio" label="2">上传事件数据</el-radio>
      </div>
      <div class="upload" style="padding: 0 40px">
        <el-upload
          v-if="upradio !== ''"
          ref="upload"
          class="upload-demo"
          drag
          :action="action"
          :headers="headers"
          :limit="1"
          :file-list="fileList"
          :multiple="false"
          :auto-upload="false"
          :on-error="handleUploadError"
          :on-progress="handleFileUploadProgress"
          :on-exceed="handleExceed"
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
        <el-button type="primary" @click="submitLoad"> 确 定 </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import { getyear, getVibration, getpStationList, addStation, editStation, delStation, delByStaId, delEffect} from '@/api/dataup/vibration'
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
      stationList: [],
      // 当前台网id
      disabledAdd: true,
      // 遮罩层
      loading: false,
      //台站权限
      showStation: true,
      //事件权限
      showEffect: true,
      // 上传台站方式
      upradio: '',
      // 上传格式
      upradioType: '',
      pages: {
        pageNum: 1,
        pageSize: 10,
      },
      model: [
        {
          name: '强震动台站模板',
          url: 'http://www.earthquake.ac.cn/prodSer/downloadImage/?filename=强震台站批量上传_1697182943718.xlsx'
        },
        {
          name: '强震动事件模板',
          url: 'http://www.earthquake.ac.cn/prodSer/downloadImage/?filename=强震事件批量上传_1700191587701.xlsx'
        }
      ],
      activeName: 'effect',
      // 文件上传地址
      action: process.env.VUE_APP_VIBRA_API + 'shockcatalogdata/data/import',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
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
      open4: false,
      dataRange: null,
      // 返回提示
      text: '',
      // 查询参数
      queryParams2: {
        name: '',
        net: ''
      },
      // 查询参数
      queryParams: {
        company: null,
        companyList: null
      },
      // 表单参数
      stationForm: {
        cTime: null,
        id: null,
        netName: null,
        staCode: null,
        netCode: null,
        height: null,
        staName: null,
        staArchitecture: null,
        lat: null,
        lon: null,
        staType: null,
        staLevel: null,
      }
    }
  },
  watch: {
    upradio(newVal) {
      if (newVal === '1') {
        // 台站
        this.action =
          process.env.VUE_APP_VIBRA_API + '/strongserver/pStation/importExcel'
      } else if (newVal === '2') {
        // 事件
        this.action =
          process.env.VUE_APP_VIBRA_API + '/strongserver/shockcatalogdata/data/import'
      }
    }
  },
  created() {
    this.getyear()
    //超级管理员
    if(this.$store.state.user.permissions[0] == '*:*:*'){
      return
    }
    if(!this.$store.state.user.permissions.includes('upLoad:vibration:station')){
      this.showStation = false
    }
    if(!this.$store.state.user.permissions.includes('upLoad:vibration:effect')){
      this.showEffect = false
    }
  },
  methods: {
    /** 获取年 */
    getyear() {
      getyear()
        .then((res) => {
          let list = res
          let arr = []
          for (let i = 0; i < list.length; i++) {
            arr.push({ year: list[i], id: i + 1 })
          }
          this.companys = arr
          this.$message.success('获取成功')
        })
        .catch(() => {})
    },
    //获取台站列表
    getStationList(page) {
      this.loading = true
      let par = {
        pageNum: page.page,
        pageSize: page.limit
      }
      if(this.queryParams2.name != ''){
        par.staName = this.queryParams2.name
      }
      if(this.queryParams2.net != ''){
        par.netName = this.queryParams2.net
      }
      getpStationList(encode(par))
        .then((res) => {
          this.stationList = decode(res).records
          this.loading = false
          this.total = decode(res).total
        })
        .catch(() => {})
    },
    resetQuery() {
      this.queryParams2.name = ''
      this.queryParams2.net = ''
      this.getStationList({page:1,limit:10})
    },
    // 下拉框收起 获取事件
    blurValue(e) {
      if (!e) {
        this.loading = true
        if (this.queryParams.company.length > 0) {
          let data = this.queryParams.company
          getVibration(data).then((res) => {
            let list = res
            console.log(list)
            list.forEach((item) => {
              item.shockDate = this.setTime(item.shockDate)
              item.shockTime = this.setDate(item.shockTime)
            })

            this.$message.success('获取成功')
            this.roleList = list
            this.loading = false
            this.disabledAdd = false
          })
        }
      }
    },
    // 移除选项
    removerValue(e) {
      this.loading = true
      if (this.queryParams.company.length !== 0) {
        let data = this.queryParams.company
        getVibration(data).then((res) => {
          let list = res
          list.forEach((item) => {
            item.shockDate = this.setTime(item.shockDate)
            item.shockTime = this.setDate(item.shockTime)
          })
          this.$message.success('获取成功')
          this.roleList = list
          this.loading = false
          this.disabledAdd = false
        })
      }
    },
    //详情
    handleCheck(row){
      this.title = '详情'
      this.stationForm = row
      this.open = true
    },
    submitForm() {
      this.loading = true
      if (this.title !== '新增数据') {
        this.open = false
        editStation(encode(this.stationForm)).then((res) => {
          this.$modal.msgSuccess('修改成功')
          this.loading = false
          this.getStationList({page:1,limit:10})
        })
      } else {
        this.open = false
        addStation(encode(this.stationForm)).then((response) => {
          this.$modal.msgSuccess('新增成功')
          this.loading = false
          this.reset()
          this.getStationList({page:1,limit:10})
        })
      }
    },
    handleChangeClick(e) {
      if(e.index == 0) {
        this.getyear()
      }
      if(e.index == 1) {
        this.getStationList({page:1,limit:10})
      }
    },
    // 刷新
    refresh() {
      if (this.disabledAdd) {
        this.$message.error('请先选择年分')
      } else {
        this.disabledAdd = false
        let data = this.queryParams.company
        getVibration(data).then((res) => {
          let list = res
          list.forEach((item) => {
            item.shockDate = this.setTime(item.shockDate)
            item.shockTime = this.setDate(item.shockTime)
          })
          this.roleList = list
          this.loading = false

          this.$message.success('获取成功')
        })
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
      this.$message.error(`一次只能上传一个文件`)
    },
    // 上传失败
    handleUploadError(err) {
      this.$message.error('上传失败, 请重试')
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      let p = document.querySelector('.uploadText')
      p.innerHTML = ''
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if(this.upradio == '1'){
        if (res == '添加成功') {
          this.$message.success('上传成功')
          this.fileList = []
          this.cancel()
          this.getStationList({page:1,limit:10})
        } else {
          if(res.code == '500'){
            this.$message.error(res.msg)
          }else{
            this.$message.error('上传失败, 请重试')
          }
            this.fileList = []
            this.cancel()
          // let p = document.querySelector('.uploadText')
          // p.innerHTML = res(/null/g, '数据为空')
          // this.text = res
        }
      }else{
        this.$message.success('上传成功')
        this.getyear()
          this.fileList = []
          this.cancel()
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
        cTime: null,
        id: null,
        netName: null,
        staCode: null,
        netCode: null,
        staName: null,
        height: null,
        staArchitecture: null,
        lat: null,
        lon: null,
        staType: null,
        staLevel: null,
      }
    },
    modelExcel() {
      this.open4 = true
    },
    /** 新增按钮操作 */
    handleAdd(type) {
      if(type == 1){
        this.open2 = true
        this.title = '新增数据'
      }
      if(type == 2){
        this.reset()
        this.open = true
        this.title = '新增数据'
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.stationForm = {
        cTime: row.cTime,
        id: row.id,
        netName: row.netName,
        staCode: row.staCode,
        netCode: row.netCode,
        staName: row.staName,
        height: row.height,
        staArchitecture: row.staArchitecture,
        lat: row.lat,
        lon: row.lon,
        staType: row.staType,
        staLevel: row.staLevel,
      }
      this.open = true
      this.title = '修改台站信息'
    },
    // 处理时间
    setTime(time) {
      let date = new Date(time)
      let year = date.getFullYear()
      let mon = date.getMonth() + 1
      let day = date.getDate()
      if (mon < 10) {
        mon = `0${mon}`
      }
      if (day < 10) {
        day = `0${day}`
      }
      return `${year}-${mon}-${day}`
    },
    setDate(time) {
      let date = new Date(time)
      let hour = date.getHours()
      let min = date.getMinutes()
      let sec = date.getSeconds()
      hour = this.checkTime(hour)
      min = this.checkTime(min)
      sec = this.checkTime(sec)

      return `${hour}:${min}:${sec}`
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    /** 提交按钮 */
    submitLoad() {
      this.cancel()
      this.$refs.upload.submit()
    },
    handleDataDel2(row) {
      this.delRow = {...row}
      this.open3 = true
    },
    handleDataDel(row){
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
        let par = 'staId='+id+'&beginEndTime='+data
        
        this.$modal
          .confirm('是否确认清除名为"' + name + '"的台站下的数据？')
          .then(() => {
            self.confirmDel(name,par)
          })
          .catch(() => {})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let name = row.staName
      // let id = row.id
      this.$modal
        .confirm('是否确认删除名为"' + name + '"的台站吗？')
        .then(() => {
          // return delStation(encode({ id: id }))
        })
        .then(() => {
          let par = {
            id: row.id
          }
          this.loading = true
          delStation(encode(par)).then((response) => {
            this.$modal.msgSuccess('删除成功')
            this.open = false
            this.loading = false
            this.getStationList({page:1,limit:10})
            // this.handleNodeClick(this.networkForm.id)
            this.reset()
          })
        })
        .catch(() => {})
    },
    /** 删除事件操作 */
    handleEffectDelete(row) {
      let name = row.shockAddr
      // let id = row.id
      this.$modal
        .confirm('是否确认删除"' + name + '"事件吗？')
        .then(() => {
          // return delStation(encode({ id: id }))
        })
        .then(() => {
          let par = {
            id: row.id
          }
          this.loading = true
          delEffect(encode(par)).then((response) => {
            this.$modal.msgSuccess('删除成功')
            this.loading = false
            this.blurValue()
            this.getyear()
          })
        })
        .catch(() => {})
    },
    confirmDel(name,par) {
      const self = this
      this.$prompt('请重新输入并确认要删除的台站名：', '删除数据确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if(value == name){
          delByStaId(par).then(() => {
            self.getStationList({page:1,limit:10})
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
.importData {
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
