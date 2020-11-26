---
type: blog
layout: post
title: vue响应式原理源码剖析
categories: Vue
tags: vue
abbrlink: b0d42301
date: 2020-11-26 10:37:00
---

vue2更新到vue3对数据的响应式，做了重大的调整。

## 先回顾下vue2的响应式怎么做的

vue2对象响应式原理：Object.defineProperty()

vue2数组响应式原理：覆盖可以修改数组7个方法，从数组原型中获取这7个方法，并覆盖为可以发送更新通知的函数实现

<!-- more -->

### 对象的属性劫持

```
// 具体定义指定的key拦截器
function defineReactive(obj, key, val) {
  // 递归遍历
  observe(val)

  // val实际上是一个闭包
  Object.defineProperty(obj, key, {
    get() {
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        // val可能是对象
        observe(newVal)
        notifyUpdate()
        val = newVal
      }
    }
  })
}
```

### 数组属性的劫持

```
// 修改数组的7个api的原型
const originalProto = Array.prototype
const arrayProto = Object.create(originalProto)
;['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'].forEach(
  method => {
    arrayProto[method] = function() {
      // 做之前的事情
      originalProto[method].apply(this, arguments)

      // 通知更新
      notifyUpdate()
    }
  }
)
```

### 数据响应

```
// 思想：递归遍历传入obj，定义每个属性的拦截
function observe(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }

  // 判断类型：如果是数组则替换它的原型
  if (Array.isArray(obj)) {
    Object.setPrototypeOf(obj, arrayProto)
  } else {
    const keys = Object.keys(obj)
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index]
      // 对obj每个key执行拦截
      defineReactive(obj, key, obj[key])
    }
  }
}
```

### 跟新处理

```
function notifyUpdate() {
  console.log('页面更新！')
}

const data = { foo: 'foo', bar: { a: 1 }, tua: [1, 2, 3] }
observe(data)
// 1.普通更新
// data.foo = 'foooooooo'
// 2.嵌套属性更新
// data.bar.a = 10
// data.dong = 'lalala' // no ok
// 3.赋值是对象
// data.bar = {a:10}
// 4.数组
// data.tua.push(4)
```

### 以上方式会出现什么问题呢？


1. 需要响应化的数据较大，递归遍历性能不好、消耗较大
2. 新增或删除属性无法监听
3. 数组响应化需要额外实现
4. 修改语法有限制

**所以在vue3跟新做了更加优化方案**

## vue3的响应式原理的实现

**vue3响应式原理：利用[Proxy](https://es6.ruanyifeng.com/?search=Proxy&x=0&y=0#docs/proxy)对象对数据拦截**

```
// WeakMap 弱引用的方式缓存代理数据和原始数据
const toProxy = new WeakMap() // 形如 obj: observed
const toRaw = new WeakMap() // 形如 observed: obj

function isObject(obj) {
  return typeof obj === 'object' || obj === null
}

function hasOwn(obj, key) {
  return obj.hasOwnProperty(key)
}
// 响应对象数据
function reactive(obj) {
  if (!isObject(obj)) {
    return obj
  }

  // 查找缓存
  if (toProxy.has(obj)) {
    return toProxy.get(obj)
  }
  // 传入obj就是代理对象,此时不用反复代理
  if (toRaw.has(obj)) {
    return obj
  }

  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      // 访问
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}: ${res}`)

      // 依赖收集
      track(target, key)

      return isObject(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
      // 新增和更新
      const hadKey = hasOwn(target, key) // ADD 或 SET
      const oldVal = target[key]
      const res = Reflect.set(target, key, value, receiver)
      if (!hadKey) {
        console.log(`新增${key}:${value}`)
        trigger(target, 'ADD', key)
      } else if (oldVal !== value) {
        console.log(`设置${key}:${value}`)
        trigger(target, 'SET', key)
      }
      return res
    },
    deleteProperty(target, key) {
      // 删除
      const hadKey = hasOwn(target, key)
      const res = Reflect.deleteProperty(target, key)
      // key存在并且删除成功
      if (res && hadKey) {
        console.log(`删除${key}:${res}`)
        trigger(target, 'DELETE', key)
      }
      return res
    }
  })
  
  // 缓存
  toProxy.set(obj, observed)
  toRaw.set(observed, obj)

  return observed
}
// 每一个属性的响应回调方法
const activeReativeEffectStack = []

// 依赖收集执行
// 基本结构{target:{key:[eff1，eff2]}}
let targetsMap = new WeakMap()

function track(target, key) {
  // 从栈中获取响应函数
  const effect = activeReativeEffectStack[activeReativeEffectStack.length - 1]
  if (effect) {
    let depsMap = targetsMap.get(target)
    if (!depsMap) {
      // 首次访问target
      depsMap = new Map()
      targetsMap.set(target, depsMap)
    }

    // 存放key
    let deps = depsMap.get(key)
    if (!deps) {
      deps = new Set()
      depsMap.set(key, deps)
    }
    if (!deps.has(effect)) {
      deps.add(effect)
    }
  }
}
// 数据变化响应回调
function effect(fn) {
  // 1.异常处理
  // 2.执行函数
  // 3.放置到activeReativeEffectStack
  const rxEffect = function(...args) {
    try {
      activeReativeEffectStack.push(rxEffect)
      return fn(...args) // 执行函数触发依赖收集
    } finally {
      activeReativeEffectStack.pop()
    }  
  }

  rxEffect() // 默认立即执行
  return rxEffect
}


// 触发target.key对应响应函数
function trigger(target, type, key) {
  // 获取依赖表
  const depsMap = targetsMap.get(target)
  if (depsMap) {
    // 获取响应函数集合
    const deps = depsMap.get(key)
    const effects = new Set()
    if (deps) {
      // 执行所有响应函数
      deps.forEach(effect => {
        // effect()
        effects.add(effect)
      })
    }

    // 数组新增或删除
    if (type === 'ADD' || type === 'DELETE') {
      if (Array.isArray(target)) {
        const deps = depsMap.get('length')
        if (deps) {
          deps.forEach(effect => {
            effects.add(effect)
          })
        }
      }
    }
    // 获取已存在的Dep Set执行
    effects.forEach(effect => effect())
  }
}


const data = { foo: 'foo', bar: { a: 1 } }
const react = reactive(data)
// 1.获取
// react.foo // ok
// 2.设置已存在属性
// react.foo = 'foooooooo'
// 3.设置不存在属性
// react.baz = 'bazzzzzz'
// 4.嵌套对象
// react.bar.a = 10

// 避免重复代理
// console.log(reactive(data) === react) // true
// reactive(react)
effect(() => {
  console.log('count发生了变化：', react.foo)
  // dom
})
react.foo = 'fooooooo'
```

