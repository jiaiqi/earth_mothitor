module.exports = {
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  devServer: {
    port: 4007,
    headers: { // 设置本地运行的跨域权限
      'Access-Control-Allow-Origin': '*',
    },
  }
}
