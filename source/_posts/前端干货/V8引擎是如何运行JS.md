---
type: blog
title: V8引擎是如何运行JS
categories:
  - 深入前端
tags:
  - javascript
  - JS运行原理
  - V8引擎
abbrlink: cf2c43d
date: 2020-12-22 00:00:00
---

## 什么是V8引擎

一个接受JavaScript代码，编译代码然后执行的C++ 程序，编译后的代码可以在多种操作系统多种处理器上运行。

**介绍**

哪些程序用到V8

- Chrome浏览器的JS引擎是V8
- Nodejs的运行时环境是V8
- electron的底层引擎是V8  【ɪˈlektrɑːn】  跨平台桌面应用开发工具

blink是渲染引擎，V8是JS引擎

访问Dom的接口是由Blink提供的

**功能**

接收JavaScript代码，编译代码后执行C++程序，编译后的代码可以在多种操作系统多种处理器上运行。编译和执行JS代码、处理调用栈、内存分配、垃圾回收。

1. 编译和执行JS代码
2. 处理调用栈
3. 内存分配
4. 垃圾回收

**V8的js编译和执行**

- 解析器  parser  js --> 解析成功抽象语法树AST
- 解释器  interpreter   AST --> 字节码bytecode，也有直接执行字节码的能力
- 编译器  compiler  bytecode --> 更高效的机器码

V8版本5.9之前没有解释器，但是有两个编译器

**5.9版本的V8**

1. parser  解释器生成抽象语法树AST
2. compiler  编译器Full-codegen  基准编译器  直接生成机器码
3. 运行一段时间后，由分析器线程优化js代码
4. compiler  编译器CrankShaft   优化编译器   重新生成AST提升运行效率

这样设计的缺点

1. 机器码会占用大量的内存
2. 缺少中间层机器码，无法实现一些优化策略
3. 无法很好的支持和优化JS的新语特性，无法拥抱未来

## 新版本的V8

[![rrlwNT.md.png](https://s3.ax1x.com/2020/12/22/rrlwNT.md.png)](https://imgchr.com/i/rrlwNT)

1. parser  解析器  生成AST抽象语法树
2. interpreter   解释器   Ignition   生成byteCode字节码  并直接执行
3. 清除AST 释放内存空间
4. 得到25% - 50%的等效机器代码大小
5. compiler  运行过程中，解释器收集优化信息发送给编译器TurboFan
6. 重新生成机器码
7. 有些热点函数变更会由优化后的机器码还原成字节码 也就是deoptimization  回退字节码操作执行

优化点：

1. 值声明未调用，不会被解析生成AST
2. 函数只被调用一次，bytcode直接被解释执行，不会进入到编译优化阶段
3. 函数被调用多次，Igniton会收集函数类型信息，可能会被标记为热点函数，可能被编译成优化后的机器代码

好处：

1. 由于一开始不需要直接编译成机器码，生成了中间层的字节码，从而节约了时间
2. 优化编译阶段，不需要从源码重新解析,直接通过字节码进行优化，也可以deoptimization回退操作

```javascript
function sum(x,y){return x + y};
sum(1,2);
sum(3,4);
sum(5,6);
sum("7","8");//会回退字节码操作执行
```

**[原文地址](https://www.bilibili.com/video/BV1zV411z7RX)**