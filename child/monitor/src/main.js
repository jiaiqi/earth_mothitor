import '@/micro/index'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/static/css/common.css'
import '@/elemet/index'
import TopNav from '@/components/topNav.vue'

Vue.component('TopNav', TopNav)

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
window.addEventListener('unmount', function () {
  app.$destroy()
})