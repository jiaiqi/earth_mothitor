import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/shikuang'
  },
  {
    path: '/shikuangSh',
    name: 'shikuangShik',
    component: () => import('@/views/shikuang/shikuangPage.vue')
  },
  {
    path: '/earthlist',
    name: 'shikuangEarthlist',
    component: () => import('@/views/shikuang/earthList.vue')
  },
  {
    path: '/earthtopic',
    name: 'shikuangEarthtopic',
    component: () => import('@/views/shikuang/earthTopic.vue')
  },
  {
    path: '/listearth',
    name: 'listearth',
    component: () => import('@/views/list/earthList.vue')
  },
  {
    path: '/earthstuation',
    name: 'earthstuation',
    component: () => import('@/views/earthsituation')
  },
  {
    path: '/earthOption',
    name: 'earthOption',
    component: () => import('@/views/shikuang/earthOption.vue')
  },
  {
    path: '/earthOptionInfo',
    name: 'earthOptionInfo',
    component: () => import('@/views/shikuang/earthOptionInfo.vue')
  },
  {
    path: '/shikuangHistory',
    name: 'shikuangHisPage',
    component: () => import('@/views/shikuang/shikuangHistoryPage.vue')
  },
  {
    path: '/bigEarthList',
    name: 'bigEarthListPage',
    component: () => import('@/views/shikuang/bigEarthList.vue')
  },
  
]

const router = new VueRouter({
  mode: 'history',
  // 👇 __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
  base: window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL,
  routes
})

export default router
