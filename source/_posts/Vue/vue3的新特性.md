---
type: blog
layout: post
title: vue3的新特性
categories: Vue
tags: vue
abbrlink: 86248f8a
date: 2020-12-08 00:00:00
---

**六大亮点**

[vue3官方文档](https://vue3js.cn/docs/zh/api/)

[![rSCl4A.jpg](https://s3.ax1x.com/2020/12/08/rSCl4A.jpg)](https://imgchr.com/i/rSCl4A)

- `Performance`：性能更比`Vue 2.0`强。

- `Tree shaking support`：可以将无用模块“剪辑”，仅打包需要的。

- `Composition API`：组合`API`

- `Fragment, Teleport, Suspense`：“碎片”，`Teleport`即`Protal传送门`，“悬念”

- `Better TypeScript support`：更优秀的 Ts 支持

- `Custom Renderer API`：暴露了自定义渲染`API`

<!-- more -->

## 1、Performance

[![rSCr3q.jpg](https://s3.ax1x.com/2020/12/08/rSCr3q.jpg)](https://imgchr.com/i/rSCr3q)

+ 重写了虚拟`Dom`的实现（且保证了兼容性，脱离模版的渲染需求旺盛）。

+ 编译模板的优化。

+ 更高效的组件初始化。

+ `update`性能提高 1.3~2 倍。

+ `SSR`速度提高了 2~3 倍。

[![rSPAaQ.jpg](https://s3.ax1x.com/2020/12/08/rSPAaQ.jpg)](https://imgchr.com/i/rSPAaQ)

## 2、Tree shaking support

[![rSPdsK.jpg](https://s3.ax1x.com/2020/12/08/rSPdsK.jpg)](https://imgchr.com/i/rSPdsK)

- 可以将无用模块“剪辑”，仅打包需要的（比如v-model,<transition>，用不到就不会打包）。
- 一个简单“HelloWorld”大小仅为：13.5kb，11.75kb，仅Composition API。
- 包含运行时完整功能：22.5kb，拥有更多的功能，却比Vue 2更迷你。

很多时候，我们并不需要 `vue`提供的所有功能，在 `vue 2` 并没有方式排除掉，但是 3.0 都可能做成了按需引入



## 3、Composition API

[![rSk5dO.jpg](https://s3.ax1x.com/2020/12/08/rSk5dO.jpg)](https://imgchr.com/i/rSk5dO)

与`React Hooks` 类似的东西，实现方式不同。


- 可与现有的 `Options API`一起使用

- 灵活的逻辑组合与复用

- `vue 3`的响应式模块可以和其他框架搭配使用

混入(`mixin`) 将不再作为推荐使用， `Composition API`可以实现更灵活且无副作用的复用代码。

[Composition API 文档地址](https://composition-api.vuejs.org/zh/)

`Composition API`包含了六个主要`API`

## 4、Fragment

[![rSAllR.jpg](https://s3.ax1x.com/2020/12/08/rSAllR.jpg)](https://imgchr.com/i/rSAllR)

`Fragment`翻译为：“碎片”  


- 不再限于模板中的单个根节点

- `render` 函数也可以返回数组了，类似实现了 `React.Fragments` 的功能 。

- `Just works`

`<Teleport>`

[![rSE83j.jpg](https://s3.ax1x.com/2020/12/08/rSE83j.jpg)](https://imgchr.com/i/rSE83j)

`<Suspense>`

[![rSEwUU.jpg](https://s3.ax1x.com/2020/12/08/rSEwUU.jpg)](https://imgchr.com/i/rSEwUU)



`Suspense`翻译为：“悬念”

- 可在嵌套层级中等待嵌套的异步依赖项

- 支持`async setup()`

- 支持异步组件

虽然`React 16`引入了`Suspense`，但直至现在都不太能用。如何将其与异步数据结合，还没完整设计出来。

Vue 3 的`<Suspense>`更加轻量：

仅 5%应用能感知运行时的调度差异，综合考虑下，Vue3 的`<Suspense>` 没和 React 一样做运行调度处理

## 5、更好的`TypeScript`支持
[![rSEbrt.jpg](https://s3.ax1x.com/2020/12/08/rSEbrt.jpg)](https://imgchr.com/i/rSEbrt)

- `Vue 3`是用`TypeScript`编写的库，可以享受到自动的类型定义提示

- `JavaScript`和`TypeScript`中的 API 是相同的。事实上，代码也基本相同

- 支持`TSX`

- `class`组件还会继续支持，但是需要引入`vue-class-component@next`，该模块目前还处在 alpha 阶段。

还有`Vue 3 + TypeScript` 插件正在开发，有类型检查，自动补全等功能

## 6、`Custom Renderer API`：自定义渲染器 API
[![rSVkZV.jpg](https://s3.ax1x.com/2020/12/08/rSVkZV.jpg)](https://imgchr.com/i/rSVkZV)

- 正在进行`NativeScript Vue`集成

- 用户可以尝试`WebGL`自定义渲染器，与普通 Vue 应用程序一起使用（`Vugel`）。

  

意味着以后可以通过 `vue`， `Dom` 编程的方式来进行 `webgl` 编程 。

感兴趣可以看这里：[Getting started vugel](https://vugel.planning.nl/#application)


**剩余工作**

全家桶插件组件过渡到vue3.+

**要点**

新工具：`vite`（法语 “快”）

地址：https://github.com/vuejs/vite

一个简易的`http`服务器，无需`webpack`编译打包，根据请求的`Vue`文件，直接发回渲染，且支持热更新（非常快）

