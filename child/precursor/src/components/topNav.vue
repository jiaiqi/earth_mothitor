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
            >观测数据</span
          >
        </template></el-breadcrumb-item
      >
      <!-- <el-breadcrumb-item
        v-if="pageName === '定点形变' || pageName === '流动形变'"
        >形变</el-breadcrumb-item
      > -->
      <el-breadcrumb-item>{{ pageName }}</el-breadcrumb-item>
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
  props: ['pageName'],
  methods: {
    gotoHome(name) {
      // 向基项目发送数据
      window.microApp && window.microApp.dispatch({ route: { name } })
    },
    toIntroduce(){
      // this.$router.push({name: 'catalogMenuIntroduce', query: {type: this.thisPage }})
      location.href = 'http://'+location.host + '/catalogMenuIntroduce?type=观测数据'
    }
  }
}
</script>

<style></style>
