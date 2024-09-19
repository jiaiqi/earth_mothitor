import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录成功显示用户
    login: false,
    // 请求数据类型
    type: '0'
  },
  getters: {},
  mutations: {
    // 登录状态
    getLogin(state, val) {
      state.login = val
    },
    // 修改请求
    setType(state, val) {
      state.type = val
    }
  },
  actions: {},
  modules: {}
})
