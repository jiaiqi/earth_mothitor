<template>
  <div class="bottom">
    <div class="main commom">
      <div>
        <span><router-link to="/user/sitemap">网站地图</router-link></span>
        <span class="pad">|</span>
        <span><router-link to="/user/collmy">联系方式</router-link></span>
        <span class="pad">|</span>
        <span>更新动态</span>
      </div>
      <div>
        <span>备案号</span>
        <span class="pad">公网安备 </span>
        <span>网站标示码：</span>
      </div>
      <div>
        <span>电话：</span>
        <span class="pad">地址：</span>
        <span>邮编： </span>
        <span class="pad">版权所有：</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.bottom {
  width: 100%;
  background-color: #2f77c9;
  .main {
    padding: 20px 20px 20px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    a {
      color: #fff;
    }
  }
}
.pad {
  padding: 0 10px;
}
@media (max-width: 1200px) {
  .bottom {
    width: 1200px;
  }
}
</style>
