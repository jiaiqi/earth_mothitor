const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    port: 4009,
    headers: {
      // 设置本地运行的跨域权限
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      [process.env.VUE_APP_CRIT_API]: {
        // target: `http://192.1/68.1.10:9531`,
        target: `http://10.7.203.147:9531`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_CRIT_API]: ''
        }
      },
      [process.env.VUE_APP_KNOWS_API]: {
        // target: `http://192.1/68.1.10:9531`,
        target: `http://10.7.203.147:9884`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_KNOWS_API]: ''
        }
      }
    }
  }
})
