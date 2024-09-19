import microApp from '@micro-zoe/micro-app'
import * as config from './config'

// 启用 micro
microApp.start({
  preFetchApps: config.MICRO_APPS, // 加载子项目
  globalAssets: config.GLOBAL_ASSETS, // 加载全局资源
  lifeCycles: {
    // 生命周期
    created(e) {
      // console.log('创建')
    },
    beforemount(e) {
      // console.log('即将渲染')
    },
    mounted(e) {
      // console.log('完成渲染')
    },
    unmount(e) {
      // console.log('已经卸载')
    },
    error(e) {
      // console.log('渲染出错')
    }
  }
})

microApp.preFetch(config.MICRO_APPS)
