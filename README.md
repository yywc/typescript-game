# 搭建环境

## 准备

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
```

### index.html

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible"
        content="ie=edge">
  <link href="/favicon.ico"
        rel="shortcut icon">
  <title>Flappy Bird</title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    html,
    body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

  </style>
  <script>
    // 页面加载完成后设置 canvas 为全屏
    window.onload = function () {
      document.getElementById('canvas').setAttribute('width', window.innerWidth);
      document.getElementById('canvas').setAttribute('height', window.innerHeight);
    }
  </script>
</head>

<body>
  <canvas id="canvas"></canvas>
</body>

</html>
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": "./", // 解析非相对模块名的基准目录
    // 模块名到基于 baseUrl的路径映射的列表
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "module": "ESNext", // 当前语言
    "noUnusedLocals": true, // 若有未使用的局部变量则抛错
    "noUnusedParameters": true, // 若有未使用的参数则抛错
    "outDir": "./dist", // 生成文件放入 dist 目录
    "removeComments": true, // 移除注释
    "strict": true, // 启用严格模式
    "target": "ES6", // 转化成的目标语言
    // 要包含的类型声明文件路径列表
    "typeRoots": [
      "node_modules/@types"
    ]
  },
  // 打包 src 目录下的文件
  "include": [
    "src"
  ],
  // 排除 node_modules 目录下的文件
  "exclude": [
    "node_modules"
  ]
}
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
  "commit": "git-cz",
},
"config": {
  "commitizen": {
    "path": "node_modules/cz-conventional-changelog"
  }
},
"husky": {
  "hooks": {
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
