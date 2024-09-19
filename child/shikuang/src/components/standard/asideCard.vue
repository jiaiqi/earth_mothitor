<template>
  <div class="card">
    <div @click="jumpMl">
      <el-card class="active" v-if="xjml">
        <img src="@/assets/standard/gjbz1.png" alt="" />
        <p>国家标准</p>
      </el-card>
      <el-card v-else>
        <img src="@/assets/standard/gjbz.png" alt="" />
        <p>国家标准</p>
      </el-card>
    </div>
    <div @click="jumpDw">
      <el-card class="active" v-if="!sjxz">
        <img src="@/assets/standard/hybz1.png" alt="" />
        <p>行业标准</p>
      </el-card>
      <el-card v-else>
        <img src="@/assets/standard/hybz.png" alt="" />
        <p>行业标准</p>
      </el-card>
    </div>
    <div @click="jumpJk">
      <el-card class="active" v-if="!xjjk">
        <img src="@/assets/standard/dfbz.png" alt="" />
        <p>地方标准</p>
      </el-card>
      <el-card v-else>
        <img src="@/assets/standard/dfbz1.png" alt="" />
        <p>地方标准</p>
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
    }
  },
  created() {
    if (this.$route.name === 'standardCountry') {
      this.xjml = true
    } else if (this.$route.name === 'standardIndustry') {
      this.sjxz = false
      this.xjml = false
    } else if (this.$route.name === 'standardLocal') {
      this.xjjk = false
      this.xjml = false
    }
  },
  methods: {
    jumpMl() {
      if (this.$route.name === 'standardCountry') {
        return
      }
      this.$router.push({
        path: '/country'
      })
    },
    jumpDw() {
      if (this.$route.name === 'standardIndustry') {
        return
      }
      this.$router.push({
        path: '/industry'
      })
    },
    jumpJk() {
      if (this.$route.name === 'standardLocal') {
        return
      }
      this.$router.push({
        path: '/local'
      })
    },

  },
}
</script>

<style lang="less" scoped>
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
