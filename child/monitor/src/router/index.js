import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/monitor'
  },
  {
    path: '/refuge',
    name: 'monitorRefuge',
    component: () => import('@/views/monitor/refugePage.vue'),
  },
  {
    path: '/monitor',
    name: 'monitorMonitor',
    component: () => import('@/views/monitor/monitorPage.vue')
  },
  {
    path: '/productlist',
    name: 'productlist',
    component: () => import('@/views/monitor/productListPage.vue')
  },
  {
    path: '/disaster',
    name: 'monitorDisaster',
    component: () => import('@/views/monitor/disasterPage.vue')
  },
  {
    path: '/building',
    name: 'monitorBuilding',
    component: () => import('@/views/monitor/buildingPage.vue')
  },
  {
    path: '/mitigation',
    name: 'monitorMitigation',
    component: () => import('@/views/monitor/mitigationPage.vue')
  },
  {
    path: '/prodAchevList',
    name: 'prodAchevPage',
    component: () => import('@/views/monitor/prodAchevList.vue')
  },
  {
    path: '/bigEath',
    name: 'bigEathPage',
    component: () => import('@/views/monitor/bigEath.vue')
  },
  {
    path: '/productInfo',
    name: 'productPage',
    component: () => import('@/views/prods/productInfo')
  },
  {
    path: '/newProductInfo',
    name: 'newProductPage',
    component: () => import('@/views/prods/newProductInfo')
  },
  {
    path: '/earthCataList',
    name: 'earthCataList',
    component: () => import('@/views/monitor/earthCataList')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL,
  routes
})

export default router
