const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    port: 4005,
    headers: {
      // 设置本地运行的跨域权限
      'Access-Control-Allow-Origin': '*'
    },
    // 测震
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://192.168.3.11:9528`,
        target: `http://10.7.203.147:9528`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },

      // 台阵
      [process.env.VUE_APP_SEISM_API]: {
        // target: `http://192.168.1.10:8100`,
        target: `http://10.7.203.147:9537`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_SEISM_API]: ''
        }
      },
      // 强震动  vibration
      [process.env.VUE_APP_VIBRA_API]: {
        // target: `http://192.168.3.9:9603`,
        target: `http://10.7.203.147:9539`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_VIBRA_API]: ''
        }
      },
      // 模拟数据  vibration
      [process.env.VUE_APP_SIMUL_API]: {
        // target: `http://192.168.1.10:9531`,
        target: `http://10.7.203.147:9531`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_SIMUL_API]: ''
        }
      },
      // 模拟数据  vibration
      [process.env.VUE_APP_CART_API]: {
        // target: `http://192.168.1.10:9531`,
        target: `http://10.7.203.147:9546`,
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
