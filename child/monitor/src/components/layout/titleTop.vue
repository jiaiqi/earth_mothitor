<template>
  <div class="top">
    <div class="title">
      <div class="title_tab commom">
        <el-menu
          class="pfl"
          style="box-shadow: 1px 3px 10px 0 #96a5c5"
          mode="horizontal"
          background-color="#fff"
          text-color="#2a2a2a"
          active-text-color="#2a2a2a"
          :unique-opened="true"
          :default-active="this.$router.path"
        >
          <el-menu-item index="1" @click="goPath('/home')">首页</el-menu-item>
          <el-submenu index="2" :popper-append-to-body="false">
            <template slot="title">
              <div @click="goPath('/shikuang/shikuangSh')">震情快报</div>
            </template>
            <div class="menuItem">
              <el-menu-item index="2-1" @click="goPath('/shikuang/shikuangSh')">
                最新震情
              </el-menu-item>
              <el-menu-item index="2-2" @click="goPath('/shikuang/earthlist')">
                地震目录
              </el-menu-item>
              <el-menu-item index="2-3" @click="goPath('/shikuang/earthlist')">
                中国震例
              </el-menu-item>
              <!-- <el-menu-item index="2-4" @click="toPath('earthOption')">
                大震专题
              </el-menu-item> -->
            </div>
          </el-submenu>
          <el-submenu
            index="3"
            :popper-append-to-body="false"
            class="numberone"
          >
            <template slot="title">
              <div @mouseenter="closeAllExpand" @click="goPath('/service/seismometry?type=1')">地震数据</div>
            </template>
            <div style="display: flex">
              <div class="menuItem">
                <el-menu-item index="3-1">
                  <div
                    style="margin-left: 27px"
                    @click="goPath('/service/seismometry?type=0')"
                    @mouseenter="showGCExpand = true"
                  >
                    观测数据<i class="el-icon-arrow-right"></i>
                  </div>
                </el-menu-item>
                <el-menu-item index="3-2" @click="goPath('/prevention/catalogue?type=0')">
                  <div @mouseenter="closeAllExpand">震防数据</div>
                </el-menu-item>
                <el-menu-item
                  index="3-3"
                  @click="goPath('/prevention/prospecting?type=0')"
                >
                  探测数据
                </el-menu-item>
                <el-menu-item index="3-4">调查数据</el-menu-item>
                <el-menu-item index="3-5">实验数据</el-menu-item>
                <el-menu-item index="3-6">专题数据</el-menu-item>
                <el-menu-item index="3-7">综合数据</el-menu-item>
              </div>
              <div
                class="expand"
                v-if="showGCExpand"
                @mouseenter="showGCExpand = true"
              >
                <div
                  class="expandItem"
                  @click="goPath('/service/seismometry?type=1')"
                  @mouseenter=";(showWLExpand = false), (showXBExpand = false)"
                >
                  测震
                </div>
                <div
                  class="expandItem"
                  @click="goPath('/service/catalogue?type=1')"
                  @mouseenter=";(showWLExpand = false), (showXBExpand = false)"
                >
                  强震动
                </div>
                <div
                  class="expandItem"
                  @mouseenter=";(showWLExpand = true), (showXBExpand = false)"
                >
                  <div
                    style="margin-left: 15px"
                    @mouseenter="showWLExpand = true"
                    @click="goPath('/precursor/crust?type=1')"
                  >
                    地球物理<i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <div
                  class="expandItem"
                  @click="goPath('/service/scientific?type=1')"
                  @mouseenter=";(showWLExpand = false), (showXBExpand = false)"
                >
                  科学台阵
                </div>
                <div
                  class="expandItem"
                  @click="goPath('/service/simulation?type=1')"
                  @mouseenter=";(showWLExpand = false), (showXBExpand = false)"
                >
                  模拟资料
                </div>
              </div>
              <div class="expand" v-if="showWLExpand">
                <div class="expandItem">
                  <div
                    style="margin-left: 27px"
                    @mouseenter="showXBExpand = true"
                  >
                    形变<i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <div
                  class="expandItem"
                  @click="goPath('/precursor/fluid?type=1')"
                  @mouseenter="showXBExpand = false"
                >
                  流体
                </div>
                <div
                  class="expandItem"
                  @click="goPath('/precursor/electromagnetism')"
                  @mouseenter="showXBExpand = false"
                >
                  电磁
                </div>
                <div
                  class="expandItem"
                  @click="goPath('/precursor/gravity')"
                  @mouseenter="showXBExpand = false"
                >
                  重力
                </div>
                <div
                  class="expandItem"
                  @click="goPath('/precursor/gnss')"
                  @mouseenter="showXBExpand = false"
                >
                  GNSS
                </div>
              </div>
              <div class="expand" v-if="showXBExpand">
                <div class="expandItem" @click="goPath('/precursor/crust')">
                  定点形变
                </div>
                <div class="expandItem" @click="goPath('/precursor/flowmation')">
                  流动形变
                </div>
              </div>
            </div>
            <!-- <el-submenu index="3-2" class="one">
              <template slot="title"></template>
              <el-menu-item index="">活动断层探测</el-menu-item>
              <el-menu-item index="">地震探测</el-menu-item>
              <el-menu-item index="">海上探测</el-menu-item>
              <el-menu-item index="">电磁探测</el-menu-item>
              <el-menu-item index="">大地热流探测</el-menu-item>
            </el-submenu>
            <el-submenu index="3-5" class="one">
              <template slot="title"></template>
              <el-menu-item index="">地震科学工程</el-menu-item>
              <el-menu-item index="">地震科学研究</el-menu-item>
            </el-submenu>
          -->
          </el-submenu>
          <el-menu-item index="4"  @click="goPath('/monitor/productlist?type=1')">
            地震产品
          </el-menu-item>
          <el-menu-item index="5" @click="goPath('/knowledge/statute')">法规标准</el-menu-item>
          <el-menu-item index="6" @click="goPath('/knowledge/science')">地震科普</el-menu-item>
          <!-- <el-submenu index="7" :popper-append-to-body="false">
            <template slot="title">用户反馈</template>
            <div class="menuItem">
              <el-menu-item index="">调查问卷</el-menu-item>
              <el-menu-item index="">意见反馈</el-menu-item>
              <el-menu-item index="">联系我们</el-menu-item>
            </div>
          </el-submenu> -->
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { MICRO_APPS } from '@/micro/config.js'
import { getToken, getUser, getExpiresIn } from '@/utils/auth'
// import { Icon } from 'element-ui'
import { mapGetters, mapState } from 'vuex'
// import microApp from '@micro-zoe/micro-app'
export default {
  data() {
    return {
      names: this.name,
      avatars: this.avatar,
      guance: '',
      showGCExpand: false,
      showWLExpand: false,
      showXBExpand: false
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
    if (!token) {
      this.$store.commit('getLogin', false)
    } else {
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
      this.$store.dispatch('clearCookie').then()
        this.$store.dispatch('LogOut').then((res) => {
          this.$store.commit('getLogin', false)
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
    toPath3(name) {
      // console.log(name, path)
      // microApp.setData(name, { path: path })
      // this.$router.push(path)
      this.$router.push(name)
    },
    goPath(path) {
      location.href = path
    },
    closeAllExpand() {
      this.showGCExpand = false
      this.showWLExpand = false
      this.showXBExpand = false
    },
    // 打开工作台
    route() {
      let app = this.getAppUrl('backstage')
      let home = window.location.host
      let url = app.url
      let token = getToken()
      let expiresIn = getExpiresIn()
      window.open(`${url}`, [home, token, expiresIn]) // 新窗口打开
    },
    // 退出登录
    logOut(command) {
      if (command === '退出登录') {
        this.$store.dispatch('clearCookie').then()
        this.$store.dispatch('LogOut').then((res) => {
          this.$store.commit('getLogin', false)
          this.$router.go(0)
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
      console.log(value)
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  // height: 210px;
  .toptitle {
    width: 100%;
    background-color: #fff;

    .logo {
      width: 100%;
      height: 100px;
      display: flex;

      .l_box {
        position: relative;
        display: flex;
        align-items: center;
        height: 100px;
        padding: 30px 30px;
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
          .typeText:hover {
            font-weight: bold;
            color: #1068ff;
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
        .centre {
          color: #154e89;
          margin-left: 12px;
          min-width: 639.75px;
          h3 {
            font-size: 30px;
            letter-spacing: 6px;
          }
          p {
            font-size: 10px;
            font-weight: 700;
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
      width: 100%;
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
        font-size: 22px;
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
