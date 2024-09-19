// const name = process.env.VUE_APP_TITLE || '国家防震减灾公共服务平台' // 网页标题
const port = process.env.port || process.env.npm_config_port || 8000 // 端口

module.exports = {
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    // host: '0.0.0.0',
    open: true,
    port: port,
    headers: {
      // 设置本地运行的跨域权限
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `http://10.7.203.147:9527`,
        // target: `http://10.7.203.147:9527`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      // 行业链接
      [process.env.VUE_APP_UPDA_API]: {
        target: `http://10.7.203.147:9529`,
        // target: `http://10.7.203.147:9529`,
        // target: 'http://192.168.3.11:9527',
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_UPDA_API]: ''
        }
      },
      // 编目 catalogue
      [process.env.VUE_APP_CATA_API]: {
        target: `http://10.7.203.147:9529`,
        // target: `http://192.168.3.17:9529`,
        // target: 'http://10.7.203.147:9527',
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_CATA_API]: ''
        }
      },
      // 服务推荐
      [process.env.VUE_APP_SERV_API]: {
        target: `http://10.7.203.147:9541`,
        // target: `http://192.168.3.17:9529`,
        // target: 'http://10.7.203.147:9527',
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_SERV_API]: ''
        }
      },
      // 订单
      [process.env.VUE_APP_CART_API]: {
        target: `http://10.7.203.147:9546`,
        // target: `http://192.168.3.17:9529`,
        // target: 'http://10.7.203.147:9527',
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_CART_API]: ''
        }
      }
    }
  }
}
