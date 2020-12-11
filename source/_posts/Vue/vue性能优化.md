---
type: blog
top: true
title: vue性能优化
categories:
  - 前端
tags:
  - vue
  - 性能优化
abbrlink: 93532fe
date: 2020-12-11 00:00:00
---

## 1、使用单文件组件

我们写的tmplate配置，实际上需要编译为render函数在执行的

当使用DOM内模板或者JS内的字符串模板时，模板会在运行时被编译为render函数，通常情况这个过程已经足够快乐，但是对性能敏感的应用还是有影响的。

[![rAis9f.png](https://s3.ax1x.com/2020/12/11/rAis9f.png)](https://imgchr.com/i/rAis9f)

预编译模板最简单的方式就是使用**单文件组件**，单文件组件将相关的构建设置自动预编译好了，所以构建的代码已经包含了编译出来的render函数了，而不是原始的模板字符串了，减少了重新编译的过程了。（单文件组件导入使用直接使用vue-loader来处理，没有vue-tmplate的出来，使用起来会足够快速的。）

<!-- more -->

## 2、使用`Objaec.freeze()`提升性能

参考vue源码，定义响应式的时候，如果freeze后的数据，不会加上setter和getter

https://github.com/vuejs/vue/blob/dev/src/core/observer/index.js

```
const property = Object.getOwnPropertyDescriptor(obj, key)
if (property && property.configurable === false) {
  return
}
```

## 3、扁平化数据store

store数据扁平化，减少数据层级嵌套，减少遍历。

## 4、列表渲染优化

如果的我们的应用存在无限长或者无限滚动的长列表，那么采用 **窗口化**的技术来优化，只需要渲染少部分区域的内容，减少重新渲染组件和创建dom节点的时间。

[vue-virtual-scroll-list](https://github.com/tangbc/vue-virtual-scroll-list)

[vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)

可以使用上面的两个库来处理

[![rAt2MF.png](https://s3.ax1x.com/2020/12/11/rAt2MF.png)](https://imgchr.com/i/rAt2MF)

## 5、骨架屏

[![rANGw9.png](https://s3.ax1x.com/2020/12/11/rANGw9.png)](https://imgchr.com/i/rANGw9)

webpack骨架屏的实践方案: https://www.jianshu.com/p/ec4bf33ab2c8

## 6、 ssr服务端渲染

[![rAUzgf.png](https://s3.ax1x.com/2020/12/11/rAUzgf.png)](https://imgchr.com/i/rAUzgf)

实现方案可以采用[nuxt.js](https://www.nuxtjs.cn/)

## 7、 路由懒加载

https://router.vuejs.org/zh/guide/advanced/lazy-loading.html

## 8、 gzip、缓存控制、cdn

**开启GZIP**

体积对比图：
1541KB vs 466KB

[![rAdpJ1.png](https://s3.ax1x.com/2020/12/11/rAdpJ1.png)](https://imgchr.com/i/rAdpJ1)

耗时对比图：
333ms vs 225ms

[![rAdZod.png](https://s3.ax1x.com/2020/12/11/rAdZod.png)](https://imgchr.com/i/rAdZod)

操作步骤：

1、安装包（新版本的好像配置还要改~~）

`npm install --save-dev compression-webpack-plugin`

2、webpack的配置

```
productionGzip: true,

productionGzipExtensions: ['js', 'css']
```

3、nginx添加配置：

```
server {
  gzip on; #开启或关闭gzip on off
  gzip_static on;
  gzip_disable "msie6"; #不使用gzip IE6
  gzip_min_length 100k;  #gzip压缩最小文件大小，超出进行压缩（自行调节）
  gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;  #压缩文件类型
  ...
}
```

**CND加速**

vue打包文件会默认把所有的第三方代码打包到一个vendor.js中，我们可以把部分超大的文件剥离出来，使用cnd资源。如图，我们将vue/vuex/vue-router/axios分离出来降低vendor.js的压力。

[![rAwVXT.png](https://s3.ax1x.com/2020/12/11/rAwVXT.png)](https://imgchr.com/i/rAwVXT)

1、引入外部资源CDN

[![rAwMN9.png](https://s3.ax1x.com/2020/12/11/rAwMN9.png)](https://imgchr.com/i/rAwMN9)

2、webpack处理（别名处理）

key：要引入的资源名称；value：模块提供给外部引用的名称

[![rAw31x.png](https://s3.ax1x.com/2020/12/11/rAw31x.png)](https://imgchr.com/i/rAw31x)

3、去除引用，如果想避免全局污染，可如下定义

[![rAwYnO.png](https://s3.ax1x.com/2020/12/11/rAwYnO.png)](https://imgchr.com/i/rAwYnO)
