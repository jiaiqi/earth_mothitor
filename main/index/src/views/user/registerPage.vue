<template>
  <div class="register">
    <div class="box">
      <el-card class="box-card" shadow="never">
        <h3>{{userType}}注册</h3>
        <el-form
          :model="userinfo"
          :rules="rules"
          ref="userinfo"
          label-width="100px"
          class="demo-ruleForm"
          v-show="userType !== '行业用户'"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="userinfo.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input
              v-model="userinfo.nickname"
              placeholder="请输入用户昵称"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="userinfo.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="userinfo.email"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="userinfo.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              type="password"
              v-model="userinfo.checkPass"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form
          :model="expertinfo"
          :rules="rules2"
          ref="expertinfo"
          label-width="150px"
          class="demo-ruleForm"
          v-show="userType == '行业用户'"
        >
          <el-form-item label="统一社会信用代码" prop="code">
            <el-input
              v-model="expertinfo.code"
              size="small"
              placeholder="请输入统一社会信用代码"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位名称" prop="deptName">
            <el-input
              v-model="expertinfo.deptName"
              size="small"
              placeholder="请输入单位名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="姓名">
            <el-input
              v-model="expertinfo.name"
              size="small"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="id" label="证件号码">
            <el-input
              v-model="expertinfo.id"
              size="small"
              placeholder="请输入证件号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="expertinfo.phone"
              size="small"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="expertinfo.email"
              size="small"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="address" label="联系地址">
            <el-input
              v-model="expertinfo.address"
              size="small"
              placeholder="请输入地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="社会力量类型" prop="deptType">
            <el-select v-model="expertinfo.deptType" placeholder="请选择社会力量类型" size="small">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input
              type="password"
              size="small"
              v-model="expertinfo.pass"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              type="password"
              size="small"
              v-model="expertinfo.checkPass"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="主要业绩" prop="acheve">
            <el-checkbox-group v-model="expertinfo.acheve">
              <el-checkbox label="项目起止时间"></el-checkbox>
              <el-checkbox label="概况"></el-checkbox>
              <el-checkbox label="佐证材料"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div class="buttons">
          <el-button type="primary" @click="submitForm('userinfo')"
            >注册用户</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
        <!-- <p class="login_link">
          已有账号
          <a href="JavaScript:void(0)" @click="loginShow">去登陆</a>
        </p>
        <div class="footer">
          <p>微信登录</p>
          <img
            src="@/assets/images/wx.jpeg"
            width="60px"
            alt=""
            @click="loginwx"
          />
        </div> -->
      </el-card>
    </div>
  </div>
</template>
<script>
import { register } from '@/api/login'
export default {
  data() {
    var chePass = (rule, value, callback) => {
        if (value != this.userinfo.password) {
          return callback(new Error('密码输入不一致，请重新输入！'));
        }
      };
    return {
      userinfo: {
        username: '',
        nickname: '',
        phone: '',
        certificates: '',
        cardnumber: '',
        email: '',
        password: '',
        checkPass: ''
      },
      expertinfo: {
        name: '',
        phone: '',
        deptName: '',
        code: '',
        id: '',
        email: '',
        deptType: '',
        pass: '',
        checkPass: '',
        address: '',
        acheve: []
      },
      options: [{
          value: '行政机关',
          label: '行政机关'
        }, {
          value: '事业单位',
          label: '事业单位'
        }, {
          value: '企业',
          label: '企业'
        }, {
          value: '社会团体',
          label: '社会团体'
        }, {
          value: '个人',
          label: '个人'
        }],
      userType: '',
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        certificates: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        cardnumber: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        checkPass: [
          { validator:chePass, trigger: 'blur' }
        ]
      },
      rules2: {
        code: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
        deptName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        id: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
        deptType: [{ required: true, message: '请输入社会力量类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        address: [
          { required: true, message: '请输入联系地址', trigger: 'blur' }
        ],
        acheve: [
          { required: true, message: '请输入主要业绩', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.userType = window.location.search.substring(1).split('=')[1]
    if(this.userType == 'user'){
      this.userType = '个人用户'
    }
    if(this.userType == 'entr'){
      this.userType = '企业用户'
    }
    if(this.userType == 'expert'){
      this.userType = '行业用户'
    }
  },
  methods: {
    // 提交
    submitForm(formName) {
      let submit = true
      this.$refs[formName].validate((valid) => {
          if (!valid) {
            submit = false
          }
        });
        if(submit){
          //密码安全性验证
          const check = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[~!#@$%^*&()_+{}\[\]|\\;:'",<.>\/?])[a-zA-Z\d~!#@$%^*&()_+{}\[\]|\\;:'",<.>\/?]*$/;
            if (check.test(this.userinfo.password)) {
              register(this.userinfo).then(res=>{
                if(res.code == 500){
                  this.$message.error(res.msg)
                  return
                }
                this.$message({
                  message: '注册成功！',
                  type: 'success'
                });
                location.href = '/home'
              }).catch(e=>{
                this.$message.error(e)
              })
            } else{
              this.$message.error('密码必须包含大小写英文字母、字符与数字，且不能超过12位')
            }
        }
    },
    // 重置
    resetForm(formName) {
      this.userinfo = {
        name: '',
        phone: '',
        certificates: '',
        cardnumber: '',
        email: '',
        pass: '',
        checkPass: ''
      }
      this.expertinfo = {
        name: '',
        phone: '',
        deptName: '',
        code: '',
        id: '',
        email: '',
        deptType: '',
        pass: '',
        checkPass: '',
        address: '',
        acheve: []
      }
    },
    // 微信登录
    loginwx() {
      this.$router.push({
        path: '/'
      })
      this.$store.commit('showRegister', false)
      this.$store.commit('showLogin', true)
      this.$store.commit('setLogin', false)
    },
    // 打开登录页面
    loginShow() {
      this.$store.commit('showRegister', false)
      this.$store.commit('showLogin', true)
    }
  }
}
</script>
<style lang="less" scoped>
.register {
  width: 100%;
  display: flex;
  background-color: #eefbff;
  .box {
    margin: auto;
    .box-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 700px;
      margin: 100px 0px;
      box-shadow: 0px 0px 6px 0px #a2a2a2;
      h3 {
        text-align: center;
        color: #1492ff;
        margin-bottom: 30px;
      }
      .buttons {
        width: 100%;
        height: 37px;
        display: flex;
        justify-content: center;
      }
      .el-form-item {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
      }
      /deep/.el-form-item__content {
        margin: 0 !important;
      }
      /deep/.el-form-item__label {
        width: 150px !important;
        text-align: left;
        line-height: 20px;
      }
    }
    /deep/.el-form-item__error {
      padding-top: 0px;
    }
    /deep/.el-card__body {
      width: 100%;
      padding: 40px 45px;
    }
    .login_link {
      margin-top: 20px;
      a {
        color: #409eff;
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
  }
}
</style>
