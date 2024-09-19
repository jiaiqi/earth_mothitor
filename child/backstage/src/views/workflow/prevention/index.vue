<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
    >
      <el-form-item label="单位名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入单位名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['workflow:prevention:list']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['workflow:prevention:list']"
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
          v-hasPermi="['workflow:prevention:list']"
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

    <el-table v-loading="false" :data="roleList" height="600">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单位名称" prop="staName" />
      <el-table-column label="链接地址" prop="staCode" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-if="scope.row.roleId !== 1" slot-scope="scope">
          <el-button
            v-hasPermi="['workflow:prevention:list']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-hasPermi="['workflow:prevention:list']"
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
    <!-- 添加或修改对话框 -->
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
            onkeyup="this.value=this.value.replace(/[^A-Z]/g,'')"
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
        <p class="uploadText" style="color: red" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="upradio === '1'" type="primary" @click="submitForm">
          确 定
        </el-button>
        <el-button v-if="upradio === '2'" type="primary" @click="submitLoad">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCompany,
  getCompanyList,
  getStation,
  addStation,
  delStation,
  updataStation
} from '@/api/workflow/selsmometry.js'
import { getToken } from '@/utils/auth'
import { encode, decode } from '@/utils/base/dataEncry.js'
export default {
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
      // 文件上传地址
      action: process.env.VUE_APP_SEIS_API + '/station/importstationdata',
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
        roleName: null
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
  created() {
    this.getList()
  },
  methods: {
    // 按条件查询
    handleQuery() {},
    /** 查询上报单位 */
    getList() {
      // this.loading = true
      let data = encode({})
      getCompany(data)
        .then((res) => {
          this.companys = decode(res)
          this.$message.success('获取成功')
        })
        .catch(() => {})
    },
    // 选中上报单位 获取台网
    changeCompany(e) {
      let datas = encode({ id: e })
      getCompanyList(datas).then((res) => {
        this.companyLists = decode(res)
        this.$message.success('获取成功')
      })
    },
    // 选中台网 获取台站
    handleNodeClick(e) {
      this.networkOption.netId = e
      this.netId = e
      let datas = encode(this.networkOption)
      getStation(datas)
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
        this.$message.error('请先选择上报单位和台网')
      } else {
        let datas = encode({ netId: this.netId })
        getStation(datas)
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
      // this.$message.success(`${res}`)
      if (res.code === 200) {
        this.$message.success('上传成功')
        this.isUploading = false
        this.fileList.push({ name: file.name, uid: res.uid })
        // this.refresh()
        // this.open = false
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
    },
    /** 新增按钮操作 */
    handleAdd() {
      if (!this.netId) {
        this.$message.error('请先选择上报单位和台网')
      } else {
        this.reset()
        this.open = true
        this.title = '新增台站'
      }
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

    /** 提交按钮 */
    submitForm() {
      this.$refs['stationForm'].validate((valid) => {
        if (valid) {
          if (this.title !== '新增台站') {
            updataStation(encode(this.stationForm)).then((res) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.handleNodeClick(this.networkOption.netId)
            })
          } else {
            this.stationForm.netId = this.networkOption.netId
            addStation(encode(this.stationForm)).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.handleNodeClick(this.networkOption.netId)
              this.reset()
            })
          }
        }
      })
    },
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
          return delStation(encode({ id: id }))
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
