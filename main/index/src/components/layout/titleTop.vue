<template>
  <div class="top">
    <!-- <div class="toptitle">
      <div class="logo">
        <div class="l_box commom">
          <div class="title-right">
            <el-button type="primary" size="mini" round plain class="loginEnter" @click="loginShow('user')" v-if="!login">
              <i
                class="el-icon-user-solid"
                style="color: #2e6efc; padding-right: 5px"
              ></i>
              <span class="typeText">个人用户</span>
            </el-button>
            <el-button type="primary" size="mini" round plain class="loginEnter" @click="loginShow('entr')" v-if="!login">
              <i
                class="el-icon-user"
                style="color: #2e6efc; padding-right: 5px"
              ></i>
              <span class="typeText">企业用户</span>
            </el-button>
            <el-button type="primary" size="mini" round plain class="loginEnter" @click="loginShow('expert')" v-if="!login">
              <i
                class="el-icon-s-custom"
                style="color: #2e6efc; padding-right: 5px"
              ></i>
              <span class="typeText">行业用户</span>
            </el-button>
            <div class="checkBtn" v-if="login" style="margin-right: 10px">
              <el-button type="primary" size="mini" @click="route" round plain>工作台</el-button>
            </div>
            <div class="checkBtn" v-if="login">
              <el-badge :value="12" class="item">
                <el-button type="primary" size="mini" @click="toPath('excelApproval')" round plain>审批任务</el-button>
              </el-badge>
            </div>
            <a
              v-if="login"
              href="JavaScript:void(0)"
              style="margin-right: 10px;margin-top: 3px;"
            >
              <el-dropdown @command="logOut">
                <span class="el-dropdown-link">
                  <img :src="avatars" alt="" />
                  <span style="color: black">
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
          </div>
          <div class="left">
            <div class="img1"></div>
            <div class="img2"></div>
          </div>
          <div class="centre">
            <h3>国家防震减灾公共服务平台</h3>
            <p>
              National public service platform for earthquake prevention and
              disaster reduction
            </p>
          </div>
        </div>
      </div>
    </div> -->
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
          <el-submenu
            index="3"
            :popper-append-to-body="false"
            class="numberone"
          >
            <template slot="title">
              <div @mouseenter="closeAllExpand" @click="toPath('',{typeName:'数据目录'},'catalog')">数据目录</div>
            </template>
            <div style="display: flex">
              <div class="menuItem">
                <el-menu-item v-for="(item,index) in cataList" :key="item.typeName" :index="'3-'+index">
                  <div
                    class="dataCata"
                    @click="toPath(item.remark,item,'catalog')"
                    @mouseenter="closeAllExpand(item.typeName)"
                  >
                    <span>{{item.typeName}}</span><i class="el-icon-arrow-right"></i>
                  </div>
                </el-menu-item>
              </div>
              <div
                class="expand"
                :style="{width: bigRow? '400px': '200px'}"
                v-if="showGCExpand"
              >
                <div
                  v-for="item in list"
                  :key="item.id"
                  :style="{width: bigRow? '200px': '100px'}"
                  class="expandItem"
                  @click="toPath(item.url,item,'catalog')"
                >
                  {{ item.sname }}
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
          <el-menu-item id="prodAchevPage" index="4"  @click="toPath('prodAchevPage')">
            产品目录
          </el-menu-item>
          <el-menu-item id="productlist" index="5" @click="toPath('productlist')">技术服务</el-menu-item>
          <el-menu-item id="propagandaStatute" index="6" @click="toPath('propagandaStatute')">法规标准</el-menu-item>
          <el-menu-item id="propagandaScience" index="7" @click="toPath('propagandaScience')">地震科普</el-menu-item>
          <el-submenu index="2" :popper-append-to-body="false">
            <template slot="title">
              <div @click="toPath('shikuangShik')">地震信息</div>
            </template>
            <div class="menuItem">
              <el-menu-item index="2-1" @click="toPath('shikuangShik')">
                地震信息
              </el-menu-item>
              <el-menu-item index="2-2" @click="toPath('shikuangHisPage')">
                历史上的今天
              </el-menu-item>
              <!-- <el-menu-item index="2-4" @click="toPath('earthOption')">
                大震专题
              </el-menu-item> -->
            </div>
          </el-submenu>
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
import { getListPage, getTypeDic } from "@/api/count";
import { MICRO_APPS } from '@/micro/config.js'
import { Notification } from 'element-ui'
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
      bigRow: false,
      timeNotice: null,
      showGCExpand: false,
      showWLExpand: false,
      showXBExpand: false,
      showDCExpand: false,
      showEXPxpand: false,
      showSPExpand: false,
      showZHExpand: false,
      lookearth: [], //历史上的今天数据
      cataList: [],
      list: [],
      allList: [],
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
    setTimeout(() => {
      this.lookearth = localStorage.getItem('history')
    }, 1000);
    this.getCatalog()
    // this.clearStyle()
    //获取当前点击的样式，设置样式
    let currentItem = sessionStorage.getItem('currentItem')
    if(currentItem == 'service'){
      document.getElementsByClassName('el-submenu__title')[0].style = 'border-bottom-color:transparent;background-color:#95c8ff;color:rgb(42,42,42)'
    }
    if(currentItem == 'shikuangShik'){
      document.getElementsByClassName('el-submenu__title')[1].style = 'border-bottom-color:transparent;background-color:#95c8ff;color:rgb(42,42,42)'
    }
    if(document.getElementById(currentItem)){
      document.getElementById(currentItem).style = 'background-color:#95c8ff;color:rgb(42,42,42)'
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
    getCatalog() {
      let par = 'pageNum=1&pageSize=999'
      getTypeDic(par).then(res=>{
        this.cataList = res.records
        res.records.forEach(item=>{
          let p = 'pageNum=1&pageSize=999&typeName='+item.typeName
          getListPage(p).then(resp=>{
            this.allList.push({
              name: item.typeName,
              list: resp.records
            })
          })
        })
      })
    },
    //检查是否登录
    checkLogin(url,item){
      if(this.$store.state.login){
        sessionStorage.setItem('currentItem','service')
        this.toPath(url,item)
      }else{
        const self = this
        if(!this.timeNotice){
          Notification.error({
            title: '提示',
            message: '用户未登录！请登录再试'
          })
          self.timeNotice = setTimeout(() => {
            self.timeNotice = null
          }, 1500);
        }
      }
    },
    //清除导航栏样式
    clearStyle() {
      sessionStorage.setItem('currentItem','')
      document.getElementsByClassName('el-submenu__title')[0].style = 'border-bottom-color:transparent;background-color:#fff;color:rgb(42,42,42)'
      document.getElementsByClassName('el-submenu__title')[1].style = 'border-bottom-color:transparent;background-color:#fff;color:rgb(42,42,42)'
      document.getElementById('prodAchevPage').style = 'color:rgb(42,42,42)'
      document.getElementById('productlist').style = 'color:rgb(42,42,42)'
      document.getElementById('propagandaStatute').style = 'color:rgb(42,42,42)'
      document.getElementById('propagandaScience').style = 'color:rgb(42,42,42)'
    },
    // 打开注册窗口
    registerShow() {
      this.$store.commit('showRegister', true)
    },
    getAppUrl(name) {
      /* 获取子模块 url 和 name */
      return MICRO_APPS.find((item) => item.name === name) || {}
    },

    toPath(name,item,type) {

      if(item && item.stext){
        sessionStorage.setItem('tips',item.stext)
      }
      //设置点击的业务栏的导航栏点击样式
      if(document.getElementById(name)){
        sessionStorage.setItem('currentItem',name)
      }

      if(name == 'shikuangShik' || name == 'shikuangHisPage'){
        sessionStorage.setItem('currentItem','shikuangShik')
      }
      sessionStorage.setItem('hotInfo',"")
      if(name == 'home'){
        this.clearStyle()
      }

      if(name && name.indexOf(',') != -1){
        if(type == 'catalog'){
          let type = item.typeName
          if(item.sname){
            type = item.typeName + '-' + item.sname
          }
          this.clearStyle()
          this.$router.push({name: 'catalogMenuIntroduce', query: {type: type }})
        }else{
          let type = name.split(',')[1]
          let name2 = name.split(',')[0]
          this.$router.push({ name: name2, query:{ type: type } })
          this.$router.go(0)
        }

      }else{
        if(type == 'catalog'){
          let type = item.typeName
          if(item.sname){
            type = item.typeName + '-' + item.sname
          }
          this.clearStyle()
          this.$router.push({name: 'catalogMenuIntroduce', query: {type: type }})
        }else{
          this.$router.push({ name: name })
          if(name!='home'){
            this.$router.go(0)
          }
        }
      }
    },
    closeAllExpand(name) {
      this.showGCExpand = false
      if(name){
        this.list = this.allList.filter(item=>{
          if(item.name == name){
            this.showGCExpand = true
            return item
          }
        })[0].list
        let bigRow = false
        this.list.forEach(item=>{
          if(item.sname.length > 6){
            bigRow = true
          }
        })
        this.bigRow = bigRow
      }
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
        this.$store.dispatch('LogOut').then((res) => {
        this.$store.dispatch('clearCookie').then()
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
              color: rgb(255, 255, 255);
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
            width: 95px;
            height: 95px;
            background: url(@/assets/images/1.png) no-repeat center;
            background-size: cover;
          }
          .img2 {
            width: 158px;
            height: 70px;
            background: url(@/assets/images/2.png) no-repeat center;
            background-size: cover;
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
        background-color: #ececec !important;
        color: #185392 !important;
        text-align: center;
        width: 100% !important;
        min-width: 150px !important;
        // transform: translateX(-10%);
        box-shadow: 0px 0px 5px 0px rgb(75, 75, 75);

        .el-menu-item {
          width: 170px !important;
          height: auto !important;
          color: #000000 !important;
          background-color: #e1e8f0 !important;
          font-size: 15px !important;
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
        padding: 1px 20px;
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
      // width: 100%;
      .dataCata {
        margin-left: 27px;
      }
      .dataCata:hover {
        font-weight: bold;
      }
    }
  }
}
.expand {
  display: flex;
  width: 200px;
  flex-wrap: wrap;
  align-content:flex-start;
  // height: 100px;
  // text-align: center;
  // padding: 3px 0px;
  // border-radius: 5px;
}
.expandItem {
  width: 100px;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  vertical-align: middle;
  color: #000000;
  text-align: center;
  cursor: pointer;
}
.expandItem2 {
  width: 200px;
}
.toExpand {
  width: 150px;
}

.selectItemStyle {
  background-color:#95c8ff !important;
  color:rgb(42,42,42)
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
/deep/.el-menu--popup {
  padding: 0px 0px !important;
}
</style>
