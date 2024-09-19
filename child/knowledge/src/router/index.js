import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/statute'
  },
  {
    path: '/statute',
    name: 'propagandaStatute',
    component: () => import('@/views/statute/index.vue'),
    children: [
      {
        path: '/country',
        name: 'standardCountry',
        component: () => import('@/views/statute/index.vue')
      }
    ]
  },
  {
    path: '/science',
    name: 'propagandaScience',
    component: () => import('@/views/popular/sciencePage.vue')
  },
  {
    path: '/periodicals',
    name: 'propagandaPeriodicals',
    component: () => import('@/views/book/knowledgePage.vue')
  },
  {
    path: '/scienceInfo',
    name: 'scienceInfo',
    component: () => import('@/views/popular/scienceInfo.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  // 👇 __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
  base: window.__MICRO_APP_BASE_ROUTE__ || '/',
  routes
})

export default router
