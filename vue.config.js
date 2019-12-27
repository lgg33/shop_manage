module.exports = {
  configureWebpack: {
    devServer: {
      // open: process.platform === 'darwin',
      // host: '0.0.0.0',
      port: 8080,
      https: false,
      hotOnly: false,
      proxy: {
        '/api': {
          target: 'http://localhost:9000',
          pathRewrite: {
            '^/api': ''
          }
          //target: 'http://127.0.0.1:50201'
        }
      }, // 设置代理
      // before: app => {}
    },
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}

