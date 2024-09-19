import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录成功显示用户
    login: false,
  },
  getters: {
  },
  mutations: {
    // 登录状态
    getLogin(state, val) {
      state.login = val
    },
  },
  actions: {
  },
  modules: {
  }
})
