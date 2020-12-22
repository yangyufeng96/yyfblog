---
type: blog
title: vue面试题（1）
categories:
  - 前端
tags:
  - 面试题
  - vue
abbrlink: f0a558a1
date: 2020-12-11 00:00:00
---

## Vue双向绑定实现原理？ 

vue实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty() 将它们转为 getter/setter。用户看不到 getter/setter，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。

vue的数据双向绑定 将MVVM作为数据绑定的入口，整合Observer，Compile和Watcher三者，通过Observer来监听自己的model的数据变化，通过Compile来解析编译模板指令（vue中是用来解析 双花括弧），最终利用watcher搭起observer和Compile之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果。

- Observer 对所有数据的属性进行监听
- Compile 对每个元素节点的指令进行扫描跟解析,根据指令模板替换数据,以及绑定相应的更新函数
- Watcher 作为连接Observer 跟 Compile 之间的桥梁, 能够订阅接收到每个属性变动的通知,执行相应的回调函数

代码理解: 

```js
const Dep = function() {
	this.subs = []
};
Dep.prototype = {
	addSub: function(sub) {
		this.subs.push(sub)
	},
	notify: function() {
		this.subs.forEach(sub = > {
			sub.update()
		})
	},
};
const Watcher = function(vm, node, name) {
	Dep.target = this;
	this.name = name;
	this.node = node;
	this.vm = vm;
	this.update();
	Dep.target = null
};
Watcher.prototype = {
	update: function() {
		this.get();
		this.node.nodeValue = this.value
	},
	get: function() {
		this.value = this.vm[this.name]
	},
};
const compile = function(node, vm) {
	if (node.nodeType === 1) {
		let attr = node.attributes;
		for (let i = 0; i < attr.length; i++) {
			if (attr[i].nodeName === 'v-model') {
				let name = attr[i].nodeValue;
				node.addEventListener('input', e = > {
					vm[name] = node.value
				});
				node.value = vm[name];
				node.removeAttribute('v-model')
			}
		}
	}
	if (node.nodeType === 3) {
		if (/\{\{(.*)\}\}/.test(node.nodeValue)) {
			let name = RegExp.$1;
			name = name.trim();
			node.nodeValue = vm[name];
			new Watcher(vm, node, name)
		}
	}
};
const observe = data = > {
	if (!data || typeof data !== 'object') return 3344;
	Object.keys(data).forEach(key = > defineReactive(data, key, data[key]))
};
const defineReactive = (data, key, value) = > {
	const dep = new Dep();
	observe(value);
	Object.defineProperty(data, key, {
		get: () = > {
			if (Dep.target) dep.addSub(Dep.target);
			return value
		},
		set: function(newValue) {
			console.log(`数据已发生变化，新的值为$ {
				newValue
			}`);
			value = newValue;
			dep.notify()
		},
	})
};

function nodeToFragment(node, vm) {
	let flag = document.createDocumentFragment();
	let child;
	while ((child = node.firstChild)) {
		compile(child, vm);
		flag.appendChild(child)
	}
	return flag
}
function Vue(options) {
	let data = this.data = options.data;
	observe(data, this);
	let id = options.el;
	let dom = nodeToFragment(document.getElementById(id), data);
	document.getElementById(id).appendChild(dom)
}
let vm = new Vue({
	el: 'app',
	data: {
		text: 'example text',
	},
});
```



 题目分析：双向绑定是vue的特色之一，开发中必然会用到的知识点，然而此题还问了实现原理，升级为深度考查。 

思路分析：3w1h

1. 给出双绑定义
2. 双绑带来的好处
3. 在哪使用双绑
4. 使用方式
5. 扩展：使用细节、原理实现描述

回答范例：

1. vue中双向绑定是一个指令v-model，可以绑定一个动态值到视图，同时视图中变化能改变该值。v-model是语法糖，默认情况下相当于:value和@input。
2. 使用v-model可以减少大量繁琐的事件处理代码，提高开发效率，代码可读性也更好
3. 通常在表单项上使用v-model
4. 原生的表单项可以直接使用v-model，自定义组件上如果要使用它需要在组件内绑定value并处理输入事件
5. 我做过测试，输出包含v-model模板的组件渲染函数，发现它会被转换为value属性的绑定以及一个事件监听，事件回调函数中会做相应变量更新操作，这说明神奇魔法实际上是vue的编译器完成的。

可能的追问：

1. v-model和sync修饰符有什么区别
2. 自定义组件使用v-model如果想要改变事件名或者属性名应该怎么做

 观察输出的渲染函数： 

