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
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ], // 配置 eslint 校验规则
  plugins: ['prettier', '@typescript-eslint'], // eslint 输出规则
  // 自定义规则
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/indent': ['error', 2], // 缩进改为2个空格
  },
};
