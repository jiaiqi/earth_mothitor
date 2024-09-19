import '@/micro/index'
import '@/static/css/common.css'
import '@/element/index'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mackDrawer from '@/components/mackDrawer.vue'
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.component('mackDrawer', mackDrawer)

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
// 监听卸载操作
window.addEventListener('unmount', function () {
  app.$destroy()
})
