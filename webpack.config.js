const path = require('path');
const webpack = require('webpack');

// Base configuration shared by all builds
const baseConfig = {
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
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1 // Force everything into a single chunk
    })
  ]
};

module.exports = [
  // UMD Development Build
  {
    ...baseConfig,
    mode: 'development',
    entry: './src/ipfs-hls-player.js',
    output: {
      filename: 'ipfs-hls-player.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'IPFSHLSPlayerBundle',
      libraryTarget: 'umd',
      libraryExport: 'default',
      globalObject: 'this'
    },
    devtool: 'source-map',
    optimization: {
      minimize: false
    }
  },
  
  // UMD Production Build (minified)
  {
    ...baseConfig,
    mode: 'production',
    entry: './src/ipfs-hls-player.js',
    output: {
      filename: 'ipfs-hls-player.min.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'IPFSHLSPlayerBundle',
      libraryTarget: 'umd',
      libraryExport: 'default',
      globalObject: 'this'
    },
    optimization: {
      minimize: true
    }
  },
  
  // ESM Build
  {
    ...baseConfig,
    mode: 'production',
    entry: './src/ipfs-hls-player.js',
    output: {
      filename: 'ipfs-hls-player.esm.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'module'
      }
    },
    experiments: {
      outputModule: true
    },
    optimization: {
      minimize: false
    }
  }
];