<template>
  <div class="top">
    <div class="title">
      <div class="title_tab commom">
        <el-menu
          class="pfl"
          :default-active="this.$router.path"
          router
          style="box-shadow: 1px 3px 10px 0 #96a5c5"
          mode="horizontal"
          text-color="#2a2a2a"
          active-text-color="#2a2a2a"
          :unique-opened="true"
        >
          <el-menu-item @click="goHome">首页</el-menu-item>
          <el-menu-item index="/shikuangSh">最新地震信息</el-menu-item>
          <el-menu-item index="/earthlist">地震目录</el-menu-item>
          <el-menu-item index="/earthlist">中国震例</el-menu-item>
          <el-menu-item index="/earthtopic">大震专题</el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, removeToken, removeUser } from '@/utils/auth'
export default {
  data() {
    return {
      activeIndex: '1',
      user: {},
      show: true
    }
  },
  computed: {
    login() {
      return this.$store.state.login
    }
  },
  created() {
    let user = getUser()
    if (user !== undefined) {
      let info = JSON.parse(user)
      this.user = {
        name: info.name,
        url: info.avatar
      }
      this.$store.commit('getLogin', true)
    }
  },
  mounted() {
    // window.microApp.addGlobalDataListener(this.dataListener, true)
    if (!window.__MICRO_APP_BASE_ROUTE__) {
      this.show = false
    }
  },
  watch: {},

  methods: {
    dataListener(data) {
      if (data.user !== null) {
        let info = data.user
        this.user = {
          name: info.name,
          url: info.avatar
        }
        this.$store.commit('getLogin', true)
      } else {
        this.$store.commit('getLogin', false)
        this.$message.error('当前未登录')
      }
    },
    goHome() {
      location.href = '/home'
    },
    // 退出登录
    logOut(command) {
      if (command === '退出登录') {
        removeToken()
        removeUser()
        this.$store.commit('getLogin', false)
      }
    },
    // 下拉菜单显示隐藏
    showDrop(e) {
      if (e === false) {
        let token = getUser()
        if (token === 'undefined') {
          this.$store.commit('getLogin', false)
        }
      }
    },
    gotoHome(name) {
      // 向基项目发送数据
      window.microApp && window.microApp.dispatch({ route: { name } })
    },
    // 打开工作台
    route() {
      let token = JSON.parse(sessionStorage.getItem('token'))
      let url = JSON.parse(localStorage.getItem('url'))
      window.open(`${url}`, token) // 新窗口打开
    },
    getStorage() {
      let info = getUser()

      if (info !== undefined) {
        info = JSON.parse(info)
        this.user = {
          name: info.name,
          url: info.avatar
        }
        this.$store.commit('getLogin', true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  .toptitle {
    width: 100%;
    background-color: #2f77c9;
    .top_title {
      height: 30px;
      top: -1px;
      width: 100%;
      .t_box {
        display: flex;
        justify-content: space-between;
        line-height: 30px;
        box-sizing: border-box;
        .left {
          a {
            color: #fff;
          }
        }
        .right {
          display: flex;
          a {
            padding: 0 10px;
            color: #fff;
            span {
              display: flex;
              align-items: center;
            }
            img {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background-color: pink;
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
  .title {
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    background-color: #fff;
    .title_tab {
      width: 100%;
      box-sizing: border-box;
      .el-menu--horizontal {
        border: none;
        height: 48px;
        background-color: #fff !important;
      }

      .el-menu-item:hover {
        background-color: #185392 !important;
        border-bottom-color: rgb(255, 255, 255) !important;
      }
      .el-menu--horizontal > .el-menu-item {
        font-size: 20px;
        // font-weight: 700;
      }
      /deep/.el-submenu__title:hover {
        background-color: #95c8ff !important;
        border-bottom-color: rgb(255, 255, 255) !important;
      }
      /deep/.el-menu--horizontal > .el-menu-item {
        height: 48px;
        line-height: 48px;
        border-bottom: 0px solid transparent;
        background-color: #fff !important;
      }
      /deep/.el-menu-item:hover {
        background-color: #95c8ff !important;
      }
    }
    .pfl {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // width: 1200px;
    }
  }
}
@media (max-width: 1200px) {
  .top_title {
    width: 1200px;
  }
}
</style>
