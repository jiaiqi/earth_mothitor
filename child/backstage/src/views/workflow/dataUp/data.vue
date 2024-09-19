<template>
  <div class="dataTime">
    <el-button
      type="warning"
      plain
      icon="el-icon-close"
      size="mini"
      @click="handleClose"
    >
      关闭
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 返回按钮
    handleClose() {
      const obj = { path: '/workflow/dataUp' }
      this.$tab.closeOpenPage(obj)
    }
  }
}
</script>

<style></style>
