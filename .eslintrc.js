module.exports = {
  root: true, // 设置为 true .eslintrc 查找到此处不会继续往上查找
  parser: '@typescript-eslint/parser', // eslint 解析器
  parserOptions: {
    ecmaVersion: 6, // 指定 es 版本
    sourceType: 'module', // 设置代码为 es 模块
    project: './tsconfig.json', // tsconfig.json 路径（@typescript-eslint/parser 配置）
    tsconfigRootDir: './', // tsconfig.json 根路径（@typescript-eslint/parser 配置）
  },
  env: {
    // 设置运行环境为以下三种
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'], // 配置 eslint 校验规则
  plugins: ['@typescript-eslint'], // eslint 输出规则
  settings: {
    // 解决使用 @ 符号 import 时 eslint 报错
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js',
      },
    },
  },
  // 自定义规则
  rules: {
    '@typescript-eslint/indent': ['error', 2], // 缩进改为2个空格
    'lines-between-class-members': 0, // 关闭类中成员空行校验
    'no-underscore-dangle': 0, // 关闭下划线校验
    'no-restricted-syntax': 0, // 主要是 for of 的使用校验
  }
};
