<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <template>
          <span
            style="font-weight: 700; color: #000; cursor: pointer"
            @click="gotoHome"
            >首页</span
          >
        </template>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ pageName }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="!news">订单确认</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      thisPage: '观测数据'
    }
  },
  props: ['pageName','news'],
  methods: {
    gotoHome() {
      location.href = '/home'
    }
  }
}
</script>

<style></style>
