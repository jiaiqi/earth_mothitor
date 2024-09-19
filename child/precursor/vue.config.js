const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    port: 4008,
    headers: {
      // 设置本地运行的跨域权限
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://192.168.3.11:9528`,
        target: `http://10.7.203.147:9528`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      // 水准
      [process.env.VUE_APP_DFT_API]: {
        // target: `http://192.168.3.11:9528`,
        target: `http://10.7.203.147:9530`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_DFT_API]: ''
        }
      },
      // GNSS
      [process.env.VUE_APP_GNSS_API]: {
        // target: `http://192.168.3.11:9528`,
        target: `http://10.7.203.147:9533`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_GNSS_API]: ''
        }
      },
      // 前兆 地球物理
      [process.env.VUE_APP_PREC_API]: {
        // target: `http://192.168.3.11:9528`,
        target: `http://10.7.203.147:9534`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_PREC_API]: ''
        }
      }
    }
  },

  configureWebpack: (config) => {
    const plugins = []
    plugins.push(new NodePolyfillPlugin())
  }
})
