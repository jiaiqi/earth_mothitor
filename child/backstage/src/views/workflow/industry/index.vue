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
      <el-form-item label="链接名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入链接名称"
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
          v-hasPermi="['workflow:industryLink:list']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['workflow:industryLink:list']"
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
          v-hasPermi="['workflow:industryLink:list']"
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
    </el-row>

    <el-table v-loading="loading" :data="roleList" height="600">
      <el-table-column label="链接名称" prop="deptName" />
      <el-table-column label="链接地址" prop="url">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="descrip" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-if="scope.row.roleId !== 1" slot-scope="scope">
          <el-button
            v-hasPermi="['workflow:industryLink:list']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-hasPermi="['workflow:industryLink:list']"
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
    <el-dialog :title="title" :visible.sync="open" width="560px" append-to-body>
      <el-form
        ref="stationForm"
        :model="stationForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="单位名称" prop="deptName">
          <el-input
            v-model="stationForm.deptName"
            placeholder="请输入单位名称"
          />
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="stationForm.url" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="描述" prop="descrip">
          <el-input v-model="stationForm.descrip" placeholder="请输入描述" />
        </el-form-item>
          <el-form-item label="封面图片" prop="photoUrl">
              <label class="fileText" v-if="stationForm.photoUrl" @click="downLoadFile(stationForm.photoUrl)">
                {{ stationForm.photoUrl }}
              </label>
            <el-upload
              class="upload-demo"
              :action="action"
              list-type="picture"
              :limit="1"
              v-if="!stationForm.photoUrl"
              :beforeUpload="beforeUpload2"
              :on-success="handlePreview"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">封面图只能上传jpg/png文件，且不超过1MB</div>
            </el-upload>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm"> 确 定 </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  industry,
  industryAdd,
  industryEdit,
  industryDel
} from '@/api/dataup/special.js'
import { encode, decode } from '@/utils/base/dataEncry.js'
export default {
  data() {
    return {
      // 遮罩层
      loading: true,

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
      // 表格数据
      roleList: [],
      fileList: [],
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
      stationForm: {},
      // 修改id
      editId: null,
      action:  process.env.VUE_APP_PRODS_API + '/prodSer/uploadFile',
      // 表单校验
      rules: {
        deptName: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        url: [{ required: true, message: '连接不能为空', trigger: 'blur' }],
        descrip: [{ required: true, message: '描述不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 按条件查询
    handleQuery() {
      this.getList()
    },
    /** 查询行业链接列表 */
    getList() {
      this.loading = true
      let par = {}
      if(this.queryParams.roleName){
        par.deptName = this.queryParams.roleName
      }
      let data = encode(par)
      industry(data)
        .then((res) => {
          this.roleList = decode(res)
          this.loading = false
          this.$message.success('获取成功')
        })
        .catch(() => {})
    },
    beforeUpload2(file) {
      if(!/\.(jpg|jpeg|png|JPG|PNG)$/.test(file.name)){
        this.$message.error('封面图片格式不符合!请重新上传');
        this.fileList = []
      }
    },
    handlePreview(url){
      this.stationForm.photoUrl = url
    },
    // 刷新
    refresh() {
      this.getList()
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    //下载文件
    downLoadFile(url) {
      window.open(url)
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

      }
      this.fileList = []
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '行业链接'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.editId = row.id
      this.stationForm = {
        deptName: row.deptName,
        url: row.url,
        photoUrl: row.photoUrl,
        descrip: row.descrip
      }
      this.open = true
      this.title = '修改信息'
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['stationForm'].validate((valid) => {
        if (valid) {
          if (this.title !== '行业链接') {
            this.stationForm.id = this.editId

            industryEdit(encode(this.stationForm)).then((res) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
              this.reset()
            })
          } else {
            industryAdd(encode(this.stationForm)).then((res) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
              this.reset()
            })
          }
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      let name = row.deptName
      let id = row.id
      this.$modal
        .confirm('是否确认删除名为"' + name + '"的链接吗？')
        .then(() => {
          return industryDel(encode({ id: id }))
        })
        .then(() => {
          this.getList()
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
.fileText {
  padding: 10px 0px;
  color: rgb(0, 89, 255);
  cursor: pointer;
}
.el-button + .el-button {
  margin-left: 0 !important;
}
</style>
