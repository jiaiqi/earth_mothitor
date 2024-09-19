<template>
  <div class="card">
    <div @click="jumpBZ">
      <el-card v-if="xjml" class="active">
        <img src="@/assets/standard/gjbz1.png" alt="" />
        <p>标准</p>
      </el-card>
      <el-card v-else>
        <img src="@/assets/standard/gjbz.png" alt="" />
        <p>标准</p>
      </el-card>
    </div>
    <!-- <div @click="jumpDw">
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
    </div> -->
    <!-- <div @click="jumpTe">
      <el-card class="active" v-if="!team">
        <img src="@/assets/standard/team.png" alt="" />
        <p>团队标准</p>
      </el-card>
      <el-card v-else>
        <img src="@/assets/standard/team.png" alt="" />
        <p>团队标准</p>
      </el-card>
    </div> -->
    <div @click="jumpRe">
      <el-card class="active" v-if="!regular">
        <img src="@/assets/standard/regular2.png" alt="" />
        <p>法规</p>
      </el-card>
      <el-card v-else>
        <img src="@/assets/standard/regular.png" alt="" />
        <p>法规</p>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      xjml: true,
      sjxz: true,
      xjjk: true,
      team: true,
      regular: true,
      typeList: []
    }
  },
  mounted() {
    this.jumpBZ()
  },
  methods: {
    jumpBZ() {
      this.xjml = true
      // this.xjjk = true
      // this.sjxz = true
      // this.team = true
      this.regular = true
      this.typeList = [
        {
          name: '国家标准',
          id: 0
        },
        {
          name: '行业标准',
          id: 1
        },
        {
          name: '地方标准',
          id: 2
        },
        {
          name: '团体标准',
          id: 3
        }
      ]
      this.$emit('type',this.typeList)
      this.$emit('lawType')
      this.$store.commit('setType', '0')
    },
    jumpDw() {
      this.sjxz = false
      this.xjjk = true
      this.xjml = false
      this.team = true
      this.regular = true
      this.$store.commit('setType', '1')
    },
    jumpJk() {
      this.sjxz = true
      this.xjjk = false
      this.xjml = false
      this.team = true
      this.regular = true
      this.$store.commit('setType', '2')
    },
    jumpTe() {
      this.sjxz = true
      this.xjjk = true
      this.xjml = false
      this.team = false
      this.regular = true
      this.$store.commit('setType', '3')
    },
    jumpRe() {
      this.sjxz = true
      this.xjjk = true
      this.xjml = false
      this.team = true
      this.regular = false
      this.typeList = [
        {
          name: '法律',
        },
        {
          name: '行政法规',
        },
        {
          name: '部门规章',
        },
        {
          name: '省级地方性法规',
        },
        {
          name: '省级政府规章',
        }
      ]
      this.$store.commit('setType', '4')
      this.$emit('lawType')
      this.$emit('type',this.typeList)
    }
  }
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
