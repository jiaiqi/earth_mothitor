<template>
  <div class="process">
    <el-form
      ref="queryForm"
      :model="processParams"
      :rules="steprules"
      size="small"
      :inline="true"
    >
      <el-form-item label="节点名称" prop="userName">
        <el-input
          v-model="processParams.userName"
          placeholder="请输入节点名称"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="节点描述" prop="desc">
        <el-input v-model="processParams.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="addSteps('queryForm')"
        >
          添加节点
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery('queryForm')"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-input
          v-model="stepName"
          placeholder="请输入流程名称"
          clearable
          style="width: 200px"
          size="mini"
        />
        <el-button
          v-hasPermi="['system:role:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="addStepsList"
        >
          添加流程
        </el-button>
      </el-col>
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

    <div class="stepsList">
      <el-steps :active="9" align-center>
        <el-step
          title="完成提交"
          icon="el-icon-upload"
          description="用户已完成提交"
        />

        <el-step
          v-for="item in stepsList"
          :key="item.stepId"
          :title="item.title"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 流程节点数据
      processParams: {
        roleId: undefined,
        desc: undefined,
        userName: undefined
      },
      stepsList: [],
      steprules: {
        userName: [
          { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        desc: [{ required: true, message: '请填写节点描述', trigger: 'blur' }]
      },
      stepName: ''
    }
  },
  methods: {
    // 返回按钮
    handleClose() {
      const obj = { path: '/workflow/process' }
      this.$tab.closeOpenPage(obj)
    },
    // 新增节点
    addSteps(formName) {
      let arr = { title: '', desc: '', stepId: 1 }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          arr.title = this.processParams.userName
          arr.desc = this.processParams.desc
          arr.stepId = this.stepsList.length + 1
          this.stepsList.push(arr)
          this.resetQuery(formName)
        } else {
          return false
        }
      })
    },
    // 重置
    resetQuery(formName) {
      this.$refs[formName].resetFields()
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
// ::v-deep .is-finish {
//   color: #72c648 !important;
//   border-color: #72c648 !important;
// }
</style>
