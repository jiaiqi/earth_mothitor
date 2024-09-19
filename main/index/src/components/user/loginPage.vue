<template>
  <div class="register">
    <div class="box">
      <el-card class="box-card">
        <h3 style="color: #333">国家防震减灾公共服务平台</h3>
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          label-width="100px"
          class="demo-ruleForm"
          v-if="eerpc"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              prefix-icon="el-icon-user-solid"
              placeholder="用户名/邮箱/手机"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              show-password
              v-model="loginForm.password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              prefix-icon="el-icon-s-finance"
              @keyup.enter.native="submitForm"
              clearable
            >
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img" />
            </div>
          </el-form-item>
          <el-form-item v-if="eerpc">
            <div
              style="
                display: flex;
                justify-content: space-between;
                height: 40px;
              "
            >
              <el-checkbox
                v-model="loginForm.rememberMe"
                style="margin: 0px 0px 25px 0px"
                >记住密码</el-checkbox
              >
              <a href="#" style="color: #333">忘记密码？</a>
            </div>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="submitForm"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <div style="float: right">
              <a class="link-type" href="javascript:void(0)" @click="toRegister"
                >立即注册</a
              >
            </div>
          </el-form-item>
        </el-form>

        <!-- <div class="footer" v-if="eerpc">
          <p>其他方式登录</p>
          <img
            src="@/assets/images/wx.jpeg"
            width="60px"
            alt=""
            @click="loginwx"
          />
        </div> -->
        <!-- <div class="ewm" @click="changePC">
          <img v-if="eerpc" src="@/assets/images/eer.png" alt="" />
          <img v-else src="@/assets/images/pc.png" alt="" />
        </div>
        <div class="wx_login_show" v-if="!eerpc">
          <div class="wx_login">
            <img src="@/assets/images/sx.png" alt="" />
            <p>请使用微信扫一扫登录</p>
          </div>
        </div> -->
      </el-card>
    </div>
  </div>
</template>
<script>
import { getCodeImg } from '@/api/login' // , login, logout
import { decode, encode } from '@/utils/base/dataEncry';
import {
  // setToken,
  // setUser,
  getToken
  // removeToken,
  // removeUser
} from '@/utils/auth'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
export default {
  data() {
    return {
      // tab切换
      activeName: 'first',
      // 验证码url地址
      codeUrl: '',
      loading: false,
      // 登录表单
      loginForm: {
        username: '',
        password: '',
        rememberMe: true,
        code: '',
        uuid: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' }
        ],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      // 验证码开关
      captchaEnabled: true
    }
  },
  computed: {
    eerpc() {
      return this.$store.state.eerpc
    },
    Logincheched() {
      return this.$store.state.Logincheched
    },
    admintoken() {
      return getToken()
    }
  },
  created() {
    this.getCode()
    this.getCookie()
  },
  methods: {
    handleLogin() {},
    // 获取验证码
    getCode() {
      getCodeImg().then((res) => {
        // 判断返回的验证码参数 进而控制验证码的显示隐藏
        this.captchaEnabled =
          res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaEnabled) {
          // 处理返回的图片地址
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    // 获取缓存
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    // 去注册
    toRegister() {
      const self = this
      let info = {
        show: false,
        type: self.$store.state.userType
      }
      self.$store.commit('showLogin', info)
      this.$router.push({path:'/register',query:{ type: self.$store.state.userType }})
      // location.href = 'http://'+location.hostname+'/register?type=' + self.$store.state.userType
    },
    // 提交
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          Cookies.set('username', this.loginForm.username, { expires: 30 })
          // 如果记住密码 把表单内容缓存 反之 移除缓存
          if (this.loginForm.rememberMe) {
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30
            })
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30
            })
          } else {
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          let formData = {...this.loginForm}
          formData.username = encode(this.loginForm.username)
          formData.password = encode(this.loginForm.password)
          console.log(formData)
          // 发起登录请求
          this.$store
            .dispatch('Login', formData)
            .then(() => {
              // 获取用户信息
              this.$store.dispatch('GetInfo', getToken()).then(() => {
                this.$store.commit('showLogin', false)
                location.href = '/home'
              })
              localStorage.setItem('Flag','isLogin')
              setTimeout(() => {
                this.loading = false
              }, 5000);
            })
            .catch(() => {
              this.loading = false
              this.getCode()
            })
        }
      })
    },

    // 切换登录
    loginwx() {
      this.changePC()
    },
    // 切换为Pc
    changePC() {
      this.$store.commit('setLogin')
    },
    changeChech(val) {
      this.$store.commit('chechedLogin', val)
    }
  }
}
</script>
<style lang="less" scoped>
.register {
  width: 100%;
  display: flex;
  .box {
    position: relative;
    margin: 50px auto;
    overflow: hidden;
    .box-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 430px;
      padding: 0 40px;
      border-radius: 15px;
      h3 {
        width: 100%;
        text-align: center;
        color: #1492ff;
        margin-bottom: 40px;
      }
      .el-form-item {
        display: flex;
        flex-direction: column;
        height: 40px;
        .link-type:hover {
          color: #1492ff;
        }
        .login-code {
          width: 33%;
          height: 38px;
          float: right;
          img {
            cursor: pointer;
            vertical-align: middle;
          }
          .login-code-img {
            height: 38px;
          }
        }
      }
      .footer {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        p {
          margin-bottom: 20px;
        }
        img {
          cursor: pointer;
        }
      }
      .ewm {
        position: absolute;
        top: 0;
        right: 0;
      }
      .wx_login_show {
        width: 100%;
        .wx_login {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          p {
            margin-top: 20px;
            width: 190px;
            text-align: center;
            height: 36px;
            line-height: 36px;
            background-color: #eeeeee;
            color: #999999;
            border-radius: 30px;
          }
        }
      }
      /deep/.el-form-item__content {
        margin: 0 !important;
      }
      /deep/.el-form-item__label {
        text-align: left;
      }
      /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
        color: #606266;
      }
      /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #606266;
        border-color: #606266;
      }
      /deep/.el-card__body {
        width: 100%;
      }
    }
  }
}
</style>
