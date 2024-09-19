<template>
  <div id="app">
    <title-top></title-top>
    <div>
      <router-view></router-view>
    </div>

    <!-- <footer-bottom></footer-bottom> -->
  </div>
</template>

<script>
// import footerBottom from '@/components/layout/footerBottom.vue'
import titleTop from '@/components/layout/titleTop.vue'
export default {
  name: 'indexPage',
  components: {
    // footerBottom,
    titleTop
  },
  computed: {
    drawer() {
      return this.$store.state.drawer
    }
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
    hideLogin() {
      this.$store.commit('showLogin', false)
    },
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
}
</style>
