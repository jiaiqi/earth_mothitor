import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 登录盒子的显示隐藏
    drawer: false,
    // 切换登录方式
    eerpc: true,
    // 登录成功显示用户
    login: false,
    // 保持会话
    Logincheched: true,
    // 注册盒子的显示隐藏
    showRegister: false,
    // 存储点击的历史地震数据
    earthquakes: {},
    //注册用户类型
    userType: ''
  },
  mutations: {
    setearth(state, val) {
      state.earthquakes = val
    },
    // 设值登录显示隐藏
    showLogin(state, val) {
      state.drawer = val.show
      state.userType = val.type
    },
    // 设值注册显示隐藏
    showRegister(state, val) {
      state.showRegister = val
    },
    // 设值登录方式
    setLogin(state, val) {
      if (val) {
        state.eerpc = val
      }
      state.eerpc = !state.eerpc
    },
    // 登录状态
    getLogin(state, val) {
      state.login = val
    },
    // 登录状态
    chechedLogin(state, val) {
      state.Logincheched = val
    }
  },
  actions: {},
  modules: {
    // 组件
    user
  },
  getters // 二次处理数据
})
export default store
