'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// const Compress/ionPlugin = require('compression-webpack-plugin')

const name = process.env.VUE_APP_TITLE || '国家防震减灾公共服务平台' // 网页标题

const port = process.env.port || process.env.npm_config_port || 8080 // 端口

// vue.config.js 配置说明
// 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
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
    host: '0.0.0.0',
    port: port,
    open: false,
    headers: {
      // 设置本地运行的跨域权限
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      // 后台管理
      [process.env.VUE_APP_BASE_API]: {
        target: `http://10.7.203.147:9527`,
        // target: `http://10.7.203.147:9527`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      // 测震
      [process.env.VUE_APP_SEIS_API]: {
        target: `http://10.7.203.147:9537`,
        // target: `http://10.7.203.147:9540`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_SEIS_API]: ''
        }
      },
      // 数据上传
      [process.env.VUE_APP_UPDA_API]: {
        // target: `http://192.168.1.10:9529`,
        target: `http://10.7.203.147:9529`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_UPDA_API]: ''
        }
      },
      // 数据审核
      [process.env.VUE_APP_AUDI_API]: {
        target: `http://10.7.203.147:9630`,
        // target: `http://10.7.203.147:9081`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_AUDI_API]: ''
        }
      },
      // 法规
      [process.env.VUE_APP_CRIT_API]: {
        // target: `http://192.168.1.10:9531`,
        target: `http://10.7.203.147:9531`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_CRIT_API]: ''
        }
      },
      // 水准
      [process.env.VUE_APP_STAND_API]: {
        target: `http://10.7.203.147:9530`,
        // target: `http://10.7.203.147:9530,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_STAND_API]: ''
        }
      },
      // 台阵
      [process.env.VUE_APP_SEISM_API]: {
        target: `http://10.7.203.147:9533`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_SEISM_API]: ''
        }
      },
      // GNSS
      [process.env.VUE_APP_GNSS_API]: {
        // target: `http://192.168.3.9:9533`,
        target: `http://10.7.203.147:9533`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_GNSS_API]: ''
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
      // 探测数据
      [process.env.VUE_APP_PROB_API]: {
        // target: `http://192.168.3.9:9718`,
        target: `http://10.7.203.147:9540`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_PROB_API]: ''
        }
      },
      [process.env.VUE_APP_PRODS_API]: {
        // target: `http://10.7.203.147:9718`,
        target: `http://10.7.203.147:9541`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_PRODS_API]: ''
        }
      },
      [process.env.VUE_APP_DIREC_API]: {
        // target: `http://10.7.203.147:9718`,
        target: `http://10.7.203.147:9543`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_DIREC_API]: ''
        }
      },
      [process.env.VUE_APP_KNOWS_API]: {
        // target: `http://10.7.203.147:9718`,
        target: `http://10.7.203.147:9843`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_KNOWS_API]: ''
        }
      },
      [process.env.VUE_APP_ORDER_API]: {
        // target: `http://10.7.203.147:9718`,
        target: `http://10.7.203.147:9546`,
        changeOrigin: true, //
        pathRewrite: {
          ['^' + process.env.VUE_APP_ORDER_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: 'expanded' }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      // new webpack.ProvidePlugin({
      //   "window.Quill": "quill/dist/quill.js",
      //   Quill: "quill/dist/quill.js"
      // })
    ]
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single'),
        {
          from: path.resolve(__dirname, './public/robots.txt'), // 防爬虫文件
          to: './' // 到根目录下
        }
    })
  }
}
