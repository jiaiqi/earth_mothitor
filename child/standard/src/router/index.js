import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/country'
  },
  {
    path: '/country',
    name: 'standardCountry',
    component: () => import('@/views/standard/countryPage.vue')
  },
  {
    path: '/industry',
    name: 'standardIndustry',
    component: () => import('@/views/standard/industryPage.vue')
  },
  {
    path: '/local',
    name: 'standardLocal',
    component: () => import('@/views/standard/localPage.vue')
  },
  {
    path: '/disaster',
    name: 'standardDisaster',
    component: () => import('@/views/standard/disasterPage.vue')
  },
  {
    path: '/prevention',
    name: 'standardPrevention',
    component: () => import('@/views/standard/preventionPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  // 👇 __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
  base: window.__MICRO_APP_BASE_ROUTE__ || '/',
  routes
})

export default router
