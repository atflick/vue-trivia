const path = require('path')

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [

        // importing global scss
        path.resolve(__dirname, './src/styles/vendor/_vendor.scss'),
        path.resolve(__dirname, './src/styles/helpers/mixins/**/*.scss'),
        path.resolve(__dirname, './src/styles/helpers/functions/**/*.scss'),
        // path.resolve(__dirname, './src/styles/_colors.scss'),
        // path.resolve(__dirname, './src/styles/_settings.scss'),
        path.resolve(__dirname, './src/styles/main.scss')
      ]
    })
}

module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'manual',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ],
  css: {
    loaderOptions: {
      sass: {
        // prependData: '@import "@/styles/main.scss";'
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' }
        }
      ]
    }
  },
  chainWebpack (config) {
    // Load variables for all vue-files
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']

    // or if you use scss
    types.forEach(type => {
      addStyleResource(config.module.rule('scss').oneOf(type))
    })

    config.module
      .rule('glob')
      .test(/\.scss/)
      .use('import-glob-loader')
      .loader('import-glob-loader')
      .end()
  }
}
