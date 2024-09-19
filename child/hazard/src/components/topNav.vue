<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <template>
          <span
            style="font-weight: 700; color: #000; cursor: pointer"
            @click="gotoHome('index')"
            >首页</span
          >
        </template>
      </el-breadcrumb-item>
      <el-breadcrumb-item>调查数据</el-breadcrumb-item>
      <el-breadcrumb-item>{{ thisPage }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      thisPage: this.pageName
    }
  },
  props: ['pageName'],
  methods: {
    gotoHome(name) {
      // 向基项目发送数据
      window.microApp && window.microApp.dispatch({ route: { name } })
    }
  }
}
</script>

<style></style>
