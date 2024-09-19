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
      <el-breadcrumb-item
        v-if="pageName === '更多地震信息' || pageName === '大震专题'"
        >最新地震信息</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="pageNum >= 3" style="cursor: pointer;" @click="back2">/大震专题</el-breadcrumb-item>
      <el-breadcrumb-item v-if="pageNum > 3" style="cursor: pointer;" @click="back">/大震专题详情</el-breadcrumb-item>
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
  props: ['pageName','pageNum'],
  methods: {
    gotoHome(name) {
      // 向基项目发送数据
      window.microApp && window.microApp.dispatch({ route: { name } })
    },
    back() {
      let id = sessionStorage.getItem('id')
      let spid = sessionStorage.getItem('spid') 
       this.$router.push({name:'earthOption', params: {
        id: id,
        spid: spid 
      }})
    //  this.$router.back()
    },
    back2() {
      this.$router.push('/bigEarthList')
    }
  }
}
</script>

<style></style>
