const merge = require('webpack-merge');
const config = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(config, {
  bail: true, // 出现错误立即停止打包
  devtool: 'cheap-module-source-map', // 代码追踪
  plugins: [
    new CleanWebpackPlugin(), // 清空 dist 目录
    new HtmlWebpackPlugin({
      template: 'index.html', // 模板为根目录下的 index.html
      minify: {
        removeComments: true, // 移除注释
        collapseWhitespace: true, // 压缩空格
        removeAttributeQuotes: true, // 移除属性引号
      },
    }),
  ],
});
