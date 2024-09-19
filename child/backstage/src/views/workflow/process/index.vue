<template>
  <div class="app-process">
    <!-- 搜索 -->
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
    >
      <el-form-item label="模板名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        > -->
      </el-form-item>
    </el-form>
    <!-- 操作 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="goReview"
        >
          新增模板
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:edit']"
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >
          查看模板详情
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
        label="模板名称"
        prop="roleName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="查看模板详情">
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
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-if="scope.row.roleId !== 1" slot-scope="scope">
          <el-button
            v-hasPermi="['system:role:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip
              content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            权限字符
          </span>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number
            v-model="form.roleSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in tableList"
              :key="dict.value"
              :label="dict.value"
            >
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限" />
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
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
import { getAuditmodel } from '@/api/workflow/auditmodel'
import { addApi, addUrl } from '@/api/system/urlapi'
import { encode, decode } from '@/utils/base/dataEncry.js'
export default {
  name: 'Process',
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
      // 角色表格数据
      roleList: [],
      // table表格
      tableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
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
      form: {},
      options: [
        {
          value: '选项1',
          label: '测震'
        },
        {
          value: '选项2',
          label: '水准'
        },
        {
          value: '选项3',
          label: '地磁'
        },
        {
          value: '选项4',
          label: '强震动'
        },
        {
          value: '选项5',
          label: '流体'
        }
      ],
      // 表单校验
      rules: {
        roleName: [
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
      getAuditmodel(encode({})).then((res) => {
        this.loading = false
      })
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
      this.open = false
      this.reset()
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false
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
      this.open = true
      this.title = '添加角色'
    },
    /** 进行审核按钮操作 */
    goReview(row) {
      this.$router.push({
        path: `/workflow/process-data/index/${row}`
      })
    },
    // 查看详情
    handleUpdate() {},
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== '2') {
        this.$refs.dept.setCheckedKeys([])
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.roleId !== undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            // updateRole(this.form).then((response) => {
            //   this.$modal.msgSuccess('修改成功')
            //   this.open = false
            //   this.getList()
            // })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            // addRole(this.form).then((response) => {
            //   this.$modal.msgSuccess('新增成功')
            //   this.open = false
            //   this.getList()
            // })
          }
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
          addApi(list).then((res) => {
            this.$modal.msgSuccess('权限分配成功')
            this.openDataScope = false
            this.getList()
          })
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
          addUrl(list).then((res) => {
            this.$modal.msgSuccess('权限分配成功')
            this.openDataScope = false
            this.getList()
          })
        }
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids
      this.$modal
        .confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？')
        .then(() => {
          // return delRole(roleIds)
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
.app-process {
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