```js
// <input type="text" v-model="foo">
_c('input', { 
  directives: [{ name: "model", rawName: "v-model", value: (foo), expression: "foo" }], 
  attrs: { "type": "text" }, 
  domProps: { "value": (foo) }, 
  on: { 
    "input": function ($event) { 
      if ($event.target.composing) return; 
      foo = $event.target.value 
    } 
  } 
})
```

```js
// <input type="checkbox" v-model="bar">
_c('input', { 
  directives: [{ name: "model", rawName: "v-model", value: (bar), expression: "bar" }], 
  attrs: { "type": "checkbox" }, 
  domProps: { 
    "checked": Array.isArray(bar) ? _i(bar, null) > -1 : (bar) 
  }, 
  on: { 
    "change": function ($event) { 
      var $$a = bar, $$el = $event.target, $$c = $$el.checked ? (true) : (false); 
      if (Array.isArray($$a)) { 
        var $$v = null, $$i = _i($$a, $$v); 
        if ($$el.checked) { $$i < 0 && (bar = $$a.concat([$$v])) } 
        else { 
          $$i > -1 && (bar = $$a.slice(0, $$i).concat($$a.slice($$i + 1))) } 
      } else { 
        bar = $$c 
      } 
    } 
  } 
})
```

```js
// <select v-model="baz">
//     <option value="vue">vue</option>
//     <option value="react">react</option>
// </select>
_c('select', { 
  directives: [{ name: "model", rawName: "v-model", value: (baz), expression: "baz" }], 
  on: { 
    "change": function ($event) { 
      var $$selectedVal = Array.prototype.filter.call(
        $event.target.options, 
        function (o) { return o.selected }
      ).map(
        function (o) { 
          var val = "_value" in o ? o._value : o.value; 
          return val 
        }
      ); 
      baz = $event.target.multiple ? $$selectedVal : $$selectedVal[0] 
    } 
  } 
}, [
  _c('option', { attrs: { "value": "vue" } }, [_v("vue")]), _v(" "), 
  _c('option', { attrs: { "value": "react" } }, [_v("react")])
])
```



<!--more-->

## Vue-router有几种模式？如何实现呢？ 

>  在vue-router中有两种模式 

- history
  history 为 HTML5 Api,提供了丰富的router 相关属性， 比如history.back() 就能轻松的做到页面回退
- hash
  hash router 有一个明显的标志是url 中带有#， 我们可以通过监听url中的hash来进行路由跳转

**如何实现**

 **history** 

 在代码实现前，我们先看看history几个api 

- history.pushState 浏览器历史纪录添加记录
- history.replaceState 修改浏览器历史纪录中当前纪录
- history.popState 当history 发生变化时触发

 在结合代码理解: 

```javascript
class Routers {
	contructor() {
		this.routes = {};
		this.listerPopState()
	}
	init(path) {
		history.replaceState({
			path: path
		}, null, path);
		this.routes[path] && this.routes[path]()
	}
	route(path, callback) {
		this.routes[path] = callback
	}
	push(path) {
		history.pushState({
			path: path
		}, null, path);
		this.routes[path] && this.routes[path]()
	}
	listerPopState() {
		window.addEventListener('popstate', e = > {
			const path = e.state && e.state.path;
			this.routers[path] && this.routers[path]()
		})
	}
}
window.VueRouter = new Routers();
VueRouter.route('/', () = > console.log('JS')) VueRouter.route('/detail', () = > console.log('JS每日一题')) VueRouter.push('/detail')
```

 **hash router** 

 上面说过我们可以通过监听url中的hash来进行路由跳转 

 结合代码理解: 

```javascript
class Routers {
	constructor() {
		this.routes = {};
		this.currentUrl = '';
		this.refresh = this.refresh.bind(this);
		window.addEventListener('load', this.refresh, false);
		window.addEventListener('hashchange', this.refresh, false)
	}
	route(path, callback) {
		this.routes[path] = callback
	}
	push() {
		this.currentUrl = location.hash.slice(1) || '/';
		this.routes[this.currentUrl] && this.routes[this.currentUrl]()
	}
}
window.VueRouter = new Routers();
VueRouter.route('/', () = > console.log('JS')) VueRouter.route('/detail', () = > console.log('JS每日一题')) VueRouter.push('/detail')
```

 工作中不必太过纠结使用哪种模式，hash模式url中会带有#号，破坏url整体的美观性, history 需要服务端支持rewrite, 否则刷新会出现404现象 

## vue中keepalive怎么理解？

