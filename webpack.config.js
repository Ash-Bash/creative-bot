const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // context: __dirname + '\\src\\javascript',
  entry: [
    './src/javascript/index.tsx'
  ],
  target: 'electron-renderer',
  resolve: {
    // changed from extensions: [".js", ".jsx"]
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'file-loader',
          query: {
            name: '[name].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'sass-loader'
        ]
      },
      
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'awesome-typescript-loader?cacheDirectory=true'
        }
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory=true'
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index.ejs')
    }),
    new CopyWebpackPlugin([{ from: 'src/styles', to: 'styles' }]),
  ],
  node: {
    fs: 'empty'
  },
  devtool: 'eval-source-map',
  devServer: {
    inline: false
  },
  watchOptions: {
    ignored: ['storage/*']
  }
};
