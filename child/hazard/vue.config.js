// 头部引入
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  devServer: {
    port: 4002,
    // open: true,
    headers: { // 设置本地运行的跨域权限
      'Access-Control-Allow-Origin': '*',
    },
  },

  configureWebpack: config => {
    const plugins = []
    plugins.push(new NodePolyfillPlugin())
  }
})
