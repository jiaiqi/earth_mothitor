<template>
  <div class="knowledge commom">
    <div class="topNav">
      <top-nav :pageName="'构造物理实验'"></top-nav>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.knowledge {
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
