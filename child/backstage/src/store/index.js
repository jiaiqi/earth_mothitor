import Vue from 'vue'
import Vuex from 'vuex'
// 导航栏
import app from './modules/app'
// 字典
import dict from './modules/dict'
// 用户登录登出操作
import user from './modules/user'
import tree from './modules/tree'
import tagsView from './modules/tagsView'
// 动态生成路由菜单
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // 组件
    app,
    dict,
    user,
    tagsView,
    permission,
    settings,
    tree
  },
  getters // 二次处理数据
})

export default store
