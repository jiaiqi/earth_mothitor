<template>
  <div class="title">
    <div class="box">
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
      title: '国家标准',
    }
  },
  created() {
    if (this.$route.name === 'standardCountry') {
      this.title = '国家标准'
    } else if (this.$route.name === 'standardIndustry') {
      this.title = '行业标准'
    } else if (this.$route.name === 'standardLocal') {
      this.title = '地方标准'
    }
  },
}
</script>

<style lang="less" scoped>
.box {
  margin: 0 auto;
  background-color: #fff;
  width: 1600px;
  height: 200px;
  background: url(@/assets/standard/bzbg.jpg) no-repeat top center;
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
  .box {
    width: 100vw;
    height: 22vh;
  }
}
@media (max-width: 1200px) {
  .box {
    width: 1200px;
    height: 180px;
  }
}
</style>
