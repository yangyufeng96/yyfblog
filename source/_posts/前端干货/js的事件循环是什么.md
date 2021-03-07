---
type: blog
title: js的事件循环是什么
categories:
  - 深入前端
tags:
  - EventLoop
abbrlink: 62b88241
date: 2020-12-22 00:00:00
---

## 事件循环的机制

**概念**

宏任务：script(整个代码)、setTimeout、setInterval、setImmediate、I/O、UI rendering

微任务：promise、Object.observe、MutationObserve

任务的优先级：process.nextTick > promise.then > setTimeout > setImmediate



https://mp.weixin.qq.com/s/7k4skVdCIhTsTdEFmXyYLg

