import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/fault'
  },
  {
    path: '/retrieval',
    name: 'hazardRetrieval',
    component: () => import('@/views/hazard/retrievalPage.vue')
  },
  {
    path: '/seismogeology',
    name: 'hazardFortification',
    component: () => import('@/views/hazard/Seismogeology.vue')
  },
  {
    path: '/fault',
    name: 'hazardFault',
    component: () => import('@/views/hazard/faultPage.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: window.__MICRO_APP_BASE_ROUTE__ || '/',
  routes
})

export default router
