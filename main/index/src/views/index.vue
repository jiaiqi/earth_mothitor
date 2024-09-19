<template>
  <div class="home">
    <init-page></init-page>
  </div>
</template>

<script>
import initPage from './initPage.vue'
export default {
  name: 'index',
  data() {
    return {
      micro: {
        url: '',
        key: '',
        name: '',
        data: {},
        baseroute: ''
      },
      // 刷新token锁
      refreshLock: false,
      // 刷新token的时间
      refreshTime: ''
    }
  },
  components: {
    initPage
  },
  methods: {
    created() {
      /* 子模块创建 */
      // console.log(`${this.micro.name}-子模块创建`)
    },
    beforemount() {
      /* 子模块挂载之前 */
      // console.log(`${this.micro.name}-子模块挂载之前`)
    },
    mounted() {
      /* 子模块挂载 */
      // console.log(`${this.micro.name}-子模块挂载`)
      this.loading = false
    },
    unmount() {
      /* 子模块卸载 */
      // console.log(`${this.micro.name}-子模块卸载`)
    },
    error() {
      /* 子模块异常 */
      // console.log(`${this.micro.name}-子模块异常`)
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  background-color: #fff;
}
/deep/.el-dialog__header {
  padding: 0;
}
/deep/.el-dialog__wrapper {
  .el-dialog {
    border-radius: 10px;
  }
}
</style>
