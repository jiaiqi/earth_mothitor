import '@/micro/index'
import '@/static/css/common.css'
import '@/element/index'
// import 'ant-design-vue/dist/antd.css';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import { Calendar } from 'ant-design-vue';

Vue.config.productionTip = false
//日期统一格式
Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// 监听卸载操作
window.addEventListener('unmount', function () {
  app.$destroy()
})
