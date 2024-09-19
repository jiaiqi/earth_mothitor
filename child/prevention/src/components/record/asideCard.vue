<template>
  <div class="card">
    <div @click="jumpMl">
      <el-card class="active" v-if="xjml">
        <img src="@/assets/images/sjml.png" alt="" />
        <p>数据目录</p>
      </el-card>
      <el-card v-else>
        <img src="@/assets/images/sj/sjml1.png" alt="" />
        <p>数据目录</p>
      </el-card>
    </div>
    <div @click="jumpDw">
      <el-card class="active" v-if="!sjxz">
        <img src="@/assets/images/sjdow1.png" alt="" />
        <p>数据下载</p>
      </el-card>
      <el-card v-else>
        <img src="@/assets/images/sjdow.png" alt="" />
        <p>数据下载</p>
      </el-card>
    </div>
    <div @click="jumpJk">
      <el-card class="active" v-if="!xjjk">
        <img src="@/assets/images/sjjk1.png" alt="" />
        <p>数据接口</p>
      </el-card>
      <el-card v-else>
        <img src="@/assets/images/sjjz.png" alt="" />
        <p>数据接口</p>
      </el-card>
    </div>
    <div @click="jumpGj">
      <el-card class="active" v-if="!xjgj">
        <img src="@/assets/images/sj/sjgj1.png" alt="" />
        <p>数据工具集</p>
      </el-card>
      <el-card v-else>
        <img src="@/assets/images/sj/sjgjj.png" alt="" />
        <p>数据工具集</p>
      </el-card>
    </div>
  </div>
</template>

<script>
// import index from '../../views/home/index.vue'
export default {
  // components: { index },
  data() {
    return {

      xjml: true,
      sjxz: true,
      xjjk: true,
      xjgj: true
    }
  },
  created() {
    if (this.$route.name === 'serviceCatalogue') {
      this.xjml = true
    } else if (this.$route.name === 'serviceDatadown') {
      this.sjxz = false
      this.xjml = false
    } else if (this.$route.name === 'serviceInterface') {
      this.xjjk = false
      this.xjml = false
    } else if (this.$route.name === 'serviceToolkit') {
      this.xjgj = false
      this.xjml = false
    }
  },
  methods: {
    jumpMl() {
      if (this.$route.name === 'serviceCatalogue') {
        return
      }
      this.$router.push({
        path: '/catalogue'
      })
    },
    jumpDw() {
      if (this.$route.name === 'serviceDatadown') {
        return
      }
      this.$router.push({
        path: '/datadown'
      })
    },
    jumpJk() {
      if (this.$route.name === 'serviceInterface') {
        return
      }
      this.$router.push({
        path: '/interface'
      })
    },
    jumpGj() {
      if (this.$route.name === 'serviceToolkit') {
        return
      }
      this.$router.push({
        path: '/toolkit'
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.card {
  margin-top: 10px;
}
.el-card {
  background-color: #f4f9fd;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.active {
  background-color: #1492ff !important;
  color: #fff;
}
</style>
