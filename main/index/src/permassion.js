import router from './router'
import store from './store' // 调取vuex
import {getToken, getExpiresIn, setExpiresIn } from '@/utils/auth'
import setStorage from '@/router/component/storage' // 监听token过期的方法

// import log from '@/utils/util.log'
// const whiteList = ['/login']
// 设置全局守卫
router.beforeEach(async (to, from, next) => {
  setStorage.getItem('token') // 监听token（不加这个的话在token未过期前关闭浏览器，然后在token过期后打开就。。你懂得）
  // 获取用户登录成功后储存的登录标志
  const getFlag = localStorage.getItem('Flag')
  if (getFlag === 'isLogin') {
    // 已经登陆（这个状态要在你的login请求成功后添加）
    // setStorage.getItem('token') // 监听token
    if (setStorage.getItem('Admin-Token') === false) {
      next()
      // localStorage.clear()
      // alert('登录已过期,请重新登录')
      // location.href = '/home'
    } else {
      setTimeout(() => {
        const expires_in = getExpiresIn()
        // if (expires_in <= 1000) {
          store.dispatch('RefreshToken').catch(() => {
          })
        // }
        store.commit('SET_EXPIRES_IN', expires_in)
        setExpiresIn(expires_in)
      }, 3000);
      next()
    }
  }else{
    next()
  }
  // 这里可能少 “ } ”
})