>  说在前面: keep-alive是vue源码中实现的一个组件, 感兴趣的可以研究源码 https://github.com/vuejs/vue/blob/dev/src/core/components/keep-alive.js 

**什么是keepalive**

我们平时开发中, 总有部分组件没有必要多次init, 我们需要将组件进行持久化，使组件状态维持不变，在下一次展示时， 也不会进行重新init

keepalive音译过来就是保持活着, 所以在vue中我们可以使用keepalive来进行组件缓存

基本使用

```
// 被keepalive包含的组件会被进行缓存
< keep - alive > < component / > < /keep-alive>
```

 上面提到被keepalive包含的组件不会被再次init，也就意味着不会重走生命周期函数, 但是平常工作中很多业务场景是希望我们缓存的组件在再次渲染的能做一些事情,vue为keepalive提供了两个额外的hook 

- activated 当keepalive包含的组件再次渲染的时候触发
- deactivated 当keepalive包含的组件销毁的时候触发

 注: 2.1.0 版本后keepalive包含但被exclude排除的组件不会有以上两个hook 

**参数**

 keepalive可以接收3个属性做为参数进行匹配对应的组件进行缓存 

- include 包含的组件
- exclude 排除的组件
- max 缓存组件的最大值

其中include,exclude可以为字符，数组，以及正则表达式
max 类型为字符或者数字

代码理解

```javascript
// 只缓存组件name为a或者b的组件
<keep-alive include = "a,b" > 
   <component: is = "currentView" /> 
</keep-alive>
// 组件名为c的组件不缓存
<keep-alive exclude="c">
  <component:is="currentView"/ > 
</keep-alive>
// 如果同时使用include,exclude,那么exclude优先于include， 下面的例子也就是只缓存a组件
<keep-alive include="a,b"exclude="b">
  <component:is="currentView"/ >
</keep-alive>
// 如果缓存的组件超过了max设定的值5，那么将删除第一个缓存的组件
<keep-alive exclude="c"max="5">
  <component:is="currentView"/ > 
</keep-alive>
```

**配合router使用**

```js
<!-- template -->
// 意思就是$router.meta.keepAlive值为真是将组件进行缓存
<keep-alive>
	<router-view v-if="$router.meta.keepAlive">
</router-view>
<router-view v-if="!$router.meta.keepAlive"></router-view>

//router配置
new Router({
	routes: [{
		name: 'a',
		path: '/a',
		component: A,
		meta: {
			keepAlive: true
		}
	}, {
		name: 'b',
		path: '/b',
		component: B
	}]
})
```

**总结**

 keepalive是一个抽象组件，缓存vnode，缓存的组件不会被mounted，为此提供activated 和 deactivated 钩子函数, 使用props max 可以控制缓存组件个数 

##  Vue.use中都发生了什么？ 

> 源码地址: https://github.com/vuejs/vue/blob/dev/src/core/global-api/use.js 

**定义**

vue.use()往全局注入一个插件，供全局真接使用, 不需要单独引用

代码理解:

```js
import Router from 'vue-router'
// 入口文件全局注入vue-router, 从而可以在全局使用this.$route
Vue.use(Router)
如果不使用vue.use那么需在组件中使用都得单独引入
// a.vue
import Router from 'vue-router'
// b.vue
import Router from 'vue-router'
```

理解了其基本使用及作用，我们来看一下vue.use中都发生了什么

源码很少，所以直接摘抄了

```js
Vue.use = function(plugin: Function | Object) { // flow语法, 检测参数是否是函数或对象
    // 拿到已安装插件列表
	const installedPlugins = (this._installedPlugins || (this._installedPlugins = [])) 
    // 如果已经安装，直接跳出方法
    if (installedPlugins.indexOf(plugin) > -1) {
		return this
	}
    // additional parameters
     
	// 取vue.use() 传入的参数
	const args = toArray(arguments, 1) 
    
	// 将vue对象填充到第一位, 最后的结构为[vue,arg1,arg2,...]
    args.unshift(this) 
    // 判断插件是否有install方法，如果有执行install方法，如果没有直接把插件当install执行
    if (typeof plugin.install === 'function') {
		plugin.install.apply(plugin, args)
	} else if (typeof plugin === 'function') {
		plugin.apply(null, args)
	}
    // 注册完成填充至已安装列表，保证每个插件只安装一次
	installedPlugins.push(plugin) 
    return this
}
```

 结合代码理解 

