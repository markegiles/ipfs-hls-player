const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/ipfs-hls-player.js',
  output: {
    filename: 'ipfs-hls-player.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'IPFSHLSPlayerBundle',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.js'],
    fallback: {
      "crypto": false,
      "stream": false,
      "buffer": false
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1 // Force everything into a single chunk
    })
  ]
};