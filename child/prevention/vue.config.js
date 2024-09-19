const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    port: 4012,
    headers: {
      // 设置本地运行的跨域权限
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://192.168.1.10:9718`,
        target: `http://user.earthquake.ac.cn:9540`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      [process.env.VUE_APP_CART_API]: {
        // target: `http://192.168.1.10:9718`,
        target: `http://user.earthquake.ac.cn:9546`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_CART_API]: ''
        }
      }
    }
  },

  configureWebpack: (config) => {
    const plugins = []
    plugins.push(new NodePolyfillPlugin())
  }
})
