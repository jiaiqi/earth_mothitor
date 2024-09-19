<template>
  <div class="top">
    <div class="toptitle">
      <div class="logo">
        <div class="l_box commom">
          <div class="title-right">
            <el-button type="primary" size="mini" plain class="loginEnter" @click="loginShow('user')" v-if="!login">
              <i
                class="el-icon-user-solid"
                style="color: #2e6efc; padding-right: 5px"
              ></i>
              <span class="typeText">个人用户</span>
            </el-button>
            <el-button type="primary" size="mini" plain class="loginEnter" @click="loginShow('entr')" v-if="!login">
              <i
                class="el-icon-user"
                style="color: #2e6efc; padding-right: 5px"
              ></i>
              <span class="typeText">企业用户</span>
            </el-button>
            <!-- <el-button type="primary" size="mini" plain class="loginEnter" @click="loginShow('expert')" v-if="!login">
              <i
                class="el-icon-s-custom"
                style="color: #2e6efc; padding-right: 5px"
              ></i>
              <span class="typeText">行业用户</span>
            </el-button> -->
            <div class="checkBtn" v-if="!showTask && login" style="margin-right: 10px">
              <!-- <a :href="getAppUrl('backstage').url" target="_blank"> -->
                <el-button type="primary" size="mini" @click="route" round plain>工作台</el-button>
              <!-- </a> -->
            </div>
            <div class="checkBtn" v-if="showTask && login">
              <!-- <el-badge :value="12" class="item"> -->
                <el-button type="primary" size="mini" @click="toPath('approval')" round plain>任务列表</el-button>
              <!-- </el-badge> -->
            </div>

            <!-- <div
              class="loginBtn"
              style="
                background-color: #fff;
                color: #2e6efc !important;
                font-size: 15px;
              "
              @click="registerShow"
              v-if="!login"
            >
              注册
            </div>
            <div class="loginBtn" @click="loginShow" v-if="!login">登录</div> -->
            <a
              v-if="login"
              href="JavaScript:void(0)"
              style="margin-right: 10px;margin-top: 3px;"
            >
              <el-dropdown @command="logOut">
                <span class="el-dropdown-link">
                  <img :src="avatars" alt="" />
                  <span style="color: #fff">
                    {{ names }}
                  </span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="退出登录"
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </a>
            <!-- <router-link to="/collmy">联系我们</router-link> -->
            <!-- <router-link to="/sitemap">网站地图</router-link> -->
            <!-- <a v-if="login" href="#" @click="route">工作台</a> -->
          </div>
          <div class="left">
            <div class="img1"></div>
            <div class="img2"></div>
          </div>
          <div class="centre">
            <h3>国家防震减灾公共服务平台</h3>
          </div>
          <!-- <div class="right">
          <img src="@/assets/images/3.jpg" alt="" />
        </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MICRO_APPS } from '@/micro/config.js'
