<template>
  <div class="building commom">
    <div class="topNav">
      <TopNav :pageName="'房屋设施加固技术服务'"></TopNav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.building {
  position: relative;
  height: 400px;
  .topNav {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
  }
}
</style>
