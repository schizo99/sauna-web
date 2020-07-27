module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://schizo:3000',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: { '/api': '' },
      },
    },
  },
};
