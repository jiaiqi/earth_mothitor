<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
    >
      <!-- <el-form-item label="上报单位" prop="company">
        <el-select
          v-model="queryParams.company"
          style="width: 240px"
          placeholder="请选择上报单位"
          clearable
          @change="changeCompany"
        >
          <el-option
            v-for="dict in companys"
            :key="dict.id"
            :label="dict.unitName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="台网" prop="companyList">
        <el-select
          v-model="queryParams.companyList"
          style="width: 240px"
          placeholder="请选择台网"
          clearable
          @change="handleNodeClick"
        >
          <el-option
            v-for="dict in companyLists"
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
          v-hasPermi="['upLoad:seismogarray:list']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >
          新增数据
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:seismogarray:list']"
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['upLoad:seismogarray:list']"
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

    <el-table
      v-if="netId !== undefined"
      v-loading="loading"
      :data="roleList"
      height="600"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="台站编码" prop="staCode" />

      <el-table-column label="采样率（HZ）" prop="sampling" />
      <el-table-column label="高程(m)" prop="staHeigth" />
      <el-table-column label="纬度(°)" prop="staLat" />
      <el-table-column label="经度(°)" prop="staLon" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
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
            v-hasPermi="['upLoad:seismogarray:list']"
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
    <div v-if="netId === undefined" style="color: red; padding: 20px">
      请选择台网
    </div>
    <!-- 添加或修改台站数据对话框 -->

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <div v-if="title !== '修改台站信息'" style="padding: 15px">
        <el-radio v-model="upradio" label="1">txt文件</el-radio>
        <el-radio v-model="upradio" label="2">XLS文件</el-radio>
      </div>
      <div class="upload" style="padding: 0 40px">
        <el-upload
          v-if="upradio === '1'"
          ref="upload"
          class="upload-demo"
          drag
          :action="action1"
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
          accept=".txt"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传TXT文件</div>
        </el-upload>
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
import {
  getarrayunit,
  getarraynetwork,
  getArraystation,
  delArraystation
} from '@/api/dataup/seismogarray.js'
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
      // 遮罩层
      loading: true,
      // 上传台站方式
      upradio: '',
      // 上传格式
      upradioType: '',
      // 文件上传地址
      action: process.env.VUE_APP_SEISM_API + '/arraystation/data/import',
      action1: process.env.VUE_APP_SEISM_API + '/arraycatalogdata/import',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      isUploading: false,
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
        company: null,
        companyList: null
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

  watch: {},
  created() {
    // this.getList()
    this.changeCompany()
  },

  methods: {
    /** 查询上报单位 */
    getList() {
      // this.loading = true
      let data = encode({})
      getarrayunit(data)
        .then((res) => {
          this.companys = decode(res)
          this.$message.success('获取成功')
        })
        .catch(() => {})
    },
    // 选中上报单位 获取台网
    changeCompany() {
      // let datas = encode({ id: e })
      getarraynetwork(encode({})).then((res) => {
        this.companyLists = decode(res)
        this.$message.success('获取成功')
      })
    },
    // 选中台网 获取台站
    handleNodeClick(e) {
      this.networkOption.netId = e
      this.netId = e
      let datas = encode(this.networkOption)
      getArraystation(datas)
        .then((res) => {
          let arr = decode(res)
          this.roleList = arr
          this.loading = false
          this.$message.success('获取成功')
        })
        .catch((ree) => {
          this.$message.error('获取数据失败')
        })
    },
    // 刷新
    refresh() {
      if (!this.netId) {
        this.$message.error('请先选择台网')
      } else {
        let datas = encode({ netId: this.netId })
        getArraystation(datas)
          .then((res) => {
            let arr = decode(res)
            this.roleList = arr
            this.loading = false
            this.$message.success('获取成功')
          })
          .catch((ree) => {
            this.$message.error('获取数据失败')
          })
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
    // 上传
    submitLoad() {
      this.$refs.upload.submit()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let name = row.staName
      let id = row.id
      this.$modal
        .confirm('是否确认删除名为"' + name + '"的台站吗？')
        .then(() => {
          return delArraystation(encode({ id: id }))
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
