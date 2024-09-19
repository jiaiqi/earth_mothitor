import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/science'
  },
  {
    path: '/knowledge',
    name: 'propagandaKnowledge',
    component: () => import('@/views/propaganda/knowledgePage.vue')
  },
  {
    path: '/science',
    name: 'propagandaScience',
    component: () => import('@/views/propaganda/sciencePage.vue')
  },
  {
    path: '/dating',
    name: 'propagandaDating',
    component: () => import('@/views/propaganda/datingPage.vue')
  },
  {
    path: '/experiment',
    name: 'propagandaExperiment',
    component: () => import('@/views/propaganda/experimentPage.vue')
  },
  {
    path: '/structural',
    name: 'propagandaStructural',
    component: () => import('@/views/propaganda/structuralPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  // 👇 __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
  base: window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL,
  routes
})

export default router
