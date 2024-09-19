import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录成功显示用户
    login: false,
    mapZoom: 6,
    mapShow: 'sl',
    lwShow: true
  },
  getters: {},
  mutations: {
    // 登录状态
    getLogin(state, val) {
      state.login = val
    },
    changeShow(Store, val) {
      Store.mapShow = val
    },
    lwOpenUp(Store, val) {
      Store.lwShow = val
    }
  },
  actions: {},
  modules: {}
})