import { getToken, getUser, getExpiresIn, getRefreshToken } from '@/utils/auth'
// import { Icon } from 'element-ui'
import { mapGetters, mapState } from 'vuex'
// import microApp from '@micro-zoe/micro-app'
export default {
  data() {
    return {
      names: this.name,
      avatars: this.avatar,
      guance: '',
      showTask: false,
      hideTop: false, //缩小网页顶
    }
  },
  components: {},
  computed: {
    ...mapGetters(['avatar', 'name']),
    ...mapState({
      drawer: (state) => {
        return state.drawer
      },
      showRegister: (state) => {
        return state.showRegister
      }
    }),
    login() {
      return this.$store.state.login
    }
  },
  props: ['menushow'],
  watch: {
    drawer(newVal, oldVal) {
      if (newVal === false) {
        this.getUserImg()
      }
    }
  },
  created() {
    let token = getToken()
    let userInfo = JSON.parse(getUser())
    if (!token) {
      this.$store.commit('getLogin', false)
    } else {
      //如果是个人普通用户则显示
      if(userInfo.deptId == 223){
        this.showTask = true
      }else{
        this.showTask = false
      }
      this.getUserImg()
    }
  },
  mounted() {
    //token失效重新登录判断
    if (location.href.indexOf('relog') !== -1) {
      this.logOut('退出登录')
      this.$router.push({ name: 'home' })
    }
    //未登录重新登录
    if (location.href.indexOf('unlog') !== -1) {
        this.$store.dispatch('LogOut').then((res) => {
          this.$store.commit('getLogin', false)
          this.$store.dispatch('clearCookie').then()
        })
      this.loginShow('user')
    }
  },
  methods: {
    // 打开登录窗口
    loginShow(type) {
      let info = {
        show: true,
        type: type
      }
      this.$store.commit('showLogin', info)
    },
    // 打开注册窗口
    registerShow() {
      this.$store.commit('showRegister', true)
    },
    getAppUrl(name) {
      /* 获取子模块 url 和 name */
      return MICRO_APPS.find((item) => item.name === name) || {}
    },
    toPath2(name,type) {
      this.$router.push({name: name, query:{ type: type }})
    },
    toPath(name) {
      // console.log(name, path)
      // microApp.setData(name, { path: path })
      // this.$router.push(path)
      this.$router.push({ name: name })
    },
    // 打开工作台
    route() {
      let app = this.getAppUrl('backstage')
      let home = window.location.host
      let url = app.url
      let token = getToken()
      let expiresIn = getExpiresIn()
      let refreshToken = getRefreshToken()
      // location.href = url
      window.open(`${url}`, [home, token, expiresIn, refreshToken]) // 新窗口打开
    },
    // 退出登录
    logOut(command) {
      if (command === '退出登录') {
        this.$router.push({ name: 'home' })
        this.$store.dispatch('LogOut').then((res) => {
        this.$store.dispatch('clearCookie').then()
          this.$store.commit('getLogin', false)
        })
      }
    },
    // 获取用户头像和姓名
    getUserImg() {
      let user = JSON.parse(getUser())
      this.$store.commit('getLogin', true)
      this.avatars = user.avatar
      this.names = user.name
    },
    handleChange(value) {
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  // height: 210px;
  .toptitle {
    width: 100%;
    background-color: #2f77c9;

    .logo {
      width: 100%;
      height: 52px;
      display: flex;

      .l_box {
        position: relative;
        display: flex;
        align-items: center;
        height: 50px;
        padding: 5px 30px;
        .title-right {
          position: absolute;
          top: 10px;
          right: 20px;
          display: flex;
          .loginEnter {
            color: #409eff;
            padding: 6px 8px;
            cursor: pointer;
          }
          .checkBtn {
            margin-right: 20px;
            padding-top: 3px;
          }
          .typeText {
            font-size: 14px;
          }
          .loginEnter:hover {
            font-weight: bold;
            color: #e6e6e6;
          }
          .loginBtn {
            cursor: pointer;
            background-color: #2e6efc;
            padding: 3px 15px;
            font-size: 14px;
            margin: 5px 5px;
            text-align: center;
            color: #fff !important;
          }
          a {
            color: #2e6efc;
            span {
              display: flex;
              align-items: center;
              color: #fff;
              font-size: 16px;
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
        .left {
          display: flex;
          align-items: center;
          height: 100%;
          .img1 {
            width: 45px;
            height: 45px;
            margin-right: 5px;
            background: url(@/assets/images/1.png) no-repeat center;
            background-size: cover;
          }
          .img2 {
            width: 90px;
            height: 35px;
            background: url(@/assets/images/2.png) no-repeat center;
            background-size: cover;
          }
        }
        .centre {
          // color: #154e89;
          color: #fff;
          margin-left: 12px;
          min-width: 639.75px;
          h3 {
            font-size: 22px;
            letter-spacing: 2px;
          }
        }
        .right {
          position: relative;
          flex: 1;
          img {
            position: absolute;
            height: 80px;
            width: 100%;
            top: -82px;
            left: -40px;
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
      box-sizing: border-box;
      .el-menu--horizontal {
        border: none;
        height: 52px;
      }

      .el-menu-item:hover {
        background-color: #95c8ff !important;
        border-bottom-color: rgb(255, 255, 255) !important;
      }
      .el-menu--horizontal > .el-menu-item,
      /deep/.el-submenu__title {
        font-size: 18px;
      }
      /deep/.el-menu--horizontal > .el-menu-item,
      /deep/.el-menu--horizontal > .el-submenu .el-submenu__title {
        height: 48px;
        line-height: 48px;
        border-bottom: 0px solid transparent;
      }
      /deep/.el-submenu__title:hover {
        background-color: #95c8ff !important;
        border-bottom-color: rgb(255, 255, 255) !important;
      }
      /deep/ .el-icon-arrow-down:before {
        content: '';
      }
      /deep/.el-icon-arrow-down {
        display: none;
      }
      /deep/.el-menu--popup {
        display: flex;
        justify-content: start;
        border-radius: 5px;
        background-color: #e1e8f0 !important;
        color: #185392 !important;
        text-align: center;
        width: 100% !important;
        min-width: 150px !important;
        transform: translateX(-10%);
        box-shadow: 0px 0px 5px 0px rgb(75, 75, 75);

        .el-menu-item {
          width: 180px !important;
          color: #000000 !important;
          background-color: #e1e8f0 !important;
        }
        .el-menu-item:hover {
          color: #fff !important;
          background-color: #95c8ff !important;
        }
      }
      /deep/.el-submenu .el-menu-item {
        width: 100%;
        min-width: 0;
      }
      .el-menu--horizontal .el-menu .el-menu-item {
        padding: 0 20px;
      }
      .numberone {
        .one {
          background-color: #fff;
        }
      }
      // .el-submenu .el-menu--horizontal .el-menu--popup{
      //   background-color: #FFf;
      // }
    }

    .pfl {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .menuItem {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      .expand {
        width: 150px;
        height: 100px;
        text-align: center;
        padding: 3px 0px;
        border-radius: 5px;
      }
    }
  }
}
.expandItem {
  width: 100px;
  height: 35px;
  line-height: 35px;
  font-size: 13px;
  vertical-align: middle;
  color: #000000;
  text-align: center;
  cursor: pointer;
}

.expandItem:hover {
  color: #fff !important;
  background-color: #95c8ff !important;
  text-align: center;
}
@media (max-width: 1200px) {
  .top .toptitle,
  .top .top_title,
  .top .logo,
  .top .title {
    width: 1200px;
  }
  .top .title .title_tab {
    /deep/.el-menu--popup {
      flex-direction: column;
      transform: translateX(-20%);
      width: 70%;
      min-width: 100px !important;
    }
  }
}
</style>
