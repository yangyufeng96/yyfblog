---
type: blog
title: React 脚手架工具（create-react-app）
categories:
  - react
tags:
  - create-react-app
  - react
abbrlink: a2043eea
date: 2020-9-9 17:55:00
---

## 介绍

在开发react应用时，应该没有人用传统的方法引入react的源文件(js)，然后在html编辑吧。

大家都是用webpack + es6来结合react开发前端应用。

这个时候，我们可以手动使用npm来安装各种插件，来从头到尾自己搭建环境。

比如：

```
npm install react react-dom --save

npm install babel babel-loader babel-core babel-preset-es2015 babel-preset-react --save

npm install babel webpack webpack-dev-server -g
```
<!-- more -->

类似这样的脚手架，我扫了网络上比较多人用和关注的，一共发现了三个，它们分别是：

```
react-boilerplate
react-redux-starter-kit
create-react-app(facebook官方开发)
```

## 特点

**安装和使用(默认监听3000端口)**

```
npm install -g create-react-app

create-react-app my-app

cd my-app/

npm start
```

源码结构简单清晰

如果你使用过webpack-dev-server或webpack搭建过开发环境，你就会发现，create-react-app的开发环境也有类似webpack-dev-server的--inline --hot自动刷新的功能。

翻看了一下源码，没有找到webpack.config.js文件，如果有使用webpack就应该有这个文件，好奇怪。

看了一下node_modules目录，也没找到webpack相关的东西。

**package.json**

package.json中也没有webpack相关的东西,但是在react-scripts中依赖了webpack



**线上编译命令**

编译出来的文件很小，且文件名还带hash值，方便我们做cache，而且它还提供一个服务器，让我们在本地也能看到线上生产环境类似的效果

```
npm run build
```

运行下面两条命令，可以查看线上生产环境的运行效果

```
npm install -g pushstate-server

pushstate-server build
```



**api开发**

CORS问题:毕竟端口不同，而线上环境却没有这个问题，因为你都控制线上环境的react应用和api应用，跑在同一个端口上。

按照以往思路，解决的方法可能是用环境变量，比如

const apiBaseUrl = process.env.NODE_ENV === 'development' ? 'localhost:3001' : '/'

但是这样搞起来，还是有些复杂，然而，create-react-app提供了一个超级简单的方法，只需要在package.json文件中，加一个配置项就可以了。

"proxy": "http://localhost:3001/",

执行npm run eject 暴露配置文件等



**报错解决方案：**

```
先执行git add . 和 git commit -m "init" 在执行 npm run eject
```

