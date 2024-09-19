<template>
  <div id="app">
    <div class="home">
      <!-- <title-top></title-top> -->
      <router-view></router-view>
      <!-- <footer-bottom></footer-bottom> -->
    </div>
  </div>
</template>

<script>
// import footerBottom from '@/components/layout/footerBottom.vue'
// import titleTop from '@/components/layout/titleTop.vue'
export default {
  name: 'indexPage',
  data() {
    return {
      show: true
    }
  },
  components: {
    // footerBottom,
    // titleTop
  },
  created() {
    /** 绑定数据【data属性】监听事件 */
    window.microApp && window.microApp.addDataListener(this.dataListener)
  },
  destroyed() {
    /** 移除数据【data属性】监听事件 */
    window.microApp && window.microApp.removeDataListener(this.dataListener)
  },
  methods: {
    dataListener(data) {
      if (data.name !== this.$route.name) {
        /** 不判断时会报一个“冗余导航【NavigationDuplicated】”的异常 */
        return this.$router.push({ name: data.name })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  background-color: #ebedee;
  margin: 10px 0;
}
</style>
