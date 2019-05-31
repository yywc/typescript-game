const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const config = require('./webpack.base.conf');

// merge 合并 base 的配置再导出
module.exports = merge(config, {
  devtool: 'cheap-module-eval-source-map', // 代码追踪
  devServer: {
    hot: true, // 热更新
    port: 8080, // 端口号
    open: true, // 打开默认浏览器
    quiet: true, // 关闭 webpack-dev-server 的提示，用 friendly-error-plugin
    overlay: true, // 错误全屏覆盖在浏览器上
    host: 'localhost', // 主机名
    clientLogLevel: 'warning', // 控制台提示信息级别是 warning 以上
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html', // 指定 html 模板为根目录下的 index.html
    }),
    new FriendlyErrorsPlugin(), // 友好错误提示
    new webpack.HotModuleReplacementPlugin(), // 热更新
  ],
});
