<template>
  <div class="app-dataup">
    <!-- 搜索 -->
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
    >
      <el-form-item label="数据名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入数据名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据类型" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="数据类型"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in options"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上传时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
        >
          上传数据
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="数据名称"
        prop="roleName"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="数据类型"
        prop="status"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="查看详情">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:role:edit']"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="审核进度" align="center">
        <template slot-scope="scope">
          <router-link
            :to="'/workflow/dataUp-data/index/' + scope.row.dictType"
            class="link-type"
          >
            <span>审核进度</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
        <el-form-item label="审核模板" prop="type">
          <el-select v-model="modelId" placeholder="请选择审核模板">
            <el-option
              v-for="item in options"
              :key="item.id"
              :value="item.id"
              :label="item.modelName"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole } from '@/api/system/role'
import { getAuditmodel } from '@/api/workflow/auditmodel'
import { encode, decode } from '@/utils/base/dataEncry.js'
export default {
  name: 'Dataup',
  components: {},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 审核模板
      modelId: '',
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      dialogOpen: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 菜单列表
      menuOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        type: ''
      },
      options: [],
      // 表单校验
      rules: {
        type: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.roleList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
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
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.menuExpand = false
      this.menuNodeAll = false
      this.deptExpand = true
      this.deptNodeAll = false
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: '0',
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined
      }
      this.resetForm('form')
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
      getAuditmodel(encode({})).then((res) => {
        let list = decode(res.data)
        this.options = list
      })
      this.dialogOpen = true
      this.title = '上传数据'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const roleId = row.roleId || this.ids
      const roleMenu = this.getRoleMenuTreeselect(roleId)
      getRole(roleId).then((response) => {
        this.form = response.data
        this.open = true
        this.$nextTick(() => {
          roleMenu.then((res) => {
            let checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false)
              })
            })
          })
        })
        this.title = '修改角色'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.menuIds = this.getMenuAllCheckedKeys()
          addRole(this.form).then((response) => {
            this.$modal.msgSuccess('新增成功')
            this.dialogOpen = false
            this.getList()
          })
        }
      })
    },

    /** 提交按钮（数据权限） */
    submitDataScope() {
      if (this.form.roleId !== undefined) {
        let roleId = this.form.roleId
        if (this.title === '分配API权限') {
          let api = this.toData
          let apis = {}
          let list = []
          for (let i = 0; i < api.length; i++) {
            if (api[i].record !== 0) {
              apis.roleId = roleId
              apis.apiarr = []
              for (let j = 0; j < api[i].children.length; j++) {
                if (api[i].children[j].record !== 0) {
                  let obj = {}
                  obj.name = api[i].children[j].name
                  obj.api = api[i].children[j].api
                  apis.apiarr.push(obj)
                }
              }
              apis.name = api[i].name
              // apis.id = api[i].id
              apis.parentid = api[i].id

              list[i] = apis
              apis = {}
            }
          }
          list = list.filter((item) => item !== null)
          // addApi(list).then((res) => {
          //   this.$modal.msgSuccess('权限分配成功')
          //   this.openDataScope = false
          //   this.getList()
          // })
        } else if (this.title === '分配URL权限') {
          let url = this.toData
          let urls = {}
          let list = []
          for (let i = 0; i < url.length; i++) {
            if (url[i].record !== 0) {
              urls.roleId = roleId
              urls.urlarr = []
              for (let j = 0; j < url[i].children.length; j++) {
                if (url[i].children[j].record !== 0) {
                  let obj = {}
                  obj.name = url[i].children[j].name
                  obj.api = url[i].children[j].url
                  urls.urlarr.push(obj)
                }
              }
              urls.name = url[i].name
              // apis.id = api[i].id
              urls.parentid = url[i].id

              list[i] = urls
              urls = {}
            }
          }
          list = list.filter((item) => item !== null)
          // addUrl(list).then((res) => {
          //   this.$modal.msgSuccess('权限分配成功')
          //   this.openDataScope = false
          //   this.getList()
          // })
        }
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids
      this.$modal
        .confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？')
        .then(() => {
          return delRole(roleIds)
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
.app-dataup {
  padding: 20px;
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
</style>
