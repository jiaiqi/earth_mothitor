import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录成功显示用户
    login: false,
    // 登录盒子的显示隐藏
    drawer: false,
    // 切换登录方式
    eerpc: true,
  },
  getters: {
  },
  mutations: {
    // 登录状态
    getLogin(state, val) {
      state.login = val
    },
    // 设值显示隐藏
    showLogin(state, val) {
      state.drawer = val
    },
    // 设值登录方式
    setLogin(state, val) {
      if (val) {
        state.eerpc = val
      }
      state.eerpc = !state.eerpc
    },
  },
  actions: {
  },
  modules: {
  }
})