```js
// 代码摘抄自elementui入口文件
实现上就是在install中执行了全局注册的操作
// index.js
const install = function(Vue, opts = {}) {
	locale.use(opts.locale);
	locale.i18n(opts.i18n);
	components.forEach(component = > {
		Vue.component(component.name, component)
	});...
}
export
default {
	version: '2.5.4',
	locale: locale.use,
	i18n: locale.i18n,
	install,
	CollapseTransition,
	Loading,
	...
}
//  main.js
import demo from './idnex'
vue.use(demo)
```

**总结**

 vue.use()为注册全局插件所用，接收函数或者一个包含install属性的对象为参数，如果参数带有install就执行install, 如果没有就直接将参数当install执行, 第一个参数始终为vue对象, 注册过的插件不会重新注册 

## 简述一下Vue.js的template编译过程？

 看一下整个流程 

[![r32sIK.jpg](https://s3.ax1x.com/2020/12/17/r32sIK.jpg)](https://imgchr.com/i/r32sIK)

 从上图中我们可以看到compile是从mount后开始进行中, 整体逻辑分为三个部分 

- 解析器(parse) - 将 `模板字符串` 转换成 `elementASTs`
- 优化器(optimize) - 对 `AST` 进行静态节点标记，主要用来做虚拟DOM的渲染优化
- 代码生成器(generate) - 使用 `elementASTs` 生成 `render` 函数代码字符串

**开始前先解释一下AST**

AST(abstract syntax tree 抽象语法树), 是源代码的抽象语法结构的树状表现形式

从代码上简单理解一下

```js
< div class = "name" > JS每日一题 < /div>
//转成AST后会得到如下格式
[{
	"type": "tag",
	"name": "div",
	"attribs": {
		"class": "name"
	},
	"children": [{
		"data": "JS每日一题",
		"type": "text",
		"next": null,
		"startIndex": 18,
		"prev": null,
		"parent": "[Circular ~.0]",
		"endIndex": 24
	}],
	"next": null,
	"startIndex": 0,
	"prev": null,
	"parent": null,
	"endIndex": 30
}]
```

 AST会经过generate得到render函数，render的返回值是VNode

> VNode的源码可以见    https://github.com/vuejs/vue/blob/8a2dbf50105ea729125a42fecfe2c2f0371d7836/src/core/vdom/vnode.js 

**解析器(parse)**

> 源码地址 https://github.com/vuejs/vue/blob/8a2dbf50105ea729125a42fecfe2c2f0371d7836/src/compiler/parser/index.js 

 parse 的目标是把 template 模板字符串转换成 AST 树，它是一种用 JavaScript 对象的形式来描述整个模板。那么整个 parse 的过程是利用正则表达式顺序解析模板，当解析到开始标签、闭合标签、文本的时候都会分别执行对应的回调函数，来达到构造 AST 树的目的 

**优化器(optimize)**

>  源码地址 https://github.com/vuejs/vue/blob/8a2dbf50105ea729125a42fecfe2c2f0371d7836/src/compiler/optimizer.js 

 通过 optimize 把整个 AST 树中的每一个 AST 元素节点标记了 static 和 staticRoot, optimize 的过程，就是深度遍历这个 AST 树，去检测它的每一颗子树是不是静态节点，如果是静态节点则它们生成 DOM 永远不需要改变 

**代码生成器(generate)**

> 源码地址  https://github.com/vuejs/vue/blob/8a2dbf50105ea729125a42fecfe2c2f0371d7836/src/compiler/codegen/index.js 

 把优化后的 AST 树转换成可执行的代码 

**总结**

 首先通过parse将template解析成AST,其次optimize对解析出来的AST进行标记，最后generate将优化后的AST转换成可执行的代码 

##  Vue中的nextTick如何理解，它是干什么的？ 

> 在vue中，数据发生变化之后DOM并不会立即变化，而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新 

 代码理解 

```js
this.name = 'JS每日一题' // 如这个绑定在某一个DOM元素上
console.log(this.$el.textContent) 
// 这时DOM还没有更新,所以不会得到文字JS每日一题
this.$nextTick(() = >console.log(this.$el.textContent)) 
// nextTick 是在DOM更新后执行，这里打印JS每日一题
```

**nextTick什么情况下会触发**

 在同一事件循环中的数据变化后，DOM更新完成, 执行nextTick(callback)内的回调 

 对事件循环不理解的可以点[这里](https://mp.weixin.qq.com/s?__biz=MzU1OTgxNDQ1Nw==&mid=2247483672&idx=1&sn=d7cf78506c258e6992f9637a107d35b9&scene=21#wechat_redirect) 

**vue中nextTick的实现**

> 源码地址 https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js 

```js
function flushCallbacks() {
  pending = false 
  
  // 复制一份callbacks  
  const copies = callbacks.slice(0) 
  // 清空callbacks
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    // 顺序执行nexttick传入的回调
    copies[i]()
  }
}
export
function nextTick(cb ? :Function, ctx ? :Object) {
  let _resolve 
  // 将回调压入callbacks
  callbacks.push(() = >{
    if (cb) {
      try {
        cb.call(ctx)
      } catch(e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  }) if (!pending) {
    pending = true 
    // timerFunc的源码较多，大致意思就是根据 useMacroTask 条件执行 macroTimerFunc 或者是 microTimerFunc，而它们都会在下一个 tick 执行 flushCallbacks，flushCallbacks 的逻辑非常简单，对 callbacks 遍历，然后执行相应的回调函数 (见上面的flushCallbacks方法)
    timerFunc()
  }
	// 如果nextTick不传cb,就为nextTick提供一个promise调用 如: nextTick().then(()=> {})
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve = >{
      _resolve = resolve
    })
  }
}
```

**总结**

 数据的变化到 DOM 的重新渲染是一个异步过程, 我们必须在 nextTick 后执行DOM相关的操作 

 这道题考查大家对vue异步更新队列的理解，有一定深度，如果能够很好回答此题，对面试效果有极大帮助 

答题思路：

1. nextTick是啥？下一个定义
2. 为什么需要它呢？用异步更新队列实现原理解释
3. 我再什么地方用它呢？抓抓头，想想你在平时开发中使用它的地方
4. 下面介绍一下如何使用nextTick
5. 最后能说出源码实现就会显得你格外优秀

 先看看官方定义 

>Vue.nextTick( [callback, context] )
>
>在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
>
>```js
>// 修改数据
>vm.msg = 'Hello'
>// DOM 还没有更新
>Vue.nextTick(function () {
>// DOM 更新了
>})
>```
>
>

 回答范例： 

1. nextTick是Vue提供的一个全局API，由于vue的异步更新策略导致我们对数据的修改不会立刻体现在dom变化上，此时如果想要立即获取更新后的dom状态，就需要使用这个方法
2. Vue 在更新 DOM 时是**异步**执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。nextTick方法会在队列中加入一个回调函数，确保该函数在前面的dom操作完成后才调用。
3. 所以当我们想在修改数据后立即看到dom执行结果就需要用到nextTick方法。
4. 比如，我在干什么的时候就会使用nextTick，传一个回调函数进去，在里面执行dom操作即可。
5. 我也有简单了解nextTick实现，它会在callbacks里面加入我们传入的函数，然后用timerFunc异步方式调用它们，首选的异步方式会是Promise。这让我明白了为什么可以在nextTick中看到dom操作结果。

## nextTick实现原理?

 此题属于原理题目，能够体现面试者对vue理解深度，答好了会加分很多。 

答题思路：

1. 此题实际考查vue异步更新策略
2. 说出vue是怎么通过异步、批量的方式更新以提高性能的
3. 最后把源码中实现说一下

回答范例：

1. vue有个批量、异步更新策略，数据变化时，vue开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。然后在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

   > [官方文档在这里](https://cn.vuejs.org/v2/guide/reactivity.html#异步更新队列)

2. 源码中，修改一个数据，组件对应的watcher会尝试入队:

```js
queue.push(watcher)
```

 并使用nextTick方法添加一个flushSchedulerQueue回调 

```js
nextTick(flushSchedulerQueue)
```

 flushSchedulerQueue被加入callbacks数组 

```js
callbacks.push(() => {
  if (cb) {
    try {
      cb.call(ctx) // cb就是加入的回调
    } catch (e) {
      handleError(e, ctx, 'nextTick')
    }
  } 
})
```

 然后以异步方式启动 

```js
if (!pending) {
  pending = true
  timerFunc()
}
```

 timerFunc的异步主要利用Promise等微任务方式实现 

```js
let timerFunc

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  // timerFunc利用p.then向微任务队列添加一个flushCallbacks
  // 会异步调用flushCallbacks
  timerFunc = () => {
    p.then(flushCallbacks)
  }
  isUsingMicroTask = true
}
```

 flushCallbacks遍历callbacks，执行里面所有回调 

```js
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

 其中就有前面加入的flushSchedulerQueue，它主要用于执行queue中所有watcher的run方法，从而使组件们更新 

```js
for (index = 0; index < queue.length; index++) {
  watcher = queue[index]
  watcher.run()
}
```

可能的追问

 你平时什么时候会用到nextTick？ 