const path = require('path');

const resolve = dir => path.resolve(__dirname, '../', dir);

const isUseEslint = process.env.NODE_ENV === 'development'
  ? [{
    test: /\.ts$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: resolve('src'),
    options: {
      formatter: require('eslint-friendly-formatter'), // eslint 友好提示
      quiet: true,
    },
  }]
  : [];
module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/App',
  output: {
    path: resolve('dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash:7].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      ...isUseEslint,
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: resolve('src'),
      },
      {
        test: /\.png?$/,
        loader: 'url-loader',
        options: {
          limit: 2048,
          name: 'images/[name].[ext]',
        },
        include: resolve('src/assets'),
      },
    ],
  },
};
