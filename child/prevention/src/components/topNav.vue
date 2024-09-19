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
      <el-breadcrumb-item>
        <template>
          <span
            style="font-weight: 700; color: #000; cursor: pointer"
            @click="toIntroduce"
            >探测数据</span
          >
        </template>
      </el-breadcrumb-item>
      <!-- <el-breadcrumb-item>观测数据</el-breadcrumb-item> -->
      <el-breadcrumb-item>{{ pageName }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ['pageName'],
  data() {
    return {
      thisPage: this.pageName
    }
  },

  methods: {
    gotoHome(name) {
      // 向基项目发送数据
      window.microApp && window.microApp.dispatch({ route: { name } })
    },
    toIntroduce(){
      location.href = 'http://'+location.host + '/catalogMenuIntroduce?type=探测数据'
    }
  }
}
</script>

<style></style>
