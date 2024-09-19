<template>
  <div class="title">
    <div class="box" v-if="bg">
      <div class="box_commom commom">
        <h3>{{ title }}</h3>
      </div>
    </div>
    <div class="box1" v-else>
      <div class="box_commom commom">
        <h3>{{ title }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '数据目录',
      bg: true
    }
  },
  created() {
    if (this.$route.name === 'serviceCatalogue') {
      this.bg = true
    } else if (this.$route.name === 'serviceDatadown') {
      this.title = '数据下载'
      this.bg = false
    } else if (this.$route.name === 'serviceInterface') {
      this.title = '数据接口'
      this.bg = true
    } else if (this.$route.name === 'serviceToolkit') {
      this.title = '数据工具集'
      this.bg = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  margin: 0 auto;
  background-color: #fff;
  width: 1600px;
  height: 200px;
  background: url(@/assets/images/sjbg.jpg) no-repeat top center;
  background-size: 100% 100%;
  .box_commom {
    padding: 0 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    h3 {
      font-size: 40px;
      letter-spacing: 5px;
      color: #fff;
    }
  }
}
.box1 {
  margin: 0 auto;
  background-color: #fff;
  width: 1600px;
  height: 200px;
  background: url(@/assets/images/sjbg1.jpg) no-repeat top center;
  background-size: 100% 100%;
  .box_commom {
    padding: 0 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    h3 {
      font-size: 40px;
      letter-spacing: 5px;
      color: #fff;
    }
  }
}
@media (max-width: 1600px) {
  .box,
  .box1 {
    width: 100vw;
    height: 24vh;
  }
}
@media (max-width: 1200px) {
  .box,
  .box1 {
    width: 1200px;
  }
}
</style>
