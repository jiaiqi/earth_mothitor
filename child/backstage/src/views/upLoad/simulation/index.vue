<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
    >
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          style="width: 240px"
          placeholder="请选择类型"
          clearable
          @change="changeType"
        >
          <el-option label="流动站" value="1" />
          <el-option label="连续站" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="companys.length !== 0"
        label="上报单位"
        prop="company"
      >
        <el-select
          v-if="queryParams.type === '1'"
          v-model="queryParams.company"
          style="width: 240px"
          placeholder="请选择上报单位"
          clearable
          @change="changeCompany"
        >
          <el-option
            v-for="dict in companys"
            :key="dict.f_unit_id"
            :label="dict.f_unit_name"
            :value="dict.f_unit_id"
          />
        </el-select>
        <el-select
          v-else
          v-model="queryParams.company"
          style="width: 240px"
          placeholder="请选择上报单位"
          clearable
          @change="changeCompany"
        >
          <el-option
            v-for="dict in companys"
            :key="dict.c_unit_id"
            :label="dict.c_unit_name"
            :value="dict.c_unit_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="networKogger.length !== 0" label="台网" prop="company">
        <el-select
          v-if="queryParams.type !== '1'"
          v-model="queryParams.network"
          style="width: 240px"
          placeholder="请选台网"
          clearable
          @change="changeNetwork"
        >
          <el-option
            v-for="dict in networks"
            :key="dict.id"
            :label="dict.netName"
            :value="dict.id"
          />
        </el-select>
        <el-select
          v-else
          v-model="queryParams.network"
          style="width: 240px"
          placeholder="请选台网"
          clearable
          @change="changeNetwork"
        >
          <el-option
            v-for="dict in networks"
            :key="dict.id"
            :label="dict.netName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:simulation:list']"
          type="primary"
          plain
          icon="el-icon-plus"
          :disabled="show"
          size="mini"
          @click="handleAdd"
        >
          新增数据
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:simulation:list']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >
          删除
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="refresh" />
    </el-row>

    <div v-if="show" style="color: red; padding: 20px">
      请依次选择类型及上报单位
    </div>
    <el-table v-else v-loading="loading" :data="roleList" height="600">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="55" align="center" label="#" />
      <el-table-column label="测站名称" prop="pointName" />
      <el-table-column label="测站编号" prop="pointCode" />
      <el-table-column label="纬度" prop="lat">
        <template slot-scope="scope">
          <span>{{ scope.row.lat.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经度" prop="lon">
        <template slot-scope="scope">
          <span>{{ scope.row.lon.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="观测日期" align="center" prop="cTime" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.cTime).split(' ')[0] }}</span>
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
            v-hasPermi="['upLoad:simulation:list']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改台站数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <small style="color: red">先上传点再上传数据</small>
      <div style="padding: 15px">
        <el-radio v-model="upradio" label="1">上传数据</el-radio>
        <el-radio v-model="upradio" label="2">上传点数据</el-radio>
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
          <div slot="tip" class="el-upload__tip">只能上传XLS/XLSX文件</div>
        </el-upload>
        <p class="uploadText" style="color: red" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLoad"> 确 定 </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getContinuous, getContinuousList, getContinuousNet, getFlow, getFlowGnss, getFlowNet} from '@/api/dataup/gnss'
import {Loading} from 'element-ui';
import {getToken} from '@/utils/auth'
import {decode, encode} from '@/utils/base/dataEncry.js'

export default {
  name: 'Gnss',
  components: {},
  data() {
    return {
      // 上报单位
      companys: [],
      // 台网
      networks: [],
      // 台网
      companyLists: [],
      // 当前台网id
      show: true,
      // 遮罩层
      loading: true,
      // 上传台站方式
      upradio: '',
      // 上传格式
      upradioType: '',
      // 文件上传地址
      action: process.env.VUE_APP_STAND_API + 'levelline/importleveline',
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
      // 返回提示
      text: '',
      // 查询参数
      queryParams: {
        type: '',
        company: null,
        companyList: null
      },
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
      }
    }
  },
  watch: {
    upradio(newVal) {
      if (this.queryParams.type === '2') {
        if (newVal === '1') {
          // 数据
          this.action =
            process.env.VUE_APP_GNSS_API + '/gnss/continuousdata/data/import '
        } else if (newVal === '2') {
          // 点
          this.action =
            process.env.VUE_APP_GNSS_API + '/gnss/continuouspoint/data/import '
        }
      } else if (this.queryParams.type === '1') {
        if (newVal === '1') {
          // 数据
          this.action = process.env.VUE_APP_GNSS_API + '/gnss/flow/data/import'
        } else if (newVal === '2') {
          // 点
          this.action = process.env.VUE_APP_GNSS_API + '/gnss/flow/point/import'
        }
      }
    }
  },
  created() {},
  methods: {
    // 选择类型
    changeType(e) {
      this.companys = []
      this.queryParams.network = ''
      this.queryParams.company = ''
      if (e === '2') {
        this.getList()
      } else {
        this.getList1()
      }
    },
    /** 查询上报单位 */
    getList() {
      let data = encode({})
      const loading = Loading.service({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.9)'
      });
      getContinuous(data)
        .then((res) => {
          this.companys = decode(res)
          this.$message.success('获取成功')
          loading.close();
        })
        .catch(() => {})
    },
    getList1() {
      let data = encode({})
      const loading = Loading.service({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.9)'
      });
      getFlow(data)
        .then((res) => {
          this.companys = decode(res)
          this.$message.success('获取成功')
          loading.close();
        })
        .catch(() => {})
    },
    // 选中上报单位 获取台网
    changeCompany(e) {
      const loading = Loading.service({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.9)'
      });
      if (this.queryParams.type !== '2') {
        let datas = encode({ f_unit_id: e })
        getFlowNet(datas).then((res) => {
          let list = decode(res)
          this.networks = list
          this.$message.success('获取成功')
          loading.close();
        })
      } else {
        let datas = encode({ c_unit_id: e })
        getContinuousNet(datas).then((res) => {
          let list = decode(res)
          this.networks = list
          this.$message.success('获取成功')
          loading.close();
        })
      }
    },
    // 选中台网 获取台站
    changeNetwork(e) {
      this.show = false
      if (this.queryParams.type !== '2') {
        let datas = encode({ f_unit_id: this.queryParams.company, net_id: e })
        getFlowGnss(datas).then((res) => {
          let list = decode(res)
          this.roleList = list
          this.loading = false
          this.$message.success('获取成功')
        })
      } else {
        let datas = encode({ c_unit_id: this.queryParams.company, net_id: e })
        getContinuousList(datas).then((res) => {
          let list = decode(res)
          this.roleList = list
          this.loading = false
          this.$message.success('获取成功')
        })
      }
    },

    // 刷新
    refresh() {
      if (this.show) {
        this.$message.error('请先选择上报单位')
      } else {
        this.show = false
        // let datas = encode({ id: this.queryParams.company })
        // getCompany(datas).then((res) => {
        //   let list = decode(res.data)
        //   this.roleList = list
        //   this.loading = false

        //   this.$message.success('获取成功')
        // })
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
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
      if (res === 200) {
        this.$message.success('上传成功')
        this.fileList = []
        this.cancel()
        this.loading = true
        this.refresh()
      } else {
        this.$message.error('上传失败, 请重试')
        this.fileList = []
        // let p = document.querySelector('.uploadText')
        // p.innerHTML = res(/null/g, '数据为空')
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
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '新增数据'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
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
    },
    // 处理时间
    setTime(time) {
      let date = new Date(time)
      let year = date.getFullYear()
      let mon = date.getMonth()
      let day = date.getDate()
      if (mon < 10) {
        mon = `0${mon}`
      }
      if (day < 10) {
        day = `0${day}`
      }
      return `${year}-${mon}-${day}`
    },
    /** 提交按钮 */
    submitLoad() {
      this.$refs.upload.submit()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let name = row.lineName
      // let id = row.id
      this.$modal
        .confirm('是否确认删除名为"' + name + '"的测线吗？')
        .then(() => {
          // return delStation(encode({ id: id }))
        })
        .then(() => {
          this.handleNodeClick(this.networkOption.netId)
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
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
