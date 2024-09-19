import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/catalogue'
  },

  {
    path: '/crust',
    name: 'precursorCrust',
    component: () => import('@/views/precursor/deformation/dataDownload.vue')
  },
  {
    path: '/flowmation',
    name: 'precursorFlowMation',
    component: () => import('@/views/precursor/deformation/flowMation.vue')
  },

  {
    path: '/catalogue',
    name: 'precursorCatalogue',
    component: () => import('@/views/precursor/cataLogue.vue')
  },
  {
    path: '/electromagnetism',
    name: 'precursorElectromagnetism',
    component: () => import('@/views/precursor/electromagnetism.vue')
  },
  {
    path: '/gnss',
    name: 'precursorGnss',
    component: () => import('@/views/precursor/gnssPage.vue')
  },
  {
    path: '/fluid',
    name: 'precursorFluid',
    component: () => import('@/views/precursor/fluidPage.vue')
  },
  {
    path: '/gravity',
    name: 'precursorGravity',
    component: () => import('@/views/precursor/gravityPage.vue')
  },
  {
    path: '/geological',
    name: 'precursorGeological',
    component: () => import('@/views/precursor/geological.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  // 👇 __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
  base: window.__MICRO_APP_BASE_ROUTE__ || '/',
  routes
})

// 路由导航
router.beforeEach((to, from, next) => {
  let token = JSON.parse(sessionStorage.getItem('token'))
  if (!token && to === '/seismometry') {
    next(false)
    this.$message({
      message: '请先登录',
      type: 'warning'
    })
  } else if (!token && from === '/seismometry') {
    next('/catalogue')
    this.$message({
      message: '请先登录',
      type: 'warning'
    })
  } else {
    next()
  }
})

export default router
