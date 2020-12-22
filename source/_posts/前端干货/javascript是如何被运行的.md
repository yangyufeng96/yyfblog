---
type: blog
title: javascript是如何被运行的
categories:
  - 深入前端
tags:
  - javascript
  - JS运行原理
abbrlink: 17da10f8
date: 2020-12-22 00:00:00
---

## JS的语言组成 

- 基本语法：C
- 数据类型 内存管理：Java
- 函数式编程：Scheme  函数是第一等公民
- 原型继承：Self   基于原型prototype的继承机制

## 奇葩的JS
对于熟悉javascript语言的前端开发小伙伴，直接上来两张图

[![rrE9Gq.md.png](https://s3.ax1x.com/2020/12/22/rrE9Gq.md.png)](https://imgchr.com/i/rrE9Gq)

[![rrEALF.md.png](https://s3.ax1x.com/2020/12/22/rrEALF.md.png)](https://imgchr.com/i/rrEALF)

是不是瞬间感觉头脑发热呢。

之所以会出现这些诡异的问题，是因为javascript是在设计之初并没有考虑的完善，是借鉴了多种语言的模式，基本是融合了面向过程和面向对象的。

<!--more-->

## 语言特性

动态类型语言 JS   编译环境JIT Just In Time Compilation 

静态类型语言 C++  编译环境 AOT  Ahead Of Time

**JIT**

js引擎运用了一项技术叫运行时编译  JIT
javascript是动态类型语言，在编译是使用的是JIT(just in time compilation) 运行时编译技术
白话就是：在运行时编译成机器代码

**AOT**

在运行前提前生成好机器代码

**javascript引擎**

将javascript代码高级语言转化为低级语言（机器语言）来执行

**常用的执行javascript引擎**

谷歌的v8引擎，javascriptcore，spidermonkey，quickjs，hermess(react nactive)

1. 谷歌V8
2. 苹果 - javaScriptCore
3. 火狐 - SpideMonkey
4. QuickJs
5. FaceBook - Hermes

## javascript引擎的编译流程

[![rrVTjf.md.png](https://s3.ax1x.com/2020/12/22/rrVTjf.md.png)](https://imgchr.com/i/rrVTjf)

说明：

javascript代码解析器（parser）解析成抽象语法树AST，通过解释器（interpreter）将AST编译为字节码bytecode(跨平台的一种中间表示，可以在不同的操作平台运行),字节码最后通过编译器，生成机器代码。**V8在5.9之前 是没有字节码的环节**。

1. parser - 将js源码通过parser解析器生成AST  抽象语法树
2. interpreter - 通过解释器将AST编程成功字节码bytecode (字节码与平台无关，是中间层，可以在各个平台上运行)
3. compiler - 根据当前平台编译出相应的机器代码也就是汇编代码  常见的操作系统平台有：IA32 X64 ARM MIPS 

**[原文地址](https://www.bilibili.com/video/BV1vh411Z7QG)**

