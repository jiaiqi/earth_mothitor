// import './permassion'
import './micro'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/static/css/common.css'
import ElementUI from 'element-ui'

import axios from 'axios'
import VueAxios from 'vue-axios'

import 'element-ui/lib/theme-chalk/index.css'
//聊天室-基于element
import Chat from 'jwchat';
Vue.use(Chat)
Vue.use(ElementUI)

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
