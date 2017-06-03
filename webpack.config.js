const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const config = {

  common: {
    entry: './app/js/index.js',
    output: {
      filename: 'build.min.js',
      path: path.resolve(__dirname, 'dest/js')
    },
    resolve: {
      alias: {
        Carpet: './jspm_package/github/mateuszgachowski/Carpet.js@3.1.3/dist/carpet.js',
        Minified: './jspm_packages/github/timjansen/minified.js@2015.1.1/dist/minified.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader'
        }
      ]
    }
  },

  dev: {
    devServer: {
      port: 3000,
      host: 'localhost',
      historyApiFallback: true,
      noInfo: false,
      stats: 'minimal'
    },
    devtool: 'cheap-source-map'
  },

  prod: {
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true
        },
        comments: false
      })
    ]
  }
};

module.exports = function (env) {
  console.log('webpack.config:', env);
  return merge(config.common, config[env] || config.dev);
};
