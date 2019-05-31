const path = require('path');

// 路径处理函数
const resolve = dir => path.resolve(__dirname, '../', dir);

// 根据环境判断是否使用 eslint，只在开发环境校验
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

// 主配置
module.exports = {
  mode: process.env.NODE_ENV, // webpack 模式，会根据值进行不同的内置优化
  entry: './src/App', // 入口文件
  output: {
    path: resolve('dist'), // 输出路径
    filename: '[name].[hash].js', // 输出文件名
  },
  resolve: {
    extensions: ['.ts', '.js'], // import 时可以省略 js、ts 的后缀名
    alias: {
      '@': resolve('src'), // @ 指向 src
    },
  },
  module: {
    rules: [
      ...isUseEslint, // eslint 规则
      {
        // ts 处理
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: resolve('src'),
      },
      {
        // png 图片处理
        test: /\.png?$/,
        loader: 'url-loader',
        options: {
          limit: 2048, // 小于 2kb 则打包成 base64
          name: 'images/[name].[ext]',
        },
        include: resolve('src/assets'),
      },
    ],
  },
};
