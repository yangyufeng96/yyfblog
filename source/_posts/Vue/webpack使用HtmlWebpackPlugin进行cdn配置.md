---
title: vue项目中webpack使用HtmlWebpackPlugin进行cdn配置
type: blog
layout: post
tags:
  - vue
  - webpack
categories: Vue
abbrlink: f8a3109a
date: 2019-07-16 13:27:58
---

# CDN服务商的选择

要使用cdn功能，就需要cdn服务商，我们可以自己搭建，也可以使用一些比较知名的服务商，庆幸的是市面上有不少的免费cdn服务商，如：

- [BootCDN](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.bootcdn.cn%2F)
- [unpkg](https://links.jianshu.com/go?to=https%3A%2F%2Funpkg.com%2F)

其中BootCDN 是 Bootstrap 中文网支持并维护的前端开源项目免费 CDN 服务，项目资源同步于 cdnjs 仓库。界面相对比较好看，且支持搜索功能，可以在线测试cdn是否正常，所以下面以Bootcdn为例说明。

# webpack的作用

在前段项目开发中，我们经常使用webpack进行项目搭建， 主要作用有两个，分别是

1.启动服务器环境，用于调试代码

2.构建项目，生成静态资源

在webpack中使用cdn是在打包生成静态资源的时候做处理，主要原理是使用[html-webpack-plugin](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fhtml-webpack-plugin)动态插入cdn链接。

*关于webpack的使用这里不做过多的介绍，将以vue--cli 2.x生成的默认项目为例做介绍*

<!-- more -->

# html-webpack-plugin的使用

`html-webpack-plugin`是webpack的一个插件，可以动态的创建和编辑html内容，在html中使用`esj语法`可以读取到配置中的参数，简化了html文件的构建。

我们这次主要是使用它来动态插入cdn链接，如link标签和script标签。

# 创建Vue项目

## *vue-cli 2.x*

```
vue init webpack webpack-cdn-demo
```

创建名为`webpack-cdn-demo`，类型为webpack的`vue`项目，如果安装的vue-cli是3.x版本，命令不太一样，详细可看[vue-cli 3](https://links.jianshu.com/go?to=https%3A%2F%2Fcli.vuejs.org%2Fzh%2Fguide%2Fcreating-a-project.html%23vue-create)。

## 安装依赖

```
$ cd  webpack-cdn-demo
$ npm  install
```

## 启动项目

```
$ npm run dev
```

**目录结构**

```
+-- build
|  +-- utils.js js 工具类
|  +-- webpack.base.conf.js  webpack基础配置
|  +-- webpack.dev.conf.js  webpack开发配置
|  +-- webpack.prod.conf.js  webpack构建配置
+-- config
+-- src
|  +-- App.vue  vue文件组件
|   +-- main.js  入口文件
+-- index.html  页面
+-- package.json  项目文件
```

其中build文件夹中的`webpack.prod.conf.js`是我们主要注意的文件,我们在该文件中动态设置不需要被打包的模块并构建出合适的链接。

# 确定需要使用CDN的模块

在webpack项目中，所引入的第三方资源会被统一打包进vender文件中，我们通过webpack的`externals`属性可以设置打包时排除该模块，详情说明见[外部扩展(externals)](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Fexternals%2F)。

在前面的步骤中，我们创建的项目包括vue、vue-router，在正式开发在还会有ui库，如element-ui，为了方便演示，我们再安装element-ui和axios两个模块，并实现在构建是把这是个模块以cdn的形式引入。

|  所需模块  |
| :--------: |
|    vue     |
| vue-router |
| element-ui |
|   axios    |

```
npm install element-ui axios  -S
```

*注意安装时记得 -S，它的作用是安装完后在package.json项目文件中插入记录，后续操作需要读取已安装模块*

# 确定CDN资源URI

对于cdn，我们可以自己搭建，也可以使用专业的cdn服务商，这里使用免费的cdn [bootcdn](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.bootcdn.cn%2F)。选用免费cdn有很多好处，但毕竟有隐患，那就是服务有可能会奔溃。

bootcdn [https://www.bootcdn.cn](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.bootcdn.cn)

依次搜索出前面模块，结果如下:

| **模块**   | 版本   | **js**                                                       | **css**                                                      |
| ---------- | ------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| vue        | 2.5.2  | [https://cdn.bootcss.com/vue/2.5.2/vue.min.js](https://links.jianshu.com/go?to=https%3A%2F%2Fcdn.bootcss.com%2Fvue%2F2.5.2%2Fvue.min.js) | -                                                            |
| vue-router | 3.0.1  | [https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js](https://links.jianshu.com/go?to=https%3A%2F%2Fcdn.bootcss.com%2Fvue-router%2F3.0.1%2Fvue-router.min.js) | -                                                            |
| element-ui | 2.6.3  | [https://cdn.bootcss.com/element-ui/2.6.1/index.js](https://links.jianshu.com/go?to=https%3A%2F%2Fcdn.bootcss.com%2Felement-ui%2F2.6.1%2Findex.js) | [https://cdn.bootcss.com/element-ui/2.6.1/theme-chalk/index.css](https://links.jianshu.com/go?to=https%3A%2F%2Fcdn.bootcss.com%2Felement-ui%2F2.6.1%2Ftheme-chalk%2Findex.css) |
| axios      | 0.18.0 | [https://cdn.bootcss.com/axios/0.18.0/axios.min.js](https://links.jianshu.com/go?to=https%3A%2F%2Fcdn.bootcss.com%2Faxios%2F0.18.0%2Faxios.min.js) | -                                                            |

按照规律，得出cdn资源路径规则为

```
https://cdn.bootcss.com + 模块名 + 版本号 + 具体路径
```

其他cdn服务商同理

# 打包前的处理

## build/utils.js添加读取事件

`使用cdn其实也就是在webpack热启动和打包项目的时候动态插入script和style链接`，为了方便维护，我们通过在`build/utils.js`文件上添加几个方法，将来在`webpack.dev.conf.js`和`webpack.prod.conf.js`上可以使用。

*如果没有build/utils.js，可以在其他文件上添加，只要在后续步骤中能操作到就行*

添加cdn根地址

```
// build/utils.js 国内免费cdn镜像源
exports.cdnBaseHttp = 'https://cdn.bootcss.com';
```

添加cdn模块 `按照需要删改` 

```
//  build/utils.js external配置
exports.externalConfig = [
  { name: 'vue', scope: 'Vue', js: 'vue.min.js' },
  { name: 'vue-router', scope: 'VueRouter', js: 'vue-router.min.js' },
  { name: 'axios', scope: 'axios', js: 'axios.min.js' },
  { name: 'element-ui', scope: 'ELEMENT', js: 'index.js', css: 'theme-chalk/index.css' },
];
```

`name` 模块名称，与package.json同名
 `scope` 模块作用域命名
 `js` js地址
 `css` css地址

这里特别注意scope，它是webpack配置的external参数下的信息，比如vue的作用域命名是Vue，vue-router的作用域命名是VueRouter，element-ui的作用域命名是ELEMENT，同理，jq的作用域命名是JQuery，`具体做法是先引入该资源，然后在控制台依次输入近似的值，一个个匹配`(目前没找到更好的做法)。

添加获取版本号方法

```
// build/utils.js 获取模块版本号
exports.getModulesVersion = () => {
  let mvs = {};
  let regexp = /^npm_package_.{0,3}dependencies_/gi;
  for (let m in process.env) { // 从node内置参数中读取，也可直接import 项目文件进来
    if (regexp.test(m)) { // 匹配模块
       // 获取到模块版本号
      mvs[m.replace(regexp, '').replace(/_/g, '-')] = process.env[m].replace(/(~|\^)/g, '');
    }
  }
  return mvs;
};
```

导出不需要被打包的cdn模块配置`重点` 

```
// build/utils.js
exports.getExternalModules = config => {
  let externals = {}; // 结果
  let dependencieModules = this.getModulesVersion(); // 获取全部的模块和版本号
  config = config || this.externalConfig; // 默认使用utils下的配置
  config.forEach(item => { // 遍历配置
    if (item.name in dependencieModules) {
      let version = dependencieModules[item.name];
      // 拼接css 和 js 完整链接
      item.css = item.css && [this.cdnBaseHttp, item.name, version, item.css].join('/');
      item.js = item.js && [this.cdnBaseHttp, item.name, version, item.js].join('/');
      externals[item.name] = item.scope; // 为打包时准备
    } else {
      throw new Error('相关依赖未安装，请先执行npm install ' + item.name);
    }
  });
  return externals;
};
```

## webpack.dev.conf.js添加cdn配置

在webpack热启动本地调试的时候，我们可以使用cdn。

获取cdn配置

```
// build/webpack.dev.conf.js 大概在15行
const externalConfig = JSON.parse(JSON.stringify(utils.externalConfig));  // 读取配置
utils.getExternalModules(externalConfig); // 获取到合适的路径（引用类型，自动改变）

// const devWebpackConfig = merge ....... 
```

在`build/webpack.dev.conf.js`中，默认已经引入了`utils.js`，所以可以直接调用相关方法，如果是自定义的文件，记得引入。

HtmlWebpackPlugin插件中导出cdn
 紧接着我们在该文件下找到`devWebpackConfig`下的`plugins`下的`HtmlWebpackPlugin`插件，它的作用是动态构建html页面，原始配置如下：

```
new HtmlWebpackPlugin({
  filename: 'index.html',
  template: 'index.html',
  inject: true
}),
// 代表处理根目录下的index.html文件
```

`我们可以往里面添加点自定义属性，方便在index.html中调用。`，修改如下：

```
new HtmlWebpackPlugin({
 filename: 'index.html',
 template: 'index.html',
 inject: true,
 cdnConfig: externalConfig, // cdn配置
 onlyCss: true, //dev下只加载css
}),
```

其中`cdnConfig`和`onlyCss`自定义属性，在html上通过`htmlWebpackPlugin.options`可以读取到。

更多html-webpack-plugin配置情况官网，这里暂时不需要更多。

## webpack.prod.conf.js添加cdn配置和忽略模块

在打包的时候，我们使用cdn，配置和前面dev的差不多，只不过需要做多一步。

获取cdn配置

```
// build/webpack.prod.conf.js 大概在15行
const externalConfig = JSON.parse(JSON.stringify(utils.externalConfig)); // 读取配置
const externalModules = utils.getExternalModules(externalConfig); // 获取到合适路径和忽略模块

// const webpackConfig = merge(baseWebpackConfig.... 
```

注意此处的`externalModules`，后面用到，也就是比dev多的步骤。

webpck配置加多个属性externals
 `externals`代表构建时不需要被处理的模块，也就是前面说的`scope`需要注意的地方。

```
// build/webpack.prod.conf.js
const webpackConfig = merge(baseWebpackConfig, {
  externals: externalModules, // 构建时忽略的资源

  // 其他属性
}
```

HtmlWebpackPlugin插件中导出cdn
 和dev一样，我们修改`webpackConfig`下的`plugins`下的`HtmlWebpackPlugin`插件配置 (这里的默认配置比dev的多，主要是css压缩和js压缩相关)

```
new HtmlWebpackPlugin({
   // 其他默认配置
  cdnConfig: externalConfig, // cdn配置
  onlyCss: false, //加载css
}),
```

加入和dev一样的两个配置，不过需要把onlyCss改为`true`，因为我们希望打包时不单单使用css。

## index.html插入相关链接

webpack配置已经完成，在html-webpack-plugin中已经添加了相关参数，我们再在页面上可以直接使用，使用语法是`ejs`，和asp.net，jsp，php类似。

```
<!DOCTYPE html>
<html>
  <head>
   <!-- 其他标签 -->
    <% htmlWebpackPlugin.options.cdnConfig.forEach(function(item){ if(item.css){ %>
    <link href="<%= item.css %>" rel="stylesheet" />
    <% }}) %>
  </head>
  <body>
   <!-- 其他标签 -->
    <% htmlWebpackPlugin.options.cdnConfig.forEach(function(item){ if(item.js && !htmlWebpackPlugin.options.onlyCss){ %>
    <script type="text/javascript" src="<%= item.js %>"></script>
    <% }}) %>
    <!-- built files will be auto injected -->
  </body>
</html>
```

通过`<% %>` 和 `htmlWebpackPlugin.options` 用js遍历`插入`link标签和script标签。

*ps: 修改了webpack配置，需要重启项目才会生效*

### 愉快的开发

此时启动项目，查看控制台或者查看源代码，可以清楚的相关资源来源

**有一个更好的插件**[webpack-cdn-plugin](https://github.com/shirotech/webpack-cdn-plugin)

**[原文链接](https://www.jianshu.com/p/9248db0349fb)**

