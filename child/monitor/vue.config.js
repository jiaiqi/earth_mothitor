const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  devServer: {
    port: 4003,
    headers: { // 设置本地运行的跨域权限
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      [process.env.VUE_APP_SEIS_API]: {
        target: `http://10.7.203.147:9541`,
        // target: `http://10.7.203.147:9527`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_SEIS_API]: ''
        }
      },
      [process.env.VUE_APP_PRODS_API]: {
        target: `http://10.7.203.147:9541`,
        // target: `http://10.7.203.147:9527`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_PRODS_API]: ''
        }
      }
    }
  },
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  }
})
