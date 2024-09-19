import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue'),
    redirect: '/home',
    children: [
      // 首页
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue')
      },
      // 子站首页
      {
        path: '/secondHome',
        name: 'secondHome',
        component: () => import('@/views/home/provinceIndex.vue')
      },
      // 注册
      {
        path: '/register',
        name: 'register',
        component: () => import('@/views/user/registerPage.vue')
      },
      // 网站底图
      {
        path: '/sitemap',
        name: 'sitemap',
        component: () => import('@/views/user/sitemapPage.vue')
      },
      // 联系我们
      {
        path: '/collmy',
        name: 'collmy',
        component: () => import('@/views/user/collmyPage.vue')
      },
      // 信息播报
      {
        path: '/situation',
        name: 'situation',
        component: () => import('@/views/earthsituation/index.vue')
      },
      // 购物车订单确认
      {
        path: '/orderInfo',
        name: 'orderInfo',
        component: () => import('@/components/order/orderInfo.vue')
      },
      //专业网站列表
      {
        path: '/specialList',
        name: 'specialList',
        component: () => import('@/views/specialList.vue')
      },
      // 反馈页面
      {
        path: '/backInfo',
        name: 'backInfo',
        component: () => import('@/views/backInfo/index.vue')
      },
      // 个人用户查看审批
      {
        path: '/approval',
        name: 'approval',
        component: () => import('@/views/approval/index.vue')
      },
      // shikuang 地震速报
      {
        path: '/shikuang',
        name: 'shikuang',
        children: [
          {
            path: 'shikuangSh',
            name: 'shikuangShik'
          },
          {
            path: 'shikuangHistory',
            name: 'shikuangHisPage',
          },
          {
            path: 'earthlist',
            name: 'shikuangEarthlist'
          },
          {
            path: 'listearth',
            name: 'listearth'
          },
          {
            path: 'earthstuation',
            name: 'earthstuation',
          },
          {
            path: 'earthtopic',
            name: 'shikuangEarthtopic'
          },
          {
            path: 'earthOption',
            name: 'earthOption'
          },
          {
            path: 'bigEarthList',
            name: 'bigEarthListPage'
          }
        ]
      },
      // prevention 探测 震防数据
      {
        path: '/prevention',
        name: 'prevention',
        children: [
          {
            path: 'catalogue',
            name: 'precursorCatalogue'
          },
          {
            path: 'prospecting',
            name: 'precursorProspecting'
          }
        ]
      },
      // service 观测数据
      {
        path: '/service',
        name: 'service',
        children: [
          {
            path: 'seismometry',
            name: 'serviceSeismometry'
          },
          {
            path: 'catalogue',
            name: 'serviceCatalogue'
          },
          {
            path: 'scientific',
            name: 'serviceScientific'
          },
          {
            path: 'simulation',
            name: 'serviceSimulation'
          }
        ]
      },
      // precursor 地球物理
      {
        path: '/precursor',
        name: 'precursor',
        children: [
          {
            path: 'crust',
            name: 'precursorCrust'
          },
          {
            path: 'flowmation',
            name: 'precursorFlowMation'
          },
          {
            path: 'catalogue',
            name: 'precursorCatalogue'
          },
          {
            path: 'electromagnetism',
            name: 'precursorElectromagnetism'
          },
          {
            path: 'gnss',
            name: 'precursorGnss'
          },
          {
            path: 'fluid',
            name: 'precursorFluid'
          },
          {
            path: 'gravity',
            name: 'precursorGravity'
          },
          {
            path: 'interface',
            name: 'precursorInterface'
          },
          {
            path: 'geological',
            name: 'precursorGeological'
          }
        ]
      },
      // knowledge 标准
      {
        path: '/knowledge',
        name: 'knowledge',
        children: [
          {
            path: 'statute',
            name: 'propagandaStatute'
          },
          {
            path: 'science',
            name: 'propagandaScience'
          },
          {
            path: 'periodicals',
            name: 'propagandaPeriodicals'
          },
          {
            path: 'scienceInfo',
            name: 'scienceInfo',
          }
        ]
      },
      //服务列表
      {
        path: '/monitor',
        name: 'monitor',
        children: [
          {
            path: '/monitor/productlist',
            name: 'productlist',
          },
          {
            path: 'prodAchevList',
            name: 'prodAchevPage',
          },
          {
            path: '/monitor/refuge',
            name: 'monitorRefuge',
          },
          {
            path: '/monitor/productInfo',
            name: 'productPage',
          },
          {
            path: '/monitor/newProductInfo',
            name: 'newProductPage',
          },
          {
            path: '/monitor/bigEath',
            name: 'bigEathPage',
          },
          {
            path: '/monitor/earthCataList',
            name: 'earthCataList',
          }
        ]
      },
      // hazard 调查数据
      {
        path: '/hazard',
        name: 'hazard',
        children: [
          {
            path: 'retrieval',
            name: 'hazardRetrieval'
          },
          {
            path: 'seismogeology',
            name: 'hazardFortification'
          },
          {
            path: 'fault',
            name: 'hazardFault'
          }
        ]
      },
      // approval 审批模块
      {
        path: '/approval',
        name: 'approval',
        children: [
          {
            path: 'excelApproval',
            name: 'excelApproval'
          }
        ]
      },
      // propaganda 实验数据
      {
        path: '/propaganda',
        name: 'propaganda',
        children: [
          {
            path: 'catalogue',
            name: 'propagandaCatalogue'
          },
          {
            path: 'datadown',
            name: 'propagandaDatadown'
          },
          {
            path: 'interface',
            name: 'propagandaInterface'
          },
          {
            path: 'toolkit',
            name: 'propagandaToolkit'
          },
          {
            path: 'datascreening',
            name: 'propagandaDatascreening'
          }
        ]
      },

      // standard 综合数据
      {
        path: '/standard',
        name: 'standard',
        children: [
          {
            path: 'country',
            name: 'standardCountry'
          },
          {
            path: 'industry',
            name: 'standardIndustry'
          },
          {
            path: 'local',
            name: 'standardLocal'
          }
        ]
      },
      // 普通用户审核任务
      {
        path: '/approval',
        name: 'approval',
        children: [
          {
            path: 'catalogue',
            name: 'precursorCatalogue'
          },
          {
            path: 'prospecting',
            name: 'precursorProspecting'
          }
        ]
      },
      // thematic 专题数据
      {
        path: '/thematic',
        name: 'thematic',
        children: [
          {
            path: 'login',
            name: 'login'
          }
        ]
      },
      //平台动态
      {
        path: '/newsInfo',
        name: 'newsInfo',
        component: () => import('@/components/newsTopic/newsInfo.vue')
      },
      //平台动态
      {
        path: '/hotMore',
        name: 'hotMore',
        component: () => import('@/components/newsTopic/hotMore.vue')
      },
      //平台动态
      {
        path: '/newsMore',
        name: 'newsMore',
        component: () => import('@/components/newsTopic/newsMore.vue')
      },
      //搜索结果
      {
        path: '/searchRes',
        name: 'searchRes',
        component: () => import('@/components/searchRes/index.vue')
      },
      //数据目录中间页
      {
        path: '/catalogMenuIntroduce',
        name: 'catalogMenuIntroduce',
        component: () => import('@/views/catalogMenuIntroduce/index.vue')
      }
    ]
  },
  {
    // 后台
    path: '/ecpublic',
    name: 'ecpublic',
    children: [
      {
        path: 'login',
        name: 'login'
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// router.beforeEach((to, from, next) => {
//   console.log(to)
//   next()
// })

export default router
