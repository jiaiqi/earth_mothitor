<template>
  <div class="home" v-loading="loading">
    <title-top-login-small v-if="hideTop"></title-top-login-small>
    <title-top-login :childName="childName" v-else></title-top-login>
    <title-top></title-top>
    <div>
      <micro-app
        v-if="isChild"
        v-bind="micro"
        destory
        @datachange="handleDataChange"
        @created="created"
        @beforemount="beforemount"
        @mounted="mounted"
        @unmount="unmount"
        @error="error"
      >
      </micro-app>
      <router-view v-else></router-view>
      <el-dialog
        title=""
        :visible.sync="drawer"
        width="500px"
        :with-header="false"
        center
        :before-close="hideLogin"
        :show-close="false"
        :destroy-on-close="true"
      >
        <login-page></login-page>
      </el-dialog>
      <el-dialog
        title=""
        :visible.sync="showRegister"
        width="500px"
        :with-header="false"
        center
        :before-close="hideLogin"
        :show-close="false"
        :destroy-on-close="true"
      >
        <register-page></register-page>
      </el-dialog>
      <!-- <div id="iframe"></div> -->
        <!-- <iframe
          v-show="false"
          style="width: 0px;height:0px;"
          ref="iframeRef"
          id="iframe"
          src="http://user.earthquake.ac.cn"
          frameborder="0"
        ></iframe> -->
    </div>
    <!-- http://user.earthquake.ac.cn -->
    <!-- <footer-bottom></footer-bottom> -->
  </div>
</template>

<script>
import {getToken, getExpiresIn, setExpiresIn } from '@/utils/auth'
import loginPage from '@/components/user/loginPage.vue'
import Cookies from 'js-cookie'
import { addCollectUser, viewNumAdd } from '@/api/count'
import { encode } from '@/utils/base/dataEncry'
import registerPage from '@/views/user/registerPage.vue'
// import footerBottom from '@/components/layout/footerBottom.vue'
import titleTopLogin from '@/components/layout/titleTopLogin.vue'
import titleTopLoginSmall from '@/components/layout/titleTopLoginSmall.vue'
import titleTop from '@/components/layout/titleTop.vue'
import { MICRO_APPS } from '@/micro/config.js'
export default {
  name: 'initPage',
  data() {
    return {
      loading: true,
      isChild: false,
      hideTop: false, //缩小网站顶部栏
      childName: '',
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
    titleTopLogin,
    titleTop,
    loginPage,
    registerPage,
    titleTopLoginSmall
  },
  computed: {
    drawer() {
      return this.$store.state.drawer
    },
    showRegister() {
      return this.$store.state.showRegister
    }
  },
  watch: {
    $route(val) {
      // 监听路由变化，改变子模块渲染
      this.changeChild(val)
      if(val.fullPath.indexOf('/home') == -1){
        //子站显示头部
        if(val.fullPath.indexOf('/secondHome') != -1) {
          this.childName = sessionStorage.getItem('province')
          this.hideTop = false
          return
        }
        // sessionStorage.setItem('province','')
        // this.childName = ''
        this.hideTop = true
      }else {
        sessionStorage.setItem('province','')
        this.hideTop = false
        this.childName = ''
      }
    },
    deep: true
  },
  created() {
    this.refreshToken()

    // 从工作台返回 判断状态
    // let name = window.name
    // if (name) {
    //   this.$store.dispatch('LogOut').then((res) => {
    //     this.$store.commit('getLogin', false)
    //   })
    // }
    this.changeChild(this.$route)
  },
  mounted() {
    if(!getToken()){
      let par = {
        userName: '访客'
      }
      addCollectUser(encode(par)).then(res=>{
      })
    }
    let date = new Date()
    let month = date.getMonth()+1
    let day = date.getDate()
    let hour = date.getHours()
    if(month < 10){
      month = '0'+month
    }
    if(day < 10){
      day = '0'+day
    }
    if(hour < 10){
      hour = '0'+hour
    }
    // let par2 = 'year='+date.getFullYear()+'&month='+month+'&day='+day+'&hour='+hour+'&mac=null'
    // viewNumAdd(par2).then(res=>{})
    //如果没有存储过期time的cookie，则分配
    if(!Cookies.get('ExpiresTime')){
      Cookies.set('ExpiresTime', date.getTime())
      this.$store.dispatch('clearCookie').then()
    }
    if(date.getTime() - parseInt(Cookies.get('ExpiresTime')) > 10000000){
      //登录超时强制下线
      Cookies.set('ExpiresTime', date.getTime())
        this.$store.dispatch('clearCookie').then()
        setTimeout(() => {
          this.$router.go(0)
        }, 200);
    }
    this.loading = false
  },
  methods: {
    hideLogin() {
      this.$store.commit('showLogin', false)
      this.$store.commit('showRegister', false)
    },
    //向后台系统发送刷新后的token
    handleClickFatherToSon() {
      // let token = getToken()
      // document.getElementById("iframe").contentWindow.postMessage(
      //   {
      //     data: token
      //   },
      //   "*"
      // );
      // const url = 'http://localhost:8080';
      // const iframe = document.createElement('iframe');
      // iframe.src = url;
      // document.getElementById('iframe').innerHTML = ''
      // document.getElementById('iframe').appendChild(iframe);
      //   const win = iframe.contentWindow;
      //   win.postMessage({ data:token }, '*');
    },
    getAppUrl(name) {
      /* 获取子模块 url 和 name */
      return MICRO_APPS.find((item) => item.name === name) || {}
    },
    changeChild(route) {
      this.loading = false
      // this.loading = true
      // 修改子视图显示
      let path = route.path.toLowerCase()
      let paths = path.split('/')
      this.isChild = paths.length > 2
      if (this.isChild) {
        let app = this.getAppUrl(paths[1])

        this.micro = {
          ...app,
          data: { name: route.name },
          key: `${app.name}`,
          baseroute: `/${paths[1]}`
        }
      }
    },
    // 实时检测刷新token
    refreshToken() {
      // 存储
      this.refreshTime = setInterval(() => {
        if (getToken() === undefined) {
          return
        }
        const expires_in = getExpiresIn()
        // if (expires_in <= 1000) {
          this.$store.dispatch('RefreshToken').then(()=>{
            this.handleClickFatherToSon()
          }).catch(() => {
            // clearInterval(this.refreshTime)
          })
        // }
        this.$store.commit('SET_EXPIRES_IN', expires_in)
        setExpiresIn(expires_in)
      }, 3300000)
    },
    handleDataChange(event) {
      /* 获取子路由传递的信息 */
      let data = event.detail.data
      if (data.route) {
        this.$router.push({ name: data.route.name })
      }
      if (data.auto) {
        this.$store.dispatch('LogOut').then((res) => {
          this.$store.commit('getLogin', false)
          this.$store.commit('showLogin', true)
        })
      }
    },
    created() {
      this.loading = true
      /* 子模块创建 */
      // console.log(`${this.micro.name}-子模块创建`)
      if(this.$route.fullPath.indexOf('/home') == -1){
        this.hideTop = true
      }else {
        this.hideTop = false
      }
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
