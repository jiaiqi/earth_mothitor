<template>
  <div class="app-standard">
    <div v-if="showIfr" class="iframe">
      <iframe :src="previewUrl" width="1000" height="600"></iframe>
    </div>
    <i v-if="showIfr" class="el-icon-error" style="position:relative;top:30px;left:1280px;z-index: 1800;font-size: 28px;" @click="close"></i>
    <!-- 搜索 -->
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
    >
      <el-form-item label="文件类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择文件类型"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.type"
            :label="item.title"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="filename">
        <el-input
          v-model="queryParams.filename"
          placeholder="请输入文件名称"
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
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 操作 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['upLoad:criterion:upload']"
        >
          上传数据
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      height="700"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="标准编号"
        prop="nationalStandard"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="标准名称"
        prop="title"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="标准类型"
        width="120px"
        align="center"
        prop="type"
        column-key="type"
        :filters="[
          { text: '国家标准', value: '0' },
          { text: '行业标准', value: '1' },
          { text: '地方标准', value: '2' }
        ]"
        :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '0'">国家标准</el-tag>
          <el-tag v-else-if="scope.row.type === '1'" type="success">
            行业标准
          </el-tag>
          <el-tag v-else type="warning">地方标准</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="业务领域"
        prop="businessarea"
        align="center"
        width="150px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="承担单位"
        prop="undertaker"
        align="center"
        :show-overflow-tooltip="true"
        width="180px"
      />
      <el-table-column
        label="实施日期"
        align="center"
        prop="implDate"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.implDate).split(' ')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type !== '0'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >
            查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasPermi="['upLoad:criterion:delete']"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 上传数据 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogOpen"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标准编号" prop="nationalStandard">
          <el-input
            v-model="form.nationalStandard"
            placeholder="例DB_T 1－2008"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
            :disabled="isCheck"
          />
        </el-form-item>
        <el-form-item label="标准名称" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入标准名称"
            clearable
            :disabled="isCheck"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="业务领域" prop="businessarea">
          <el-select
            v-model="form.businessarea"
            placeholder="请选择业务领域"
            clearable
            :disabled="isCheck"
            style="width: 240px"
          >
            <el-option
              v-for="item in options2"
              :label="item.title"
              :value="item.title"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文件类型" prop="type" >
          <el-select
            v-model="form.type"
            :disabled="true"
            v-if="isCheck"
            style="width: 240px"
          >
          <el-option
              key="0"
              label="国家标准"
              value="0"
            />
            <el-option
              key="1"
              label="行业标准"
              value="1"
            />
            <el-option
              key="2"
              label="地方标准"
              value="2"
            />
          </el-select>
          <el-select
            v-model="form.type"
            placeholder="请选择文件类型"
            clearable
            v-else="isCheck"
            :disabled="isCheck"
            style="width: 240px"
          >
            <el-option
              v-for="item in options"
              :key="item.type"
              :label="item.title"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布日期" prop="releaseTime">
          <el-date-picker
            v-model="form.releaseTime"
            type="date"
            :disabled="isCheck"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实施日期" prop="implDate">
          <el-date-picker
            v-model="form.implDate"
            type="date"
            :disabled="isCheck"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文件上传" prop="filename">
          <el-upload
            ref="upload"
            class="upload-demo"
            v-if="!isCheck"
            drag
            :action="action"
            :headers="headers"
            :limit="1"
            :file-list="fileList"
            :multiple="false"
            :disabled="isUploading"
            :on-error="handleUploadError"
            :on-progress="handleFileUploadProgress"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            accept=".pdf"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
          </el-upload>
          <label class='filelist'><a href="javascript:void(0)" @click="handleSee(form)">{{ form.filename }}</a></label>
        </el-form-item>
      </el-form>
      <div class="upload" style="padding: 0 40px" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="!isCheck" @click="submitForm">导入列表</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStandard,
  addStandard,
  delStandard,
  seeStandard,
  downStandard
} from '@/api/dataup/criterion'
import { getToken } from '@/utils/auth'
import { encode, decode } from '@/utils/base/dataEncry.js'
// import { getUser } from '@/utils/auth.js'
export default {
  name: 'Seismometry',
  data() {
    return {
      // 遮罩层
      loading: false,
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
      // 表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      dialogOpen: false,
      // 文件上传地址
      action: process.env.VUE_APP_CRIT_API + '/fileservice/fileservice/ecupload',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      //浏览路径
      previewUrl: '',
      // 文件上传的附加参数
      objectData: {},
      // 是否禁用
      isUploading: false,
      showIfr: false,
      // 上传文件列表
      fileList: [],
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      isCheck: false,
      // 日期范围
      dateRange: [],
      // 菜单列表
      menuOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        filename: '',
        type: undefined
      },
      // 表单参数
      form: {
        nationalStandard:'',
        title:'',
        type: '',
        businessarea: '',
        releaseTime: '',
        implDate: '',
        filename: null
      },
      options: [
        { type: 0, title: '国家标准' },
        { type: 1, title: '行业标准' },
        { type: 2, title: '地方标准' }
      ],
      options2: [
        { title: '基础通用' },
        { title: '震防' },
        { title: '应急' },
        { title: '监测' },
      ],
      // 表单校验
      rules: {
        type: [
          { required: true, message: '文件类型不能为空', trigger: 'blur' }
        ],
        filename: [{ required: true, message: '上传文件', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        releaseTime: [{ required: true, message: '日期不能为空', trigger: 'blur' }],
        implDate: [{ required: true, message: '日期不能为空', trigger: 'blur' }],
      }
    }
  },
  computed: {
    // 这里定义上传文件时携带的参数，即表单数据
    // upData() {
    //   return this.form
    // }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      let par = {}
      if(this.queryParams.filename != '' && this.queryParams.type != undefined){
        par = encode({title:this.queryParams.filename, type: this.queryParams.type})
      }else{
        if(this.queryParams.filename != ''){
          par = encode({title:this.queryParams.filename})
        }
        if(this.queryParams.type != undefined){
          par = encode({type: this.queryParams.type})
        }
      }
      getStandard(par).then((res) => {
        this.roleList = decode(res)
        // this.total = response.total
        this.loading = false
      })
    },
    // 筛选
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 取消按钮
    cancel() {
      this.dialogOpen = false
      this.reset()
    },
    close() {
        this.showIfr = false
    },
    // 表单重置
    reset() {
      this.resetForm('form')
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`一次只能上传一个文件`)
    },
    // 上传失败
    handleUploadError(err) {
      this.$message.error('上传失败, 请重试')
    },
    // 上传之前的回调
    beforeUpload(file) {
      // console.log(file, 90)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.$message.success('上传成功')
        this.isUploading = false
        this.fileList.push({
          name: file.name,
          uid: res.uid,
          data: file.response.data
        })
        this.form.filename = file.response.data.name
        this.form.url = file.response.data.url
      } else {
        this.$message.error('上传失败, 请重试')
        this.fileList = []
        // let p = document.querySelector('.uploadText')
        // p.innerHTML = res.replace(/null/g, '数据为空')
        // this.text = res
      }
    },
    handleSee(row) {
      downStandard(row.id)
        .then((res) => {
          // let url = process.env.VUE_APP_CRIT_API + '/fileservice/ecdownload'
          let blob = new Blob([res], { type: 'application/pdf' })
          let blobURL = URL.createObjectURL(blob)
          // let win = window.open(blobURL)
          this.previewUrl = blobURL + '#toolbar=0'
          this.showIfr = true
          this.dialogOpen = false
          setTimeout(() => {
            window.document.name = row.filename
          }, 500)
        })
        .catch((ree) => {})
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.form =  {
        nationalStandard:'',
        title:'',
        type: '',
        businessarea: '',
        releaseTime: '',
        implDate: '',
        filename: null
      },
      this.isCheck = false
      this.dialogOpen = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = row
      this.isCheck = true
      this.dialogOpen = true
      // this.fileList = [row.url]
    },
    /** 提交按钮 */
    submitForm() {
      this.form.implDate = new Date(this.form.implDate).getTime();  //转换为时间撮
      this.form.releaseTime = new Date(this.form.releaseTime).getTime();
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addStandard(encode(this.form)).then((res) => {
            this.$message.success('导入成功')
            this.dialogOpen = false
            this.fileList = []
            this.form = []
            this.getList()
          })
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.id || this.ids
      this.$modal
        .confirm('是否确认删除名为"' + row.filename + '"的数据项？')
        .then(() => {
          return delStandard(encode({ id: roleIds }))
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/role/export',
        {
          ...this.queryParams
        },
        `role_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.app-standard {
  padding: 20px;
}
.filelist {
  color: rgb(0, 153, 255);
  padding: 10px 0px;
}
.el-transfer {
  display: flex;
  .el-transfer__buttons {
    padding: 0 10px !important;
  }
}
.el-button + .el-button {
  margin-left: 0 !important;
}
.iframe {
  position: absolute;
  display: flex;
  top: 80px;
  left: 300px;
  width: 1000px;
  height: 600px;
  justify-content: center;
  z-index: 1005;
  font-size: 30px;
  color: #fff;
}
</style>
