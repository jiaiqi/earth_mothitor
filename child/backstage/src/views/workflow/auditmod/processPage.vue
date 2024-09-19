<template>
  <div class="process">
    <el-form
      ref="queryForm"
      :model="processParams"
      :rules="steprules"
      size="small"
      :inline="true"
    >
      <!-- <el-form-item label="节点位置" prop="orders">
        <el-input-number
          v-model="processParams.orders"
          :min="0"
          :max="10"
          label=""
        ></el-input-number>
      </el-form-item> -->
      <el-form-item label="节点名称" prop="nodeName">
        <el-input
          v-model="processParams.nodeName"
          placeholder="请输入节点名称"
          clearable
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="审核角色" prop="roleid">
        <el-select
          v-model="processParams.roleid"
          placeholder="请选择模板类型"
          @change="changeSelect"
        >
          <el-option
            v-for="item in options"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="节点描述" prop="explains">
        <el-input v-model="processParams.explains" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="addSteps(processParams)"
        >
          添加节点
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="addStepsList"
          v-hasPermi="['system:role:add']"
          >保存</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-close"
          size="mini"
          @click="handleClose"
        >
          关闭
        </el-button>
      </el-col>
    </el-row>

    <div v-loading="loading" class="stepsList">
      <el-steps :active="9" align-center>
        <el-step
          title="完成提交"
          icon="el-icon-upload"
          description="用户已完成提交"
        />
        <el-step
          v-for="item in stepsList"
          :key="item.id"
          :title="item.nodeName"
          :description="item.explains"
          icon="el-icon-user-solid"
          @click.native="clickStep(item)"
        />
        <el-step
          title="审核完成"
          icon="el-icon-check"
          description="数据审核完成"
        />
      </el-steps>
    </div>
  </div>
</template>

<script>
import { listRole } from '@/api/system/role.js'
import {
  getAuditnode,
  addAuditnode,
  delAuditnode
} from '@/api/workflow/auditmodel'
import { encode, decode } from '@/utils/base/dataEncry.js'
export default {
  data() {
    return {
      // 流程节点数据
      processParams: {
        explains: undefined,
        nodeName: undefined,
        roleid: undefined,
        orders: 0,
        modelId: undefined
      },
      // 角色列表
      options: [],
      order: 0,
      loading: true,
      stepsList: [],
      steprules: {
        nodeName: [
          { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        roleid: [
          { required: true, message: '请选择审核角色', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请填写节点描述', trigger: 'blur' }
        ],
        orders: [{ required: true, message: '请填写节点位置', trigger: 'blur' }]
      },
      stepName: ''
    }
  },
  created() {
    // 获取角色列表
    listRole().then((res) => {
      this.options = res.rows
    })
    this.getAuditnode()
  },
  methods: {
    // 获取节点数据
    getAuditnode() {
      this.loading = true
      let data = this.$route.params
      this.processParams.modelId = data.modelId
      getAuditnode(encode(data)).then((res) => {
        this.stepsList = decode(res.data)
        this.loading = false
      })
    },
    // 返回按钮
    handleClose() {
      const obj = { path: '/workflow/auditmod' }
      this.$tab.closeOpenPage(obj)
    },
    changeSelect() {},
    // 新增节点
    addSteps() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.order = this.order + 1
          this.processParams.orders = this.order
          addAuditnode(encode(this.processParams)).then((res) => {
            this.$message.success('新增成功')
            this.getAuditnode()
            this.resetQuery()
          })
        } else {
          return false
        }
      })
    },
    // 节点点击按钮
    clickStep(item) {
      console.log(item)
      this.$modal
        .confirm('是否确认删除' + item.nodeName + '节点')
        .then(() => {
          return delAuditnode(encode({ id: item.id }))
        })
        .then(() => {
          this.getAuditnode()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    // 重置
    resetQuery() {
      this.$refs.queryForm.resetFields()
    },
    // 把流程添加到列表
    addStepsList() {}
  }
}
</script>

<style lang="scss" scoped>
.process {
  padding: 20px;

  .stepsList {
    margin-top: 40px;
  }
}
::v-deep .is-finish {
  color: #000 !important;
  border-color: #000 !important;
}

::v-deep .el-step__head:hover {
  color: #67c23a !important;
  border-color: #67c23a !important;
}
// ::v-deep .is-finish {
//   color: #72c648 !important;
//   border-color: #72c648 !important;
// }
</style>
