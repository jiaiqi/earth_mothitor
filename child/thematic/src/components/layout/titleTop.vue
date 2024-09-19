<template>
  <div class="top">
    <!-- <div class="toptitle" v-if="show">
      <div class="top_title" v-if="show">
        <div class="commom t_box">
          <div class="left">
            <a href="javascript:void(0)" @click="gotoHome('index')">返回首页</a>
          </div>
          <div class="right">
            <a href="JavaScript:void(0)">
              <el-dropdown @command="logOut" @visible-change="showDrop">
                <span v-show="login" class="el-dropdown-link">
                  <img :src="user.url" alt="" /><span style="color: #fff">{{
                    user.name
                  }}</span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="退出登录"
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </a>
          </div>
        </div>
      </div>
    </div> -->
    <div class="title">
      <div class="title_tab commom">
        <el-menu
          class="pfl"
          :default-active="this.$router.path"
          router
          mode="horizontal"
          background-color="#1492ff"
          text-color="#fff"
          active-text-color="#fff"
          :unique-opened="true"
        >
          <el-menu-item index="/country">地震预测预报</el-menu-item>
          <el-menu-item index="/industry">地震灾害防御数据</el-menu-item>
          <el-menu-item index="/local">地震应急救援数据</el-menu-item>
          <el-menu-item index="/disaster">震后救灾与重建数据</el-menu-item>
          <el-menu-item index="/prevention">防震减灾管理数据</el-menu-item>
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
    background-color: #1e60a7;
    .title_tab {
      box-sizing: border-box;
      .el-menu--horizontal {
        border: none;
        height: 48px;
        background-color: #1e60a7 !important;
      }

      .el-menu-item:hover {
        background-color: #185392 !important;
        border-bottom-color: rgb(255, 255, 255) !important;
      }
      .el-menu--horizontal > .el-menu-item {
        font-size: 20px;
        font-weight: 700;
      }
      /deep/.el-menu--horizontal > .el-menu-item {
        height: 48px;
        line-height: 48px;
        border-bottom: 0px solid transparent;
        background-color: #1e60a7 !important;
      }
    }
    .pfl {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 1200px;
    }
  }
}
@media (max-width: 1200px) {
  .top .top_title,
  .top .title {
    width: 1200px;
  }
}
</style>
