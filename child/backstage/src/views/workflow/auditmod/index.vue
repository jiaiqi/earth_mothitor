<template>
  <div class="app-auditmodel">
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
      <!-- <el-form-item label="模板类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择模板类型">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.val"
          >
          </el-option>
        </el-select>
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
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增模板</el-button
        >
      </el-col>
       <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >查看模板详情</el-button
        >
      </el-col> -->
    <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->
    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="模板名称"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="查看模板详情">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-if="scope.row.roleId !== 1" slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="goReview(scope.row)"
          >
            修改模板节点
          </el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button> -->
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

    <!-- 审核 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="模板类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择模板类型">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="modelName">
          <el-input v-model="form.modelName" placeholder="请输入模板名称" />
        </el-form-item>
        <!-- <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 模板详情 -->
    <el-dialog
      :title="title1"
      :visible.sync="open1"
      width="600px"
      append-to-body
    >
      <div v-loading="loading1">
        <el-steps :active="-1" align-center>
          <el-step
            title="完成提交"
            icon="el-icon-upload"
            description="用户已完成提交"
          />
          <el-step
            v-for="item in stepsList"
            :key="item.id"
            :title="item.nodeName"
            :description="item.desc"
            icon="el-icon-user-solid"
          />
          <el-step
            title="审核完成"
            icon="el-icon-check"
            description="数据审核完成"
          />
        </el-steps>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addAuditmodel,
  getAuditnode,
  getAuditmodelType,
  // getAuditmodel,
  delAuditmodel
} from '@/api/workflow/auditmodel'
import { encode, decode } from '@/utils/base/dataEncry.js'
export default {
  name: 'Auditmod',
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 弹出层标题
      title: '',
      // table表格
      tableList: [],
      // 模板详情弹窗标题
      title1: '',
      // 是否显示模板弹出层
      open1: false,
      // 节点图数据
      stepsList: [],
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
        name: undefined,
        type: undefined
      },
      // 表单参数
      form: {},
      loading1: true,
      options: [],
      // 表单校验
      rules: {
        type: [
          { required: true, message: '模板类型不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getList()
  },
  methods: {
    /** 查询模板列表 */
    getList() {
      this.loading = true
      getAuditmodelType(encode({})).then((res) => {
        let list = decode(res.data)
        this.options = list
        this.roleList = list
        console.log(this.roleList)
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
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
      this.title = '新增模板'
    },
    /** 新增模板节点操作 */
    goReview(row) {
      this.$router.push({
        path: `/workflow/auditmod-data/index/${row.id}`
      })
    },
    // 查看详情
    handleUpdate(row) {
      this.loading1 = true
      this.stepsList = []
      this.title1 = `${row.name}模板审核流程`
      getAuditnode(encode({ modelId: row.id })).then((res) => {
        this.stepsList = decode(res.data)
        this.loading1 = false
      })
      this.open1 = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addAuditmodel(encode(this.form)).then((res) => {
            this.$modal.msgSuccess('新增成功')
            this.open = false
            this.getList()
          })
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.modelName || this.ids
      this.$modal
        .confirm('是否确认删除' + roleIds + '模板？')
        .then(() => {
          return delAuditmodel(encode({ id: row.id }))
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
      //
    }
  }
}
</script>
<style lang="scss" scoped>
.app-auditmodel {
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
