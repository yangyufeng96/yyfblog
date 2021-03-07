---
type: blog
title: js 优化for循环-Duff装置
categories:
  - 深入前端
tags:
  - 代码优化
abbrlink: ef7302f6
date: 2020-12-24 00:00:00
---

循环是编程中常见的结构，在javaScript程序中同样随处可见。当我们要处理的数据集很大时，for循环的优化就显得格外重要了。 

 如下是一个常见的for循环： 

```js
for(var i = 0; i < values.length; i++) {
     console.log(values[i])
}
```

 这段代码中每循环一次都要计算一次values的长度，所以我们可以将循环由i递增改为i递减，在这个过程中，将终止条件values.l ength的O(n)调用简化成了O(1)调用，初次优化的代码如下： 

```js
for(var i = values.length -1; i >= 0; i--){
  console.log(values[i])
}

```

 我们还可以将循环改为后测试循环，如下： 

```js
var i = values.length - 1;
if (i > -1) {
  do{
    console.log(values[i]);
  }while(--i >= 0)
}

```

 以上的代码主要是将终止条件和自减操作符组合成了单个语句，不过使用后测试循环必须要保证要处理的值必须有一个。空数组会导致多余的一次循环。 

 以上的优化都是基于终止条件和自减操作，循环的次数依然没有变化，如果我们能减少循环的次数，代码运行速度是不是会更快呢。接下来我们介绍下一种叫Duff装置的技术。Duff装置的基本概念是通过计算迭代的次数是否为8的倍数将一个循环展开为一系列语句。请看以下代码： 

```js
var iterations = Math.ceil(values.length / 8);
var startAt = values.length % 8;
var i = 0;
do{
  switch(startAt){
    case 0: console.log(values[i++]);
    case 7: console.log(values[i++]);
    case 6: console.log(values[i++]);
    case 5: console.log(values[i++]);
    case 4: console.log(values[i++]);
    case 3: console.log(values[i++]);
    case 2: console.log(values[i++]);
    case 1: console.log(values[i++]);
  }
  startAt = 0;
}while(--iterations > 0)
```

 我们假设循环次数是10次，在普通的for循环中，会进入循环体10次，每一次打印对应的值。而在以上的代码中，我们计算出iterations是2，startAt是2，第一次进入switch语句的时候，会执行两次console语句，startAt重置为0，iterations自减为1，第二次进入switch语句时，就,会执行8次console语句， 然后退出循环。以上只执行了两次循环，打印的次数依然是10次，我们减少了循环的次数和处理终止条件的额外开销，在数据量很大的时候，可以使代码运行的更快。
基于以上代码，Andrew B.King提出了一个更快的Duff装置技术，将do-while循环分成两个单独的循环。代码如下： 

```js
var iterations = Math.floor(values.length / 8);
var leftover = values.length % 8;
var i = 0;
if(leftover > 0){
  do{
    console.log(values[i++]);
  }while(--leftover > 0);
}
do{
  console.log(values[i++]);
  console.log(values[i++]);
  console.log(values[i++]);
  console.log(values[i++]);
  console.log(values[i++]);
  console.log(values[i++]);
  console.log(values[i++]);
  console.log(values[i++]);
}while(--iterations > 0)
```

 以上的代码没有switch语句，每次进入第二个do-while循环时，执行8次console即可，这个方法比几乎比原始的Duff装置实现快上40%。针对大数据集使用Duff装置技术可以节省很多时间，但对于小数据集，额外的开销则可能得不偿失。
我们可以将duff装置技术封装成一个类似于forEach的方法，代码如下： 

```js
Array.prototype.duffForEach = function (fn) {
  const len = this.length;
  var num = Math.floor(len / 8);
  var leftover = len % 8;
  var i = 0;
  if (leftover > 0) {
    do {
      fn(this[i], i++);
    } while (--leftover > 0);
  }
  if (this.length < 8) {
    return
  }
  do {
    fn(this[i], i++);
    fn(this[i], i++);
    fn(this[i], i++);
    fn(this[i], i++);
    fn(this[i], i++);
    fn(this[i], i++);
    fn(this[i], i++);
    fn(this[i], i++);
  } while (--num > 0);
};
```

 我们可以测试一下： 

```js
let arr = [1, 2, 3, 4, 5];
arr.duffForEach((item, index) => {
    console.log(item, index)
})
```

 可以看到，结果不出意料是正常的 

**[原文地址](https://segmentfault.com/a/1190000023524594)**

