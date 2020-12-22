---
type: blog
title: 什么是JS调用栈
categories:
  - 深入前端
tags:
  - JS运行原理
abbrlink: 9926a09c
date: 2020-12-22 00:00:00
---

**概念**

栈：先进后出，进栈，出栈，与堆栈不同

队列：先进先出

调用栈是JS引擎追踪函数执行流程的一种机制，当执行环境中调用了多个函数时，通过这种机制，我们能够追踪到哪个函数正在执行，执行的函数体又调用了哪个函数

**例子**

调用栈，调用函数执行才回入栈

1. push  average()

2. push  sum()

3. shift  sum()

4. shift  average()

5. push  console.log()

6. shift  console.log()

```javascript
   function sum(a, b) {
    return a + b;
   }
   function average(a, b) {
    const aver = sum(a, b) / 2;
    return aver;
   }
   const num = average(3, 5);
   console.log(num);
```

**tips**

用栈持持续被调用，会导致内存溢出

原因是因为，JS主线程被占用会造成堵塞：事件循环，异步回调(宏任务，微任务，面试必问哦)