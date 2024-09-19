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
        <el-menu-item index="1" @click="toPath('home')">首页</el-menu-item>

        <!-- 数据目录服务导航栏 -->
          <el-submenu
            index="3"
            :popper-append-to-body="false"
            class="numberone"
            v-if="type == 0"
          >
            <template slot="title">
              <div @mouseenter="closeAllExpand">观测数据</div>
            </template>
            <div style="display: flex">
              <div class="menuItem">
                <el-menu-item index="3-1" @click="toPath2('serviceSeismometry',1)">
                  <div @mouseenter="closeAllExpand">测震</div>
                </el-menu-item>
                <el-menu-item
                  index="3-2"
                  @click="toPath2('serviceCatalogue',1)"
                >
                  强震动
                </el-menu-item>
                <el-menu-item index="3-3">
                  <div
                    style="margin-left: 27px"
                    @click="toPath3('/precursor/crust',1)"
                    @mouseenter="showWLExpand = true"
                  >
                    地球物理<i class="el-icon-arrow-right"></i>
                  </div>
                </el-menu-item>
                <el-menu-item
                  index="3-4"
                  @click="toPath2('serviceScientific',1)"
                >
                  科学台阵
                </el-menu-item>
                <el-menu-item
                  index="3-5"
                  @click="toPath2('serviceSimulation',1)"
                >
                  模拟资料
                </el-menu-item>
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
                  @click="toPath3('/precursor/fluid',1)"
                  @mouseenter="showXBExpand = false"
                >
                  流体
                </div>
                <div
                  class="expandItem"
                  @click="toPath3('/precursor/electromagnetism',1)"
                  @mouseenter="showXBExpand = false"
                >
                  电磁
                </div>
                <div
                  class="expandItem"
                  @click="toPath3('/precursor/gravity',1)"
                  @mouseenter="showXBExpand = false"
                >
                  重力
                </div>
                <div
                  class="expandItem"
                  @click="toPath3('/precursor/gnss',1)"
                  @mouseenter="showXBExpand = false"
                >
                  GNSS
                </div>
              </div>
              <div class="expand" v-if="showXBExpand">
                <div class="expandItem" @click="toPath3('/precursor/crust',1)">
                  定点形变
                </div>
                <div class="expandItem" @click="toPath3('/precursor/flowMation',1)">
                  流动形变
                </div>
              </div>
            </div>
          </el-submenu>
          <el-menu-item index="2" v-if="type == 0" @click="toPath3('/prevention/catalogue',0)">
            震防数据
          </el-menu-item>
          <el-menu-item index="3" v-if="type == 0" @click="toPath3('/prevention/prospecting',0)">
            探测数据
          </el-menu-item>
          <el-menu-item index="4" v-if="type == 0">
            调查数据
          </el-menu-item>
          <el-menu-item index="5" v-if="type == 0">
            实验数据
          </el-menu-item>
          <el-menu-item index="6" v-if="type == 0">
            专题数据
          </el-menu-item>
          <el-menu-item index="7" v-if="type == 0">
            综合数据
          </el-menu-item>


          <!-- 测震导航栏 -->
          <el-menu-item index="1" v-if="type == 1" @click="toPath2('serviceSeismometry',1)">
            测震
          </el-menu-item>
          <el-menu-item index="2" v-if="type == 1" @click="toPath2('serviceCatalogue',1)">
            强震动
          </el-menu-item>
          <el-submenu
            index="3"
            :popper-append-to-body="false"
            class="numberone"
            v-if="type == 1"
          >
            <template slot="title">
              <div @mouseenter="closeAllExpand" @click="toPath3('/precursor/crust',1)">地球物理</div>
            </template>
            <div style="display: flex">
              <div class="menuItem">
                <el-menu-item index="3-1" @click="toPath('precursorCatalogue')">
                  <div
                    style="margin-left: 27px"
                    @mouseenter="showXBExpand = true"
                  >
                    形变<i class="el-icon-arrow-right"></i>
                  </div>
                </el-menu-item>
                <el-menu-item
                  index="3-2"
                  @click="toPath3('/precursor/fluid',1)"
                >
                <div
                    @mouseenter="showXBExpand = false"
                  >
                    流体
                    </div>
                </el-menu-item>
                <el-menu-item index="3-3" @click="toPath3('/precursor/electromagnetism',1)">
                  <div
                    @mouseenter="showXBExpand = false"
                  >
                    电磁
                    </div>
                </el-menu-item>
                <el-menu-item
                  index="3-4"
                  @click="toPath3('/precursor/gravity',1)"
                >
                <div
                    @mouseenter="showXBExpand = false"
                  >
                    重力
                  </div>
                </el-menu-item>
                <el-menu-item
                  index="3-5"
                  @click="toPath3('/precursor/gnss',1)"
                >
                  <div
                    @mouseenter="showXBExpand = false"
                  >
                    GNSS
                  </div>
                </el-menu-item>
              </div>
              <div class="expand" v-if="showXBExpand">
                <div class="expandItem" @click="toPath3('/precursor/crust',1)">
                  定点形变
                </div>
                <div class="expandItem" @click="toPath3('/precursor/flowMation',1)">
                  流动形变
                </div>
              </div>
            </div>
          </el-submenu>
          <el-menu-item index="4" v-if="type == 1" @click="toPath2('serviceScientific',1)">
            科学台阵
          </el-menu-item>
          <el-menu-item index="5" v-if="type == 1" @click="toPath2('serviceSimulation',1)">
            模拟资料
          </el-menu-item>
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
      type: null,
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
    //顶部导航栏内容判断
    this.type = location.search.substring(1).split('=')[1]
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
      this.type = type
      this.$router.push({name: name, query:{ type: type }})
    },
    //不同模块跳转
    toPath3(name,type){
      this.type = type
      location.href = name+'?type='+type
    },
    toPath(name) {
      // console.log(name, path)
      // microApp.setData(name, { path: path })
      // this.$router.push(path)
      this.$router.push({ name: name })
      if(name == 'home') location.href = '/home'
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
      height: 75px;
      display: flex;

      .l_box {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: 75px;
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
        .left {
          display: flex;
          align-items: center;
          height: 100%;
          .img1 {
            width: 75px;
            height: 75px;
            background: url(@/assets/images/1.webp) no-repeat center;
            background-size: cover;
          }
          .img2 {
            width: 120px;
            height: 47px;
            background: url(@/assets/images/2.png) no-repeat center;
            background-size: cover;
          }
        }
        .centre {
          color: #0051a7;
          margin-left: 5px;
          min-width: 639.75px;
          h3 {
            font-size: 24px;
            letter-spacing: 5px;
          }
          p {
            font-size: 6px;
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
      box-sizing: border-box;
      width: 100%;
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
    width: 100%;
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
