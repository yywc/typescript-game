## 搭建环境

+ node 版本: 8.x 以上
+ npm 版本: 5.x 以上
+ webpack: 4.x 以上
+ typescript: 3.x 以上

### webpack 相关依赖安装

```shell
npm install -D webpack webpack-cli webpack-dev-server webpack-merge typescript ts-loader url-loader file-loader html-webpack-plugin clean-webpack-plugin
```

具体每个包的功能不在这里赘述，感兴趣的同学可以参考我的[Webpack4 从零开始搭建 Vue 环境](https://github.com/yywc/webpack-app)。

### eslint 相关依赖安装

```shell
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb-base eslint-friendly-formatter eslint-import-resolver-webpack eslint-loader eslint-plugin-import
```

由于本项目的第一版是用 js 编写的微信小程序项目，所以这里就不用 babel 转换成 es5 了，直接 es6 跑在浏览器（chrome）里就行。

## 搭建脚手架

整个项目目录结构如下：

```none
ts-game
├─┬ build
│ ├── webpack.base.conf.js
│ ├── webpack.dev.conf.js
│ ├── webpack.prod.conf.js
├── src
│ ├── assets
│ ├── interfaces
│ ├── modules
│ ├── types
│ ├── App.ts
├── .eslintignore
├── .eslintrc.js
├── .favicon.ico
├── index.html
├── package.json
└── tsconfig.json
```

## 编写各个部分

### webpack.base.conf.js

```js
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

```

### .eslintignore

```none
# 根目录下 js
/*.js
# build 目录
/build
# dist 目录
/dist
```

### .eslintrc.js

使用 prettier + eslint 的方法规范代码，安装 prettier 相关的依赖

```shell
npm install -D eslint-config-prettier eslint-plugin-prettier
npm install -D --save-exact prettier // 准确安装 prettier 版本，防止以后出现风格问题
```

同时在目录下新建 .prettierrc.js 文件，用来设置 prettier 的格式化风格

```js
module.exports = {
  singleQuote: true, //字符串是否使用单引号，默认为false，使用双引号
  trailingComma: 'es5', //是否使用尾逗号，有三个可选值"<none|es5|all>"
  printWidth: 90, // 格式化代码换行时的最大宽度
};
```

再编写 .eslintrc.js 文件

```js
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
```

更多配置可以自行查看 [typescript 项目配置](https://www.tslang.cn/docs/handbook/tsconfig-json.html)。

### package.json

这里多安装几个依赖：

+ cross-env：跨平台设置 NODE_ENV 的环境变量
+ http-server：打包完成后的静态资源开启服务器预览
+ @commitlint/cli、cz-conventional-changelog：规范化 git commit
+ @commitlint/config-conventional、husky：强制 git 校验

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development webpack-dev-server --progress --config build/webpack.dev.conf.js",
  "build": "cross-env NODE_ENV=production webpack --config build/webpack.prod.conf.js",
  "start": "http-server dist",
  "eslint": "eslint src --ext .ts --fix",
  "commit": "git-cz",
},
"config": {
  "commitizen": {
    "path": "node_modules/cz-conventional-changelog"
  }
},
"husky": {
  "hooks": {
    "pre-commit": "npm run eslint",
    "commit-msg": "commitlint -e $GIT_PARAMS"
  }
}
```

然后在根目录下创建 `.commitlintrc.js` 文件，用来定义我们的 commit 校验规则。

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

这样我们通过 `npm run dev` 启动开发环境，通过 `npm run build` 来打包，最后通过 `npm run start` 启动服务器即可看到我们打包后的项目。

接下来开始项目主体部分的编写。
