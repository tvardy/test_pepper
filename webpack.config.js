const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const config = {

  common: {
    entry: './app/js/index.js',
    output: {
      path: path.resolve(__dirname, 'dest/js')
    },
    resolve: {
      alias: {
        Carpet: 'carpet.js',
        Minified: 'minified/dist/minified.js'
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
    output: {
      filename: 'build.js'
    },
    devServer: {
      port: 3000,
      contentBase: path.join(__dirname, 'app'),
      compress: true,
      watchContentBase: true
    },
    devtool: 'cheap-source-map'
  },

  prod: {
    output: {
      filename: 'build.min.js'
    },
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