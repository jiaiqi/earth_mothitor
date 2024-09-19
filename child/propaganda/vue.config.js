const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    // host: 'localhost',
    // open: true,
    port: 4004,
    headers: {
      // 设置本地运行的跨域权限
      'Access-Control-Allow-Origin': '*'
    }
  }
})
